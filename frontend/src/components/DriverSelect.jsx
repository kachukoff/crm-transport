import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const normalizeSearch = (value) => String(value ?? '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '');

const digitsOnly = (value) => String(value ?? '').replace(/\D/g, '');

const getPhoneVariants = (value) => {
    const digits = digitsOnly(value);
    if (!digits) return [];

    const variants = new Set([digits]);

    if (digits.startsWith('7')) {
        variants.add(`8${digits.slice(1)}`);
    }

    if (digits.startsWith('8')) {
        variants.add(`7${digits.slice(1)}`);
    }

    return [...variants];
};

export default function DriverSelect({
    options = [],
    value = '',
    onChange,
    placeholder,
    searchPlaceholder,
    emptyLabel,
    allowEmpty = false,
    disabled = false,
    className = '',
}) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const rootRef = useRef(null);
    const searchRef = useRef(null);

    const currentValue = String(value ?? '');
    const selected = options.find((option) => String(option.id) === currentValue);

    const filteredOptions = options.filter((option) => {
        const nameNeedle = normalizeSearch(query);
        const phoneNeedles = getPhoneVariants(query);

        const nameHaystack = normalizeSearch(
            `${option.full_name || ''} ${option.license_number || ''}`
        );

        const phoneHaystack = getPhoneVariants(option.phone).join(' ');

        const nameMatches = nameNeedle && nameHaystack.includes(nameNeedle);
        const phoneMatches = phoneNeedles.some((digits) => phoneHaystack.includes(digits));

        return !nameNeedle || nameMatches || phoneMatches;
    });

    const items = allowEmpty
        ? [{ id: '', full_name: emptyLabel || placeholder, isAll: true }, ...filteredOptions]
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
            window.setTimeout(() => searchRef.current?.focus(), 0);
        }
    }, [isOpen]);

    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    const selectItem = (item) => {
        if (!item) return;
        onChange?.(item.id === '' ? '' : String(item.id));
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
        <div className={`driver-select ${className}`.trim()} ref={rootRef}>
            <button
                type="button"
                className="input driver-select__trigger"
                onClick={() => setIsOpen((open) => !open)}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label={placeholder}
            >
                <span className="driver-select__value">
                    {selected ? selected.full_name : placeholder}
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
                    <input
                        ref={searchRef}
                        className="input driver-select__search"
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        placeholder={searchPlaceholder || t('orders.driverSearchPlaceholder')}
                        aria-label={searchPlaceholder || t('orders.driverSearchPlaceholder')}
                    />

                    <div className="driver-select__list" role="listbox" aria-label={placeholder}>
                        {items.length === 0 ? (
                            <div className="driver-select__empty">{t('common.noData')}</div>
                        ) : (
                            items.map((item, index) => {
                                const isSelected = item.id === ''
                                    ? currentValue === ''
                                    : String(item.id) === currentValue;

                                return (
                                    <button
                                        key={item.id === '' ? '__all__' : item.id}
                                        type="button"
                                        role="option"
                                        aria-selected={isSelected}
                                        className={`driver-select__option${index === activeIndex ? ' is-active' : ''}${isSelected ? ' is-selected' : ''}`}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        onClick={() => selectItem(item)}
                                    >
                                        <span className="driver-select__option-main">
                                            <span className="driver-select__option-name">{item.full_name}</span>
                                            {item.phone && (
                                                <span className="driver-select__option-meta">{item.phone}</span>
                                            )}
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