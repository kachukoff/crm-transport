import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import Modal from '../components/Modal';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';

function Drivers() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', phone: '', license_number: '' });

  const { data: drivers = [], isLoading, error } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => api.get('/drivers/'),
  });

  const createDriver = useMutation({
    mutationFn: (newDriver) => api.post('/drivers/', newDriver),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      setIsModalOpen(false);
      setFormData({ full_name: '', phone: '', license_number: '' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createDriver.mutate(formData);
  };

  if (isLoading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="toolbar">
        <input className="input toolbar__search" type="search" placeholder="Поиск по ФИО или телефону..." />
        <select className="select select--auto">
          <option value="">Все статусы</option>
          <option value="available">Свободен</option>
          <option value="on_route">В рейсе</option>
          <option value="day_off">Выходной</option>
          <option value="fired">Уволен</option>
        </select>
        <div className="toolbar__spacer" />
        {user?.role !== 'driver' && (
          <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
            + Добавить водителя
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Телефон</th>
              <th>Права</th>
              <th>Статус</th>
              <th>Машина</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr>
                <td colSpan="5" className="table__empty">Нет данных</td>
              </tr>
            ) : (
              drivers.map(driver => (
                <tr
                  key={driver.id}
                  onClick={() => navigate(`/drivers/${driver.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td><strong>{driver.full_name}</strong></td>
                  <td>{driver.phone || '—'}</td>
                  <td className="table__cell-muted">{driver.license_number || '—'}</td>
                  <td>
                    <span className={`badge ${driver.status === 'available' ? 'badge--success' :
                      driver.status === 'on_route' ? 'badge--warning' :
                        driver.status === 'day_off' ? 'badge--neutral' : 'badge--danger'
                      }`}>
                      {driver.status === 'available' ? 'Свободен' :
                        driver.status === 'on_route' ? 'В рейсе' :
                          driver.status === 'day_off' ? 'Выходной' : 'Уволен'}
                    </span>
                  </td>
                  <td className="table__cell-muted">{driver.vehicle_plate || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Добавить водителя">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label">ФИО</label>
            <input
              className="input"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
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
            <label className="form-group__label">Номер прав</label>
            <input
              className="input"
              value={formData.license_number}
              onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
            />
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary" disabled={createDriver.isPending}>
              {createDriver.isPending ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Drivers;