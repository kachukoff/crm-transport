import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import Modal from '../components/Modal';

function DriverDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: driver, isLoading, error } = useQuery({
    queryKey: ['driver', id],
    queryFn: () => api.get(`/drivers/${id}`),
  });

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    license_number: '',
    status: 'available',
  });

  useEffect(() => {
    if (driver) {
      setFormData({
        full_name: driver.full_name || '',
        phone: driver.phone || '',
        license_number: driver.license_number || '',
        status: driver.status || 'available',
      });
    }
  }, [driver]);

  const updateDriver = useMutation({
    mutationFn: (data) => api.patch(`/drivers/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver', id] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      setIsModalOpen(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== '')
    );
    updateDriver.mutate(cleanData);
  };

  if (isLoading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Ошибка: {error.message}</div>;
  if (!driver) return <div style={{ padding: '20px' }}>Водитель не найден</div>;

  const statusMap = {
    available: 'Свободен',
    on_route: 'В рейсе',
    day_off: 'Выходной',
    fired: 'Уволен',
  };

  return (
    <>
      <div className="page-header">
        <div>
          <button className="btn btn--ghost btn--sm" onClick={() => navigate('/drivers')} style={{ marginBottom: '10px' }}>
            ← Назад к водителям
          </button>
          <h2 className="page-header__title">{driver.full_name}</h2>
          <p className="page-header__subtitle">{driver.phone || 'Телефон не указан'}</p>
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
            <div className="profile__label">Номер прав</div>
            <div className="profile__value">{driver.license_number || '—'}</div>
          </div>
          <div className="profile__row">
            <div className="profile__label">Статус</div>
            <div className="profile__value">
              <span className={`badge ${
                driver.status === 'available' ? 'badge--success' :
                driver.status === 'on_route' ? 'badge--warning' :
                driver.status === 'day_off' ? 'badge--neutral' : 'badge--danger'
              }`}>
                {statusMap[driver.status] || driver.status}
              </span>
            </div>
          </div>
          <div className="profile__row">
            <div className="profile__label">Машина</div>
            <div className="profile__value">{driver.vehicle_plate || 'Не назначена'}</div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Редактировать водителя">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label">ФИО</label>
            <input className="input" required value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-group__label">Телефон</label>
            <input className="input" value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-group__label">Номер прав</label>
            <input className="input" value={formData.license_number}
              onChange={(e) => setFormData({ ...formData, license_number: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-group__label">Статус</label>
            <select className="select" value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              <option value="available">Свободен</option>
              <option value="on_route">В рейсе</option>
              <option value="day_off">Выходной</option>
              <option value="fired">Уволен</option>
            </select>
          </div>

          <div className="form-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>Отмена</button>
            <button type="submit" className="btn btn--primary" disabled={updateDriver.isPending}>
              {updateDriver.isPending ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default DriverDetail;