import { useState, useEffect } from 'react';
import { api } from '../api/client';

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    api.get('/drivers/')
      .then(data => {
        setDrivers(data);
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
          <h2 className="page-header__title">Все водители</h2>
          <p className="page-header__subtitle">Всего: {drivers.length} водителей</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn--primary">+ Добавить водителя</button>
        </div>
      </div>

      <div className="toolbar">
        <input className="input toolbar__search" type="search" placeholder="Поиск по ФИО или телефону..." />
        <select className="select select--auto">
          <option value="">Все статусы</option>
          <option value="available">Свободен</option>
          <option value="on_route">В рейсе</option>
          <option value="day_off">Выходной</option>
          <option value="fired">Уволен</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Телефон</th>
              <th>Права</th>
              <th>Статус</th>
              <th>Машина</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr>
                <td colSpan="6" className="table__empty">Нет данных</td>
              </tr>
            ) : (
              drivers.map(driver => (
                <tr key={driver.id}>
                  <td><strong>{driver.full_name}</strong></td>
                  <td>{driver.phone || '—'}</td>
                  <td className="table__cell-muted">{driver.license_number || '—'}</td>
                  <td>
                    <span className={`badge ${
                      driver.status === 'available' ? 'badge--success' :
                      driver.status === 'on_route' ? 'badge--warning' :
                      driver.status === 'day_off' ? 'badge--neutral' : 'badge--danger'
                    }`}>
                      {driver.status === 'available' ? 'Свободен' :
                       driver.status === 'on_route' ? 'В рейсе' :
                       driver.status === 'day_off' ? 'Выходной' : 'Уволен'}
                    </span>
                  </td>
                  <td className="table__cell-muted">{driver.vehicle_plate || '—'}</td> 
                  <td className="table__cell-actions">
                    <button className="btn btn--ghost btn--sm">Открыть</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Пагинация (пока статичная) */}
        <div className="pagination">
          <div>Показано 1–{drivers.length} из {drivers.length}</div>
          <div className="pagination__controls">
            <button className="pagination__btn" disabled>←</button>
            <button className="pagination__btn is-active">1</button>
            <button className="pagination__btn" disabled>→</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Drivers