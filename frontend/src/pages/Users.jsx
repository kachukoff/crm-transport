import { useState, useEffect } from 'react';
import { api } from '../api/client';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/users/')
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Ошибка: {error}</div>;

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">Пользователи</h2>
          <p className="page-header__subtitle">Сотрудники системы с доступом к CRM</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn--primary">+ Добавить пользователя</button>
        </div>
      </div>

      <div className="toolbar">
        <input className="input toolbar__search" type="search" placeholder="Поиск по ФИО или email..." />
        <select className="select select--auto">
          <option value="">Все роли</option>
          <option value="admin">Администратор</option>
          <option value="manager">Менеджер</option>
          <option value="driver">Водитель</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="table__empty">Нет данных</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td><strong>{user.full_name}</strong></td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${
                      user.role === 'admin' ? 'badge--danger' :
                      user.role === 'manager' ? 'badge--primary' : 'badge--info'
                    }`}>
                      {user.role === 'admin' ? 'Администратор' :
                       user.role === 'manager' ? 'Менеджер' : 'Водитель'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${user.is_active ? 'badge--success' : 'badge--neutral'}`}>
                      {user.is_active ? 'Активен' : 'Заблокирован'}
                    </span>
                  </td>
                  <td className="table__cell-actions">
                    <button className="btn btn--ghost btn--sm">Открыть</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Users;