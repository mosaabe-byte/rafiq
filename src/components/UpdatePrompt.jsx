import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './UpdatePrompt.css';

export default function UpdatePrompt() {
  const { t } = useLanguage();
  const [waiting, setWaiting] = useState(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    let reg = null;

    navigator.serviceWorker.getRegistration().then((r) => {
      if (!r) return;
      reg = r;

      if (r.waiting) setWaiting(r.waiting);

      r.addEventListener('updatefound', () => {
        const sw = r.installing;
        if (!sw) return;
        sw.addEventListener('statechange', () => {
          if (sw.state === 'installed' && navigator.serviceWorker.controller) {
            setWaiting(sw);
          }
        });
      });
    });

    const timer = setInterval(() => reg?.update(), 60000);
    const onFocus = () => reg?.update();
    window.addEventListener('focus', onFocus);

    let reloaded = false;
    const onChange = () => {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onChange);

    return () => {
      clearInterval(timer);
      navigator.serviceWorker.removeEventListener('controllerchange', onChange);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  if (!waiting) return null;

  return (
    <div className="update-prompt">
      <span className="update-prompt-text">{t('update.available')}</span>
      <button
        className="update-prompt-btn"
        onClick={() => waiting.postMessage({ type: 'SKIP_WAITING' })}
      >
        {t('update.reload')}
      </button>
      <button
        className="update-prompt-close"
        onClick={() => setWaiting(null)}
        aria-label={t('update.dismiss')}
      >
        ✕
      </button>
    </div>
  );
}