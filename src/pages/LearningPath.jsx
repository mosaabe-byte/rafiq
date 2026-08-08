import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconChevronLeft, IconCheck } from '@tabler/icons-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthContext';
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
  progressLabel: {
    ar: 'أكملت {done} من {total} محطة',
    fr: 'Vous avez complété {done} sur {total} étapes',
    en: 'You completed {done} of {total} stations',
  },
};

export const sessions = [
  { n: 1, title: { ar: 'إعداد البيئة', fr: "Configuration de l'environnement", en: 'Environment Setup' }, sub: { ar: 'تثبيت Node.js و VS Code، إنشاء أول مشروع، أول تشغيل محلي', fr: 'Installation de Node.js et VS Code, création du premier projet, premier lancement local', en: 'Installing Node.js and VS Code, creating your first project, first local run' } },
  { n: 2, title: { ar: 'بناء الهيكل', fr: 'Construire la structure', en: 'Building the Structure' }, sub: { ar: 'المكتبات، المجلدات، الملفات، التنقّل — مع المفاهيم قبل الكود', fr: 'Bibliothèques, dossiers, fichiers, navigation — les concepts avant le code', en: 'Libraries, folders, files, navigation — concepts before code' } },
  { n: 3, title: { ar: 'لوحة المشاريع الحيّة', fr: 'Tableau de bord des projets', en: 'Live Projects Dashboard' }, sub: { ar: 'بطاقات، إحصاءات، نصيحة يومية، فلترة، أشرطة تقدّم', fr: 'Cartes, statistiques, astuce du jour, filtrage, barres de progression', en: 'Cards, statistics, daily tip, filtering, progress bars' } },
  { n: 4, title: { ar: 'الحفظ الدائم', fr: 'La sauvegarde persistante', en: 'Persistent Storage' }, sub: { ar: 'إضافة وتعديل وحذف المشاريع وبقاؤها بعد الإغلاق', fr: 'Ajouter, modifier et supprimer des projets qui persistent après fermeture', en: 'Adding, editing, and deleting projects that persist after closing' } },
  { n: 5, title: { ar: 'المعجم التقني', fr: 'Le lexique technique', en: 'The Technical Glossary' }, sub: { ar: 'قلب رفيق: 18 مصطلحاً، بحث فوري، نطق صوتي، تصنيفات', fr: "Le cœur de Rafiq : 18 termes, recherche instantanée, prononciation audio, catégories", en: "Rafiq's core: 18 terms, instant search, audio pronunciation, categories" } },
  { n: 6, title: { ar: 'ملف المطوّر', fr: 'Le profil développeur', en: 'Developer Profile' }, sub: { ar: 'الإنجازات الحقيقية، سجلّ الرحلة، ترابط الشاشات', fr: 'Réalisations réelles, journal du parcours, liens entre les écrans', en: 'Real achievements, journey log, screen interconnections' } },
  { n: 7, title: { ar: 'القاعدة السحابية', fr: 'La base cloud', en: 'Cloud Database' }, sub: { ar: 'Supabase: مشاريعك من أي جهاز — تحقيق الرؤية الأصلية', fr: "Supabase : vos projets depuis n'importe quel appareil — la vision originale enfin réalisée", en: 'Supabase: your projects from any device — the original vision realized' } },
  { n: 8, title: { ar: 'النشر الأول', fr: 'La première publication', en: 'First Deployment' }, sub: { ar: 'رفيق للعالم — أول رابط حيّ على الإنترنت', fr: 'Rafiq pour le monde — votre premier lien en ligne', en: 'Rafiq to the world — your first live link' } },
  { n: 9, title: { ar: 'من الفكرة إلى الخطّة', fr: "De l'idée au plan", en: 'From Idea to Plan' }, sub: { ar: 'حوّل فكرة غامضة إلى خطّة واضحة بميزات قابلة للتنفيذ', fr: 'Transformez une idée vague en un plan clair avec des fonctionnalités réalisables', en: 'Turn a vague idea into a clear plan with actionable features' } },
  { n: 10, title: { ar: 'تحسين التصميم والتجربة', fr: "Améliorer le design et l'expérience", en: 'Improving Design and Experience' }, sub: { ar: 'اجعل واجهتك أجمل وأوضح: الألوان، التباعد، الرسائل الواضحة', fr: "Rendez votre interface plus belle et plus claire : couleurs, espacement, messages clairs", en: 'Make your interface prettier and clearer: colors, spacing, clear messages' } },
  { n: 11, title: { ar: 'رفع الكود إلى GitHub', fr: 'Publier le code sur GitHub', en: 'Pushing Code to GitHub' }, sub: { ar: 'احفظ رفيق في الغيمة — نسخة آمنة دائمة', fr: 'Sauvegardez Rafiq dans le cloud — une copie sûre et permanente', en: 'Save Rafiq to the cloud — a safe, permanent copy' } },
  { n: 12, title: { ar: 'النشر التلقائي', fr: 'Le déploiement automatique', en: 'Automatic Deployment' }, sub: { ar: 'ربط Vercel: git push ينشر تلقائياً', fr: 'Connexion à Vercel : git push publie automatiquement', en: 'Connecting Vercel: git push deploys automatically' } },
  { n: 13, title: { ar: 'رحلتك القادمة', fr: 'Votre prochain voyage', en: 'Your Next Journey' }, sub: { ar: 'راجع ما تعلّمته، واكتشف كيف تواصل النموّ بنفسك', fr: 'Révisez ce que vous avez appris, et découvrez comment continuer à grandir par vous-même', en: "Review what you've learned, and discover how to keep growing on your own" } },
];

export default function LearningPath() {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function loadCompletions() {
      const { data, error } = await supabase
        .from('station_completions')
        .select('station_number')
        .eq('user_id', user.id);

      if (!cancelled && !error && data) {
        setCompleted(data.map((r) => r.station_number));
      }
    }

    loadCompletions();
    return () => { cancelled = true; };
  }, [user]);

  const doneCount = completed.length;
  const progressText = t(PAGE.progressLabel, lang)
    .replace('{done}', doneCount)
    .replace('{total}', sessions.length);

  return (
    <div className="learnpath">
      <div className="learnpath-header">
        <h1>{t(PAGE.title, lang)}</h1>
        <p>{t(PAGE.subtitle, lang)}</p>
      </div>

      <div className="learnpath-progress">
        <div className="lp-progress-bar">
          <div
            className="lp-progress-fill"
            style={{ width: (doneCount / sessions.length) * 100 + '%' }}
          />
        </div>
        <div className="lp-progress-text">{progressText}</div>
      </div>

      <div className="sessions-list">
        {sessions.map((s) => {
          const isDone = completed.includes(s.n);
          return (
            <Link
              key={s.n}
              to={'/learn/' + s.n}
              className={'session-card' + (isDone ? ' done' : '')}
            >
              <div className={'session-num' + (isDone ? ' done' : '')}>
                {isDone ? <IconCheck size={18} /> : s.n}
              </div>
              <div className="session-body">
                <div className="session-title">{t(s.title, lang)}</div>
                <div className="session-sub">{t(s.sub, lang)}</div>
              </div>
              <IconChevronLeft size={18} className="session-arrow" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}