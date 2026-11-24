import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import Modal from '../components/Modal';
import ErrorMessage from '../components/ErrorMessage';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { formatNumber } from '../lib/format';
import { VEHICLE_TYPES, getVehicleStatusBadge, getVehicleStatusLabel, getVehicleTypeLabel } from '../lib/vehicle';
import { localizeVehicleBrand, localizeVehicleModel } from '../lib/vehicleNames';

function Vehicles() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    plate_number: '',
    brand: '',
    model: '',
    vehicle_type: 'gazelle',
    capacity_kg: '',
  });

  const { data: vehicles = [], isLoading, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => api.get('/vehicles/'),
  });

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
    const cleanData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== '')
    );
    if (cleanData.capacity_kg) {
      cleanData.capacity_kg = Number(cleanData.capacity_kg);
    }
    createVehicle.mutate(cleanData);
  };

  if (isLoading) return <div style={{ padding: '20px' }}>{t('common.loading')}</div>;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="toolbar">
        <input className="input toolbar__search" type="search" placeholder={t('vehicles.searchPlaceholder')}
          aria-label={t('vehicles.searchPlaceholder')} />
        <select className="select select--auto" aria-label={t('vehicles.allStatuses')}>
          <option value="">{t('vehicles.allStatuses')}</option>
          <option value="available">{t('statuses.vehicle.available')}</option>
          <option value="on_route">{t('statuses.vehicle.on_route')}</option>
          <option value="maintenance">{t('statuses.vehicle.maintenance')}</option>
        </select>
        <div className="toolbar__spacer" />
        {user?.role !== 'driver' && (
          <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
            {t('vehicles.add')}
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>{t('vehicles.table.plate')}</th>
              <th>{t('vehicles.table.brandModel')}</th>
              <th>{t('vehicles.table.type')}</th>
              <th>{t('vehicles.table.capacity')}</th>
              <th>{t('vehicles.table.status')}</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan="5" className="table__empty">{t('common.noData')}</td>
              </tr>
            ) : (
              vehicles.map(vehicle => (
                <tr
                  key={vehicle.id}
                  onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td><strong>{vehicle.plate_number}</strong></td>
                  <td>{localizeVehicleBrand(vehicle.brand, i18n.language)} 
                    {localizeVehicleModel(vehicle.model, i18n.language)}</td>
                  <td className="table__cell-muted">{getVehicleTypeLabel(t, vehicle.vehicle_type)}</td>
                  <td>{vehicle.capacity_kg ? t('vehicles.capacityValue', { value: formatNumber(vehicle.capacity_kg, i18n.language) }) : '—'}</td>
                  <td>
                    <span className={`badge ${getVehicleStatusBadge(vehicle.status)}`}>
                      {getVehicleStatusLabel(t, vehicle.status)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('vehicles.modal.title')}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label">{t('vehicles.modal.plate')}</label>
            <input
              className="input"
              required
              placeholder={t('vehicles.modal.platePlaceholder')}
              value={formData.plate_number}
              onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">{t('vehicles.modal.brand')}</label>
            <input
              className="input"
              placeholder={t('vehicles.modal.brandPlaceholder')}
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">{t('vehicles.modal.model')}</label>
            <input
              className="input"
              placeholder={t('vehicles.modal.modelPlaceholder')}
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">{t('vehicles.modal.type')}</label>
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
            <label className="form-group__label">{t('vehicles.modal.capacity')}</label>
            <input
              className="input"
              type="number"
              pplaceholder={t('vehicles.modal.capacityPlaceholder')}
              value={formData.capacity_kg}
              onChange={(e) => setFormData({ ...formData, capacity_kg: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn--primary" disabled={createVehicle.isPending}>
              {createVehicle.isPending ? t('common.saving') : t('common.create')}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Vehicles;