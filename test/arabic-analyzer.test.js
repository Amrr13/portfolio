import assert from 'node:assert/strict';
import test from 'node:test';
import handler from '../api/analyze-arabic.js';

function post(text) {
  return handler.fetch(new Request('https://portfolio.example/api/analyze-arabic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  }));
}

function configureKey(t, key) {
  const previousKey = process.env.GEMINI_API_KEY;
  if (key) process.env.GEMINI_API_KEY = key;
  else delete process.env.GEMINI_API_KEY;
  t.after(() => {
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
  });
}

function interaction(analysis) {
  return Response.json({
    status: 'completed',
    steps: [{ type: 'model_output', content: [{ type: 'text', text: JSON.stringify({ analysis }) }] }],
  });
}

test('uses Gemini for custom text and retains the original words', async (t) => {
  configureKey(t, 'test-key');
  const text = 'ذَهَبَتْ مَرْيَمُ للمدرسه!';
  const words = ['ذَهَبَتْ', 'مَرْيَمُ', 'للمدرسه'];
  const explanations = [
    'فعل ماضٍ مبني على الفتح، والتاء للتأنيث الساكنة.',
    'فاعل مرفوع بالضمة.',
    'اللام حرف جر، والمدرسة اسم مجرور بالكسرة. الصواب «للمدرسة».',
  ];
  const fetch = t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://generativelanguage.googleapis.com/v1beta/interactions');
    assert.equal(options.headers['x-goog-api-key'], 'test-key');
    const body = JSON.parse(options.body);
    assert.equal(body.store, false);
    assert.deepEqual(JSON.parse(body.input), { text, words: words.map((word, i) => ({ id: i + 1, word })) });
    return interaction(explanations.map((explanation, i) => ({ id: i + 1, explanation })));
  });
  const response = await post(text);
  assert.equal(fetch.mock.callCount(), 1);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    mode: 'contextual',
    analysis: words.map((word, i) => ({ word, explanation: explanations[i] })),
  });
});

test('rejects misaligned provider results', async (t) => {
  configureKey(t, 'test-key');
  t.mock.method(globalThis, 'fetch', async () => interaction([
    { id: 1, explanation: 'اسم.' },
    { id: 1, explanation: 'مبتدأ.' },
    { id: 3, explanation: 'نعت.' },
  ]));
  assert.equal((await post('انتشرت الأبحاث العلمية.')).status, 503);
});

test('corrects the reported sentence without a provider', async (t) => {
  configureKey(t);
  const response = await post('ذهبت مريم للمدرسه');
  assert.equal(response.status, 200);
  const { analysis, mode } = await response.json();
  assert.equal(mode, 'basic');
  assert.deepEqual(analysis.map(({ word }) => word), ['ذهبت', 'مريم', 'للمدرسه']);
  assert.match(analysis[0].explanation, /فعل ماض.*التاء للتأنيث/u);
  assert.match(analysis[1].explanation, /فاعل مرفوع/u);
  assert.match(analysis[2].explanation, /حرف جر.*اسم مجرور.*للمدرسة/u);
});

test('keeps first-person suffixes distinct from feminine endings', async (t) => {
  configureKey(t, 'test-key');
  t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 429 }));
  const response = await post('ذَهَبْتُ لِلْمَدْرَسَةِ');
  assert.equal(response.status, 200);
  const { analysis, mode } = await response.json();
  assert.equal(mode, 'basic');
  assert.match(analysis[0].explanation, /مبني على السكون.*تاء الفاعل/u);
});
