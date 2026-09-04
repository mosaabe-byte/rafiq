import { useState, useEffect } from 'react';
import { IconUpload, IconLoader2, IconFile, IconPhoto, IconFileText, IconDownload, IconTrash } from '@tabler/icons-react';
import { supabase } from '../lib/supabase';
import { indexFileChunks, searchLibrary } from "../lib/embedding";
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import './Library.css';
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const MAX_SIZE = 10 * 1024 * 1024; // 10 ميغابايت
const ACCEPTED = '.pdf,.txt,.md,.png,.jpg,.jpeg';

// استخراج نصّ ملفّ PDF في المتصفّح (لجعله قابلاً للقراءة والإرفاق)
async function extractPdfText(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((it) => it.str).join(" ") + "\n";
  }
  return text.trim();
}

export default function Library() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();

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

      // استخراج نصّ الملفّ إن أمكن (للقراءة والإرفاق لاحقاً)
      let contentText = null;
      const isText = file.type.startsWith('text/') || /\.(txt|md)$/i.test(file.name);
      const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
      if (isText) {
        try {
          contentText = await file.text();
        } catch (e) {
          console.error('تعذّر استخراج النصّ:', e.message);
        }
      } else if (isPdf) {
        try {
          contentText = await extractPdfText(file);
        } catch (e) {
          console.error('تعذّر استخراج نصّ PDF:', e.message);
        }
      }

      // 2) تسجيله في الجدول (مع إرجاع id لربط المقاطع به)
      const { data: inserted, error: dbErr } = await supabase
        .from('library_files')
        .insert({
          user_id: user.id,
          project_id: selectedProject ? Number(selectedProject) : null,
          name: file.name,
          path,
          size: file.size,
          type: file.type || null,
          content_text: contentText,
        })
        .select('id')
        .single();
      if (dbErr) {
        // تراجع: نحذف الملفّ المرفوع إن فشل التسجيل (لا نترك ملفّاً يتيماً)
        await supabase.storage.from('library').remove([path]);
        throw dbErr;
      }

      // 3) فهرسة المقاطع للبحث الدلاليّ (RAG) — إن كان للملفّ نصّ مستخرَج
      if (contentText && contentText.trim()) {
        setMessage({ type: 'success', text: `تمّ رفع «${file.name}» — جارٍ فهرسته للبحث...` });
        try {
          await indexFileChunks(inserted.id, user.id, contentText);
        } catch (e) {
          console.error('تعذّر فهرسة الملفّ:', e.message);
        }
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
        <h1>{t('library.title')}</h1>
        <p className="lib-sub">{t('library.sub')}</p>
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
          <span>{file ? file.name : t('library.pickFile')}</span>
          <span className="lib-hint">{t('library.hint')}</span>
        </label>

        <label className="lib-field">
          <span>{t('library.whichProject')}</span>
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
            <option value="">{t('library.general')}</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>
            ))}
          </select>
        </label>

        {message.text && (
          <div className={'lib-message ' + message.type}>{message.text}</div>
        )}

        <button className="lib-upload-btn" onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? (<><IconLoader2 size={18} className="spin" />{t('library.uploading')}</>) : (<><IconUpload size={18} />{t('library.uploadBtn')}</>)}
        </button>
      </div>
      <div className="lib-files-section">
        <h2 className="lib-files-title">{t('library.myFiles')}</h2>
        {loadingFiles ? (
          <p className="lib-empty">{t('library.loading')}</p>
        ) : files.length === 0 ? (
          <p className="lib-empty">{t('library.empty')}</p>
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
                    <span className="lib-file-icon">{fileIcon(f.type)}</span>
                    <div className="lib-file-info">
                      <div className="lib-file-name">{f.name}</div>
                      <div className="lib-file-meta">{readableSize(f.size)}</div>
                    </div>
                    <button className="lib-file-btn" onClick={() => handleDownload(f)} title={t('library.download')}>
                      <IconDownload size={18} />
                    </button>
                    <button className="lib-file-btn danger" onClick={() => setConfirmDelete(f)} title={t('library.delete')}>
                      <IconTrash size={18} />
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
            <h3>{t('library.deleteTitle')}</h3>
            <p>{t('library.deleteWarn').replace('{name}', confirmDelete.name)}</p>
            <div className="lib-modal-actions">
              <button className="lib-modal-cancel" onClick={() => setConfirmDelete(null)} disabled={deleting}>
                {t('library.cancel')}
              </button>
              <button className="lib-modal-confirm" onClick={() => handleDelete(confirmDelete)} disabled={deleting}>
                {deleting ? t('library.deleting') : 'نعم، احذف'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}