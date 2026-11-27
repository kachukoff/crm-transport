import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import DriverSelect from '../components/DriverSelect';
import DropdownSelect from '../components/DropdownSelect';
import ErrorMessage from '../components/ErrorMessage';
import { formatCurrency, formatDate } from '../lib/format';
import {
  ORDER_STATUSES,
  getOrderStatusBadge,
  getOrderStatusLabel,
} from '../lib/orderStatus';

const PER_PAGE_OPTIONS = [10, 20, 50, 100];
const DEFAULT_PER_PAGE = 20;

function Orders() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    client_id: '',
    route_id: '',
    cargo_name: '',
    weight_kg: '',
    price: '',
  });

  const search = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || '';
  const driverFilter = searchParams.get('driver') || '';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const perPageParam = Number(searchParams.get('per_page'));
  const perPage = PER_PAGE_OPTIONS.includes(perPageParam) ? perPageParam : DEFAULT_PER_PAGE;

  const { data, isLoading, error } = useQuery({
    queryKey: ['orders', { search, statusFilter, driverFilter, page, perPage }],
    queryFn: () => {
      const params = new URLSearchParams({
        limit: String(perPage),
        offset: String((page - 1) * perPage),
      });

      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      if (driverFilter) params.set('driver_id', driverFilter);

      return api.get(`/orders/?${params.toString()}`);
    },
    placeholderData: (previousData) => previousData,
  });

  const orders = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

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

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    next.delete('page');
    setSearchParams(next);
  };

  const goToPage = (nextPage) => {
    const next = new URLSearchParams(searchParams);

    if (nextPage <= 1) {
      next.delete('page');
    } else {
      next.set('page', String(nextPage));
    }

    setSearchParams(next);
  };

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
          value={search}
          onChange={(e) => updateFilter('search', e.target.value)}
        />

        <DropdownSelect
          className="driver-select--auto"
          compact
          options={ORDER_STATUSES.map(status => ({
            value: status,
            label: t(`orders.statusOptions.${status}`),
          }))}
          value={statusFilter}
          onChange={(value) => updateFilter('status', value)}
          placeholder={t('orders.allStatuses')}
          emptyLabel={t('orders.allStatuses')}
          ariaLabel={t('orders.allStatuses')}
          allowEmpty
        />

        <DriverSelect
          className="driver-select--auto"
          options={drivers}
          value={driverFilter}
          onChange={(value) => updateFilter('driver', value)}
          placeholder={t('orders.allDrivers')}
          searchPlaceholder={t('orders.driverSearchPlaceholder')}
          emptyLabel={t('orders.allDrivers')}
          allowEmpty
        />

        <DropdownSelect
          className="driver-select--auto"
          compact
          options={PER_PAGE_OPTIONS.map(value => ({
            value: String(value),
            label: String(value),
          }))}
          value={String(perPage)}
          onChange={(value) => updateFilter('per_page', value)}
          placeholder={String(perPage)}
          ariaLabel={t('orders.perPage')}
        />

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

        {total > 0 && (
          <div className="pagination">
            <span>
              {t('orders.showing', {
                from: (page - 1) * perPage + 1,
                to: Math.min(page * perPage, total),
                total,
              })}
            </span>

            <div className="pagination__controls">
              <button
                type="button"
                className="pagination__btn"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
              >
                {t('orders.prev')}
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => (
                <button
                  key={pageNumber}
                  type="button"
                  className={`pagination__btn${pageNumber === page ? ' is-active' : ''}`}
                  onClick={() => goToPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                className="pagination__btn"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
              >
                {t('orders.next')}
              </button>
            </div>
          </div>
        )}
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