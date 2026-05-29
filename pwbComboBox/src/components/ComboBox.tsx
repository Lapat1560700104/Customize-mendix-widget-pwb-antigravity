import { ReactElement, useState, useEffect, useRef, KeyboardEvent as ReactKeyboardEvent, UIEvent } from "react";

export interface ComboBoxOption {
    id: string;
    label: string;
    subtitle?: string;
    groupName?: string;
    colorCode?: string;
    imageUrl?: string;
    rawObject: any;
}

export interface ComboBoxProps {
    options: ComboBoxOption[];
    selectedIds: string[];
    selectionMode: "single" | "multi";
    tagStyle?: "pill" | "avatar";
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
    tagStyle = "pill",
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
    const [visibleCount, setVisibleCount] = useState(50);
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
    const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

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

    // Reset visible count when search text changes
    useEffect(() => {
        setVisibleCount(50);
    }, [searchText]);

    // Automatically expand visible count when keyboard focuses near the end of visible list
    useEffect(() => {
        if (focusedIndex >= visibleCount - 2) {
            setVisibleCount(prev => Math.max(prev, focusedIndex + 10));
        }
    }, [focusedIndex, visibleCount]);

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

    // Filter options in real-time (matching primary label or secondary subtitle)
    const getFilteredOptions = (): ComboBoxOption[] => {
        const query = searchText.toLowerCase().trim();
        const matches = (opt: ComboBoxOption): boolean => {
            return (
                opt.label.toLowerCase().includes(query) ||
                (!!opt.subtitle && opt.subtitle.toLowerCase().includes(query))
            );
        };

        if (selectionMode === "multi") {
            // In multi mode, do not show already selected options
            return options.filter(opt => !selectedIds.includes(opt.id) && matches(opt));
        }
        return options.filter(matches);
    };

    const filteredOptions = getFilteredOptions();

    // Grouping calculations:
    // Extract unique group names and sort them alphabetically, keeping empty group at the end
    const groupNames = Array.from(new Set(filteredOptions.map(o => o.groupName || "")));
    const sortedGroupNames = groupNames.sort((a, b) => {
        if (a === "") {
            return 1;
        }
        if (b === "") {
            return -1;
        }
        return a.localeCompare(b);
    });

    // Compute visible options (excluding collapsed groups) for keyboard navigation
    const visibleFilteredOptions: ComboBoxOption[] = [];
    sortedGroupNames.forEach(gName => {
        const isCollapsed = !!collapsedGroups[gName];
        if (!isCollapsed) {
            const optsInGroup = filteredOptions.filter(o => (o.groupName || "") === gName);
            visibleFilteredOptions.push(...optsInGroup);
        }
    });

    // Generate renderable items list (combines group headers and sliced options)
    interface RenderableItem {
        type: "header" | "option";
        groupName?: string;
        count?: number;
        isCollapsed?: boolean;
        option?: ComboBoxOption;
        index?: number;
        isSelected?: boolean;
        isFocused?: boolean;
    }

    const renderableItems: RenderableItem[] = [];
    let optionIndex = 0;

    sortedGroupNames.forEach(gName => {
        const optsInGroup = filteredOptions.filter(o => (o.groupName || "") === gName);
        if (optsInGroup.length === 0) {
            return;
        }

        const isCollapsed = !!collapsedGroups[gName];

        if (gName !== "") {
            renderableItems.push({
                type: "header",
                groupName: gName,
                count: optsInGroup.length,
                isCollapsed
            });
        }

        if (!isCollapsed) {
            optsInGroup.forEach(opt => {
                if (optionIndex < visibleCount) {
                    renderableItems.push({
                        type: "option",
                        option: opt,
                        index: optionIndex,
                        isSelected: selectedIds.includes(opt.id),
                        isFocused: optionIndex === focusedIndex
                    });
                }
                optionIndex++;
            });
        }
    });

    const toggleGroup = (gName: string): void => {
        setCollapsedGroups(prev => ({
            ...prev,
            [gName]: !prev[gName]
        }));
    };

    const handleImageError = (id: string): void => {
        setBrokenImages(prev => ({
            ...prev,
            [id]: true
        }));
    };

    const shouldShowOptionAvatars = options.some(o => !!o.imageUrl) || tagStyle === "avatar";

    // Handle lazy scroll loading
    const handleDropdownScroll = (e: UIEvent<HTMLDivElement>): void => {
        const target = e.currentTarget;
        if (target.scrollHeight - target.scrollTop <= target.clientHeight + 40) {
            setVisibleCount(prev => prev + 50);
        }
    };

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
                setFocusedIndex(prev => (prev < visibleFilteredOptions.length - 1 ? prev + 1 : 0));
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (isOpen) {
                setFocusedIndex(prev => (prev > 0 ? prev - 1 : visibleFilteredOptions.length - 1));
            }
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (isOpen && focusedIndex >= 0 && focusedIndex < visibleFilteredOptions.length) {
                handleSelectOption(visibleFilteredOptions[focusedIndex].id);
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

    const getInitials = (label: string): string => {
        const clean = label
            .replace(
                /[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g,
                ""
            )
            .replace(/[^\w\s\u0e00-\u0e7f]/g, "")
            .trim();
        return clean ? clean.charAt(0).toUpperCase() : "?";
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

                            const hasAvatar = tagStyle === "avatar" || !!option.imageUrl;
                            const tagStyleObject = option.colorCode
                                ? {
                                      borderColor: option.colorCode,
                                      color: option.colorCode,
                                      backgroundColor: `color-mix(in srgb, ${option.colorCode} 8%, transparent)`
                                  }
                                : {};

                            return (
                                <div
                                    key={id}
                                    className={`pwb-combobox-tag-pill ${hasAvatar ? "pwb-tag-avatar-style" : ""}`}
                                    style={tagStyleObject}
                                >
                                    {hasAvatar && (
                                        <span
                                            className="pwb-combobox-tag-avatar"
                                            style={
                                                option.colorCode
                                                    ? { backgroundColor: option.colorCode }
                                                    : { backgroundColor: accentColor }
                                            }
                                        >
                                            {option.imageUrl && !brokenImages[option.id] ? (
                                                <img
                                                    src={option.imageUrl}
                                                    className="pwb-combobox-tag-img"
                                                    alt={option.label}
                                                    onError={() => handleImageError(option.id)}
                                                />
                                            ) : (
                                                getInitials(option.label)
                                            )}
                                        </span>
                                    )}
                                    <span className="pwb-combobox-tag-text">{option.label}</span>
                                    {!readOnly && (
                                        <button
                                            type="button"
                                            className="pwb-combobox-tag-remove-btn"
                                            onClick={e => {
                                                e.stopPropagation();
                                                onRemove(id);
                                            }}
                                            style={option.colorCode ? { color: option.colorCode } : {}}
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
                        <div
                            className="pwb-combobox-options-list"
                            style={{ maxHeight: maxDropdownHeight }}
                            onScroll={handleDropdownScroll}
                        >
                            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                                {renderableItems.map(item => {
                                    if (item.type === "header") {
                                        const groupName = item.groupName || "";
                                        const isCollapsed = !!item.isCollapsed;
                                        return (
                                            <li
                                                key={`header-${groupName}`}
                                                className="pwb-combobox-group-header"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    toggleGroup(groupName);
                                                }}
                                            >
                                                <div className="pwb-combobox-group-header-content">
                                                    <span>{renderOptionLabel(groupName, searchText)}</span>
                                                    <span className="pwb-combobox-group-count">{item.count}</span>
                                                </div>
                                                <svg
                                                    className={`pwb-combobox-group-chevron ${
                                                        isCollapsed ? "pwb-collapsed" : ""
                                                    }`}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polyline points="6 9 12 15 18 9"></polyline>
                                                </svg>
                                            </li>
                                        );
                                    }

                                    const opt = item.option!;
                                    const idx = item.index!;
                                    const isSelected = !!item.isSelected;
                                    const isFocused = !!item.isFocused;

                                    return (
                                        <li
                                            key={opt.id}
                                            className={`pwb-combobox-option-item ${
                                                isSelected ? "pwb-option-selected" : ""
                                            } ${isFocused ? "pwb-option-focused" : ""} ${
                                                opt.subtitle ? "pwb-option-two-line" : ""
                                            }`}
                                            onClick={() => handleSelectOption(opt.id)}
                                            onMouseEnter={() => setFocusedIndex(idx)}
                                            role="option"
                                            aria-selected={isSelected}
                                        >
                                            {shouldShowOptionAvatars && (
                                                <div
                                                    className="pwb-combobox-option-avatar-container"
                                                    style={
                                                        opt.colorCode
                                                            ? {
                                                                  backgroundColor: `color-mix(in srgb, ${opt.colorCode} 12%, transparent)`,
                                                                  color: opt.colorCode,
                                                                  borderColor: `color-mix(in srgb, ${opt.colorCode} 30%, transparent)`
                                                              }
                                                            : {
                                                                  backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
                                                                  color: accentColor,
                                                                  borderColor: `color-mix(in srgb, ${accentColor} 30%, transparent)`
                                                              }
                                                    }
                                                >
                                                    {opt.imageUrl && !brokenImages[opt.id] ? (
                                                        <img
                                                            src={opt.imageUrl}
                                                            className="pwb-combobox-option-avatar-img"
                                                            onError={() => handleImageError(opt.id)}
                                                            alt={opt.label}
                                                        />
                                                    ) : (
                                                        <span className="pwb-combobox-option-avatar-initials">
                                                            {getInitials(opt.label)}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            <div
                                                style={{
                                                    flex: 1,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    minWidth: 0
                                                }}
                                            >
                                                <div className="pwb-combobox-option-label">
                                                    {renderOptionLabel(opt.label, searchText)}
                                                </div>
                                                {opt.subtitle && (
                                                    <div className="pwb-combobox-option-subtitle">
                                                        {renderOptionLabel(opt.subtitle, searchText)}
                                                    </div>
                                                )}
                                            </div>
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
                                                    style={{ flexShrink: 0, marginLeft: "8px" }}
                                                >
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
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
