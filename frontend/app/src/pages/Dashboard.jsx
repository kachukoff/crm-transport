function Dashboard() {
  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">Обзор</h2>
          <p className="page-header__subtitle">Актуальные показатели на 13 октября 2026</p>
        </div>
      </div>

      <div className="cards-grid">
        <div className="card card--metric card--accent-primary">
          <div className="card__value">12</div>
          <div className="card__label">Активные заказы</div>
        </div>

        <div className="card card--metric card--accent-success">
          <div className="card__value">8</div>
          <div className="card__label">Свободные машины</div>
        </div>

        <div className="card card--metric card--accent-warning">
          <div className="card__value">5</div>
          <div className="card__label">Водители на смене</div>
        </div>

        <div className="card card--metric card--accent-info">
          <div className="card__value">3</div>
          <div className="card__label">Новые заявки</div>
        </div>
      </div>

      <div className="card">
        <div className="card__header">
          <div>
            <h3 className="card__title">Последние заказы</h3>
            <p className="card__subtitle">5 последних изменений</p>
          </div>
          <a href="/orders" className="btn btn--ghost btn--sm">Все заказы →</a>
        </div>

        <div className="table-wrapper" style={{ boxShadow: 'none', border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>№</th>
                <th>Клиент</th>
                <th>Маршрут</th>
                <th>Статус</th>
                <th>Цена</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#1024</td>
                <td>ООО «Ромашка»</td>
                <td>Москва → Тула</td>
                <td><span className="badge badge--info">Назначен</span></td>
                <td>18 500 ₽</td>
                <td className="table__cell-muted">13.10.2026</td>
              </tr>
              <tr>
                <td>#1023</td>
                <td>ИП Иванов А.А.</td>
                <td>Москва → Калуга</td>
                <td><span className="badge badge--warning">В пути</span></td>
                <td>22 000 ₽</td>
                <td className="table__cell-muted">13.10.2026</td>
              </tr>
              <tr>
                <td>#1022</td>
                <td>ООО «ТехноСтрой»</td>
                <td>Подольск → Рязань</td>
                <td><span className="badge badge--success">Доставлен</span></td>
                <td>31 700 ₽</td>
                <td className="table__cell-muted">12.10.2026</td>
              </tr>
              <tr>
                <td>#1021</td>
                <td>ООО «Продукты+»</td>
                <td>Москва → Владимир</td>
                <td><span className="badge badge--neutral">Новый</span></td>
                <td>—</td>
                <td className="table__cell-muted">12.10.2026</td>
              </tr>
              <tr>
                <td>#1020</td>
                <td>ИП Петров</td>
                <td>Химки → Тверь</td>
                <td><span className="badge badge--danger">Отменён</span></td>
                <td>—</td>
                <td className="table__cell-muted">11.10.2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Dashboard