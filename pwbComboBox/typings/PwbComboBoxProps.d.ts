/**
 * This file was generated from PwbComboBox.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, DynamicValue, EditableValue, ListValue, ListExpressionValue, ReferenceValue, ReferenceSetValue } from "mendix";
import { Big } from "big.js";

export type SortOrderEnum = "none" | "asc" | "desc";

export type SortFieldEnum = "label" | "detail" | "group";

export type SelectionModeEnum = "single" | "multi";

export type SingleSelectStyleEnum = "text" | "pill" | "rich";

export type TagStyleEnum = "pill" | "avatar";

export type DropdownLayoutEnum = "list" | "grid";

export type OptionAvatarShapeEnum = "circle" | "rounded" | "square";

export type HighlightColorModeEnum = "accent" | "optionColor";

export interface PwbComboBoxContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    optionsSource: ListValue;
    optionLabel: ListExpressionValue<string>;
    optionDetail?: ListExpressionValue<string>;
    optionGroup?: ListExpressionValue<string>;
    optionImage?: ListExpressionValue<string>;
    sortOrder: SortOrderEnum;
    sortField: SortFieldEnum;
    selectedOptionLabel?: ListExpressionValue<string>;
    selectionMode: SelectionModeEnum;
    singleSelectStyle: SingleSelectStyleEnum;
    showSelectedAvatar: boolean;
    tagStyle: TagStyleEnum;
    tagColorExpression?: ListExpressionValue<string>;
    selectedAttribute?: EditableValue<string | Big>;
    delimiter: string;
    maxVisibleTags?: number;
    selectedAssociation?: ReferenceValue | ReferenceSetValue;
    placeholder: string;
    accentColor: string;
    searchHighlightColor: string;
    borderRadius: string;
    bgBlur: string;
    popoverBg: string;
    maxDropdownHeight: string;
    dropdownLayout: DropdownLayoutEnum;
    optionAvatarShape: OptionAvatarShapeEnum;
    showOptionCheckbox: boolean;
    highlightColorMode: HighlightColorModeEnum;
    searchDebounce?: number;
    onCreateAction?: ActionValue;
    onCreateText: string;
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
    optionsSource: {} | { caption: string } | { type: string } | null;
    optionLabel: string;
    optionDetail: string;
    optionGroup: string;
    optionImage: string;
    sortOrder: SortOrderEnum;
    sortField: SortFieldEnum;
    selectedOptionLabel: string;
    selectionMode: SelectionModeEnum;
    singleSelectStyle: SingleSelectStyleEnum;
    showSelectedAvatar: boolean;
    tagStyle: TagStyleEnum;
    tagColorExpression: string;
    selectedAttribute: string;
    delimiter: string;
    maxVisibleTags: number | null;
    selectedAssociation: string;
    placeholder: string;
    accentColor: string;
    searchHighlightColor: string;
    borderRadius: string;
    bgBlur: string;
    popoverBg: string;
    maxDropdownHeight: string;
    dropdownLayout: DropdownLayoutEnum;
    optionAvatarShape: OptionAvatarShapeEnum;
    showOptionCheckbox: boolean;
    highlightColorMode: HighlightColorModeEnum;
    searchDebounce: number | null;
    onCreateAction: {} | null;
    onCreateText: string;
    noOptionsMessage: string;
    loadingMessage: string;
    clearButtonTitle: string;
    required: boolean;
    requiredMessage: string;
    validationExpression: string;
    customValidationMessage: string;
}
