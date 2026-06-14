import { useState } from 'react';
import { IconSearch, IconVolume } from '@tabler/icons-react';
import './Glossary.css';

const terms = [
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

export default function Glossary() {
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const visible = !q
    ? terms
    : terms.filter(
        (t) =>
          t.en.toLowerCase().includes(q) ||
          t.ar.includes(query.trim()) ||
          t.def.includes(query.trim()) ||
          t.tags.some((tag) => tag.includes(query.trim()))
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

  return (
    <div className="glossary">
      <div className="glossary-header">
        <h1>المعجم التقني</h1>
        <p>{terms.length} مصطلحاً — المصطلح الإنجليزي بنطقه ومعناه بالعربية</p>
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

      <div className="terms-count">
        {visible.length === 0
          ? 'لا توجد نتائج — جرّب كلمة أخرى'
          : visible.length + ' من ' + terms.length + ' مصطلحاً'}
      </div>

      <div className="terms-list">
        {visible.map((t) => (
          <div key={t.en} className="term-card">
            <div className="term-head">
              <span className="term-en">{t.en}</span>
              <span className="term-ph">{t.ph}</span>
              <button className="speak-btn" onClick={() => speak(t.en)} title="استمع للنطق">
                <IconVolume size={15} />
              </button>
            </div>
            <div className="term-ar">{t.ar}</div>
            <div className="term-def">{t.def}</div>
            <div className="term-tags">
              {t.tags.map((tag) => (
                <button key={tag} className="term-tag" onClick={() => setQuery(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
