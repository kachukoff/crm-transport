const EMPTY = '—';

function parseDate(value) {
  if (!value) return null;

  const normalized = typeof value === 'string' ? value.slice(0, 23) : value;
  const date = new Date(normalized);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value, locale = 'ru') {
  const date = parseDate(value);
  if (!date) return EMPTY;

  return new Intl.DateTimeFormat(locale, { dateStyle: 'short' }).format(date);
}

export function formatDateTime(value, locale = 'ru') {
  const date = parseDate(value);
  if (!date) return EMPTY;

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

export function formatCurrency(value, locale = 'ru', options = {}) {
  if (value === null || value === undefined || value === '') return EMPTY;

  const number = Number(value);
  if (Number.isNaN(number)) return EMPTY;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'RUB',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: options.maximumFractionDigits ?? 0,
  }).format(number);
}

export function formatNumber(value, locale = 'ru') {
  const number = Number(value);
  if (Number.isNaN(number)) return EMPTY;

  return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(number);
}
