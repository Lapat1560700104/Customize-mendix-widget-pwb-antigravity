import { ReactElement, useMemo } from "react";
import { DragContainer, DragItem } from "./components/DragContainer";
import { PwbCustomizeContainerDataViewContainerProps } from "../typings/PwbCustomizeContainerDataViewProps";
import "./ui/PwbCustomizeContainerDataView.css";

export function PwbCustomizeContainerDataView({
    class: className,
    style,
    itemsSource,
    customItemContent,
    sortedAttribute,
    onSortAction,
    layoutDirection,
    accentColor,
    borderRadius
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

    // 2. Handle Loading & Empty States Elegantly
    const isLoading = itemsSource.status === "loading";
    const hasItems = itemsSource.items && itemsSource.items.length > 0;

    // 3. Map Mendix Object Items to DragItem Interface
    // We sort them based on the initial or current value of `sortedAttribute` if it's set,
    // to preserve Mendix side sorting order when the widget loads.
    const dragItems: DragItem[] = useMemo(() => {
        if (!itemsSource.items) {
            return [];
        }

        const rawList = itemsSource.items.map(item => ({
            id: item.id,
            rawObject: item
        }));

        // If the parent attribute already has a sorted order, sort the items accordingly
        if (sortedAttribute && sortedAttribute.value) {
            const sortedIds = sortedAttribute.value
                .split(",")
                .map(id => id.trim())
                .filter(id => id !== "");
            
            if (sortedIds.length > 0) {
                const sortedMap = new Map<string, number>();
                sortedIds.forEach((id, idx) => sortedMap.set(id, idx));

                return [...rawList].sort((a, b) => {
                    const idxA = sortedMap.has(a.id) ? sortedMap.get(a.id)! : Infinity;
                    const idxB = sortedMap.has(b.id) ? sortedMap.get(b.id)! : Infinity;
                    return idxA - idxB;
                });
            }
        }

        return rawList;
    }, [itemsSource.items, sortedAttribute?.value]);

    // 4. Update order callback
    const handleOrderChange = (newOrderIds: string[]): void => {
        if (sortedAttribute && !sortedAttribute.readOnly) {
            const serialized = newOrderIds.join(",");
            sortedAttribute.setValue(serialized);

            // Execute Mendix nanoflow/microflow action
            if (onSortAction && onSortAction.canExecute && !onSortAction.isExecuting) {
                onSortAction.execute();
            }
        }
    };

    return (
        <div className={`pwb-customize-container-dataview-wrapper ${className || ""}`} style={style}>
            {isLoading ? (
                <div className="pwb-loading-state" style={{ "--accent-color": safeAccentColor } as any}>
                    <div className="pwb-spinner"></div>
                    <span>Loading options...</span>
                </div>
            ) : !hasItems ? (
                <div className="pwb-empty-state" style={{ borderRadius: safeBorderRadius }}>
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" className="pwb-empty-icon">
                        <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 4" />
                        <path d="M8 12h8M12 8v8" strokeLinecap="round" />
                    </svg>
                    <div className="pwb-empty-title">No items inside container</div>
                    <div className="pwb-empty-subtitle">Drop some widgets here in Studio Pro to start building.</div>
                </div>
            ) : (
                <DragContainer
                    items={dragItems}
                    renderItem={rawObject => customItemContent.get(rawObject)}
                    onOrderChange={handleOrderChange}
                    accentColor={safeAccentColor}
                    borderRadius={safeBorderRadius}
                    layoutDirection={layoutDirection}
                />
            )}
        </div>
    );
}
