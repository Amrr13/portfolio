const model = 'reflection/beam-free';
const gateway = 'https://ai-gateway.vercel.sh/v1';
const pricingTtl = 60_000;
const arabicLetter = /(?=\p{Script=Arabic})\p{Letter}/u;
let freeUntil = 0;
let lastDiagnostic = 0;

function reportFailure(stage, upstreamStatus, error) {
  const diagnostic = { stage };
  if (Number.isInteger(upstreamStatus) && upstreamStatus >= 100 && upstreamStatus <= 599) {
    diagnostic.upstreamStatus = upstreamStatus;
  }
  for (const key of ['code', 'type']) {
    const value = error?.[key];
    if (typeof value === 'string' && /^[a-z0-9_-]{1,64}$/i.test(value)) diagnostic[key] = value;
  }
  const now = Date.now();
  if (now - lastDiagnostic >= pricingTtl) {
    lastDiagnostic = now;
    console.warn('Arabic analyzer gateway unavailable', diagnostic);
  }
  return diagnostic;
}

async function providerFailure(stage, response) {
  const body = await response.json().catch(() => null);
  return reportFailure(stage, response.status, body?.error);
}

async function checkFreeModel() {
  if (Date.now() < freeUntil) return null;

  try {
    const response = await fetch(`${gateway}/models/${model}`, {
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(3_000),
    });
    if (!response.ok) return providerFailure('catalog', response);
    const { id, pricing } = await response.json();
    const isZero = (value) => /^0(?:\.0+)?$/.test(String(value));
    if (
      id !== model ||
      !isZero(pricing?.input) ||
      !isZero(pricing?.output) ||
      !Object.values(pricing).every(isZero)
    ) {
      return reportFailure('catalog', response.status, { code: 'nonzero_or_unknown_price' });
    }

    freeUntil = Date.now() + pricingTtl;
    return null;
  } catch {
    return reportFailure('catalog');
  }
}

export function getGatewayToken(request) {
  return (
    process.env.AI_GATEWAY_API_KEY?.trim() ||
    process.env.VERCEL_OIDC_TOKEN?.trim() ||
    (process.env.VERCEL === '1' && request.headers.get('x-vercel-oidc-token')) ||
    null
  );
}

export async function analyzeWithGateway(text, instruction, token, requestSignal) {
  const words = (text.match(/(?:(?=\p{Script_Extensions=Arabic})[\p{L}\p{M}])+/gu) ?? [])
    .filter((word) => arabicLetter.test(word));
  if (!words.length) return { diagnostic: reportFailure('output') };
  const pricingFailure = await checkFreeModel();
  if (pricingFailure) return { diagnostic: pricingFailure };

  const signal = AbortSignal.any([AbortSignal.timeout(16_000), requestSignal]);
  try {
    const response = await fetch(`${gateway}/chat/completions`, {
      method: 'POST',
      redirect: 'error',
      signal,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: instruction + ' Return the explanations array with exactly one explanation per listed word, in list order. Treat joined particles and prefixes as part of their written word and explain them in the same entry.',
          },
          { role: 'user', content: JSON.stringify({ text, words }) },
        ],
        reasoning: { effort: 'low' },
        max_tokens: 6000,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'arabic_grammar_analysis',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              required: ['explanations'],
              properties: {
                explanations: {
                  type: 'array',
                  minItems: words.length,
                  maxItems: words.length,
                  items: { type: 'string' },
                },
              },
            },
          },
        },
      }),
    });
    if (!response.ok) return { diagnostic: await providerFailure('inference', response) };
    const result = await response.json().catch(() => null);
    const content = result?.choices?.[0]?.message?.content;
    if (typeof content !== 'string') return { diagnostic: reportFailure('output', response.status) };

    let explanations;
    try {
      explanations = JSON.parse(content)?.explanations;
    } catch {
      return { diagnostic: reportFailure('output', response.status) };
    }
    if (!Array.isArray(explanations) || explanations.length !== words.length) {
      return { diagnostic: reportFailure('output', response.status) };
    }
    const rows = [];
    for (const [index, word] of words.entries()) {
      const explanation = typeof explanations[index] === 'string' ? explanations[index].trim() : '';
      if (explanation.length > 500 || !arabicLetter.test(explanation)) {
        return { diagnostic: reportFailure('output', response.status) };
      }
      rows.push({ word, explanation });
    }
    return { analysis: rows };
  } catch {
    if (requestSignal.aborted) return {};
    return { diagnostic: reportFailure('inference', undefined, signal.aborted ? { code: 'timeout' } : undefined) };
  }
}
