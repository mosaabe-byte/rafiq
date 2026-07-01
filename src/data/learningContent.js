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
  3: {
    title: {
      ar: 'لوحة المشاريع الحيّة',
      fr: 'Le tableau de bord des projets',
      en: 'The Live Projects Dashboard',
    },
    description: {
      ar: 'اعرض قائمة بطاقات، مرّر لها بيانات، احسب إحصاءات، وأضف فلترة',
      fr: 'Affichez une liste de cartes, passez-leur des données, calculez des statistiques, et ajoutez un filtrage',
      en: 'Display a list of cards, pass them data, compute statistics, and add filtering',
    },
    intro: {
      ar: 'في المحطة السابقة بنيت مكوّناً واحداً. الآن سنبني لوحة كاملة: عدّة بطاقات من بيانات، إحصاءات تُحسب تلقائياً، وفلترة تتجاوب مع المستخدم. هذه أول واجهة حقيقية «حيّة» تبنيها. سنفهم كل مفهوم قبل أن نكتبه — تذكّر، أنت تبني لوحة مشروعك أنت.',
      fr: "Dans l'étape précédente, vous avez construit un seul composant. Maintenant, nous allons construire un tableau de bord complet : plusieurs cartes à partir de données, des statistiques calculées automatiquement, et un filtrage qui répond à l'utilisateur. C'est la première vraie interface « vivante » que vous construisez. Nous comprendrons chaque concept avant de l'écrire — souvenez-vous, c'est le tableau de bord de votre projet que vous construisez.",
      en: "In the previous station you built a single component. Now we'll build a complete dashboard: several cards from data, statistics computed automatically, and filtering that responds to the user. This is the first truly \"live\" interface you build. We'll understand each concept before writing it — remember, it's your own project's dashboard you're building.",
    },
    sections: [
      {
        title: {
          ar: 'من بطاقة واحدة إلى قائمة',
          fr: "D'une carte à une liste",
          en: 'From One Card to a List',
        },
        subtitle: {
          ar: 'المفهوم: كيف نعرض عدّة عناصر من بيانات؟',
          fr: 'Le concept : comment afficher plusieurs éléments à partir de données ?',
          en: 'The concept: how do we display multiple items from data?',
        },
        steps: [
          {
            type: 'text',
            text: {
              ar: 'تخيّل أن عندك قائمة مشاريع، وتريد بطاقة لكل مشروع. هل تكتب البطاقة عشر مرّات يدوياً؟ لا. في React نخبر الواجهة: «لكل عنصر في القائمة، اصنع بطاقة». الأداة التي تفعل هذا اسمها map — تمرّ على كل عنصر وتُنتج له واجهة.',
              fr: "Imaginez que vous avez une liste de projets, et vous voulez une carte pour chaque projet. Écririez-vous la carte dix fois à la main ? Non. En React, on dit à l'interface : « pour chaque élément de la liste, fabrique une carte ». L'outil qui fait cela s'appelle map — il parcourt chaque élément et lui produit une interface.",
              en: "Imagine you have a list of projects, and you want a card for each one. Would you write the card ten times by hand? No. In React, we tell the interface: \"for each item in the list, make a card.\" The tool that does this is called map — it goes through each item and produces an interface for it.",
            },
          },
          {
            type: 'text',
            text: {
              ar: 'لنبدأ ببيانات بسيطة. في تطبيق حقيقي تأتي البيانات من قاعدة بيانات (ستتعلّم ذلك في محطة لاحقة)، لكن الآن سنكتبها يدوياً لنركّز على الفكرة.',
              fr: "Commençons par des données simples. Dans une vraie application, les données viennent d'une base de données (vous l'apprendrez dans une étape ultérieure), mais pour l'instant nous les écrirons à la main pour nous concentrer sur l'idée.",
              en: "Let's start with simple data. In a real app, data comes from a database (you'll learn that in a later station), but for now we'll write it by hand to focus on the idea.",
            },
          },
          {
            type: 'instruction',
            icon: '✍️',
            text: {
              ar: 'في App.jsx، أنشئ قائمة مشاريع بسيطة فوق دالة App، وجرّب عرضها بـ map:',
              fr: 'Dans App.jsx, créez une liste de projets simple au-dessus de la fonction App, et essayez de l\'afficher avec map :',
              en: 'In App.jsx, create a simple projects list above the App function, and try displaying it with map:',
            },
          },
          {
            type: 'codeblock',
            label: { ar: 'App.jsx', fr: 'App.jsx', en: 'App.jsx' },
            code: `import { useState } from 'react';

const myProjects = [
  { id: 1, name: 'مشروعي الأول', status: 'جارٍ' },
  { id: 2, name: 'فكرة تطبيق', status: 'مكتمل' },
  { id: 3, name: 'متجر صغير', status: 'متوقف' },
];

function App() {
  return (
    <div>
      <h1>مشاريعي</h1>
      {myProjects.map((project) => (
        <div key={project.id}>
          <h3>{project.name}</h3>
          <p>{project.status}</p>
        </div>
      ))}
    </div>
  );
}

export default App;`,
          },
          {
            type: 'tip',
            text: {
              ar: 'لاحظ key={project.id}: React يحتاج معرّفاً فريداً لكل عنصر في القائمة ليتتبّعها. اجعلها دائماً قيمة فريدة مثل id. ستراها في كل قائمة تبنيها.',
              fr: "Remarquez key={project.id} : React a besoin d'un identifiant unique pour chaque élément de la liste afin de les suivre. Utilisez toujours une valeur unique comme id. Vous la verrez dans chaque liste que vous construisez.",
              en: 'Notice key={project.id}: React needs a unique identifier for each list item to track them. Always use a unique value like id. You\'ll see it in every list you build.',
            },
          },
          {
            type: 'verify',
            text: {
              ar: 'ثلاث بطاقات تظهر، واحدة لكل مشروع',
              fr: 'Trois cartes apparaissent, une pour chaque projet',
              en: 'Three cards appear, one for each project',
            },
            note: {
              ar: 'إن ظهرت البطاقات الثلاث، فقد تعلّمت عرض قائمة من البيانات — أساس كل تطبيق يعرض محتوى.',
              fr: 'Si les trois cartes apparaissent, vous avez appris à afficher une liste de données — la base de toute application qui affiche du contenu.',
              en: 'If the three cards appear, you\'ve learned to display a list from data — the foundation of every app that shows content.',
            },
          },
        ],
      },
      {
        title: {
          ar: 'مكوّن البطاقة و props',
          fr: 'Le composant carte et les props',
          en: 'The Card Component and props',
        },
        subtitle: {
          ar: 'المفهوم الجديد: كيف يستقبل المكوّن بيانات مختلفة؟',
          fr: 'Le nouveau concept : comment un composant reçoit-il des données différentes ?',
          en: 'The new concept: how does a component receive different data?',
        },
        steps: [
          {
            type: 'text',
            text: {
              ar: 'بطاقاتنا الآن مكتوبة داخل App مباشرة. الأفضل أن نصنع مكوّن «بطاقة» مستقلاً، ونمرّر له بيانات كل مشروع. لكن كيف يستقبل المكوّن بيانات مختلفة في كل مرّة؟ عبر props.',
              fr: "Nos cartes sont actuellement écrites directement dans App. Il vaut mieux créer un composant « carte » indépendant, et lui passer les données de chaque projet. Mais comment un composant reçoit-il des données différentes à chaque fois ? Via les props.",
              en: "Our cards are currently written directly inside App. It's better to make an independent \"card\" component and pass it each project's data. But how does a component receive different data each time? Through props.",
            },
          },
          {
            type: 'text',
            text: {
              ar: 'props (اختصار properties) هي البيانات التي يمرّرها المكوّن الأب إلى الابن — مثل وسائط تمرّرها لدالة. تخيّل قالب بطاقة فارغاً، وأنت تملؤه ببيانات مختلفة كل مرّة. هذا هو props.',
              fr: "props (abréviation de properties) sont les données que le composant parent passe à l'enfant — comme des arguments que vous passez à une fonction. Imaginez un modèle de carte vide, que vous remplissez avec des données différentes à chaque fois. C'est cela, props.",
              en: 'props (short for properties) are the data the parent component passes to the child — like arguments you pass to a function. Imagine an empty card template that you fill with different data each time. That\'s props.',
            },
          },
          {
            type: 'instruction',
            icon: '📄',
            text: {
              ar: 'أنشئ ملفاً جديداً ProjectCard.jsx في مجلّد src:',
              fr: 'Créez un nouveau fichier ProjectCard.jsx dans le dossier src :',
              en: 'Create a new file ProjectCard.jsx in the src folder:',
            },
          },
          {
            type: 'codeblock',
            label: { ar: 'ProjectCard.jsx', fr: 'ProjectCard.jsx', en: 'ProjectCard.jsx' },
            code: `function ProjectCard({ name, status }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>الحالة: {status}</p>
    </div>
  );
}

export default ProjectCard;`,
          },
          {
            type: 'text',
            text: {
              ar: 'لاحظ { name, status } بين قوسي الدالة: هذه هي props التي يستقبلها المكوّن. أي قيمة تمرّرها له ستظهر مكانها. الآن لنستعمله في App بدل البطاقة المكتوبة يدوياً.',
              fr: "Remarquez { name, status } entre les parenthèses de la fonction : ce sont les props que le composant reçoit. Toute valeur que vous lui passez apparaîtra à sa place. Maintenant, utilisons-le dans App à la place de la carte écrite à la main.",
              en: "Notice { name, status } between the function's parentheses: these are the props the component receives. Any value you pass it will appear in its place. Now let's use it in App instead of the hand-written card.",
            },
          },
          {
            type: 'codeblock',
            label: { ar: 'App.jsx (محدّث)', fr: 'App.jsx (mis à jour)', en: 'App.jsx (updated)' },
            code: `import ProjectCard from './ProjectCard';

const myProjects = [
  { id: 1, name: 'مشروعي الأول', status: 'جارٍ' },
  { id: 2, name: 'فكرة تطبيق', status: 'مكتمل' },
  { id: 3, name: 'متجر صغير', status: 'متوقف' },
];

function App() {
  return (
    <div>
      <h1>مشاريعي</h1>
      {myProjects.map((project) => (
        <ProjectCard
          key={project.id}
          name={project.name}
          status={project.status}
        />
      ))}
    </div>
  );
}

export default App;`,
          },
          {
            type: 'tip',
            text: {
              ar: 'هذا جوهر React: مكوّنات صغيرة قابلة لإعادة الاستخدام، تتغذّى ببيانات مختلفة عبر props. مكوّن ProjectCard واحد يخدم كل مشاريعك.',
              fr: "C'est l'essence de React : de petits composants réutilisables, alimentés par des données différentes via les props. Un seul composant ProjectCard sert tous vos projets.",
              en: "This is the essence of React: small reusable components, fed different data through props. One ProjectCard component serves all your projects.",
            },
          },
          {
            type: 'verify',
            text: {
              ar: 'نفس البطاقات الثلاث، لكن من مكوّن واحد قابل لإعادة الاستخدام',
              fr: 'Les mêmes trois cartes, mais à partir d\'un seul composant réutilisable',
              en: 'The same three cards, but from one reusable component',
            },
            note: {
              ar: 'فهمت props الآن — أحد أهمّ مفاهيم React على الإطلاق. كل تطبيق احترافي مبنيّ على هذا.',
              fr: 'Vous avez compris props maintenant — l\'un des concepts les plus importants de React. Toute application professionnelle est bâtie là-dessus.',
              en: 'You\'ve understood props now — one of React\'s most important concepts ever. Every professional app is built on this.',
            },
          },
        ],
      },
      {
        title: {
          ar: 'الإحصاءات وأشرطة التقدّم',
          fr: 'Les statistiques et les barres de progression',
          en: 'Statistics and Progress Bars',
        },
        subtitle: {
          ar: 'احسب أرقاماً من بياناتك واعرضها',
          fr: 'Calculez des nombres à partir de vos données et affichez-les',
          en: 'Compute numbers from your data and display them',
        },
        steps: [
          {
            type: 'text',
            text: {
              ar: 'اللوحة الحيّة تعرض أرقاماً مفيدة: كم مشروعاً لديك؟ كم منها مكتمل؟ هذه ليست أرقاماً نكتبها يدوياً — بل نحسبها من البيانات نفسها، فتتحدّث تلقائياً كلّما تغيّرت.',
              fr: "Le tableau de bord vivant affiche des nombres utiles : combien de projets avez-vous ? Combien sont terminés ? Ce ne sont pas des nombres écrits à la main — nous les calculons à partir des données elles-mêmes, donc ils se mettent à jour automatiquement à chaque changement.",
              en: "The live dashboard shows useful numbers: how many projects do you have? How many are done? These aren't hand-written numbers — we compute them from the data itself, so they update automatically whenever it changes.",
            },
          },
          {
            type: 'instruction',
            icon: '🔢',
            text: {
              ar: 'في App، قبل return، احسب بعض الإحصاءات البسيطة:',
              fr: 'Dans App, avant le return, calculez quelques statistiques simples :',
              en: 'In App, before the return, compute a few simple statistics:',
            },
          },
          {
            type: 'codeblock',
            label: { ar: 'إحصاءات في App.jsx', fr: 'Statistiques dans App.jsx', en: 'Statistics in App.jsx' },
            code: `const total = myProjects.length;
const done = myProjects.filter((p) => p.status === 'مكتمل').length;`,
          },
          {
            type: 'text',
            text: {
              ar: 'الأول يعطي العدد الكلّي (طول القائمة). الثاني يستعمل filter ليُبقي المشاريع المكتملة فقط، ثم يعدّها. اعرضهما في الواجهة:',
              fr: "Le premier donne le total (la longueur de la liste). Le second utilise filter pour ne garder que les projets terminés, puis les compte. Affichez-les dans l'interface :",
              en: 'The first gives the total (the list length). The second uses filter to keep only completed projects, then counts them. Display them in the interface:',
            },
          },
          {
            type: 'codeblock',
            label: { ar: 'عرض الإحصاءات', fr: 'Afficher les statistiques', en: 'Display the statistics' },
            code: `<div className="stats">
  <span>الإجمالي: {total}</span>
  <span>المكتملة: {done}</span>
</div>`,
          },
          {
            type: 'tip',
            text: {
              ar: 'هذه قوّة البيانات الحيّة: أضف مشروعاً جديداً للقائمة، وسترى الأرقام تتغيّر وحدها دون أن تلمسها. الواجهة تتبع البيانات دائماً.',
              fr: "C'est la puissance des données vivantes : ajoutez un nouveau projet à la liste, et vous verrez les nombres changer tout seuls sans y toucher. L'interface suit toujours les données.",
              en: "This is the power of live data: add a new project to the list, and you'll see the numbers change on their own without touching them. The interface always follows the data.",
            },
          },
          {
            type: 'verify',
            text: {
              ar: 'يظهر «الإجمالي: 3» و«المكتملة: 1»',
              fr: 'Affiche « Total : 3 » et « Terminés : 1 »',
              en: 'Shows "Total: 3" and "Done: 1"',
            },
            note: {
              ar: 'الأرقام تُحسب من بياناتك لا تُكتب يدوياً — هذا الفرق بين لوحة حيّة ولوحة ميّتة.',
              fr: 'Les nombres sont calculés à partir de vos données, pas écrits à la main — c\'est la différence entre un tableau de bord vivant et un mort.',
              en: 'The numbers are computed from your data, not hand-written — this is the difference between a live dashboard and a dead one.',
            },
          },
        ],
      },
      {
        title: {
          ar: 'الفلترة',
          fr: 'Le filtrage',
          en: 'Filtering',
        },
        subtitle: {
          ar: 'دع المستخدم يختار ما يراه — تطبيق عملي للحالة',
          fr: "Laissez l'utilisateur choisir ce qu'il voit — application pratique de l'état",
          en: 'Let the user choose what they see — a practical use of state',
        },
        steps: [
          {
            type: 'text',
            text: {
              ar: 'الآن نجمع كل ما تعلّمناه: نضيف أزراراً تتيح للمستخدم عرض كل المشاريع، أو المكتملة فقط، أو الجارية فقط. سنستعمل الحالة (State) التي تعلّمناها في المحطة 2 لتذكّر الفلتر المختار.',
              fr: "Maintenant, nous rassemblons tout ce que nous avons appris : nous ajoutons des boutons qui permettent à l'utilisateur d'afficher tous les projets, ou seulement les terminés, ou seulement ceux en cours. Nous utiliserons l'état (State) appris à l'étape 2 pour retenir le filtre choisi.",
              en: "Now we bring together everything we've learned: we add buttons that let the user show all projects, or only completed ones, or only active ones. We'll use the state we learned in station 2 to remember the chosen filter.",
            },
          },
          {
            type: 'instruction',
            icon: '✍️',
            text: {
              ar: 'أضف حالة الفلتر في أعلى App، ثم قائمة مفلترة تُحسب منها:',
              fr: 'Ajoutez l\'état du filtre en haut de App, puis une liste filtrée calculée à partir de lui :',
              en: 'Add the filter state at the top of App, then a filtered list computed from it:',
            },
          },
          {
            type: 'codeblock',
            label: { ar: 'الفلترة في App.jsx', fr: 'Le filtrage dans App.jsx', en: 'Filtering in App.jsx' },
            code: `const [filter, setFilter] = useState('الكل');

const visibleProjects =
  filter === 'الكل'
    ? myProjects
    : myProjects.filter((p) => p.status === filter);`,
          },
          {
            type: 'text',
            text: {
              ar: 'المتغيّر filter يحفظ الاختيار الحالي. وقائمة visibleProjects تعرض الكل أو المفلتر حسبه. الآن أضف أزرار الفلترة، واعرض القائمة المفلترة بدل الأصلية:',
              fr: "La variable filter garde le choix actuel. Et la liste visibleProjects affiche tout ou le filtré selon lui. Maintenant, ajoutez les boutons de filtrage, et affichez la liste filtrée au lieu de l'originale :",
              en: "The filter variable holds the current choice. And the visibleProjects list shows all or the filtered set based on it. Now add the filter buttons, and display the filtered list instead of the original:",
            },
          },
          {
            type: 'codeblock',
            label: { ar: 'أزرار الفلترة والعرض', fr: 'Boutons de filtrage et affichage', en: 'Filter buttons and display' },
            code: `<div className="filters">
  <button onClick={() => setFilter('الكل')}>الكل</button>
  <button onClick={() => setFilter('جارٍ')}>جارٍ</button>
  <button onClick={() => setFilter('مكتمل')}>مكتمل</button>
</div>

{visibleProjects.map((project) => (
  <ProjectCard
    key={project.id}
    name={project.name}
    status={project.status}
  />
))}`,
          },
          {
            type: 'verify',
            text: {
              ar: 'الضغط على زرّ يُظهر المشاريع المطابقة فقط',
              fr: 'Cliquer sur un bouton n\'affiche que les projets correspondants',
              en: 'Clicking a button shows only the matching projects',
            },
            note: {
              ar: 'إن تغيّرت البطاقات المعروضة مع كل زرّ، فقد بنيت لوحة تفاعلية حقيقية! جمعت map و props و State و filter في تجربة واحدة.',
              fr: 'Si les cartes affichées changent avec chaque bouton, vous avez construit un vrai tableau de bord interactif ! Vous avez réuni map, props, State et filter en une seule expérience.',
              en: 'If the displayed cards change with each button, you\'ve built a real interactive dashboard! You\'ve combined map, props, State, and filter in one experience.',
            },
          },
          {
            type: 'tip',
            text: {
              ar: 'ما بنيته هنا هو نموذج مصغّر للوحة رفيق نفسها التي تستعملها! بطاقات من بيانات، إحصاءات محسوبة، وفلترة بالحالة. أنت تفهم الآن كيف بُنيت التطبيقات التي تستعملها يومياً. أحسنت!',
              fr: "Ce que vous avez construit ici est une version miniature du tableau de bord de Rafiq lui-même que vous utilisez ! Des cartes à partir de données, des statistiques calculées, et un filtrage par l'état. Vous comprenez maintenant comment sont construites les applications que vous utilisez chaque jour. Bravo !",
              en: "What you've built here is a miniature version of Rafiq's own dashboard that you use! Cards from data, computed statistics, and filtering by state. You now understand how the apps you use daily are built. Well done!",
            },
          },
        ],
      },
    ],
  },
  4: {
    title: {
      ar: 'الحفظ الدائم',
      fr: 'La sauvegarde permanente',
      en: 'Permanent Saving',
    },
    description: {
      ar: 'اجعل المستخدم يضيف ويحذف مشاريع، وتبقى محفوظة بعد إغلاق الصفحة',
      fr: "Permettez à l'utilisateur d'ajouter et supprimer des projets, et de les garder sauvegardés après la fermeture de la page",
      en: 'Let the user add and delete projects, and keep them saved after closing the page',
    },
    intro: {
      ar: 'في المحطة السابقة عرضت بياناتك، لكنها كانت ثابتة في الكود. الآن سنجعلها حيّة: المستخدم يضيف مشاريعه ويحذفها، وتبقى محفوظة حتى لو أغلق الصفحة وعاد. هذا هو «الحفظ الدائم» — وهو ما يحوّل صفحة عرض إلى تطبيق حقيقي. تذكّر: أنت تبني تطبيق مشروعك أنت.',
      fr: "Dans l'étape précédente, vous avez affiché vos données, mais elles étaient figées dans le code. Maintenant, nous allons les rendre vivantes : l'utilisateur ajoute et supprime ses projets, et ils restent sauvegardés même s'il ferme la page et revient. C'est la « sauvegarde permanente » — ce qui transforme une page d'affichage en une vraie application. Souvenez-vous : c'est l'application de votre projet que vous construisez.",
      en: "In the previous station you displayed your data, but it was fixed in the code. Now we'll make it live: the user adds and deletes their projects, and they stay saved even after closing the page and returning. This is \"permanent saving\" — what turns a display page into a real application. Remember: it's your own project's app you're building.",
    },
    sections: [
      {
        title: {
          ar: 'لماذا تختفي البيانات؟',
          fr: 'Pourquoi les données disparaissent-elles ?',
          en: 'Why Does Data Disappear?',
        },
        subtitle: {
          ar: 'المفهوم: الذاكرة المؤقّتة مقابل الدائمة',
          fr: 'Le concept : mémoire temporaire contre mémoire permanente',
          en: 'The concept: temporary versus permanent memory',
        },
        steps: [
          {
            type: 'text',
            text: {
              ar: 'في المحطة السابقة، لو أضفت مشروعاً ثم أغلقت الصفحة، لاختفى. لماذا؟ لأن الحالة التي في «الذاكرة» مؤقّتة — تعيش ما دامت الصفحة مفتوحة، وتُمحى عند إغلاقها. مثل كتابة على سبّورة تُمسح كل مساء.',
              fr: "Dans l'étape précédente, si vous ajoutiez un projet puis fermiez la page, il disparaîtrait. Pourquoi ? Parce que l'état en « mémoire » est temporaire — il vit tant que la page est ouverte, et s'efface à sa fermeture. Comme écrire sur un tableau effacé chaque soir.",
              en: "In the previous station, if you added a project then closed the page, it would vanish. Why? Because the state in \"memory\" is temporary — it lives while the page is open, and is erased when it closes. Like writing on a board wiped every evening.",
            },
          },
          {
            type: 'text',
            text: {
              ar: 'لنجعل البيانات تبقى، نحتاج «ذاكرة دائمة». المتصفّح يوفّر واحدة بسيطة اسمها «localStorage» — صندوق تخزين صغير في المتصفّح يحفظ البيانات حتى بعد إغلاق الصفحة. مثل دفتر تكتب فيه ويبقى.',
              fr: "Pour que les données restent, nous avons besoin d'une « mémoire permanente ». Le navigateur en fournit une simple appelée « localStorage » — une petite boîte de stockage dans le navigateur qui garde les données même après la fermeture de la page. Comme un carnet où vous écrivez et qui reste.",
              en: "To make data stay, we need \"permanent memory.\" The browser provides a simple one called \"localStorage\" — a small storage box in the browser that keeps data even after the page closes. Like a notebook you write in that stays.",
            },
          },
          {
            type: 'tip',
            text: {
              ar: 'مهمّ: «localStorage» يحفظ على جهاز المستخدم فقط، لا في السحابة. أي أن بياناته لن تتبعه لجهاز آخر. الحفظ السحابي الحقيقي سنتعلّمه في محطة قادمة مخصّصة له — خطوة بخطوة.',
              fr: "Important : « localStorage » sauvegarde uniquement sur l'appareil de l'utilisateur, pas dans le cloud. Ses données ne le suivront donc pas sur un autre appareil. La vraie sauvegarde cloud, nous l'apprendrons dans une étape ultérieure qui lui est dédiée — pas à pas.",
              en: 'Important: "localStorage" saves only on the user\'s device, not in the cloud. So their data won\'t follow them to another device. Real cloud saving we\'ll learn in a later dedicated station — step by step.',
            },
          },
        ],
      },
      {
        title: {
          ar: 'إضافة مشروع جديد',
          fr: 'Ajouter un nouveau projet',
          en: 'Adding a New Project',
        },
        subtitle: {
          ar: 'نموذج بسيط يُدخل به المستخدم بياناته',
          fr: "Un formulaire simple pour que l'utilisateur saisisse ses données",
          en: 'A simple form for the user to enter their data',
        },
        steps: [
          {
            type: 'text',
            text: {
              ar: 'لنبدأ بجعل المستخدم يضيف مشروعاً. نحتاج شيئين: حقل إدخال يكتب فيه الاسم، وزرّ يضيفه للقائمة. سنستعمل الحالة (State) لحفظ ما يكتبه، وقائمة المشاريع في الحالة أيضاً.',
              fr: "Commençons par permettre à l'utilisateur d'ajouter un projet. Nous avons besoin de deux choses : un champ de saisie où il écrit le nom, et un bouton qui l'ajoute à la liste. Nous utiliserons l'état (State) pour garder ce qu'il écrit, et la liste des projets aussi dans l'état.",
              en: "Let's start by letting the user add a project. We need two things: an input field where they type the name, and a button that adds it to the list. We'll use state to hold what they type, and the projects list in state too.",
            },
          },
          {
            type: 'instruction',
            icon: '✍️',
            text: {
              ar: 'حوّل قائمة المشاريع إلى حالة، وأضف حالة لحقل الإدخال، في أعلى «App»:',
              fr: "Transformez la liste des projets en état, et ajoutez un état pour le champ de saisie, en haut de « App » :",
              en: 'Turn the projects list into state, and add a state for the input field, at the top of "App":',
            },
          },
          {
            type: 'codeblock',
            label: { ar: 'App.jsx', fr: 'App.jsx', en: 'App.jsx' },
            code: `import { useState } from 'react';

function App() {
  const [projects, setProjects] = useState([
    { id: 1, name: 'مشروعي الأول' },
    { id: 2, name: 'فكرة تطبيق' },
  ]);
  const [newName, setNewName] = useState('');

  function addProject() {
    if (newName.trim() === '') return;
    const newProject = { id: Date.now(), name: newName };
    setProjects([...projects, newProject]);
    setNewName('');
  }

  return (
    <div>
      <h1>مشاريعي</h1>

      <input
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="اسم المشروع"
      />
      <button onClick={addProject}>إضافة</button>

      {projects.map((project) => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  );
}

export default App;`,
          },
          {
            type: 'text',
            text: {
              ar: 'اقرأ دالة «addProject» بتأنٍّ: تتجاهل الإدخال الفارغ، تصنع مشروعاً بمعرّف فريد (نستعمل «Date.now» لتوليد رقم فريد)، تضيفه للقائمة، ثم تفرّغ الحقل. لاحظ الأقواس الثلاث [...projects] — تعني «كل المشاريع القديمة، ثم الجديد».',
              fr: "Lisez attentivement la fonction « addProject » : elle ignore une saisie vide, crée un projet avec un identifiant unique (nous utilisons « Date.now » pour générer un nombre unique), l'ajoute à la liste, puis vide le champ. Remarquez les trois points [...projects] — ils signifient « tous les anciens projets, puis le nouveau ».",
              en: "Read the \"addProject\" function carefully: it ignores empty input, creates a project with a unique id (we use \"Date.now\" to generate a unique number), adds it to the list, then clears the field. Notice the three dots [...projects] — they mean \"all old projects, then the new one.\"",
            },
          },
          {
            type: 'verify',
            text: {
              ar: 'تكتب اسماً وتضغط «إضافة» فيظهر في القائمة',
              fr: 'Vous tapez un nom et cliquez sur « Ajouter » et il apparaît dans la liste',
              en: 'You type a name and click "Add" and it appears in the list',
            },
            note: {
              ar: 'إن ظهر مشروعك الجديد فوراً، فقد جعلت المستخدم يتحكّم ببياناته — خطوة كبيرة نحو تطبيق حقيقي.',
              fr: "Si votre nouveau projet apparaît immédiatement, vous avez donné à l'utilisateur le contrôle de ses données — un grand pas vers une vraie application.",
              en: 'If your new project appears immediately, you\'ve given the user control over their data — a big step toward a real app.',
            },
          },
        ],
      },
      {
        title: {
          ar: 'الحفظ الحقيقي',
          fr: 'La vraie sauvegarde',
          en: 'Real Saving',
        },
        subtitle: {
          ar: 'اربط بياناتك بذاكرة المتصفّح لتبقى',
          fr: 'Reliez vos données à la mémoire du navigateur pour qu\'elles restent',
          en: 'Connect your data to the browser\'s memory so it stays',
        },
        steps: [
          {
            type: 'text',
            text: {
              ar: 'الآن مشاريعك تظهر، لكن لو أغلقت الصفحة اختفت. لنربطها بـ «localStorage» لتبقى. نحتاج شيئين: حفظ القائمة كلّما تغيّرت، وقراءتها عند فتح الصفحة. سنستعمل أداة اسمها «useEffect» — تُنفّذ كوداً عند حدوث تغيير.',
              fr: "Maintenant vos projets s'affichent, mais si vous fermiez la page ils disparaîtraient. Relions-les à « localStorage » pour qu'ils restent. Nous avons besoin de deux choses : sauvegarder la liste à chaque changement, et la lire à l'ouverture de la page. Nous utiliserons un outil appelé « useEffect » — il exécute du code lorsqu'un changement se produit.",
              en: "Now your projects show, but if you closed the page they'd disappear. Let's connect them to \"localStorage\" so they stay. We need two things: save the list whenever it changes, and read it when the page opens. We'll use a tool called \"useEffect\" — it runs code when a change happens.",
            },
          },
          {
            type: 'instruction',
            icon: '💾',
            text: {
              ar: 'استورد «useEffect»، واجعل القيمة الأولى للمشاريع تُقرأ من الذاكرة، وأضف حفظاً تلقائياً:',
              fr: "Importez « useEffect », faites en sorte que la valeur initiale des projets soit lue depuis la mémoire, et ajoutez une sauvegarde automatique :",
              en: 'Import "useEffect", make the projects\' initial value read from memory, and add automatic saving:',
            },
          },
          {
            type: 'codeblock',
            label: { ar: 'أعلى App.jsx', fr: 'En haut de App.jsx', en: 'Top of App.jsx' },
            code: `import { useState, useEffect } from 'react';

function App() {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('myProjects');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('myProjects', JSON.stringify(projects));
  }, [projects]);

  // ... بقية الكود كما هو`,
          },
          {
            type: 'text',
            text: {
              ar: 'شرح مبسّط: عند بدء التطبيق، نقرأ ما حُفظ سابقاً (إن وُجد). و«useEffect» يحفظ القائمة في كل مرّة تتغيّر. كلمة «JSON» مجرّد صيغة لتحويل بياناتك إلى نصّ يُحفظ، ثم إرجاعها. لا تقلق من تفاصيلها الآن.',
              fr: "Explication simplifiée : au démarrage de l'application, nous lisons ce qui a été sauvegardé auparavant (s'il existe). Et « useEffect » sauvegarde la liste chaque fois qu'elle change. Le mot « JSON » n'est qu'un format pour convertir vos données en texte à sauvegarder, puis les récupérer. Ne vous souciez pas de ses détails pour l'instant.",
              en: "Simplified explanation: when the app starts, we read what was saved before (if any). And \"useEffect\" saves the list every time it changes. The word \"JSON\" is just a format to convert your data into text to save, then bring it back. Don't worry about its details now.",
            },
          },
          {
            type: 'verify',
            text: {
              ar: 'أضف مشروعاً، أغلق الصفحة، افتحها من جديد — يبقى موجوداً',
              fr: 'Ajoutez un projet, fermez la page, rouvrez-la — il reste présent',
              en: 'Add a project, close the page, reopen it — it stays there',
            },
            note: {
              ar: 'إن بقي مشروعك بعد إعادة فتح الصفحة، فقد حقّقت الحفظ الدائم! هذا جوهر كل تطبيق يتذكّر بيانات مستخدميه.',
              fr: "Si votre projet reste après la réouverture de la page, vous avez réalisé la sauvegarde permanente ! C'est l'essence de toute application qui se souvient des données de ses utilisateurs.",
              en: 'If your project stays after reopening the page, you\'ve achieved permanent saving! This is the essence of every app that remembers its users\' data.',
            },
          },
        ],
      },
      {
        title: {
          ar: 'حذف مشروع',
          fr: 'Supprimer un projet',
          en: 'Deleting a Project',
        },
        subtitle: {
          ar: 'أكمل التحكّم — والحذف يُحفظ تلقائياً',
          fr: 'Complétez le contrôle — et la suppression est sauvegardée automatiquement',
          en: 'Complete the control — and deletion is saved automatically',
        },
        steps: [
          {
            type: 'text',
            text: {
              ar: 'التطبيق الكامل يتيح الحذف أيضاً. الجميل أننا لن نضيف أي كود حفظ جديد — لأن «useEffect» الذي كتبناه يحفظ تلقائياً عند أي تغيير، بما فيه الحذف. هذه قوّة البناء الصحيح.',
              fr: "Une application complète permet aussi la suppression. Le beau, c'est que nous n'ajouterons aucun nouveau code de sauvegarde — car le « useEffect » que nous avons écrit sauvegarde automatiquement à tout changement, y compris la suppression. C'est la puissance d'une construction correcte.",
              en: "A complete app allows deletion too. The beauty is we won't add any new saving code — because the \"useEffect\" we wrote saves automatically on any change, including deletion. This is the power of building correctly.",
            },
          },
          {
            type: 'instruction',
            icon: '🗑️',
            text: {
              ar: 'أضف دالة حذف، وزرّ حذف بجانب كل مشروع:',
              fr: 'Ajoutez une fonction de suppression, et un bouton supprimer à côté de chaque projet :',
              en: 'Add a delete function, and a delete button next to each project:',
            },
          },
          {
            type: 'codeblock',
            label: { ar: 'دالة الحذف والعرض', fr: 'Fonction de suppression et affichage', en: 'Delete function and display' },
            code: `function deleteProject(id) {
  setProjects(projects.filter((p) => p.id !== id));
}

// داخل map:
{projects.map((project) => (
  <div key={project.id}>
    {project.name}
    <button onClick={() => deleteProject(project.id)}>حذف</button>
  </div>
))}`,
          },
          {
            type: 'text',
            text: {
              ar: 'دالة «deleteProject» تستعمل «filter» لتُبقي كل المشاريع ما عدا الذي نريد حذفه (الذي يطابق معرّفه). بهذه البساطة. وبما أن القائمة تغيّرت، يحفظها «useEffect» تلقائياً.',
              fr: "La fonction « deleteProject » utilise « filter » pour garder tous les projets sauf celui à supprimer (celui dont l'identifiant correspond). Aussi simple que cela. Et comme la liste a changé, « useEffect » la sauvegarde automatiquement.",
              en: "The \"deleteProject\" function uses \"filter\" to keep all projects except the one to delete (whose id matches). That simple. And since the list changed, \"useEffect\" saves it automatically.",
            },
          },
          {
            type: 'verify',
            text: {
              ar: 'احذف مشروعاً، أعد فتح الصفحة — يبقى محذوفاً',
              fr: 'Supprimez un projet, rouvrez la page — il reste supprimé',
              en: 'Delete a project, reopen the page — it stays deleted',
            },
            note: {
              ar: 'الآن مستخدمك يضيف ويحذف، وكلّه يُحفظ. بنيت تطبيقاً كاملاً بالحفظ الدائم — إنجاز حقيقي!',
              fr: "Maintenant votre utilisateur ajoute et supprime, et tout est sauvegardé. Vous avez construit une application complète avec sauvegarde permanente — un vrai accomplissement !",
              en: 'Now your user adds and deletes, and everything is saved. You\'ve built a complete app with permanent saving — a real achievement!',
            },
          },
          {
            type: 'tip',
            text: {
              ar: 'ما بنيته هو نمط «CRUD» المصغّر: إضافة وقراءة وحذف — أساس معظم التطبيقات. في المحطات القادمة سنرتقي بهذا للسحابة، فتتبع بيانات المستخدم عبر كل أجهزته. أحسنت صنعاً!',
              fr: "Ce que vous avez construit est un modèle « CRUD » miniature : ajouter, lire et supprimer — la base de la plupart des applications. Dans les prochaines étapes, nous élèverons cela vers le cloud, pour que les données de l'utilisateur le suivent sur tous ses appareils. Bien joué !",
              en: 'What you built is a mini "CRUD" pattern: create, read, and delete — the basis of most apps. In coming stations we\'ll raise this to the cloud, so the user\'s data follows them across all devices. Well done!',
            },
          },
        ],
      },
    ],
  },
  5: {
    title: {
      ar: 'المعجم التقني',
      fr: 'Le glossaire technique',
      en: 'The Technical Glossary',
    },
    description: {
      ar: 'ابنِ أداة تحفظ فيها المصطلحات وتعريفاتها، مع بحث حيّ',
      fr: 'Construisez un outil pour sauvegarder les termes et leurs définitions, avec une recherche en direct',
      en: 'Build a tool to save terms and their definitions, with live search',
    },
    intro: {
      ar: 'كل متعلّم يواجه مصطلحات جديدة تلتبس عليه. لماذا لا يبني مرجعه الخاص؟ في هذه المحطة سنبني معجماً شخصياً: يضيف المستخدم مصطلحاً وتعريفه، ويبحث فيه بسهولة، ويبقى محفوظاً. سنرتقي بما تعلّمته: بيانات أغنى، وبحث حيّ أثناء الكتابة. تذكّر: أنت تبني أداة تخدمك أنت أولاً.',
      fr: "Chaque apprenant rencontre de nouveaux termes qui le troublent. Pourquoi ne pas construire sa propre référence ? Dans cette étape, nous construirons un glossaire personnel : l'utilisateur ajoute un terme et sa définition, y cherche facilement, et il reste sauvegardé. Nous élèverons ce que vous avez appris : des données plus riches, et une recherche en direct pendant la saisie. Souvenez-vous : vous construisez un outil qui vous sert d'abord vous-même.",
      en: "Every learner meets new terms that confuse them. Why not build their own reference? In this station we'll build a personal glossary: the user adds a term and its definition, searches it easily, and it stays saved. We'll raise what you've learned: richer data, and live search while typing. Remember: you're building a tool that serves you first.",
    },
    sections: [
      {
        title: {
          ar: 'لماذا معجم شخصي؟',
          fr: 'Pourquoi un glossaire personnel ?',
          en: 'Why a Personal Glossary?',
        },
        subtitle: {
          ar: 'المفهوم: أداة تبنيها لتخدم تعلّمك أنت',
          fr: 'Le concept : un outil que vous construisez pour servir votre apprentissage',
          en: 'The concept: a tool you build to serve your own learning',
        },
        steps: [
          {
            type: 'text',
            text: {
              ar: 'حين تتعلّم البرمجة، تمرّ بمصطلحات كثيرة: مكوّن، حالة، خاصيّة… ومن السهل نسيانها. المعجم الشخصي حلّ جميل: كلّما التبس عليك مصطلح، تضيفه بتعريفك أنت، فيصير مرجعاً ينمو معك.',
              fr: "Quand vous apprenez la programmation, vous rencontrez beaucoup de termes : composant, état, propriété… et il est facile de les oublier. Le glossaire personnel est une belle solution : chaque fois qu'un terme vous trouble, vous l'ajoutez avec votre propre définition, et il devient une référence qui grandit avec vous.",
              en: "When you learn programming, you meet many terms: component, state, property… and they're easy to forget. A personal glossary is a beautiful solution: whenever a term confuses you, you add it with your own definition, and it becomes a reference that grows with you.",
            },
          },
          {
            type: 'tip',
            text: {
              ar: 'الأدوات التي تبنيها لنفسك هي أفضل ما تتعلّم منه — لأنك تفهم كل قطعة فيها، وتصمّمها كما يناسبك تماماً.',
              fr: "Les outils que vous construisez pour vous-même sont les meilleurs pour apprendre — car vous comprenez chaque pièce, et les concevez exactement comme il vous convient.",
              en: 'The tools you build for yourself are the best to learn from — because you understand every piece, and design them exactly to suit you.',
            },
          },
        ],
      },
      {
        title: {
          ar: 'بيانات أغنى: مصطلح وتعريف',
          fr: 'Des données plus riches : terme et définition',
          en: 'Richer Data: Term and Definition',
        },
        subtitle: {
          ar: 'كائن بحقلين بدل نصّ واحد',
          fr: 'Un objet à deux champs au lieu d\'un seul texte',
          en: 'An object with two fields instead of one text',
        },
        steps: [
          {
            type: 'text',
            text: {
              ar: 'في المحطة السابقة كان كل عنصر اسماً واحداً. المعجم يحتاج حقلين: المصطلح وتعريفه. لذا سيصير كل عنصر كائناً بحقلين. وهذا يعني حقلَي إدخال بدل واحد.',
              fr: "Dans l'étape précédente, chaque élément était un seul nom. Le glossaire a besoin de deux champs : le terme et sa définition. Donc chaque élément deviendra un objet à deux champs. Et cela signifie deux champs de saisie au lieu d'un.",
              en: "In the previous station, each item was a single name. The glossary needs two fields: the term and its definition. So each item becomes an object with two fields. And that means two input fields instead of one.",
            },
          },
          {
            type: 'instruction',
            icon: '✍️',
            text: {
              ar: 'ابنِ الأساس بحقلين وقائمة مصطلحات، في «App»:',
              fr: 'Construisez la base avec deux champs et une liste de termes, dans « App » :',
              en: 'Build the base with two fields and a terms list, in "App":',
            },
          },
          {
            type: 'codeblock',
            label: { ar: 'App.jsx', fr: 'App.jsx', en: 'App.jsx' },
            code: `import { useState } from 'react';

function App() {
  const [terms, setTerms] = useState([]);
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');

  function addTerm() {
    if (word.trim() === '' || meaning.trim() === '') return;
    const newTerm = { id: Date.now(), word: word, meaning: meaning };
    setTerms([...terms, newTerm]);
    setWord('');
    setMeaning('');
  }

  return (
    <div>
      <h1>معجمي التقني</h1>

      <input
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="المصطلح"
      />
      <input
        value={meaning}
        onChange={(e) => setMeaning(e.target.value)}
        placeholder="التعريف"
      />
      <button onClick={addTerm}>إضافة</button>

      {terms.map((term) => (
        <div key={term.id}>
          <strong>{term.word}</strong>: {term.meaning}
        </div>
      ))}
    </div>
  );
}

export default App;`,
          },
          {
            type: 'text',
            text: {
              ar: 'لاحظ: لدينا الآن ثلاث حالات — قائمة المصطلحات، وحقل المصطلح، وحقل التعريف. ودالة «addTerm» تتأكّد أن كليهما مكتوب قبل الإضافة. المبدأ نفسه من المحطة السابقة، لكن ببيانات أغنى.',
              fr: "Remarquez : nous avons maintenant trois états — la liste des termes, le champ du terme, et le champ de la définition. Et la fonction « addTerm » s'assure que les deux sont remplis avant l'ajout. Le même principe que l'étape précédente, mais avec des données plus riches.",
              en: "Notice: we now have three states — the terms list, the term field, and the definition field. And the \"addTerm\" function makes sure both are filled before adding. The same principle as the previous station, but with richer data.",
            },
          },
          {
            type: 'verify',
            text: {
              ar: 'تضيف مصطلحاً بتعريفه فيظهر في القائمة',
              fr: 'Vous ajoutez un terme avec sa définition et il apparaît dans la liste',
              en: 'You add a term with its definition and it appears in the list',
            },
            note: {
              ar: 'إن ظهر المصطلح وتعريفه معاً، فقد أتقنت التعامل مع بيانات أغنى — خطوة مهمّة نحو تطبيقات حقيقية.',
              fr: "Si le terme et sa définition apparaissent ensemble, vous avez maîtrisé la gestion de données plus riches — une étape importante vers de vraies applications.",
              en: 'If the term and its definition appear together, you\'ve mastered handling richer data — an important step toward real apps.',
            },
          },
        ],
      },
      {
        title: {
          ar: 'البحث الحيّ',
          fr: 'La recherche en direct',
          en: 'Live Search',
        },
        subtitle: {
          ar: 'التصفية أثناء الكتابة — مهارة جديدة',
          fr: 'Filtrer pendant la saisie — une nouvelle compétence',
          en: 'Filtering while typing — a new skill',
        },
        steps: [
          {
            type: 'text',
            text: {
              ar: 'حين يكبر معجمك، تحتاج بحثاً. الجميل أن البحث الحيّ يبني على «filter» الذي تعرفه: حقل بحث يحفظ ما يكتبه المستخدم، وقائمة تُصفّى لتُظهر المطابق فقط — لحظة بلحظة أثناء الكتابة.',
              fr: "Quand votre glossaire grandit, vous avez besoin d'une recherche. Le beau, c'est que la recherche en direct s'appuie sur « filter » que vous connaissez : un champ de recherche qui garde ce que l'utilisateur tape, et une liste filtrée pour n'afficher que ce qui correspond — instant après instant pendant la saisie.",
              en: "When your glossary grows, you need search. The beauty is live search builds on \"filter\" you know: a search field that holds what the user types, and a list filtered to show only matches — moment by moment while typing.",
            },
          },
          {
            type: 'instruction',
            icon: '🔍',
            text: {
              ar: 'أضف حالة للبحث، وقائمة مصفّاة تُحسب منها:',
              fr: 'Ajoutez un état pour la recherche, et une liste filtrée calculée à partir de lui :',
              en: 'Add a search state, and a filtered list computed from it:',
            },
          },
          {
            type: 'codeblock',
            label: { ar: 'البحث في App.jsx', fr: 'La recherche dans App.jsx', en: 'Search in App.jsx' },
            code: `const [search, setSearch] = useState('');

const visibleTerms = terms.filter((term) =>
  term.word.includes(search)
);`,
          },
          {
            type: 'text',
            text: {
              ar: 'المتغيّر «search» يحفظ نصّ البحث. وقائمة «visibleTerms» تُبقي المصطلحات التي يحتوي اسمها على نصّ البحث (عبر «includes»). الآن أضف حقل البحث، واعرض القائمة المصفّاة بدل الأصلية:',
              fr: "La variable « search » garde le texte de recherche. Et la liste « visibleTerms » garde les termes dont le nom contient le texte de recherche (via « includes »). Maintenant, ajoutez le champ de recherche, et affichez la liste filtrée au lieu de l'originale :",
              en: "The \"search\" variable holds the search text. And the \"visibleTerms\" list keeps terms whose name contains the search text (via \"includes\"). Now add the search field, and display the filtered list instead of the original:",
            },
          },
          {
            type: 'codeblock',
            label: { ar: 'حقل البحث والعرض', fr: 'Champ de recherche et affichage', en: 'Search field and display' },
            code: `<input
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="ابحث عن مصطلح..."
/>

{visibleTerms.map((term) => (
  <div key={term.id}>
    <strong>{term.word}</strong>: {term.meaning}
  </div>
))}`,
          },
          {
            type: 'verify',
            text: {
              ar: 'تكتب في حقل البحث فتظهر المصطلحات المطابقة فقط، لحظياً',
              fr: 'Vous tapez dans le champ de recherche et seuls les termes correspondants apparaissent, instantanément',
              en: 'You type in the search field and only matching terms appear, instantly',
            },
            note: {
              ar: 'إن تصفّت القائمة أثناء كتابتك، فقد بنيت بحثاً حيّاً — ميزة تراها في كل تطبيق احترافي. أنت تتقدّم بثبات!',
              fr: "Si la liste se filtre pendant que vous tapez, vous avez construit une recherche en direct — une fonctionnalité que vous voyez dans toute application professionnelle. Vous progressez avec constance !",
              en: 'If the list filters as you type, you\'ve built a live search — a feature you see in every professional app. You\'re advancing steadily!',
            },
          },
        ],
      },
      {
        title: {
          ar: 'اجعل معجمك دائماً',
          fr: 'Rendez votre glossaire permanent',
          en: 'Make Your Glossary Permanent',
        },
        subtitle: {
          ar: 'اربطه بالحفظ الدائم الذي تعلّمته',
          fr: 'Reliez-le à la sauvegarde permanente que vous avez apprise',
          en: 'Connect it to the permanent saving you learned',
        },
        steps: [
          {
            type: 'text',
            text: {
              ar: 'معجم يختفي عند إغلاق الصفحة لا فائدة منه. لنطبّق ما تعلّمته في محطة الحفظ الدائم: نقرأ المعجم عند البدء، ونحفظه عند كل تغيير. نفس النمط تماماً — لأنك تعلّمته جيداً.',
              fr: "Un glossaire qui disparaît à la fermeture de la page est inutile. Appliquons ce que vous avez appris dans l'étape de la sauvegarde permanente : nous lisons le glossaire au démarrage, et le sauvegardons à chaque changement. Exactement le même modèle — car vous l'avez bien appris.",
              en: "A glossary that vanishes when the page closes is useless. Let's apply what you learned in the permanent saving station: we read the glossary at startup, and save it on every change. Exactly the same pattern — because you learned it well.",
            },
          },
          {
            type: 'instruction',
            icon: '💾',
            text: {
              ar: 'استورد «useEffect»، واقرأ من الذاكرة عند البدء، واحفظ عند كل تغيير:',
              fr: 'Importez « useEffect », lisez depuis la mémoire au démarrage, et sauvegardez à chaque changement :',
              en: 'Import "useEffect", read from memory at startup, and save on every change:',
            },
          },
          {
            type: 'codeblock',
            label: { ar: 'الحفظ في App.jsx', fr: 'La sauvegarde dans App.jsx', en: 'Saving in App.jsx' },
            code: `import { useState, useEffect } from 'react';

// القيمة الأولى تُقرأ من الذاكرة:
const [terms, setTerms] = useState(() => {
  const saved = localStorage.getItem('myGlossary');
  return saved ? JSON.parse(saved) : [];
});

// الحفظ التلقائي عند كل تغيير:
useEffect(() => {
  localStorage.setItem('myGlossary', JSON.stringify(terms));
}, [terms]);`,
          },
          {
            type: 'text',
            text: {
              ar: 'لاحظ أنه نفس نمط المحطة الرابعة تماماً، لكن بمفتاح «myGlossary» بدل المشاريع. هذا جمال البناء الصحيح: تتعلّم نمطاً مرّة، وتعيد استخدامه في كل مكان.',
              fr: "Remarquez que c'est exactement le même modèle que l'étape 4, mais avec la clé « myGlossary » au lieu des projets. C'est la beauté d'une construction correcte : vous apprenez un modèle une fois, et le réutilisez partout.",
              en: "Notice it's exactly the same pattern as station 4, but with the key \"myGlossary\" instead of projects. This is the beauty of building correctly: you learn a pattern once, and reuse it everywhere.",
            },
          },
          {
            type: 'verify',
            text: {
              ar: 'أضف مصطلحات، أغلق الصفحة، أعد فتحها — يبقى معجمك كاملاً',
              fr: 'Ajoutez des termes, fermez la page, rouvrez-la — votre glossaire reste complet',
              en: 'Add terms, close the page, reopen it — your glossary stays complete',
            },
            note: {
              ar: 'مبروك! بنيت معجماً شخصياً كاملاً: إضافة، بحث حيّ، وحفظ دائم. أداة حقيقية تخدمك، بنيتها بيدك من الصفر.',
              fr: "Félicitations ! Vous avez construit un glossaire personnel complet : ajout, recherche en direct, et sauvegarde permanente. Un vrai outil qui vous sert, construit de vos mains à partir de zéro.",
              en: 'Congratulations! You built a complete personal glossary: adding, live search, and permanent saving. A real tool that serves you, built with your own hands from scratch.',
            },
          },
          {
            type: 'tip',
            text: {
              ar: 'كل ما بنيته حتى الآن — بطاقات، حفظ، بحث — هذه أدوات ستستعملها في كل مشروع مستقبلي. أنت لا تتعلّم دروساً منفصلة، بل تبني مهارات تتراكم. المحطات القادمة سترتقي بها إلى السحابة والنشر. أحسنت!',
              fr: "Tout ce que vous avez construit jusqu'ici — cartes, sauvegarde, recherche — ce sont des outils que vous utiliserez dans chaque projet futur. Vous n'apprenez pas des leçons séparées, vous bâtissez des compétences qui s'accumulent. Les prochaines étapes les élèveront vers le cloud et la publication. Bien joué !",
              en: "Everything you've built so far — cards, saving, search — these are tools you'll use in every future project. You're not learning separate lessons, you're building skills that accumulate. The coming stations will raise them to the cloud and publishing. Well done!",
            },
          },
        ],
      },
    ],
  },
};