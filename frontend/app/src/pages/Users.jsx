function Users() {
  return (
    <>
        <div className="page-header">
          <div>
            <h2 className="page-header__title">Пользователи</h2>
            <p className="page-header__subtitle">Сотрудники системы с доступом к CRM</p>
          </div>
          <div className="page-header__actions">
            <button className="btn btn--primary">+ Добавить пользователя</button>
          </div>
        </div>

        {/* -- TOOLBAR -- */}
        <div className="toolbar">
          <input className="input toolbar__search" type="search" placeholder="Поиск по ФИО или email..." />
          <select className="select select--auto">
            <option value="">Все роли</option>
            <option value="admin">Администратор</option>
            <option value="manager">Менеджер</option>
            <option value="driver">Водитель</option>
          </select>
        </div>

        {/* -- TABLE -- */}
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Статус</th>
                <th>Последний вход</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Морозова Анна Сергеевна</strong></td>
                <td>a.morozova@crm.ru</td>
                <td><span className="badge badge--primary">Менеджер</span></td>
                <td><span className="badge badge--success">Активен</span></td>
                <td className="table__cell-muted">13.10.2026 09:14</td>
                <td className="table__cell-actions">
                  <a href="user-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
                </td>
              </tr>
              <tr>
                <td><strong>Соколов Игорь Петрович</strong></td>
                <td>i.sokolov@crm.ru</td>
                <td><span className="badge badge--danger">Администратор</span></td>
                <td><span className="badge badge--success">Активен</span></td>
                <td className="table__cell-muted">13.10.2026 08:02</td>
                <td className="table__cell-actions">
                  <a href="user-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
                </td>
              </tr>
              <tr>
                <td><strong>Иванов Иван Иванович</strong></td>
                <td>i.ivanov@crm.ru</td>
                <td><span className="badge badge--info">Водитель</span></td>
                <td><span className="badge badge--success">Активен</span></td>
                <td className="table__cell-muted">13.10.2026 07:45</td>
                <td className="table__cell-actions">
                  <a href="user-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
                </td>
              </tr>
              <tr>
                <td><strong>Петров Пётр Петрович</strong></td>
                <td>p.petrov@crm.ru</td>
                <td><span className="badge badge--info">Водитель</span></td>
                <td><span className="badge badge--success">Активен</span></td>
                <td className="table__cell-muted">12.10.2026 18:20</td>
                <td className="table__cell-actions">
                  <a href="user-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
                </td>
              </tr>
              <tr>
                <td><strong>Сидоров Сергей Сергеевич</strong></td>
                <td>s.sidorov@crm.ru</td>
                <td><span className="badge badge--info">Водитель</span></td>
                <td><span className="badge badge--success">Активен</span></td>
                <td className="table__cell-muted">12.10.2026 17:05</td>
                <td className="table__cell-actions">
                  <a href="user-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
                </td>
              </tr>
              <tr>
                <td><strong>Кузнецов Алексей Дмитриевич</strong></td>
                <td>a.kuznetsov@crm.ru</td>
                <td><span className="badge badge--info">Водитель</span></td>
                <td><span className="badge badge--neutral">Заблокирован</span></td>
                <td className="table__cell-muted">01.09.2026 10:30</td>
                <td className="table__cell-actions">
                  <a href="user-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
                </td>
              </tr>
              <tr>
                <td><strong>Смирнов Дмитрий Олегович</strong></td>
                <td>d.smirnov@crm.ru</td>
                <td><span className="badge badge--info">Водитель</span></td>
                <td><span className="badge badge--neutral">Заблокирован</span></td>
                <td className="table__cell-muted">—</td>
                <td className="table__cell-actions">
                  <a href="user-detail.html" className="btn btn--ghost btn--sm">Открыть</a>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="pagination">
            <div>Показано 1–7 из 12</div>
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

export default Users