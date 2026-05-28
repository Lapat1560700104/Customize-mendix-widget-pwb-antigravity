import { ReactElement } from "react";
import { PwbDatePickerPreviewProps } from "../typings/PwbDatePickerProps";

export function preview(props: PwbDatePickerPreviewProps): ReactElement {
    console.log("Preview Props:", props);
    return <div className="pwb-datepicker-preview">PWB Advanced DatePicker [Preview]</div>;
}

export function getPreviewCss(): string {
    return require("./ui/PwbDatePicker.css");
}
