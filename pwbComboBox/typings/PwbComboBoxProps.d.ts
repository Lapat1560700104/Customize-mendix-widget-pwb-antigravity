/**
 * This file was generated from PwbComboBox.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { DynamicValue, EditableValue, ListValue, ListExpressionValue, ReferenceValue, ReferenceSetValue } from "mendix";
import { Big } from "big.js";

export type SelectionModeEnum = "single" | "multi";

export type TagStyleEnum = "pill" | "avatar";

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
    selectionMode: SelectionModeEnum;
    tagStyle: TagStyleEnum;
    tagColorExpression?: ListExpressionValue<string>;
    selectedAttribute?: EditableValue<string | Big>;
    delimiter: string;
    selectedAssociation?: ReferenceValue | ReferenceSetValue;
    placeholder: string;
    accentColor: string;
    borderRadius: string;
    bgBlur: string;
    popoverBg: string;
    maxDropdownHeight: string;
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
    selectionMode: SelectionModeEnum;
    tagStyle: TagStyleEnum;
    tagColorExpression: string;
    selectedAttribute: string;
    delimiter: string;
    selectedAssociation: string;
    placeholder: string;
    accentColor: string;
    borderRadius: string;
    bgBlur: string;
    popoverBg: string;
    maxDropdownHeight: string;
    noOptionsMessage: string;
    loadingMessage: string;
    clearButtonTitle: string;
    required: boolean;
    requiredMessage: string;
    validationExpression: string;
    customValidationMessage: string;
}
