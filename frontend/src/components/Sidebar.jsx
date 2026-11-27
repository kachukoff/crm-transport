import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  isActive ? 'sidebar__link is-active' : 'sidebar__link';

function Sidebar() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <span className="sidebar__logo-mark">T</span>
        <span>{t('common.appName')}</span>
      </div>

      {user && (
        <div className="sidebar__profile">
          <div className="sidebar__profile-avatar">
            {user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div className="sidebar__profile-info">
            <span className="sidebar__profile-name">
              {user.full_name.split(' ').slice(0, 2).join(' ')}
            </span>
            <span className="sidebar__profile-role">
              {t(`roles.${user.role}`, { defaultValue: user.role })}
            </span>
          </div>
        </div>
      )}

      <nav className="sidebar__nav">
        <NavLink
          to="/"
          end
          className={navLinkClass}
          data-tooltip={t('sidebar.dashboard')}
          aria-label={t('sidebar.dashboard')}
        >
          <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
          <span>{t('sidebar.dashboard')}</span>
        </NavLink>

        <NavLink
          to="/orders"
          className={navLinkClass}
          data-tooltip={t('sidebar.orders')}
          aria-label={t('sidebar.orders')}
        >
          <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
          <span>{t('sidebar.orders')}</span>
        </NavLink>

        <NavLink
          to="/clients"
          className={navLinkClass}
          data-tooltip={t('sidebar.clients')}
          aria-label={t('sidebar.clients')}
        >
          <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
          <span>{t('sidebar.clients')}</span>
        </NavLink>

        <NavLink
          to="/drivers"
          className={navLinkClass}
          data-tooltip={t('sidebar.drivers')}
          aria-label={t('sidebar.drivers')}
        >
          <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
          </svg>
          <span>{t('sidebar.drivers')}</span>
        </NavLink>

        <NavLink
          to="/vehicles"
          className={navLinkClass}
          data-tooltip={t('sidebar.vehicles')}
          aria-label={t('sidebar.vehicles')}
        >
          <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 3h15v13H1z" />
            <path d="M16 8h4l3 3v5h-7V8z" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <span>{t('sidebar.vehicles')}</span>
        </NavLink>

        {(user?.role === 'admin' || user?.role === 'manager') && (
          <NavLink
            to="/pricing"
            className={navLinkClass}
            data-tooltip={t('sidebar.pricing')}
            aria-label={t('sidebar.pricing')}
          >
            <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
            <span>{t('sidebar.pricing')}</span>
          </NavLink>
        )}

        {user?.role === 'admin' && (
          <NavLink
            to="/users"
            className={navLinkClass}
            data-tooltip={t('sidebar.users')}
            aria-label={t('sidebar.users')}
          >
            <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>{t('sidebar.users')}</span>
          </NavLink>
        )}
      </nav>

      <div className="sidebar__footer">
        <NavLink
          to="/profile"
          className={navLinkClass}
          data-tooltip={t('sidebar.settings')}
          aria-label={t('sidebar.settings')}
        >
          <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
          <span>{t('sidebar.settings')}</span>
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;
