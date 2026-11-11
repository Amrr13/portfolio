import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { LoaderCircle, Sparkles } from 'lucide-react';

const maxLength = 400;
const examples = [
  {
    label: 'Read a book',
    words: [
      { word: 'قَرَأَ', role: 'Verb', explanation: 'A past-tense verb meaning “read.”' },
      { word: 'الطَّالِبُ', role: 'Subject', explanation: 'The student performs the action.' },
      { word: 'الكِتَابَ', role: 'Direct object', explanation: 'The book is what the student read.' },
    ],
  },
  {
    label: 'A clear sky',
    words: [
      { word: 'السَّمَاءُ', role: 'Subject', explanation: 'The sky is the topic of this nominal sentence.' },
      { word: 'صَافِيَةٌ', role: 'Predicate', explanation: 'The word “clear” tells us what the sky is like.' },
    ],
  },
  {
    label: 'Wrote a letter',
    words: [
      { word: 'كَتَبَتْ', role: 'Verb', explanation: 'A past-tense verb meaning “she wrote.”' },
      { word: 'مَرْيَمُ', role: 'Subject', explanation: 'Maryam is the person who wrote.' },
      { word: 'رِسَالَةً', role: 'Direct object', explanation: 'The letter is what Maryam wrote.' },
    ],
  },
].map((example) => ({ ...example, text: example.words.map(({ word }) => word).join(' ') }));

type Word = { word: string; explanation: string; role?: string };
type Result = { words: Word[]; sample: boolean };

function normalize(text: string) {
  return text.normalize('NFC').replace(/[\p{M}ـ]/gu, '').trim().replace(/[.!?؟]+$/, '').trim().replace(/\s+/g, ' ');
}

function isAnalysis(value: unknown): value is Word[] {
  return Array.isArray(value) && value.length > 0 && value.every(
    (row) => row && typeof row.word === 'string' && typeof row.explanation === 'string',
  );
}

export default function ArabicAnalyzer() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [activeWord, setActiveWord] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => request.current?.abort(), []);

  function reset(nextText: string) {
    request.current?.abort();
    setText(nextText);
    setResult(null);
    setMessage('');
    setLoading(false);
    setActiveWord(0);
  }

  function showExample(example: (typeof examples)[number]) {
    reset(example.text);
    setResult({ words: example.words, sample: true });
  }

  async function analyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    const sentence = text.trim();
    setMessage('');
    if (![...sentence].some((char) => /\p{Script=Arabic}/u.test(char) && /\p{L}/u.test(char))) {
      setMessage('Enter a sentence in Arabic or choose an example below.');
      return;
    }

    const example = examples.find((item) => normalize(item.text) === normalize(sentence));
    if (example) {
      showExample(example);
      return;
    }

    const controller = new AbortController();
    request.current = controller;
    setResult(null);
    setActiveWord(0);
    setLoading(true);
    try {
      const response = await fetch('/api/analyze-arabic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sentence }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Analysis unavailable');
      const { analysis } = await response.json();
      if (!isAnalysis(analysis)) throw new Error('No analysis returned');
      if (!controller.signal.aborted) setResult({ words: analysis, sample: false });
    } catch {
      if (!controller.signal.aborted) {
        setMessage('Custom text is unavailable right now. You can still try an example below.');
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }

  const selected = result?.words[activeWord];

  return (
    <div className="example">
      <div className="example-head">
        <Sparkles size={18} aria-hidden="true" />
        <h3>Try the analyzer</h3>
      </div>
      <form className="analyzer-form" onSubmit={analyze}>
        <label htmlFor="arabic-sentence">Enter an Arabic sentence</label>
        <textarea
          id="arabic-sentence"
          lang="ar"
          dir="rtl"
          value={text}
          onChange={(event) => reset(event.target.value)}
          placeholder="اكتب جملة عربية هنا"
          maxLength={maxLength}
          rows={2}
        />
        <button className="button primary" type="submit" disabled={loading || !text.trim()}>
          {loading && <LoaderCircle className="analyzer-spinner" size={17} aria-hidden="true" />}
          {loading ? 'Analyzing…' : 'Analyze sentence'}
        </button>
        <p className="analyzer-status" role="status">{message || (loading ? 'Analyzing the sentence.' : '')}</p>
      </form>
      <div className="example-options" role="group" aria-label="Try an example sentence">
        {examples.map((example) => (
          <button key={example.label} type="button" aria-pressed={result?.sample === true && text === example.text} onClick={() => showExample(example)}>
            {example.label}
          </button>
        ))}
      </div>
      {result && selected && (
        <>
          <p className="example-hint">Select a word to see its grammatical role.</p>
          <div className="example-words" lang="ar" dir="rtl">
            {result.words.map(({ word }, index) => (
              <button key={`${index}-${word}`} type="button" aria-pressed={activeWord === index} onClick={() => setActiveWord(index)}>
                {word}
              </button>
            ))}
          </div>
          <div className="example-result" aria-live="polite" lang={result.sample ? 'en' : 'ar'} dir={result.sample ? 'ltr' : 'rtl'}>
            <div key={activeWord}>{selected.role && <strong>{selected.role}</strong>}<p>{selected.explanation}</p></div>
          </div>
        </>
      )}
    </div>
  );
}
