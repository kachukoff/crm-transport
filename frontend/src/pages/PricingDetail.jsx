import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import Modal from '../components/Modal';
import ErrorMessage from '../components/ErrorMessage';
import { formatCurrency } from '../lib/format';
import { VEHICLE_TYPES, getVehicleTypeLabel } from '../lib/vehicle';

function PricingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deletePricing = useMutation({
    mutationFn: () => api.delete(`/pricing/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing'] });
      navigate('/pricing');
    },
    onError: (error) => {
      alert(t('pricingDetail.deleteError', { message: error.message }));
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
    if (window.confirm(t('pricingDetail.deleteConfirm'))) {
       deletePricing.mutate();
     }
  };

  if (isLoading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
  if (error) return <ErrorMessage message={error.message} />;
  if (!pricing) return <div style={{ padding: '20px' }}>{t('pricingDetail.notFound')}</div>;

  return (
    <>
      <div className="page-header">
        <div>
          <button className="btn btn--ghost btn--sm" onClick={() => navigate('/pricing')} style={{ marginBottom: '10px' }}>
            {t('pricingDetail.back')}
          </button>
          <h2 className="page-header__title">{getVehicleTypeLabel(t, pricing.vehicle_type)}</h2>
          <p className="page-header__subtitle">{t('pricingDetail.subtitle')}</p>
        </div>
        <div className="page-header__actions" style={{ display: 'flex', gap: '10px' }}>
          {user?.role === 'admin' && (
            <>
              <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
                {t('pricingDetail.edit')}
              </button>
              <button className="btn btn--danger" onClick={handleDelete}>
                {t('pricingDetail.delete')}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <div className="profile__info">
          <div className="profile__row">
            <div className="profile__label">{t('pricingDetail.baseRate')}</div>
            <div className="profile__value">{formatCurrency(pricing.base_rate, i18n.language, { maximumFractionDigits: 2 })}</div>
          </div>
          <div className="profile__row">
            <div className="profile__label">{t('pricingDetail.perKm')}</div>
            <div className="profile__value">{formatCurrency(pricing.price_per_km, i18n.language, { maximumFractionDigits: 2 })}</div>
          </div>
          <div className="profile__row">
            <div className="profile__label">{t('pricingDetail.perKg')}</div>
            <div className="profile__value">{formatCurrency(pricing.price_per_kg, i18n.language, { maximumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('pricingDetail.modalTitle')}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label">{t('pricingDetail.vehicleType')}</label>
            <select className="select" value={formData.vehicle_type}
              onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}>
              {VEHICLE_TYPES.map((type) => (
                <option key={type} value={type}>{t(`vehicleTypes.${type}`)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-group__label">{t('pricingDetail.baseRateField')}</label>
            <input className="input" type="number" step="0.01" required value={formData.base_rate}
              onChange={(e) => setFormData({ ...formData, base_rate: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-group__label">{t('pricingDetail.perKmField')}</label>
            <input className="input" type="number" step="0.01" required value={formData.price_per_km}
              onChange={(e) => setFormData({ ...formData, price_per_km: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-group__label">{t('pricingDetail.perKgField')}</label>
            <input className="input" type="number" step="0.01" required value={formData.price_per_kg}
              onChange={(e) => setFormData({ ...formData, price_per_kg: e.target.value })} />
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>{t('common.cancel')}</button>
            <button type="submit" className="btn btn--primary" disabled={updatePricing.isPending}>
              {updatePricing.isPending ? t('common.saving') : t('common.save')}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default PricingDetail;