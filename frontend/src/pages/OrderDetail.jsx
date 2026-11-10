import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { useState } from 'react';
import Modal from '../components/Modal';

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  // Загрузка заказа
  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get(`/orders/${id}`),
  });

  // Загрузка водителей и машин для выбора
  const { data: drivers = [] } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => api.get('/drivers/'),
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => api.get('/vehicles/'),
  });

  // Мутация для смены статуса
  const updateStatus = useMutation({
    mutationFn: (newStatus) => api.patch(`/orders/${id}/status`, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
    onError: (error) => {
      alert(`Ошибка при смене статуса: ${error.message}`);
    },
  });

  // Мутация для назначения водителя и машины
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
    onError: (error) => {
      alert(`Ошибка при удалении: ${error.message}`);
    },
  });

  if (isLoading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Ошибка: {error.message}</div>;
  if (!order) return <div style={{ padding: '20px' }}>Заказ не найден</div>;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr.slice(0, 23));
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('ru-RU') + ' ' + d.toLocaleTimeString('ru-RU');
  };

  const statusMap = {
    new: 'Новый',
    assigned: 'Назначен',
    in_progress: 'В пути',
    delivered: 'Доставлен',
    completed: 'Завершён',
    cancelled: 'Отменён',
  };

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
    if (window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
      deleteOrder.mutate();
    }
  };

  // Фильтруем только свободных водителей и машины
  const availableDrivers = drivers.filter(d => d.status === 'available' || d.id === order.driver_id);
  const availableVehicles = vehicles.filter(v => v.status === 'available' || v.id === order.vehicle_id);

  return (
    <>
      <div className="page-header">
        <div>
          <button className="btn btn--ghost btn--sm" onClick={() => navigate('/orders')} style={{ marginBottom: '10px' }}>
            ← Назад к заказам
          </button>
          <h2 className="page-header__title">Заказ #{order.id}</h2>
          <p className="page-header__subtitle">Создан: {formatDate(order.created_at)}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>

        {/* Левая колонка: Информация о заказе */}
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Информация о заказе</h3>
            <span className={`badge ${order.status === 'new' ? 'badge--neutral' :
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

            <div className="form-group">
              <label className="form-group__label">Текущий статус</label>
              <select
                className="select"
                value={order.status} // <-- Показываем ТЕКУЩИЙ статус
                onChange={handleStatusChange}
                disabled={updateStatus.isPending}
              >
                {/* Показываем текущий статус, но делаем его неактивным для выбора */}
                <option value={order.status} disabled>
                  {statusMap[order.status]}
                </option>

                {/* Показываем только те статусы, которые ОТЛИЧАЮТСЯ от текущего */}
                {Object.entries(statusMap).map(([key, label]) => {
                  if (key === order.status) return null; // Пропускаем текущий

                  // Скрываем некоторые нелогичные переходы (опционально)
                  if (order.status === 'completed' && key !== 'completed') return null;
                  if (order.status === 'cancelled' && key !== 'cancelled') return null;

                  return (
                    <option key={key} value={key}>{label}</option>
                  );
                })}
              </select>
              {updateStatus.isPending && <span style={{ fontSize: '12px', color: '#666' }}>Обновление...</span>}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '10px 0' }} />

            <button
              className="btn btn--primary btn--block"
              onClick={() => setIsAssignModalOpen(true)}
              disabled={order.status === 'completed' || order.status === 'cancelled'}
            >
              {order.driver_id ? 'Изменить назначение' : 'Назначить водителя'}
            </button>

            <button
              className="btn btn--danger btn--block"
              onClick={() => {
                if (window.confirm('Вы уверены, что хотите отменить заказ?')) {
                  updateStatus.mutate('cancelled');
                }
              }}
              disabled={updateStatus.isPending || order.status === 'cancelled' || order.status === 'completed'}
            >
              Отменить заказ
            </button>
            <button
              className="btn btn--danger btn--block"
              onClick={handleDelete}
              disabled={deleteOrder.isPending}
              style={{ marginTop: '10px' }}
            >
              {deleteOrder.isPending ? 'Удаление...' : 'Удалить заказ'}
            </button>
          </div>
        </div>

      </div>

      {/* Модалка назначения */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title="Назначить водителя и машину">
        <form onSubmit={handleAssignSubmit}>
          <div className="form-group">
            <label className="form-group__label">Водитель</label>
            <select
              className="select"
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              required
            >
              <option value="">-- Выберите водителя --</option>
              {availableDrivers.map(d => (
                <option key={d.id} value={d.id}>{d.full_name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-group__label">Машина</label>
            <select
              className="select"
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              required
            >
              <option value="">-- Выберите машину --</option>
              {availableVehicles.map(v => (
                <option key={v.id} value={v.id}>{v.plate_number} ({v.brand} {v.model})</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn--secondary" onClick={() => setIsAssignModalOpen(false)}>
              Отмена
            </button>
            <button type="submit" className="btn btn--primary" disabled={assignDriver.isPending}>
              {assignDriver.isPending ? 'Сохранение...' : 'Назначить'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default OrderDetail;