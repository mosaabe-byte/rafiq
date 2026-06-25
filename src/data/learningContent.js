// محتوى رحلة التعلّم — بنية منظّمة لكل محطة
// نبدأ بالمحطة الأولى نموذجاً، ونكمل الباقي على نفس النمط

export const learningContent = {
  1: {
    title: 'إعداد البيئة',
    intro: 'قبل أن نكتب أي كود، نجهّز جهازك بالأدوات الأساسية. هذه الخطوة تُبنى مرة واحدة، وتخدمك في كل مشاريعك القادمة.',
    sections: [
      {
        title: 'تثبيت Node.js',
        subtitle: 'المحرّك الأساسي لكل مشاريع الويب الحديثة',
        steps: [
          { type: 'text', text: 'Node.js هو البرنامج الذي يجعل جهازك قادراً على تشغيل مشاريع JavaScript وتثبيت الأدوات والمكتبات. بدونه لا يمكن بناء أي تطبيق ويب حديث.' },
          { type: 'instruction', icon: '🌐', text: 'افتح المتصفّح واذهب إلى: nodejs.org' },
          { type: 'code', text: 'https://nodejs.org' },
          { type: 'instruction', icon: '⬇️', text: 'اضغط على الزرّ الأخضر الكبير «LTS» — هذه النسخة الأستقرّ والموصى بها' },
          { type: 'tip', text: 'LTS تعني «Long Term Support» — دعم طويل الأمد. هذه دائماً الخيار الأفضل للمشاريع الجديدة.' },
          { type: 'instruction', icon: '📂', text: 'افتح الملف الذي تمّ تحميله (اسمه يشبه node-v24.x.x-x64.msi)' },
          { type: 'instruction', icon: '✅', text: 'اضغط Next في كل خطوة — لا تغيّر أي إعداد — ثم Install' },
          { type: 'instruction', icon: '⏳', text: 'انتظر حتى يظهر Finish ثم اضغطه' },
          { type: 'instruction', icon: '⌨️', text: 'اضغط Windows + R على لوحة المفاتيح، اكتب cmd ثم اضغط Enter' },
          { type: 'instruction', icon: '💻', text: 'في النافذة السوداء، اكتب هذا الأمر واضغط Enter:' },
          { type: 'code', text: 'node --version' },
          { type: 'verify', text: 'v24.x.x', note: 'أي رقم يبدأ بـ v22 أو v24 يعني أن التثبيت نجح' },
          { type: 'warn', text: 'إذا ظهر خطأ «not recognized» — أغلق نافذة cmd وافتحها من جديد. إذا استمرّ الخطأ، أعد تشغيل الجهاز.' },
          { type: 'instruction', icon: '💻', text: 'ثم اكتب هذا الأمر أيضاً للتحقّق من npm:' },
          { type: 'code', text: 'npm --version' },
        ],
      },
      {
        title: 'تثبيت VS Code',
        subtitle: 'بيئة التطوير التي ستكتب فيها كل الكود',
        steps: [
          { type: 'text', text: 'VS Code هو المحرّر الذي ستكتب فيه الكود. مجاني، خفيف، وأشهر أداة بين المطوّرين.' },
          { type: 'instruction', icon: '🌐', text: 'اذهب إلى الموقع الرسمي:' },
          { type: 'code', text: 'https://code.visualstudio.com' },
          { type: 'instruction', icon: '⬇️', text: 'اضغط زرّ التحميل الكبير (يكتشف نظامك تلقائياً)' },
          { type: 'instruction', icon: '✅', text: 'ثبّته بالضغط على Next — واقبل الشروط — ثم Install' },
          { type: 'tip', text: 'في خطوة التثبيت، فعّل خيار «Add to PATH» إن ظهر — يسهّل الأمور لاحقاً.' },
        ],
      },
      {
        title: 'إنشاء مشروع رفيق',
        subtitle: '3 أوامر فقط تُنشئ هيكل التطبيق كاملاً',
        steps: [
          { type: 'text', text: 'الآن ننشئ مشروع React جديداً بأداة Vite السريعة. افتح cmd في المكان الذي تريد المشروع فيه.' },
          { type: 'instruction', icon: '💻', text: 'اكتب هذا الأمر لإنشاء المشروع:' },
          { type: 'code', text: 'npm create vite@latest rafiq -- --template react' },
          { type: 'instruction', icon: '📂', text: 'ادخل إلى مجلد المشروع:' },
          { type: 'code', text: 'cd rafiq' },
          { type: 'instruction', icon: '⬇️', text: 'ثبّت المكتبات الأساسية:' },
          { type: 'code', text: 'npm install' },
          { type: 'tip', text: 'هذه الأوامر الثلاثة تُنشئ هيكل تطبيق React كاملاً جاهزاً للعمل.' },
        ],
      },
      {
        title: 'شغّل رفيق للمرة الأولى',
        subtitle: 'ترى التطبيق يعمل في المتصفّح',
        steps: [
          { type: 'instruction', icon: '💻', text: 'شغّل خادم التطوير:' },
          { type: 'code', text: 'npm run dev' },
          { type: 'instruction', icon: '🌐', text: 'افتح الرابط الذي يظهر (عادةً localhost:5173) في المتصفّح' },
          { type: 'verify', text: 'صفحة Vite + React', note: 'إن رأيت صفحة ترحيب Vite، فالبيئة جاهزة بالكامل!' },
          { type: 'tip', text: 'لإيقاف الخادم: اضغط Ctrl + C في نافذة cmd. لتشغيله مجدداً: npm run dev.' },
        ],
      },
    ],
  },
};