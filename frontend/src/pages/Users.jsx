import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

function Users() {
  const navigate = useNavigate();

  // Загрузка пользователей
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users/'),
  });

  if (isLoading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Ошибка: {error.message}</div>;

  const roleMap = {
    admin: 'Администратор',
    manager: 'Менеджер',
    driver: 'Водитель',
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">Пользователи</h2>
          <p className="page-header__subtitle">Сотрудники системы с доступом к CRM</p>
        </div>
        <div className="page-header__actions">
          {/* Кнопка создания пока не реализована, оставляем как заглушку */}
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
                <tr
                  key={user.id}
                  onClick={() => navigate(`/users/${user.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td><strong>{user.full_name}</strong></td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${
                      user.role === 'admin' ? 'badge--danger' :
                      user.role === 'manager' ? 'badge--primary' : 'badge--info'
                    }`}>
                      {roleMap[user.role] || user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${user.is_active ? 'badge--success' : 'badge--neutral'}`}>
                      {user.is_active ? 'Активен' : 'Заблокирован'}
                    </span>
                  </td>
                  <td className="table__cell-actions" onClick={(e) => e.stopPropagation()}>
                    <Link to={`/users/${user.id}`} className="btn btn--ghost btn--sm">Открыть</Link>
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