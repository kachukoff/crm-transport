function Profile() {
  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">Мой профиль</h2>
          <p className="page-header__subtitle">Личные данные и безопасность</p>
        </div>
      </div>

      <div className="profile">
        {/* LEFT: ЛИЧНЫЕ ДАННЫЕ */}
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Личные данные</h3>
          </div>
          <div className="profile__info">
            <div className="profile__row">
              <div className="profile__label">ФИО</div>
              <div className="profile__value">Морозова Анна Сергеевна</div>
            </div>
            <div className="profile__row">
              <div className="profile__label">Email</div>
              <div className="profile__value">a.morozova@crm.ru</div>
            </div>
            <div className="profile__row">
              <div className="profile__label">Роль</div>
              <div className="profile__value">
                <span className="badge badge--primary">Менеджер</span>
              </div>
            </div>
            <div className="profile__row">
              <div className="profile__label">Последний вход</div>
              <div className="profile__value">13.10.2026 09:14</div>
            </div>
          </div>
        </div>

        {/* RIGHT: СМЕНА ПАРОЛЯ */}
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Смена пароля</h3>
          </div>
          <form>
            <div className="form-group">
              <label className="form-group__label" htmlFor="current-password">Текущий пароль</label>
              <input className="input" type="password" id="current-password" placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label className="form-group__label" htmlFor="new-password">Новый пароль</label>
              <input className="input" type="password" id="new-password" placeholder="Минимум 8 символов" />
              <span className="form-group__hint">Не менее 8 символов, буквы и цифры</span>
            </div>
            <div className="form-group">
              <label className="form-group__label" htmlFor="confirm-password">Подтвердите новый пароль</label>
              <input className="input" type="password" id="confirm-password" placeholder="Повторите пароль" />
            </div>
            <button type="submit" className="btn btn--primary">Сохранить пароль</button>
          </form>
        </div>
      </div>

      {/* ВЫХОД (вынесен из блока .profile) */}
      <div className="profile__actions">
        <button className="btn btn--danger">Выйти из системы</button>
      </div>
    </>
  )
}

export default Profile