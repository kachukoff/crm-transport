import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import Modal from '../components/Modal';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';


function Orders() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
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
      weight_kg: formData.weight_kg ? Number(formData.weight_kg) : null,
      price: formData.price ? Number(formData.price) : null,
      source: 'manager_manual',
    });
  };

  if (isLoading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Ошибка: {error.message}</div>;

  const statusMap = {
    new: 'Новый', assigned: 'Назначен', in_progress: 'В пути',
    delivered: 'Доставлен', completed: 'Завершён', cancelled: 'Отменён',
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">Все заказы</h2>
          <p className="page-header__subtitle">Всего: {orders.length} заказов</p>
        </div>
        <div className="page-header__actions">
          {user?.role !== 'driver' && (
            <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
              + Создать заказ
            </button>
          )}
        </div>
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
              <tr><td colSpan="9" className="table__empty">Нет данных</td></tr>
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
                    <span className={`badge ${order.status === 'new' ? 'badge--neutral' :
                        order.status === 'assigned' ? 'badge--info' :
                          order.status === 'in_progress' ? 'badge--warning' :
                            order.status === 'delivered' ? 'badge--success' :
                              order.status === 'completed' ? 'badge--primary' : 'badge--danger'
                      }`}>
                      {statusMap[order.status]}
                    </span>
                  </td>
                  <td>{order.price ? `${order.price} ₽` : '—'}</td>
                  <td className="table__cell-muted">
                    {new Date(order.created_at.slice(0, 23)).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="table__cell-actions" onClick={(e) => e.stopPropagation()}>
                    <Link to={`/orders/${order.id}`} className="btn btn--ghost btn--sm">Открыть</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Создать заказ">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label">Клиент</label>
            <select className="select" required value={formData.client_id}
              onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}>
              <option value="">-- Выберите клиента --</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-group__label">Маршрут</label>
            <select className="select" required value={formData.route_id}
              onChange={(e) => setFormData({ ...formData, route_id: e.target.value })}>
              <option value="">-- Выберите маршрут --</option>
              {routes.map(r => <option key={r.id} value={r.id}>{r.from_address} → {r.to_address}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-group__label">Название груза</label>
            <input className="input" required value={formData.cargo_name}
              onChange={(e) => setFormData({ ...formData, cargo_name: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-group__label">Вес (кг)</label>
            <input className="input" type="number" required value={formData.weight_kg}
              onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-group__label">Цена (₽, опционально)</label>
            <input className="input" type="number" value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
          </div>

          <div className="form-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>Отмена</button>
            <button type="submit" className="btn btn--primary" disabled={createOrder.isPending}>
              {createOrder.isPending ? 'Сохранение...' : 'Создать'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Orders;