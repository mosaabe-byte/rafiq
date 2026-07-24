import { Link } from 'react-router-dom';
import { IconArrowRight, IconShieldLock } from '@tabler/icons-react';
import { useLanguage } from '../i18n/LanguageContext';
import { privacyPolicy, PRIVACY_VERSION } from '../data/privacyPolicy';
import './Privacy.css';

export default function Privacy() {
  const { lang, t } = useLanguage();
  const policy = privacyPolicy[lang] || privacyPolicy.ar;

  return (
    <div className="privacy-page">
      <Link to="/profile" className="privacy-back">
        <IconArrowRight size={18} /> {t('privacy.back')}
      </Link>

      <div className="privacy-header">
        <div className="privacy-icon"><IconShieldLock size={26} /></div>
        <h1>{policy.title}</h1>
        <p className="privacy-updated">{policy.updated} · {t('privacy.version')} {PRIVACY_VERSION}</p>
      </div>

      <div className="privacy-body">
        {policy.sections.map((s, i) => (
          <div key={i} className="privacy-section">
            {s.h && <h2>{s.h}</h2>}
            <p>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}