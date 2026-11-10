import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import Modal from '../components/Modal';
import ErrorMessage from '../components/ErrorMessage';

function PricingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deletePricing = useMutation({
    mutationFn: () => api.delete(`/pricing/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing'] });
      navigate('/pricing');
    },
  });

  const { data: pricing, isLoading, error } = useQuery({
    queryKey: ['pricing', id],
    queryFn: () => api.get(`/pricing/${id}`),
  });

  const [formData, setFormData] = useState({
    vehicle_type: 'gazelle',
    base_rate: '',
    price_per_km: '',
    price_per_kg: '',
  });

  useEffect(() => {
    if (pricing) {
      setFormData({
        vehicle_type: pricing.vehicle_type || 'gazelle',
        base_rate: pricing.base_rate || '',
        price_per_km: pricing.price_per_km || '',
        price_per_kg: pricing.price_per_kg || '',
      });
    }
  }, [pricing]);

  const updatePricing = useMutation({
    mutationFn: (data) => api.patch(`/pricing/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing', id] });
      queryClient.invalidateQueries({ queryKey: ['pricing'] });
      setIsModalOpen(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== '')
    );
    cleanData.base_rate = Number(cleanData.base_rate);
    cleanData.price_per_km = Number(cleanData.price_per_km);
    cleanData.price_per_kg = Number(cleanData.price_per_kg);
    updatePricing.mutate(cleanData);
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить этот тариф?')) {
      deletePricing.mutate();
    }
  };

  if (isLoading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
  if (error) return <ErrorMessage message={error.message} />;
  if (!pricing) return <div style={{ padding: '20px' }}>Тариф не найден</div>;

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
          <button className="btn btn--ghost btn--sm" onClick={() => navigate('/pricing')} style={{ marginBottom: '10px' }}>
            ← Назад к тарифам
          </button>
          <h2 className="page-header__title">{typeMap[pricing.vehicle_type] || pricing.vehicle_type}</h2>
          <p className="page-header__subtitle">Настройка ценообразования</p>
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
            <div className="profile__label">Базовая ставка</div>
            <div className="profile__value">{pricing.base_rate} ₽</div>
          </div>
          <div className="profile__row">
            <div className="profile__label">Цена за км</div>
            <div className="profile__value">{pricing.price_per_km} ₽</div>
          </div>
          <div className="profile__row">
            <div className="profile__label">Цена за кг</div>
            <div className="profile__value">{pricing.price_per_kg} ₽</div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Редактировать тариф">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label">Тип транспорта</label>
            <select className="select" value={formData.vehicle_type}
              onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}>
              <option value="gazelle">Газель</option>
              <option value="medium">Средняя</option>
              <option value="truck">Фура</option>
              <option value="refrigerator">Рефрижератор</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-group__label">Базовая ставка (₽)</label>
            <input className="input" type="number" step="0.01" required value={formData.base_rate}
              onChange={(e) => setFormData({ ...formData, base_rate: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-group__label">Цена за км (₽)</label>
            <input className="input" type="number" step="0.01" required value={formData.price_per_km}
              onChange={(e) => setFormData({ ...formData, price_per_km: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-group__label">Цена за кг (₽)</label>
            <input className="input" type="number" step="0.01" required value={formData.price_per_kg}
              onChange={(e) => setFormData({ ...formData, price_per_kg: e.target.value })} />
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>Отмена</button>
            <button type="submit" className="btn btn--primary" disabled={updatePricing.isPending}>
              {updatePricing.isPending ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default PricingDetail;