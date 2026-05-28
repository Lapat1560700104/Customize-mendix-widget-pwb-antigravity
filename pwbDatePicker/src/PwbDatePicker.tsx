import { ReactElement } from "react";
import { DatePicker } from "./components/DatePicker";
import { PwbDatePickerContainerProps } from "../typings/PwbDatePickerProps";
import "./ui/PwbDatePicker.css";

export function PwbDatePicker({
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
    accentColor
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
        />
    );
}
