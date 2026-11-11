const model = 'reflection/beam-free';
const gateway = 'https://ai-gateway.vercel.sh/v1';
const pricingTtl = 60_000;
const arabicLetter = /(?=\p{Script=Arabic})\p{Letter}/u;
let freeUntil = 0;
let lastDiagnostic = 0;

function reportFailure(stage, status) {
  const now = Date.now();
  if (now - lastDiagnostic < pricingTtl) return;
  lastDiagnostic = now;
  console.warn('Arabic analyzer gateway unavailable', { stage, status });
}

async function isFreeModel() {
  if (Date.now() < freeUntil) return true;

  try {
    const response = await fetch(`${gateway}/models/${model}`, {
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(3_000),
    });
    if (!response.ok) {
      reportFailure('catalog', response.status);
      return false;
    }
    const { id, pricing } = await response.json();
    const isZero = (value) => /^0(?:\.0+)?$/.test(String(value));
    if (
      id !== model ||
      !isZero(pricing?.input) ||
      !isZero(pricing?.output) ||
      !Object.values(pricing).every(isZero)
    ) {
      reportFailure('pricing');
      return false;
    }

    freeUntil = Date.now() + pricingTtl;
    return true;
  } catch {
    reportFailure('catalog');
    return false;
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
  if (!words.length || !(await isFreeModel())) return null;

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
    if (!response.ok) {
      reportFailure('inference', response.status);
      return null;
    }
    const result = await response.json();
    const content = result?.choices?.[0]?.message?.content;
    if (typeof content !== 'string') {
      reportFailure('output');
      return null;
    }

    const explanations = JSON.parse(content)?.explanations;
    if (!Array.isArray(explanations) || explanations.length !== words.length) {
      reportFailure('output');
      return null;
    }
    const rows = [];
    for (const [index, word] of words.entries()) {
      const explanation = typeof explanations[index] === 'string' ? explanations[index].trim() : '';
      if (explanation.length > 500 || !arabicLetter.test(explanation)) {
        reportFailure('output');
        return null;
      }
      rows.push({ word, explanation });
    }
    return rows;
  } catch {
    if (!requestSignal.aborted) reportFailure(signal.aborted ? 'timeout' : 'inference');
    return null;
  }
}
