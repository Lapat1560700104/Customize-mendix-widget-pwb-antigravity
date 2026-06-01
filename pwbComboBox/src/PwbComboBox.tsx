import { ReactElement } from "react";
import { ComboBox, ComboBoxOption } from "./components/ComboBox";
import { PwbComboBoxContainerProps } from "../typings/PwbComboBoxProps";
import "./ui/PwbComboBox.css";

function getSmartEnumColor(key: string): string {
    const lowerKey = key.toLowerCase();

    // 1. Success / Approved / Active / Enabled / Done keys -> Green
    if (
        lowerKey.includes("approve") ||
        lowerKey.includes("active") ||
        lowerKey.includes("success") ||
        lowerKey.includes("true") ||
        lowerKey.includes("complete") ||
        lowerKey.includes("enable") ||
        lowerKey.includes("yes") ||
        lowerKey.includes("done") ||
        lowerKey.includes("finish") ||
        lowerKey.includes("pass") ||
        lowerKey.includes("ok")
    ) {
        return "#10b981";
    }

    // 2. Reject / Danger / Error / False / Disable / Cancel / Fail / Inactive keys -> Red
    if (
        lowerKey.includes("reject") ||
        lowerKey.includes("danger") ||
        lowerKey.includes("error") ||
        lowerKey.includes("false") ||
        lowerKey.includes("disable") ||
        lowerKey.includes("no") ||
        lowerKey.includes("cancel") ||
        lowerKey.includes("fail") ||
        lowerKey.includes("inactive") ||
        lowerKey.includes("stop") ||
        lowerKey.includes("block") ||
        lowerKey.includes("deny")
    ) {
        return "#ef4444";
    }

    // 3. Pending / Process / Warning / Wait / Review keys -> Amber
    if (
        lowerKey.includes("pending") ||
        lowerKey.includes("process") ||
        lowerKey.includes("warning") ||
        lowerKey.includes("wait") ||
        lowerKey.includes("review") ||
        lowerKey.includes("hold") ||
        lowerKey.includes("progress") ||
        lowerKey.includes("queue")
    ) {
        return "#f59e0b";
    }

    // 4. Draft / New / Prepare / Initial keys -> Blue
    if (
        lowerKey.includes("draft") ||
        lowerKey.includes("new") ||
        lowerKey.includes("prepare") ||
        lowerKey.includes("init") ||
        lowerKey.includes("plan")
    ) {
        return "#3b82f6";
    }

    // 5. Stable color hashing for other statuses (beautiful HSL pastel colors)
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) % 1000000;
    }
    const hue = hash % 360;
    return `hsl(${hue}, 65%, 50%)`;
}

export function PwbComboBox({
    class: className,
    style,
    source,
    sourceType,
    optionsSource,
    optionLabel,
    optionDetail,
    optionGroup,
    optionImage,
    selectedOptionLabel,
    enableGrouping,
    booleanTrueLabel,
    booleanFalseLabel,
    booleanOutputFormat,
    booleanTrueValue,
    booleanFalseValue,
    selectionMode,
    singleSelectStyle,
    showSelectedAvatar,
    tagStyle,
    tagColorExpression,
    selectedAttribute,
    delimiter,
    maxVisibleTags,
    selectedAssociation,
    showSelectAll,
    selectAllText,
    deselectAllText,
    placeholder,
    accentColor,
    searchHighlightColor,
    borderRadius,
    bgBlur,
    popoverBg,
    maxDropdownHeight,
    dropdownLayout,
    optionAvatarShape,
    showOptionCheckbox,
    highlightColorMode,
    searchDebounce,
    onCreateText,
    noOptionsMessage,
    loadingMessage,
    clearButtonTitle,
    required,
    requiredMessage,
    validationExpression,
    customValidationMessage,
    showOptionAvatar,
    customItemContent,
    onChangeAction,
    onEnterAction,
    onLeaveAction,
    onFilterChangeAction,
    filterAttribute,
    searchMethod,
    searchCaseSensitive,
    maxSearchResults
}: PwbComboBoxContainerProps): ReactElement {
    const sourceMode = source === "database" ? "association" : sourceType;
    const assoc = selectedAssociation as any;

    // 1. Check read-only state
    const readOnly =
        selectionMode === "single"
            ? selectedAttribute?.readOnly === true || (assoc && assoc.readOnly)
            : assoc?.readOnly === true || selectedAttribute?.readOnly === true;

    // 2. Fetch loading state
    const isLoading =
        sourceMode === "association" ? (optionsSource ? optionsSource.status === "loading" : false) : false;

    // 3. Map options according to sourceMode
    const options: ComboBoxOption[] = [];

    if (sourceMode === "association") {
        if (optionsSource && optionsSource.items) {
            optionsSource.items.forEach(item => {
                options.push({
                    id: item.id,
                    label: optionLabel ? optionLabel.get(item).value || "" : "",
                    subtitle: optionDetail ? optionDetail.get(item).value || "" : undefined,
                    groupName: optionGroup ? optionGroup.get(item).value : undefined,
                    colorCode: tagColorExpression ? tagColorExpression.get(item).value : undefined,
                    imageUrl: optionImage ? optionImage.get(item).value : undefined,
                    selectedLabel: selectedOptionLabel ? selectedOptionLabel.get(item).value || "" : undefined,
                    rawObject: item
                });
            });
        }
    } else if (sourceMode === "enumeration" && selectedAttribute) {
        if (selectedAttribute.universe) {
            selectedAttribute.universe.forEach(value => {
                const stringVal = String(value);
                const label = selectedAttribute.formatter ? selectedAttribute.formatter.format(value) : stringVal;
                options.push({
                    id: stringVal,
                    label,
                    colorCode: getSmartEnumColor(stringVal),
                    rawObject: value
                });
            });
        }
    } else if (sourceMode === "boolean" && selectedAttribute) {
        options.push(
            { id: "true", label: booleanTrueLabel || "Yes", colorCode: "#10b981", rawObject: true },
            { id: "false", label: booleanFalseLabel || "No", colorCode: "#ef4444", rawObject: false }
        );
    }

    // Note: sorting is now handled natively on the entity datasource side using Mendix's optionsSort.

    // 4. Retrieve currently selected IDs
    let selectedIds: string[] = [];
    if (selectionMode === "single") {
        if (sourceMode === "association" && assoc && assoc.value) {
            // Find option matching Mendix object GUID
            const matched = options.find(o => o.id === assoc.value.id);
            if (matched) {
                selectedIds = [matched.id];
            }
        } else if (selectedAttribute && selectedAttribute.value !== undefined && selectedAttribute.value !== null) {
            if (sourceMode === "boolean") {
                if (booleanOutputFormat === "string") {
                    const strVal = String(selectedAttribute.value);
                    const isTrueKey = strVal === (booleanTrueValue || "true");
                    selectedIds = [isTrueKey ? "true" : "false"];
                } else {
                    const boolVal = selectedAttribute.value === true || String(selectedAttribute.value) === "true";
                    selectedIds = [boolVal ? "true" : "false"];
                }
            } else {
                const attrVal = String(selectedAttribute.value);
                // Match either option ID or option label value
                const matched = options.find(
                    o => o.id === attrVal || o.label === attrVal || o.selectedLabel === attrVal
                );
                if (matched) {
                    selectedIds = [matched.id];
                }
            }
        }
    } else {
        // Multi-select mode (ReferenceSet association or Delimited String Attribute)
        if (sourceMode === "association" && assoc && assoc.value) {
            const selectedObjects = assoc.value;
            const selectedArray = Array.isArray(selectedObjects) ? selectedObjects : [selectedObjects];
            selectedIds = selectedArray.map((item: any) => item.id);
        } else if (selectedAttribute && selectedAttribute.value !== undefined && selectedAttribute.value !== null) {
            const attrVal = String(selectedAttribute.value);
            if (attrVal.trim() !== "") {
                const delim = delimiter || ",";
                const tokens = attrVal.split(delim).map(t => t.trim());
                tokens.forEach(token => {
                    const matched = options.find(o => o.id === token || o.label === token || o.selectedLabel === token);
                    if (matched && !selectedIds.includes(matched.id)) {
                        selectedIds.push(matched.id);
                    }
                });
            }
        }
    }

    // 5. Change Handlers
    const triggerOnChange = (): void => {
        if (onChangeAction && onChangeAction.canExecute && !onChangeAction.isExecuting) {
            onChangeAction.execute();
        }
    };

    const handleSelect = (id: string): void => {
        const option = options.find(o => o.id === id);
        if (!option) {
            return;
        }

        const displayLabel = option.selectedLabel || option.label;

        if (selectionMode === "single") {
            if (sourceMode === "association" && assoc) {
                assoc.setValue(option.rawObject);
            }
            if (selectedAttribute) {
                if (sourceMode === "boolean") {
                    if (booleanOutputFormat === "string") {
                        selectedAttribute.setValue(
                            id === "true" ? booleanTrueValue || "true" : booleanFalseValue || "false"
                        );
                    } else {
                        selectedAttribute.setValue(id === "true");
                    }
                } else if (sourceMode === "enumeration") {
                    selectedAttribute.setValue(option.rawObject as any);
                } else {
                    selectedAttribute.setValue(displayLabel);
                }
            }
        } else {
            // Multi-select mode
            if (sourceMode === "association" && assoc) {
                const currentSelected = (assoc.value as any[]) || [];
                if (!currentSelected.some(item => item.id === id)) {
                    assoc.setValue([...currentSelected, option.rawObject]);
                }
            }
            if (selectedAttribute) {
                const currentIds = [...selectedIds];
                if (!currentIds.includes(id)) {
                    currentIds.push(id);
                }
                const delim = delimiter || ",";
                const serializedValue = currentIds
                    .map(cid => {
                        const opt = options.find(o => o.id === cid);
                        return opt ? opt.selectedLabel || opt.label : cid;
                    })
                    .join(delim + " ");
                selectedAttribute.setValue(serializedValue);
            }
        }
        triggerOnChange();
    };

    const handleRemove = (id: string): void => {
        if (selectionMode === "single") {
            if (sourceMode === "association" && assoc) {
                assoc.setValue(undefined);
            }
            if (selectedAttribute) {
                selectedAttribute.setValue(undefined);
            }
        } else {
            if (sourceMode === "association" && assoc) {
                const currentSelected = (assoc.value as any[]) || [];
                assoc.setValue(currentSelected.filter(item => item.id !== id));
            }
            if (selectedAttribute) {
                const currentIds = selectedIds.filter(cid => cid !== id);
                if (currentIds.length === 0) {
                    selectedAttribute.setValue(undefined);
                } else {
                    const delim = delimiter || ",";
                    const serializedValue = currentIds
                        .map(cid => {
                            const opt = options.find(o => o.id === cid);
                            return opt ? opt.selectedLabel || opt.label : cid;
                        })
                        .join(delim + " ");
                    selectedAttribute.setValue(serializedValue);
                }
            }
        }
        triggerOnChange();
    };

    const handleClear = (): void => {
        if (selectionMode === "single") {
            if (sourceMode === "association" && assoc) {
                assoc.setValue(undefined);
            }
            if (selectedAttribute) {
                selectedAttribute.setValue(undefined);
            }
        } else {
            if (sourceMode === "association" && assoc) {
                assoc.setValue([]);
            }
            if (selectedAttribute) {
                selectedAttribute.setValue(undefined);
            }
        }
        triggerOnChange();
    };

    const handleEnter = (): void => {
        if (onEnterAction && onEnterAction.canExecute && !onEnterAction.isExecuting) {
            onEnterAction.execute();
        }
    };

    const handleLeave = (): void => {
        if (onLeaveAction && onLeaveAction.canExecute && !onLeaveAction.isExecuting) {
            onLeaveAction.execute();
        }
    };

    const handleFilterChange = (text: string): void => {
        if (filterAttribute && !filterAttribute.readOnly) {
            filterAttribute.setValue(text);
        }
        if (onFilterChangeAction && onFilterChangeAction.canExecute && !onFilterChangeAction.isExecuting) {
            onFilterChangeAction.execute();
        }
    };

    const handleCreateOption = (text: string): void => {
        if (selectionMode === "single") {
            if (selectedAttribute) {
                selectedAttribute.setValue(text);
            }
        } else {
            if (selectedAttribute) {
                const currentVal = selectedAttribute.value ? String(selectedAttribute.value) : "";
                const delim = delimiter || ",";
                const newVal = currentVal.trim() === "" ? text : `${currentVal}${delim} ${text}`;
                selectedAttribute.setValue(newVal);
            }
        }

        triggerOnChange();
    };

    // 6. Validation Checks
    const mendixValidationError = selectedAttribute?.validation || (assoc && assoc.validation);

    const expressionValidationError =
        validationExpression && validationExpression.value === false
            ? customValidationMessage || "Selection violates custom validation rule."
            : undefined;

    // Field required verification
    const isFieldRequiredEmpty = required && selectedIds.length === 0;
    const requiredValidationError = isFieldRequiredEmpty ? requiredMessage || "This field is required." : undefined;

    const activeValidationError = mendixValidationError || expressionValidationError || requiredValidationError;
    const hasError = !!activeValidationError;

    // 7. Styling Sanitization
    const colorRegex =
        /^(#([0-9a-fA-F]{3}){1,2}|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[0-9.]+\s*)?\)|hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[0-9.]+\s*)?\)|[a-zA-Z]+)$/;
    const safeAccentColor = accentColor && colorRegex.test(accentColor.trim()) ? accentColor.trim() : "#3b82f6";

    let safeBorderRadius = "16px";
    if (borderRadius) {
        const trimmed = borderRadius.trim();
        safeBorderRadius = /^\d+$/.test(trimmed) ? `${trimmed}px` : trimmed;
    }

    let safeBgBlur = "16px";
    if (bgBlur) {
        const trimmed = bgBlur.trim();
        safeBgBlur = /^\d+$/.test(trimmed) ? `${trimmed}px` : trimmed;
    }

    const safePopoverBg = popoverBg && popoverBg.trim() ? popoverBg.trim() : "rgba(255, 255, 255, 0.85)";

    return (
        <div className={className} style={style}>
            <ComboBox
                options={options}
                selectedIds={selectedIds}
                selectionMode={selectionMode}
                singleSelectStyle={singleSelectStyle}
                showSelectedAvatar={showSelectedAvatar}
                tagStyle={tagStyle}
                onSelect={handleSelect}
                onRemove={handleRemove}
                onClear={handleClear}
                isLoading={isLoading}
                placeholder={placeholder}
                accentColor={safeAccentColor}
                searchHighlightColor={searchHighlightColor}
                borderRadius={safeBorderRadius}
                bgBlur={safeBgBlur}
                popoverBg={safePopoverBg}
                maxDropdownHeight={maxDropdownHeight}
                dropdownLayout={dropdownLayout}
                optionAvatarShape={optionAvatarShape}
                showOptionCheckbox={showOptionCheckbox}
                highlightColorMode={highlightColorMode}
                searchDebounce={searchDebounce}
                maxVisibleTags={maxVisibleTags}
                showOptionAvatar={showOptionAvatar}
                enableGrouping={enableGrouping}
                renderCustomItem={customItemContent ? item => customItemContent.get(item) : undefined}
                showSelectAll={showSelectAll}
                selectAllText={selectAllText}
                deselectAllText={deselectAllText}
                onCreateOption={handleCreateOption}
                onEnter={handleEnter}
                onLeave={handleLeave}
                onFilterChange={handleFilterChange}
                hasCreateAction={!!onCreateText}
                onCreateText={onCreateText}
                noOptionsMessage={noOptionsMessage}
                loadingMessage={loadingMessage}
                clearButtonTitle={clearButtonTitle}
                readOnly={readOnly}
                required={required}
                hasError={hasError}
                errorText={activeValidationError}
                searchMethod={searchMethod}
                searchCaseSensitive={searchCaseSensitive}
                maxSearchResults={maxSearchResults}
            />
        </div>
    );
}
