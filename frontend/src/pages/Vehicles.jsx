import { useState, useEffect } from 'react';
import { api } from '../api/client';

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/vehicles/')
      .then(data => {
        setVehicles(data);
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
          <h2 className="page-header__title">Все машины</h2>
          <p className="page-header__subtitle">Всего: {vehicles.length} машин</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn--primary">+ Добавить машину</button>
        </div>
      </div>

      <div className="toolbar">
        <input className="input toolbar__search" type="search" placeholder="Поиск по госномеру или марке..." />
        <select className="select select--auto">
          <option value="">Все статусы</option>
          <option value="available">Свободна</option>
          <option value="on_route">В рейсе</option>
          <option value="maintenance">На ремонте</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Госномер</th>
              <th>Марка / Модель</th>
              <th>Тип</th>
              <th>Грузоподъёмность</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan="6" className="table__empty">Нет данных</td>
              </tr>
            ) : (
              vehicles.map(vehicle => (
                <tr key={vehicle.id}>
                  <td><strong>{vehicle.plate_number}</strong></td>
                  <td>{vehicle.brand} {vehicle.model}</td>
                  <td className="table__cell-muted">{vehicle.vehicle_type}</td>
                  <td>{vehicle.capacity_kg ? `${vehicle.capacity_kg} кг` : '—'}</td>
                  <td>
                    <span className={`badge ${
                      vehicle.status === 'available' ? 'badge--success' :
                      vehicle.status === 'on_route' ? 'badge--warning' : 'badge--danger'
                    }`}>
                      {vehicle.status === 'available' ? 'Свободна' :
                       vehicle.status === 'on_route' ? 'В рейсе' : 'На ремонте'}
                    </span>
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

export default Vehicles;