import React, { ReactElement, useMemo, useRef, useEffect, useState } from "react";
import { DragContainer, DragItem } from "./components/DragContainer";
import { PwbCustomizeContainerDataViewContainerProps } from "../typings/PwbCustomizeContainerDataViewProps";
import { GUID } from "mendix";
import "./ui/PwbCustomizeContainerDataView.css";

interface ActiveTransition {
    itemId: GUID;
    sourceContainerId: string;
    targetContainerId: string;
    targetColumnValue: string;
    targetIndex: number;
    draggedItemRaw: any;
    timestamp: number;
}

declare global {
    interface Window {
        __pwbActiveTransition?: ActiveTransition;
    }
}

export function PwbCustomizeContainerDataView({
    class: className,
    style,
    itemsSource,
    customItemContent,
    sortedAttribute,
    onSortAction,
    readOnlyMode,
    sortIdAttribute,
    layoutDirection,
    dragHandleDisplay,
    accentColor,
    borderRadius,
    name: containerId,
    enableKanban,
    dragGroup,
    columnValue,
    itemColumnAttribute,
    saveDelay,
    themePreset,
    darkModeBehavior,
    itemPadding,
    itemGap,
    laneClass,
    enableHeader,
    headerContent,
    enableFooter,
    footerContent,
    enableMainFooter,
    mainFooterContent,
    enableOuterFooter,
    outerFooterContent,
    enableLaneTitle,
    laneTitle,
    laneTitleContent,
    allowedSourceColumns,
    itemAllowDropExpression,
    enableActionsSection,
    actionsSectionContent,
    actionsSectionPositionRow,
    actionsSectionPositionCol,
    actionsSectionLayout,
    actionsSectionSize,
    actionsSectionSizeCustom
}: PwbCustomizeContainerDataViewContainerProps): ReactElement {
    // 1. Sanitize Aesthetics Configuration
    const colorRegex =
        /^(#([0-9a-fA-F]{3}){1,2}|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[0-9.]+\s*)?\)|hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[0-9.]+\s*)?\)|[a-zA-Z]+)$/;
    const safeAccentColor = accentColor && colorRegex.test(accentColor.trim()) ? accentColor.trim() : "#3b82f6";

    let safeBorderRadius = "16px";
    if (borderRadius) {
        const trimmed = borderRadius.trim();
        safeBorderRadius = /^\d+$/.test(trimmed) ? `${trimmed}px` : trimmed;
    }

    const sanitizeSpacing = (val: string, fallback: string): string => {
        if (!val) {
            return fallback;
        }
        const trimmed = val.trim();
        return /^\d+$/.test(trimmed) ? `${trimmed}px` : trimmed;
    };
    const safeItemPadding = sanitizeSpacing(itemPadding, "12px 16px");
    const safeItemGap = sanitizeSpacing(itemGap, "12px");

    const resolvedPosition =
        actionsSectionLayout === "side_by_side"
            ? actionsSectionPositionRow === "left"
                ? "before"
                : "after"
            : actionsSectionPositionCol === "top"
            ? "before"
            : "after";

    // Accent color override — only set when prop is explicitly provided.
    // If empty, CSS cascade falls back to Design Property class → Atlas token → default.
    const accentOverrideStyle =
        safeAccentColor !== "#3b82f6" || accentColor
            ? ({ "--pwb-accent-override": safeAccentColor } as React.CSSProperties)
            : {};

    // Border radius override — only set when prop is explicitly provided.
    const radiusOverrideStyle = borderRadius
        ? ({ "--pwb-radius-override": safeBorderRadius } as React.CSSProperties)
        : {};

    // Gap override — only set when prop is explicitly provided.
    const gapOverrideStyle = itemGap ? ({ "--pwb-gap-override": safeItemGap } as React.CSSProperties) : {};

    // Resolve actions size styling variables
    let resolvedActionsSize = "auto";
    if (enableActionsSection) {
        if (actionsSectionSize === "custom") {
            resolvedActionsSize = actionsSectionSizeCustom || "200px";
        } else if (actionsSectionSize && actionsSectionSize.startsWith("ratio_")) {
            const pct = actionsSectionSize.replace("ratio_", "");
            resolvedActionsSize = `${pct}%`;
        }
    }

    const actionsSizeStyle = enableActionsSection
        ? ({ "--pwb-actions-size-resolved": resolvedActionsSize } as React.CSSProperties)
        : {};

    const containerOverrideStyle = {
        ...accentOverrideStyle,
        ...radiusOverrideStyle,
        ...gapOverrideStyle,
        ...actionsSizeStyle
    };

    // 2. Handle Loading & Empty States Elegantly
    const [transitionTrigger, setTransitionTrigger] = useState(0);

    useEffect(() => {
        const handleTransition = (): void => {
            setTransitionTrigger(prev => prev + 1);
        };
        window.addEventListener("pwb-transition-start", handleTransition);
        return () => {
            window.removeEventListener("pwb-transition-start", handleTransition);
        };
    }, []);

    const isLoading = itemsSource.status === "loading";
    const hasItems = itemsSource.items && itemsSource.items.length > 0;

    // 3. Map Mendix Object Items to DragItem Interface
    // We sort them based on the initial or current value of `sortedAttribute` if it's set,
    // to preserve Mendix side sorting order when the widget loads.
    const dragItems: DragItem[] = useMemo(() => {
        // Read transitionTrigger to force useMemo to re-evaluate when a cross-container
        // Kanban transition starts/ends, ensuring the optimistic UI changes are rendered immediately.
        if (transitionTrigger) {
            // Read to satisfy dependency check
        }
        let rawList = itemsSource.items
            ? itemsSource.items.map(item => ({
                  id: item.id,
                  rawObject: item
              }))
            : [];

        if (readOnlyMode) {
            if (sortIdAttribute) {
                return [...rawList].sort((a, b) => {
                    const valA = sortIdAttribute.get(a.rawObject).value;
                    const valB = sortIdAttribute.get(b.rawObject).value;

                    if (valA === undefined || valA === null) {
                        return 1;
                    }
                    if (valB === undefined || valB === null) {
                        return -1;
                    }

                    if (typeof valA === "object" && typeof valB === "object" && valA !== null && valB !== null) {
                        if (typeof (valA as any).comparedTo === "function") {
                            return (valA as any).comparedTo(valB);
                        }
                    }

                    if (valA < valB) {
                        return -1;
                    }
                    if (valA > valB) {
                        return 1;
                    }
                    return 0;
                });
            }
            return rawList;
        }

        // Apply global optimistic transition if valid (less than 1.2s old)
        const transition = window.__pwbActiveTransition;
        if (transition && Date.now() - transition.timestamp < 1200) {
            // A. Optimistic Remove (for Source column)
            if (containerId === transition.sourceContainerId) {
                rawList = rawList.filter(item => item.id !== transition.itemId);
            }
            // B. Optimistic Insert (for Target column)
            else if (containerId === transition.targetContainerId) {
                const alreadyContains = rawList.some(item => item.id === transition.itemId);
                if (!alreadyContains) {
                    const optimisticItem: DragItem = {
                        id: transition.itemId,
                        rawObject: transition.draggedItemRaw
                    };
                    rawList = [...rawList];
                    rawList.splice(transition.targetIndex, 0, optimisticItem);
                }
            }
        }

        // If the parent attribute already has a sorted order, sort the items accordingly
        if (sortedAttribute && sortedAttribute.value) {
            const sortedIds = sortedAttribute.value
                .split(",")
                .map(id => id.trim())
                .filter(id => id !== "");

            if (sortedIds.length > 0) {
                const sortedMap = new Map<string, number>();
                sortedIds.forEach((id, idx) => sortedMap.set(id, idx));

                // If this is the target container and there is an active transition,
                // override sorting to place the optimistic item exactly at targetIndex
                if (
                    transition &&
                    containerId === transition.targetContainerId &&
                    Date.now() - transition.timestamp < 1200
                ) {
                    const nextList = rawList.filter(item => item.id !== transition.itemId);
                    const movingItem = rawList.find(item => item.id === transition.itemId);
                    if (movingItem) {
                        nextList.sort((a, b) => {
                            const idxA = sortedMap.has(a.id) ? sortedMap.get(a.id)! : Infinity;
                            const idxB = sortedMap.has(b.id) ? sortedMap.get(b.id)! : Infinity;
                            return idxA - idxB;
                        });
                        nextList.splice(transition.targetIndex, 0, movingItem);
                        return nextList;
                    }
                }

                return [...rawList].sort((a, b) => {
                    const idxA = sortedMap.has(a.id) ? sortedMap.get(a.id)! : Infinity;
                    const idxB = sortedMap.has(b.id) ? sortedMap.get(b.id)! : Infinity;
                    return idxA - idxB;
                });
            }
        }

        return rawList;
    }, [itemsSource.items, sortedAttribute, transitionTrigger, containerId, readOnlyMode, sortIdAttribute]);

    // 4. Performance Debouncing logic for Mendix Persistence
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    const saveOrderWithDebounce = (newOrderIds: Array<GUID | string>): void => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        const runSave = (): void => {
            if (sortedAttribute && !sortedAttribute.readOnly) {
                const serialized = newOrderIds.join(",");
                sortedAttribute.setValue(serialized);

                // Execute Mendix nanoflow/microflow action
                if (onSortAction && onSortAction.canExecute && !onSortAction.isExecuting) {
                    onSortAction.execute();
                }
            }
        };

        if (saveDelay && saveDelay > 0) {
            debounceTimeoutRef.current = setTimeout(runSave, saveDelay);
        } else {
            runSave();
        }
    };

    const isDropAllowed = (draggedItemRaw: any, sourceColumnValue: string): boolean => {
        if (allowedSourceColumns && allowedSourceColumns.value) {
            const allowedList = allowedSourceColumns.value
                .split(",")
                .map(s => s.trim())
                .filter(Boolean);
            if (allowedList.length > 0 && !allowedList.includes(sourceColumnValue)) {
                return false;
            }
        }
        if (itemAllowDropExpression && draggedItemRaw) {
            const exprVal = itemAllowDropExpression.get(draggedItemRaw);
            if (exprVal && exprVal.status === "available" && exprVal.value === false) {
                return false;
            }
        }
        return true;
    };

    // 5. Drag callbacks
    const handleOrderChange = (newOrderIds: GUID[]): void => {
        saveOrderWithDebounce(newOrderIds);
    };

    const handleRemoveItemExternal = (itemId: GUID): void => {
        if (sortedAttribute && !sortedAttribute.readOnly) {
            const currentIds = sortedAttribute.value
                ? sortedAttribute.value
                      .split(",")
                      .map(id => id.trim())
                      .filter(Boolean)
                : [];
            const nextIds = currentIds.filter(id => id !== (itemId as any));
            saveOrderWithDebounce(nextIds);
        }
    };

    const handleDropExternal = (draggedItemId: GUID, _sourceContainerId: string, targetIndex: number): void => {
        const registry = window.__pwbDragRegistry;
        if (!registry) {
            return;
        }

        // Set active transition for optimistic UI updates
        window.__pwbActiveTransition = {
            itemId: draggedItemId,
            sourceContainerId: _sourceContainerId,
            targetContainerId: containerId,
            targetColumnValue: columnValue || "",
            targetIndex,
            draggedItemRaw: registry.draggedItem,
            timestamp: Date.now()
        };
        window.dispatchEvent(new CustomEvent("pwb-transition-start"));

        // Auto clean up after 1200ms in case Mendix completely fails or times out
        setTimeout(() => {
            if (window.__pwbActiveTransition && window.__pwbActiveTransition.itemId === draggedItemId) {
                window.__pwbActiveTransition = undefined;
                window.dispatchEvent(new CustomEvent("pwb-transition-start"));
            }
        }, 1200);

        // A. Remove from source container Mendix sorting state
        if (registry.onRemoveItem) {
            registry.onRemoveItem(draggedItemId);
        }

        // B. Update the Column status/category of the dragged item
        if (itemColumnAttribute && columnValue !== undefined) {
            const itemObj = registry.draggedItem;
            const attr = itemColumnAttribute.get(itemObj);
            if (attr && !attr.readOnly) {
                attr.setValue(columnValue);
            }
        }

        // C. Insert into target container Mendix sorting state
        if (sortedAttribute && !sortedAttribute.readOnly) {
            const currentIds = sortedAttribute.value
                ? sortedAttribute.value
                      .split(",")
                      .map(id => id.trim())
                      .filter(Boolean)
                : [];
            const nextIds = currentIds.filter(id => id !== (draggedItemId as any));
            nextIds.splice(targetIndex, 0, draggedItemId as any);
            saveOrderWithDebounce(nextIds);
        }
    };

    const ariaLabel = enableLaneTitle && laneTitle?.value ? laneTitle.value : "PWB Drag and Drop Container";

    const renderInnerContent = (): ReactElement => {
        return (
            <>
                {enableLaneTitle && (
                    <div className="pwb-lane-title-section">
                        {laneTitle && laneTitle.value && <h3 className="pwb-lane-title-text">{laneTitle.value}</h3>}
                        {laneTitleContent && <div className="pwb-lane-title-content">{laneTitleContent}</div>}
                    </div>
                )}

                {enableHeader && headerContent && <div className="pwb-section-header">{headerContent}</div>}

                {isLoading ? (
                    <div className="pwb-loading-state" style={containerOverrideStyle}>
                        <div className="pwb-spinner"></div>
                        <span>Loading options...</span>
                    </div>
                ) : !hasItems ? (
                    <div
                        className="pwb-empty-state-container"
                        style={{ borderRadius: safeBorderRadius, ...containerOverrideStyle }}
                    >
                        <DragContainer
                            containerId={containerId}
                            items={[]}
                            renderItem={() => <div />}
                            onOrderChange={handleOrderChange}
                            accentColor={safeAccentColor}
                            borderRadius={safeBorderRadius}
                            layoutDirection={layoutDirection}
                            dragHandleDisplay={dragHandleDisplay}
                            enableKanban={enableKanban}
                            dragGroup={dragGroup}
                            columnValue={columnValue}
                            onDropExternal={handleDropExternal}
                            onRemoveItemExternal={handleRemoveItemExternal}
                            isDropAllowed={isDropAllowed}
                            themePreset={themePreset}
                            darkModeBehavior={darkModeBehavior}
                            itemPadding={safeItemPadding}
                            itemGap={safeItemGap}
                            readOnlyMode={readOnlyMode}
                            enableActionsSection={enableActionsSection}
                            actionsSectionContent={
                                actionsSectionContent ? rawObject => actionsSectionContent.get(rawObject) : undefined
                            }
                            actionsSectionPosition={resolvedPosition}
                            actionsSectionLayout={actionsSectionLayout}
                            actionsSectionSize={actionsSectionSize}
                            actionsSectionSizeCustom={actionsSectionSizeCustom}
                        />
                        <div className="pwb-empty-state-content-overlay">
                            <svg
                                viewBox="0 0 24 24"
                                width="48"
                                height="48"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="pwb-empty-icon"
                            >
                                <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 4" />
                                <path d="M8 12h8M12 8v8" strokeLinecap="round" />
                            </svg>
                            <div className="pwb-empty-title">No items inside container</div>
                            <div className="pwb-empty-subtitle">
                                Drop some widgets here or drag cards into this column.
                            </div>
                        </div>
                    </div>
                ) : (
                    <DragContainer
                        containerId={containerId}
                        items={dragItems}
                        renderItem={rawObject => customItemContent.get(rawObject) as ReactElement}
                        onOrderChange={handleOrderChange}
                        accentColor={safeAccentColor}
                        borderRadius={safeBorderRadius}
                        layoutDirection={layoutDirection}
                        dragHandleDisplay={dragHandleDisplay}
                        enableKanban={enableKanban}
                        dragGroup={dragGroup}
                        columnValue={columnValue}
                        onDropExternal={handleDropExternal}
                        onRemoveItemExternal={handleRemoveItemExternal}
                        isDropAllowed={isDropAllowed}
                        themePreset={themePreset}
                        darkModeBehavior={darkModeBehavior}
                        itemPadding={safeItemPadding}
                        itemGap={safeItemGap}
                        readOnlyMode={readOnlyMode}
                        enableActionsSection={enableActionsSection}
                        actionsSectionContent={
                            actionsSectionContent ? rawObject => actionsSectionContent.get(rawObject) : undefined
                        }
                        actionsSectionPosition={resolvedPosition}
                        actionsSectionLayout={actionsSectionLayout}
                        actionsSectionSize={actionsSectionSize}
                        actionsSectionSizeCustom={actionsSectionSizeCustom}
                    />
                )}

                {enableFooter && footerContent && <div className="pwb-section-footer">{footerContent}</div>}

                {enableMainFooter && mainFooterContent && <div className="pwb-main-footer">{mainFooterContent}</div>}
            </>
        );
    };

    if (enableOuterFooter) {
        return (
            <div
                className={`pwb-customize-container-dataview-root ${className || ""}`}
                style={{ ...style, ...containerOverrideStyle }}
                role="region"
                aria-label={ariaLabel}
                aria-busy={isLoading}
            >
                <div className={`pwb-customize-container-dataview-wrapper ${laneClass || ""}`}>
                    {renderInnerContent()}
                </div>
                {outerFooterContent && <div className="pwb-outer-footer-section">{outerFooterContent}</div>}
            </div>
        );
    }

    return (
        <div
            className={`pwb-customize-container-dataview-wrapper ${className || ""}`}
            style={{ ...style, ...containerOverrideStyle }}
            role="region"
            aria-label={ariaLabel}
            aria-busy={isLoading}
        >
            {renderInnerContent()}
        </div>
    );
}
