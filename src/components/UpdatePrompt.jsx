import { useRegisterSW } from 'virtual:pwa-register/react';
import { useLanguage } from '../i18n/LanguageContext';
import './UpdatePrompt.css';

export default function UpdatePrompt() {
  const { t } = useLanguage();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="update-prompt">
      <span className="update-prompt-text">{t('update.available')}</span>
      <button
        className="update-prompt-btn"
        onClick={() => updateServiceWorker(true)}
      >
        {t('update.reload')}
      </button>
      <button
        className="update-prompt-close"
        onClick={() => setNeedRefresh(false)}
        aria-label={t('update.dismiss')}
      >
        ✕
      </button>
    </div>
  );
}