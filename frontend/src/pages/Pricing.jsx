import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import Modal from '../components/Modal';
import ErrorMessage from '../components/ErrorMessage';
import { formatCurrency } from '../lib/format';
import { VEHICLE_TYPES, getVehicleTypeLabel } from '../lib/vehicle';

function Pricing() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    vehicle_type: 'gazelle',
    base_rate: '',
    price_per_km: '',
    price_per_kg: '',
  });

  const { data: pricing = [], isLoading, error } = useQuery({
    queryKey: ['pricing'],
    queryFn: () => api.get('/pricing/'),
  });

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

  if (isLoading) return <div style={{ padding: '20px' }}>{t('common.loading')}</div>;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="toolbar">
        <input className="input toolbar__search" type="search" placeholder={t('pricing.searchPlaceholder')}
          aria-label={t('pricing.searchPlaceholder')} />
        <select className="select select--auto" aria-label={t('pricing.allTypes')}>
          <option value="">{t('pricing.allTypes')}</option>
          <option value="gazelle">{t('vehicleTypes.gazelle')}</option>
          <option value="medium">{t('vehicleTypes.medium')}</option>
          <option value="truck">{t('vehicleTypes.truck')}</option>
          <option value="refrigerator">{t('vehicleTypes.refrigerator')}</option>
        </select>
        <div className="toolbar__spacer" />
        {user?.role === 'admin' && (
          <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
            {t('pricing.add')}
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>{t('pricing.table.vehicleType')}</th>
              <th>{t('pricing.table.baseRate')}</th>
              <th>{t('pricing.table.perKm')}</th>
              <th>{t('pricing.table.perKg')}</th>
            </tr>
          </thead>
          <tbody>
            {pricing.length === 0 ? (
              <tr>
                <td colSpan="4" className="table__empty">{t('common.noData')}</td>
              </tr>
            ) : (
              pricing.map(rule => (
                <tr
                  key={rule.id}
                  onClick={() => navigate(`/pricing/${rule.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td><strong>{getVehicleTypeLabel(t, rule.vehicle_type)}</strong></td>
                  <td>{formatCurrency(rule.base_rate, i18n.language, { maximumFractionDigits: 2 })}</td>
                  <td>{formatCurrency(rule.price_per_km, i18n.language, { maximumFractionDigits: 2 })}</td>
                  <td>{formatCurrency(rule.price_per_kg, i18n.language, { maximumFractionDigits: 2 })}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('pricing.modal.title')}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label">{t('pricing.modal.vehicleType')}</label>
            <select
              className="select"
              value={formData.vehicle_type}
              onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
            >
              {VEHICLE_TYPES.map((type) => (
                <option key={type} value={type}>{t(`vehicleTypes.${type}`)}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-group__label">{t('pricing.modal.baseRate')}</label>
            <input
              className="input"
              type="number"
              required
              value={formData.base_rate}
              onChange={(e) => setFormData({ ...formData, base_rate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">{t('pricing.modal.perKm')}</label>
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
            <label className="form-group__label">{t('pricing.modal.perKg')}</label>
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
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn--primary" disabled={createPricing.isPending}>
              {createPricing.isPending ? t('common.saving') : t('common.create')}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Pricing;