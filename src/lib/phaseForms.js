// استمارات المراحل: الأسئلة ونصوصها بلغاتها في مصدر واحد —
// تعرضها الاستمارة في «الطريق»، وتصوغ منها المحادثة الرسالة التي تصل إلى رفيق.
// والسؤال الذي له «column» جوابه في عمود المشروع نفسه، لا في الاستمارة: جواب واحد أينما عُدِّل.
export const pick = (obj, lang) => (obj && (obj[lang] || obj.ar)) || "";

const AUTH_PARTS = [
  { id: "signup", label: { ar: "التسجيل", fr: "Inscription", en: "Sign up" } },
  { id: "confirm", label: { ar: "تأكيد البريد", fr: "Confirmation de l'e-mail", en: "Email confirmation" } },
  { id: "resend", label: { ar: "إعادة إرسال رسالة التأكيد", fr: "Renvoi de l'e-mail de confirmation", en: "Resend confirmation email" } },
  { id: "login", label: { ar: "الدخول", fr: "Connexion", en: "Log in" } },
  { id: "session", label: { ar: "تذكّر الدخول وحماية الصفحات", fr: "Session et pages protégées", en: "Session and protected pages" } },
  { id: "logout", label: { ar: "الخروج", fr: "Déconnexion", en: "Log out" } },
  { id: "reset", label: { ar: "استعادة كلمة المرور", fr: "Mot de passe oublié", en: "Password reset" } },
  { id: "profile", label: { ar: "الملفّ الشخصيّ", fr: "Profil", en: "Profile" } },
  { id: "smtp", label: { ar: "بريد مخصّص قبل الإطلاق", fr: "E-mail dédié avant le lancement", en: "Dedicated email before launch" } },
];

export const PLANNING_FORM = {
  title: { ar: "📋 استمارة التخطيط", fr: "📋 Formulaire de planification", en: "📋 Planning form" },
  intro: {
    ar: "املأها متى شئت، ولو على دفعات: كلّ إجابة تُحفظ وأنت تكتب. وحين تكتمل، أرسلها إلى رفيق، فيبدأ من حيث انتهيت.",
    fr: "Remplissez-le quand vous voulez, même en plusieurs fois : chaque réponse est enregistrée. Une fois complet, envoyez-le à Rafiq.",
    en: "Fill it in whenever you like, even in several sittings: every answer is saved as you type. When it's complete, send it to Rafiq.",
  },
  questions: [
    { id: "idea", type: "textarea", required: true, label: { ar: "١. فكرة مشروعك في جملة واحدة", fr: "1. Votre idée en une phrase", en: "1. Your idea in one sentence" } },
    { id: "problem", type: "textarea", required: true, label: { ar: "٢. ما المشكلة التي يحلّها؟", fr: "2. Quel problème résout-il ?", en: "2. What problem does it solve?" } },
    { id: "users", column: "audience", type: "textarea", required: true, label: { ar: "٣. من سيستعمله؟", fr: "3. Qui va l'utiliser ?", en: "3. Who will use it?" } },
    { id: "features", type: "textarea", required: true, label: { ar: "٤. أهمّ ثلاث وظائف يجب أن يؤدّيها", fr: "4. Les trois fonctions essentielles", en: "4. The three essential features" } },
    { id: "vision", type: "textarea", required: true, label: { ar: "٥. كيف تتخيّل النتيجة؟ صِفها كأنّك ترسمها على ورقة", fr: "5. Comment imaginez-vous le résultat ? Décrivez-le comme un croquis", en: "5. How do you picture the result? Describe it like a sketch" } },
    {
      id: "device", column: "platform", type: "choice", label: { ar: "٦. ما نوعه؟", fr: "6. Quel type ?", en: "6. What kind?" },
      options: [
        { id: "web", label: { ar: "موقع ويب", fr: "Site web", en: "Website" } },
        { id: "mobile", label: { ar: "تطبيق هاتف", fr: "Application mobile", en: "Mobile app" } },
        { id: "both", label: { ar: "كلاهما", fr: "Les deux", en: "Both" } },
      ],
    },
    {
      id: "langs", type: "multi", label: { ar: "٧. بأيّ لغة أو لغات؟", fr: "7. En quelle(s) langue(s) ?", en: "7. In which language(s)?" },
      options: [
        { id: "ar", label: { ar: "العربيّة", fr: "Arabe", en: "Arabic" } },
        { id: "fr", label: { ar: "الفرنسيّة", fr: "Français", en: "French" } },
        { id: "en", label: { ar: "الإنجليزيّة", fr: "Anglais", en: "English" } },
      ],
    },
    {
      id: "accounts", type: "choice", label: { ar: "٨. هل فيه حسابات للمستخدمين؟", fr: "8. Y a-t-il des comptes utilisateurs ?", en: "8. Does it have user accounts?" },
      options: [
        { id: "yes", label: { ar: "نعم", fr: "Oui", en: "Yes" } },
        { id: "no", label: { ar: "لا", fr: "Non", en: "No" } },
      ],
    },
    { id: "worries", type: "textarea", label: { ar: "٩. ما الذي يقلقك أو لا تعرفه بعد؟", fr: "9. Qu'est-ce qui vous inquiète ou que vous ignorez encore ?", en: "9. What worries you, or what don't you know yet?" } },
  ],
  fromProject: { ar: "من بيانات المشروع: تعديله هنا يعدّله هناك", fr: "Issu des données du projet : le modifier ici le modifie partout", en: "From the project's details: editing it here updates it everywhere" },
  authHint: { ar: "اختر ما يُبنى الآن، وما لم تختره يُؤجَّل:", fr: "Cochez ce qui sera construit maintenant ; le reste sera reporté :", en: "Tick what gets built now; the rest is deferred:" },
  authParts: AUTH_PARTS,
  send: { ar: "أرسلها إلى رفيق", fr: "Envoyer à Rafiq", en: "Send to Rafiq" },
  needRequired: { ar: "أجب عن الأسئلة الخمسة الأولى، ثمّ أرسلها", fr: "Répondez aux cinq premières questions pour l'envoyer", en: "Answer the first five questions to send it" },
  saving: { ar: "يُحفَظ…", fr: "Enregistrement…", en: "Saving…" },
  saved: { ar: "حُفِظ", fr: "Enregistré", en: "Saved" },
  nowLabel: { ar: "يُبنى الآن", fr: "Maintenant", en: "Now" },
  laterLabel: { ar: "يُؤجَّل", fr: "Reporté", en: "Deferred" },
};

// أسئلة الأعمدة: تُقرأ من المشروع وتُكتب فيه
export const COLUMN_QUESTIONS = PLANNING_FORM.questions.filter((q) => q.column);

// يجمع إجابات الاستمارة مع أعمدة المشروع في كائن واحد
export function mergeWithProject(formAnswers, project) {
  const merged = { ...(formAnswers || {}) };
  for (const q of COLUMN_QUESTIONS) merged[q.id] = project?.[q.column] || "";
  return merged;
}

export function isFormReady(answers) {
  return PLANNING_FORM.questions.filter((q) => q.required).every((q) => String(answers?.[q.id] || "").trim());
}

// الرسالة التي تصل إلى رفيق — أوّلها «📋» ليعرف أنّها استمارة لا محادثة
export function formatPlanningForm(answers, lang) {
  const f = PLANNING_FORM;
  const lines = [pick(f.title, lang)];
  for (const q of f.questions) {
    const a = answers?.[q.id];
    let text = "";
    if (q.type === "textarea") text = String(a || "").trim();
    else if (q.type === "choice") text = pick(q.options.find((o) => o.id === a)?.label, lang);
    else if (q.type === "multi") text = (a || []).map((id) => pick(q.options.find((o) => o.id === id)?.label, lang)).join("، ");
    if (!text) continue;
    lines.push("", pick(q.label, lang), text);
    if (q.id === "accounts" && a === "yes") {
      const now = answers.authNow || [];
      const fmt = (parts) => parts.map((p) => pick(p.label, lang)).join("، ");
      const nowParts = f.authParts.filter((p) => now.includes(p.id));
      const laterParts = f.authParts.filter((p) => !now.includes(p.id));
      if (nowParts.length) lines.push(`${pick(f.nowLabel, lang)}: ${fmt(nowParts)}`);
      if (laterParts.length) lines.push(`${pick(f.laterLabel, lang)}: ${fmt(laterParts)}`);
    }
  }
  return lines.join("\n");
}