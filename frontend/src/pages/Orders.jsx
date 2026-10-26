import { useState, useEffect } from 'react';
import { api } from '../api/client';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/orders/')
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Ошибка: {error}</div>;

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">Все заказы</h2>
          <p className="page-header__subtitle">Всего: {orders.length} заказов</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn--primary">+ Создать заказ</button>
        </div>
      </div>

      <div className="toolbar">
        <input className="input toolbar__search" type="search" placeholder="Поиск по номеру, клиенту или маршруту..." />
        <select className="select select--auto">
          <option value="">Все статусы</option>
          <option value="new">Новые</option>
          <option value="assigned">Назначенные</option>
          <option value="in_progress">В пути</option>
          <option value="delivered">Доставленные</option>
          <option value="completed">Завершённые</option>
          <option value="cancelled">Отменённые</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>№</th>
              <th>Клиент</th>
              <th>Маршрут</th>
              <th>Водитель</th>
              <th>Машина</th>
              <th>Статус</th>
              <th>Цена</th>
              <th>Дата</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="9" className="table__empty">Нет данных</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                  <td><strong>#{order.id}</strong></td>
                  <td>{order.client?.name || '—'}</td>
                  <td>{order.route ? `${order.route.from_address} → ${order.route.to_address}` : '—'}</td>
                  <td>{order.driver?.full_name || '—'}</td>
                  <td className="table__cell-muted">{order.vehicle?.plate_number || '—'}</td>
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
                  <td className="table__cell-actions">
                    <button className="btn btn--ghost btn--sm">Открыть</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Orders;