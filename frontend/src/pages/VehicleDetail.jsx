import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import Modal from '../components/Modal';


function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: vehicle, isLoading, error } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => api.get(`/vehicles/${id}`),
  });

  const [formData, setFormData] = useState({
    plate_number: '',
    brand: '',
    model: '',
    vehicle_type: 'gazelle',
    capacity_kg: '',
    status: 'available',
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        plate_number: vehicle.plate_number || '',
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        vehicle_type: vehicle.vehicle_type || 'gazelle',
        capacity_kg: vehicle.capacity_kg || '',
        status: vehicle.status || 'available',
      });
    }
  }, [vehicle]);

  const updateVehicle = useMutation({
    mutationFn: (data) => api.patch(`/vehicles/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle', id] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setIsModalOpen(false);
    },
  });

  const deleteVehicle = useMutation({
    mutationFn: () => api.delete(`/vehicles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      navigate('/vehicles');
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
    if (cleanData.capacity_kg) {
      cleanData.capacity_kg = Number(cleanData.capacity_kg);
    }
    updateVehicle.mutate(cleanData);
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить эту машину?')) {
      deleteVehicle.mutate();
    }
  };

  if (isLoading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Ошибка: {error.message}</div>;
  if (!vehicle) return <div style={{ padding: '20px' }}>Машина не найдена</div>;

  const typeMap = {
    gazelle: 'Газель',
    medium: 'Средняя',
    truck: 'Фура',
    refrigerator: 'Рефрижератор',
  };

  const statusMap = {
    available: 'Свободна',
    on_route: 'В рейсе',
    maintenance: 'На ремонте',
  };

  return (
    <>
      <div className="page-header">
        <div>
          <button className="btn btn--ghost btn--sm" onClick={() => navigate('/vehicles')} style={{ marginBottom: '10px' }}>
            ← Назад к машинам
          </button>
          <h2 className="page-header__title">{vehicle.plate_number}</h2>
          <p className="page-header__subtitle">{vehicle.brand} {vehicle.model}</p>
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
            <div className="profile__label">Тип машины</div>
            <div className="profile__value">{typeMap[vehicle.vehicle_type] || vehicle.vehicle_type}</div>
          </div>
          <div className="profile__row">
            <div className="profile__label">Грузоподъёмность</div>
            <div className="profile__value">{vehicle.capacity_kg ? `${vehicle.capacity_kg} кг` : '—'}</div>
          </div>
          <div className="profile__row">
            <div className="profile__label">Статус</div>
            <div className="profile__value">
              <span className={`badge ${vehicle.status === 'available' ? 'badge--success' :
                vehicle.status === 'on_route' ? 'badge--warning' : 'badge--danger'
                }`}>
                {statusMap[vehicle.status] || vehicle.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Редактировать машину">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label">Госномер</label>
            <input className="input" required value={formData.plate_number}
              onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-group__label">Марка</label>
            <input className="input" value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-group__label">Модель</label>
            <input className="input" value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-group__label">Тип машины</label>
            <select className="select" value={formData.vehicle_type}
              onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}>
              <option value="gazelle">Газель</option>
              <option value="medium">Средняя</option>
              <option value="truck">Фура</option>
              <option value="refrigerator">Рефрижератор</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-group__label">Грузоподъёмность (кг)</label>
            <input className="input" type="number" value={formData.capacity_kg}
              onChange={(e) => setFormData({ ...formData, capacity_kg: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-group__label">Статус</label>
            <select className="select" value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              <option value="available">Свободна</option>
              <option value="on_route">В рейсе</option>
              <option value="maintenance">На ремонте</option>
            </select>
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>Отмена</button>
            <button type="submit" className="btn btn--primary" disabled={updateVehicle.isPending}>
              {updateVehicle.isPending ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default VehicleDetail;