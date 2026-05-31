import { ReactElement, useState, useEffect } from "react";

export interface DragItem {
    id: string;
    rawObject: any;
}

export interface DragContainerProps {
    items: DragItem[];
    renderItem: (rawObject: any) => JSX.Element;
    onOrderChange: (newOrderIds: string[]) => void;
    accentColor: string;
    borderRadius: string;
    layoutDirection: "vertical" | "horizontal";
}

export function DragContainer({
    items,
    renderItem,
    onOrderChange,
    accentColor,
    borderRadius,
    layoutDirection
}: DragContainerProps): ReactElement {
    const [orderedItems, setOrderedItems] = useState<DragItem[]>([]);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    // Sync state when items source updates from Mendix
    useEffect(() => {
        setOrderedItems(items);
    }, [items]);

    const handleDragStart = (e: React.DragEvent, index: number): void => {
        setDraggingIndex(index);
        e.dataTransfer.effectAllowed = "move";
        // Create an empty drag image for custom visual feel (optional, fallback is standard)
        try {
            const img = new Image();
            img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            e.dataTransfer.setDragImage(img, 0, 0);
        } catch (err) {
            // Ignore if browser restricts
        }
    };

    const handleDragOver = (e: React.DragEvent, index: number): void => {
        e.preventDefault();
        if (draggingIndex !== null && draggingIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDragEnd = (): void => {
        setDraggingIndex(null);
        setDragOverIndex(null);
    };

    const handleDrop = (index: number): void => {
        if (draggingIndex !== null && draggingIndex !== index) {
            const nextItems = [...orderedItems];
            const [movedItem] = nextItems.splice(draggingIndex, 1);
            nextItems.splice(index, 0, movedItem);
            
            setOrderedItems(nextItems);
            // Callback to sync new order with parent
            onOrderChange(nextItems.map(item => item.id));
        }
        setDraggingIndex(null);
        setDragOverIndex(null);
    };

    return (
        <div
            className={`pwb-drag-container pwb-direction-${layoutDirection}`}
            style={{
                "--accent-color": accentColor,
                "--border-radius": borderRadius,
                "--accent-glow": `color-mix(in srgb, ${accentColor} 15%, transparent)`
            } as any}
        >
            {orderedItems.map((item, idx) => {
                const isDragging = idx === draggingIndex;
                const isDragOver = idx === dragOverIndex;
                
                return (
                    <div
                        key={item.id}
                        draggable={true}
                        onDragStart={e => handleDragStart(e, idx)}
                        onDragOver={e => handleDragOver(e, idx)}
                        onDragEnd={handleDragEnd}
                        onDrop={() => handleDrop(idx)}
                        className={`pwb-draggable-row-item ${isDragging ? "pwb-dragging" : ""} ${
                            isDragOver ? "pwb-drag-over" : ""
                        }`}
                        style={{
                            borderRadius: `calc(${borderRadius} * 0.5)`
                        }}
                    >
                        {/* Drag Handle Icon on the left */}
                        <div className="pwb-drag-handle" title="Drag to reorder">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <circle cx="9" cy="5" r="1.2" fill="currentColor" />
                                <circle cx="9" cy="12" r="1.2" fill="currentColor" />
                                <circle cx="9" cy="19" r="1.2" fill="currentColor" />
                                <circle cx="15" cy="5" r="1.2" fill="currentColor" />
                                <circle cx="15" cy="12" r="1.2" fill="currentColor" />
                                <circle cx="15" cy="19" r="1.2" fill="currentColor" />
                            </svg>
                        </div>

                        {/* Nested custom widgets container */}
                        <div className="pwb-draggable-item-content">
                            {renderItem(item.rawObject)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
