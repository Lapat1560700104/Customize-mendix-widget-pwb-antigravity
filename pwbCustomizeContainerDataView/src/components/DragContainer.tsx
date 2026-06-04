import { ReactElement, useState, useEffect, useRef } from "react";
import { ObjectItem, GUID } from "mendix";
import { useKeyboardDrag } from "../hooks/useKeyboardDrag";
import { usePointerDrag } from "../hooks/usePointerDrag";

export interface DragItem {
    id: GUID;
    rawObject: ObjectItem;
}

export interface DragContainerProps {
    containerId: string;
    items: DragItem[];
    renderItem: (rawObject: ObjectItem) => ReactElement;
    onOrderChange: (newOrderIds: GUID[]) => void;
    accentColor: string;
    borderRadius: string;
    layoutDirection: "vertical" | "horizontal";
    dragHandleDisplay: "left" | "hide";
    enableKanban?: boolean;
    dragGroup?: string;
    columnValue?: string;
    onDropExternal?: (draggedItemId: GUID, sourceContainerId: string, targetIndex: number) => void;
    onRemoveItemExternal?: (itemId: GUID) => void;
    isDropAllowed?: (draggedItemRaw: ObjectItem, sourceColumnValue: string) => boolean;
    themePreset: "default_rounded" | "modern_glass" | "minimalist_flat" | "neo_brutalist";
    darkModeBehavior: "auto" | "light" | "dark";
    itemPadding?: string;
    itemGap?: string;
    readOnlyMode?: boolean;
}

interface DragRegistry {
    itemId: GUID;
    draggedItem: ObjectItem;
    sourceDragGroup?: string;
    sourceContainerId: string;
    sourceColumnValue?: string;
    onRemoveItem?: (itemId: GUID) => void;
    draggedSize?: { width: number; height: number };
}

declare global {
    interface Window {
        __pwbDragRegistry?: DragRegistry;
    }
}

// Safeguard vibration for non-supported browsers (Safari/iOS)
const triggerVibrate = (pattern: number | number[]): void => {
    if (typeof window !== "undefined" && window.navigator && typeof window.navigator.vibrate === "function") {
        try {
            window.navigator.vibrate(pattern);
        } catch {
            // Ignore error
        }
    }
};

export function DragContainer({
    containerId,
    items,
    renderItem,
    onOrderChange,
    accentColor,
    borderRadius,
    layoutDirection,
    dragHandleDisplay,
    enableKanban = true,
    dragGroup,
    columnValue,
    onDropExternal,
    onRemoveItemExternal,
    isDropAllowed,
    themePreset,
    darkModeBehavior,
    itemPadding,
    itemGap,
    readOnlyMode = false
}: DragContainerProps): ReactElement {
    const [orderedItems, setOrderedItems] = useState<DragItem[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // 1. Keyboard Drag Hook
    const {
        keyboardGrabbedId,
        setKeyboardGrabbedId,
        setOriginalItemsBeforeKeyboardDrag,
        announcement,
        setAnnouncement,
        handleKeyDown
    } = useKeyboardDrag({
        readOnlyMode,
        orderedItems,
        setOrderedItems,
        onOrderChange,
        enableKanban,
        dragGroup,
        columnValue,
        onRemoveItemExternal,
        containerId,
        containerRef
    });

    // 2. Pointer Drag Hook
    const {
        draggingIndex,
        dragOverIndex,
        dropDenied,
        wobblingItemId,
        setDragOverIndex,
        setDropDenied,
        handlePointerDown
    } = usePointerDrag({
        readOnlyMode,
        orderedItems,
        setOrderedItems,
        onOrderChange,
        accentColor,
        borderRadius,
        layoutDirection,
        dragHandleDisplay,
        enableKanban,
        dragGroup,
        columnValue,
        onDropExternal,
        onRemoveItemExternal,
        containerId,
        containerRef
    });

    // Sync state when items source updates from Mendix
    useEffect(() => {
        setOrderedItems(items);
    }, [items]);

    // Handle cross-container hover notifications using Custom Events
    useEffect(() => {
        const el = containerRef.current;
        if (!el) {
            return;
        }

        const handleHoverEvent = (e: Event): void => {
            const customEvent = e as CustomEvent;
            const { hoverIndex } = customEvent.detail;

            const registry = window.__pwbDragRegistry;
            if (!registry) {
                return;
            }

            // Group check validation
            if (registry.sourceDragGroup && registry.sourceDragGroup !== dragGroup) {
                return;
            }

            // Kanban check validation for external source
            if (registry.sourceContainerId !== containerId && !enableKanban) {
                return;
            }

            // Custom workflow constraint check!
            if (isDropAllowed && registry) {
                const allowed = isDropAllowed(registry.draggedItem, registry.sourceColumnValue || "");
                if (!allowed) {
                    setDropDenied(true);
                    setDragOverIndex(null);
                    return;
                }
            }

            setDropDenied(false);
            setDragOverIndex(hoverIndex);
        };

        const handleLeaveEvent = (): void => {
            setDragOverIndex(null);
            setDropDenied(false);
        };

        const handleKeyboardAccept = (e: Event): void => {
            const customEvent = e as CustomEvent;
            const {
                item,
                sourceContainerId,
                sourceColumnValue,
                onRemoveItemExternal: srcRemoveHandler
            } = customEvent.detail;

            if (isDropAllowed) {
                const allowed = isDropAllowed(item.rawObject, sourceColumnValue || "");
                if (!allowed) {
                    e.preventDefault(); // Deny cross-column drop
                    return;
                }
            }

            // Simulate global registry for Mendix saving callbacks
            window.__pwbDragRegistry = {
                itemId: item.id,
                draggedItem: item.rawObject,
                sourceDragGroup: dragGroup,
                sourceContainerId,
                sourceColumnValue,
                onRemoveItem: srcRemoveHandler
            };

            if (onDropExternal) {
                // Drop at the top of the column (index 0)
                onDropExternal(item.id, sourceContainerId, 0);
            }

            window.__pwbDragRegistry = undefined;

            // Update target container state visually
            setOrderedItems(prev => {
                const filtered = prev.filter(it => it.id !== item.id);
                return [item, ...filtered];
            });

            // Auto-grab it in the target container
            setKeyboardGrabbedId(item.id);
            setOriginalItemsBeforeKeyboardDrag([item, ...orderedItems.filter(it => it.id !== item.id)]);

            triggerVibrate(10);

            const itemTitle = item.rawObject ? "Item" : "Item";
            setAnnouncement(`Moved ${itemTitle} to this column. Use Arrow Up or Down to reorder.`);

            setTimeout(() => {
                const targetEl = containerRef.current?.querySelector(`[data-index="0"]`) as HTMLElement;
                targetEl?.focus();
            }, 50);
        };

        const handlePointerDropExternal = (e: Event): void => {
            const customEvent = e as CustomEvent;
            const { itemId, sourceContainerId, targetIndex } = customEvent.detail;
            if (onDropExternal) {
                onDropExternal(itemId, sourceContainerId, targetIndex);
            }
        };

        if (!readOnlyMode) {
            el.addEventListener("pwb-drag-over-container", handleHoverEvent);
            el.addEventListener("pwb-drag-leave-container", handleLeaveEvent);
            el.addEventListener("pwb-keyboard-accept-item", handleKeyboardAccept);
            el.addEventListener("pwb-pointer-drop-item", handlePointerDropExternal);
        }

        return () => {
            el.removeEventListener("pwb-drag-over-container", handleHoverEvent);
            el.removeEventListener("pwb-drag-leave-container", handleLeaveEvent);
            el.removeEventListener("pwb-keyboard-accept-item", handleKeyboardAccept);
            el.removeEventListener("pwb-pointer-drop-item", handlePointerDropExternal);
        };
    }, [
        containerId,
        dragGroup,
        enableKanban,
        isDropAllowed,
        readOnlyMode,
        onDropExternal,
        orderedItems,
        onRemoveItemExternal,
        columnValue,
        setDragOverIndex,
        setDropDenied,
        setKeyboardGrabbedId,
        setOriginalItemsBeforeKeyboardDrag,
        setAnnouncement
    ]);

    const themeClass = `pwb-preset-${themePreset}`;
    const modeClass =
        darkModeBehavior === "dark"
            ? "pwb-dark-mode-force"
            : darkModeBehavior === "light"
            ? "pwb-light-mode-force"
            : "";

    return (
        <div
            ref={containerRef}
            role="list"
            data-container-id={containerId}
            data-drag-group={dragGroup}
            data-enable-kanban={String(enableKanban)}
            data-items-count={orderedItems.length}
            data-drop-denied={readOnlyMode || dropDenied ? "true" : "false"}
            className={`pwb-drag-container pwb-direction-${layoutDirection} ${themeClass} ${modeClass} ${
                orderedItems.length === 0 ? "pwb-empty-container-dropzone" : ""
            } ${dropDenied ? "pwb-lane-denied" : ""} ${readOnlyMode ? "pwb-read-only-mode" : ""}`}
            style={
                {
                    "--accent-color": accentColor,
                    "--border-radius": borderRadius,
                    "--accent-glow": `color-mix(in srgb, ${accentColor} 15%, transparent)`,
                    "--pwb-item-padding": itemPadding,
                    "--pwb-item-gap": itemGap
                } as any
            }
        >
            <div className="pwb-sr-only" aria-live="assertive" aria-atomic="true">
                {announcement}
            </div>

            {(() => {
                const elements: ReactElement[] = [];
                const registry = window.__pwbDragRegistry;
                const showExternalPlaceholder =
                    dragOverIndex !== null &&
                    !dropDenied &&
                    registry &&
                    !orderedItems.some(it => it.id === registry.itemId);

                const placeholderSize = registry?.draggedSize;
                const placeholderStyle = {
                    width: placeholderSize ? `${placeholderSize.width}px` : "100%",
                    height: placeholderSize ? `${placeholderSize.height}px` : "80px",
                    borderRadius: `calc(${borderRadius} * 0.5)`
                };

                orderedItems.forEach((item, idx) => {
                    const isDragging = idx === draggingIndex;
                    const isDragOver = idx === dragOverIndex;
                    const isGrabbed = item.id === keyboardGrabbedId;

                    if (showExternalPlaceholder && idx === dragOverIndex) {
                        elements.push(
                            <div
                                key="pwb-external-placeholder"
                                className="pwb-drag-placeholder"
                                style={placeholderStyle}
                            />
                        );
                    }

                    if (isDragging) {
                        elements.push(<div key={item.id} className="pwb-drag-placeholder" style={placeholderStyle} />);
                    } else {
                        elements.push(
                            <div
                                key={item.id}
                                data-index={idx}
                                tabIndex={readOnlyMode ? undefined : 0}
                                role="listitem"
                                aria-grabbed={readOnlyMode ? undefined : isGrabbed}
                                aria-roledescription={
                                    readOnlyMode
                                        ? undefined
                                        : "Draggable row card. Press Spacebar or Enter to grab, then use Arrow Up or Arrow Down keys to reorder. Press Escape to cancel."
                                }
                                onPointerDown={readOnlyMode ? undefined : e => handlePointerDown(e, idx)}
                                onKeyDown={readOnlyMode ? undefined : e => handleKeyDown(e, idx)}
                                className={`pwb-draggable-row-item ${isDragOver ? "pwb-drag-over" : ""} ${
                                    isGrabbed ? "pwb-keyboard-grabbed" : ""
                                } ${wobblingItemId === item.id ? "pwb-wobble-shake" : ""} ${
                                    readOnlyMode ? "pwb-read-only-item" : ""
                                }`}
                                style={{
                                    borderRadius: `calc(${borderRadius} * 0.5)`
                                }}
                            >
                                {dragHandleDisplay === "left" && !readOnlyMode && (
                                    <div className="pwb-drag-handle" title="Drag to reorder">
                                        <svg
                                            viewBox="0 0 24 24"
                                            width="16"
                                            height="16"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                        >
                                            <circle cx="9" cy="5" r="1.2" fill="currentColor" />
                                            <circle cx="9" cy="12" r="1.2" fill="currentColor" />
                                            <circle cx="9" cy="19" r="1.2" fill="currentColor" />
                                            <circle cx="15" cy="5" r="1.2" fill="currentColor" />
                                            <circle cx="15" cy="12" r="1.2" fill="currentColor" />
                                            <circle cx="15" cy="19" r="1.2" fill="currentColor" />
                                        </svg>
                                    </div>
                                )}
                                <div className="pwb-draggable-item-content">{renderItem(item.rawObject)}</div>
                            </div>
                        );
                    }
                });

                if (showExternalPlaceholder && dragOverIndex !== null && dragOverIndex >= orderedItems.length) {
                    elements.push(
                        <div
                            key="pwb-external-placeholder-end"
                            className="pwb-drag-placeholder"
                            style={placeholderStyle}
                        />
                    );
                }

                return elements;
            })()}
        </div>
    );
}
