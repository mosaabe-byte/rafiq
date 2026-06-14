import { useState, useEffect } from 'react';
import {
  IconUser, IconDeviceMobile, IconPlus,
  IconSparkles, IconTrash, IconPencil, IconX, IconCloud, IconCloudOff,
} from '@tabler/icons-react';
import { supabase } from '../lib/supabase';
import './Dashboard.css';

const statusLabel = { active: 'جارٍ', done: 'مكتمل', paused: 'متوقف' };
const statusBg = { active: '#EEEDFE', done: '#E1F5EE', paused: '#FAEEDA' };
const filters = [
  { key: 'all', label: 'الكل' },
  { key: 'active', label: 'جارية' },
  { key: 'done', label: 'مكتملة' },
  { key: 'paused', label: 'متوقفة' },
];

const emptyForm = { name: '', emoji: '📁', status: 'active', level: 'مبتدئ', platform: 'ويب', progress: 0, phase: 'المرحلة 1: التخطيط' };

export default function Dashboard() {
  const [filter, setFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cloudOk, setCloudOk] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // تحميل المشاريع من السحابة عند فتح الصفحة
  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('تعذّر الاتصال بالسحابة:', error.message);
        setCloudOk(false);
      } else {
        setProjects(data || []);
        setCloudOk(true);
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  const counts = {
    all: projects.length,
    active: projects.filter((p) => p.status === 'active').length,
    done: projects.filter((p) => p.status === 'done').length,
    paused: projects.filter((p) => p.status === 'paused').length,
  };

  const visible = filter === 'all' ? projects : projects.filter((p) => p.status === filter);

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(project) {
    setEditingId(project.id);
    setForm({
      name: project.name,
      emoji: project.emoji,
      status: project.status,
      level: project.level,
      platform: project.platform,
      progress: project.progress,
      phase: project.phase,
    });
    setShowModal(true);
  }

  async function saveProject() {
    if (!form.name.trim()) return;

    if (editingId) {
      const { data, error } = await supabase
        .from('projects')
        .update(form)
        .eq('id', editingId)
        .select();
      if (error) {
        console.error('تعذّر حفظ التعديل:', error.message);
        return;
      }
      setProjects((prev) => prev.map((p) => (p.id === editingId ? data[0] : p)));
    } else {
      const { data, error } = await supabase
        .from('projects')
        .insert([form])
        .select();
      if (error) {
        console.error('تعذّرت الإضافة:', error.message);
        return;
      }
      setProjects((prev) => [...prev, data[0]]);
    }
    setShowModal(false);
  }

  async function deleteProject(id) {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      console.error('تعذّر الحذف:', error.message);
      return;
    }
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="dashboard">
      <div className="cloud-status">
        {cloudOk ? (
          <span className="cloud-ok"><IconCloud size={14} /> متصل بالسحابة — مشاريعك محفوظة من أي جهاز</span>
        ) : (
          <span className="cloud-off"><IconCloudOff size={14} /> غير متصل — تحقق من إعداد Supabase</span>
        )}
      </div>

      <div className="stats-strip">
        <div className="stat-box"><div className="stat-n">{counts.all}</div><div className="stat-l">مشاريع</div></div>
        <div className="stat-box"><div className="stat-n purple">{counts.active}</div><div className="stat-l">جارية</div></div>
        <div className="stat-box"><div className="stat-n teal">{counts.done}</div><div className="stat-l">مكتملة</div></div>
        <div className="stat-box"><div className="stat-n amber">{counts.paused}</div><div className="stat-l">متوقفة</div></div>
      </div>

      <div className="tip-strip">
        <IconSparkles size={16} className="tip-icon" />
        <span>نصيحة اليوم: أكمل مرحلة واحدة في مشروع قائم قبل أن تبدأ مشروعاً جديداً.</span>
      </div>

      <div className="filter-row">
        {filters.map((f) => (
          <button
            key={f.key}
            className={'filter-btn' + (filter === f.key ? ' active' : '')}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-state">جارٍ تحميل مشاريعك من السحابة...</div>
      ) : (
        <div className="projects-list">
          {visible.length === 0 && (
            <div className="empty-state">
              {projects.length === 0
                ? 'لا توجد مشاريع بعد — أضف أول مشروع لك'
                : 'لا توجد مشاريع في هذه الفئة'}
            </div>
          )}

          {visible.map((p) => (
            <div key={p.id} className="project-card">
              <div className="pc-top">
                <div className="pc-emoji" style={{ background: statusBg[p.status] }}>{p.emoji}</div>
                <div className="pc-info">
                  <div className="pc-name">{p.name}</div>
                  <div className="pc-meta">
                    <span><IconUser size={12} /> {p.level}</span>
                    <span><IconDeviceMobile size={12} /> {p.platform}</span>
                  </div>
                </div>
                <span className={'pc-badge badge-' + p.status}>{statusLabel[p.status]}</span>
              </div>
              <div className="pc-prog">
                <div className="pc-prog-hdr">
                  <span>{p.phase}</span>
                  <span className="pct">{p.progress}%</span>
                </div>
                <div className="pc-track">
                  <div className={'pc-fill fill-' + p.status} style={{ width: p.progress + '%' }} />
                </div>
              </div>
              <div className="pc-actions">
                <button className="pc-action-btn" onClick={() => openEdit(p)}>
                  <IconPencil size={14} /> تعديل
                </button>
                <button className="pc-action-btn danger" onClick={() => deleteProject(p.id)}>
                  <IconTrash size={14} /> حذف
                </button>
              </div>
            </div>
          ))}

          <button className="new-project-btn" onClick={openAdd}>
            <IconPlus size={18} /> مشروع جديد
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editingId ? 'تعديل المشروع' : 'مشروع جديد'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <IconX size={18} />
              </button>
            </div>

            <div className="modal-body">
              <label className="field">
                <span>اسم المشروع</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="مثال: تطبيق إدارة المهام"
                />
              </label>

              <label className="field">
                <span>الحالة</span>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="active">جارٍ</option>
                  <option value="done">مكتمل</option>
                  <option value="paused">متوقف</option>
                </select>
              </label>

              <label className="field">
                <span>المستوى</span>
                <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                  <option value="مبتدئ">مبتدئ</option>
                  <option value="متوسط">متوسط</option>
                  <option value="متقدم">متقدم</option>
                </select>
              </label>

              <label className="field">
                <span>المرحلة</span>
                <input
                  type="text"
                  value={form.phase}
                  onChange={(e) => setForm({ ...form, phase: e.target.value })}
                  placeholder="مثال: المرحلة 1: التخطيط"
                />
              </label>

              <label className="field">
                <span>نسبة الإنجاز: {form.progress}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={form.progress}
                  onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
                />
              </label>
            </div>

            <div className="modal-foot">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>إلغاء</button>
              <button className="btn-primary" onClick={saveProject}>
                {editingId ? 'حفظ التعديلات' : 'إضافة المشروع'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


