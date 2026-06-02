import { ReactElement, useState, useEffect, DragEvent } from "react";

export interface DragItem {
    id: string;
    rawObject: any;
}

export interface DragContainerProps {
    containerId: string;
    items: DragItem[];
    renderItem: (rawObject: any) => ReactElement;
    onOrderChange: (newOrderIds: string[]) => void;
    accentColor: string;
    borderRadius: string;
    layoutDirection: "vertical" | "horizontal";
    dragHandleDisplay: "left" | "hide";
    enableKanban?: boolean;
    dragGroup?: string;
    columnValue?: string;
    onDropExternal?: (draggedItemId: string, sourceContainerId: string, targetIndex: number) => void;
    onRemoveItemExternal?: (itemId: string) => void;
}

interface DragRegistry {
    itemId: string;
    draggedItem: any;
    sourceDragGroup?: string;
    sourceContainerId: string;
    sourceColumnValue?: string;
    onRemoveItem?: (itemId: string) => void;
}

declare global {
    interface Window {
        __pwbDragRegistry?: DragRegistry;
    }
}

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
    onRemoveItemExternal
}: DragContainerProps): ReactElement {
    const [orderedItems, setOrderedItems] = useState<DragItem[]>([]);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    // Sync state when items source updates from Mendix
    useEffect(() => {
        setOrderedItems(items);
    }, [items]);

    const handleDragStart = (e: DragEvent, index: number): void => {
        setDraggingIndex(index);
        
        // Write to global registry for cross-container dragging (only expose cross-container if enableKanban is true on source)
        window.__pwbDragRegistry = {
            itemId: orderedItems[index].id,
            draggedItem: orderedItems[index].rawObject,
            sourceDragGroup: enableKanban ? dragGroup : undefined,
            sourceContainerId: containerId,
            sourceColumnValue: columnValue,
            onRemoveItem: enableKanban ? onRemoveItemExternal : undefined
        };

        e.dataTransfer.effectAllowed = "move";
        try {
            const img = new Image();
            img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            e.dataTransfer.setDragImage(img, 0, 0);
        } catch {
            // Ignore if browser restricts
        }
    };

    const handleDragOver = (e: DragEvent, index: number): void => {
        e.preventDefault();
        e.stopPropagation();

        const registry = window.__pwbDragRegistry;
        if (!registry) return;

        if (registry.sourceContainerId === containerId) {
            // Same container reorder
            if (draggingIndex !== null && draggingIndex !== index) {
                setDragOverIndex(index);
            }
        } else {
            // External item hover: only allow if enableKanban is true on target
            if (!enableKanban) return;
            if (dragGroup && registry.sourceDragGroup !== dragGroup) return;
            setDragOverIndex(index);
        }
    };

    const handleDragEnd = (): void => {
        setDraggingIndex(null);
        setDragOverIndex(null);
        window.__pwbDragRegistry = undefined;
    };

    const handleDrop = (e: DragEvent, index: number): void => {
        e.preventDefault();
        e.stopPropagation();

        const registry = window.__pwbDragRegistry;
        if (!registry) return;

        if (registry.sourceContainerId === containerId) {
            // Same container drop
            if (draggingIndex !== null && draggingIndex !== index) {
                const nextItems = [...orderedItems];
                const [movedItem] = nextItems.splice(draggingIndex, 1);
                nextItems.splice(index, 0, movedItem);

                setOrderedItems(nextItems);
                onOrderChange(nextItems.map(item => item.id));
            }
        } else {
            // Drop from external container: only allow if enableKanban is true on target
            if (!enableKanban) return;
            if (dragGroup && registry.sourceDragGroup !== dragGroup) return;

            if (onDropExternal) {
                onDropExternal(registry.itemId, registry.sourceContainerId, index);
            }
        }
        
        setDraggingIndex(null);
        setDragOverIndex(null);
        window.__pwbDragRegistry = undefined;
    };

    const handleContainerDragOver = (e: DragEvent): void => {
        const registry = window.__pwbDragRegistry;
        if (!registry) return;

        if (registry.sourceContainerId !== containerId) {
            // Empty container hover from external: only allow if enableKanban is true on target
            if (!enableKanban) return;
            if (dragGroup && registry.sourceDragGroup !== dragGroup) return;
        }
        
        e.preventDefault();
        
        // If container is empty, set drag over index to 0 so we show a drop target glow
        if (orderedItems.length === 0) {
            setDragOverIndex(0);
        }
    };

    const handleContainerDrop = (e: DragEvent): void => {
        e.preventDefault();
        
        const registry = window.__pwbDragRegistry;
        if (!registry) return;

        if (registry.sourceContainerId !== containerId) {
            // Empty container drop from external: only allow if enableKanban is true on target
            if (!enableKanban) return;
            if (dragGroup && registry.sourceDragGroup !== dragGroup) return;
        }

        // If list is empty or we drop on container background below all items
        if (dragOverIndex === null || orderedItems.length === 0) {
            const targetIndex = orderedItems.length;
            if (registry.sourceContainerId === containerId) {
                // Same container: append to end
                if (draggingIndex !== null && draggingIndex !== targetIndex - 1) {
                    const nextItems = [...orderedItems];
                    const [movedItem] = nextItems.splice(draggingIndex, 1);
                    nextItems.push(movedItem);

                    setOrderedItems(nextItems);
                    onOrderChange(nextItems.map(item => item.id));
                }
            } else {
                // External container: append to end
                if (onDropExternal) {
                    onDropExternal(registry.itemId, registry.sourceContainerId, targetIndex);
                }
            }
        }

        setDraggingIndex(null);
        setDragOverIndex(null);
        window.__pwbDragRegistry = undefined;
    };

    return (
        <div
            className={`pwb-drag-container pwb-direction-${layoutDirection} ${
                orderedItems.length === 0 ? "pwb-empty-container-dropzone" : ""
            }`}
            onDragOver={handleContainerDragOver}
            onDrop={handleContainerDrop}
            style={
                {
                    "--accent-color": accentColor,
                    "--border-radius": borderRadius,
                    "--accent-glow": `color-mix(in srgb, ${accentColor} 15%, transparent)`
                } as any
            }
        >
            {orderedItems.map((item, idx) => {
                const isDragging = idx === draggingIndex;
                const isDragOver = idx === dragOverIndex;

                return (
                    <div
                        key={item.id}
                        draggable
                        onDragStart={e => handleDragStart(e, idx)}
                        onDragOver={e => handleDragOver(e, idx)}
                        onDragEnd={handleDragEnd}
                        onDrop={e => handleDrop(e, idx)}
                        className={`pwb-draggable-row-item ${isDragging ? "pwb-dragging" : ""} ${
                            isDragOver ? "pwb-drag-over" : ""
                        }`}
                        style={{
                            borderRadius: `calc(${borderRadius} * 0.5)`
                        }}
                    >
                        {/* Drag Handle Icon on the left */}
                        {dragHandleDisplay === "left" && (
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

                        {/* Nested custom widgets container */}
                        <div className="pwb-draggable-item-content">{renderItem(item.rawObject)}</div>
                    </div>
                );
            })}
        </div>
    );
}
