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
  2: {
    title: {
      ar: 'بناء الهيكل',
      fr: 'Construire la structure',
      en: 'Building the Structure',
    },
    description: {
      ar: 'افهم بنية مشروعك، وأنشئ أول مكوّن، وتنقّل بين شاشتين',
      fr: 'Comprenez la structure de votre projet, créez votre premier composant, et naviguez entre deux écrans',
      en: 'Understand your project structure, create your first component, and navigate between two screens',
    },
    intro: {
      ar: 'الآن وقد جهّزت بيئتك، لنفهم مشروعك من الداخل. لن نكتب كثيراً من الكود هنا — بل سنفهم أولاً لماذا تُبنى المشاريع بهذا الشكل، لأن الفهم يجعل كل ما يأتي بعده أسهل. تذكّر: أنت تبني مشروعك أنت، وأنا أرافقك لتفهم كل قطعة تضعها.',
      fr: "Maintenant que votre environnement est prêt, comprenons votre projet de l'intérieur. Nous n'écrirons pas beaucoup de code ici — nous comprendrons d'abord pourquoi les projets sont construits ainsi, car la compréhension rend tout ce qui suit plus facile. Souvenez-vous : c'est votre projet que vous construisez, et je vous accompagne pour comprendre chaque pièce que vous posez.",
      en: "Now that your environment is ready, let's understand your project from the inside. We won't write much code here — first we'll understand why projects are built this way, because understanding makes everything that follows easier. Remember: it's your own project you're building, and I'm here to help you understand every piece you place.",
    },
    sections: [
      {
        title: {
          ar: 'لماذا ننظّم المشروع؟',
          fr: 'Pourquoi organiser le projet ?',
          en: 'Why Organize the Project?',
        },
        subtitle: {
          ar: 'المفهوم قبل الكود — لماذا لا نضع كل شيء في ملف واحد',
          fr: 'Le concept avant le code — pourquoi ne pas tout mettre dans un seul fichier',
          en: 'Concept before code — why we don\'t put everything in one file',
        },
        steps: [
          {
            type: 'text',
            text: {
              ar: 'تخيّل بيتاً من غرفة واحدة فيها المطبخ والنوم والضيوف معاً — فوضى يصعب العيش فيها. المشروع البرمجي مثله: لو وضعنا كل الكود في ملف واحد، لأصبح تعديله كابوساً. لذلك نقسّمه إلى ملفات ومجلّدات، كلٌّ له دوره الواضح.',
              fr: "Imaginez une maison d'une seule pièce où la cuisine, la chambre et le salon sont mélangés — un chaos difficile à vivre. Un projet logiciel, c'est pareil : si tout le code est dans un seul fichier, le modifier devient un cauchemar. C'est pourquoi nous le divisons en fichiers et dossiers, chacun ayant un rôle clair.",
              en: 'Imagine a one-room house where the kitchen, bedroom, and living room are all mixed together — a chaos hard to live in. A software project is the same: if all the code is in one file, editing it becomes a nightmare. That\'s why we split it into files and folders, each with a clear role.',
            },
          },
          {
            type: 'tip',
            text: {
              ar: 'القاعدة الذهبية: كل ملف يفعل شيئاً واحداً ويفعله جيداً. هذا يجعل مشروعك أسهل للفهم والتعديل والإصلاح — اليوم، وبعد أشهر حين تنساه.',
              fr: "La règle d'or : chaque fichier fait une seule chose, et la fait bien. Cela rend votre projet plus facile à comprendre, modifier et corriger — aujourd'hui, et dans des mois quand vous l'aurez oublié.",
              en: 'The golden rule: each file does one thing and does it well. This makes your project easier to understand, modify, and fix — today, and months later when you\'ve forgotten it.',
            },
          },
        ],
      },
      {
        title: {
          ar: 'جولة في مشروعك',
          fr: 'Visite guidée de votre projet',
          en: 'A Tour of Your Project',
        },
        subtitle: {
          ar: 'ما الملفات التي أنشأها Vite، وما دور كلٍّ منها',
          fr: 'Quels fichiers Vite a créés, et le rôle de chacun',
          en: 'What files Vite created, and the role of each',
        },
        steps: [
          {
            type: 'instruction',
            icon: '📂',
            text: {
              ar: 'افتح مجلّد مشروعك في VS Code، وانظر إلى مجلّد src — هنا يعيش كل الكود الذي ستكتبه.',
              fr: 'Ouvrez le dossier de votre projet dans VS Code, et regardez le dossier src — c\'est ici que vit tout le code que vous écrirez.',
              en: 'Open your project folder in VS Code, and look at the src folder — this is where all the code you\'ll write lives.',
            },
          },
          {
            type: 'text',
            text: {
              ar: 'هذه أهمّ الملفات التي ستراها: index.html هو الصفحة الوحيدة التي يفتحها المتصفّح (نادراً ما تلمسها). main.jsx هو نقطة البداية التي تُشغّل تطبيقك. App.jsx هو المكوّن الرئيسي — قلب واجهتك، وهنا ستعمل أكثر شيء.',
              fr: "Voici les fichiers les plus importants que vous verrez : index.html est la seule page que le navigateur ouvre (vous y touchez rarement). main.jsx est le point de départ qui lance votre application. App.jsx est le composant principal — le cœur de votre interface, et c'est là que vous travaillerez le plus.",
              en: "Here are the most important files you'll see: index.html is the only page the browser opens (you rarely touch it). main.jsx is the starting point that launches your app. App.jsx is the main component — the heart of your interface, and where you'll work the most.",
            },
          },
          {
            type: 'instruction',
            icon: '👀',
            text: {
              ar: 'افتح App.jsx واقرأه بهدوء. لا تقلق إن لم تفهم كل شيء — فقط لاحظ أنه يشبه HTML ممزوجاً بجافاسكريبت. هذا هو JSX.',
              fr: "Ouvrez App.jsx et lisez-le tranquillement. Ne vous inquiétez pas si vous ne comprenez pas tout — remarquez simplement qu'il ressemble à du HTML mélangé à du JavaScript. C'est le JSX.",
              en: "Open App.jsx and read it calmly. Don't worry if you don't understand everything — just notice it looks like HTML mixed with JavaScript. This is JSX.",
            },
          },
          {
            type: 'tip',
            text: {
              ar: 'JSX هو طريقة React لكتابة الواجهة: تكتب شيئاً يشبه HTML داخل JavaScript. ستعتاد عليه بسرعة مع التطبيق.',
              fr: 'JSX est la façon dont React écrit l\'interface : vous écrivez quelque chose qui ressemble à du HTML à l\'intérieur du JavaScript. Vous vous y habituerez vite en pratiquant.',
              en: 'JSX is React\'s way of writing the interface: you write something HTML-like inside JavaScript. You\'ll get used to it quickly with practice.',
            },
          },
        ],
      },
      {
        title: {
          ar: 'أنشئ أول مكوّن لك',
          fr: 'Créez votre premier composant',
          en: 'Create Your First Component',
        },
        subtitle: {
          ar: 'المكوّن: قطعة واجهة قابلة لإعادة الاستخدام، مثل قطع Lego',
          fr: 'Le composant : une pièce d\'interface réutilisable, comme des Lego',
          en: 'The component: a reusable piece of interface, like Lego bricks',
        },
        steps: [
          {
            type: 'text',
            text: {
              ar: 'المكوّن (Component) هو أهمّ فكرة في React. تخيّله قطعة Lego: تبنيها مرّة، وتعيد استخدامها أينما شئت. زرّ، بطاقة، شريط تنقّل — كلٌّ منها مكوّن. تطبيقك كلّه ليس إلا مكوّنات صغيرة تتجمّع معاً.',
              fr: "Le composant est l'idée la plus importante de React. Imaginez-le comme une brique Lego : vous le construisez une fois, et le réutilisez où vous voulez. Un bouton, une carte, une barre de navigation — chacun est un composant. Toute votre application n'est qu'un assemblage de petits composants.",
              en: "The component is the most important idea in React. Picture it as a Lego brick: you build it once, and reuse it wherever you want. A button, a card, a navigation bar — each is a component. Your whole app is just small components assembled together.",
            },
          },
          {
            type: 'instruction',
            icon: '📄',
            text: {
              ar: 'داخل مجلّد src، أنشئ ملفاً جديداً باسم Welcome.jsx (انقر بزرّ الفأرة الأيمن على src ← New File).',
              fr: 'Dans le dossier src, créez un nouveau fichier nommé Welcome.jsx (clic droit sur src ← New File).',
              en: 'Inside the src folder, create a new file named Welcome.jsx (right-click on src ← New File).',
            },
          },
          {
            type: 'instruction',
            icon: '✍️',
            text: {
              ar: 'اكتب فيه هذا المكوّن البسيط — غيّر النصّ ليعبّر عن مشروعك أنت:',
              fr: 'Écrivez-y ce composant simple — changez le texte pour qu\'il représente votre projet :',
              en: 'Write this simple component in it — change the text to reflect your own project:',
            },
          },
          {
            type: 'codeblock',
            label: { ar: 'Welcome.jsx', fr: 'Welcome.jsx', en: 'Welcome.jsx' },
            code: `function Welcome() {
  return (
    <div>
      <h1>أهلاً في مشروعي</h1>
      <p>هذا أول مكوّن أبنيه بنفسي.</p>
    </div>
  );
}

export default Welcome;`,
          },
          {
            type: 'text',
            text: {
              ar: 'لاحظ آخر سطر: export default Welcome — هذا يجعل المكوّن متاحاً ليُستعمل في ملفات أخرى. أي مكوّن تريد استخدامه في مكان آخر يحتاج هذا السطر.',
              fr: "Remarquez la dernière ligne : export default Welcome — cela rend le composant disponible pour être utilisé dans d'autres fichiers. Tout composant que vous voulez utiliser ailleurs a besoin de cette ligne.",
              en: 'Notice the last line: export default Welcome — this makes the component available for use in other files. Any component you want to use elsewhere needs this line.',
            },
          },
          {
            type: 'instruction',
            icon: '🔗',
            text: {
              ar: 'الآن لنستعمله. افتح App.jsx، واستورد مكوّنك في أعلى الملف، ثم ضعه داخل الواجهة:',
              fr: "Maintenant, utilisons-le. Ouvrez App.jsx, importez votre composant en haut du fichier, puis placez-le dans l'interface :",
              en: "Now let's use it. Open App.jsx, import your component at the top of the file, then place it in the interface:",
            },
          },
          {
            type: 'codeblock',
            label: { ar: 'في App.jsx', fr: 'Dans App.jsx', en: 'In App.jsx' },
            code: `import Welcome from './Welcome';

function App() {
  return (
    <div>
      <Welcome />
    </div>
  );
}

export default App;`,
          },
          {
            type: 'instruction',
            icon: '💻',
            text: {
              ar: 'احفظ الملفّين، وشغّل المشروع إن لم يكن يعمل:',
              fr: 'Enregistrez les deux fichiers, et lancez le projet s\'il ne tourne pas déjà :',
              en: 'Save both files, and run the project if it\'s not already running:',
            },
          },
          { type: 'code', text: 'npm run dev' },
          {
            type: 'verify',
            text: {
              ar: 'تظهر رسالة الترحيب التي كتبتها',
              fr: 'Le message de bienvenue que vous avez écrit apparaît',
              en: 'The welcome message you wrote appears',
            },
            note: {
              ar: 'إن رأيت نصّك في المتصفّح، فقد بنيت أول مكوّن واستعملته بنجاح! هذه هي طريقة بناء كل تطبيق React.',
              fr: 'Si vous voyez votre texte dans le navigateur, vous avez créé et utilisé votre premier composant avec succès ! C\'est ainsi qu\'on construit toute application React.',
              en: 'If you see your text in the browser, you\'ve created and used your first component successfully! This is how every React app is built.',
            },
          },
          {
            type: 'warn',
            text: {
              ar: 'إن ظهرت شاشة بيضاء أو خطأ، تأكّد من تطابق اسم الملف Welcome.jsx مع اسم الاستيراد، ومن وجود سطر export default. أغلب الأخطاء هنا سببها اختلاف بسيط في الاسم.',
              fr: "Si un écran blanc ou une erreur apparaît, vérifiez que le nom du fichier Welcome.jsx correspond au nom de l'import, et que la ligne export default existe. La plupart des erreurs ici viennent d'une petite différence de nom.",
              en: 'If a blank screen or error appears, make sure the file name Welcome.jsx matches the import name, and that the export default line exists. Most errors here come from a small name mismatch.',
            },
          },
        ],
      },
      {
        title: {
          ar: 'التنقّل بين شاشتين',
          fr: 'Naviguer entre deux écrans',
          en: 'Navigating Between Two Screens',
        },
        subtitle: {
          ar: 'مفهوم التنقّل — كيف يتنقّل المستخدم في تطبيقك',
          fr: 'Le concept de navigation — comment l\'utilisateur se déplace dans votre app',
          en: 'The navigation concept — how the user moves through your app',
        },
        steps: [
          {
            type: 'text',
            text: {
              ar: 'كل تطبيق فيه أكثر من شاشة: رئيسية، إعدادات، ملف شخصي… والتنقّل هو كيف ينتقل المستخدم بينها. الأدوات الاحترافية للتنقّل ستأتي في محطة لاحقة، لكن لنفهم الفكرة الآن بأبسط صورة: إظهار شاشة وإخفاء أخرى حسب اختيار المستخدم.',
              fr: "Chaque application a plus d'un écran : accueil, paramètres, profil… et la navigation, c'est la façon dont l'utilisateur passe de l'un à l'autre. Les outils professionnels de navigation viendront dans une étape ultérieure, mais comprenons l'idée maintenant dans sa forme la plus simple : montrer un écran et en cacher un autre selon le choix de l'utilisateur.",
              en: "Every app has more than one screen: home, settings, profile… and navigation is how the user moves between them. Professional navigation tools will come in a later station, but let's understand the idea now in its simplest form: showing one screen and hiding another based on the user's choice.",
            },
          },
          {
            type: 'text',
            text: {
              ar: 'سنستعمل «الحالة» (State) — وهي ذاكرة المكوّن التي تتذكّر أي شاشة معروضة الآن. لا تقلق من التفاصيل، فقط لاحظ الفكرة: متغيّر يحفظ الاختيار، وزرّان يغيّرانه.',
              fr: "Nous utiliserons l'« état » (State) — la mémoire du composant qui retient quel écran est affiché. Ne vous inquiétez pas des détails, remarquez juste l'idée : une variable qui garde le choix, et deux boutons qui la changent.",
              en: "We'll use \"state\" — the component's memory that remembers which screen is shown now. Don't worry about the details, just notice the idea: a variable that holds the choice, and two buttons that change it.",
            },
          },
          {
            type: 'instruction',
            icon: '✍️',
            text: {
              ar: 'جرّب هذا في App.jsx لترى التنقّل البسيط بعينك:',
              fr: 'Essayez ceci dans App.jsx pour voir la navigation simple de vos propres yeux :',
              en: 'Try this in App.jsx to see simple navigation with your own eyes:',
            },
          },
          {
            type: 'codeblock',
            label: { ar: 'تنقّل بسيط في App.jsx', fr: 'Navigation simple dans App.jsx', en: 'Simple navigation in App.jsx' },
            code: `import { useState } from 'react';

function App() {
  const [screen, setScreen] = useState('home');

  return (
    <div>
      <button onClick={() => setScreen('home')}>الرئيسية</button>
      <button onClick={() => setScreen('about')}>حول</button>

      {screen === 'home' && <h1>أنت في الشاشة الرئيسية</h1>}
      {screen === 'about' && <h1>أنت في شاشة "حول"</h1>}
    </div>
  );
}

export default App;`,
          },
          {
            type: 'text',
            text: {
              ar: 'اقرأ الكود ببطء: المتغيّر screen يحفظ اسم الشاشة الحالية. كل زرّ يغيّره عند الضغط. والسطران الأخيران يعرضان الشاشة المطابقة فقط. هذا جوهر التنقّل: تغيير ما يُعرض حسب الحالة.',
              fr: "Lisez le code lentement : la variable screen garde le nom de l'écran actuel. Chaque bouton la change au clic. Et les deux dernières lignes n'affichent que l'écran correspondant. C'est l'essence de la navigation : changer ce qui est affiché selon l'état.",
              en: "Read the code slowly: the screen variable holds the current screen's name. Each button changes it on click. And the last two lines show only the matching screen. This is the essence of navigation: changing what's shown based on state.",
            },
          },
          {
            type: 'verify',
            text: {
              ar: 'زرّان يبدّلان النصّ المعروض',
              fr: 'Deux boutons qui changent le texte affiché',
              en: 'Two buttons that switch the displayed text',
            },
            note: {
              ar: 'إن تبدّل النصّ عند الضغط على كل زرّ، فقد فهمت التنقّل والحالة معاً — إنجاز كبير في محطتك الثانية!',
              fr: 'Si le texte change en cliquant sur chaque bouton, vous avez compris la navigation et l\'état ensemble — un grand accomplissement pour votre deuxième étape !',
              en: 'If the text switches when you click each button, you\'ve understood navigation and state together — a big achievement for your second station!',
            },
          },
          {
            type: 'tip',
            text: {
              ar: 'ما فعلته الآن هو أساس كل تطبيق تفاعلي: حالة تتغيّر، وواجهة تتبعها. في المحطات القادمة سنبني على هذا الأساس أدوات أقوى. أحسنت!',
              fr: 'Ce que vous venez de faire est la base de toute application interactive : un état qui change, et une interface qui le suit. Dans les prochaines étapes, nous bâtirons sur cette base des outils plus puissants. Bravo !',
              en: 'What you just did is the foundation of every interactive app: a state that changes, and an interface that follows it. In the coming stations we\'ll build stronger tools on this foundation. Well done!',
            },
          },
        ],
      },
    ],
  },
};