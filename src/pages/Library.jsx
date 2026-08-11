import { useState, useEffect } from 'react';
import { IconUpload, IconLoader2, IconFile, IconPhoto, IconFileText } from '@tabler/icons-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import './Library.css';

const MAX_SIZE = 10 * 1024 * 1024; // 10 ميغابايت
const ACCEPTED = '.pdf,.txt,.md,.png,.jpg,.jpeg';

export default function Library() {
  const { user } = useAuth();
  const { lang } = useLanguage();

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(''); // '' = عام
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // تحميل مشاريع المستخدم (للتصنيف)
  useEffect(() => {
    if (!user) return;
    async function loadProjects() {
      const { data } = await supabase
        .from('projects')
        .select('id, name, emoji')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setProjects(data);
    }
    loadProjects();
  }, [user]);

  function onPickFile(e) {
    const f = e.target.files?.[0];
    setMessage({ type: '', text: '' });
    if (!f) return;
    if (f.size > MAX_SIZE) {
      setMessage({ type: 'error', text: 'الملفّ كبير جداً — الحدّ الأقصى 10 ميغابايت.' });
      return;
    }
    setFile(f);
    // تنبيه واعٍ عند الصور
    if (f.type.startsWith('image/')) {
      setMessage({
        type: 'info',
        text: 'الصور تُخزَّن للعرض والرجوع إليها. قراءة رفيق البصرية للصور ميزة قادمة، وقد تستهلك موارد أكثر.',
      });
    }
  }

  async function handleUpload() {
    if (!file || !user || uploading) return;
    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      // المسار: {user.id}/{timestamp}_{filename} — يطابق سياسات الأمان
      const safeName = file.name.replace(/[^\w.\-]/g, '_');
      const path = `${user.id}/${Date.now()}_${safeName}`;

      // 1) رفع الملفّ إلى التخزين
      const { error: upErr } = await supabase.storage
        .from('library')
        .upload(path, file);
      if (upErr) throw upErr;

      // 2) تسجيله في الجدول
      const { error: dbErr } = await supabase.from('library_files').insert({
        user_id: user.id,
        project_id: selectedProject ? Number(selectedProject) : null,
        name: file.name,
        path,
        size: file.size,
        type: file.type || null,
      });
      if (dbErr) {
        // تراجع: نحذف الملفّ المرفوع إن فشل التسجيل (لا نترك ملفّاً يتيماً)
        await supabase.storage.from('library').remove([path]);
        throw dbErr;
      }

      setMessage({ type: 'success', text: `تمّ رفع «${file.name}» بنجاح!` });
      setFile(null);
      setSelectedProject('');
    } catch (err) {
      console.error('تعذّر الرفع:', err.message);
      setMessage({ type: 'error', text: 'تعذّر رفع الملفّ. تحقّق من اتصالك وحاول مجدّداً.' });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="library">
      <div className="lib-header">
        <h1>مكتبتي</h1>
        <p className="lib-sub">ارفع ملفّاتك ومراجعك، صنّفها حسب مشاريعك، وسيقرؤها رفيق حين تحتاج.</p>
      </div>

      <div className="lib-upload-card">
        <label className="lib-dropzone">
          <input
            type="file"
            accept={ACCEPTED}
            onChange={onPickFile}
            hidden
          />
          <IconUpload size={28} />
          <span>{file ? file.name : 'اختر ملفّاً للرفع'}</span>
          <span className="lib-hint">PDF، نصوص، أو صور — حتّى 10 ميغابايت</span>
        </label>

        <label className="lib-field">
          <span>لأيّ مشروع؟</span>
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
            <option value="">عامّ (غير مرتبط بمشروع)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>
            ))}
          </select>
        </label>

        {message.text && (
          <div className={'lib-message ' + message.type}>{message.text}</div>
        )}

        <button className="lib-upload-btn" onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? (<><IconLoader2 size={18} className="spin" /> جارٍ الرفع...</>) : (<><IconUpload size={18} /> ارفع إلى مكتبتي</>)}
        </button>
      </div>
    </div>
  );
}