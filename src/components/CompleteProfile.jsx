import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { COUNTRIES } from '../data/countries';
import './CompleteProfile.css';

export default function CompleteProfile() {
  const { updateProfile } = useAuth();
  const { t, lang } = useLanguage();
  const [country, setCountry] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [saving, setSaving] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= currentYear - 100; y--) years.push(y);

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    await updateProfile({
      country: country || 'not_specified',
      birth_year: birthYear ? Number(birthYear) : null,
    });
    setSaving(false);
  }

  return (
    <div className="cp-overlay">
      <div className="cp-card">
        <div className="cp-logo">ر</div>
        <h2>{t('completeProfile.title')}</h2>
        <p className="cp-intro">{t('completeProfile.intro')}</p>

        <label className="cp-field">
          <span>{t('completeProfile.country')}</span>
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">{t('completeProfile.selectCountry')}</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c[lang] || c.en}</option>
            ))}
            <option value="not_specified">{t('completeProfile.preferNotSay')}</option>
          </select>
        </label>

        <label className="cp-field">
          <span>{t('completeProfile.birthYear')}</span>
          <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)}>
            <option value="">{t('completeProfile.preferNotSay')}</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </label>

        <button className="cp-save" onClick={handleSave} disabled={saving}>
          {saving ? t('completeProfile.saving') : t('completeProfile.save')}
        </button>
        <p className="cp-note">{t('completeProfile.note')}</p>
      </div>
    </div>
  );
}