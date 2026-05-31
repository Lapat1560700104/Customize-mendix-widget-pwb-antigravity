import { ReactElement } from "react";
import { ComboBox, ComboBoxOption } from "./components/ComboBox";
import { PwbComboBoxContainerProps } from "../typings/PwbComboBoxProps";
import "./ui/PwbComboBox.css";

export function PwbComboBox({
    class: className,
    style,
    optionsSource,
    optionLabel,
    optionDetail,
    optionGroup,
    optionImage,
    sortOrder,
    sortField,
    selectedOptionLabel,
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
    onCreateAction,
    onCreateText,
    noOptionsMessage,
    loadingMessage,
    clearButtonTitle,
    required,
    requiredMessage,
    validationExpression,
    customValidationMessage,
    enableGrouping,
    showOptionAvatar,
    customItemContent
}: PwbComboBoxContainerProps): ReactElement {
    const assoc = selectedAssociation as any;

    // 1. Check read-only state
    const readOnly =
        selectionMode === "single"
            ? selectedAttribute?.readOnly === true || (assoc && assoc.readOnly)
            : assoc?.readOnly === true || selectedAttribute?.readOnly === true;

    // 2. Fetch loading state
    const isLoading = optionsSource.status === "loading";

    // 3. Map Mendix ObjectItems to clean ComboBoxOption interface
    const options: ComboBoxOption[] = optionsSource.items
        ? optionsSource.items.map(item => ({
              id: item.id,
              label: optionLabel.get(item).value || "",
              subtitle: optionDetail ? optionDetail.get(item).value || "" : undefined,
              groupName: optionGroup ? optionGroup.get(item).value : undefined,
              colorCode: tagColorExpression ? tagColorExpression.get(item).value : undefined,
              imageUrl: optionImage ? optionImage.get(item).value : undefined,
              selectedLabel: selectedOptionLabel ? selectedOptionLabel.get(item).value || "" : undefined,
              rawObject: item
          }))
        : [];

    // Apply sorting if configured
    if (sortOrder && sortOrder !== "none") {
        const fieldKey = sortField || "label";
        options.sort((a, b) => {
            let valA = "";
            let valB = "";

            if (fieldKey === "label") {
                valA = a.label;
                valB = b.label;
            } else if (fieldKey === "detail") {
                valA = a.subtitle || "";
                valB = b.subtitle || "";
            } else if (fieldKey === "group") {
                valA = a.groupName || "";
                valB = b.groupName || "";
            }

            const comparison = valA.localeCompare(valB, undefined, { sensitivity: "base", numeric: true });
            return sortOrder === "asc" ? comparison : -comparison;
        });
    }

    // 4. Retrieve currently selected IDs
    let selectedIds: string[] = [];
    if (selectionMode === "single") {
        if (assoc && assoc.value) {
            // Find option matching Mendix object GUID
            const matched = options.find(o => o.id === assoc.value.id);
            if (matched) {
                selectedIds = [matched.id];
            }
        } else if (selectedAttribute && selectedAttribute.value !== undefined) {
            const attrVal = String(selectedAttribute.value);
            // Match either option ID or option label value
            const matched = options.find(o => o.id === attrVal || o.label === attrVal || o.selectedLabel === attrVal);
            if (matched) {
                selectedIds = [matched.id];
            }
        }
    } else {
        // Multi-select mode (ReferenceSet association or Delimited String Attribute)
        if (assoc && assoc.value) {
            const selectedObjects = assoc.value;
            const selectedArray = Array.isArray(selectedObjects) ? selectedObjects : [selectedObjects];
            selectedIds = selectedArray.map((item: any) => item.id);
        } else if (selectedAttribute && selectedAttribute.value !== undefined) {
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
    const handleSelect = (id: string): void => {
        const option = options.find(o => o.id === id);
        if (!option) {
            return;
        }

        const displayLabel = option.selectedLabel || option.label;

        if (selectionMode === "single") {
            if (assoc) {
                assoc.setValue(option.rawObject);
            }
            if (selectedAttribute) {
                selectedAttribute.setValue(displayLabel);
            }
        } else {
            // Multi-select mode
            if (assoc) {
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
    };

    const handleRemove = (id: string): void => {
        if (selectionMode === "single") {
            if (assoc) {
                assoc.setValue(undefined);
            }
            if (selectedAttribute) {
                selectedAttribute.setValue(undefined);
            }
        } else {
            if (assoc) {
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
    };

    const handleClear = (): void => {
        if (selectionMode === "single") {
            if (assoc) {
                assoc.setValue(undefined);
            }
            if (selectedAttribute) {
                selectedAttribute.setValue(undefined);
            }
        } else {
            if (assoc) {
                assoc.setValue([]);
            }
            if (selectedAttribute) {
                selectedAttribute.setValue(undefined);
            }
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

        if (onCreateAction && onCreateAction.canExecute && !onCreateAction.isExecuting) {
            onCreateAction.execute();
        }
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
                hasCreateAction={!!onCreateAction}
                onCreateText={onCreateText}
                noOptionsMessage={noOptionsMessage}
                loadingMessage={loadingMessage}
                clearButtonTitle={clearButtonTitle}
                readOnly={readOnly}
                required={required}
                hasError={hasError}
                errorText={activeValidationError}
            />
        </div>
    );
}
