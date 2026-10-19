function Vehicles() {
  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">Все машины</h2>
          <p className="page-header__subtitle">Всего: 6 машин</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn--primary">+ Добавить машину</button>
        </div>
      </div>

      {/* -- TOOLBAR -- */}
      <div className="toolbar">
        <input className="input toolbar__search" type="search" placeholder="Поиск по госномеру или марке..." />
        <select className="select select--auto">
          <option value="">Все статусы</option>
          <option value="available">Свободна</option>
          <option value="on_route">В рейсе</option>
          <option value="maintenance">На ремонте</option>
        </select>
      </div>

      {/* -- TABLE -- */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Госномер</th>
              <th>Марка / модель</th>
              <th>Тип</th>
              <th>Грузоподъёмность</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>А123БВ 77</strong></td>
              <td>ГАЗ Газель Next</td>
              <td>Газель</td>
              <td className="table__cell-muted">1 500 кг</td>
              <td><span className="badge badge--warning">В рейсе</span></td>
              <td className="table__cell-actions">
                <a href="vehicle-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
              </td>
            </tr>
            <tr>
              <td><strong>В456ГД 50</strong></td>
              <td>КАМАЗ 5490</td>
              <td>Фура</td>
              <td className="table__cell-muted">20 000 кг</td>
              <td><span className="badge badge--warning">В рейсе</span></td>
              <td className="table__cell-actions">
                <a href="vehicle-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
              </td>
            </tr>
            <tr>
              <td><strong>Е789ЖЗ 99</strong></td>
              <td>Volvo FH</td>
              <td>Фура</td>
              <td className="table__cell-muted">22 000 кг</td>
              <td><span className="badge badge--success">Свободна</span></td>
              <td className="table__cell-actions">
                <a href="vehicle-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
              </td>
            </tr>
            <tr>
              <td><strong>К321ЛМ 77</strong></td>
              <td>MAN TGL</td>
              <td>Средняя</td>
              <td className="table__cell-muted">5 000 кг</td>
              <td><span className="badge badge--success">Свободна</span></td>
              <td className="table__cell-actions">
                <a href="vehicle-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
              </td>
            </tr>
            <tr>
              <td><strong>М654НО 50</strong></td>
              <td>Ford Transit</td>
              <td>Газель</td>
              <td className="table__cell-muted">1 200 кг</td>
              <td><span className="badge badge--danger">На ремонте</span></td>
              <td className="table__cell-actions">
                <a href="vehicle-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
              </td>
            </tr>
            <tr>
              <td><strong>Р987СТ 99</strong></td>
              <td>Scania R450</td>
              <td>Фура</td>
              <td className="table__cell-muted">24 000 кг</td>
              <td><span className="badge badge--success">Свободна</span></td>
              <td className="table__cell-actions">
                <a href="vehicle-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="pagination">
          <div>Показано 1–6 из 6</div>
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

export default Vehicles