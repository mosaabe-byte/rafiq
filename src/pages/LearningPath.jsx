import { Link } from 'react-router-dom';
import { IconChevronLeft } from '@tabler/icons-react';
import { useLanguage } from '../i18n/LanguageContext';
import { t } from '../data/learningContent';
import './LearningPath.css';

const PAGE = {
  title: { ar: 'رحلة التعلّم', fr: "Parcours d'apprentissage", en: 'Learning Path' },
  subtitle: {
    ar: 'من جهاز فارغ إلى تطبيق منشور — 13 محطة، خطوة فوق خطوة',
    fr: "D'une machine vide à une application publiée — 13 étapes, pas à pas",
    en: 'From an empty machine to a published app — 13 stations, step by step',
  },
};

// الجلسات الـ13 — مخّ التجربة: من جهاز فارغ إلى تطبيق منشور — ثلاثية اللغة
const sessions = [
  {
    n: 1,
    title: { ar: 'إعداد البيئة', fr: "Configuration de l'environnement", en: 'Environment Setup' },
    sub: {
      ar: 'تثبيت Node.js و VS Code، إنشاء أول مشروع، أول تشغيل محلي',
      fr: 'Installation de Node.js et VS Code, création du premier projet, premier lancement local',
      en: 'Installing Node.js and VS Code, creating your first project, first local run',
    },
  },
  {
    n: 2,
    title: { ar: 'بناء الهيكل', fr: 'Construire la structure', en: 'Building the Structure' },
    sub: {
      ar: 'المكتبات، المجلدات، الملفات، التنقّل — مع المفاهيم قبل الكود',
      fr: 'Bibliothèques, dossiers, fichiers, navigation — les concepts avant le code',
      en: 'Libraries, folders, files, navigation — concepts before code',
    },
  },
  {
    n: 3,
    title: { ar: 'لوحة المشاريع الحيّة', fr: 'Tableau de bord des projets', en: 'Live Projects Dashboard' },
    sub: {
      ar: 'بطاقات، إحصاءات، نصيحة يومية، فلترة، أشرطة تقدّم',
      fr: 'Cartes, statistiques, astuce du jour, filtrage, barres de progression',
      en: 'Cards, statistics, daily tip, filtering, progress bars',
    },
  },
  {
    n: 4,
    title: { ar: 'الحفظ الدائم', fr: 'La sauvegarde persistante', en: 'Persistent Storage' },
    sub: {
      ar: 'إضافة وتعديل وحذف المشاريع وبقاؤها بعد الإغلاق',
      fr: 'Ajouter, modifier et supprimer des projets qui persistent après fermeture',
      en: 'Adding, editing, and deleting projects that persist after closing',
    },
  },
  {
    n: 5,
    title: { ar: 'المعجم التقني', fr: 'Le lexique technique', en: 'The Technical Glossary' },
    sub: {
      ar: 'قلب رفيق: 18 مصطلحاً، بحث فوري، نطق صوتي، تصنيفات',
      fr: "Le cœur de Rafiq : 18 termes, recherche instantanée, prononciation audio, catégories",
      en: "Rafiq's core: 18 terms, instant search, audio pronunciation, categories",
    },
  },
  {
    n: 6,
    title: { ar: 'ملف المطوّر', fr: 'Le profil développeur', en: 'Developer Profile' },
    sub: {
      ar: 'الإنجازات الحقيقية، سجلّ الرحلة، ترابط الشاشات',
      fr: 'Réalisations réelles, journal du parcours, liens entre les écrans',
      en: 'Real achievements, journey log, screen interconnections',
    },
  },
  {
    n: 7,
    title: { ar: 'القاعدة السحابية', fr: 'La base cloud', en: 'Cloud Database' },
    sub: {
      ar: 'Supabase: مشاريعك من أي جهاز — تحقيق الرؤية الأصلية',
      fr: "Supabase : vos projets depuis n'importe quel appareil — la vision originale enfin réalisée",
      en: 'Supabase: your projects from any device — the original vision realized',
    },
  },
  {
    n: 8,
    title: { ar: 'النشر الأول', fr: 'La première publication', en: 'First Deployment' },
    sub: {
      ar: 'رفيق للعالم — أول رابط حيّ على الإنترنت',
      fr: 'Rafiq pour le monde — votre premier lien en ligne',
      en: 'Rafiq to the world — your first live link',
    },
  },
  {
    n: 9,
    title: { ar: 'شاشة الفكرة', fr: "L'écran de l'idée", en: 'Idea Screen' },
    sub: {
      ar: 'محادثة موجّهة تحوّل فكرة غامضة إلى مشروع',
      fr: 'Une conversation guidée qui transforme une idée vague en projet',
      en: 'A guided conversation that turns a vague idea into a project',
    },
  },
  {
    n: 10,
    title: { ar: 'لصق الفكرة', fr: 'Coller votre idée', en: 'Paste Your Idea' },
    sub: {
      ar: 'وضع ثانٍ لشاشة جديد — الصق فكرتك جاهزة',
      fr: "Un second mode pour l'écran « nouveau » — collez votre idée déjà prête",
      en: 'A second mode for the "new" screen — paste your idea ready-made',
    },
  },
  {
    n: 11,
    title: { ar: 'رفع الكود إلى GitHub', fr: 'Publier le code sur GitHub', en: 'Pushing Code to GitHub' },
    sub: {
      ar: 'احفظ رفيق في الغيمة — نسخة آمنة دائمة',
      fr: 'Sauvegardez Rafiq dans le cloud — une copie sûre et permanente',
      en: 'Save Rafiq to the cloud — a safe, permanent copy',
    },
  },
  {
    n: 12,
    title: { ar: 'النشر التلقائي', fr: 'Le déploiement automatique', en: 'Automatic Deployment' },
    sub: {
      ar: 'ربط Vercel: git push ينشر تلقائياً',
      fr: 'Connexion à Vercel : git push publie automatiquement',
      en: 'Connecting Vercel: git push deploys automatically',
    },
  },
  {
    n: 13,
    title: { ar: 'شاشة الطريق', fr: "L'écran de la feuille de route", en: 'Roadmap Screen' },
    sub: {
      ar: 'المراحل السبع — اكتمال الشاشات الخمس',
      fr: 'Les sept étapes — l\'achèvement des cinq écrans',
      en: 'The seven phases — completion of the five screens',
    },
  },
];

export default function LearningPath() {
  const { lang } = useLanguage();

  return (
    <div className="learnpath">
      <div className="learnpath-header">
        <h1>{t(PAGE.title, lang)}</h1>
        <p>{t(PAGE.subtitle, lang)}</p>
      </div>

      <div className="sessions-list">
        {sessions.map((s) => (
          <Link
            key={s.n}
            to={'/learn/' + s.n}
            className="session-card"
          >
            <div className="session-num">{s.n}</div>
            <div className="session-body">
              <div className="session-title">{t(s.title, lang)}</div>
              <div className="session-sub">{t(s.sub, lang)}</div>
            </div>
            <IconChevronLeft size={18} className="session-arrow" />
          </Link>
        ))}
      </div>
    </div>
  );
}