import { execFile } from 'node:child_process';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
import { explainArabicToken } from './arabic-ud-labels.js';

export const arabicLetter = /(?=\p{Script=Arabic})\p{Letter}/u;
const removableMark = /[\u064B-\u0652\u0670ـ]/u;
const unresolved = 'لم يتضح الدور النحوي لهذه الكلمة في السياق.';
const runtime = resolve('vendor/udpipe');
const exec = promisify(execFile);
const executable = {
  linux: 'udpipe-linux-x64',
  win32: 'udpipe-windows-x64.exe',
}[process.platform];

function prepareInput(text) {
  const offsets = [0];
  let input = '';
  let position = 0;
  let codePoints = 0;
  for (const character of text) {
    if (!removableMark.test(character)) {
      input += character;
      codePoints += 1;
    }
    position += character.length;
    offsets[position] = codePoints;
  }

  const words = Array.from(text.matchAll(/[\p{Letter}\p{Mark}\p{Number}\p{Join_Control}]+/gu))
    .filter(([word]) => arabicLetter.test(word))
    .map(({ 0: word, index }) => ({
      word,
      start: offsets[index],
      end: offsets[index + word.length],
      parts: [],
    }));
  return { input, words };
}

async function runParser(input, signal) {
  if (!executable || process.arch !== 'x64') {
    throw new Error('Local Arabic parser requires a supported x64 runtime.');
  }
  signal?.throwIfAborted();
  const running = exec(resolve(runtime, executable), [
    '--tokenizer=ranges',
    '--tag',
    '--parse',
    resolve(runtime, 'arabic-pud.udpipe'),
  ], { timeout: 5000, maxBuffer: 512 * 1024, signal, windowsHide: true });
  // The child process promise reports spawn and exit errors for this pipe.
  running.child.stdin.on('error', () => {});
  running.child.stdin.end(input, 'utf8');
  const { stdout } = await running;
  return stdout;
}

function readSegments(output) {
  return output.trim().split(/\r?\n\r?\n/u).flatMap((sentence) => {
    const tokens = new Map();
    const ranges = new Map();
    for (const line of sentence.split(/\r?\n/u)) {
      if (line.startsWith('#')) continue;

      const [id, form, , upos, , features, head, deprel, , misc] = line.split('\t');
      const match = misc?.match(/(?:^|\|)TokenRange=(\d+):(\d+)/u);
      const range = match && { start: Number(match[1]), end: Number(match[2]) };
      if (id.includes('-') && range) {
        const [first, last] = id.split('-').map(Number);
        for (let part = first; part <= last; part += 1) ranges.set(String(part), range);
      }
      if (!/^\d+$/u.test(id)) continue;

      const feats = Object.fromEntries(
        (features === '_' ? [] : features.split('|')).map((feature) => feature.split('=')),
      );
      tokens.set(id, { form, upos, feats, head, deprel, range: range || ranges.get(id) });
    }

    return Array.from(tokens.values())
      .filter((token) => token.range && arabicLetter.test(token.form))
      .map((token) => ({ ...token, parent: tokens.get(token.head) }));
  });
}

export async function analyzeArabic(text, signal) {
  const { input, words } = prepareInput(text);
  const segments = readSegments(await runParser(input, signal));
  for (const segment of segments) {
    const { start, end } = segment.range;
    const word = words.find((candidate) => candidate.start < end && candidate.end > start);
    if (word) word.parts.push(segment);
  }
  if (!words.some(({ parts }) => parts.length)) {
    throw new Error('Arabic parser returned no usable tokens.');
  }

  return words.map(({ word, parts }) => ({
    word,
    explanation: parts.map((token) => {
      const label = parts.length > 1 ? `«${token.form}»\u00a0` : '';
      return label + explainArabicToken(token, token.parent, parts.length === 1 ? word : undefined);
    }).join(' ') || unresolved,
  }));
}
