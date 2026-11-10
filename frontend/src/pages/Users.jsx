import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import Modal from '../components/Modal';

function Users() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    role: 'manager',
  });

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users/'),
  });

  const createUser = useMutation({
    mutationFn: (newUser) => api.post('/users/', newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
      setFormData({ email: '', full_name: '', password: '', role: 'manager' });
    },
    onError: (error) => {
      alert(`Ошибка при создании: ${error.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser.mutate(formData);
  };

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
          <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
            + Добавить пользователя
          </button>
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

      {/* Модалка создания пользователя */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Добавить пользователя">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label">ФИО</label>
            <input className="input" required value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-group__label">Email</label>
            <input className="input" type="email" required value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-group__label">Пароль</label>
            <input className="input" type="password" required value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-group__label">Роль</label>
            <select className="select" value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="manager">Менеджер</option>
              <option value="admin">Администратор</option>
              <option value="driver">Водитель</option>
            </select>
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>Отмена</button>
            <button type="submit" className="btn btn--primary" disabled={createUser.isPending}>
              {createUser.isPending ? 'Сохранение...' : 'Создать'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Users;