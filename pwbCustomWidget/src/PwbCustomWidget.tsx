import { ReactElement } from "react";
import { HelloWorldSample } from "./components/HelloWorldSample";

import { PwbCustomWidgetContainerProps } from "../typings/PwbCustomWidgetProps";

import "./ui/PwbCustomWidget.css";

export function PwbCustomWidget({ sampleText }: PwbCustomWidgetContainerProps): ReactElement {
    return <HelloWorldSample sampleText={sampleText ? sampleText : "World"} />;
}
