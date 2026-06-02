/**
 * This file was generated from PwbCustomizeContainerDataView.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ActionValue, EditableValue, ListValue, ListAttributeValue, ListWidgetValue } from "mendix";

export type LayoutDirectionEnum = "vertical" | "horizontal";

export type DragHandleDisplayEnum = "left" | "hide";

export type ThemePresetEnum = "default_rounded" | "modern_glass" | "minimalist_flat" | "neo_brutalist";

export type DarkModeBehaviorEnum = "auto" | "light" | "dark";

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
    themePreset: ThemePresetEnum;
    darkModeBehavior: DarkModeBehaviorEnum;
    itemPadding: string;
    itemGap: string;
    enableKanban: boolean;
    dragGroup: string;
    columnValue: string;
    itemColumnAttribute?: ListAttributeValue<string>;
    saveDelay: number;
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
    themePreset: ThemePresetEnum;
    darkModeBehavior: DarkModeBehaviorEnum;
    itemPadding: string;
    itemGap: string;
    enableKanban: boolean;
    dragGroup: string;
    columnValue: string;
    itemColumnAttribute: string;
    saveDelay: number | null;
}
