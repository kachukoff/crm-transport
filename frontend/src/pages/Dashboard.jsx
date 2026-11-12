import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ active_orders: 0, available_vehicles: 0, active_drivers: 0, new_orders: 0 });
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
      api.get('/orders/')
    ]).then(([summaryData, ordersData]) => {
      setSummary(summaryData);
      setRecentOrders(ordersData.slice(-5).reverse());
      setLoading(false);
    }).catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
  if (error) return <ErrorMessage message={error} />;

  // Для водителя — упрощённый дашборд
  if (user?.role === 'driver') {
    return (
      <>
        <div className="page-header">
          <div>
            <h2 className="page-header__title">Обзор</h2>
            <p className="page-header__subtitle">Добро пожаловать, {user.full_name}</p>
          </div>
        </div>
        <div className="card">
          <div className="card__header card__header--accent">
            <h3 className="card__title">Ваши заказы</h3>
          </div>
          <p>Перейдите в раздел «Заказы», чтобы увидеть свои рейсы.</p>
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
          <div className="card__label">Активные заказы</div>
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
          <div className="card__label">Свободные машины</div>
        </div>

        <div className="card card--metric card--accent-warning">
          <div className="card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
            </svg>
          </div>
          <div className="card__value">{summary.active_drivers}</div>
          <div className="card__label">Водители на смене</div>
        </div>

        <div className="card card--metric card--accent-info">
          <div className="card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <div className="card__value">{summary.new_orders}</div>
          <div className="card__label">Новые заявки</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="card__header" style={{ padding: '20px 24px', marginBottom: 0, borderBottom: '1px solid #f3f4f6' }}>
          <div>
            <h3 className="card__title">Последние заказы</h3>
            <p className="card__subtitle">5 последних изменений</p>
          </div>
          <a href="/orders" className="btn btn--ghost btn--secondary">Все заказы →</a>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>№</th>
                <th>Клиент</th>
                <th>Маршрут</th>
                <th>Статус</th>
                <th>Цена</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan="6" className="table__empty">Нет данных</td></tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.client?.name || '—'}</td>
                    <td>{order.route ? `${order.route.from_address} → ${order.route.to_address}` : '—'}</td>
                    <td>
                      <span className={`badge ${order.status === 'new' ? 'badge--neutral' :
                        order.status === 'assigned' ? 'badge--info' :
                          order.status === 'in_progress' ? 'badge--warning' :
                            order.status === 'delivered' ? 'badge--success' :
                              order.status === 'completed' ? 'badge--primary' : 'badge--danger'
                        }`}>
                        {order.status === 'new' ? 'Новый' :
                          order.status === 'assigned' ? 'Назначен' :
                            order.status === 'in_progress' ? 'В пути' :
                              order.status === 'delivered' ? 'Доставлен' :
                                order.status === 'completed' ? 'Завершён' : 'Отменён'}
                      </span>
                    </td>
                    <td>{order.price ? `${order.price} ₽` : '—'}</td>
                    <td className="table__cell-muted">
                      {new Date(order.created_at).toLocaleDateString('ru-RU')}
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