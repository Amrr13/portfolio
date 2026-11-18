const nounCases = {
  Nom: 'مرفوع بحسب التحليل',
  Acc: 'منصوب بحسب التحليل',
  Gen: 'مجرور بحسب التحليل',
};

const fixedCases = {
  Nom: 'في محل رفع بحسب التحليل',
  Acc: 'في محل نصب بحسب التحليل',
  Gen: 'في محل جر بحسب التحليل',
};

const moods = {
  Ind: 'مرفوع بحسب التحليل',
  Sub: 'منصوب بحسب التحليل',
  Jus: 'مجزوم بحسب التحليل',
};

const writtenEndings = {
  Nom: /[ٌُ]/u,
  Acc: /[ًَ]/u,
  Gen: /[ٍَِ]/u,
};

const lexicalTypes = {
  NOUN: 'اسم',
  PROPN: 'اسم علم',
  ADJ: 'صفة',
  PRON: 'ضمير',
  DET: 'اسم أو أداة تحديد',
  NUM: 'عدد',
  ADP: 'حرف جر',
  CCONJ: 'حرف عطف',
  SCONJ: 'أداة ربط بين الجمل',
  PART: 'أداة نحوية',
  ADV: 'ظرف أو قيد',
  INTJ: 'لفظ تعجب أو تنبيه',
  PUNCT: 'علامة ترقيم',
  SYM: 'رمز',
  X: 'كلمة لم يتحدد نوعها في التحليل',
};

const nounRelations = {
  obj: 'مفعول به',
  iobj: 'مفعول غير مباشر بحسب التحليل',
  amod: 'نعت للاسم المرتبط به',
  appos: 'تابع توضيحي للاسم السابق، قد يكون بدلًا أو عطف بيان',
  'nmod:poss': 'مضاف إليه يدل على الملكية',
  vocative: 'منادى',
  nummod: 'عدد مرتبط بالاسم الذي يبيّن كميته',
};

const sentenceRelations = {
  csubj: 'جملة تؤدي وظيفة المسند إليه',
  'csubj:pass': 'جملة تؤدي وظيفة نائب الفاعل بحسب التحليل',
  ccomp: 'جملة متممة للفعل أو التعبير المرتبط بها',
  xcomp: 'تعبير متمم يعتمد في معناه على الفعل المرتبط به',
  'acl:relcl': 'جزء من جملة صلة مرتبطة باسم سابق',
  acl: 'جزء من جملة تصف الاسم المرتبط بها',
  'advcl:pred': 'جزء من جملة حالية أو وصفية بحسب التحليل',
  advcl: 'جزء من جملة تبيّن ظرفًا أو قيدًا للجملة الرئيسية',
  parataxis: 'جزء من جملة مرتبطة بالجملة المجاورة',
  conj: 'معطوف على الكلمة أو الجملة المرتبط بها',
  cc: 'حرف عطف يربط بين كلمتين أو جملتين',
  case: 'أداة تحدّد العلاقة الإعرابية للاسم المرتبط بها',
  mark: 'أداة ربط أو أداة تؤثر في تركيب الجملة التالية',
  det: 'أداة تعريف أو تحديد للاسم المرتبط بها',
  discourse: 'لفظ لتنظيم الخطاب أو التنبيه',
  fixed: 'جزء من تعبير ثابت تُفسَّر أجزاؤه معًا',
  flat: 'جزء من اسم أو تعبير متعدد الكلمات',
  compound: 'جزء من تركيب مع الكلمة المرتبط بها',
  orphan: 'كلمة في تركيب حُذف أحد عناصره',
  dep: 'كلمة مرتبطة نحويًا بالكلمة المجاورة، دون تحديد موقع أدق',
};

const incompleteVerbs = new Set([
  'كان', 'كانت', 'يكون', 'تكون', 'ليس', 'ليست', 'أصبح', 'أصبحت',
  'أمسى', 'أمست', 'صار', 'صارت', 'ظل', 'ظلت', 'بات', 'باتت',
]);

function wordType(token) {
  const { upos, feats = {} } = token;
  if (feats.PronType === 'Rel') return 'اسم موصول';
  if (feats.PronType === 'Dem') return 'اسم إشارة';
  if (upos !== 'VERB' && upos !== 'AUX') return lexicalTypes[upos] ?? lexicalTypes.X;
  let kind = 'فعل';
  if (feats.Mood === 'Imp') kind = 'فعل أمر';
  else if (feats.Aspect === 'Perf' || feats.Tense === 'Past') kind = 'فعل ماضٍ';
  else if (feats.Aspect === 'Imp' || feats.Tense === 'Pres') kind = 'فعل مضارع';
  return feats.Voice === 'Pass' ? `${kind} مبني للمجهول` : kind;
}

function relationDescription(token, head) {
  const relation = token.deprel ?? '';
  const baseRelation = relation.split(':', 1)[0];
  const { upos, feats = {} } = token;
  const headIsVerb = head?.upos === 'VERB' || head?.upos === 'AUX';

  if (relation === 'nsubj:pass' || (baseRelation === 'nsubj' && head?.feats?.Voice === 'Pass')) return 'نائب فاعل';
  if (baseRelation === 'nsubj') return headIsVerb ? 'فاعل بحسب العلاقة النحوية' : 'مسند إليه في تركيب اسمي';
  if (relation === 'root') return upos === 'VERB' || upos === 'AUX' ? 'الفعل الرئيسي في الجملة' : 'مسند رئيسي تتم به دلالة الجملة';
  if (nounRelations[relation]) return nounRelations[relation];

  if (baseRelation === 'nmod') {
    return feats.Case === 'Gen'
      ? 'مرتبط باسم آخر؛ قد يكون مضافًا إليه أو مجرورًا بأداة'
      : 'اسم يكمّل الاسم المرتبط به';
  }
  if (baseRelation === 'obl') {
    return relation === 'obl:tmod'
      ? 'قيد زماني مرتبط بالفعل أو الجملة'
      : 'اسم يكمّل الفعل أو الجملة بعلاقة ظرفية أو جار ومجرور';
  }
  if (baseRelation === 'advmod') {
    return relation === 'advmod:emph'
      ? 'أداة توكيد بحسب التحليل'
      : 'قيد يبيّن زمنًا أو مكانًا أو كيفية أو معنى إضافيًا';
  }
  if (relation === 'cop') {
    const form = String(token.form ?? '').replace(/[\u064B-\u0652ـ]/gu, '');
    return incompleteVerbs.has(form)
      ? 'فعل ناقص يربط بين ركني الجملة الاسمية'
      : 'لفظ يربط بين ركني الجملة الاسمية';
  }
  if (baseRelation === 'aux') {
    return relation === 'aux:pass'
      ? 'فعل مساعد في تركيب مبني للمجهول'
      : 'فعل مساعد في التركيب الفعلي';
  }
  if (relation === 'case' && upos === 'ADP') return 'حرف جر للاسم المرتبط به';
  if (relation === 'punct' || upos === 'PUNCT') return '';
  return sentenceRelations[relation] ?? sentenceRelations[baseRelation] ?? '';
}

function caseDescription(token, originalWord) {
  const { upos, feats = {} } = token;
  if (upos === 'VERB' || upos === 'AUX') {
    return feats.Aspect === 'Imp' || feats.Tense === 'Pres' ? moods[feats.Mood] ?? '' : '';
  }
  if (upos === 'PRON' || feats.PronType === 'Rel' || feats.PronType === 'Dem') {
    return fixedCases[feats.Case] ?? '';
  }
  const writtenEnding = originalWord?.match(/([ًٌٍَُِ])ّ?$|([ً])ا$/u);
  const expectedEnding = writtenEndings[feats.Case];
  if (writtenEnding && expectedEnding && !expectedEnding.test(writtenEnding[1] ?? writtenEnding[2])) {
    return 'الحركة المكتوبة في آخر الكلمة لا توافق الإعراب المقدّر';
  }
  return ['NOUN', 'PROPN', 'ADJ', 'NUM'].includes(upos) ? nounCases[feats.Case] ?? '' : '';
}

export function explainArabicToken(token, head, originalWord) {
  const kind = wordType(token);
  const role = relationDescription(token, head);
  const grammaticalCase = caseDescription(token, originalWord);
  return [kind, role, grammaticalCase].filter(Boolean).join('، ') + '.';
}
