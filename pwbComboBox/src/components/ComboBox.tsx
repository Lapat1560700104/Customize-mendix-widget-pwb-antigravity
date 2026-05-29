import { ReactElement, useState, useEffect, useRef, KeyboardEvent as ReactKeyboardEvent } from "react";

export interface ComboBoxOption {
    id: string;
    label: string;
    rawObject: any;
}

export interface ComboBoxProps {
    options: ComboBoxOption[];
    selectedIds: string[];
    selectionMode: "single" | "multi";
    onSelect: (id: string) => void;
    onRemove: (id: string) => void;
    onClear: () => void;
    isLoading: boolean;
    placeholder: string;
    accentColor: string;
    borderRadius: string;
    bgBlur: string;
    popoverBg: string;
    maxDropdownHeight: string;
    noOptionsMessage: string;
    loadingMessage: string;
    clearButtonTitle: string;
    readOnly: boolean;
    required: boolean;
    hasError?: boolean;
    errorText?: string;
}

export function ComboBox({
    options,
    selectedIds,
    selectionMode,
    onSelect,
    onRemove,
    onClear,
    isLoading,
    placeholder,
    accentColor,
    borderRadius,
    bgBlur,
    popoverBg,
    maxDropdownHeight,
    noOptionsMessage,
    loadingMessage,
    clearButtonTitle,
    readOnly,
    required,
    hasError,
    errorText
}: ComboBoxProps): ReactElement {
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const popoverRef = useRef<HTMLDivElement>(null);
    const inputContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync input value for single select when dropdown closes
    useEffect(() => {
        if (!isOpen) {
            if (selectionMode === "single" && selectedIds.length > 0) {
                const selectedOption = options.find(o => o.id === selectedIds[0]);
                setSearchText(selectedOption ? selectedOption.label : "");
            } else {
                setSearchText("");
            }
            setFocusedIndex(-1);
        }
    }, [isOpen, selectedIds, selectionMode, options]);

    // Handle outside clicks to close popover
    useEffect(() => {
        function handleClickOutside(event: MouseEvent): void {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node) &&
                inputContainerRef.current &&
                !inputContainerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter options in real-time
    const getFilteredOptions = (): ComboBoxOption[] => {
        if (selectionMode === "multi") {
            // In multi mode, do not show already selected options
            return options.filter(
                opt => !selectedIds.includes(opt.id) && opt.label.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        return options.filter(opt => opt.label.toLowerCase().includes(searchText.toLowerCase()));
    };

    const filteredOptions = getFilteredOptions();

    // Select an option
    const handleSelectOption = (id: string): void => {
        onSelect(id);
        if (selectionMode === "single") {
            setIsOpen(false);
        } else {
            setSearchText("");
            inputRef.current?.focus();
        }
    };

    // Keyboard handlers
    const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>): void => {
        if (readOnly) {
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (!isOpen) {
                setIsOpen(true);
            } else {
                setFocusedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (isOpen) {
                setFocusedIndex(prev => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
            }
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (isOpen && focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
                handleSelectOption(filteredOptions[focusedIndex].id);
            } else if (!isOpen) {
                setIsOpen(true);
            }
        } else if (e.key === "Escape") {
            e.preventDefault();
            setIsOpen(false);
        } else if (e.key === "Backspace" && searchText === "" && selectionMode === "multi" && selectedIds.length > 0) {
            // Delete last tag on backspace when text is empty
            onRemove(selectedIds[selectedIds.length - 1]);
        }
    };

    // Render option list label with high-fidelity highlights
    const renderOptionLabel = (label: string, search: string): ReactElement => {
        if (!search.trim()) {
            return <span>{label}</span>;
        }
        const escaped = search.replace(new RegExp("[-/\\\\^$*+?.()|[\\]{}]", "g"), "\\$&");
        const regex = new RegExp(`(${escaped})`, "gi");
        const parts = label.split(regex);

        return (
            <span>
                {parts.map((part, i) =>
                    regex.test(part) ? (
                        <mark key={i} className="pwb-search-highlight">
                            {part}
                        </mark>
                    ) : (
                        part
                    )
                )}
            </span>
        );
    };

    const hasSelection = selectedIds.length > 0;

    return (
        <div
            className={`pwb-combobox-wrapper ${readOnly ? "pwb-disabled" : ""}`}
            style={
                {
                    "--accent-color": accentColor,
                    "--border-radius": borderRadius,
                    "--bg-blur": bgBlur,
                    "--popover-bg": popoverBg
                } as any
            }
        >
            {/* Input Selection Bar Container */}
            <div
                ref={inputContainerRef}
                className={`pwb-combobox-input-container ${isOpen ? "pwb-input-active" : ""} ${
                    hasError ? "pwb-input-error" : ""
                }`}
                onClick={() => {
                    if (!readOnly && !isOpen) {
                        setIsOpen(true);
                        inputRef.current?.focus();
                    }
                }}
            >
                {/* Selected Tag Pills (Multi-Select) */}
                {selectionMode === "multi" && (
                    <div className="pwb-combobox-tags-list">
                        {selectedIds.map(id => {
                            const option = options.find(o => o.id === id);
                            if (!option) {
                                return null;
                            }
                            return (
                                <div key={id} className="pwb-combobox-tag-pill">
                                    <span>{option.label}</span>
                                    {!readOnly && (
                                        <button
                                            type="button"
                                            className="pwb-combobox-tag-remove-btn"
                                            onClick={e => {
                                                e.stopPropagation();
                                                onRemove(id);
                                            }}
                                            aria-label={`Remove tag ${option.label}`}
                                        >
                                            &times;
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Main Input Element */}
                <input
                    ref={inputRef}
                    type="text"
                    className="pwb-combobox-search-input"
                    value={searchText}
                    onChange={e => {
                        setSearchText(e.target.value);
                        if (!isOpen) {
                            setIsOpen(true);
                        }
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={selectionMode === "multi" && hasSelection ? "" : placeholder}
                    readOnly={readOnly}
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    aria-autocomplete="list"
                    aria-disabled={readOnly}
                    aria-required={required}
                    aria-invalid={hasError}
                    aria-controls={isOpen ? `pwb-listbox-${borderRadius}` : undefined}
                />

                {/* Right Action Icons (Clear and Dropdown Arrow) */}
                <div className="pwb-combobox-actions">
                    {hasSelection && !readOnly && (
                        <button
                            type="button"
                            className="pwb-combobox-clear-btn"
                            onClick={e => {
                                e.stopPropagation();
                                onClear();
                                setSearchText("");
                                inputRef.current?.focus();
                            }}
                            title={clearButtonTitle}
                            aria-label={clearButtonTitle}
                        >
                            &times;
                        </button>
                    )}
                    <button
                        type="button"
                        className="pwb-combobox-chevron-btn"
                        onClick={e => {
                            e.stopPropagation();
                            if (!readOnly) {
                                setIsOpen(!isOpen);
                                if (!isOpen) {
                                    inputRef.current?.focus();
                                }
                            }
                        }}
                        aria-label="Toggle options dropdown"
                    >
                        <svg
                            className="pwb-combobox-chevron-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Dropdown list popover panel */}
            {isOpen && (
                <div
                    ref={popoverRef}
                    id={`pwb-listbox-${borderRadius}`}
                    className="pwb-combobox-popover animate-slide-up"
                    role="listbox"
                >
                    {isLoading ? (
                        <div className="pwb-combobox-status-message">
                            <div className="pwb-combobox-spinner" />
                            <span>{loadingMessage}</span>
                        </div>
                    ) : filteredOptions.length === 0 ? (
                        <div className="pwb-combobox-status-message">
                            <span>{noOptionsMessage}</span>
                        </div>
                    ) : (
                        <ul className="pwb-combobox-options-list" style={{ maxHeight: maxDropdownHeight }}>
                            {filteredOptions.map((opt, idx) => {
                                const isSelected = selectedIds.includes(opt.id);
                                const isFocused = idx === focusedIndex;

                                return (
                                    <li
                                        key={opt.id}
                                        className={`pwb-combobox-option-item ${
                                            isSelected ? "pwb-option-selected" : ""
                                        } ${isFocused ? "pwb-option-focused" : ""}`}
                                        onClick={() => handleSelectOption(opt.id)}
                                        onMouseEnter={() => setFocusedIndex(idx)}
                                        role="option"
                                        aria-selected={isSelected}
                                    >
                                        {renderOptionLabel(opt.label, searchText)}
                                        {isSelected && (
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}

            {/* Error Message Alert */}
            {hasError && errorText && (
                <div className="pwb-validation-message">
                    <svg
                        className="pwb-warning-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <span>{errorText}</span>
                </div>
            )}
        </div>
    );
}
