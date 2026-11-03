import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // <-- добавили useNavigate
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import Modal from '../components/Modal';

function Clients() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();  // <-- добавили
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
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Ошибка: {error.message}</div>;

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">Все клиенты</h2>
          <p className="page-header__subtitle">Всего: {clients.length} клиентов</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
            + Добавить клиента
          </button>
        </div>
      </div>

      <div className="toolbar">
        <input className="input toolbar__search" type="search" placeholder="Поиск по названию или ИНН..." />
        <select className="select select--auto">
          <option value="">Все типы</option>
          <option value="legal">Юридические лица</option>
          <option value="individual">Физические лица</option>
        </select>
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="6" className="table__empty">Нет данных</td>
              </tr>
            ) : (
              clients.map(client => (
                <tr 
                  key={client.id}
                  onClick={() => navigate(`/clients/${client.id}`)}  // <-- клик по строке
                  style={{ cursor: 'pointer' }}                   // <-- курсор-рука
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
                  <td className="table__cell-actions" onClick={(e) => e.stopPropagation()}>
                    <Link to={`/clients/${client.id}`} className="btn btn--ghost btn--sm">Открыть</Link>
                  </td>
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