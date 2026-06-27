import { useState, useEffect } from 'react';
import { IconSearch, IconVolume, IconPlus, IconTrash, IconX, IconLoader2 } from '@tabler/icons-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { t as tf } from '../data/learningContent';
import './Glossary.css';

// المصطلحات الأساسية (معجم رفيق المشترك للجميع) — ثلاثية اللغة
// ph: نطق بحروف عربية، يُعرض فقط حين تكون لغة الواجهة عربية
const baseTerms = [
  { en: 'Wireframe', ph: { ar: 'وَيِر-فْرِيم' },
    translation: { ar: 'المخطط الهيكلي', fr: 'Maquette filaire', en: 'Wireframe' },
    def: { ar: 'رسم بسيط يُظهر تخطيط الشاشة دون ألوان أو تفاصيل — مثل مخطط منزل قبل البناء.', fr: "Un dessin simple qui montre l'agencement de l'écran sans couleurs ni détails — comme le plan d'une maison avant sa construction.", en: 'A simple drawing that shows the screen layout without colors or details — like a house blueprint before construction.' },
    tags: { ar: ['تصميم', 'تخطيط'], fr: ['Design', 'Planification'], en: ['Design', 'Planning'] } },

  { en: 'UI Kit', ph: { ar: 'يُو-آي كِيت' },
    translation: { ar: 'مجموعة عناصر الواجهة', fr: "Kit d'interface", en: 'UI Kit' },
    def: { ar: 'مجموعة جاهزة من الأزرار والألوان والخطوط تُستخدم لتوحيد شكل التطبيق.', fr: "Un ensemble prêt à l'emploi de boutons, couleurs et polices utilisé pour unifier l'apparence de l'application.", en: "A ready-made set of buttons, colors, and fonts used to unify the app's appearance." },
    tags: { ar: ['تصميم'], fr: ['Design'], en: ['Design'] } },

  { en: 'Data Model', ph: { ar: 'دَيتَا مودِل' },
    translation: { ar: 'نموذج البيانات', fr: 'Modèle de données', en: 'Data Model' },
    def: { ar: 'خريطة تُوضح البيانات التي يتعامل معها التطبيق وعلاقاتها — مثل: طالب له درجات.', fr: 'Un schéma qui montre les données traitées par une application et leurs relations — par exemple : un étudiant a des notes.', en: 'A map showing the data an app works with and how it relates — for example: a student has grades.' },
    tags: { ar: ['بيانات', 'تخطيط'], fr: ['Données', 'Planification'], en: ['Data', 'Planning'] } },

  { en: 'Component', ph: { ar: 'كومبونِنت' },
    translation: { ar: 'مكوّن', fr: 'Composant', en: 'Component' },
    def: { ar: 'قطعة مستقلة من الواجهة قابلة لإعادة الاستخدام — مثل زر أو بطاقة أو شريط تنقل.', fr: 'Un élément autonome de l\'interface, réutilisable — comme un bouton, une carte ou une barre de navigation.', en: 'An independent, reusable piece of the interface — like a button, a card, or a navigation bar.' },
    tags: { ar: ['برمجة', 'React'], fr: ['Programmation', 'React'], en: ['Programming', 'React'] } },

  { en: 'State', ph: { ar: 'سْتَيت' },
    translation: { ar: 'الحالة', fr: 'État (State)', en: 'State' },
    def: { ar: 'ذاكرة المكوّن — البيانات التي يتذكرها ويتغير شكله عند تغيّرها، مثل الفلتر المختار.', fr: "La mémoire du composant — les données qu'il retient et qui changent son apparence lorsqu'elles changent, comme le filtre sélectionné.", en: "A component's memory — the data it remembers, which changes its appearance when it changes, like the selected filter." },
    tags: { ar: ['برمجة', 'React'], fr: ['Programmation', 'React'], en: ['Programming', 'React'] } },

  { en: 'Props', ph: { ar: 'بْروبس' },
    translation: { ar: 'الخصائص الممرَّرة', fr: 'Props', en: 'Props' },
    def: { ar: 'بيانات يمررها مكوّن أب إلى مكوّن ابن — مثل تمرير اسم المشروع إلى البطاقة.', fr: "Des données transmises par un composant parent à un composant enfant — comme transmettre le nom du projet à une carte.", en: 'Data passed from a parent component to a child component — like passing a project name to a card.' },
    tags: { ar: ['برمجة', 'React'], fr: ['Programmation', 'React'], en: ['Programming', 'React'] } },

  { en: 'Routing', ph: { ar: 'رَاوتِنج' },
    translation: { ar: 'التوجيه', fr: 'Routage', en: 'Routing' },
    def: { ar: 'نظام يقرر أي صفحة تظهر حسب العنوان — الذي بنيناه في شريط التنقل السفلي.', fr: "Un système qui décide quelle page afficher selon l'adresse — celui que nous avons construit dans la barre de navigation.", en: 'A system that decides which page to show based on the URL — the one we built into the bottom navigation bar.' },
    tags: { ar: ['برمجة', 'تنقل'], fr: ['Programmation', 'Navigation'], en: ['Programming', 'Navigation'] } },

  { en: 'localStorage', ph: { ar: 'لوكَال سْتورِج' },
    translation: { ar: 'التخزين المحلي', fr: 'Stockage local', en: 'localStorage' },
    def: { ar: 'مخزن صغير داخل المتصفح يحفظ البيانات على جهازك حتى بعد إغلاق التطبيق.', fr: 'Un petit espace de stockage dans le navigateur qui conserve les données sur votre appareil même après la fermeture de l\'application.', en: 'A small storage space inside the browser that keeps data on your device even after closing the app.' },
    tags: { ar: ['بيانات', 'متصفح'], fr: ['Données', 'Navigateur'], en: ['Data', 'Browser'] } },

  { en: 'Responsive', ph: { ar: 'رِسبونسِف' },
    translation: { ar: 'متجاوب', fr: 'Responsive', en: 'Responsive' },
    def: { ar: 'تصميم يتكيف تلقائياً مع حجم الشاشة سواء هاتف أو حاسوب.', fr: "Un design qui s'adapte automatiquement à la taille de l'écran, qu'il s'agisse d'un téléphone ou d'un ordinateur.", en: 'A design that automatically adapts to screen size, whether on a phone or a computer.' },
    tags: { ar: ['تصميم', 'CSS'], fr: ['Design', 'CSS'], en: ['Design', 'CSS'] } },

  { en: 'Database', ph: { ar: 'دَيتَا-بِيس' },
    translation: { ar: 'قاعدة البيانات', fr: 'Base de données', en: 'Database' },
    def: { ar: 'المكان الذي تُخزَّن فيه البيانات بشكل منظم ليمكن استرجاعها وتعديلها.', fr: "L'endroit où les données sont stockées de manière organisée afin de pouvoir les récupérer et les modifier.", en: 'The place where data is stored in an organized way so it can be retrieved and modified.' },
    tags: { ar: ['بيانات', 'خادم'], fr: ['Données', 'Serveur'], en: ['Data', 'Server'] } },

  { en: 'CRUD', ph: { ar: 'كْرود' },
    translation: { ar: 'إنشاء · قراءة · تعديل · حذف', fr: 'Créer · Lire · Modifier · Supprimer', en: 'Create · Read · Update · Delete' },
    def: { ar: 'العمليات الأربع الأساسية على أي بيانات: Create, Read, Update, Delete — التي بنيناها في لوحة المشاريع.', fr: "Les quatre opérations de base sur n'importe quelle donnée : Create, Read, Update, Delete — celles que nous avons construites dans le tableau de bord des projets.", en: 'The four basic operations on any data: Create, Read, Update, Delete — the ones we built into the projects dashboard.' },
    tags: { ar: ['برمجة', 'بيانات'], fr: ['Programmation', 'Données'], en: ['Programming', 'Data'] } },

  { en: 'Auth', ph: { ar: 'أوث' },
    translation: { ar: 'المصادقة', fr: 'Authentification', en: 'Auth' },
    def: { ar: 'نظام يتحقق من هوية المستخدم قبل السماح له بالوصول — تسجيل الدخول.', fr: "Un système qui vérifie l'identité de l'utilisateur avant de lui permettre l'accès — la connexion.", en: "A system that verifies a user's identity before allowing access — signing in." },
    tags: { ar: ['أمان'], fr: ['Sécurité'], en: ['Security'] } },

  { en: 'API', ph: { ar: 'إِي-بِي-آي' },
    translation: { ar: 'واجهة البرمجة', fr: 'API', en: 'API' },
    def: { ar: 'قناة تتيح لتطبيقَين التحدث مع بعضهما وتبادل البيانات.', fr: "Un canal qui permet à deux applications de communiquer entre elles et d'échanger des données.", en: 'A channel that lets two applications talk to each other and exchange data.' },
    tags: { ar: ['برمجة', 'خادم'], fr: ['Programmation', 'Serveur'], en: ['Programming', 'Server'] } },

  { en: 'Deployment', ph: { ar: 'دِبلويمِنت' },
    translation: { ar: 'النشر', fr: 'Déploiement', en: 'Deployment' },
    def: { ar: 'عملية رفع المشروع على الإنترنت ليصبح متاحاً للجميع.', fr: 'Le processus de mise en ligne du projet pour le rendre accessible à tous.', en: 'The process of putting the project online to make it accessible to everyone.' },
    tags: { ar: ['نشر'], fr: ['Déploiement'], en: ['Deployment'] } },

  { en: 'Git', ph: { ar: 'جِت' },
    translation: { ar: 'نظام إدارة النسخ', fr: 'Système de gestion de versions', en: 'Version control system' },
    def: { ar: 'أداة تحفظ تاريخ تعديلاتك وتتيح الرجوع لأي نسخة سابقة من الكود.', fr: "Un outil qui conserve l'historique de vos modifications et permet de revenir à n'importe quelle version antérieure du code.", en: 'A tool that keeps the history of your changes and lets you go back to any earlier version of the code.' },
    tags: { ar: ['أدوات'], fr: ['Outils'], en: ['Tools'] } },

  { en: 'Terminal', ph: { ar: 'تِرمِنَال' },
    translation: { ar: 'الطرفية', fr: 'Terminal', en: 'Terminal' },
    def: { ar: 'نافذة الأوامر النصية — التي استخدمتها لتشغيل npm run dev.', fr: 'La fenêtre de commandes textuelles — celle que vous avez utilisée pour lancer npm run dev.', en: 'The text command window — the one you used to run npm run dev.' },
    tags: { ar: ['أدوات'], fr: ['Outils'], en: ['Tools'] } },

  { en: 'npm', ph: { ar: 'إن-بي-إم' },
    translation: { ar: 'مدير الحزم', fr: 'Gestionnaire de paquets', en: 'Package manager' },
    def: { ar: 'أداة تثبيت المكتبات الجاهزة — كل npm install يجلب كوداً كتبه مطورون آخرون.', fr: "Un outil d'installation de bibliothèques prêtes à l'emploi — chaque npm install récupère du code écrit par d'autres développeurs.", en: 'A tool for installing ready-made libraries — every npm install fetches code written by other developers.' },
    tags: { ar: ['أدوات'], fr: ['Outils'], en: ['Tools'] } },

  { en: 'Hot Reload', ph: { ar: 'هوت ريلود' },
    translation: { ar: 'التحديث الفوري', fr: 'Rechargement à chaud', en: 'Hot Reload' },
    def: { ar: 'تحديث التطبيق في المتصفح تلقائياً فور حفظ الملف — دون إعادة تحميل يدوية.', fr: "La mise à jour automatique de l'application dans le navigateur dès l'enregistrement du fichier — sans rechargement manuel.", en: 'Automatically updating the app in the browser as soon as the file is saved — without a manual reload.' },
    tags: { ar: ['أدوات', 'تطوير'], fr: ['Outils', 'Développement'], en: ['Tools', 'Development'] } },
];

const emptyForm = { en: '', ph: '', ar: '', def: '', context: '', example: '', tags: '' };

export default function Glossary() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [personalTerms, setPersonalTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [generating, setGenerating] = useState(false);

  // استبدال {n} أو {term} داخل نص الترجمة
  function tt(key, vars) {
    let str = t(key);
    if (vars) {
      Object.keys(vars).forEach((k) => {
        str = str.replace('{' + k + '}', vars[k]);
      });
    }
    return str;
  }

  async function askRafiqToDefine() {
    const termText = form.en.trim();
    if (!termText) {
      setFormError(t('glossary.errTermFirst'));
      return;
    }
    setGenerating(true);
    setFormError('');
    try {
      const res = await fetch('/api/define', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term: termText, lang }),
      });
      const data = await res.json();
      if (data.result) {
        const r = data.result;
        setForm((prev) => ({
          ...prev,
          en: r.en || prev.en,
          ph: r.ph || '',
          ar: r.ar || '',
          def: r.def || '',
          example: r.example || '',
          tags: Array.isArray(r.tags) ? r.tags.join('، ') : '',
        }));
      } else {
        setFormError(data.error || t('glossary.errGenFailed'));
      }
    } catch (e) {
      setFormError(t('glossary.errConnFailed'));
    } finally {
      setGenerating(false);
    }
  }

  // تحميل المصطلحات الشخصية
  useEffect(() => {
    if (!user) return;
    async function loadPersonal() {
      setLoading(true);
      const { data, error } = await supabase
        .from('glossary_terms')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setPersonalTerms(data);
      setLoading(false);
    }
    loadPersonal();
  }, [user]);

  // دمج المصدرين: الأساسي + الشخصي (مع وسم المصدر)
  const allTerms = [
    ...personalTerms.map((term) => ({ ...term, source: 'personal' })),
    ...baseTerms.map((term) => ({ ...term, source: 'base' })),
  ];

  const q = query.trim().toLowerCase();
  const visible = !q
    ? allTerms
    : allTerms.filter((term) => {
        if (term.source === 'personal') {
          return (
            term.en.toLowerCase().includes(q) ||
            (term.ar || '').includes(query.trim()) ||
            (term.def || '').includes(query.trim()) ||
            (term.tags || []).some((tag) => tag.includes(query.trim()))
          );
        }
        const translation = tf(term.translation, lang);
        const def = tf(term.def, lang);
        const tags = term.tags[lang] || term.tags.ar;
        return (
          term.en.toLowerCase().includes(q) ||
          translation.includes(query.trim()) ||
          def.includes(query.trim()) ||
          tags.some((tag) => tag.includes(query.trim()))
        );
      });

  function speak(text) {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.85;
      speechSynthesis.speak(u);
    } catch (e) {
      console.error('النطق غير مدعوم في هذا المتصفح', e);
    }
  }

  async function saveTerm() {
    const en = form.en.trim();
    const ar = form.ar.trim();
    const def = form.def.trim();

    if (!en || !ar || !def) {
      setFormError(t('glossary.errRequiredFields'));
      return;
    }

    // فحص التكرار (في الأساسي والشخصي)
    const existsInBase = baseTerms.some((term) => term.en.toLowerCase() === en.toLowerCase());
    const existsInPersonal = personalTerms.some((term) => term.en.toLowerCase() === en.toLowerCase());
    if (existsInBase || existsInPersonal) {
      setFormError(tt('glossary.errExistsBase', { term: en }));
      return;
    }

    setSaving(true);
    setFormError('');

    const tagsArray = form.tags
      .split(/[,،]/)
      .map((tag) => tag.trim())
      .filter(Boolean);

    const { data, error } = await supabase
      .from('glossary_terms')
      .insert({
        user_id: user.id,
        en,
        ph: form.ph.trim() || null,
        ar,
        def,
        context: form.context.trim() || null,
        example: form.example.trim() || null,
        tags: tagsArray,
      })
      .select()
      .single();

    setSaving(false);

    if (error) {
      // قد يكون خطأ التكرار من قيد قاعدة البيانات
      if (error.code === '23505') {
        setFormError(tt('glossary.errExistsPersonal', { term: en }));
      } else {
        setFormError(t('glossary.errSaveFailed'));
      }
      return;
    }

    setPersonalTerms((prev) => [data, ...prev]);
    setForm(emptyForm);
    setShowForm(false);
  }

  async function deleteTerm(id) {
    const { error } = await supabase.from('glossary_terms').delete().eq('id', id);
    if (!error) setPersonalTerms((prev) => prev.filter((term) => term.id !== id));
  }

  const personalCount = personalTerms.length;

  return (
    <div className="glossary">
      <div className="glossary-header">
        <h1>{t('glossary.title')}</h1>
        <p>
          {tt('glossary.countBase', { n: baseTerms.length })}
          {personalCount > 0 && ' ' + tt('glossary.countPersonal', { n: personalCount })}
        </p>
      </div>

      <div className="search-wrap">
        <IconSearch size={17} className="search-icon" />
        <input
          type="text"
          placeholder={t('glossary.searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <button className="add-term-btn" onClick={() => { setShowForm(true); setFormError(''); }}>
        <IconPlus size={16} /> {t('glossary.addTermBtn')}
      </button>

      {showForm && (
        <div className="term-form">
          <div className="form-head">
            <span>{t('glossary.formHead')}</span>
            <button className="form-close" onClick={() => { setShowForm(false); setForm(emptyForm); setFormError(''); }}>
              <IconX size={16} />
            </button>
          </div>

          <input className="form-input" placeholder={t('glossary.enPlaceholder')}
            value={form.en} onChange={(e) => setForm({ ...form, en: e.target.value })} />

          <button className="ask-rafiq-define" onClick={askRafiqToDefine} disabled={generating}>
            {generating ? (<><IconLoader2 size={15} className="spin" /> {t('glossary.generatingText')}</>) : t('glossary.askRafiqBtn')}
          </button>
          <div className="define-hint">{t('glossary.defineHint')}</div>

          <input className="form-input" placeholder={t('glossary.phPlaceholder')}
            value={form.ph} onChange={(e) => setForm({ ...form, ph: e.target.value })} />
          <input className="form-input" placeholder={t('glossary.translationPlaceholder')}
            value={form.ar} onChange={(e) => setForm({ ...form, ar: e.target.value })} />
          <textarea className="form-input form-textarea" placeholder={t('glossary.defPlaceholder')}
            value={form.def} onChange={(e) => setForm({ ...form, def: e.target.value })} />
          <input className="form-input" placeholder={t('glossary.contextPlaceholder')}
            value={form.context} onChange={(e) => setForm({ ...form, context: e.target.value })} />
          <input className="form-input" placeholder={t('glossary.examplePlaceholder')}
            value={form.example} onChange={(e) => setForm({ ...form, example: e.target.value })} />
          <input className="form-input" placeholder={t('glossary.tagsPlaceholder')}
            value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />

          {formError && <div className="form-error">{formError}</div>}

          <button className="form-save" onClick={saveTerm} disabled={saving}>
            {saving ? (<><IconLoader2 size={16} className="spin" /> {t('glossary.savingText')}</>) : t('glossary.saveBtn')}
          </button>
        </div>
      )}

      <div className="terms-count">
        {loading
          ? t('glossary.loadingText')
          : visible.length === 0
          ? t('glossary.noResults')
          : tt('glossary.countTerms', { n: visible.length })}
      </div>

      <div className="terms-list">
        {visible.map((term) => {
          const isBase = term.source === 'base';
          const translation = isBase ? tf(term.translation, lang) : term.ar;
          const def = isBase ? tf(term.def, lang) : term.def;
          const tags = isBase ? (term.tags[lang] || term.tags.ar) : (term.tags || []);
          const ph = isBase ? (lang === 'ar' ? term.ph?.ar : null) : term.ph;

          return (
            <div key={term.source === 'personal' ? term.id : 'base-' + term.en} className="term-card">
              <div className="term-head">
                <span className="term-en">{term.en}</span>
                {ph && <span className="term-ph">{ph}</span>}
                <button className="speak-btn" onClick={() => speak(term.en)} title={t('glossary.listenTitle')}>
                  <IconVolume size={15} />
                </button>
                {term.source === 'personal' && <span className="term-badge">{t('glossary.addedBadge')}</span>}
                {term.source === 'personal' && (
                  <button className="term-delete" onClick={() => deleteTerm(term.id)} title={t('glossary.deleteTitle')}>
                    <IconTrash size={14} />
                  </button>
                )}
              </div>
              <div className="term-ar">{translation}</div>
              <div className="term-def">{def}</div>
              {term.context && <div className="term-context">📍 {t('glossary.contextPrefix')} {term.context}</div>}
              {term.example && <div className="term-example">💡 {t('glossary.examplePrefix')} {term.example}</div>}
              {tags.length > 0 && (
                <div className="term-tags">
                  {tags.map((tag) => (
                    <button key={tag} className="term-tag" onClick={() => setQuery(tag)}>
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}