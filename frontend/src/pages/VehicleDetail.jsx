import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '../api/client';
import Modal from '../components/Modal';
import ErrorMessage from '../components/ErrorMessage';
import { formatNumber } from '../lib/format';
import { VEHICLE_TYPES, getVehicleStatusBadge, getVehicleStatusLabel, getVehicleTypeLabel, VEHICLE_STATUSES } from '../lib/vehicle';
import { localizeVehicleBrand, localizeVehicleModel } from '../lib/vehicleNames';


function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
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
      alert(t('vehicleDetail.deleteError', { message: error.message }));
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
    if (window.confirm(t('vehicleDetail.deleteConfirm'))) {
      deleteVehicle.mutate();
    }
  };

  if (isLoading) return <div style={{ padding: '20px' }}>{t('common.loading')}</div>;
  if (error) return <ErrorMessage message={error.message} />;
  if (!vehicle) return <div style={{ padding: '20px' }}>{t('vehicleDetail.notFound')}</div>;

  return (
    <>
      <div className="page-header">
        <div>
          <button className="btn btn--ghost btn--sm" onClick={() => navigate('/vehicles')} style={{ marginBottom: '10px' }}>
            {t('vehicleDetail.back')}
          </button>
          <p className="page-header__subtitle">{localizeVehicleBrand(vehicle.brand, i18n.language)} {localizeVehicleModel(vehicle.model, i18n.language)}</p>
        </div>
        <div className="page-header__actions" style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
            {t('vehicleDetail.edit')}
          </button>
          <button className="btn btn--danger" onClick={handleDelete}>
            {t('vehicleDetail.delete')}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="profile__info">
          <div className="profile__row">
            <div className="profile__label">{t('vehicleDetail.type')}</div>
            <div className="profile__value">{getVehicleTypeLabel(t, vehicle.vehicle_type)}</div>
          </div>
          <div className="profile__row">
            <div className="profile__label">{t('vehicleDetail.capacity')}</div>
            <div className="profile__value">
              {vehicle.capacity_kg ? t('vehicles.capacityValue', { value: formatNumber(vehicle.capacity_kg, i18n.language) }) : '—'}
            </div>
          </div>
          <div className="profile__row">
            <div className="profile__label">{t('vehicleDetail.status')}</div>
            <div className="profile__value">
              <span className={`badge ${getVehicleStatusBadge(vehicle.status)}`}>
                {getVehicleStatusLabel(t, vehicle.status)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('vehicleDetail.modalTitle')}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label">{t('vehicleDetail.plate')}</label>
            <input className="input" required value={formData.plate_number}
              onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-group__label">{t('vehicleDetail.brand')}</label>
            <input className="input" value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-group__label">{t('vehicleDetail.model')}</label>
            <input className="input" value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-group__label">{t('vehicleDetail.typeField')}</label>
            <select className="select" value={formData.vehicle_type}
              onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}>
              {VEHICLE_TYPES.map((type) => (
                <option key={type} value={type}>{t(`vehicleTypes.${type}`)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-group__label">{t('vehicleDetail.capacityField')}</label>
            <input className="input" type="number" value={formData.capacity_kg}
              onChange={(e) => setFormData({ ...formData, capacity_kg: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-group__label">{t('vehicleDetail.status')}</label>
            <select className="select" value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              {VEHICLE_STATUSES.map((status) => (
                <option key={status} value={status}>{t(`statuses.vehicle.${status}`)}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn--primary" disabled={updateVehicle.isPending}>
              {updateVehicle.isPending ? t('common.saving') : t('common.save')}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default VehicleDetail;