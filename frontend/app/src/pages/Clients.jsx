function Clients() {
  return (
    <>
        <div className="page-header">
          <div>
            <h2 className="page-header__title">Все клиенты</h2>
            <p className="page-header__subtitle">Всего: 6 клиентов</p>
          </div>
          <div className="page-header__actions">
            <button className="btn btn--primary">+ Добавить клиента</button>
          </div>
        </div>

        {/* -- TOOLBAR -- */}
        <div className="toolbar">
          <input className="input toolbar__search" type="search" placeholder="Поиск по названию или ИНН..." />
          <select className="select select--auto">
            <option value="">Все типы</option>
            <option value="legal">Юридические лица</option>
            <option value="individual">Физические лица</option>
          </select>
        </div>

        {/* -- TABLE -- */}
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
              <tr>
                <td><strong>ООО «Ромашка»</strong></td>
                <td><span className="badge badge--primary">Юрлицо</span></td>
                <td className="table__cell-muted">7701234567</td>
                <td>Морозова Анна</td>
                <td>+7 (495) 123-45-67</td>
                <td className="table__cell-actions">
                  <a href="client-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
                </td>
              </tr>
              <tr>
                <td><strong>ООО «ТехноСтрой»</strong></td>
                <td><span className="badge badge--primary">Юрлицо</span></td>
                <td className="table__cell-muted">7712345678</td>
                <td>Сергеев Пётр</td>
                <td>+7 (495) 234-56-78</td>
                <td className="table__cell-actions">
                  <a href="client-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
                </td>
              </tr>
              <tr>
                <td><strong>ООО «Продукты+»</strong></td>
                <td><span className="badge badge--primary">Юрлицо</span></td>
                <td className="table__cell-muted">7723456789</td>
                <td>Кузнецова Ольга</td>
                <td>+7 (495) 345-67-89</td>
                <td className="table__cell-actions">
                  <a href="client-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
                </td>
              </tr>
              <tr>
                <td><strong>ИП Иванов А.А.</strong></td>
                <td><span className="badge badge--info">Физлицо</span></td>
                <td className="table__cell-muted">770312345678</td>
                <td>Иванов Алексей</td>
                <td>+7 (916) 456-78-90</td>
                <td className="table__cell-actions">
                  <a href="client-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
                </td>
              </tr>
              <tr>
                <td><strong>ИП Петров</strong></td>
                <td><span className="badge badge--info">Физлицо</span></td>
                <td className="table__cell-muted">770423456789</td>
                <td>Петров Сергей</td>
                <td>+7 (916) 567-89-01</td>
                <td className="table__cell-actions">
                  <a href="client-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
                </td>
              </tr>
              <tr>
                <td><strong>ООО «СтройМир»</strong></td>
                <td><span className="badge badge--primary">Юрлицо</span></td>
                <td className="table__cell-muted">7734567890</td>
                <td>Смирнов Дмитрий</td>
                <td>+7 (495) 678-90-12</td>
                <td className="table__cell-actions">
                  <a href="client-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
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

export default Clients