import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function DropdownSelect({
  options = [],
  value = '',
  onChange,
  placeholder,
  emptyLabel,
  allowEmpty = false,
  searchable = false,
  searchPlaceholder,
  ariaLabel,
  disabled = false,
  compact = false,
  className = '',
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const searchRef = useRef(null);

  const currentValue = String(value ?? '');
  const selected = options.find((option) => String(option.value) === currentValue);

  const filteredOptions = options.filter((option) => {
    if (!searchable || !query.trim()) return true;
    const needle = query.trim().toLowerCase();
    return String(option.label).toLowerCase().includes(needle);
  });

  const items = allowEmpty
    ? [{ value: '', label: emptyLabel || placeholder }, ...filteredOptions]
    : filteredOptions;

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

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0);
      setQuery('');
      if (searchable) {
        window.setTimeout(() => searchRef.current?.focus(), 0);
      }
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const selectItem = (item) => {
    if (!item) return;
    onChange?.(item.value === '' ? '' : String(item.value));
    setIsOpen(false);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, items.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      selectItem(items[activeIndex]);
    }
  };

  return (
    <div
      className={`driver-select ${compact ? 'driver-select--compact' : ''} ${className}`.trim()}
      ref={rootRef}
    >
      <button
        type="button"
        className="input driver-select__trigger"
        onClick={() => setIsOpen((open) => !open)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || placeholder}
      >
        <span className="driver-select__value">
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={`driver-select__chevron${isOpen ? ' is-open' : ''}`}
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
        <div className="driver-select__popover">
          {searchable && (
            <input
              ref={searchRef}
              className="input driver-select__search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
            />
          )}

          <div className="driver-select__list" role="listbox" aria-label={ariaLabel || placeholder}>
            {items.length === 0 ? (
              <div className="driver-select__empty">{t('common.noData')}</div>
            ) : (
              items.map((item, index) => {
                const isSelected = String(item.value) === currentValue;

                return (
                  <button
                    key={item.value === '' ? '__empty__' : item.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`driver-select__option${index === activeIndex ? ' is-active' : ''}${isSelected ? ' is-selected' : ''}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectItem(item)}
                  >
                    <span className="driver-select__option-main">
                      <span className="driver-select__option-name">{item.label}</span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}