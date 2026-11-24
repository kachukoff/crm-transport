import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import ErrorMessage from '../components/ErrorMessage';
import { formatCurrency, formatDate } from '../lib/format';
import {
  ORDER_STATUSES,
  getOrderStatusBadge,
  getOrderStatusLabel,
} from '../lib/orderStatus';

function Orders() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    client_id: '',
    route_id: '',
    cargo_name: '',
    weight_kg: '',
    price: '',
  });

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get('/orders/'),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => api.get('/clients/'),
  });

  const { data: routes = [] } = useQuery({
    queryKey: ['routes'],
    queryFn: () => api.get('/routes/'),
  });

  const { data: drivers = [] } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => api.get('/drivers/'),
  });

  const createOrder = useMutation({
    mutationFn: (newOrder) => api.post('/orders/', newOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsModalOpen(false);
      setFormData({ client_id: '', route_id: '', cargo_name: '', weight_kg: '', price: '' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createOrder.mutate({
      client_id: Number(formData.client_id),
      route_id: Number(formData.route_id),
      cargo_name: formData.cargo_name,
      weight_kg: Number(formData.weight_kg),
      price: formData.price ? Number(formData.price) : null,
      source: 'manager_manual',
    });
  };

  if (isLoading) return <div style={{ padding: '20px' }}>{t('common.loading')}</div>;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="toolbar">
        <input
          className="input toolbar__search"
          type="search"
          placeholder={t('orders.searchPlaceholder')}
          aria-label={t('orders.searchPlaceholder')}
        />

        <select className="select select--auto" aria-label={t('orders.allStatuses')}>
          <option value="">{t('orders.allStatuses')}</option>
          {ORDER_STATUSES.map(status => (
            <option key={status} value={status}>
              {t(`orders.statusOptions.${status}`)}
            </option>
          ))}
        </select>

        <select className="select select--auto" aria-label={t('orders.allDrivers')}>
          <option value="">{t('orders.allDrivers')}</option>
          {drivers.map(d => (
            <option key={d.id} value={d.id}>{d.full_name}</option>
          ))}
        </select>

        <div className="toolbar__spacer" />

        {user?.role !== 'driver' && (
          <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
            {t('orders.create')}
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>{t('orders.table.number')}</th>
              <th>{t('orders.table.client')}</th>
              <th>{t('orders.table.route')}</th>
              <th>{t('orders.table.driver')}</th>
              <th>{t('orders.table.vehicle')}</th>
              <th>{t('orders.table.status')}</th>
              <th>{t('orders.table.price')}</th>
              <th>{t('orders.table.date')}</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="table__empty">{t('common.noData')}</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr
                  key={order.id}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td><strong>#{order.id}</strong></td>
                  <td>{order.client?.name || '—'}</td>
                  <td>{order.route ? `${order.route.from_address} → ${order.route.to_address}` : '—'}</td>
                  <td>{order.driver?.full_name || '—'}</td>
                  <td className="table__cell-muted">{order.vehicle?.plate_number || '—'}</td>
                  <td>
                    <span className={`badge ${getOrderStatusBadge(order.status)}`}>
                      {getOrderStatusLabel(t, order.status)}
                    </span>
                  </td>
                  <td>{order.price != null ? formatCurrency(order.price, i18n.language) : '—'}</td>
                  <td className="table__cell-muted">
                    {formatDate(order.created_at, i18n.language)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('orders.modal.title')}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label">{t('orders.modal.client')}</label>
            <select
              className="select"
              required
              value={formData.client_id}
              onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
            >
              <option value="">{t('orders.modal.clientPlaceholder')}</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-group__label">{t('orders.modal.route')}</label>
            <select
              className="select"
              required
              value={formData.route_id}
              onChange={(e) => setFormData({ ...formData, route_id: e.target.value })}
            >
              <option value="">{t('orders.modal.routePlaceholder')}</option>
              {routes.map(r => (
                <option key={r.id} value={r.id}>{r.from_address} → {r.to_address}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-group__label">{t('orders.modal.cargo')}</label>
            <input
              className="input"
              required
              value={formData.cargo_name}
              onChange={(e) => setFormData({ ...formData, cargo_name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">{t('orders.modal.weight')}</label>
            <input
              className="input"
              type="number"
              required
              value={formData.weight_kg}
              onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">{t('orders.modal.price')}</label>
            <input
              className="input"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setIsModalOpen(false)}
            >
              {t('orders.modal.cancel')}
            </button>
            <button type="submit" className="btn btn--primary" disabled={createOrder.isPending}>
              {createOrder.isPending ? t('orders.modal.saving') : t('orders.modal.create')}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Orders;
