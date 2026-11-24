import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import ErrorMessage from '../components/ErrorMessage';
import { formatCurrency, formatDateTime, formatNumber } from '../lib/format';
import { localizeVehicleBrand, localizeVehicleModel } from '../lib/vehicleNames';
import {
  ORDER_STATUSES,
  ORDER_STATUS_KEYS,
  getOrderStatusBadge,
  getOrderStatusLabel,
} from '../lib/orderStatus';

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get(`/orders/${id}`),
  });

  const { data: drivers = [] } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => api.get('/drivers/'),
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => api.get('/vehicles/'),
  });

  const updateStatus = useMutation({
    mutationFn: (newStatus) => api.patch(`/orders/${id}/status`, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
    onError: (err) => {
      alert(t('orderDetail.statusChangeError', { message: err.message }));
    },
  });

  const assignDriver = useMutation({
    mutationFn: (data) => api.patch(`/orders/${id}/assign`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setIsAssignModalOpen(false);
    },
  });

  const deleteOrder = useMutation({
    mutationFn: () => api.delete(`/orders/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      navigate('/orders');
    },
    onError: (err) => {
      alert(t('orderDetail.deleteError', { message: err.message }));
    },
  });

  if (isLoading) return <div style={{ padding: '20px' }}>{t('common.loading')}</div>;
  if (error) return <ErrorMessage message={error.message} />;
  if (!order) return <div style={{ padding: '20px' }}>{t('orderDetail.notFound')}</div>;

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    if (!newStatus) return;
    updateStatus.mutate(newStatus);
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    assignDriver.mutate({
      driver_id: Number(selectedDriverId),
      vehicle_id: Number(selectedVehicleId),
    });
  };

  const handleDelete = () => {
    if (window.confirm(t('orderDetail.confirmDelete'))) {
      deleteOrder.mutate();
    }
  };

  const availableDrivers = drivers.filter(d => d.status === 'available' || d.id === order.driver_id);
  const availableVehicles = vehicles.filter(v => v.status === 'available' || v.id === order.vehicle_id);

  return (
    <>
      <div className="page-header">
        <div>
          <button
            className="btn btn--ghost btn--secondary"
            onClick={() => navigate('/orders')}
            style={{ marginBottom: '10px' }}
          >
            {t('orderDetail.back')}
          </button>
          <h2 className="page-header__title">
            {t('orderDetail.orderTitle', { id: order.id })}
          </h2>
          <p className="page-header__subtitle">
            {t('orderDetail.created', {
              date: formatDateTime(order.created_at, i18n.language),
            })}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">{t('orderDetail.info')}</h3>
            <span className={`badge ${getOrderStatusBadge(order.status)}`}>
              {getOrderStatusLabel(t, order.status)}
            </span>
          </div>

          <div className="profile__info">
            <div className="profile__row">
              <div className="profile__label">{t('orderDetail.client')}</div>
              <div className="profile__value">{order.client?.name || '—'}</div>
            </div>
            <div className="profile__row">
              <div className="profile__label">{t('orderDetail.route')}</div>
              <div className="profile__value">
                {order.route ? `${order.route.from_address} → ${order.route.to_address}` : '—'}
              </div>
            </div>
            <div className="profile__row">
              <div className="profile__label">{t('orderDetail.cargo')}</div>
              <div className="profile__value">
                {order.cargo_name
                  ? t('orderDetail.cargoValue', {
                    name: order.cargo_name,
                    weight: formatNumber(order.weight_kg || 0, i18n.language),
                  })
                  : '—'}
              </div>
            </div>
            <div className="profile__row">
              <div className="profile__label">{t('orderDetail.price')}</div>
              <div className="profile__value">
                <strong>
                  {order.price != null
                    ? formatCurrency(order.price, i18n.language)
                    : t('orderDetail.priceNotCalculated')}
                </strong>
              </div>
            </div>
            <div className="profile__row">
              <div className="profile__label">{t('orderDetail.driver')}</div>
              <div className="profile__value">
                {order.driver?.full_name || t('orderDetail.driverNotAssigned')}
              </div>
            </div>
            <div className="profile__row">
              <div className="profile__label">{t('orderDetail.vehicle')}</div>
              <div className="profile__value">
                {order.vehicle?.plate_number || t('orderDetail.vehicleNotAssigned')}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <h3 className="card__title">{t('orderDetail.actions')}</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="form-group">
              <label className="form-group__label">{t('orderDetail.currentStatus')}</label>
              <select
                className="select"
                value={order.status}
                onChange={handleStatusChange}
                disabled={updateStatus.isPending}
              >
                <option value={order.status} disabled>
                  {t(ORDER_STATUS_KEYS[order.status] || ORDER_STATUS_KEYS.unknown)}
                </option>

                {ORDER_STATUSES.map((key) => {
                  if (key === order.status) return null;
                  if (order.status === 'completed' && key !== 'completed') return null;
                  if (order.status === 'cancelled' && key !== 'cancelled') return null;

                  return (
                    <option key={key} value={key}>
                      {t(ORDER_STATUS_KEYS[key])}
                    </option>
                  );
                })}
              </select>
              {updateStatus.isPending && (
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  {t('orderDetail.updating')}
                </span>
              )}
            </div>

            {user?.role !== 'driver' && (
              <>
                <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '10px 0' }} />

                <button
                  className="btn btn--primary btn--block"
                  onClick={() => setIsAssignModalOpen(true)}
                  disabled={order.status === 'completed' || order.status === 'cancelled'}
                >
                  {order.driver_id
                    ? t('orderDetail.changeAssignment')
                    : t('orderDetail.assignDriver')}
                </button>

                <button
                  className="btn btn--danger btn--block"
                  onClick={() => {
                    if (window.confirm(t('orderDetail.confirmCancel'))) {
                      updateStatus.mutate('cancelled');
                    }
                  }}
                  disabled={
                    updateStatus.isPending
                    || order.status === 'cancelled'
                    || order.status === 'completed'
                  }
                >
                  {t('orderDetail.cancelOrder')}
                </button>

                <button
                  className="btn btn--danger btn--block"
                  onClick={handleDelete}
                  disabled={deleteOrder.isPending}
                  style={{ marginTop: '10px' }}
                >
                  {deleteOrder.isPending
                    ? t('orderDetail.deleting')
                    : t('orderDetail.deleteOrder')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={t('orderDetail.assignTitle')}
      >
        <form onSubmit={handleAssignSubmit}>
          <div className="form-group">
            <label className="form-group__label">{t('orderDetail.driver')}</label>
            <select
              className="select"
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              required
            >
              <option value="">{t('orderDetail.driverPlaceholder')}</option>
              {availableDrivers.map(d => (
                <option key={d.id} value={d.id}>{d.full_name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-group__label">{t('orderDetail.vehicle')}</label>
            <select
              className="select"
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              required
            >
              <option value="">{t('orderDetail.vehiclePlaceholder')}</option>
              {availableVehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.plate_number} ({localizeVehicleBrand(v.brand, i18n.language)} {localizeVehicleModel(v.model, i18n.language)})
                </option>

              ))}
            </select>
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setIsAssignModalOpen(false)}
            >
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn--primary" disabled={assignDriver.isPending}>
              {assignDriver.isPending ? t('common.saving') : t('orderDetail.assign')}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default OrderDetail;
