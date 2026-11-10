import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import Modal from '../components/Modal';
import ErrorMessage from '../components/ErrorMessage';

function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: client, isLoading, error } = useQuery({
    queryKey: ['client', id],
    queryFn: () => api.get(`/clients/${id}`),
  });

  const [formData, setFormData] = useState({
    name: '',
    type: 'legal',
    inn: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
  });

  // Заполняем форму, когда данные загрузились
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        type: client.type || 'legal',
        inn: client.inn || '',
        contact_person: client.contact_person || '',
        phone: client.phone || '',
        email: client.email || '',
        address: client.address || '',
      });
    }
  }, [client]);  // <-- сработает, когда client загрузится

  const updateClient = useMutation({
    mutationFn: (data) => api.patch(`/clients/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', id] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsModalOpen(false);
    },
  });

  const deleteClient = useMutation({
    mutationFn: () => api.delete(`/clients/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      navigate('/clients');
    },
    onError: (error) => {
      alert(`Ошибка при удалении: ${error.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== '')
    );
    updateClient.mutate(cleanData);
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить этого клиента?')) {
      deleteClient.mutate();
    }
  };

  if (isLoading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
  if (error) return <ErrorMessage message={error.message} />;
  if (!client) return <div style={{ padding: '20px' }}>Клиент не найден</div>;

  return (
    <>
      <div className="page-header">
        <div>
          <button className="btn btn--ghost btn--sm" onClick={() => navigate('/clients')} style={{ marginBottom: '10px' }}>
            ← Назад к клиентам
          </button>
          <h2 className="page-header__title">{client.name}</h2>
          <p className="page-header__subtitle">
            {client.type === 'legal' ? 'Юридическое лицо' : 'Физическое лицо'}
          </p>
        </div>
        <div className="page-header__actions" style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
            Редактировать
          </button>
          <button className="btn btn--danger" onClick={handleDelete}>
            Удалить
          </button>
        </div>
      </div>

      <div className="card">
        <div className="profile__info">
          <div className="profile__row">
            <div className="profile__label">ИНН</div>
            <div className="profile__value">{client.inn || '—'}</div>
          </div>
          <div className="profile__row">
            <div className="profile__label">Контактное лицо</div>
            <div className="profile__value">{client.contact_person || '—'}</div>
          </div>
          <div className="profile__row">
            <div className="profile__label">Телефон</div>
            <div className="profile__value">{client.phone || '—'}</div>
          </div>
          <div className="profile__row">
            <div className="profile__label">Email</div>
            <div className="profile__value">{client.email || '—'}</div>
          </div>
          <div className="profile__row">
            <div className="profile__label">Адрес</div>
            <div className="profile__value">{client.address || '—'}</div>
          </div>
        </div>
      </div>

      {/* Модалка редактирования */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Редактировать клиента">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label">Тип клиента</label>
            <select
              className="select"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="legal">Юридическое лицо</option>
              <option value="individual">Физическое лицо</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-group__label">Название / ФИО</label>
            <input
              className="input"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">ИНН</label>
            <input
              className="input"
              value={formData.inn}
              onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">Контактное лицо</label>
            <input
              className="input"
              value={formData.contact_person}
              onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">Телефон</label>
            <input
              className="input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">Email</label>
            <input
              className="input"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">Адрес</label>
            <input
              className="input"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary" disabled={updateClient.isPending}>
              {updateClient.isPending ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default ClientDetail;