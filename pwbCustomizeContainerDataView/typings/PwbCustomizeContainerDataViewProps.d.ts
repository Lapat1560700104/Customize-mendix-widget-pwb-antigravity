/**
 * This file was generated from PwbCustomizeContainerDataView.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ActionValue, DynamicValue, EditableValue, ListValue, ListAttributeValue, ListExpressionValue, ListWidgetValue } from "mendix";
import { Big } from "big.js";

export type LayoutDirectionEnum = "vertical" | "horizontal";

export type DragHandleDisplayEnum = "left" | "hide";

export type DragHandleIconEnum = "dots" | "bars" | "hand" | "crosshair" | "custom_svg";

export type DragHandlePositionEnum = "left" | "right";

export type ThemePresetEnum = "default_rounded" | "modern_glass" | "minimalist_flat" | "neo_brutalist";

export type DarkModeBehaviorEnum = "auto" | "light" | "dark";

export type ActionsSectionPositionRowEnum = "left" | "right";

export type ActionsSectionPositionColEnum = "top" | "bottom";

export type ActionsSectionLayoutEnum = "side_by_side" | "stacked";

export type ActionsSectionSizeEnum = "auto" | "ratio_15" | "ratio_20" | "ratio_25" | "ratio_30" | "ratio_40" | "custom";

export interface PwbCustomizeContainerDataViewContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    itemsSource: ListValue;
    customItemContent: ListWidgetValue;
    enableHeader: boolean;
    headerContent?: ReactNode;
    enableFooter: boolean;
    footerContent?: ReactNode;
    enableMainFooter: boolean;
    mainFooterContent?: ReactNode;
    enableOuterFooter: boolean;
    outerFooterContent?: ReactNode;
    enableLaneTitle: boolean;
    laneTitle?: DynamicValue<string>;
    laneTitleContent?: ReactNode;
    sortedAttribute?: EditableValue<string>;
    onSortAction?: ActionValue;
    readOnlyMode: boolean;
    sortIdAttribute?: ListAttributeValue<Big | string>;
    layoutDirection: LayoutDirectionEnum;
    dragHandleDisplay: DragHandleDisplayEnum;
    accentColor: string;
    borderRadius: string;
    dragHandleIcon: DragHandleIconEnum;
    dragHandleSvg: string;
    dragHandlePosition: DragHandlePositionEnum;
    dragGhostScale: Big;
    dragGhostOpacity: Big;
    dragGhostShadow: string;
    hoverRevealActions: boolean;
    animationSpeed: number;
    wobbleStrength: Big;
    themePreset: ThemePresetEnum;
    darkModeBehavior: DarkModeBehaviorEnum;
    itemPadding: string;
    itemGap: string;
    laneClass: string;
    enableKanban: boolean;
    dragGroup: string;
    columnValue: string;
    itemColumnAttribute?: ListAttributeValue<string>;
    allowedSourceColumns?: DynamicValue<string>;
    itemAllowDropExpression?: ListExpressionValue<boolean>;
    enableActionsSection: boolean;
    actionsSectionContent?: ListWidgetValue;
    actionsSectionPositionRow: ActionsSectionPositionRowEnum;
    actionsSectionPositionCol: ActionsSectionPositionColEnum;
    actionsSectionLayout: ActionsSectionLayoutEnum;
    actionsSectionSize: ActionsSectionSizeEnum;
    actionsSectionSizeCustom: string;
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
    enableHeader: boolean;
    headerContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    enableFooter: boolean;
    footerContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    enableMainFooter: boolean;
    mainFooterContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    enableOuterFooter: boolean;
    outerFooterContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    enableLaneTitle: boolean;
    laneTitle: string;
    laneTitleContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    sortedAttribute: string;
    onSortAction: {} | null;
    readOnlyMode: boolean;
    sortIdAttribute: string;
    layoutDirection: LayoutDirectionEnum;
    dragHandleDisplay: DragHandleDisplayEnum;
    accentColor: string;
    borderRadius: string;
    dragHandleIcon: DragHandleIconEnum;
    dragHandleSvg: string;
    dragHandlePosition: DragHandlePositionEnum;
    dragGhostScale: number | null;
    dragGhostOpacity: number | null;
    dragGhostShadow: string;
    hoverRevealActions: boolean;
    animationSpeed: number | null;
    wobbleStrength: number | null;
    themePreset: ThemePresetEnum;
    darkModeBehavior: DarkModeBehaviorEnum;
    itemPadding: string;
    itemGap: string;
    laneClass: string;
    enableKanban: boolean;
    dragGroup: string;
    columnValue: string;
    itemColumnAttribute: string;
    allowedSourceColumns: string;
    itemAllowDropExpression: string;
    enableActionsSection: boolean;
    actionsSectionContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    actionsSectionPositionRow: ActionsSectionPositionRowEnum;
    actionsSectionPositionCol: ActionsSectionPositionColEnum;
    actionsSectionLayout: ActionsSectionLayoutEnum;
    actionsSectionSize: ActionsSectionSizeEnum;
    actionsSectionSizeCustom: string;
    saveDelay: number | null;
}
