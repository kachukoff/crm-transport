import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      const isEnglish = (i18n.resolvedLanguage || i18n.language || 'ru').startsWith('en');
      setError(isEnglish ? t('auth.loginError') : err.message || t('auth.loginError'));
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__logo">
          <span className="login-card__logo-mark">T</span>
          <span>{t('common.appName')}</span>
        </div>

        <h1 className="login-card__title">{t('auth.title')}</h1>
        <p className="login-card__subtitle">{t('auth.subtitle')}</p>

        <form className="login-card__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label" htmlFor="email">{t('auth.email')}</label>
            <input
              className="input"
              type="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.emailPlaceholder')}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-group__label" htmlFor="password">{t('auth.password')}</label>
            <input
              className="input"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.passwordPlaceholder')}
              required
            />
          </div>

          {error && <div style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</div>}

          <button type="submit" className="btn btn--primary btn--lg btn--block mt-4">
            {t('auth.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}