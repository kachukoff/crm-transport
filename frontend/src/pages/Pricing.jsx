import { useState, useEffect } from 'react';
import { api } from '../api/client';

function Pricing() {
  const [pricing, setPricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/pricing/')
      .then(data => {
        setPricing(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Ошибка: {error}</div>;

  // Функция для красивого отображения типа машины
  const getVehicleTypeName = (type) => {
    switch (type) {
      case 'gazelle': return 'Газель';
      case 'medium': return 'Средняя';
      case 'truck': return 'Фура';
      case 'refrigerator': return 'Рефрижератор';
      default: return type;
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">Тарифы</h2>
          <p className="page-header__subtitle">Настройка ценообразования по типам транспорта</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn--primary">+ Добавить тариф</button>
        </div>
      </div>

      <div className="toolbar">
        <input className="input toolbar__search" type="search" placeholder="Поиск по типу транспорта..." />
        <select className="select select--auto">
          <option value="">Все типы</option>
          <option value="gazelle">Газель</option>
          <option value="medium">Средняя</option>
          <option value="truck">Фура</option>
          <option value="refrigerator">Рефрижератор</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Тип транспорта</th>
              <th>Базовая ставка</th>
              <th>За км</th>
              <th>За кг</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pricing.length === 0 ? (
              <tr>
                <td colSpan="5" className="table__empty">Нет данных</td>
              </tr>
            ) : (
              pricing.map(rule => (
                <tr key={rule.id}>
                  <td><strong>{getVehicleTypeName(rule.vehicle_type)}</strong></td>
                  <td>{rule.base_rate} ₽</td>
                  <td>{rule.price_per_km} ₽</td>
                  <td>{rule.price_per_kg} ₽</td>
                  <td className="table__cell-actions">
                    <button className="btn btn--ghost btn--sm">Редактировать</button>
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

export default Pricing;