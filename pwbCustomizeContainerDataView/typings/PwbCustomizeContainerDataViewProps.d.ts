/**
 * This file was generated from PwbCustomizeContainerDataView.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ActionValue, EditableValue, ListValue, ListWidgetValue } from "mendix";

export type LayoutDirectionEnum = "vertical" | "horizontal";

export type DragHandleDisplayEnum = "left" | "hide";

export interface PwbCustomizeContainerDataViewContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    itemsSource: ListValue;
    customItemContent: ListWidgetValue;
    sortedAttribute: EditableValue<string>;
    onSortAction?: ActionValue;
    layoutDirection: LayoutDirectionEnum;
    dragHandleDisplay: DragHandleDisplayEnum;
    accentColor: string;
    borderRadius: string;
}

export interface PwbCustomizeContainerDataViewPreviewProps {
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
    itemsSource: {} | { caption: string } | { type: string } | null;
    customItemContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    sortedAttribute: string;
    onSortAction: {} | null;
    layoutDirection: LayoutDirectionEnum;
    dragHandleDisplay: DragHandleDisplayEnum;
    accentColor: string;
    borderRadius: string;
}
