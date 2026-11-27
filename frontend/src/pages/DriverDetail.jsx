import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useToast } from '../components/ToastContext';
import { api } from '../api/client';
import { DRIVER_STATUSES, getDriverStatusBadge, getDriverStatusLabel } from '../lib/driverStatus';
import Modal from '../components/Modal';
import ErrorMessage from '../components/ErrorMessage';

function DriverDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const toast = useToast();
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

  const deleteDriver = useMutation({
    mutationFn: () => api.delete(`/drivers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success(t('driverDetail.deleted'));
      navigate('/drivers');
    },
    onError: (error) => {
      toast.error(t('driverDetail.deleteError', { message: error.message }));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== '')
    );
    updateDriver.mutate(cleanData);
  };

  const handleDelete = () => {
    if (window.confirm(t('driverDetail.deleteConfirm'))) {
      deleteDriver.mutate();
    }
  };

  if (isLoading) return <div style={{ padding: '20px' }}>{t('common.loading')}</div>;
  if (error) return <ErrorMessage message={error.message} />;
  if (!driver) return <div style={{ padding: '20px' }}>{t('driverDetail.notFound')}</div>;

  return (
    <>
      <div className="page-header">
        <div>
          <button className="btn btn--ghost btn--sm" onClick={() => navigate('/drivers')} style={{ marginBottom: '10px' }}>
            {t('driverDetail.back')}
          </button>
          <h2 className="page-header__title">{driver.full_name}</h2>
          <p className="page-header__subtitle">{driver.phone || t('driverDetail.phoneNotSpecified')}</p>
        </div>
        <div className="page-header__actions" style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
            {t('driverDetail.edit')}
          </button>
          <button className="btn btn--danger" onClick={handleDelete}>
            {t('driverDetail.delete')}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="profile__info">
          <div className="profile__row">
            <div className="profile__label">{t('driverDetail.license')}</div>
            <div className="profile__value">{driver.license_number || '—'}</div>
          </div>
          <div className="profile__row">
            <div className="profile__label">{t('driverDetail.status')}</div>
            <div className="profile__value">
              <span className={`badge ${getDriverStatusBadge(driver.status)}`}>
                {getDriverStatusLabel(t, driver.status)}
              </span>
            </div>
          </div>
          <div className="profile__row">
            <div className="profile__label">{t('driverDetail.vehicle')}</div>
            <div className="profile__value">{driver.vehicle_plate || t('driverDetail.vehicleNotAssigned')}</div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('driverDetail.modalTitle')}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label">{t('driverDetail.name')}</label>
            <input className="input" required value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-group__label">{t('driverDetail.phone')}</label>
            <input className="input" value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-group__label">{t('driverDetail.licenseField')}</label>
            <input className="input" value={formData.license_number}
              onChange={(e) => setFormData({ ...formData, license_number: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-group__label">{t('driverDetail.status')}</label>
            <select className="select" value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              {DRIVER_STATUSES.map((status) => (
                <option key={status} value={status}>{t(`statuses.driver.${status}`)}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn--primary" disabled={updateDriver.isPending}>
              {updateDriver.isPending ? t('common.saving') : t('common.save')}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default DriverDetail;