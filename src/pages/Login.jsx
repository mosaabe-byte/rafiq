import { Link } from 'react-router-dom';
import { PRIVACY_VERSION } from '../data/privacyPolicy';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import './Login.css';
import { supabase } from '../lib/supabase';

export default function Login() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [mode, setMode] = useState('signin'); // 'signin' أو 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // في وضع التسجيل، الموافقة على سياسة الخصوصية إلزامية
    if (mode === 'signup' && !consent) {
      setError(t('auth.consentRequired'));
      return;
    }

    setLoading(true);

    const action = mode === 'signin' ? signIn : signUp;
    const { error } = await action(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // بعد تسجيل ناجح، سجّل نسخة الموافقة وتاريخها
    if (mode === 'signup') {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ consent_version: PRIVACY_VERSION, consent_at: new Date().toISOString() })
          .eq('id', user.id);
      }
    }

    navigate('/');
    setLoading(false);
  }

  async function handleGoogle() {
    setError('');
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-mark">ر</div>
          <span>رفيق</span>
        </div>

        <h2>{mode === 'signin' ? t('auth.signinTitle') : t('auth.signupTitle')}</h2>

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

          <label className="field">
            <span>{t('auth.password')}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </label>

          {mode === 'signup' && (
            <label className="consent-row">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>
                {t('auth.consentText')}{' '}
                <Link to="/privacy" target="_blank" className="consent-link">
                  {t('auth.consentLink')}
                </Link>
              </span>
            </label>
          )}

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('auth.loading') : mode === 'signin' ? t('auth.signinBtn') : t('auth.signupBtn')}
          </button>
        </form>

        <div className="login-divider"><span>{t('auth.or')}</span></div>

        <button onClick={handleGoogle} className="btn-google">
          {t('auth.continueGoogle')}
        </button>

        <div className="login-switch">
          {mode === 'signin' ? (
            <span>{t('auth.noAccount')} <button onClick={() => setMode('signup')}>{t('auth.signupLink')}</button></span>
          ) : (
            <span>{t('auth.hasAccount')} <button onClick={() => setMode('signin')}>{t('auth.signinLink')}</button></span>
          )}
        </div>
      </div>
    </div>
  );
}