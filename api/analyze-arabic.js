import { analyzeBasicArabic } from '../src/lib/arabic-grammar.js';
import { analyzeArabic, arabicLetter } from '../src/lib/arabic-parser.js';

const maxTextLength = 800;
const maxBodyLength = 8192;

function json(body, status = 200, headers = {}) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', ...headers },
  });
}

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return json({ error: 'Submit Arabic text to start an analysis.' }, 405, { Allow: 'POST' });
    }
    if (request.headers.get('sec-fetch-site') === 'cross-site') {
      return json({ error: 'Open the analyzer from the portfolio to continue.' }, 403);
    }
    const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
    if (contentType !== 'application/json') {
      return json({ error: 'Submit text from the analyzer to continue.' }, 415);
    }
    if (Number(request.headers.get('content-length')) > maxBodyLength) {
      return json({ error: `Enter up to ${maxTextLength} characters.` }, 413);
    }

    let input;
    try {
      const body = await request.text();
      if (body.length > maxBodyLength) {
        return json({ error: `Enter up to ${maxTextLength} characters.` }, 413);
      }
      input = JSON.parse(body);
    } catch {
      return json({ error: 'Enter valid Arabic text to analyze.' }, 400);
    }
    const text = typeof input?.text === 'string' ? input.text.trim() : '';
    if (text.length > maxTextLength) {
      return json({ error: `Enter up to ${maxTextLength} characters.` }, 400);
    }
    if (!arabicLetter.test(text)) {
      return json({ error: 'Enter an Arabic sentence to analyze.' }, 400);
    }

    const basicAnalysis = analyzeBasicArabic(text);
    if (basicAnalysis) return json({ analysis: basicAnalysis, mode: 'basic' });

    try {
      const analysis = await analyzeArabic(text, request.signal);
      return json({ analysis, mode: 'estimated' });
    } catch (error) {
      if (!request.signal.aborted) console.error('Arabic parser failed:', error.code ?? error.name);
      return json({ error: 'The analyzer is temporarily unavailable. Please try again.' }, 503);
    }
  },
};
