import { useState, useEffect } from 'react';
import {
  IconUser, IconDeviceMobile, IconPlus,
  IconSparkles, IconTrash, IconPencil, IconX, IconCloud, IconCloudOff,
} from '@tabler/icons-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';
import './Dashboard.css';

const statusBg = { active: '#EEEDFE', done: '#E1F5EE', paused: '#FAEEDA' };

const emptyForm = { name: '', emoji: '📁', status: 'active', level: 'مبتدئ', platform: 'ويب', progress: 0, phase: 'المرحلة 1: التخطيط' };

export default function Dashboard() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cloudOk, setCloudOk] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const statusLabel = {
    active: t('home.statusActive'),
    done: t('home.statusDone'),
    paused: t('home.statusPaused'),
  };

  const filters = [
    { key: 'all',    label: t('home.filterAll') },
    { key: 'active', label: t('home.filterActive') },
    { key: 'done',   label: t('home.filterDone') },
    { key: 'paused', label: t('home.filterPaused') },
  ];

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
      if (error) { console.error('تعذّر حفظ التعديل:', error.message); return; }
      setProjects((prev) => prev.map((p) => (p.id === editingId ? data[0] : p)));
    } else {
      const { data, error } = await supabase
        .from('projects')
        .insert([form])
        .select();
      if (error) { console.error('تعذّرت الإضافة:', error.message); return; }
      setProjects((prev) => [...prev, data[0]]);
    }
    setShowModal(false);
  }

  async function deleteProject(id) {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) { console.error('تعذّر الحذف:', error.message); return; }
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="dashboard">
      <div className="cloud-status">
        {cloudOk ? (
          <span className="cloud-ok"><IconCloud size={14} /> {t('home.cloud')}</span>
        ) : (
          <span className="cloud-off"><IconCloudOff size={14} /> {t('home.cloudOff')}</span>
        )}
      </div>

      <div className="stats-strip">
        <div className="stat-box"><div className="stat-n">{counts.all}</div><div className="stat-l">{t('home.statProjects')}</div></div>
        <div className="stat-box"><div className="stat-n purple">{counts.active}</div><div className="stat-l">{t('home.filterActive')}</div></div>
        <div className="stat-box"><div className="stat-n teal">{counts.done}</div><div className="stat-l">{t('home.filterDone')}</div></div>
        <div className="stat-box"><div className="stat-n amber">{counts.paused}</div><div className="stat-l">{t('home.filterPaused')}</div></div>
      </div>

      <div className="tip-strip">
        <IconSparkles size={16} className="tip-icon" />
        <span>{t('home.tip')}</span>
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
        <div className="loading-state">{t('home.loading')}</div>
      ) : (
        <div className="projects-list">
          {visible.length === 0 && (
            <div className="empty-state">
              {projects.length === 0 ? t('home.empty') : t('home.emptyFilter')}
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
                  <IconPencil size={14} /> {t('home.edit')}
                </button>
                <button className="pc-action-btn danger" onClick={() => deleteProject(p.id)}>
                  <IconTrash size={14} /> {t('home.delete')}
                </button>
              </div>
            </div>
          ))}

          <button className="new-project-btn" onClick={openAdd}>
            <IconPlus size={18} /> {t('home.newBtn')}
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editingId ? t('home.modalEditTitle') : t('home.modalAddTitle')}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <IconX size={18} />
              </button>
            </div>

            <div className="modal-body">
              <label className="field">
                <span>{t('home.fieldName')}</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t('home.fieldNamePlaceholder')}
                />
              </label>

              <label className="field">
                <span>{t('home.fieldStatus')}</span>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="active">{t('home.statusActive')}</option>
                  <option value="done">{t('home.statusDone')}</option>
                  <option value="paused">{t('home.statusPaused')}</option>
                </select>
              </label>

              <label className="field">
                <span>{t('home.fieldLevel')}</span>
                <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                  <option value="مبتدئ">{t('home.levelBeginner')}</option>
                  <option value="متوسط">{t('home.levelIntermediate')}</option>
                  <option value="متقدم">{t('home.levelAdvanced')}</option>
                </select>
              </label>

              <label className="field">
                <span>{t('home.fieldPhase')}</span>
                <input
                  type="text"
                  value={form.phase}
                  onChange={(e) => setForm({ ...form, phase: e.target.value })}
                  placeholder={t('home.fieldPhasePlaceholder')}
                />
              </label>

              <label className="field">
                <span>{t('home.fieldProgress')}: {form.progress}%</span>
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
              <button className="btn-secondary" onClick={() => setShowModal(false)}>{t('home.cancel')}</button>
              <button className="btn-primary" onClick={saveProject}>
                {editingId ? t('home.saveEdit') : t('home.saveAdd')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}