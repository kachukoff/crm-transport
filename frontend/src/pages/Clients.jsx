import { useState, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import Modal from '../components/Modal';
import ErrorMessage from '../components/ErrorMessage';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

function Clients() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'legal',
    inn: '',
    contact_person: '',
    phone: '',
    email: '',
  });

  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: () => api.get('/clients/'),
  });

  const createClient = useMutation({
    mutationFn: (newClient) => api.post('/clients/', newClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsModalOpen(false);
      setFormData({ name: '', type: 'legal', inn: '', contact_person: '', phone: '', email: '' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== '')
    );
    createClient.mutate(cleanData);
  };

  if (isLoading) return <div style={{ padding: '20px' }}>{t('common.loading')}</div>;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="toolbar">
        <input className="input toolbar__search" type="search"
          placeholder={t('clients.searchPlaceholder')}
          aria-label={t('clients.searchPlaceholder')} />
        <select className="select select--auto" aria-label={t('clients.allTypes')}>
          <option value="">{t('clients.allTypes')}</option>
          <option value="legal">{t('clients.legalPlural')}</option>
          <option value="individual">{t('clients.individualPlural')}</option>
        </select>
        <div className="toolbar__spacer" />

        {/* Кнопка добавления — только для админа и менеджера */}
        {user?.role !== 'driver' && (
          <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
            {t('clients.add')}
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>{t('clients.table.name')}</th>
              <th>{t('clients.table.type')}</th>
              <th>{t('clients.table.inn')}</th>
              <th>{t('clients.table.contact')}</th>
              <th>{t('clients.table.phone')}</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="5" className="table__empty">{t('common.noData')}</td>
              </tr>
            ) : (
              clients.map(client => (
                <tr
                  key={client.id}
                  onClick={() => navigate(`/clients/${client.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td><strong>{client.name}</strong></td>
                  <td>
                    <span className={`badge ${client.type === 'legal' ? 'badge--primary' : 'badge--info'}`}>
                      {client.type === 'legal' ? t('clientTypes.legalShort') : t('clientTypes.individualShort')}
                    </span>
                  </td>
                  <td className="table__cell-muted">{client.inn || '—'}</td>
                  <td>{client.contact_person || '—'}</td>
                  <td>{client.phone || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Модалка создания клиента */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('clients.modal.title')}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label">{t('clients.modal.type')}</label>
            <select
              className="select"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="legal">{t('clientTypes.legal')}</option>
              <option value="individual">{t('clientTypes.individual')}</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-group__label">{t('clients.modal.name')}</label>
            <input
              className="input"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">{t('clients.modal.inn')}</label>
            <input
              className="input"
              value={formData.inn}
              onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">{t('clients.modal.contact')}</label>
            <input
              className="input"
              value={formData.contact_person}
              onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">{t('clients.modal.phone')}</label>
            <input
              className="input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">{t('clients.modal.email')}</label>
            <input
              className="input"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn--primary" disabled={createClient.isPending}>
              {createClient.isPending ? t('common.saving') : t('common.create')}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Clients;