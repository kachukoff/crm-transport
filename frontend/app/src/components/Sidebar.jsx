import { NavLink } from 'react-router-dom'

const navLinkClass = ({ isActive }) =>
  isActive ? 'sidebar__link is-active' : 'sidebar__link'

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar__logo">
        <span className="sidebar__logo-mark">T</span>
        <span>CRM Транспорт</span>
      </div>

      <nav className="sidebar__nav">
        <NavLink to="/" end className={navLinkClass}>
          <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/orders" end className={navLinkClass}>
          <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
          <span>Заказы</span>
        </NavLink>

        <NavLink to="/clients" end className={navLinkClass}>
          <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
          <span>Клиенты</span>
        </NavLink>

        <NavLink to="/drivers" end className={navLinkClass}>
          <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
          </svg>
          <span>Водители</span>
        </NavLink>

        <NavLink to="/vehicles" end className={navLinkClass}>
          <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 3h15v13H1z" />
            <path d="M16 8h4l3 3v5h-7V8z" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <span>Машины</span>
        </NavLink>

        <NavLink to="/pricing" className={navLinkClass}>
          <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
          <span>Тарифы</span>
        </NavLink>

        <NavLink to="/users" className={navLinkClass}>
          <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Пользователи</span>
        </NavLink>
      </nav>

      <div className="sidebar__footer">
        <NavLink to="/profile" className="sidebar__user">
          <div className="sidebar__user-avatar">АМ</div>
          <div className="sidebar__user-info">
            <span className="sidebar__user-name">Анна Морозова</span>
            <span className="sidebar__user-role">Менеджер</span>
          </div>
        </NavLink>
      </div>

    </aside>
  )
}

export default Sidebar