import { ReactElement } from "react";
import { DatePicker } from "./components/DatePicker";
import { PwbDatePickerContainerProps } from "../typings/PwbDatePickerProps";
import { WebIcon } from "mendix";
import { parseDateStr, formatDateStr } from "./utils/dateUtils";
import "./ui/PwbDatePicker.css";

export function PwbDatePicker({
    class: className,
    style,
    selectionMode,
    dateAttribute,
    startDateAttribute,
    endDateAttribute,
    showTime,
    buddhistEra,
    minDate,
    maxDate,
    disableWeekends,
    placeholder,
    accentColor,
    dateFormat,
    showPresets,
    showEraToggle,
    borderRadius,
    bgBlur,
    popoverBg,
    required,
    requiredMessage,
    validationExpression,
    customValidationMessage,
    timeLabel,
    todayPresetLabel,
    clearPresetLabel,
    selectMonthLabel,
    last7DaysPresetLabel,
    last30DaysPresetLabel,
    thisMonthPresetLabel,
    calendarIcon
}: PwbDatePickerContainerProps): ReactElement {
    // Validate accentColor (must be a valid hex, rgb, rgba, hsl, hsla, or standard color name)
    const colorRegex =
        /^(#([0-9a-fA-F]{3}){1,2}|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[0-9.]+\s*)?\)|hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[0-9.]+\s*)?\)|[a-zA-Z]+)$/;
    const safeAccentColor = accentColor && colorRegex.test(accentColor.trim()) ? accentColor.trim() : "#3b82f6";

    // Standardize border radius format (add 'px' if numeric, default to 16px if empty)
    let safeBorderRadius = "16px";
    if (borderRadius) {
        const trimmed = borderRadius.trim();
        safeBorderRadius = /^\d+$/.test(trimmed) ? `${trimmed}px` : trimmed;
    }

    // Standardize bgBlur (add 'px' if numeric, default to 16px if empty)
    let safeBgBlur = "16px";
    if (bgBlur) {
        const trimmed = bgBlur.trim();
        safeBgBlur = /^\d+$/.test(trimmed) ? `${trimmed}px` : trimmed;
    }

    // Validate popoverBg, default to rgba(255, 255, 255, 0.85) if empty
    const safePopoverBg = popoverBg && popoverBg.trim() ? popoverBg.trim() : "rgba(255, 255, 255, 0.85)";

    // Check if the inputs are read-only
    const readOnly =
        selectionMode === "single"
            ? dateAttribute?.readOnly === true
            : startDateAttribute?.readOnly === true || endDateAttribute?.readOnly === true;

    // Detect Mendix native validation errors
    const mendixValidationError =
        selectionMode === "single"
            ? dateAttribute?.validation
            : startDateAttribute?.validation || endDateAttribute?.validation;

    // Evaluate custom expression validation error
    const expressionValidationError =
        validationExpression && validationExpression.value === false
            ? customValidationMessage || "Date selection violates custom validation rule."
            : undefined;

    // Combine all Mendix and custom expression errors together
    const activeValidationError = mendixValidationError || expressionValidationError;

    const yearOffset = buddhistEra ? 543 : 0;

    // Parse incoming values if bound to String attributes
    const parsedValue =
        typeof dateAttribute?.value === "string"
            ? parseDateStr(dateAttribute.value, dateFormat, yearOffset)
            : dateAttribute?.value;

    const parsedStartValue =
        typeof startDateAttribute?.value === "string"
            ? parseDateStr(startDateAttribute.value, dateFormat, yearOffset)
            : startDateAttribute?.value;

    const parsedEndValue =
        typeof endDateAttribute?.value === "string"
            ? parseDateStr(endDateAttribute.value, dateFormat, yearOffset)
            : endDateAttribute?.value;

    // Handle single date changes
    const handleSingleChange = (newDate: Date | undefined): void => {
        if (dateAttribute) {
            if (newDate === undefined) {
                dateAttribute.setValue(undefined);
            } else if (dateAttribute.formatter === undefined) {
                const formatted = formatDateStr(newDate, dateFormat, yearOffset, showTime);
                dateAttribute.setValue(formatted);
            } else {
                dateAttribute.setValue(newDate);
            }
        }
    };

    // Handle range date changes
    const handleRangeChange = (start: Date | undefined, end: Date | undefined): void => {
        if (startDateAttribute) {
            if (start === undefined) {
                startDateAttribute.setValue(undefined);
            } else if (startDateAttribute.formatter === undefined) {
                const formatted = formatDateStr(start, dateFormat, yearOffset, showTime);
                startDateAttribute.setValue(formatted);
            } else {
                startDateAttribute.setValue(start);
            }
        }
        if (endDateAttribute) {
            if (end === undefined) {
                endDateAttribute.setValue(undefined);
            } else if (endDateAttribute.formatter === undefined) {
                const formatted = formatDateStr(end, dateFormat, yearOffset, showTime);
                endDateAttribute.setValue(formatted);
            } else {
                endDateAttribute.setValue(end);
            }
        }
    };

    const customIconNode = calendarIcon && calendarIcon.value ? <MendixIcon icon={calendarIcon.value} /> : undefined;

    return (
        <DatePicker
            selectionMode={selectionMode}
            value={parsedValue}
            startValue={parsedStartValue}
            endValue={parsedEndValue}
            onChange={handleSingleChange}
            onRangeChange={handleRangeChange}
            showTime={showTime}
            buddhistEra={buddhistEra}
            minDate={minDate?.value}
            maxDate={maxDate?.value}
            disableWeekends={disableWeekends}
            placeholder={placeholder}
            accentColor={safeAccentColor}
            readOnly={readOnly}
            className={className}
            style={style}
            dateFormat={dateFormat}
            showPresets={showPresets}
            showEraToggle={showEraToggle}
            borderRadius={safeBorderRadius}
            bgBlur={safeBgBlur}
            popoverBg={safePopoverBg}
            required={required}
            requiredMessage={requiredMessage}
            mendixValidationError={activeValidationError}
            timeLabel={timeLabel}
            todayPresetLabel={todayPresetLabel}
            clearPresetLabel={clearPresetLabel}
            selectMonthLabel={selectMonthLabel}
            last7DaysPresetLabel={last7DaysPresetLabel}
            last30DaysPresetLabel={last30DaysPresetLabel}
            thisMonthPresetLabel={thisMonthPresetLabel}
            customIcon={customIconNode}
        />
    );
}

interface MendixIconProps {
    icon: WebIcon;
    className?: string;
}

export function MendixIcon({ icon, className }: MendixIconProps): ReactElement | null {
    if (!icon) {
        return null;
    }
    if (icon.type === "glyph" || icon.type === "icon") {
        return <span className={`${icon.iconClass || ""} ${className || ""}`} aria-hidden="true" />;
    }
    if (icon.type === "image") {
        return (
            <img
                src={icon.iconUrl}
                className={className}
                alt="icon"
                style={{ width: "1em", height: "1em", objectFit: "contain" }}
            />
        );
    }
    return null;
}
