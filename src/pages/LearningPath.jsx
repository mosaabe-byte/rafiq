import { useState } from 'react';
import { IconCircleCheck, IconCircleDashed, IconChevronLeft } from '@tabler/icons-react';
import './LearningPath.css';

// الجلسات الـ13 — مخّ التجربة: من جهاز فارغ إلى تطبيق منشور
const sessions = [
  { n: 1,  title: 'إعداد البيئة', sub: 'تثبيت Node.js و VS Code، إنشاء أول مشروع، أول تشغيل محلي' },
  { n: 2,  title: 'بناء الهيكل', sub: 'المكتبات، المجلدات، الملفات، التنقّل — مع المفاهيم قبل الكود' },
  { n: 3,  title: 'لوحة المشاريع الحيّة', sub: 'بطاقات، إحصاءات، نصيحة يومية، فلترة، أشرطة تقدّم' },
  { n: 4,  title: 'الحفظ الدائم', sub: 'إضافة وتعديل وحذف المشاريع وبقاؤها بعد الإغلاق' },
  { n: 5,  title: 'المعجم التقني', sub: 'قلب رفيق: 18 مصطلحاً، بحث فوري، نطق صوتي، تصنيفات' },
  { n: 6,  title: 'ملف المطوّر', sub: 'الإنجازات الحقيقية، سجلّ الرحلة، ترابط الشاشات' },
  { n: 7,  title: 'القاعدة السحابية', sub: 'Supabase: مشاريعك من أي جهاز — تحقيق الرؤية الأصلية' },
  { n: 8,  title: 'النشر الأول', sub: 'رفيق للعالم — أول رابط حيّ على الإنترنت' },
  { n: 9,  title: 'شاشة الفكرة', sub: 'محادثة موجّهة تحوّل فكرة غامضة إلى مشروع' },
  { n: 10, title: 'لصق الفكرة', sub: 'وضع ثانٍ لشاشة جديد — الصق فكرتك جاهزة' },
  { n: 11, title: 'رفع الكود إلى GitHub', sub: 'احفظ رفيق في الغيمة — نسخة آمنة دائمة' },
  { n: 12, title: 'النشر التلقائي', sub: 'ربط Vercel: git push ينشر تلقائياً' },
  { n: 13, title: 'شاشة الطريق', sub: 'المراحل السبع — اكتمال الشاشات الخمس' },
];

export default function LearningPath() {
  const [openSession, setOpenSession] = useState(null);

  return (
    <div className="learnpath">
      <div className="learnpath-header">
        <h1>رحلة التعلّم</h1>
        <p>من جهاز فارغ إلى تطبيق منشور — 13 محطة، خطوة فوق خطوة</p>
      </div>

      <div className="sessions-list">
        {sessions.map((s) => (
          <button
            key={s.n}
            className={'session-card' + (openSession === s.n ? ' open' : '')}
            onClick={() => setOpenSession(openSession === s.n ? null : s.n)}
          >
            <div className="session-num">{s.n}</div>
            <div className="session-body">
              <div className="session-title">{s.title}</div>
              <div className="session-sub">{s.sub}</div>
            </div>
            <IconChevronLeft size={18} className="session-arrow" />
          </button>
        ))}
      </div>
    </div>
  );
}