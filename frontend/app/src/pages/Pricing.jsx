function Pricing() {
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

      {/* -- TOOLBAR -- */}
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

      {/* -- TABLE -- */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Тип транспорта</th>
              <th>Регион</th>
              <th>Базовая ставка</th>
              <th>За км</th>
              <th>За кг</th>
              <th>Пример расчёта</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Газель</strong></td>
              <td>Москва</td>
              <td>3 000 ₽</td>
              <td>25 ₽</td>
              <td>1 ₽</td>
              <td className="table__cell-muted">100 км, 500 кг → 6 000 ₽</td>
              <td className="table__cell-actions">
                <a href="pricing-edit.html" className="btn btn--ghost btn--sm">Редактировать</a>
              </td>
            </tr>
            <tr>
              <td><strong>Газель</strong></td>
              <td>Московская обл.</td>
              <td>2 500 ₽</td>
              <td>22 ₽</td>
              <td>1 ₽</td>
              <td className="table__cell-muted">100 км, 500 кг → 5 200 ₽</td>
              <td className="table__cell-actions">
                <a href="pricing-edit.html" className="btn btn--ghost btn--sm">Редактировать</a>
              </td>
            </tr>
            <tr>
              <td><strong>Средняя</strong></td>
              <td>Москва</td>
              <td>5 000 ₽</td>
              <td>35 ₽</td>
              <td>1,5 ₽</td>
              <td className="table__cell-muted">100 км, 500 кг → 9 250 ₽</td>
              <td className="table__cell-actions">
                <a href="pricing-edit.html" className="btn btn--ghost btn--sm">Редактировать</a>
              </td>
            </tr>
            <tr>
              <td><strong>Средняя</strong></td>
              <td>Регионы</td>
              <td>4 500 ₽</td>
              <td>30 ₽</td>
              <td>1,5 ₽</td>
              <td className="table__cell-muted">100 км, 500 кг → 8 250 ₽</td>
              <td className="table__cell-actions">
                <a href="pricing-edit.html" className="btn btn--ghost btn--sm">Редактировать</a>
              </td>
            </tr>
            <tr>
              <td><strong>Фура</strong></td>
              <td>Москва</td>
              <td>10 000 ₽</td>
              <td>50 ₽</td>
              <td>2 ₽</td>
              <td className="table__cell-muted">100 км, 500 кг → 16 000 ₽</td>
              <td className="table__cell-actions">
                <a href="pricing-edit.html" className="btn btn--ghost btn--sm">Редактировать</a>
              </td>
            </tr>
            <tr>
              <td><strong>Фура</strong></td>
              <td>Регионы</td>
              <td>8 500 ₽</td>
              <td>45 ₽</td>
              <td>2 ₽</td>
              <td className="table__cell-muted">100 км, 500 кг → 14 000 ₽</td>
              <td className="table__cell-actions">
                <a href="pricing-edit.html" className="btn btn--ghost btn--sm">Редактировать</a>
              </td>
            </tr>
            <tr>
              <td><strong>Рефрижератор</strong></td>
              <td>Москва</td>
              <td>12 000 ₽</td>
              <td>60 ₽</td>
              <td>3 ₽</td>
              <td className="table__cell-muted">100 км, 500 кг → 19 500 ₽</td>
              <td className="table__cell-actions">
                <a href="pricing-edit.html" className="btn btn--ghost btn--sm">Редактировать</a>
              </td>
            </tr>
            <tr>
              <td><strong>Рефрижератор</strong></td>
              <td>Регионы</td>
              <td>10 500 ₽</td>
              <td>55 ₽</td>
              <td>3 ₽</td>
              <td className="table__cell-muted">100 км, 500 кг → 17 000 ₽</td>
              <td className="table__cell-actions">
                <a href="pricing-edit.html" className="btn btn--ghost btn--sm">Редактировать</a>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="pagination">
          <div>Показано 1–8 из 12</div>
          <div className="pagination__controls">
            <button className="pagination__btn" disabled>←</button>
            <button className="pagination__btn is-active">1</button>
            <button className="pagination__btn">2</button>
            <button className="pagination__btn">→</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Pricing