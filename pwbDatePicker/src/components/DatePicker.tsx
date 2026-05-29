import {
    ReactElement,
    useState,
    useEffect,
    useRef,
    MouseEvent as ReactMouseEvent,
    KeyboardEvent as ReactKeyboardEvent,
    CSSProperties,
    ReactNode
} from "react";

export interface DatePickerProps {
    selectionMode: "single" | "range";
    value?: Date;
    startValue?: Date;
    endValue?: Date;
    onChange: (date: Date | undefined) => void;
    onRangeChange: (start: Date | undefined, end: Date | undefined) => void;
    showTime: boolean;
    buddhistEra: boolean;
    minDate?: Date;
    maxDate?: Date;
    disableWeekends: boolean;
    placeholder: string;
    accentColor: string;
    readOnly: boolean;
    className?: string;
    style?: CSSProperties;
    dateFormat?: string;
    showPresets?: boolean;
    showEraToggle?: boolean;
    borderRadius?: string;
    bgBlur?: string;
    popoverBg?: string;
    required: boolean;
    requiredMessage: string;
    mendixValidationError?: string;
    timeLabel?: string;
    todayPresetLabel?: string;
    clearPresetLabel?: string;
    selectMonthLabel?: string;
    last7DaysPresetLabel?: string;
    last30DaysPresetLabel?: string;
    thisMonthPresetLabel?: string;
    customIcon?: ReactNode;
}

export function DatePicker({
    selectionMode,
    value,
    startValue,
    endValue,
    onChange,
    onRangeChange,
    showTime,
    buddhistEra,
    minDate,
    maxDate,
    disableWeekends,
    placeholder,
    accentColor,
    readOnly,
    className,
    style,
    dateFormat,
    showPresets = true,
    showEraToggle = true,
    borderRadius,
    bgBlur,
    popoverBg,
    required,
    requiredMessage,
    mendixValidationError,
    timeLabel,
    todayPresetLabel,
    clearPresetLabel,
    selectMonthLabel,
    last7DaysPresetLabel,
    last30DaysPresetLabel,
    thisMonthPresetLabel,
    customIcon
}: DatePickerProps): ReactElement {
    const [isBuddhistEra, setIsBuddhistEra] = useState(buddhistEra);
    const [localError, setLocalError] = useState<string | null>(null);

    // Current viewed Month / Year in Calendar
    const [viewDate, setViewDate] = useState<Date>(() => value || startValue || new Date());
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

    // Navigation and Grid Views
    const [activeView, setActiveView] = useState<"calendar" | "month" | "year">("calendar");
    const [yearPageStart, setYearPageStart] = useState(() => (value || startValue || new Date()).getFullYear() - 6);
    const [transitionDirection, setTransitionDirection] = useState<"left" | "right" | "">("");

    // Selected time state (if showTime is enabled)
    const [hour, setHour] = useState(() => (value || startValue || new Date()).getHours());
    const [minute, setMinute] = useState(() => (value || startValue || new Date()).getMinutes());

    // Keyboard navigation focused date state
    const [focusedDate, setFocusedDate] = useState<Date>(() => value || startValue || new Date());

    const popoverRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);

    const yearOffset = isBuddhistEra ? 543 : 0;
    const viewMonth = viewDate.getMonth();
    const viewYear = viewDate.getFullYear();

    // Sync view date if external value changes
    useEffect(() => {
        setIsBuddhistEra(buddhistEra);
    }, [buddhistEra]);

    useEffect(() => {
        if (selectionMode === "single" && value) {
            setViewDate(value);
            setHour(value.getHours());
            setMinute(value.getMinutes());
        } else if (selectionMode === "range" && startValue) {
            setViewDate(startValue);
            setHour(startValue.getHours());
            setMinute(startValue.getMinutes());
        }
    }, [value, startValue, selectionMode]);

    // Update keyboard navigation cursor when popover opens
    useEffect(() => {
        if (isOpen) {
            setFocusedDate(value || startValue || new Date());
            setActiveView("calendar");
        }
    }, [isOpen, value, startValue]);

    // Close calendar when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent): void {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Format display text
    const getDisplayText = (): string => {
        const formatDateStr = (d: Date): string => {
            const dayStr = String(d.getDate()).padStart(2, "0");
            const monthStr = String(d.getMonth() + 1).padStart(2, "0");
            const fullYear = d.getFullYear() + yearOffset;
            const shortYear = String(fullYear).slice(-2);
            const hhStr = String(d.getHours()).padStart(2, "0");
            const mmStr = String(d.getMinutes()).padStart(2, "0");

            let format = dateFormat || "DD/MM/YYYY";
            if (showTime && !format.includes("hh") && !format.includes("mm")) {
                format = `${format} hh:mm`;
            }

            return format
                .replace("DD", dayStr)
                .replace("MM", monthStr)
                .replace("YYYY", String(fullYear))
                .replace("YY", shortYear)
                .replace("hh", hhStr)
                .replace("mm", mmStr);
        };

        if (selectionMode === "single") {
            return value ? formatDateStr(value) : "";
        } else {
            if (startValue && endValue) {
                return `${formatDateStr(startValue)} - ${formatDateStr(endValue)}`;
            } else if (startValue) {
                return `${formatDateStr(startValue)} - ...`;
            }
            return "";
        }
    };

    // Calendar generation helpers
    const getDaysInMonth = (y: number, m: number): number => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y: number, m: number): number => new Date(y, m, 1).getDay();

    const handlePrevMonth = (): void => {
        setTransitionDirection("left");
        setViewDate(new Date(viewYear, viewMonth - 1, 1));
    };

    const handleNextMonth = (): void => {
        setTransitionDirection("right");
        setViewDate(new Date(viewYear, viewMonth + 1, 1));
    };

    const isDateDisabled = (d: Date): boolean => {
        // 1. Min Date Check
        if (minDate) {
            const minDateZero = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
            const dZero = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            if (dZero < minDateZero) {
                return true;
            }
        }
        // 2. Max Date Check
        if (maxDate) {
            const maxDateZero = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
            const dZero = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            if (dZero > maxDateZero) {
                return true;
            }
        }
        // 3. Weekend Check
        if (disableWeekends) {
            const day = d.getDay();
            if (day === 0 || day === 6) {
                return true;
            }
        }
        return false;
    };

    const handleDateSelect = (dayNum: number, isPrevMonth = false, isNextMonth = false, customDate?: Date): void => {
        if (readOnly) {
            return;
        }

        let selected = customDate;
        if (!selected) {
            const targetYear = viewYear;
            let targetMonth = viewMonth;
            if (isPrevMonth) {
                targetMonth -= 1;
            } else if (isNextMonth) {
                targetMonth += 1;
            }
            selected = new Date(targetYear, targetMonth, dayNum, hour, minute);
        }

        if (isDateDisabled(selected)) {
            return;
        }

        setLocalError(null); // Clear local error

        if (selectionMode === "single") {
            onChange(selected);
            setIsOpen(false);
        } else {
            // Range Mode Logic
            if (!startValue || (startValue && endValue)) {
                // First click or selecting a new start date
                onRangeChange(selected, undefined);
            } else {
                // Second click: selecting end date
                if (selected < startValue) {
                    // If second date is before start date, make it the new start date
                    onRangeChange(selected, undefined);
                } else {
                    onRangeChange(startValue, selected);
                    setIsOpen(false); // Done choosing
                }
            }
        }
    };

    const isDateSelected = (d: Date): boolean => {
        const isSameDay = (d1: Date, d2: Date): boolean =>
            d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

        if (selectionMode === "single") {
            return value ? isSameDay(d, value) : false;
        } else {
            const startSelected = startValue ? isSameDay(d, startValue) : false;
            const endSelected = endValue ? isSameDay(d, endValue) : false;
            return startSelected || endSelected;
        }
    };

    const isDateInRange = (d: Date): boolean => {
        if (selectionMode !== "range" || !startValue) {
            return false;
        }
        const dTime = d.getTime();
        const startTime = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate()).getTime();

        if (endValue) {
            const endTime = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate()).getTime();
            return dTime > startTime && dTime < endTime;
        } else if (hoveredDate) {
            const hoverTime = new Date(
                hoveredDate.getFullYear(),
                hoveredDate.getMonth(),
                hoveredDate.getDate()
            ).getTime();
            if (hoverTime > startTime) {
                return dTime > startTime && dTime < hoverTime;
            }
        }
        return false;
    };

    const handleClear = (e: ReactMouseEvent): void => {
        e.stopPropagation();
        if (readOnly) {
            return;
        }
        if (selectionMode === "single") {
            onChange(undefined);
        } else {
            onRangeChange(undefined, undefined);
        }

        if (required) {
            setLocalError(requiredMessage || "This field is required.");
        } else {
            setLocalError(null);
        }
    };

    // Keyboard controls handler
    const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>): void => {
        if (readOnly || activeView !== "calendar") {
            return;
        }

        let moveDays = 0;
        switch (e.key) {
            case "ArrowLeft":
                moveDays = -1;
                break;
            case "ArrowRight":
                moveDays = 1;
                break;
            case "ArrowUp":
                moveDays = -7;
                break;
            case "ArrowDown":
                moveDays = 7;
                break;
            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                return;
            case "Enter":
            case " ":
                e.preventDefault();
                if (focusedDate) {
                    handleDateSelect(0, false, false, focusedDate);
                }
                return;
            default:
                return;
        }

        if (moveDays !== 0) {
            e.preventDefault();
            const currentFocused = new Date(focusedDate);
            currentFocused.setDate(currentFocused.getDate() + moveDays);

            // Bounds check
            if (minDate && currentFocused < minDate) {
                return;
            }
            if (maxDate && currentFocused > maxDate) {
                return;
            }

            setFocusedDate(currentFocused);
            setViewDate(currentFocused); // Shift view month automatically if focus leaves month
        }
    };

    // Time slider handlers
    const handleHourChange = (newHour: number): void => {
        setHour(newHour);
        if (selectionMode === "single" && value) {
            const updated = new Date(value.getFullYear(), value.getMonth(), value.getDate(), newHour, minute);
            onChange(updated);
        } else if (selectionMode === "range") {
            if (startValue && !endValue) {
                const updated = new Date(
                    startValue.getFullYear(),
                    startValue.getMonth(),
                    startValue.getDate(),
                    newHour,
                    minute
                );
                onRangeChange(updated, undefined);
            } else if (startValue && endValue) {
                const updatedStart = new Date(
                    startValue.getFullYear(),
                    startValue.getMonth(),
                    startValue.getDate(),
                    newHour,
                    minute
                );
                onRangeChange(updatedStart, endValue);
            }
        }
    };

    const handleMinuteChange = (newMinute: number): void => {
        setMinute(newMinute);
        if (selectionMode === "single" && value) {
            const updated = new Date(value.getFullYear(), value.getMonth(), value.getDate(), hour, newMinute);
            onChange(updated);
        } else if (selectionMode === "range") {
            if (startValue && !endValue) {
                const updated = new Date(
                    startValue.getFullYear(),
                    startValue.getMonth(),
                    startValue.getDate(),
                    hour,
                    newMinute
                );
                onRangeChange(updated, undefined);
            } else if (startValue && endValue) {
                const updatedStart = new Date(
                    startValue.getFullYear(),
                    startValue.getMonth(),
                    startValue.getDate(),
                    hour,
                    newMinute
                );
                onRangeChange(updatedStart, endValue);
            }
        }
    };

    // Month strings
    const months = [
        "มกราคม / January",
        "กุมภาพันธ์ / February",
        "มีนาคม / March",
        "เมษายน / April",
        "พฤษภาคม / May",
        "มิถุนายน / June",
        "กรกฎาคม / July",
        "สิงหาคม / August",
        "กันยายน / September",
        "ตุลาคม / October",
        "พฤศจิกายน / November",
        "ธันวาคม / December"
    ];

    const weekDays = isBuddhistEra ? ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"] : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    // Helper to compute specific ranges and highlights (Airbnb style)
    const getDayClasses = (thisDate: Date, selected: boolean, inRange: boolean, disabled: boolean): string => {
        const classes = ["pwb-calendar-day"];
        if (selected) {
            classes.push("pwb-day-selected");
        }
        if (inRange) {
            classes.push("pwb-day-in-range");
        }
        if (disabled) {
            classes.push("pwb-day-disabled");
        }

        const isSameDay = (d1: Date, d2: Date): boolean =>
            d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

        if (selectionMode === "range" && startValue) {
            const isStart = isSameDay(thisDate, startValue);
            const isEnd = endValue
                ? isSameDay(thisDate, endValue)
                : hoveredDate
                ? isSameDay(thisDate, hoveredDate)
                : false;

            if (isStart && isEnd) {
                classes.push("pwb-day-range-single");
            } else if (isStart) {
                classes.push("pwb-day-range-start");
            } else if (isEnd && (endValue || (hoveredDate && hoveredDate > startValue))) {
                classes.push("pwb-day-range-end");
            }
        }

        // Keyboard focused class
        if (focusedDate && isSameDay(thisDate, focusedDate)) {
            classes.push("pwb-day-focused");
        }

        return classes.join(" ");
    };

    // Render days grid
    const renderCalendarDays = (): ReactElement[] => {
        const days: ReactElement[] = [];
        const daysInMonth = getDaysInMonth(viewYear, viewMonth);
        const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

        // Previous month filler days
        const prevMonthYear = viewMonth === 0 ? viewYear - 1 : viewYear;
        const prevMonthVal = viewMonth === 0 ? 11 : viewMonth - 1;
        const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonthVal);

        for (let i = firstDay - 1; i >= 0; i--) {
            const dayNum = daysInPrevMonth - i;
            const thisDate = new Date(prevMonthYear, prevMonthVal, dayNum);
            const disabled = isDateDisabled(thisDate);
            const selected = isDateSelected(thisDate);
            const inRange = isDateInRange(thisDate);

            days.push(
                <div
                    key={`prev-${dayNum}`}
                    className={`pwb-day-other ${getDayClasses(thisDate, selected, inRange, disabled)}`}
                    onClick={() => !disabled && handleDateSelect(dayNum, true, false)}
                    onMouseEnter={() => !disabled && setHoveredDate(thisDate)}
                >
                    {dayNum}
                </div>
            );
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const thisDate = new Date(viewYear, viewMonth, i);
            const disabled = isDateDisabled(thisDate);
            const selected = isDateSelected(thisDate);
            const inRange = isDateInRange(thisDate);

            days.push(
                <div
                    key={`curr-${i}`}
                    className={getDayClasses(thisDate, selected, inRange, disabled)}
                    onClick={() => !disabled && handleDateSelect(i)}
                    onMouseEnter={() => !disabled && setHoveredDate(thisDate)}
                >
                    {i}
                </div>
            );
        }

        // Next month filler days
        const nextMonthYear = viewMonth === 11 ? viewYear + 1 : viewYear;
        const nextMonthVal = viewMonth === 11 ? 0 : viewMonth + 1;
        const remainingSlots = 42 - days.length; // 6 rows standard calendar height

        for (let i = 1; i <= remainingSlots; i++) {
            const thisDate = new Date(nextMonthYear, nextMonthVal, i);
            const disabled = isDateDisabled(thisDate);
            const selected = isDateSelected(thisDate);
            const inRange = isDateInRange(thisDate);

            days.push(
                <div
                    key={`next-${i}`}
                    className={`pwb-day-other ${getDayClasses(thisDate, selected, inRange, disabled)}`}
                    onClick={() => !disabled && handleDateSelect(i, false, true)}
                    onMouseEnter={() => !disabled && setHoveredDate(thisDate)}
                >
                    {i}
                </div>
            );
        }

        return days;
    };

    const hasError = !!mendixValidationError || !!localError;

    return (
        <div
            className={`pwb-datepicker-wrapper ${readOnly ? "pwb-disabled" : ""} ${className || ""}`}
            style={
                {
                    ...style,
                    "--accent-color": accentColor,
                    "--border-radius": borderRadius || "16px",
                    "--bg-blur": bgBlur || "16px",
                    "--popover-bg": popoverBg || "rgba(255, 255, 255, 0.85)"
                } as any
            }
        >
            {/* Input field display container */}
            <div
                ref={inputRef}
                className={`pwb-datepicker-input ${isOpen ? "pwb-input-active" : ""} ${
                    hasError ? "pwb-input-error" : ""
                }`}
                onClick={() => !readOnly && setIsOpen(!isOpen)}
            >
                <span className={getDisplayText() ? "pwb-value" : "pwb-placeholder"}>
                    {getDisplayText() || placeholder}
                </span>

                <div className="pwb-icon-container">
                    {getDisplayText() && !readOnly && (
                        <button className="pwb-clear-btn" onClick={handleClear} title="Clear selection">
                            &times;
                        </button>
                    )}
                    {customIcon ? (
                        <div className="pwb-custom-calendar-icon">{customIcon}</div>
                    ) : (
                        <svg
                            className="pwb-calendar-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                    )}
                </div>
            </div>

            {/* Validation Message */}
            {hasError && (
                <div className="pwb-validation-message animate-slide-down">
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
                    <span>{mendixValidationError || localError}</span>
                </div>
            )}

            {/* Dropdown Calendar Popover */}
            {isOpen && (
                <div
                    ref={popoverRef}
                    className="pwb-datepicker-popover animate-slide-up"
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    style={{ outline: "none" }}
                >
                    {/* Calendar Header with Switchable Navigation Modes */}
                    <div className="pwb-calendar-header">
                        {activeView === "calendar" && (
                            <>
                                <button type="button" className="pwb-nav-btn" onClick={handlePrevMonth}>
                                    <svg
                                        className="pwb-nav-icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                </button>
                                <span className="pwb-calendar-title">
                                    <span className="pwb-title-click" onClick={() => setActiveView("month")}>
                                        {months[viewMonth].split(" / ")[isBuddhistEra ? 0 : 1]}
                                    </span>{" "}
                                    <span
                                        className="pwb-title-click"
                                        onClick={() => {
                                            setYearPageStart(viewYear - 6);
                                            setActiveView("year");
                                        }}
                                    >
                                        {viewYear + yearOffset}
                                    </span>
                                </span>
                                <button type="button" className="pwb-nav-btn" onClick={handleNextMonth}>
                                    <svg
                                        className="pwb-nav-icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </button>
                            </>
                        )}

                        {activeView === "month" && (
                            <>
                                <button type="button" className="pwb-nav-btn" style={{ visibility: "hidden" }}></button>
                                <span className="pwb-calendar-title">
                                    {selectMonthLabel || "เลือกเดือน / Select Month"}
                                </span>
                                <button
                                    type="button"
                                    className="pwb-nav-btn pwb-close-view-btn"
                                    onClick={() => setActiveView("calendar")}
                                    title="Back to calendar"
                                >
                                    &times;
                                </button>
                            </>
                        )}

                        {activeView === "year" && (
                            <>
                                <button
                                    type="button"
                                    className="pwb-nav-btn"
                                    onClick={() => setYearPageStart(prev => prev - 12)}
                                >
                                    <svg
                                        className="pwb-nav-icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                </button>
                                <span
                                    className="pwb-calendar-title pwb-title-click"
                                    onClick={() => setActiveView("calendar")}
                                    title="Back to calendar"
                                >
                                    {yearPageStart + yearOffset} - {yearPageStart + 11 + yearOffset}
                                </span>
                                <button
                                    type="button"
                                    className="pwb-nav-btn"
                                    onClick={() => setYearPageStart(prev => prev + 12)}
                                >
                                    <svg
                                        className="pwb-nav-icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>

                    {/* View Switchers */}
                    {activeView === "calendar" && (
                        <>
                            {/* Live Era Toggle Switch */}
                            {showEraToggle && (
                                <div className="pwb-era-toggle-container">
                                    <button
                                        type="button"
                                        className={`pwb-era-btn ${isBuddhistEra ? "" : "pwb-era-btn-active"}`}
                                        onClick={() => setIsBuddhistEra(false)}
                                    >
                                        ค.ศ. (A.D.)
                                    </button>
                                    <button
                                        type="button"
                                        className={`pwb-era-btn ${isBuddhistEra ? "pwb-era-btn-active" : ""}`}
                                        onClick={() => setIsBuddhistEra(true)}
                                    >
                                        พ.ศ. (B.E.)
                                    </button>
                                </div>
                            )}

                            <div className="pwb-calendar-weekdays">
                                {weekDays.map((day, idx) => (
                                    <div key={idx} className="pwb-weekday-col">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div
                                key={`${viewYear}-${viewMonth}`}
                                className={`pwb-calendar-days-grid pwb-calendar-slide-${transitionDirection}`}
                                onMouseLeave={() => setHoveredDate(null)}
                            >
                                {renderCalendarDays()}
                            </div>
                        </>
                    )}

                    {activeView === "month" && (
                        <div className="pwb-months-grid animate-fade-in">
                            {months.map((m, idx) => {
                                const isCurrent = viewMonth === idx;
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        className={`pwb-month-jump-btn ${isCurrent ? "pwb-month-jump-btn-active" : ""}`}
                                        onClick={() => {
                                            setViewDate(new Date(viewYear, idx, 1));
                                            setActiveView("calendar");
                                        }}
                                    >
                                        {m.split(" / ")[isBuddhistEra ? 0 : 1]}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {activeView === "year" && (
                        <div className="pwb-years-grid animate-fade-in">
                            {Array.from({ length: 12 }, (_, i) => {
                                const yr = yearPageStart + i;
                                const isCurrent = viewYear === yr;
                                return (
                                    <button
                                        key={yr}
                                        type="button"
                                        className={`pwb-year-jump-btn ${isCurrent ? "pwb-year-jump-btn-active" : ""}`}
                                        onClick={() => {
                                            setViewDate(new Date(yr, viewMonth, 1));
                                            setActiveView("calendar");
                                        }}
                                    >
                                        {yr + yearOffset}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Numerical Time Picker inputs */}
                    {showTime && activeView === "calendar" && (
                        <div className="pwb-time-picker-panel">
                            <span className="pwb-time-label">{timeLabel || "เวลา / Time (HH:MM):"}</span>
                            <div className="pwb-time-inputs-container">
                                <input
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={String(hour).padStart(2, "0")}
                                    onChange={e => {
                                        let val = Number(e.target.value);
                                        if (val > 23) {
                                            val = 23;
                                        }
                                        if (val < 0) {
                                            val = 0;
                                        }
                                        handleHourChange(val);
                                    }}
                                    className="pwb-time-input-field"
                                    placeholder="HH"
                                />
                                <span className="pwb-time-separator">:</span>
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={String(minute).padStart(2, "0")}
                                    onChange={e => {
                                        let val = Number(e.target.value);
                                        if (val > 59) {
                                            val = 59;
                                        }
                                        if (val < 0) {
                                            val = 0;
                                        }
                                        handleMinuteChange(val);
                                    }}
                                    className="pwb-time-input-field"
                                    placeholder="MM"
                                />
                            </div>
                        </div>
                    )}

                    {/* Quick Select Presets Panel */}
                    {showPresets && activeView === "calendar" && (
                        <div className="pwb-presets-panel">
                            {selectionMode === "single" ? (
                                <>
                                    <button
                                        type="button"
                                        className="pwb-preset-btn"
                                        onClick={() => {
                                            const today = new Date(
                                                new Date().getFullYear(),
                                                new Date().getMonth(),
                                                new Date().getDate(),
                                                hour,
                                                minute
                                            );
                                            onChange(today);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {todayPresetLabel || "วันนี้ (Today)"}
                                    </button>
                                    <button
                                        type="button"
                                        className="pwb-preset-btn pwb-preset-clear"
                                        onClick={handleClear}
                                    >
                                        {clearPresetLabel || "ล้างค่า (Clear)"}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className="pwb-preset-btn"
                                        onClick={() => {
                                            const today = new Date();
                                            const start = new Date(
                                                today.getFullYear(),
                                                today.getMonth(),
                                                today.getDate(),
                                                hour,
                                                minute
                                            );
                                            const end = new Date(
                                                today.getFullYear(),
                                                today.getMonth(),
                                                today.getDate(),
                                                23,
                                                59
                                            );
                                            onRangeChange(start, end);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {todayPresetLabel || "วันนี้"}
                                    </button>
                                    <button
                                        type="button"
                                        className="pwb-preset-btn"
                                        onClick={() => {
                                            const today = new Date();
                                            const end = new Date(
                                                today.getFullYear(),
                                                today.getMonth(),
                                                today.getDate(),
                                                23,
                                                59
                                            );
                                            const start = new Date(
                                                today.getFullYear(),
                                                today.getMonth(),
                                                today.getDate() - 6,
                                                hour,
                                                minute
                                            );
                                            onRangeChange(start, end);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {last7DaysPresetLabel || "7 วันล่าสุด"}
                                    </button>
                                    <button
                                        type="button"
                                        className="pwb-preset-btn"
                                        onClick={() => {
                                            const today = new Date();
                                            const end = new Date(
                                                today.getFullYear(),
                                                today.getMonth(),
                                                today.getDate(),
                                                23,
                                                59
                                            );
                                            const start = new Date(
                                                today.getFullYear(),
                                                today.getMonth(),
                                                today.getDate() - 29,
                                                hour,
                                                minute
                                            );
                                            onRangeChange(start, end);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {last30DaysPresetLabel || "30 วันล่าสุด"}
                                    </button>
                                    <button
                                        type="button"
                                        className="pwb-preset-btn"
                                        onClick={() => {
                                            const today = new Date();
                                            const start = new Date(
                                                today.getFullYear(),
                                                today.getMonth(),
                                                1,
                                                hour,
                                                minute
                                            );
                                            const end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59);
                                            onRangeChange(start, end);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {thisMonthPresetLabel || "เดือนนี้"}
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
