import { useState, useEffect } from 'react';
import { api } from '../api/client';

function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/clients/')
      .then(data => {
        setClients(data);
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
          <h2 className="page-header__title">Все клиенты</h2>
          <p className="page-header__subtitle">Всего: {clients.length} клиентов</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn--primary">+ Добавить клиента</button>
        </div>
      </div>

      <div className="toolbar">
        <input className="input toolbar__search" type="search" placeholder="Поиск по названию или ИНН..." />
        <select className="select select--auto">
          <option value="">Все типы</option>
          <option value="legal">Юридические лица</option>
          <option value="individual">Физические лица</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Тип</th>
              <th>ИНН</th>
              <th>Контактное лицо</th>
              <th>Телефон</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="6" className="table__empty">Нет данных</td>
              </tr>
            ) : (
              clients.map(client => (
                <tr key={client.id}>
                  <td><strong>{client.name}</strong></td>
                  <td>
                    <span className={`badge ${client.type === 'legal' ? 'badge--primary' : 'badge--info'}`}>
                      {client.type === 'legal' ? 'Юрлицо' : 'Физлицо'}
                    </span>
                  </td>
                  <td className="table__cell-muted">{client.inn || '—'}</td>
                  <td>{client.contact_person || '—'}</td>
                  <td>{client.phone || '—'}</td>
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

export default Clients;