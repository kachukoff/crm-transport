const BRAND_NAMES = {
  'ГАЗ': 'GAZ',
  'КАМАЗ': 'KAMAZ',
};

const MODEL_NAMES = {
  'Газель': 'Gazelle',
  'Газель Next': 'Gazelle Next',
  'Газель Бизнес': 'Gazelle Business',
};

const isRussian = (language) => (language || '').toLowerCase().startsWith('ru');

export function localizeVehicleBrand(brand, language) {
  if (!brand || isRussian(language)) return brand || '';
  return BRAND_NAMES[brand] || brand;
}

export function localizeVehicleModel(model, language) {
  if (!model || isRussian(language)) return model || '';
  return MODEL_NAMES[model] || model;
}