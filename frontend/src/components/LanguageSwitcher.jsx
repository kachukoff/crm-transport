import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  const current = (i18n.resolvedLanguage || i18n.language || 'ru').startsWith('ru')
    ? 'ru'
    : 'en';

  useEffect(() => {
    document.documentElement.lang = current;
  }, [current]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectLanguage = (code) => {
    setIsOpen(false);
    i18n.changeLanguage(code);
  };

  return (
    <div className="lang-switcher" ref={rootRef}>
      <button
        type="button"
        className="lang-switcher__trigger"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`${t('header.language')}: ${current.toUpperCase()}`}
        title={t('header.language')}
      >
        <span className="lang-switcher__code">{current.toUpperCase()}</span>
        <svg
          className={`lang-switcher__chevron${isOpen ? ' is-open' : ''}`}
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
        <div className="lang-switcher__menu" role="listbox" aria-label={t('header.language')}>
          {LANGUAGES.map(({ code, label }) => {
            const isActive = code === current;

            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={isActive}
                className={`lang-switcher__option${isActive ? ' is-active' : ''}`}
                onClick={() => selectLanguage(code)}
              >
                <span className="lang-switcher__option-code">{code.toUpperCase()}</span>
                <span className="lang-switcher__option-label">{label}</span>
                {isActive && (
                  <svg
                    className="lang-switcher__check"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}