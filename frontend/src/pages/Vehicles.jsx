import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import Modal from '../components/Modal';

function Vehicles() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    plate_number: '',
    brand: '',
    model: '',
    vehicle_type: 'gazelle',
    capacity_kg: '',
  });

  // Загрузка машин
  const { data: vehicles = [], isLoading, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => api.get('/vehicles/'),
  });

  // Мутация создания машины
  const createVehicle = useMutation({
    mutationFn: (newVehicle) => api.post('/vehicles/', newVehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setIsModalOpen(false);
      setFormData({ plate_number: '', brand: '', model: '', vehicle_type: 'gazelle', capacity_kg: '' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Очищаем пустые строки
    const cleanData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== '')
    );
    // capacity_kg должен быть числом
    if (cleanData.capacity_kg) {
      cleanData.capacity_kg = Number(cleanData.capacity_kg);
    }
    createVehicle.mutate(cleanData);
  };

  if (isLoading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Ошибка: {error.message}</div>;

  const typeMap = {
    gazelle: 'Газель',
    medium: 'Средняя',
    truck: 'Фура',
    refrigerator: 'Рефрижератор',
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">Все машины</h2>
          <p className="page-header__subtitle">Всего: {vehicles.length} машин</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
            + Добавить машину
          </button>
        </div>
      </div>

      <div className="toolbar">
        <input className="input toolbar__search" type="search" placeholder="Поиск по госномеру или марке..." />
        <select className="select select--auto">
          <option value="">Все статусы</option>
          <option value="available">Свободна</option>
          <option value="on_route">В рейсе</option>
          <option value="maintenance">На ремонте</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Госномер</th>
              <th>Марка / Модель</th>
              <th>Тип</th>
              <th>Грузоподъёмность</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan="6" className="table__empty">Нет данных</td>
              </tr>
            ) : (
              vehicles.map(vehicle => (
                <tr key={vehicle.id}>
                  <td><strong>{vehicle.plate_number}</strong></td>
                  <td>{vehicle.brand} {vehicle.model}</td>
                  <td className="table__cell-muted">{typeMap[vehicle.vehicle_type] || vehicle.vehicle_type}</td>
                  <td>{vehicle.capacity_kg ? `${vehicle.capacity_kg} кг` : '—'}</td>
                  <td>
                    <span className={`badge ${
                      vehicle.status === 'available' ? 'badge--success' :
                      vehicle.status === 'on_route' ? 'badge--warning' : 'badge--danger'
                    }`}>
                      {vehicle.status === 'available' ? 'Свободна' :
                       vehicle.status === 'on_route' ? 'В рейсе' : 'На ремонте'}
                    </span>
                  </td>
                  <td className="table__cell-actions">
                    <button className="btn btn--ghost btn--sm">Открыть</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Модалка создания машины */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Добавить машину">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label">Госномер</label>
            <input 
              className="input" 
              required 
              placeholder="А123ВС 77"
              value={formData.plate_number}
              onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">Марка</label>
            <input 
              className="input" 
              placeholder="ГАЗ"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">Модель</label>
            <input 
              className="input" 
              placeholder="Газель Next"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">Тип машины</label>
            <select 
              className="select" 
              value={formData.vehicle_type}
              onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
            >
              <option value="gazelle">Газель</option>
              <option value="medium">Средняя</option>
              <option value="truck">Фура</option>
              <option value="refrigerator">Рефрижератор</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-group__label">Грузоподъёмность (кг)</label>
            <input 
              className="input" 
              type="number"
              placeholder="1500"
              value={formData.capacity_kg}
              onChange={(e) => setFormData({ ...formData, capacity_kg: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary" disabled={createVehicle.isPending}>
              {createVehicle.isPending ? 'Сохранение...' : 'Создать'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Vehicles;