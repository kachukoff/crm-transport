import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const roleMap = {
    admin: 'Администратор',
    manager: 'Менеджер',
    driver: 'Водитель',
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">Мой профиль</h2>
          <p className="page-header__subtitle">Личные данные и безопасность</p>
        </div>
      </div>

      <div className="profile">
        {/* Левая колонка: Личные данные */}
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Личные данные</h3>
          </div>
          <div className="profile__info">
            <div className="profile__row">
              <div className="profile__label">ФИО</div>
              <div className="profile__value">{user.full_name}</div>
            </div>
            <div className="profile__row">
              <div className="profile__label">Email</div>
              <div className="profile__value">{user.email}</div>
            </div>
            <div className="profile__row">
              <div className="profile__label">Роль</div>
              <div className="profile__value">
                <span className={`badge ${
                  user.role === 'admin' ? 'badge--danger' :
                  user.role === 'manager' ? 'badge--primary' : 'badge--info'
                }`}>
                  {roleMap[user.role] || user.role}
                </span>
              </div>
            </div>
            <div className="profile__row">
              <div className="profile__label">Дата регистрации</div>
              <div className="profile__value">
                {new Date(user.created_at).toLocaleDateString('ru-RU')}
              </div>
            </div>
          </div>
        </div>

        {/* Правая колонка: Смена пароля */}
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Смена пароля</h3>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); alert('Функция в разработке'); }}>
            <div className="form-group">
              <label className="form-group__label">Текущий пароль</label>
              <input className="input" type="password" placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label className="form-group__label">Новый пароль</label>
              <input className="input" type="password" placeholder="Минимум 8 символов" />
              <span className="form-group__hint">Не менее 8 символов, буквы и цифры</span>
            </div>
            <div className="form-group">
              <label className="form-group__label">Подтвердите новый пароль</label>
              <input className="input" type="password" placeholder="Повторите пароль" />
            </div>
            <button type="submit" className="btn btn--primary">Сохранить пароль</button>
          </form>
        </div>
      </div>

      {/* Выход */}
      <div className="profile__actions">
        <button 
          className="btn btn--danger" 
          onClick={() => {
            if (window.confirm('Вы уверены, что хотите выйти?')) logout();
          }}
        >
          Выйти из системы
        </button>
      </div>
    </>
  );
}

export default Profile;