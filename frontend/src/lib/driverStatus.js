export const DRIVER_STATUSES = [
  'available',
  'on_route',
  'day_off',
  'fired',
];

export const DRIVER_STATUS_KEYS = {
  available: 'statuses.driver.available',
  on_route: 'statuses.driver.on_route',
  day_off: 'statuses.driver.day_off',
  fired: 'statuses.driver.fired',
  unknown: 'statuses.driver.unknown',
};

export const DRIVER_STATUS_BADGES = {
  available: 'badge--success',
  on_route: 'badge--warning',
  day_off: 'badge--neutral',
  fired: 'badge--danger',
};

export function getDriverStatusLabel(t, status) {
  return t(DRIVER_STATUS_KEYS[status] || DRIVER_STATUS_KEYS.unknown);
}

export function getDriverStatusBadge(status) {
  return DRIVER_STATUS_BADGES[status] || 'badge--neutral';
}