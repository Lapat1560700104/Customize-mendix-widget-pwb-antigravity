import { ReactElement, useState, useEffect, useRef, MouseEvent as ReactMouseEvent, CSSProperties } from "react";

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
    dateFormat
}: DatePickerProps): ReactElement {
    // Current viewed Month / Year in Calendar
    const [viewDate, setViewDate] = useState<Date>(() => value || startValue || new Date());
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

    // Selected time state (if showTime is enabled)
    const [hour, setHour] = useState(() => (value || startValue || new Date()).getHours());
    const [minute, setMinute] = useState(() => (value || startValue || new Date()).getMinutes());

    const popoverRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);

    const yearOffset = buddhistEra ? 543 : 0;
    const viewMonth = viewDate.getMonth();
    const viewYear = viewDate.getFullYear();

    // Sync view date if external value changes
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
        setViewDate(new Date(viewYear, viewMonth - 1, 1));
    };

    const handleNextMonth = (): void => {
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

    const handleDateSelect = (dayNum: number, isPrevMonth = false, isNextMonth = false): void => {
        if (readOnly) {
            return;
        }

        const targetYear = viewYear;
        let targetMonth = viewMonth;
        if (isPrevMonth) {
            targetMonth -= 1;
        } else if (isNextMonth) {
            targetMonth += 1;
        }

        const selected = new Date(targetYear, targetMonth, dayNum, hour, minute);
        if (isDateDisabled(selected)) {
            return;
        }

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
                // Update time of both or just start? Typically update start, or whichever was clicked last.
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

    const weekDays = buddhistEra ? ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"] : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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
                    className={`pwb-calendar-day pwb-day-other ${selected ? "pwb-day-selected" : ""} ${
                        inRange ? "pwb-day-in-range" : ""
                    } ${disabled ? "pwb-day-disabled" : ""}`}
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
                    className={`pwb-calendar-day ${selected ? "pwb-day-selected" : ""} ${
                        inRange ? "pwb-day-in-range" : ""
                    } ${disabled ? "pwb-day-disabled" : ""}`}
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
                    className={`pwb-calendar-day pwb-day-other ${selected ? "pwb-day-selected" : ""} ${
                        inRange ? "pwb-day-in-range" : ""
                    } ${disabled ? "pwb-day-disabled" : ""}`}
                    onClick={() => !disabled && handleDateSelect(i, false, true)}
                    onMouseEnter={() => !disabled && setHoveredDate(thisDate)}
                >
                    {i}
                </div>
            );
        }

        return days;
    };

    return (
        <div
            className={`pwb-datepicker-wrapper ${readOnly ? "pwb-disabled" : ""} ${className || ""}`}
            style={{ ...style, "--accent-color": accentColor } as any}
        >
            {/* Input field display container */}
            <div
                ref={inputRef}
                className={`pwb-datepicker-input ${isOpen ? "pwb-input-active" : ""}`}
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
                </div>
            </div>

            {/* Dropdown Calendar Popover */}
            {isOpen && (
                <div ref={popoverRef} className="pwb-datepicker-popover animate-slide-up">
                    <div className="pwb-calendar-header">
                        <button type="button" className="pwb-nav-btn" onClick={handlePrevMonth}>
                            &lt;
                        </button>
                        <span className="pwb-calendar-title">
                            {months[viewMonth]} {viewYear + yearOffset}
                        </span>
                        <button type="button" className="pwb-nav-btn" onClick={handleNextMonth}>
                            &gt;
                        </button>
                    </div>

                    <div className="pwb-calendar-weekdays">
                        {weekDays.map((day, idx) => (
                            <div key={idx} className="pwb-weekday-col">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="pwb-calendar-days-grid" onMouseLeave={() => setHoveredDate(null)}>
                        {renderCalendarDays()}
                    </div>

                    {/* Numerical Time Picker inputs */}
                    {showTime && (
                        <div className="pwb-time-picker-panel">
                            <span className="pwb-time-label">เวลา / Time (HH:MM):</span>
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
                </div>
            )}
        </div>
    );
}
