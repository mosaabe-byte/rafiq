import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';
import './Login.css';

export default function ForgotPassword() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });

    setLoading(false);

    // نُظهر رسالة النجاح دائماً (حتى لو البريد غير مسجّل) — لحماية الخصوصية
    if (error && error.message.includes('rate')) {
      setError(t('auth.resetRateLimit'));
    } else {
      setSent(true);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-mark">ر</div>
          <span>رفيق</span>
        </div>

        {sent ? (
          <>
            <h2>{t('auth.resetSentTitle')}</h2>
            <p className="reset-info">{t('auth.resetSentInfo')}</p>
            <Link to="/login" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>
              {t('auth.backToLogin')}
            </Link>
          </>
        ) : (
          <>
            <h2>{t('auth.forgotTitle')}</h2>
            <p className="reset-info">{t('auth.forgotInfo')}</p>

            <form onSubmit={handleSubmit} className="login-form">
              <label className="field">
                <span>{t('auth.email')}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>

              {error && <div className="login-error">{error}</div>}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? t('auth.loading') : t('auth.forgotBtn')}
              </button>
            </form>

            <div className="login-switch">
              <Link to="/login">{t('auth.backToLogin')}</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}