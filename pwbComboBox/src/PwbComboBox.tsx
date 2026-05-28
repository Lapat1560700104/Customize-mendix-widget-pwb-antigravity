import { ReactElement } from "react";
import { HelloWorldSample } from "./components/HelloWorldSample";

import { PwbComboBoxContainerProps } from "../typings/PwbComboBoxProps";

import "./ui/PwbComboBox.css";

export function PwbComboBox({ sampleText }: PwbComboBoxContainerProps): ReactElement {
    return <HelloWorldSample sampleText={sampleText ? sampleText : "World"} />;
}
