import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';
import './Login.css';

export default function ResetPassword() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [validSession, setValidSession] = useState(false);

  // التحقّق من وجود جلسة استرجاع صالحة (يضعها سوبابيس من رابط البريد)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setValidSession(true);
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError(t('auth.resetTooShort'));
      return;
    }
    if (password !== confirm) {
      setError(t('auth.resetMismatch'));
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setDone(true);
      setTimeout(() => navigate('/'), 2000);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-mark">ر</div>
          <span>رفيق</span>
        </div>

        {done ? (
          <>
            <h2>{t('auth.resetDoneTitle')}</h2>
            <p className="reset-info">{t('auth.resetDoneInfo')}</p>
          </>
        ) : !validSession ? (
          <>
            <h2>{t('auth.resetInvalidTitle')}</h2>
            <p className="reset-info">{t('auth.resetInvalidInfo')}</p>
          </>
        ) : (
          <>
            <h2>{t('auth.resetNewTitle')}</h2>
            <p className="reset-info">{t('auth.resetNewInfo')}</p>

            <form onSubmit={handleSubmit} className="login-form">
              <label className="field">
                <span>{t('auth.resetNewPassword')}</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </label>

              <label className="field">
                <span>{t('auth.resetConfirmPassword')}</span>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </label>

              {error && <div className="login-error">{error}</div>}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? t('auth.loading') : t('auth.resetNewBtn')}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}