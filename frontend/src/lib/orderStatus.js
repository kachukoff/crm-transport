export const ORDER_STATUSES = [
  'new',
  'assigned',
  'in_progress',
  'delivered',
  'completed',
  'cancelled',
];

export const ORDER_STATUS_KEYS = {
  new: 'statuses.order.new',
  assigned: 'statuses.order.assigned',
  in_progress: 'statuses.order.in_progress',
  delivered: 'statuses.order.delivered',
  completed: 'statuses.order.completed',
  cancelled: 'statuses.order.cancelled',
  unknown: 'statuses.order.unknown',
};

export const ORDER_STATUS_BADGES = {
  new: 'badge--neutral',
  assigned: 'badge--info',
  in_progress: 'badge--warning',
  delivered: 'badge--success',
  completed: 'badge--primary',
  cancelled: 'badge--danger',
};

export function getOrderStatusLabel(t, status) {
  return t(ORDER_STATUS_KEYS[status] || ORDER_STATUS_KEYS.unknown);
}

export function getOrderStatusBadge(status) {
  return ORDER_STATUS_BADGES[status] || 'badge--neutral';
}
