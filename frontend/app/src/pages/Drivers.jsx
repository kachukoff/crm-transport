function Drivers() {
  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">Все водители</h2>
          <p className="page-header__subtitle">Всего: 5 водителей</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn--primary">+ Добавить водителя</button>
        </div>
      </div>

      {/* -- TOOLBAR -- */}
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

      {/* -- TABLE -- */}
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
            <tr>
              <td><strong>Иванов Иван Иванович</strong></td>
              <td>+7 (999) 123-45-67</td>
              <td className="table__cell-muted">77 АА 123456</td>
              <td><span className="badge badge--success">Свободен</span></td>
              <td>А123БВ 77</td>
              <td className="table__cell-actions">
                <a href="driver-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
              </td>
            </tr>
            <tr>
              <td><strong>Петров Пётр Петрович</strong></td>
              <td>+7 (999) 234-56-78</td>
              <td className="table__cell-muted">50 ББ 234567</td>
              <td><span className="badge badge--warning">В рейсе</span></td>
              <td>В456ГД 50</td>
              <td className="table__cell-actions">
                <a href="driver-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
              </td>
            </tr>
            <tr>
              <td><strong>Сидоров Сергей Сергеевич</strong></td>
              <td>+7 (999) 345-67-89</td>
              <td className="table__cell-muted">99 ВВ 345678</td>
              <td><span className="badge badge--success">Свободен</span></td>
              <td>Е789ЖЗ 99</td>
              <td className="table__cell-actions">
                <a href="driver-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
              </td>
            </tr>
            <tr>
              <td><strong>Кузнецов Алексей Дмитриевич</strong></td>
              <td>+7 (999) 456-78-90</td>
              <td className="table__cell-muted">77 ГГ 456789</td>
              <td><span className="badge badge--neutral">Выходной</span></td>
              <td className="table__cell-muted">—</td>
              <td className="table__cell-actions">
                <a href="driver-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
              </td>
            </tr>
            <tr>
              <td><strong>Смирнов Дмитрий Олегович</strong></td>
              <td>+7 (999) 567-89-01</td>
              <td className="table__cell-muted">50 ДД 567890</td>
              <td><span className="badge badge--danger">Уволен</span></td>
              <td className="table__cell-muted">—</td>
              <td className="table__cell-actions">
                <a href="driver-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="pagination">
          <div>Показано 1–5 из 5</div>
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