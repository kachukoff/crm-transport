import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/'); // Редирект на главную страницу
    } catch (err) {
      setError('Неверный email или пароль');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__logo">
          <span className="login-card__logo-mark">T</span>
          <span>CRM Транспорт</span>
        </div>

        <h1 className="login-card__title">Вход в систему</h1>
        <p className="login-card__subtitle">Введите свои учётные данные</p>

        <form className="login-card__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label" htmlFor="email">Email</label>
            <input
              className="input"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.ru"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-group__label" htmlFor="password">Пароль</label>
            <input
              className="input"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</div>}

          <button type="submit" className="btn btn--primary btn--lg btn--block mt-4">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}