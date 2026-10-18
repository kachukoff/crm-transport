function Orders() {
  return (
    <>
        <div className="page-header">
          <div>
            <h2 className="page-header__title">Все заказы</h2>
            <p className="page-header__subtitle">Всего: 47 заказов</p>
          </div>
          <div className="page-header__actions">
            <button className="btn btn--primary">+ Создать заказ</button>
          </div>
        </div>

        {/* -- TOOLBAR-- */}
        <div className="toolbar">
          <input className="input toolbar__search" type="search" placeholder="Поиск по номеру, клиенту или маршруту..." />

          <select className="select select--auto">
            <option value="">Все статусы</option>
            <option value="new">Новые</option>
            <option value="assigned">Назначенные</option>
            <option value="in_progress">В пути</option>
            <option value="delivered">Доставленные</option>
            <option value="completed">Завершённые</option>
            <option value="cancelled">Отменённые</option>
          </select>

          <select className="select select--auto">
            <option value="">Все водители</option>
            <option value="1">Иванов И.И.</option>
            <option value="2">Петров П.П.</option>
            <option value="3">Сидоров С.С.</option>
          </select>
        </div>

        {/* --TABLE -- */}
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>№</th>
            <th>Клиент</th>
            <th>Маршрут</th>
            <th>Водитель</th>
            <th>Машина</th>
            <th>Статус</th>
            <th>Цена</th>
            <th>Дата</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>#1024</strong></td>
            <td>ООО «Ромашка»</td>
            <td>Москва → Тула</td>
            <td>Иванов И.И.</td>
            <td className="table__cell-muted">А123БВ 77</td>
            <td><span className="badge badge--info">Назначен</span></td>
            <td>18 500 ₽</td>
            <td className="table__cell-muted">13.10.2026</td>
            <td className="table__cell-actions">
              <a href="order-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
            </td>
          </tr>
          <tr>
            <td><strong>#1023</strong></td>
            <td>ИП Иванов А.А.</td>
            <td>Москва → Калуга</td>
            <td>Петров П.П.</td>
            <td className="table__cell-muted">В456ГД 50</td>
            <td><span className="badge badge--warning">В пути</span></td>
            <td>22 000 ₽</td>
            <td className="table__cell-muted">13.10.2026</td>
            <td className="table__cell-actions">
              <a href="order-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
            </td>
          </tr>
          <tr>
            <td><strong>#1022</strong></td>
            <td>ООО «ТехноСтрой»</td>
            <td>Подольск → Рязань</td>
            <td>Сидоров С.С.</td>
            <td className="table__cell-muted">Е789ЖЗ 99</td>
            <td><span className="badge badge--success">Доставлен</span></td>
            <td>31 700 ₽</td>
            <td className="table__cell-muted">12.10.2026</td>
            <td className="table__cell-actions">
              <a href="order-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
            </td>
          </tr>
          <tr>
            <td><strong>#1021</strong></td>
            <td>ООО «Продукты+»</td>
            <td>Москва → Владимир</td>
            <td className="table__cell-muted">—</td>
            <td className="table__cell-muted">—</td>
            <td><span className="badge badge--neutral">Новый</span></td>
            <td className="table__cell-muted">—</td>
            <td className="table__cell-muted">12.10.2026</td>
            <td className="table__cell-actions">
              <a href="order-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
            </td>
          </tr>
          <tr>
            <td><strong>#1020</strong></td>
            <td>ИП Петров</td>
            <td>Химки → Тверь</td>
            <td className="table__cell-muted">—</td>
            <td className="table__cell-muted">—</td>
            <td><span className="badge badge--danger">Отменён</span></td>
            <td className="table__cell-muted">—</td>
            <td className="table__cell-muted">11.10.2026</td>
            <td className="table__cell-actions">
              <a href="order-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
            </td>
          </tr>
          <tr>
            <td><strong>#1019</strong></td>
            <td>ООО «СтройМир»</td>
            <td>Москва → Смоленск</td>
            <td>Иванов И.И.</td>
            <td className="table__cell-muted">А123БВ 77</td>
            <td><span className="badge badge--primary">Завершён</span></td>
            <td>45 200 ₽</td>
            <td className="table__cell-muted">11.10.2026</td>
            <td className="table__cell-actions">
              <a href="order-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
            </td>
          </tr>

        </tbody>
      </table>

      <div className="pagination">
        <div>Показано 1–6 из 47</div>
        <div className="pagination__controls">
          <button className="pagination__btn" disabled>←</button>
          <button className="pagination__btn is-active">1</button>
          <button className="pagination__btn">2</button>
          <button className="pagination__btn">3</button>
          <button className="pagination__btn">4</button>
          <button className="pagination__btn">→</button>
        </div>
      </div>
    </div>
    </>
  )
}

export default Orders