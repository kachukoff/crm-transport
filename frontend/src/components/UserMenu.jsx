import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

export default function UserMenu() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!user) return null;

  const goToProfile = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <div className="user-menu" ref={rootRef}>
      <button
        type="button"
        className="header__profile user-menu__trigger"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t('header.profile')}
      >
        <span className="header__avatar">{getInitials(user.full_name)}</span>
        <span className="header__user-info">
          <span className="header__user-name">
            {user.full_name.split(' ').slice(0, 2).join(' ')}
          </span>
          <span className="header__user-role">
            {t(`roles.${user.role}`, { defaultValue: user.role })}
          </span>
        </span>
        <svg
          className={`user-menu__chevron${isOpen ? ' is-open' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="user-menu__menu" role="menu">
          <div className="user-menu__account">
            <strong>{user.full_name}</strong>
            <span>{user.email}</span>
          </div>

          <button type="button" className="user-menu__item" role="menuitem" onClick={goToProfile}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" />
            </svg>
            {t('header.profile')}
          </button>

          <button type="button" className="user-menu__item user-menu__item--danger" role="menuitem" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {t('sidebar.logout')}
          </button>
        </div>
      )}
    </div>
  );
}