import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import { formatCurrency, formatDate } from '../lib/format';
import { getOrderStatusBadge, getOrderStatusLabel } from '../lib/orderStatus';

function Dashboard() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [summary, setSummary] = useState({
    active_orders: 0,
    available_vehicles: 0,
    active_drivers: 0,
    new_orders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Водителю не нужно грузить общую статистику и все заказы
    if (user?.role === 'driver') {
      setLoading(false);
      return;
    }

    Promise.all([
      api.get('/dashboard/summary'),
      api.get('/orders/'),
    ]).then(([summaryData, ordersData]) => {
      setSummary(summaryData);
      setRecentOrders(ordersData.slice(-5).reverse());
      setLoading(false);
    }).catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <div style={{ padding: '20px' }}>{t('common.loading')}</div>;
  if (error) return <ErrorMessage message={error} />;

  // Для водителя — упрощённый дашборд
  if (user?.role === 'driver') {
    return (
      <>
        <div className="page-header">
          <div>
            <h2 className="page-header__title">{t('dashboard.title')}</h2>
            <p className="page-header__subtitle">
              {t('dashboard.welcome', { name: user.full_name })}
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card__header card__header--accent">
            <h3 className="card__title">{t('dashboard.yourOrders')}</h3>
          </div>
          <p>{t('dashboard.driverHint')}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="cards-grid">
        <div className="card card--metric card--accent-primary">
          <div className="card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <div className="card__value">{summary.active_orders}</div>
          <div className="card__label">{t('dashboard.metrics.activeOrders')}</div>
        </div>

        <div className="card card--metric card--accent-success">
          <div className="card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 3h15v13H1z" />
              <path d="M16 8h4l3 3v5h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div className="card__value">{summary.available_vehicles}</div>
          <div className="card__label">{t('dashboard.metrics.availableVehicles')}</div>
        </div>

        <div className="card card--metric card--accent-warning">
          <div className="card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
            </svg>
          </div>
          <div className="card__value">{summary.active_drivers}</div>
          <div className="card__label">{t('dashboard.metrics.activeDrivers')}</div>
        </div>

        <div className="card card--metric card--accent-info">
          <div className="card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <div className="card__value">{summary.new_orders}</div>
          <div className="card__label">{t('dashboard.metrics.newOrders')}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="card__header" style={{ padding: '20px 24px', marginBottom: 0, borderBottom: '1px solid #f3f4f6' }}>
          <div>
            <h3 className="card__title">{t('dashboard.recentOrders')}</h3>
            <p className="card__subtitle">{t('dashboard.recentSubtitle')}</p>
          </div>
          <a href="/orders" className="btn btn--ghost btn--secondary">
            {t('dashboard.allOrders')}
          </a>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>{t('dashboard.table.number')}</th>
                <th>{t('dashboard.table.client')}</th>
                <th>{t('dashboard.table.route')}</th>
                <th>{t('dashboard.table.status')}</th>
                <th>{t('dashboard.table.price')}</th>
                <th>{t('dashboard.table.date')}</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table__empty">{t('common.noData')}</td>
                </tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.client?.name || '—'}</td>
                    <td>{order.route ? `${order.route.from_address} → ${order.route.to_address}` : '—'}</td>
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
      </div>
    </>
  );
}

export default Dashboard;
