// محتوى رحلة التعلّم — بنية منظّمة لكل محطة، ثلاثية اللغة (عربي / فرنسي / إنجليزي)
// رفيق معلّم يأخذ بيد المستخدم ليبني مشروعه الخاص
//
// كل حقل نصّ يظهر للمستخدم هو كائن { ar, fr, en }.
// حقول `code` تبقى سلسلة واحدة بلا ترجمة (الكود عالمي).
// استعمل الدالة t(field, lang) للقراءة في المكوّنات.

export function t(field, lang) {
  if (!field) return '';
  if (typeof field === 'string') return field; // حقول الكود تبقى كما هي
  return field[lang] || field.ar; // العربية لغة الرجوع الافتراضية
}

export const learningContent = {
  1: {
    title: {
      ar: 'إعداد البيئة',
      fr: "Configuration de l'environnement",
      en: 'Environment Setup',
    },
    description: {
      ar: 'ثبّت Node.js و VS Code، وأنشئ أول مشروع React وشغّله',
      fr: 'Installez Node.js et VS Code, puis créez et lancez votre premier projet React',
      en: 'Install Node.js and VS Code, then create and run your first React project',
    },
    intro: {
      ar: 'أهلاً بك. سأرافقك من أول خطوة حتى تبني مشروعك وتنشره. لنبدأ بتجهيز جهازك بالأدوات الأساسية — تُبنى مرة واحدة، وتخدمك في كل مشاريعك القادمة.',
      fr: "Bienvenue. Je vais vous accompagner de la première étape jusqu'à la publication de votre projet. Commençons par préparer votre machine avec les outils essentiels — ils ne se configurent qu'une seule fois, et vous serviront pour tous vos futurs projets.",
      en: "Welcome. I'll guide you from the very first step until you build and publish your project. Let's start by setting up your machine with the essential tools — configured once, and they'll serve you for all your future projects.",
    },
    sections: [
      {
        title: {
          ar: 'تثبيت Node.js',
          fr: 'Installer Node.js',
          en: 'Installing Node.js',
        },
        subtitle: {
          ar: 'المحرّك الأساسي لكل مشاريع الويب الحديثة',
          fr: 'Le moteur essentiel de tout projet web moderne',
          en: 'The essential engine behind every modern web project',
        },
        steps: [
          {
            type: 'text',
            text: {
              ar: 'Node.js هو البرنامج الذي يجعل جهازك قادراً على تشغيل مشاريع JavaScript وتثبيت الأدوات والمكتبات. بدونه لا يمكن بناء أي تطبيق ويب حديث.',
              fr: "Node.js est le programme qui permet à votre machine d'exécuter des projets JavaScript et d'installer des outils et des bibliothèques. Sans lui, impossible de construire une application web moderne.",
              en: "Node.js is the program that lets your machine run JavaScript projects and install tools and libraries. Without it, you can't build any modern web application.",
            },
          },
          {
            type: 'instruction',
            icon: '🌐',
            text: {
              ar: 'افتح المتصفّح واذهب إلى: nodejs.org',
              fr: 'Ouvrez votre navigateur et allez sur : nodejs.org',
              en: 'Open your browser and go to: nodejs.org',
            },
          },
          { type: 'code', text: 'https://nodejs.org' },
          {
            type: 'instruction',
            icon: '⬇️',
            text: {
              ar: 'اضغط على الزرّ الأخضر الكبير «LTS» — هذه النسخة الأستقرّ والموصى بها',
              fr: 'Cliquez sur le grand bouton vert « LTS » — c\'est la version la plus stable et recommandée.',
              en: 'Click the big green "LTS" button — this is the most stable, recommended version.',
            },
          },
          {
            type: 'tip',
            text: {
              ar: 'LTS تعني «Long Term Support» — دعم طويل الأمد. هذه دائماً الخيار الأفضل للمشاريع الجديدة.',
              fr: 'LTS signifie « Long Term Support » — support à long terme. C\'est toujours le meilleur choix pour les nouveaux projets.',
              en: 'LTS stands for "Long Term Support." It\'s always the best choice for new projects.',
            },
          },
          {
            type: 'instruction',
            icon: '📂',
            text: {
              ar: 'افتح الملف الذي تمّ تحميله (اسمه يشبه node-v24.x.x-x64.msi)',
              fr: 'Ouvrez le fichier téléchargé (son nom ressemble à node-v24.x.x-x64.msi)',
              en: 'Open the downloaded file (its name looks like node-v24.x.x-x64.msi)',
            },
          },
          {
            type: 'instruction',
            icon: '✅',
            text: {
              ar: 'اضغط Next في كل خطوة — لا تغيّر أي إعداد — ثم Install',
              fr: 'Cliquez sur Next à chaque étape — sans rien modifier — puis sur Install',
              en: "Click Next at every step — don't change any setting — then click Install",
            },
          },
          {
            type: 'instruction',
            icon: '⏳',
            text: {
              ar: 'انتظر حتى يظهر Finish ثم اضغطه',
              fr: 'Attendez que le bouton Finish apparaisse, puis cliquez sur lui',
              en: 'Wait until the Finish button appears, then click it',
            },
          },
          {
            type: 'instruction',
            icon: '⌨️',
            text: {
              ar: 'اضغط Windows + R على لوحة المفاتيح، اكتب cmd ثم اضغط Enter',
              fr: 'Appuyez sur Windows + R sur le clavier, tapez cmd puis appuyez sur Entrée',
              en: 'Press Windows + R on your keyboard, type cmd, then press Enter',
            },
          },
          {
            type: 'instruction',
            icon: '💻',
            text: {
              ar: 'في النافذة السوداء، اكتب هذا الأمر واضغط Enter:',
              fr: 'Dans la fenêtre noire, tapez cette commande et appuyez sur Entrée :',
              en: 'In the black window, type this command and press Enter:',
            },
          },
          { type: 'code', text: 'node --version' },
          {
            type: 'verify',
            text: 'v24.x.x',
            note: {
              ar: 'أي رقم يبدأ بـ v22 أو v24 يعني أن التثبيت نجح',
              fr: 'Tout numéro commençant par v22 ou v24 signifie que l\'installation a réussi',
              en: 'Any number starting with v22 or v24 means the installation succeeded',
            },
          },
          {
            type: 'warn',
            text: {
              ar: 'إذا ظهر خطأ «not recognized» — أغلق نافذة cmd وافتحها من جديد. إذا استمرّ الخطأ، أعد تشغيل الجهاز.',
              fr: 'Si une erreur « not recognized » apparaît — fermez la fenêtre cmd et rouvrez-la. Si l\'erreur persiste, redémarrez votre ordinateur.',
              en: 'If a "not recognized" error appears — close the cmd window and reopen it. If the error persists, restart your computer.',
            },
          },
          {
            type: 'instruction',
            icon: '💻',
            text: {
              ar: 'ثم اكتب هذا الأمر أيضاً للتحقّق من npm:',
              fr: 'Puis tapez aussi cette commande pour vérifier npm :',
              en: 'Then also type this command to check npm:',
            },
          },
          { type: 'code', text: 'npm --version' },
        ],
      },
      {
        title: {
          ar: 'تثبيت VS Code',
          fr: 'Installer VS Code',
          en: 'Installing VS Code',
        },
        subtitle: {
          ar: 'بيئة التطوير التي ستكتب فيها كل الكود',
          fr: "L'environnement de développement où vous écrirez tout le code",
          en: "The development environment where you'll write all your code",
        },
        steps: [
          {
            type: 'text',
            text: {
              ar: 'VS Code هو المحرّر الذي ستكتب فيه الكود. مجاني، خفيف، وأشهر أداة بين المطوّرين.',
              fr: "VS Code est l'éditeur dans lequel vous écrirez le code. Gratuit, léger, et l'outil le plus populaire parmi les développeurs.",
              en: "VS Code is the editor where you'll write your code. Free, lightweight, and the most popular tool among developers.",
            },
          },
          {
            type: 'instruction',
            icon: '🌐',
            text: {
              ar: 'اذهب إلى الموقع الرسمي:',
              fr: 'Allez sur le site officiel :',
              en: 'Go to the official website:',
            },
          },
          { type: 'code', text: 'https://code.visualstudio.com' },
          {
            type: 'instruction',
            icon: '⬇️',
            text: {
              ar: 'اضغط زرّ التحميل الكبير (يكتشف نظامك تلقائياً)',
              fr: 'Cliquez sur le grand bouton de téléchargement (il détecte automatiquement votre système)',
              en: 'Click the big download button (it detects your system automatically)',
            },
          },
          {
            type: 'instruction',
            icon: '✅',
            text: {
              ar: 'ثبّته بالضغط على Next — واقبل الشروط — ثم Install',
              fr: 'Installez-le en cliquant sur Next — acceptez les conditions — puis Install',
              en: 'Install it by clicking Next — accept the terms — then Install',
            },
          },
          {
            type: 'tip',
            text: {
              ar: 'في خطوة التثبيت، فعّل خيار «Add to PATH» إن ظهر — يسهّل الأمور لاحقاً.',
              fr: 'Pendant l\'installation, activez l\'option « Add to PATH » si elle apparaît — cela facilitera les choses plus tard.',
              en: 'During installation, enable the "Add to PATH" option if it appears — this will make things easier later.',
            },
          },
        ],
      },
      {
        title: {
          ar: 'إنشاء مشروعك',
          fr: 'Créer votre projet',
          en: 'Creating Your Project',
        },
        subtitle: {
          ar: '3 أوامر فقط تُنشئ هيكل تطبيقك كاملاً',
          fr: 'Seulement 3 commandes pour créer toute la structure de votre application',
          en: "Just 3 commands create your app's entire structure",
        },
        steps: [
          {
            type: 'text',
            text: {
              ar: 'الآن تبدأ ببناء مشروعك أنت. سننشئ تطبيق React جديداً بأداة Vite السريعة. افتح cmd في المكان الذي تريد مشروعك فيه.',
              fr: 'Maintenant, vous commencez à construire votre propre projet. Nous allons créer une nouvelle application React avec l\'outil rapide Vite. Ouvrez cmd à l\'endroit où vous voulez placer votre projet.',
              en: "Now you start building your own project. We'll create a new React app using the fast Vite tool. Open cmd in the location where you want your project.",
            },
          },
          {
            type: 'instruction',
            icon: '💻',
            text: {
              ar: 'اكتب هذا الأمر لإنشاء مشروعك — واختر اسماً يعبّر عن فكرتك بدل my-app:',
              fr: 'Tapez cette commande pour créer votre projet — choisissez un nom qui représente votre idée à la place de my-app :',
              en: 'Type this command to create your project — choose a name that reflects your idea instead of my-app:',
            },
          },
          { type: 'code', text: 'npm create vite@latest my-app -- --template react' },
          {
            type: 'tip',
            text: {
              ar: 'اسم المشروع لك أنت — اختر ما يناسب فكرتك (مثل: my-store أو tasks-app). فقط تجنّب المسافات والحروف العربية في الاسم.',
              fr: 'Le nom du projet est à vous — choisissez ce qui correspond à votre idée (par exemple : my-store ou tasks-app). Évitez simplement les espaces et les lettres arabes dans le nom.',
              en: 'The project name is yours to choose — pick whatever fits your idea (e.g., my-store or tasks-app). Just avoid spaces and Arabic letters in the name.',
            },
          },
          {
            type: 'instruction',
            icon: '📂',
            text: {
              ar: 'ادخل إلى مجلد مشروعك (استبدل my-app باسمك الذي اخترته):',
              fr: 'Entrez dans le dossier de votre projet (remplacez my-app par le nom que vous avez choisi) :',
              en: 'Enter your project folder (replace my-app with the name you chose):',
            },
          },
          { type: 'code', text: 'cd my-app' },
          {
            type: 'instruction',
            icon: '⬇️',
            text: {
              ar: 'ثبّت المكتبات الأساسية:',
              fr: 'Installez les bibliothèques essentielles :',
              en: 'Install the essential libraries:',
            },
          },
          { type: 'code', text: 'npm install' },
          {
            type: 'tip',
            text: {
              ar: 'هذه الأوامر الثلاثة تُنشئ هيكل تطبيق React كاملاً جاهزاً للعمل — أساس مشروعك.',
              fr: 'Ces trois commandes créent toute la structure d\'une application React prête à l\'emploi — la base de votre projet.',
              en: 'These three commands create a complete, ready-to-work React app structure — the foundation of your project.',
            },
          },
        ],
      },
      {
        title: {
          ar: 'شغّل مشروعك للمرة الأولى',
          fr: 'Lancez votre projet pour la première fois',
          en: 'Run Your Project for the First Time',
        },
        subtitle: {
          ar: 'ترى تطبيقك يعمل في المتصفّح',
          fr: 'Voyez votre application fonctionner dans le navigateur',
          en: 'See your app running in the browser',
        },
        steps: [
          {
            type: 'instruction',
            icon: '💻',
            text: {
              ar: 'شغّل خادم التطوير:',
              fr: 'Lancez le serveur de développement :',
              en: 'Start the development server:',
            },
          },
          { type: 'code', text: 'npm run dev' },
          {
            type: 'instruction',
            icon: '🌐',
            text: {
              ar: 'افتح الرابط الذي يظهر (عادةً localhost:5173) في المتصفّح',
              fr: 'Ouvrez le lien qui s\'affiche (généralement localhost:5173) dans le navigateur',
              en: 'Open the link that appears (usually localhost:5173) in your browser',
            },
          },
          {
            type: 'verify',
            text: {
              ar: 'صفحة Vite + React',
              fr: "Page d'accueil Vite + React",
              en: 'Vite + React welcome page',
            },
            note: {
              ar: 'إن رأيت صفحة ترحيب Vite، فالبيئة جاهزة بالكامل!',
              fr: 'Si vous voyez la page de bienvenue de Vite, votre environnement est entièrement prêt !',
              en: 'If you see the Vite welcome page, your environment is fully ready!',
            },
          },
          {
            type: 'tip',
            text: {
              ar: 'لإيقاف الخادم: اضغط Ctrl + C في نافذة cmd. لتشغيله مجدداً: npm run dev.',
              fr: 'Pour arrêter le serveur : appuyez sur Ctrl + C dans la fenêtre cmd. Pour le relancer : npm run dev.',
              en: 'To stop the server: press Ctrl + C in the cmd window. To restart it: npm run dev.',
            },
          },
        ],
      },
    ],
  },
};