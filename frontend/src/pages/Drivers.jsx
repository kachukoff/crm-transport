import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import Modal from '../components/Modal';
import ErrorMessage from '../components/ErrorMessage';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { DRIVER_STATUSES, getDriverStatusBadge, getDriverStatusLabel } from '../lib/driverStatus';

function Drivers() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', phone: '', license_number: '' });

  const { data: drivers = [], isLoading, error } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => api.get('/drivers/'),
  });

  const createDriver = useMutation({
    mutationFn: (newDriver) => api.post('/drivers/', newDriver),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      setIsModalOpen(false);
      setFormData({ full_name: '', phone: '', license_number: '' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createDriver.mutate(formData);
  };

  if (isLoading) return <div style={{ padding: '20px' }}>{t('common.loading')}</div>;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="toolbar">
        <input className="input toolbar__search" type="search" placeholder={t('drivers.searchPlaceholder')}
          aria-label={t('drivers.searchPlaceholder')} />
        <select className="select select--auto" aria-label={t('drivers.allStatuses')}>
          <option value="">{t('drivers.allStatuses')}</option>
          <option value="available">{t('statuses.driver.available')}</option>
          <option value="on_route">{t('statuses.driver.on_route')}</option>
          <option value="day_off">{t('statuses.driver.day_off')}</option>
          <option value="fired">{t('statuses.driver.fired')}</option>
        </select>
        <div className="toolbar__spacer" />
        {user?.role !== 'driver' && (
          <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
            {t('drivers.add')}
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>{t('drivers.table.name')}</th>
              <th>{t('drivers.table.phone')}</th>
              <th>{t('drivers.table.license')}</th>
              <th>{t('drivers.table.status')}</th>
              <th>{t('drivers.table.vehicle')}</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr>
                <td colSpan="5" className="table__empty">{t('common.noData')}</td>
              </tr>
            ) : (
              drivers.map(driver => (
                <tr
                  key={driver.id}
                  onClick={() => navigate(`/drivers/${driver.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td><strong>{driver.full_name}</strong></td>
                  <td>{driver.phone || '—'}</td>
                  <td className="table__cell-muted">{driver.license_number || '—'}</td>
                  <td>
                    <span className={`badge ${getDriverStatusBadge(driver.status)}`}>
                      {getDriverStatusLabel(t, driver.status)}
                    </span>
                  </td>
                  <td className="table__cell-muted">{driver.vehicle_plate || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('drivers.modal.title')}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label">{t('drivers.modal.name')}</label>
            <input
              className="input"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-group__label">{t('drivers.modal.phone')}</label>
            <input
              className="input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-group__label">{t('drivers.modal.license')}</label>
            <input
              className="input"
              value={formData.license_number}
              onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
            />
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn--primary" disabled={createDriver.isPending}>
              {createDriver.isPending ? t('common.saving') : t('common.save')}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Drivers;