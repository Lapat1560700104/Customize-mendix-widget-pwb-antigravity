import { ReactElement } from "react";
import { DatePicker } from "./components/DatePicker";
import { PwbDatePickerContainerProps } from "../typings/PwbDatePickerProps";
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
    showEraToggle
}: PwbDatePickerContainerProps): ReactElement {
    // Check if the inputs are read-only
    const readOnly =
        selectionMode === "single"
            ? dateAttribute?.readOnly === true
            : startDateAttribute?.readOnly === true || endDateAttribute?.readOnly === true;

    // Handle single date changes
    const handleSingleChange = (newDate: Date | undefined): void => {
        if (dateAttribute) {
            dateAttribute.setValue(newDate);
        }
    };

    // Handle range date changes
    const handleRangeChange = (start: Date | undefined, end: Date | undefined): void => {
        if (startDateAttribute) {
            startDateAttribute.setValue(start);
        }
        if (endDateAttribute) {
            endDateAttribute.setValue(end);
        }
    };

    return (
        <DatePicker
            selectionMode={selectionMode}
            value={dateAttribute?.value}
            startValue={startDateAttribute?.value}
            endValue={endDateAttribute?.value}
            onChange={handleSingleChange}
            onRangeChange={handleRangeChange}
            showTime={showTime}
            buddhistEra={buddhistEra}
            minDate={minDate?.value}
            maxDate={maxDate?.value}
            disableWeekends={disableWeekends}
            placeholder={placeholder}
            accentColor={accentColor}
            readOnly={readOnly}
            className={className}
            style={style}
            dateFormat={dateFormat}
            showPresets={showPresets}
            showEraToggle={showEraToggle}
        />
    );
}
