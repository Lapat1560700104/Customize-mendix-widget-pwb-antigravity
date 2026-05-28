import { ReactElement } from "react";
import { PwbCustomWidgetPreviewProps } from "../typings/PwbCustomWidgetProps";

export function preview(props: PwbCustomWidgetPreviewProps): ReactElement {
    console.log("Preview Props:", props);
    return <div className="pwb-datepicker-preview">PWB Advanced DatePicker [Preview]</div>;
}

export function getPreviewCss(): string {
    return require("./ui/PwbCustomWidget.css");
}
