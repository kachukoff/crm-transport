import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import Modal from '../components/Modal';

function Pricing() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    vehicle_type: 'gazelle',
    base_rate: '',
    price_per_km: '',
    price_per_kg: '',
  });

  // Загрузка тарифов
  const { data: pricing = [], isLoading, error } = useQuery({
    queryKey: ['pricing'],
    queryFn: () => api.get('/pricing/'),
  });

  // Мутация создания тарифа
  const createPricing = useMutation({
    mutationFn: (newPricing) => api.post('/pricing/', newPricing),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing'] });
      setIsModalOpen(false);
      setFormData({ vehicle_type: 'gazelle', base_rate: '', price_per_km: '', price_per_kg: '' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPricing.mutate({
      vehicle_type: formData.vehicle_type,
      base_rate: Number(formData.base_rate),
      price_per_km: Number(formData.price_per_km),
      price_per_kg: Number(formData.price_per_kg),
    });
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
          <h2 className="page-header__title">Тарифы</h2>
          <p className="page-header__subtitle">Настройка ценообразования по типам транспорта</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
            + Добавить тариф
          </button>
        </div>
      </div>

      <div className="toolbar">
        <input className="input toolbar__search" type="search" placeholder="Поиск по типу транспорта..." />
        <select className="select select--auto">
          <option value="">Все типы</option>
          <option value="gazelle">Газель</option>
          <option value="medium">Средняя</option>
          <option value="truck">Фура</option>
          <option value="refrigerator">Рефрижератор</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Тип транспорта</th>
              <th>Базовая ставка</th>
              <th>За км</th>
              <th>За кг</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pricing.length === 0 ? (
              <tr>
                <td colSpan="5" className="table__empty">Нет данных</td>
              </tr>
            ) : (
              pricing.map(rule => (
                <tr key={rule.id}>
                  <td><strong>{typeMap[rule.vehicle_type] || rule.vehicle_type}</strong></td>
                  <td>{rule.base_rate} ₽</td>
                  <td>{rule.price_per_km} ₽</td>
                  <td>{rule.price_per_kg} ₽</td>
                  <td className="table__cell-actions">
                    <button className="btn btn--ghost btn--sm">Редактировать</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Модалка создания тарифа */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Добавить тариф">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label">Тип транспорта</label>
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
            <label className="form-group__label">Базовая ставка (₽)</label>
            <input 
              className="input" 
              type="number" 
              required
              value={formData.base_rate}
              onChange={(e) => setFormData({ ...formData, base_rate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">Цена за км (₽)</label>
            <input 
              className="input" 
              type="number" 
              step="0.01"
              required
              value={formData.price_per_km}
              onChange={(e) => setFormData({ ...formData, price_per_km: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">Цена за кг (₽)</label>
            <input 
              className="input" 
              type="number" 
              step="0.01"
              required
              value={formData.price_per_kg}
              onChange={(e) => setFormData({ ...formData, price_per_kg: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary" disabled={createPricing.isPending}>
              {createPricing.isPending ? 'Сохранение...' : 'Создать'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Pricing;