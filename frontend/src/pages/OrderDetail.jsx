import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

function OrderDetail() {
  const { id } = useParams();
  console.log('ID заказа из URL:', id);
  const navigate = useNavigate();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get(`/orders/${id}`),
  });

  if (isLoading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Ошибка: {error.message}</div>;
  if (!order) return <div style={{ padding: '20px' }}>Заказ не найден</div>;

  const statusMap = {
    new: 'Новый',
    assigned: 'Назначен',
    in_progress: 'В пути',
    delivered: 'Доставлен',
    completed: 'Завершён',
    canceled: 'Отменен',
  };
  console.log('order:', order);
  return (
    <>
      <div className="page-header">
        <div>
          <button 
            className="btn btn--ghost btn--sm" 
            onClick={() => navigate('/orders')}
            style={{ marginBottom: '10px' }}
          >
            ← Назад к заказам
          </button>
          <h2 className="page-header__title">Заказ #{order.id}</h2>
          <p className="page-header__subtitle">
            Создан: {order.created_at ? new Date(order.created_at.slice(0, 23)).toLocaleString('ru-RU') : '—'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Левая колонка: Информация о заказе */}
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Информация о заказе</h3>
            <span className={`badge ${
              order.status === 'new' ? 'badge--neutral' :
              order.status === 'assigned' ? 'badge--info' :
              order.status === 'in_progress' ? 'badge--warning' :
              order.status === 'delivered' ? 'badge--success' :
              order.status === 'completed' ? 'badge--primary' : 'badge--danger'
            }`}>
              {statusMap[order.status]}
            </span>
          </div>
          
          <div className="profile__info">
            <div className="profile__row">
              <div className="profile__label">Клиент</div>
              <div className="profile__value">{order.client?.name || '—'}</div>
            </div>
            <div className="profile__row">
              <div className="profile__label">Маршрут</div>
              <div className="profile__value">
                {order.route ? `${order.route.from_address} → ${order.route.to_address}` : '—'}
              </div>
            </div>
            <div className="profile__row">
              <div className="profile__label">Груз</div>
              <div className="profile__value">{order.cargo_name || '—'} ({order.weight_kg || 0} кг)</div>
            </div>
            <div className="profile__row">
              <div className="profile__label">Стоимость</div>
              <div className="profile__value"><strong>{order.price ? `${order.price} ₽` : 'Не рассчитана'}</strong></div>
            </div>
            <div className="profile__row">
              <div className="profile__label">Водитель</div>
              <div className="profile__value">{order.driver?.full_name || 'Не назначен'}</div>
            </div>
            <div className="profile__row">
              <div className="profile__label">Машина</div>
              <div className="profile__value">{order.vehicle?.plate_number || 'Не назначена'}</div>
            </div>
          </div>
        </div>

        {/* Правая колонка: Действия */}
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Действия</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="btn btn--primary btn--block">Назначить водителя</button>
            <button className="btn btn--secondary btn--block">Редактировать заказ</button>
            <button className="btn btn--danger btn--block">Отменить заказ</button>
          </div>
        </div>

      </div>
    </>
  );
}

export default OrderDetail;