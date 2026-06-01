/**
 * This file was generated from PwbComboBox.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ActionValue, DynamicValue, EditableValue, ListValue, ListExpressionValue, ListWidgetValue, ReferenceValue, ReferenceSetValue } from "mendix";
import { Big } from "big.js";

export type SourceEnum = "context" | "database";

export type SourceTypeEnum = "association" | "enumeration" | "boolean";

export type BooleanOutputFormatEnum = "boolean" | "string";

export type SelectionModeEnum = "single" | "multi";

export type SingleSelectStyleEnum = "text" | "pill" | "rich";

export type TagStyleEnum = "pill" | "avatar";

export type SearchMethodEnum = "contains" | "startsWith" | "endsWith" | "equals" | "fuzzy";

export type DropdownLayoutEnum = "list" | "grid";

export type OptionAvatarShapeEnum = "circle" | "rounded" | "square";

export type HighlightColorModeEnum = "accent" | "optionColor";

export interface PwbComboBoxContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    source: SourceEnum;
    sourceType: SourceTypeEnum;
    selectedAttribute?: EditableValue<string | Big | boolean>;
    selectedAssociation?: ReferenceValue | ReferenceSetValue;
    delimiter: string;
    maxVisibleTags: number;
    optionsSource?: ListValue;
    optionLabel?: ListExpressionValue<string>;
    optionDetail?: ListExpressionValue<string>;
    optionGroup?: ListExpressionValue<string>;
    optionImage?: ListExpressionValue<string>;
    selectedOptionLabel?: ListExpressionValue<string>;
    enableGrouping: boolean;
    booleanTrueLabel: string;
    booleanFalseLabel: string;
    booleanOutputFormat: BooleanOutputFormatEnum;
    booleanTrueValue: string;
    booleanFalseValue: string;
    selectionMode: SelectionModeEnum;
    singleSelectStyle: SingleSelectStyleEnum;
    showSelectedAvatar: boolean;
    tagStyle: TagStyleEnum;
    tagColorExpression?: ListExpressionValue<string>;
    showSelectAll: boolean;
    selectAllText: string;
    deselectAllText: string;
    onCreateText: string;
    onChangeAction?: ActionValue;
    onCreateAction?: ActionValue;
    searchMethod: SearchMethodEnum;
    searchCaseSensitive: boolean;
    searchDebounce: number;
    maxSearchResults: number;
    placeholder: string;
    accentColor: string;
    searchHighlightColor: string;
    borderRadius: string;
    bgBlur: string;
    popoverBg: string;
    maxDropdownHeight: string;
    dropdownLayout: DropdownLayoutEnum;
    optionAvatarShape: OptionAvatarShapeEnum;
    showOptionAvatar: boolean;
    customItemContent?: ListWidgetValue;
    showOptionCheckbox: boolean;
    highlightColorMode: HighlightColorModeEnum;
    noOptionsMessage: string;
    loadingMessage: string;
    clearButtonTitle: string;
    required: boolean;
    requiredMessage: string;
    validationExpression?: DynamicValue<boolean>;
    customValidationMessage: string;
}

export interface PwbComboBoxPreviewProps {
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
    source: SourceEnum;
    sourceType: SourceTypeEnum;
    selectedAttribute: string;
    selectedAssociation: string;
    delimiter: string;
    maxVisibleTags: number | null;
    optionsSource: {} | { caption: string } | { type: string } | null;
    optionLabel: string;
    optionDetail: string;
    optionGroup: string;
    optionImage: string;
    selectedOptionLabel: string;
    enableGrouping: boolean;
    booleanTrueLabel: string;
    booleanFalseLabel: string;
    booleanOutputFormat: BooleanOutputFormatEnum;
    booleanTrueValue: string;
    booleanFalseValue: string;
    selectionMode: SelectionModeEnum;
    singleSelectStyle: SingleSelectStyleEnum;
    showSelectedAvatar: boolean;
    tagStyle: TagStyleEnum;
    tagColorExpression: string;
    showSelectAll: boolean;
    selectAllText: string;
    deselectAllText: string;
    onCreateText: string;
    onChangeAction: {} | null;
    onCreateAction: {} | null;
    searchMethod: SearchMethodEnum;
    searchCaseSensitive: boolean;
    searchDebounce: number | null;
    maxSearchResults: number | null;
    placeholder: string;
    accentColor: string;
    searchHighlightColor: string;
    borderRadius: string;
    bgBlur: string;
    popoverBg: string;
    maxDropdownHeight: string;
    dropdownLayout: DropdownLayoutEnum;
    optionAvatarShape: OptionAvatarShapeEnum;
    showOptionAvatar: boolean;
    customItemContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    showOptionCheckbox: boolean;
    highlightColorMode: HighlightColorModeEnum;
    noOptionsMessage: string;
    loadingMessage: string;
    clearButtonTitle: string;
    required: boolean;
    requiredMessage: string;
    validationExpression: string;
    customValidationMessage: string;
}
