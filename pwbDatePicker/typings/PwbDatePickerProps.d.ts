/**
 * This file was generated from PwbDatePicker.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { DynamicValue, EditableValue, WebIcon } from "mendix";

export type SelectionModeEnum = "single" | "range";

export interface PwbDatePickerContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    selectionMode: SelectionModeEnum;
    dateAttribute?: EditableValue<Date>;
    startDateAttribute?: EditableValue<Date>;
    endDateAttribute?: EditableValue<Date>;
    showTime: boolean;
    buddhistEra: boolean;
    showPresets: boolean;
    showEraToggle: boolean;
    minDate?: DynamicValue<Date>;
    maxDate?: DynamicValue<Date>;
    disableWeekends: boolean;
    placeholder: string;
    accentColor: string;
    dateFormat: string;
    borderRadius: string;
    bgBlur: string;
    popoverBg: string;
    calendarIcon?: DynamicValue<WebIcon>;
    required: boolean;
    requiredMessage: string;
    validationExpression?: DynamicValue<boolean>;
    customValidationMessage: string;
    timeLabel: string;
    todayPresetLabel: string;
    clearPresetLabel: string;
    selectMonthLabel: string;
    last7DaysPresetLabel: string;
    last30DaysPresetLabel: string;
    thisMonthPresetLabel: string;
}

export interface PwbDatePickerPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    selectionMode: SelectionModeEnum;
    dateAttribute: string;
    startDateAttribute: string;
    endDateAttribute: string;
    showTime: boolean;
    buddhistEra: boolean;
    showPresets: boolean;
    showEraToggle: boolean;
    minDate: string;
    maxDate: string;
    disableWeekends: boolean;
    placeholder: string;
    accentColor: string;
    dateFormat: string;
    borderRadius: string;
    bgBlur: string;
    popoverBg: string;
    calendarIcon: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; iconUrl: string; } | { type: "icon"; iconClass: string; } | undefined;
    required: boolean;
    requiredMessage: string;
    validationExpression: string;
    customValidationMessage: string;
    timeLabel: string;
    todayPresetLabel: string;
    clearPresetLabel: string;
    selectMonthLabel: string;
    last7DaysPresetLabel: string;
    last30DaysPresetLabel: string;
    thisMonthPresetLabel: string;
}
