import { analyzeBasicArabic } from '../src/lib/arabic-grammar.js';
import { analyzeWithGemini, arabicWords } from '../src/lib/arabic-gemini.js';

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
    const words = arabicWords(text);
    if (words.length === 0) {
      return json({ error: 'Enter an Arabic sentence to analyze.' }, 400);
    }

    const key = process.env.GEMINI_API_KEY?.trim();
    if (key) {
      const result = await analyzeWithGemini(text, words, key, request.signal);
      if (result.analysis) return json({ analysis: result.analysis, mode: 'contextual' });
      if (!request.signal.aborted) console.warn('Gemini Arabic analysis failed', result.failure, result.status);
    }

    const basicAnalysis = analyzeBasicArabic(text);
    if (basicAnalysis) return json({ analysis: basicAnalysis, mode: 'basic' });
    return json({ error: 'Full analysis is temporarily unavailable. Please try again later.' }, 503);
  },
};
