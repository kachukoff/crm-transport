import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import Modal from '../components/Modal';

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', id],
    queryFn: () => api.get(`/users/${id}`),
  });

  const [formData, setFormData] = useState({
    full_name: '',
    role: 'manager',
    is_active: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        role: user.role || 'manager',
        is_active: user.is_active !== undefined ? user.is_active : true,
      });
    }
  }, [user]);

  const updateUser = useMutation({
    mutationFn: (data) => api.patch(`/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser.mutate(formData);
  };

  if (isLoading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Ошибка: {error.message}</div>;
  if (!user) return <div style={{ padding: '20px' }}>Пользователь не найден</div>;

  const roleMap = {
    admin: 'Администратор',
    manager: 'Менеджер',
    driver: 'Водитель',
  };

  return (
    <>
      <div className="page-header">
        <div>
          <button className="btn btn--ghost btn--sm" onClick={() => navigate('/users')} style={{ marginBottom: '10px' }}>
            ← Назад к пользователям
          </button>
          <h2 className="page-header__title">{user.full_name}</h2>
          <p className="page-header__subtitle">{user.email}</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
            Редактировать
          </button>
        </div>
      </div>

      <div className="card">
        <div className="profile__info">
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
            <div className="profile__label">Статус</div>
            <div className="profile__value">
              <span className={`badge ${user.is_active ? 'badge--success' : 'badge--neutral'}`}>
                {user.is_active ? 'Активен' : 'Заблокирован'}
              </span>
            </div>
          </div>
          <div className="profile__row">
            <div className="profile__label">Последний вход</div>
            <div className="profile__value">—</div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Редактировать пользователя">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label">ФИО</label>
            <input className="input" required value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-group__label">Роль</label>
            <select className="select" value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="admin">Администратор</option>
              <option value="manager">Менеджер</option>
              <option value="driver">Водитель</option>
            </select>
          </div>
          <div className="form-group">
            <label className="checkbox">
              <input 
                type="checkbox" 
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              Активен (можно входить в систему)
            </label>
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>Отмена</button>
            <button type="submit" className="btn btn--primary" disabled={updateUser.isPending}>
              {updateUser.isPending ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default UserDetail;