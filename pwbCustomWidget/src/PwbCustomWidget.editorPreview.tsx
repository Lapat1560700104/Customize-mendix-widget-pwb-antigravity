import { ReactElement } from "react";
import { HelloWorldSample } from "./components/HelloWorldSample";
import { PwbCustomWidgetPreviewProps } from "../typings/PwbCustomWidgetProps";

export function preview({ sampleText }: PwbCustomWidgetPreviewProps): ReactElement {
    return <HelloWorldSample sampleText={sampleText} />;
}

export function getPreviewCss(): string {
    return require("./ui/PwbCustomWidget.css");
}
