const nouns = new Map();

function registerNouns(words, gender, options = {}) {
  for (const word of words.split(' ')) nouns.set(word, { gender, ...options });
}

registerNouns('طالب تلميذ ولد طفل رجل معلم مدرس مهندس طبيب صديق أب أخ عامل مزارع قارئ كاتب قط أسد طائر', 'masculine', { animate: true });
registerNouns('طالبة تلميذة بنت طفلة امرأة معلمة مدرسة مهندسة طبيبة صديقة أم أخت عاملة مزارعة قارئة كاتبة قطة لبؤة', 'feminine', { animate: true });
registerNouns('كتاب قلم درس بيت فصل صف باب دفتر كرسي مطر علم نور قمر نجم ماء طعام عصير حليب خبر عمل سؤال جواب مكتب طريق هاتف سوق مسجد بحر حاسوب تفاح خبز قميص جبل ملعب', 'masculine');
registerNouns('شمس سماء تفاحة رسالة قصة صحيفة مجلة حقيبة طاولة شجرة زهرة سيارة مدينة حديقة غرفة نافذة سبورة جامعة كرة أرض ساعة ورقة صورة مكتبة قرية مدرسة', 'feminine');
registerNouns('محمد خالد سعيد محمود حسن علي كريم', 'masculine', { proper: true, animate: true });
registerNouns('أحمد عمر يوسف إبراهيم', 'masculine', { proper: true, animate: true, diptote: true });
registerNouns('مريم فاطمة زينب سارة عائشة', 'feminine', { proper: true, animate: true, diptote: true });

const adjectives = new Map();
for (const word of 'مجتهد سعيد جميل كبير صغير نظيف مفيد سهل صعب طويل قصير سريع قريب بعيد جديد قديم مفتوح مغلق بارد دافئ هادئ رائع مشرق واسع لطيف ممتاز ذكي نشيط كريم'.split(' ')) {
  adjectives.set(word, 'masculine');
  adjectives.set(`${word}ة`, 'feminine');
}
adjectives.set('بطيء', 'masculine');
adjectives.set('بطيئة', 'feminine');
adjectives.set('صافية', 'feminine');

const pronouns = new Map([
  ['أنا', 'first'],
  ['نحن', 'firstPlural'],
  ['أنت', 'second'],
  ['هو', 'masculine'],
  ['هي', 'feminine'],
]);
const prepositions = new Set(['إلى', 'في', 'على', 'من', 'عن']);
const locations = new Set(['أمام', 'خلف', 'تحت', 'فوق', 'عند']);

const verbs = new Map();
function registerVerb(word, verb, tense, person) {
  const readings = verbs.get(word) ?? [];
  readings.push({ ...verb, tense, person });
  verbs.set(word, readings);
}

for (const [past, present, transitive, allowsInanimate = false] of [
  ['قرأ', 'يقرأ', true],
  ['كتب', 'يكتب', true],
  ['شرب', 'يشرب', true],
  ['أكل', 'يأكل', true],
  ['فتح', 'يفتح', true],
  ['أغلق', 'يغلق', true],
  ['حمل', 'يحمل', true],
  ['رسم', 'يرسم', true],
  ['سمع', 'يسمع', true],
  ['حفظ', 'يحفظ', true],
  ['فهم', 'يفهم', true],
  ['درس', 'يدرس', true],
  ['غسل', 'يغسل', true],
  ['زرع', 'يزرع', true],
  ['شاهد', 'يشاهد', true],
  ['ساعد', 'يساعد', true],
  ['ذهب', 'يذهب', false],
  ['جلس', 'يجلس', false],
  ['خرج', 'يخرج', false],
  ['دخل', 'يدخل', false],
  ['رجع', 'يرجع', false],
  ['نام', 'ينام', false],
  ['لعب', 'يلعب', false],
  ['نجح', 'ينجح', false],
  ['وقف', 'يقف', false],
  ['سقط', 'يسقط', false, true],
  ['أشرق', 'يشرق', false, true],
  ['ظهر', 'يظهر', false, true],
]) {
  const stem = present.slice(1);
  const verb = { transitive, allowsInanimate };
  registerVerb(past, verb, 'past', 'masculine');
  registerVerb(`${past}ت`, verb, 'past', 'feminine');
  registerVerb(present, verb, 'present', 'masculine');
  registerVerb(`ت${stem}`, verb, 'present', 'feminine');
  registerVerb(past === 'أكل' ? 'آكل' : `أ${stem}`, verb, 'present', 'first');
  registerVerb(`ن${stem}`, verb, 'present', 'firstPlural');
}

const nounRoles = {
  topic: ['مبتدأ', 'مرفوع', 'ُ', 'الضمة'],
  predicate: ['خبر', 'مرفوع', 'ُ', 'الضمة'],
  subject: ['فاعل', 'مرفوع', 'ُ', 'الضمة'],
  object: ['مفعول به', 'منصوب', 'َ', 'الفتحة'],
  preposition: ['اسم', 'مجرور', 'ِ', 'الكسرة'],
  location: ['مضاف إليه', 'مجرور', 'ِ', 'الكسرة'],
};

function tokenize(text) {
  const sentence = text.normalize('NFC').trim().replace(/[.!?؟]+$/u, '').trim();
  const words = sentence.split(/\s+/u);
  if (words.length < 2 || words.length > 6) return null;
  if (words.some((word) => !/^(?:(?=\p{Script=Arabic})\p{Letter}|[\u064B-\u0652])+$/u.test(word))) return null;

  return words.map((word) => ({
    word,
    plain: word.replace(/[\u064B-\u0652ـ]/gu, ''),
    ending: word.match(/([ًٌٍَُِ])ّ?$/u)?.[1] ?? (word.endsWith('ًا') ? 'ً' : ''),
  }));
}

function nounFor(token, role, acceptsAdjective = false) {
  const definite = token.plain.startsWith('ال');
  let key = definite ? token.plain.slice(2) : token.plain;
  let noun = nouns.get(key);
  if (role === 'object' && !noun && !definite && key.endsWith('ا')) {
    key = key.slice(0, -1);
    noun = nouns.get(key);
  }
  if (acceptsAdjective && !definite && adjectives.has(key)) {
    return { gender: adjectives.get(key), definite, adjective: true };
  }
  if (!noun || (definite && noun.proper)) return null;
  return { ...noun, definite: definite || noun.proper };
}

function row(token, explanation) {
  return { word: token.word, explanation };
}

function nounRow(token, noun, role) {
  const [label, grammaticalCase, vowel, marker] = nounRoles[role];
  const diptoteGenitive = noun.diptote && vowel === 'ِ';
  const expectedVowel = diptoteGenitive ? 'َ' : vowel;
  const tanween = { 'ً': 'َ', 'ٌ': 'ُ', 'ٍ': 'ِ' };
  if (token.ending && (tanween[token.ending] ?? token.ending) !== expectedVowel) return null;
  if (((noun.definite && !noun.proper) || noun.diptote) && tanween[token.ending]) return null;
  const ending = diptoteGenitive ? 'الفتحة نيابةً عن الكسرة لأنه ممنوع من الصرف' : `${marker} الظاهرة على آخره`;
  return row(token, `${label} ${grammaticalCase} وعلامة ${vowel === 'ُ' ? 'رفعه' : vowel === 'َ' ? 'نصبه' : 'جره'} ${ending}.`);
}

function prepositionalPhrase(words, predicate) {
  if (words.length !== 2) return null;
  const [particle, complement] = words;
  const isPreposition = prepositions.has(particle.plain);
  if (!isPreposition && !locations.has(particle.plain)) return null;
  const noun = nounFor(complement, isPreposition ? 'preposition' : 'location');
  if (!noun || (!isPreposition && (!noun.definite || (particle.ending && particle.ending !== 'َ')))) return null;
  const nounAnalysis = nounRow(complement, noun, isPreposition ? 'preposition' : 'location');
  if (!nounAnalysis) return null;
  const explanation = isPreposition
    ? 'حرف جر.'
    : 'ظرف مكان منصوب بالفتحة، وهو مضاف.';
  return [row(particle, predicate ? `${explanation} وشبه الجملة في محل رفع خبر.` : explanation), nounAnalysis];
}

function verbalPhrase(words, verb, person, explicitSubject) {
  const [verbToken, ...rest] = words;
  if (verb.person !== person && !(person === 'second' && verb.tense === 'present' && verb.person === 'feminine')) return null;
  if (verb.tense === 'present' && verbToken.ending && verbToken.ending !== 'ُ') return null;
  if (verb.tense === 'past' && verb.person === 'masculine' && verbToken.ending && verbToken.ending !== 'َ') return null;
  if (verb.tense === 'past' && verb.person === 'feminine' && verbToken.ending) return null;

  const verbExplanation = verb.tense === 'present'
    ? 'فعل مضارع مرفوع وعلامة رفعه الضمة الظاهرة على آخره.'
    : 'فعل ماضٍ مبني على الفتح.';
  const feminineMarker = verb.tense === 'past' && verb.person === 'feminine'
    ? ' والتاء للتأنيث، حرف مبني لا محل له من الإعراب.'
    : '';
  const implicit = {
    first: 'أنا',
    firstPlural: 'نحن',
    second: 'أنت',
    masculine: 'هو',
    feminine: 'هي',
  };
  const rows = [row(verbToken, verbExplanation + feminineMarker + (explicitSubject ? '' : ` والفاعل ضمير مستتر تقديره «${implicit[person]}».`))];
  if (!rest.length) return rows;

  if (verb.transitive && (rest.length === 1 || rest.length === 3)) {
    const object = nounFor(rest[0], 'object');
    const objectRow = object && nounRow(rest[0], object, 'object');
    if (!objectRow) return null;
    if (rest.length === 1) return [...rows, objectRow];
    const phrase = prepositionalPhrase(rest.slice(1), false);
    return phrase && [...rows, objectRow, ...phrase];
  }
  const phrase = prepositionalPhrase(rest, false);
  return phrase && [...rows, ...phrase];
}

export function analyzeBasicArabic(text) {
  const words = tokenize(text);
  if (!words) return null;
  const [first, second, ...tail] = words;
  const initialVerbs = verbs.get(first.plain) ?? [];
  const explicitSubject = nounFor(second, 'subject');
  for (const verb of initialVerbs) {
    if (explicitSubject && (explicitSubject.animate || verb.allowsInanimate)) {
      const subjectRow = nounRow(second, explicitSubject, 'subject');
      const phrase = verbalPhrase([first, ...tail], verb, explicitSubject.gender, true);
      if (subjectRow && phrase) return [phrase[0], subjectRow, ...phrase.slice(1)];
    }
    if ((verb.person === 'first' || verb.person === 'firstPlural') && (initialVerbs.length === 1 || first.ending === 'ُ')) {
      const phrase = verbalPhrase(words, verb, verb.person, false);
      if (phrase) return phrase;
    }
  }

  const pronoun = pronouns.get(first.plain);
  const topic = nounFor(first, 'topic');
  const topicRow = pronoun
    ? row(first, 'ضمير منفصل مبني في محل رفع مبتدأ.')
    : topic?.definite && nounRow(first, topic, 'topic');
  if (!topicRow) return null;

  if (!(pronoun === 'second' && first.ending === 'ِ')) {
    for (const predicateVerb of verbs.get(second.plain) ?? []) {
      const phrase = verbalPhrase(words.slice(1), predicateVerb, pronoun ?? topic.gender, false);
      if (phrase) {
        phrase[0].explanation += ' والجملة الفعلية في محل رفع خبر.';
        return [topicRow, ...phrase];
      }
    }
  }
  const phrase = prepositionalPhrase(words.slice(1), true);
  if (phrase) return [topicRow, ...phrase];
  if (words.length !== 2) return null;

  const predicate = nounFor(second, 'predicate', true);
  const topicGender = topic?.gender ?? (pronoun === 'second' && first.ending === 'ِ' ? 'feminine' : pronoun);
  const singularGender = topicGender === 'masculine' || topicGender === 'feminine';
  if (!predicate || predicate.definite || pronoun === 'firstPlural') return null;
  if (singularGender && (predicate.adjective || predicate.animate) && topicGender !== predicate.gender) return null;
  const predicateRow = nounRow(second, predicate, 'predicate');
  return predicateRow && [topicRow, predicateRow];
}
