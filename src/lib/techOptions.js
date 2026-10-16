// خيارات التقنيات: الرمز يُخزَّن في tech_stack، والتسمية تُعرض بلغة الواجهة.
// (القيم المخزَّنة إنجليزيّة. والنصّ العربيّ القديم تكتبه النوافذ المخبّأة أيّامًا بعد النشر، فيُطبَّع.)
// والأسماء مكرَّرة في api/chat.js (TECH_NAMES) لسياق رفيق — فعدّل الموضعين معاً.
export const TECH_OPTIONS = [
  { id: "html-css-js", label: { ar: "HTML و CSS و JavaScript", fr: "HTML, CSS et JavaScript", en: "HTML, CSS and JavaScript" } },
  { id: "react-vite", label: { ar: "React (مع Vite)", fr: "React (avec Vite)", en: "React (with Vite)" } },
  { id: "react-cra", label: { ar: "React (مع Create React App)", fr: "React (avec Create React App)", en: "React (with Create React App)" } },
  { id: "nextjs", label: { ar: "Next.js", fr: "Next.js", en: "Next.js" } },
  { id: "vue", label: { ar: "Vue.js", fr: "Vue.js", en: "Vue.js" } },
  { id: "react-native", label: { ar: "React Native (موبايل)", fr: "React Native (mobile)", en: "React Native (mobile)" } },
  { id: "flutter", label: { ar: "Flutter (موبايل)", fr: "Flutter (mobile)", en: "Flutter (mobile)" } },
  { id: "python", label: { ar: "Python (Django أو Flask)", fr: "Python (Django ou Flask)", en: "Python (Django or Flask)" } },
  { id: "unsure", label: { ar: "لست متأكّداً بعد", fr: "Je ne sais pas encore", en: "Not sure yet" } },
];

export const TECH_IDS = TECH_OPTIONS.map((o) => o.id);

// أيّ قيمة مخزَّنة ← رمزها: الرمز يبقى، والنصّ القديم بأيّ لغة يُعاد إلى رمزه
export function normalizeTech(value) {
  if (!value) return "unsure";
  if (TECH_IDS.includes(value)) return value;
  if (/متأك/.test(value)) return "unsure";
  const found = TECH_OPTIONS.find((o) => Object.values(o.label).includes(value));
  return found ? found.id : value;
}

// للعرض: تسمية الرمز بلغة الواجهة، وما ليس في القائمة يُعرض كما هو
export function techLabel(value, lang) {
  const o = TECH_OPTIONS.find((x) => x.id === normalizeTech(value));
  return o ? (o.label[lang] || o.label.ar) : value;
}