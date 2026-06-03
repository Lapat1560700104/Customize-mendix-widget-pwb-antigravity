import { ReactElement, useMemo, useRef, useEffect, useState, CSSProperties } from "react";
import { DragContainer, DragItem } from "./components/DragContainer";
import { PwbCustomizeContainerDataViewContainerProps } from "../typings/PwbCustomizeContainerDataViewProps";
import "./ui/PwbCustomizeContainerDataView.css";

interface ActiveTransition {
    itemId: string;
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
    laneTitleContent
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

    // 2. Handle Loading & Empty States Elegantly
    const [transitionTrigger, setTransitionTrigger] = useState(0);

    useEffect(() => {
        const handleTransition = () => {
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
        let rawList = itemsSource.items
            ? itemsSource.items.map(item => ({
                  id: item.id,
                  rawObject: item
              }))
            : [];

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
                if (transition && containerId === transition.targetContainerId && Date.now() - transition.timestamp < 1200) {
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
    }, [itemsSource.items, sortedAttribute, transitionTrigger, containerId]);

    // 4. Performance Debouncing logic for Mendix Persistence
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    const saveOrderWithDebounce = (newOrderIds: string[]): void => {
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

    // 5. Drag callbacks
    const handleOrderChange = (newOrderIds: string[]): void => {
        saveOrderWithDebounce(newOrderIds);
    };

    const handleRemoveItemExternal = (itemId: string): void => {
        if (sortedAttribute && !sortedAttribute.readOnly) {
            const currentIds = sortedAttribute.value
                ? sortedAttribute.value
                      .split(",")
                      .map(id => id.trim())
                      .filter(Boolean)
                : [];
            const nextIds = currentIds.filter(id => id !== itemId);
            saveOrderWithDebounce(nextIds);
        }
    };

    const handleDropExternal = (draggedItemId: string, _sourceContainerId: string, targetIndex: number): void => {
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
            const nextIds = currentIds.filter(id => id !== draggedItemId);
            nextIds.splice(targetIndex, 0, draggedItemId);
            saveOrderWithDebounce(nextIds);
        }
    };

    const renderInnerContent = () => (
        <>
            {enableLaneTitle && (
                <div className="pwb-lane-title-section">
                    {laneTitle && laneTitle.value && <h3 className="pwb-lane-title-text">{laneTitle.value}</h3>}
                    {laneTitleContent && <div className="pwb-lane-title-content">{laneTitleContent}</div>}
                </div>
            )}

            {enableHeader && headerContent && <div className="pwb-section-header">{headerContent}</div>}

            {isLoading ? (
                <div className="pwb-loading-state" style={{ "--accent-color": safeAccentColor } as CSSProperties}>
                    <div className="pwb-spinner"></div>
                    <span>Loading options...</span>
                </div>
            ) : !hasItems ? (
                <div className="pwb-empty-state-container" style={{ borderRadius: safeBorderRadius }}>
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
                        themePreset={themePreset}
                        darkModeBehavior={darkModeBehavior}
                        itemPadding={safeItemPadding}
                        itemGap={safeItemGap}
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
                        <div className="pwb-empty-subtitle">Drop some widgets here or drag cards into this column.</div>
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
                    themePreset={themePreset}
                    darkModeBehavior={darkModeBehavior}
                    itemPadding={safeItemPadding}
                    itemGap={safeItemGap}
                />
            )}

            {enableFooter && footerContent && <div className="pwb-section-footer">{footerContent}</div>}

            {enableMainFooter && mainFooterContent && <div className="pwb-main-footer">{mainFooterContent}</div>}
        </>
    );

    if (enableOuterFooter) {
        return (
            <div className={`pwb-customize-container-dataview-root ${className || ""}`} style={style}>
                <div className={`pwb-customize-container-dataview-wrapper ${laneClass || ""}`}>
                    {renderInnerContent()}
                </div>
                {outerFooterContent && (
                    <div className="pwb-outer-footer-section">
                        {outerFooterContent}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`pwb-customize-container-dataview-wrapper ${className || ""}`} style={style}>
            {renderInnerContent()}
        </div>
    );
}
