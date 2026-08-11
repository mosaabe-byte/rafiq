import { useState, useEffect } from 'react';
import { IconUpload, IconLoader2, IconFile, IconPhoto, IconFileText, IconDownload, IconTrash } from '@tabler/icons-react';
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
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  // جلب ملفّات المكتبة
  async function loadFiles() {
    if (!user) return;
    setLoadingFiles(true);
    const { data } = await supabase
      .from('library_files')
      .select('id, project_id, name, path, size, type, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setFiles(data || []);
    setLoadingFiles(false);
  }

  useEffect(() => {
    loadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      loadFiles();
      setFile(null);
      setSelectedProject('');
    } catch (err) {
      console.error('تعذّر الرفع:', err.message);
      setMessage({ type: 'error', text: 'تعذّر رفع الملفّ. تحقّق من اتصالك وحاول مجدّداً.' });
    } finally {
      setUploading(false);
    }
  }

  // تجميع الملفّات حسب المشروع
  function groupedFiles() {
    const groups = {};
    files.forEach((f) => {
      const key = f.project_id || 'general';
      if (!groups[key]) groups[key] = [];
      groups[key].push(f);
    });
    return groups;
  }

  // اسم المشروع من معرّفه
  function projectName(pid) {
    if (!pid) return 'عامّ (غير مرتبط بمشروع)';
    const p = projects.find((pr) => pr.id === pid);
    return p ? `${p.emoji || '📁'} ${p.name}` : 'مشروع';
  }

  // أيقونة نوع الملفّ
  function fileIcon(type) {
    if (type?.startsWith('image/')) return '🖼️';
    if (type === 'application/pdf') return '📄';
    return '📝';
  }

  // حجم مقروء
  function readableSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  // تنزيل/فتح ملفّ (رابط موقّع مؤقّت، لأن الـbucket خاصّ)
  async function handleDownload(f) {
    const { data, error } = await supabase.storage
      .from('library')
      .createSignedUrl(f.path, 60); // صالح 60 ثانية
    if (error || !data?.signedUrl) {
      console.error('تعذّر إنشاء رابط التنزيل:', error?.message);
      return;
    }
    window.open(data.signedUrl, '_blank');
  }

  // حذف موثوق: من التخزين والجدول معاً
  async function handleDelete(f) {
    if (deleting) return;
    setDeleting(true);
    try {
      // 1) حذف من التخزين
      const { error: stErr } = await supabase.storage.from('library').remove([f.path]);
      if (stErr) throw stErr;

      // 2) حذف من الجدول
      const { error: dbErr } = await supabase.from('library_files').delete().eq('id', f.id);
      if (dbErr) throw dbErr;

      // نجح الاثنان: نحدّث الواجهة
      setFiles((prev) => prev.filter((x) => x.id !== f.id));
      setConfirmDelete(null);
    } catch (err) {
      console.error('تعذّر الحذف:', err.message);
      setMessage({ type: 'error', text: 'تعذّر حذف الملفّ. تحقّق من اتصالك وحاول مجدّداً.' });
    } finally {
      setDeleting(false);
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
      <div className="lib-files-section">
        <h2 className="lib-files-title">ملفّاتي</h2>
        {loadingFiles ? (
          <p className="lib-empty">جارٍ التحميل...</p>
        ) : files.length === 0 ? (
          <p className="lib-empty">مكتبتك فارغة بعد — ارفع أوّل ملفّ ليظهر هنا.</p>
        ) : (
          Object.entries(groupedFiles()).map(([key, groupFiles]) => (
            <div key={key} className="lib-group">
              <div className="lib-group-header">
                {projectName(key === 'general' ? null : Number(key))}
                <span className="lib-group-count">{groupFiles.length}</span>
              </div>
              <div className="lib-files-list">
                {groupFiles.map((f) => (
                  <div key={f.id} className="lib-file-row">
                    <button className="lib-file-btn" onClick={() => handleDownload(f)} title="تنزيل">
                      <IconDownload size={18} />
                    </button>
                    <button className="lib-file-btn danger" onClick={() => setConfirmDelete(f)} title="حذف">
                      <IconTrash size={18} />
                    </button>
                    <span className="lib-file-icon">{fileIcon(f.type)}</span>
                    <div className="lib-file-info">
                      <div className="lib-file-name">{f.name}</div>
                      <div className="lib-file-meta">{readableSize(f.size)}</div>
                    </div>
                    <button className="lib-file-btn" onClick={() => handleDownload(f)} title="تنزيل">
                      <IconDownload size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      {confirmDelete && (
        <div className="lib-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="lib-modal" onClick={(e) => e.stopPropagation()}>
            <h3>حذف الملفّ</h3>
            <p>هل تريد حقاً حذف «{confirmDelete.name}»؟ لا يمكن التراجع.</p>
            <div className="lib-modal-actions">
              <button className="lib-modal-cancel" onClick={() => setConfirmDelete(null)} disabled={deleting}>
                إلغاء
              </button>
              <button className="lib-modal-confirm" onClick={() => handleDelete(confirmDelete)} disabled={deleting}>
                {deleting ? 'جارٍ الحذف...' : 'نعم، احذف'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}