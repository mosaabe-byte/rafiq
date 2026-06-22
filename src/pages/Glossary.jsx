import { useState, useEffect } from 'react';
import { IconSearch, IconVolume, IconPlus, IconTrash, IconX, IconLoader2 } from '@tabler/icons-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthContext';
import './Glossary.css';

// المصطلحات الأساسية (معجم رفيق المشترك للجميع)
const baseTerms = [
  { en: 'Wireframe', ph: 'وَيِر-فْرِيم', ar: 'المخطط الهيكلي', def: 'رسم بسيط يُظهر تخطيط الشاشة دون ألوان أو تفاصيل — مثل مخطط منزل قبل البناء.', tags: ['تصميم', 'تخطيط'] },
  { en: 'UI Kit', ph: 'يُو-آي كِيت', ar: 'مجموعة عناصر الواجهة', def: 'مجموعة جاهزة من الأزرار والألوان والخطوط تُستخدم لتوحيد شكل التطبيق.', tags: ['تصميم'] },
  { en: 'Data Model', ph: 'دَيتَا مودِل', ar: 'نموذج البيانات', def: 'خريطة تُوضح البيانات التي يتعامل معها التطبيق وعلاقاتها — مثل: طالب له درجات.', tags: ['بيانات', 'تخطيط'] },
  { en: 'Component', ph: 'كومبونِنت', ar: 'مكوّن', def: 'قطعة مستقلة من الواجهة قابلة لإعادة الاستخدام — مثل زر أو بطاقة أو شريط تنقل.', tags: ['برمجة', 'React'] },
  { en: 'State', ph: 'سْتَيت', ar: 'الحالة', def: 'ذاكرة المكوّن — البيانات التي يتذكرها ويتغير شكله عند تغيّرها، مثل الفلتر المختار.', tags: ['برمجة', 'React'] },
  { en: 'Props', ph: 'بْروبس', ar: 'الخصائص الممرَّرة', def: 'بيانات يمررها مكوّن أب إلى مكوّن ابن — مثل تمرير اسم المشروع إلى البطاقة.', tags: ['برمجة', 'React'] },
  { en: 'Routing', ph: 'رَاوتِنج', ar: 'التوجيه', def: 'نظام يقرر أي صفحة تظهر حسب العنوان — الذي بنيناه في شريط التنقل السفلي.', tags: ['برمجة', 'تنقل'] },
  { en: 'localStorage', ph: 'لوكَال سْتورِج', ar: 'التخزين المحلي', def: 'مخزن صغير داخل المتصفح يحفظ البيانات على جهازك حتى بعد إغلاق التطبيق.', tags: ['بيانات', 'متصفح'] },
  { en: 'Responsive', ph: 'رِسبونسِف', ar: 'متجاوب', def: 'تصميم يتكيف تلقائياً مع حجم الشاشة سواء هاتف أو حاسوب.', tags: ['تصميم', 'CSS'] },
  { en: 'Database', ph: 'دَيتَا-بِيس', ar: 'قاعدة البيانات', def: 'المكان الذي تُخزَّن فيه البيانات بشكل منظم ليمكن استرجاعها وتعديلها.', tags: ['بيانات', 'خادم'] },
  { en: 'CRUD', ph: 'كْرود', ar: 'إنشاء · قراءة · تعديل · حذف', def: 'العمليات الأربع الأساسية على أي بيانات: Create, Read, Update, Delete — التي بنيناها في لوحة المشاريع.', tags: ['برمجة', 'بيانات'] },
  { en: 'Auth', ph: 'أوث', ar: 'المصادقة', def: 'نظام يتحقق من هوية المستخدم قبل السماح له بالوصول — تسجيل الدخول.', tags: ['أمان'] },
  { en: 'API', ph: 'إِي-بِي-آي', ar: 'واجهة البرمجة', def: 'قناة تتيح لتطبيقَين التحدث مع بعضهما وتبادل البيانات.', tags: ['برمجة', 'خادم'] },
  { en: 'Deployment', ph: 'دِبلويمِنت', ar: 'النشر', def: 'عملية رفع المشروع على الإنترنت ليصبح متاحاً للجميع.', tags: ['نشر'] },
  { en: 'Git', ph: 'جِت', ar: 'نظام إدارة النسخ', def: 'أداة تحفظ تاريخ تعديلاتك وتتيح الرجوع لأي نسخة سابقة من الكود.', tags: ['أدوات'] },
  { en: 'Terminal', ph: 'تِرمِنَال', ar: 'الطرفية', def: 'نافذة الأوامر النصية — التي استخدمتها لتشغيل npm run dev.', tags: ['أدوات'] },
  { en: 'npm', ph: 'إن-بي-إم', ar: 'مدير الحزم', def: 'أداة تثبيت المكتبات الجاهزة — كل npm install يجلب كوداً كتبه مطورون آخرون.', tags: ['أدوات'] },
  { en: 'Hot Reload', ph: 'هوت ريلود', ar: 'التحديث الفوري', def: 'تحديث التطبيق في المتصفح تلقائياً فور حفظ الملف — دون إعادة تحميل يدوية.', tags: ['أدوات', 'تطوير'] },
];

const emptyForm = { en: '', ph: '', ar: '', def: '', context: '', example: '', tags: '' };

export default function Glossary() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [personalTerms, setPersonalTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

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
    ...personalTerms.map((t) => ({ ...t, source: 'personal' })),
    ...baseTerms.map((t) => ({ ...t, source: 'base' })),
  ];

  const q = query.trim().toLowerCase();
  const visible = !q
    ? allTerms
    : allTerms.filter(
        (t) =>
          t.en.toLowerCase().includes(q) ||
          (t.ar || '').includes(query.trim()) ||
          (t.def || '').includes(query.trim()) ||
          (t.tags || []).some((tag) => tag.includes(query.trim()))
      );

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
      setFormError('المصطلح الإنجليزي والترجمة والتعريف حقول مطلوبة.');
      return;
    }

    // فحص التكرار (في الأساسي والشخصي)
    const existsInBase = baseTerms.some((t) => t.en.toLowerCase() === en.toLowerCase());
    const existsInPersonal = personalTerms.some((t) => t.en.toLowerCase() === en.toLowerCase());
    if (existsInBase || existsInPersonal) {
      setFormError(`المصطلح «${en}» موجود مسبقاً في المعجم.`);
      return;
    }

    setSaving(true);
    setFormError('');

    const tagsArray = form.tags
      .split(/[,،]/)
      .map((t) => t.trim())
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
        setFormError(`المصطلح «${en}» موجود مسبقاً في معجمك.`);
      } else {
        setFormError('تعذّر الحفظ. حاول مرة أخرى.');
      }
      return;
    }

    setPersonalTerms((prev) => [data, ...prev]);
    setForm(emptyForm);
    setShowForm(false);
  }

  async function deleteTerm(id) {
    const { error } = await supabase.from('glossary_terms').delete().eq('id', id);
    if (!error) setPersonalTerms((prev) => prev.filter((t) => t.id !== id));
  }

  const personalCount = personalTerms.length;

  return (
    <div className="glossary">
      <div className="glossary-header">
        <h1>المعجم التقني</h1>
        <p>
          {baseTerms.length} مصطلحاً أساسياً
          {personalCount > 0 && ` + ${personalCount} من إضافتك`}
        </p>
      </div>

      <div className="search-wrap">
        <IconSearch size={17} className="search-icon" />
        <input
          type="text"
          placeholder="ابحث بالعربية أو الإنجليزية..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <button className="add-term-btn" onClick={() => { setShowForm(true); setFormError(''); }}>
        <IconPlus size={16} /> أضف مصطلحاً التبس عليك
      </button>

      {showForm && (
        <div className="term-form">
          <div className="form-head">
            <span>مصطلح جديد في معجمك</span>
            <button className="form-close" onClick={() => { setShowForm(false); setForm(emptyForm); setFormError(''); }}>
              <IconX size={16} />
            </button>
          </div>

          <input className="form-input" placeholder="المصطلح بالإنجليزية * (مثل: Frontend)"
            value={form.en} onChange={(e) => setForm({ ...form, en: e.target.value })} />
          <input className="form-input" placeholder="النطق بحروف عربية (مثل: فْرونت-إند)"
            value={form.ph} onChange={(e) => setForm({ ...form, ph: e.target.value })} />
          <input className="form-input" placeholder="الترجمة العربية * (مثل: الواجهة الأمامية)"
            value={form.ar} onChange={(e) => setForm({ ...form, ar: e.target.value })} />
          <textarea className="form-input form-textarea" placeholder="تعريف مبسّط * — اشرحه بكلماتك أو بتشبيه"
            value={form.def} onChange={(e) => setForm({ ...form, def: e.target.value })} />
          <input className="form-input" placeholder="في سياقنا (اختياري) — أين قابلتَ هذا المصطلح؟"
            value={form.context} onChange={(e) => setForm({ ...form, context: e.target.value })} />
          <input className="form-input" placeholder="مثال ملموس (اختياري)"
            value={form.example} onChange={(e) => setForm({ ...form, example: e.target.value })} />
          <input className="form-input" placeholder="وسوم مفصولة بفاصلة (اختياري) — مثل: برمجة، خادم"
            value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />

          {formError && <div className="form-error">{formError}</div>}

          <button className="form-save" onClick={saveTerm} disabled={saving}>
            {saving ? (<><IconLoader2 size={16} className="spin" /> جارٍ الحفظ...</>) : 'احفظ في معجمي'}
          </button>
        </div>
      )}

      <div className="terms-count">
        {loading
          ? 'جارٍ تحميل معجمك...'
          : visible.length === 0
          ? 'لا توجد نتائج — جرّب كلمة أخرى'
          : visible.length + ' مصطلحاً'}
      </div>

      <div className="terms-list">
        {visible.map((t) => (
          <div key={t.source === 'personal' ? t.id : 'base-' + t.en} className="term-card">
            <div className="term-head">
              <span className="term-en">{t.en}</span>
              {t.ph && <span className="term-ph">{t.ph}</span>}
              <button className="speak-btn" onClick={() => speak(t.en)} title="استمع للنطق">
                <IconVolume size={15} />
              </button>
              {t.source === 'personal' && <span className="term-badge">أضفتُه</span>}
              {t.source === 'personal' && (
                <button className="term-delete" onClick={() => deleteTerm(t.id)} title="حذف">
                  <IconTrash size={14} />
                </button>
              )}
            </div>
            <div className="term-ar">{t.ar}</div>
            <div className="term-def">{t.def}</div>
            {t.context && <div className="term-context">📍 في سياقنا: {t.context}</div>}
            {t.example && <div className="term-example">💡 مثال: {t.example}</div>}
            {(t.tags || []).length > 0 && (
              <div className="term-tags">
                {t.tags.map((tag) => (
                  <button key={tag} className="term-tag" onClick={() => setQuery(tag)}>
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}