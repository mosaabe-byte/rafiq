// api/models.js
// سجلّ النماذج المركزي لرفيق.
// الهدف: مرونة واستمرارية — تغيير نموذج أو إضافة أقوى يتمّ هنا فقط،
// دون لمس منطق المحادثة. الأسماء الودودة ثابتة، والنماذج خلفها تتطوّر مع الزمن.
//
// كل نموذج:
// - id: المعرّف الفعلي لدى Anthropic (يتغيّر مع الإصدارات — يُحدّث هنا فقط).
// - key: مفتاح ثابت نستعمله في الكود والواجهة (لا يتغيّر أبداً).
// - name: الاسم الودّي المعروض للمستخدم، ثلاثي اللغة.
// - tagline: وصف قصير لدوره، ثلاثي اللغة (متى يستعمله المستخدم).
// - dailyLimit: الحدّ اليومي لرسائل المستخدم بهذا النموذج.
// - maxTokens: أقصى طول للردّ.

export const MODELS = {
  fast: {
    key: "fast",
    id: "claude-haiku-4-5-20251001",
    name: {
      ar: "رفيق السريع",
      fr: "Rafiq Rapide",
      en: "Rafiq Fast",
    },
    tagline: {
      ar: "سريع وخفيف — للأسئلة اليومية والشرح والتوجيه",
      fr: "Rapide et léger — pour les questions quotidiennes, explications et orientation",
      en: "Fast and light — for daily questions, explanations, and guidance",
    },
    dailyLimit: 20,
    maxTokens: 2048,
  },

  deep: {
    key: "deep",
    id: "claude-sonnet-5",
    name: {
      ar: "رفيق العميق",
      fr: "Rafiq Profond",
      en: "Rafiq Deep",
    },
    tagline: {
      ar: "أقوى وأعمق — للمهامّ الصعبة: تصحيح الأخطاء المتشابكة، المراجعة الدقيقة، القرارات المعقّدة",
      fr: "Plus puissant et profond — pour les tâches difficiles : correction d'erreurs complexes, révision précise, décisions complexes",
      en: "Stronger and deeper — for hard tasks: untangling complex errors, precise review, complex decisions",
    },
    dailyLimit: 5,
    maxTokens: 4096,
  },
};

// النموذج الافتراضي (يُستعمل حين لا يختار المستخدم شيئاً).
// نُبقيه «السريع» للحفاظ على السلوك الحالي والتكلفة المتوازنة.
export const DEFAULT_MODEL_KEY = "fast";

// جلب نموذج بمفتاحه، مع الرجوع للافتراضي إن كان المفتاح غير صالح.
// هذا يحمي الخادم من أي مفتاح خاطئ أو قديم قادم من الواجهة.
export function getModel(key) {
  if (key && MODELS[key]) return MODELS[key];
  return MODELS[DEFAULT_MODEL_KEY];
}

// قائمة مبسّطة للنماذج (للواجهة): المفتاح والاسم والوصف والحدّ اليومي.
// لا نكشف المعرّف الفعلي (id) للواجهة — تفصيل خلفي يبقى في الخادم.
export function listModelsForUI() {
  return Object.values(MODELS).map((m) => ({
    key: m.key,
    name: m.name,
    tagline: m.tagline,
    dailyLimit: m.dailyLimit,
  }));
}