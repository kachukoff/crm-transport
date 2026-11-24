export const VEHICLE_TYPES = [
  'gazelle',
  'medium',
  'truck',
  'refrigerator',
];

export const VEHICLE_TYPE_KEYS = {
  gazelle: 'vehicleTypes.gazelle',
  medium: 'vehicleTypes.medium',
  truck: 'vehicleTypes.truck',
  refrigerator: 'vehicleTypes.refrigerator',
  unknown: 'vehicleTypes.unknown',
};

export const VEHICLE_STATUSES = [
  'available',
  'on_route',
  'maintenance',
];

export const VEHICLE_STATUS_KEYS = {
  available: 'statuses.vehicle.available',
  on_route: 'statuses.vehicle.on_route',
  maintenance: 'statuses.vehicle.maintenance',
  unknown: 'statuses.vehicle.unknown',
};

export const VEHICLE_STATUS_BADGES = {
  available: 'badge--success',
  on_route: 'badge--warning',
  maintenance: 'badge--danger',
};

export function getVehicleTypeLabel(t, type) {
  return t(VEHICLE_TYPE_KEYS[type] || VEHICLE_TYPE_KEYS.unknown);
}

export function getVehicleStatusLabel(t, status) {
  return t(VEHICLE_STATUS_KEYS[status] || VEHICLE_STATUS_KEYS.unknown);
}

export function getVehicleStatusBadge(status) {
  return VEHICLE_STATUS_BADGES[status] || 'badge--neutral';
}