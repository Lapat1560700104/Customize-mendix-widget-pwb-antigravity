import { ReactElement } from "react";
import { HelloWorldSample } from "./components/HelloWorldSample";
import { PwbComboBoxPreviewProps } from "../typings/PwbComboBoxProps";

export function preview({ sampleText }: PwbComboBoxPreviewProps): ReactElement {
    return <HelloWorldSample sampleText={sampleText} />;
}

export function getPreviewCss(): string {
    return require("./ui/PwbComboBox.css");
}
