import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../components/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import ErrorMessage from '../components/ErrorMessage';

function Users() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const toast = useToast();
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
      toast.success(t('users.created'));
      setIsModalOpen(false);
      setFormData({ email: '', full_name: '', password: '', role: 'manager' });
    },
    onError: (error) => {
      toast.error(t('users.createError', { message: error.message }));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser.mutate(formData);
  };

  if (isLoading) return <div style={{ padding: '20px' }}>{t('common.loading')}</div>;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="toolbar">
        <input className="input toolbar__search" type="search" placeholder={t('users.searchPlaceholder')}
          aria-label={t('users.searchPlaceholder')} />
        <select className="select select--auto" aria-label={t('users.allRoles')}>
          <option value="">{t('users.allRoles')}</option>
          <option value="admin">{t('roles.admin')}</option>
          <option value="manager">{t('roles.manager')}</option>
          <option value="driver">{t('roles.driver')}</option>
        </select>
        <div className="toolbar__spacer" />
        {user?.role === 'admin' && (
          <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
            {t('users.add')}
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>{t('users.table.name')}</th>
              <th>{t('users.table.email')}</th>
              <th>{t('users.table.role')}</th>
              <th>{t('users.table.status')}</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="table__empty">{t('common.noData')}</td>
              </tr>
            ) : (
              users.map(u => (
                <tr
                  key={u.id}
                  onClick={() => navigate(`/users/${u.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td><strong>{u.full_name}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge--danger' :
                      u.role === 'manager' ? 'badge--primary' : 'badge--info'
                      }`}>
                      {t(`roles.${u.role}`, { defaultValue: u.role })}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.is_active ? 'badge--success' : 'badge--neutral'}`}>
                      {u.is_active ? t('statuses.user.active') : t('statuses.user.blocked')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('users.modal.title')}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label">{t('users.modal.name')}</label>
            <input className="input" required value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-group__label">{t('users.modal.email')}</label>
            <input className="input" type="email" required value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-group__label">{t('users.modal.password')}</label>
            <input className="input" type="password" required value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-group__label">{t('users.modal.role')}</label>
            <select className="select" value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="manager">{t('roles.manager')}</option>
              <option value="admin">{t('roles.admin')}</option>
              <option value="driver">{t('roles.driver')}</option>
            </select>
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn--primary" disabled={createUser.isPending}>
              {createUser.isPending ? t('common.saving') : t('common.create')}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Users;