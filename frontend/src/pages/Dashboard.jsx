import { useState, useEffect } from 'react';
import { api } from '../api/client';

function Dashboard() {
  const [summary, setSummary] = useState({ active_orders: 0, available_vehicles: 0, active_drivers: 0, new_orders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Загружаем статистику и последние заказы параллельно
    Promise.all([
      api.get('/dashboard/summary'),
      api.get('/orders/') // Временно берем все заказы, потом отфильтруем
    ]).then(([summaryData, ordersData]) => {
      setSummary(summaryData);
      // Берем последние 5 заказов (они уже отсортированы по возрастанию ID, поэтому берем с конца)
      setRecentOrders(ordersData.slice(-5).reverse());
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Загрузка...</div>;

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">Обзор</h2>
          <p className="page-header__subtitle">Актуальные показатели на {new Date().toLocaleDateString('ru-RU')}</p>
        </div>
      </div>

      <div className="cards-grid">
        <div className="card card--metric card--accent-primary">
          <div className="card__value">{summary.active_orders}</div>
          <div className="card__label">Активные заказы</div>
        </div>

        <div className="card card--metric card--accent-success">
          <div className="card__value">{summary.available_vehicles}</div>
          <div className="card__label">Свободные машины</div>
        </div>

        <div className="card card--metric card--accent-warning">
          <div className="card__value">{summary.active_drivers}</div>
          <div className="card__label">Водители на смене</div>
        </div>

        <div className="card card--metric card--accent-info">
          <div className="card__value">{summary.new_orders}</div>
          <div className="card__label">Новые заявки</div>
        </div>
      </div>

      <div className="card">
        <div className="card__header">
          <div>
            <h3 className="card__title">Последние заказы</h3>
            <p className="card__subtitle">5 последних изменений</p>
          </div>
          <a href="/orders" className="btn btn--ghost btn--sm">Все заказы →</a>
        </div>

        <div className="table-wrapper" style={{ boxShadow: 'none', border: 'none' }}>
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
                      <span className={`badge ${
                        order.status === 'new' ? 'badge--neutral' :
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