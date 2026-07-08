// بوّابة الجودة — أسئلة مراجعة ذاتية قبل نشر المشروع
// كل سؤال ثلاثي اللغة، مربوط بمبدأ تعلّمه المستخدم في الرحلة.
// الروح: تعليم المراجعة الذاتية كمطوّر محترف، لا امتحان. النتيجة صادقة تعكس الواقع.

// دالة مساعدة لجلب الحقل حسب اللغة (نفس نمط المحتوى في التطبيق)
export function tf(field, lang) {
  if (!field) return '';
  return field[lang] || field.ar || '';
}

// مقدّمة الصفحة
export const gateIntro = {
  title: {
    ar: 'بوّابة الجودة',
    fr: 'La porte de la qualité',
    en: 'The Quality Gate',
  },
  subtitle: {
    ar: 'قبل أن تنشر مشروعك للعالم، راجعه بعين المطوّر المحترف',
    fr: "Avant de publier votre projet au monde, révisez-le avec l'œil du développeur professionnel",
    en: 'Before publishing your project to the world, review it with a professional developer\'s eye',
  },
  intro: {
    ar: 'المطوّر المحترف لا ينشر مشروعه فور أن «يعمل» — بل يراجعه أولاً. هذه البوّابة قائمة فحص تسألك عن جوانب مشروعك المهمّة. أجب بصدق: النتيجة تعكس إجاباتك الحقيقية، لا رقماً مجاملاً. الهدف ليس درجة، بل أن تتعلّم مراجعة عملك بنفسك — أثمن مهارة يملكها المطوّر.',
    fr: "Le développeur professionnel ne publie pas son projet dès qu'il « fonctionne » — il le révise d'abord. Cette porte est une liste de vérification qui vous interroge sur les aspects importants de votre projet. Répondez honnêtement : le résultat reflète vos vraies réponses, pas un chiffre flatteur. Le but n'est pas une note, mais d'apprendre à réviser votre travail vous-même — la compétence la plus précieuse du développeur.",
    en: "A professional developer doesn't publish their project the moment it \"works\" — they review it first. This gate is a checklist that asks you about your project's important aspects. Answer honestly: the result reflects your real answers, not a flattering number. The goal isn't a grade, but to learn to review your own work — the most precious skill a developer has.",
  },
};

// نصوص الواجهة
export const gateUI = {
  yes: { ar: 'نعم', fr: 'Oui', en: 'Yes' },
  no: { ar: 'لا', fr: 'Non', en: 'No' },
  na: { ar: 'لا ينطبق', fr: 'N/A', en: 'N/A' },
  compute: { ar: 'احسب جاهزيتي', fr: 'Calculer ma préparation', en: 'Compute my readiness' },
  recompute: { ar: 'أعد الحساب', fr: 'Recalculer', en: 'Recompute' },
  reset: { ar: 'ابدأ من جديد', fr: 'Recommencer', en: 'Start over' },
  resultTitle: { ar: 'نتيجتك الصادقة', fr: 'Votre résultat honnête', en: 'Your honest result' },
  answered: { ar: 'أجبت عن', fr: 'Vous avez répondu à', en: 'You answered' },
  ofQuestions: { ar: 'من الأسئلة', fr: 'des questions', en: 'of the questions' },
  toImprove: { ar: 'ما يستحقّ تحسينك', fr: 'Ce qui mérite votre amélioration', en: 'What deserves your improvement' },
  allGood: {
    ar: 'أحسنت! راجعت كل الجوانب المهمّة. مشروعك يبدو جاهزاً — انشره بثقة.',
    fr: 'Bravo ! Vous avez révisé tous les aspects importants. Votre projet semble prêt — publiez-le avec confiance.',
    en: 'Well done! You reviewed all important aspects. Your project looks ready — publish it with confidence.',
  },
  incompleteHint: {
    ar: 'أجب عن كل الأسئلة لتحصل على نتيجة دقيقة.',
    fr: 'Répondez à toutes les questions pour obtenir un résultat précis.',
    en: 'Answer all questions to get an accurate result.',
  },
  encourage: {
    ar: 'كل «لا» فرصة لتحسين مشروعك. عالجها، ثم عُد وأعد الفحص.',
    fr: "Chaque « Non » est une occasion d'améliorer votre projet. Traitez-les, puis revenez refaire la vérification.",
    en: 'Every "No" is a chance to improve your project. Address them, then come back and recheck.',
  },
  // عنوان قسم ملاحظات رفيق (تظهر حين تتعارض إجابة المستخدم مع بيانات رفيق)
  notesTitle: {
    ar: 'ملاحظات رفيق',
    fr: 'Remarques de Rafiq',
    en: "Rafiq's notes",
  },
  notesIntro: {
    ar: 'بناءً على ما سجّلته في رفيق، لاحظت ما يلي. هذه ملاحظات لطيفة لا أحكام — فأنت أدرى بمشروعك، وقد لا تكون كل خطواتك مسجّلة هنا:',
    fr: "D'après ce que vous avez enregistré dans Rafiq, j'ai remarqué ce qui suit. Ce sont des remarques bienveillantes, pas des jugements — vous connaissez mieux votre projet, et toutes vos étapes ne sont peut-être pas enregistrées ici :",
    en: "Based on what you recorded in Rafiq, I noticed the following. These are gentle notes, not judgments — you know your project best, and not all your steps may be recorded here:",
  },
  lastResultLabel: {
    ar: "نتيجتك السابقة:",
    fr: "Votre résultat précédent :",
    en: "Your previous result:",
  },
};

// ملاحظات التحقّق: نصوص تظهر حين تتعارض إجابة المستخدم مع بيانات رفيق الفعلية.
// {value} يُستبدل بالقيمة الفعلية من قاعدة البيانات.
export const verifyNotes = {
  hasProject: {
    ar: 'أجبت بأن لديك مشروعاً، لكن لا أرى مشاريع مسجّلة باسمك في رفيق بعد. إن كان مشروعك خارج رفيق فلا بأس — فقط تأكّد.',
    fr: "Vous avez répondu que vous avez un projet, mais je ne vois pas encore de projets enregistrés à votre nom dans Rafiq. Si votre projet est hors de Rafiq, pas de souci — vérifiez simplement.",
    en: "You answered that you have a project, but I don't see any projects registered under your name in Rafiq yet. If your project is outside Rafiq, that's fine — just make sure.",
  },
  reachedDeploy: {
    ar: 'أجبت بأن مشروعك جاهز للنشر، لكن أعلى مرحلة في مشاريعك المسجّلة هي المرحلة {value} من 7. تأكّد أن مشروعك فعلاً وصل مرحلة النشر.',
    fr: "Vous avez répondu que votre projet est prêt à être publié, mais la phase la plus avancée de vos projets enregistrés est la phase {value} sur 7. Assurez-vous que votre projet a vraiment atteint la phase de publication.",
    en: 'You answered that your project is ready to publish, but the most advanced phase in your registered projects is phase {value} of 7. Make sure your project has truly reached the deployment phase.',
  },
  usedChat: {
    ar: 'أجبت بأنك جرّبت كل الوظائف، وهذا رائع. تذكّر أن رفيق هنا لمساعدتك إن واجهت أي تعثّر — لم أرَ محادثات بيننا بعد.',
    fr: "Vous avez répondu que vous avez testé toutes les fonctions, c'est excellent. Rappelez-vous que Rafiq est là pour vous aider en cas de blocage — je n'ai pas encore vu de conversations entre nous.",
    en: "You answered that you tested all functions, that's great. Remember Rafiq is here to help if you get stuck — I haven't seen any conversations between us yet.",
  },
};

// الفئات والأسئلة
export const categories = [
  {
    key: 'design',
    title: { ar: 'التصميم والوضوح', fr: 'Design et clarté', en: 'Design and Clarity' },
    icon: '🎨',
    questions: [
      {
        id: 'd1',
        text: {
          ar: 'هل واجهتك فيها مساحات كافية (تباعد مريح) بين العناصر؟',
          fr: 'Votre interface a-t-elle des espaces suffisants (espacement confortable) entre les éléments ?',
          en: 'Does your interface have enough space (comfortable spacing) between elements?',
        },
        hint: {
          ar: 'تذكّر محطة التصميم: المساحة تمنح الواجهة تنفّساً ووضوحاً.',
          fr: "Rappelez-vous l'étape du design : l'espace donne à l'interface respiration et clarté.",
          en: 'Remember the design station: space gives the interface breathing room and clarity.',
        },
      },
      {
        id: 'd2',
        text: {
          ar: 'هل تستعمل لوناً أساسياً واحداً بتناسق، لا فوضى ألوان؟',
          fr: 'Utilisez-vous une seule couleur principale avec harmonie, pas un chaos de couleurs ?',
          en: 'Do you use one main color consistently, not a chaos of colors?',
        },
        hint: {
          ar: 'اللون بحكمة: أساسي للأفعال المهمّة، ودلالات واضحة (أحمر للخطر).',
          fr: 'La couleur avec sagesse : principale pour les actions importantes, et des significations claires (rouge pour le danger).',
          en: 'Color used wisely: main for important actions, and clear meanings (red for danger).',
        },
      },
      {
        id: 'd3',
        text: {
          ar: 'هل النصوص واضحة ومقروءة بحجم مناسب؟',
          fr: 'Les textes sont-ils clairs et lisibles avec une taille appropriée ?',
          en: 'Is the text clear and readable at an appropriate size?',
        },
        hint: {
          ar: 'الوضوح أهمّ من الإبهار. النصّ الصغير جداً يُتعب المستخدم.',
          fr: "La clarté est plus importante que l'éblouissement. Un texte trop petit fatigue l'utilisateur.",
          en: 'Clarity matters more than dazzle. Text that\'s too small tires the user.',
        },
      },
    ],
  },
  {
    key: 'ux',
    title: { ar: 'تجربة المستخدم', fr: 'Expérience utilisateur', en: 'User Experience' },
    icon: '🧭',
    questions: [
      {
        id: 'u1',
        text: {
          ar: 'هل عالجت الحالة الفارغة (رسالة ترشد حين لا توجد بيانات)؟',
          fr: "Avez-vous traité l'état vide (un message qui guide quand il n'y a pas de données) ?",
          en: 'Did you handle the empty state (a message that guides when there\'s no data)?',
        },
        hint: {
          ar: 'الشاشة الفارغة تربك. رسالة ودّية ترشد المستخدم لأوّل خطوة.',
          fr: "L'écran vide embrouille. Un message amical guide l'utilisateur vers la première étape.",
          en: 'An empty screen confuses. A friendly message guides the user to the first step.',
        },
      },
      {
        id: 'u2',
        text: {
          ar: 'هل تطلب تأكيداً قبل الأفعال الخطيرة (كالحذف)؟',
          fr: 'Demandez-vous une confirmation avant les actions dangereuses (comme la suppression) ?',
          en: 'Do you ask for confirmation before dangerous actions (like deletion)?',
        },
        hint: {
          ar: 'سؤال «هل أنت متأكّد؟» يحمي المستخدم من ندم كبير.',
          fr: '« Êtes-vous sûr ? » protège l\'utilisateur d\'un grand regret.',
          en: 'An "Are you sure?" question protects the user from big regret.',
        },
      },
      {
        id: 'u3',
        text: {
          ar: 'هل جرّبت مشروعك على شاشة هاتف (لا حاسوب فقط)؟',
          fr: 'Avez-vous testé votre projet sur un écran de téléphone (pas seulement un ordinateur) ?',
          en: 'Did you test your project on a phone screen (not just a computer)?',
        },
        hint: {
          ar: 'معظم المستخدمين على الهاتف. ما يبدو جيّداً على الحاسوب قد ينكسر على الهاتف.',
          fr: "La plupart des utilisateurs sont sur téléphone. Ce qui semble bon sur ordinateur peut casser sur téléphone.",
          en: 'Most users are on phones. What looks good on a computer may break on a phone.',
        },
      },
      {
        id: 'u4',
        text: {
          ar: 'هل يفهم مستخدم جديد كيف يستعمل تطبيقك دون شرح منك؟',
          fr: "Un nouvel utilisateur comprend-il comment utiliser votre application sans explication de votre part ?",
          en: 'Does a new user understand how to use your app without explanation from you?',
        },
        hint: {
          ar: 'التصميم الجيّد يُشعَر به لا يُلاحَظ. إن احتاج شرحاً، بسّطه.',
          fr: "Un bon design se ressent, ne se remarque pas. S'il faut l'expliquer, simplifiez-le.",
          en: 'Good design is felt, not noticed. If it needs explaining, simplify it.',
        },
      },
    ],
  },
  {
    key: 'content',
    title: { ar: 'المحتوى والصدق', fr: 'Contenu et honnêteté', en: 'Content and Honesty' },
    icon: '📝',
    questions: [
      {
        id: 'c1',
        text: {
          ar: 'هل كل الأرقام والإحصاءات في تطبيقك محسوبة من بيانات حقيقية (لا وهمية)؟',
          fr: 'Tous les nombres et statistiques de votre application sont-ils calculés à partir de données réelles (pas fictives) ?',
          en: 'Are all numbers and statistics in your app computed from real data (not fake)?',
        },
        hint: {
          ar: 'الشاشة الصادقة: لا رقم يظهر إلا محسوباً من بيانات حقيقية.',
          fr: "L'écran honnête : aucun nombre n'apparaît sans être calculé à partir de données réelles.",
          en: 'The honest screen: no number appears unless computed from real data.',
        },
      },
      {
        id: 'c2',
        text: {
          ar: 'هل راجعت النصوص من أخطاء إملائية أو لغوية؟',
          fr: "Avez-vous vérifié les textes pour des fautes d'orthographe ou de langue ?",
          en: 'Did you check the texts for spelling or language errors?',
        },
        hint: {
          ar: 'الأخطاء اللغوية تُضعف ثقة المستخدم في تطبيقك. راجعها بعناية.',
          fr: "Les fautes de langue affaiblissent la confiance de l'utilisateur. Vérifiez-les soigneusement.",
          en: 'Language errors weaken user trust in your app. Check them carefully.',
        },
      },
      {
        id: 'c3',
        text: {
          ar: 'إن كان تطبيقك متعدّد اللغات، هل كل النصوص مترجمة (لا لغة مختلطة)؟',
          fr: 'Si votre application est multilingue, tous les textes sont-ils traduits (pas de langue mélangée) ?',
          en: 'If your app is multilingual, is all text translated (no mixed language)?',
        },
        hint: {
          ar: 'نصّ واحد غير مترجم يكسر تجربة تعدّد اللغات كلّها.',
          fr: "Un seul texte non traduit brise toute l'expérience multilingue.",
          en: 'One untranslated text breaks the whole multilingual experience.',
        },
      },
    ],
  },
  {
    key: 'safety',
    title: { ar: 'الأمان والبيانات', fr: 'Sécurité et données', en: 'Safety and Data' },
    icon: '🔒',
    questions: [
      {
        id: 's1',
        text: {
          ar: 'هل بيانات المستخدم محفوظة بأمان (كل مستخدم يرى بياناته فقط)؟',
          fr: "Les données de l'utilisateur sont-elles sauvegardées en sécurité (chaque utilisateur ne voit que ses données) ?",
          en: 'Is user data saved securely (each user sees only their own data)?',
        },
        hint: {
          ar: 'إن كنت تستعمل قاعدة سحابية، تأكّد أن صلاحيات الوصول مضبوطة.',
          fr: "Si vous utilisez une base cloud, assurez-vous que les autorisations d'accès sont correctes.",
          en: 'If you use a cloud database, make sure access permissions are set correctly.',
        },
      },
      {
        id: 's2',
        text: {
          ar: 'هل تتجنّب عرض معلومات حسّاسة (كلمات سرّ، مفاتيح) في الكود العلني؟',
          fr: 'Évitez-vous d\'afficher des informations sensibles (mots de passe, clés) dans le code public ?',
          en: 'Do you avoid exposing sensitive information (passwords, keys) in public code?',
        },
        hint: {
          ar: 'المفاتيح السرّية لا تُرفع إلى GitHub العلني. احفظها في متغيّرات البيئة.',
          fr: "Les clés secrètes ne se téléversent pas sur GitHub public. Gardez-les dans des variables d'environnement.",
          en: 'Secret keys aren\'t pushed to public GitHub. Keep them in environment variables.',
        },
      },
    ],
  },
  {
    key: 'deploy',
    title: { ar: 'الجاهزية للنشر', fr: 'Prêt au déploiement', en: 'Deployment Readiness' },
    icon: '🚀',
    questions: [
      {
        id: 'p1',
        text: {
          ar: 'هل يُبنى مشروعك بلا أخطاء (npm run build ينجح)؟',
          fr: 'Votre projet se construit-il sans erreurs (npm run build réussit) ?',
          en: 'Does your project build without errors (npm run build succeeds)?',
        },
        hint: {
          ar: 'إن نجح البناء محلياً، فالنشر غالباً سينجح. افحصه قبل النشر.',
          fr: 'Si la construction réussit localement, le déploiement réussira généralement. Vérifiez avant de publier.',
          en: 'If the build succeeds locally, deployment will usually succeed. Check before publishing.',
        },
      },
      {
        id: 'p2',
        text: {
          ar: 'هل جرّبت كل الوظائف الأساسية وتأكّدت أنها تعمل؟',
          fr: 'Avez-vous testé toutes les fonctions principales et vérifié qu\'elles fonctionnent ?',
          en: 'Did you test all core functions and confirm they work?',
        },
        hint: {
          ar: 'جرّب مشروعك كأنك مستخدم: أضف، عدّل، احذف، تنقّل. تأكّد أن كلّاً يعمل.',
          fr: "Testez votre projet comme un utilisateur : ajoutez, modifiez, supprimez, naviguez. Assurez-vous que tout fonctionne.",
          en: 'Test your project like a user: add, edit, delete, navigate. Make sure each works.',
        },
      },
      {
        id: 'p3',
        text: {
          ar: 'هل كودك محفوظ على GitHub (نسخة آمنة)؟',
          fr: 'Votre code est-il sauvegardé sur GitHub (une copie sûre) ?',
          en: 'Is your code saved on GitHub (a safe copy)?',
        },
        hint: {
          ar: 'نسخة آمنة تحميك لو تعطّل جهازك، وتتيح النشر التلقائي.',
          fr: "Une copie sûre vous protège si votre appareil tombe en panne, et permet le déploiement automatique.",
          en: 'A safe copy protects you if your device breaks, and enables automatic deployment.',
        },
      },
    ],
  },
];

// حساب النتيجة من الإجابات
// answers: كائن { questionId: 'yes' | 'no' | 'na' }
export function computeResult(answers) {
  let total = 0;      // الأسئلة المحسوبة (نعم أو لا، بلا «لا ينطبق»)
  let passed = 0;     // الأسئلة المجاب عنها بنعم
  let answered = 0;   // كل الأسئلة المجاب عنها (نعم/لا/لا ينطبق)
  const allQuestions = [];

  categories.forEach((cat) => {
    cat.questions.forEach((q) => {
      allQuestions.push({ ...q, categoryKey: cat.key });
      const a = answers[q.id];
      if (a) answered++;
      if (a === 'yes') { total++; passed++; }
      else if (a === 'no') { total++; }
      // 'na' لا يُحسب في المجموع
    });
  });

  const totalQuestions = allQuestions.length;
  const percent = total > 0 ? Math.round((passed / total) * 100) : 0;
  const complete = answered === totalQuestions;

  // التوصيات: الأسئلة المجاب عنها بـ«لا»
  const toImprove = allQuestions.filter((q) => answers[q.id] === 'no');

  return {
    percent,
    passed,
    total,
    answered,
    totalQuestions,
    complete,
    toImprove,
  };
}

// توليد ملاحظات رفيق: تقارن إجابات المستخدم ببيانات رفيق الفعلية.
// تظهر ملاحظة فقط حين يجيب المستخدم «نعم» بينما بيانات رفيق تشير لغير ذلك.
// لا نغيّر إجابة المستخدم — نضيف ملاحظة لطيفة فقط.
// data: { projectCount, maxPhase, conversationCount }
// answers: { questionId: 'yes'|'no'|'na' }
export function buildNotes(answers, data) {
  const notes = [];

  // السؤال p2 «هل جرّبت كل الوظائف الأساسية؟» — إن قال نعم ولا مشاريع مسجّلة
  // (نربطه بوجود مشروع كإشارة أوّلية)
  if (answers.p2 === 'yes' && data.projectCount === 0) {
    notes.push({ key: 'hasProject', text: verifyNotes.hasProject });
  }

  // السؤال p1 «هل يُبنى مشروعك بلا أخطاء / جاهز؟» مقرونًا بمرحلة النشر
  // إن قال نعم بينما أعلى مرحلة أقل من 6 (النشر يبدأ من المراحل المتقدّمة)
  if (answers.p1 === 'yes' && data.projectCount > 0 && data.maxPhase > 0 && data.maxPhase < 6) {
    notes.push({ key: 'reachedDeploy', text: verifyNotes.reachedDeploy, value: data.maxPhase });
  }

  // السؤال p2 «جرّبت كل الوظائف» — تذكير بالمحادثة إن لم يستعمل رفيق قطّ ولديه مشروع
  if (answers.p2 === 'yes' && data.projectCount > 0 && data.conversationCount === 0) {
    notes.push({ key: 'usedChat', text: verifyNotes.usedChat });
  }

  return notes;
}

// استبدال {value} في نصّ الملاحظة بالقيمة الفعلية
export function fillNote(text, lang, value) {
  const raw = text[lang] || text.ar || '';
  if (value === undefined || value === null) return raw;
  return raw.replace('{value}', String(value));
}