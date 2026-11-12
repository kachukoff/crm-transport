import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import Modal from '../components/Modal';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';  // <-- добавили

function Clients() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();  // <-- получаем текущего пользователя
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

  if (isLoading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="toolbar">
        <input className="input toolbar__search" type="search" placeholder="Поиск по названию или ИНН..." />
        <select className="select select--auto">
          <option value="">Все типы</option>
          <option value="legal">Юридические лица</option>
          <option value="individual">Физические лица</option>
        </select>
        <div className="toolbar__spacer" />
        
        {/* Кнопка добавления — только для админа и менеджера */}
        {user?.role !== 'driver' && (
          <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
            + Добавить клиента
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Тип</th>
              <th>ИНН</th>
              <th>Контактное лицо</th>
              <th>Телефон</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="5" className="table__empty">Нет данных</td>
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
                      {client.type === 'legal' ? 'Юрлицо' : 'Физлицо'}
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Добавить клиента">
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
            <label className="form-group__label">ИНН (опционально)</label>
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

          <div className="form-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary" disabled={createClient.isPending}>
              {createClient.isPending ? 'Сохранение...' : 'Создать'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Clients;