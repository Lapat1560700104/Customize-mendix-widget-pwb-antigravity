import { ReactElement, useState, useEffect, useRef, PointerEvent as ReactPointerEvent } from "react";

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
    const containerRef = useRef<HTMLDivElement>(null);

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

            setDragOverIndex(hoverIndex);
        };

        const handleLeaveEvent = (): void => {
            setDragOverIndex(null);
        };

        el.addEventListener("pwb-drag-over-container", handleHoverEvent);
        el.addEventListener("pwb-drag-leave-container", handleLeaveEvent);

        return () => {
            el.removeEventListener("pwb-drag-over-container", handleHoverEvent);
            el.removeEventListener("pwb-drag-leave-container", handleLeaveEvent);
        };
    }, [containerId, dragGroup, enableKanban]);

    const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>, index: number): void => {
        // Only trigger on left-click for mouse pointer devices
        if (e.pointerType === "mouse" && e.button !== 0) {
            return;
        }

        const targetEl = e.target as HTMLElement;

        // Prevent dragging if interactive elements like buttons, inputs, links are targeted
        if (targetEl.closest("button, input, textarea, select, a, [contenteditable]")) {
            return;
        }

        // If dragHandleDisplay is "left", only initiate drag when targeting the drag handle
        if (dragHandleDisplay === "left" && !targetEl.closest(".pwb-drag-handle")) {
            return;
        }

        e.preventDefault();

        const cardEl = e.currentTarget;
        try {
            cardEl.setPointerCapture(e.pointerId);
        } catch {
            // Ignore capture error on older/restricted touch environments
        }

        const rect = cardEl.getBoundingClientRect();
        const pointerId = e.pointerId;
        const startX = e.clientX;
        const startY = e.clientY;
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        let dragInitiated = false;
        let ghostEl: HTMLDivElement | null = null;
        let lastTargetContainer: HTMLElement | null = null;

        // Mount current item parameters to the global dragging registry
        window.__pwbDragRegistry = {
            itemId: orderedItems[index].id,
            draggedItem: orderedItems[index].rawObject,
            sourceDragGroup: enableKanban ? dragGroup : undefined,
            sourceContainerId: containerId,
            sourceColumnValue: columnValue,
            onRemoveItem: enableKanban ? onRemoveItemExternal : undefined
        };

        const onPointerMove = (moveEvent: PointerEvent): void => {
            if (moveEvent.pointerId !== pointerId) {
                return;
            }

            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            // Trigger dragging threshold to prevent micro-drags during clicks
            if (!dragInitiated && Math.sqrt(deltaX * deltaX + deltaY * deltaY) > 5) {
                dragInitiated = true;
                setDraggingIndex(index);
                document.body.classList.add("pwb-drag-active-body");

                // Android support gentle haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate(15);
                }

                // Construct premium glassmorphic ghost card clone
                ghostEl = document.createElement("div");
                ghostEl.className = "pwb-pointer-drag-ghost";
                ghostEl.style.width = `${rect.width}px`;
                ghostEl.style.height = `${rect.height}px`;
                ghostEl.style.setProperty("--accent-color", accentColor);
                ghostEl.style.setProperty("--border-radius", borderRadius);

                // Clone only the visible inner custom content for flawless look
                const contentWrapper = cardEl.querySelector(".pwb-draggable-item-content");
                if (contentWrapper) {
                    ghostEl.innerHTML = contentWrapper.innerHTML;
                } else {
                    ghostEl.innerHTML = cardEl.innerHTML;
                }

                document.body.appendChild(ghostEl);
            }

            if (dragInitiated && ghostEl) {
                // Instantly sync coordinates with finger/mouse cursor
                ghostEl.style.left = `${moveEvent.clientX - offsetX}px`;
                ghostEl.style.top = `${moveEvent.clientY - offsetY}px`;

                // Premium Mobile Auto-Scrolling Engine
                const scrollSpeed = 10;
                const scrollThreshold = 70;
                const viewHeight = window.innerHeight;

                if (moveEvent.clientY < scrollThreshold) {
                    window.scrollBy(0, -scrollSpeed);
                } else if (moveEvent.clientY > viewHeight - scrollThreshold) {
                    window.scrollBy(0, scrollSpeed);
                }

                // Detect what elements sit directly under user finger coordinates
                const elementUnder = document.elementFromPoint(
                    moveEvent.clientX,
                    moveEvent.clientY
                ) as HTMLElement | null;
                if (!elementUnder) {
                    return;
                }

                const hoverContainer = elementUnder.closest(".pwb-drag-container") as HTMLElement | null;
                const hoverCard = elementUnder.closest(".pwb-draggable-row-item") as HTMLElement | null;

                // Handle pointer hover crossing container boundaries
                if (hoverContainer !== lastTargetContainer) {
                    if (lastTargetContainer) {
                        lastTargetContainer.dispatchEvent(new CustomEvent("pwb-drag-leave-container"));
                    }
                    lastTargetContainer = hoverContainer;
                }

                if (hoverContainer) {
                    let targetIdx = 0;
                    if (hoverCard) {
                        const idxAttr = hoverCard.getAttribute("data-index");
                        if (idxAttr !== null) {
                            targetIdx = parseInt(idxAttr, 10);
                        }
                    } else {
                        // Hovering empty container background: append at the end
                        const countAttr = hoverContainer.getAttribute("data-items-count");
                        if (countAttr !== null) {
                            targetIdx = parseInt(countAttr, 10);
                        }
                    }

                    // Dispatch custom cross-container event
                    hoverContainer.dispatchEvent(
                        new CustomEvent("pwb-drag-over-container", {
                            detail: {
                                itemId: orderedItems[index].id,
                                hoverIndex: targetIdx,
                                sourceContainerId: containerId
                            }
                        })
                    );
                }
            }
        };

        const onPointerUp = (upEvent: PointerEvent): void => {
            if (upEvent.pointerId !== pointerId) {
                return;
            }

            try {
                cardEl.releasePointerCapture(pointerId);
            } catch {
                // Ignore if capture was lost
            }

            // Cleanup document listeners
            document.removeEventListener("pointermove", onPointerMove);
            document.removeEventListener("pointerup", onPointerUp);
            document.removeEventListener("pointercancel", onPointerUp);

            document.body.classList.remove("pwb-drag-active-body");

            if (ghostEl) {
                ghostEl.remove();
                ghostEl = null;
            }

            if (lastTargetContainer) {
                lastTargetContainer.dispatchEvent(new CustomEvent("pwb-drag-leave-container"));
            }

            if (dragInitiated) {
                const registry = window.__pwbDragRegistry;
                if (registry && lastTargetContainer) {
                    const targetContainerId = lastTargetContainer.getAttribute("data-container-id");

                    // Resolve exact drop coordinate details
                    const pointEl = document.elementFromPoint(upEvent.clientX, upEvent.clientY) as HTMLElement | null;
                    let finalIndex = 0;
                    if (pointEl) {
                        const hoverContainer = pointEl.closest(".pwb-drag-container") as HTMLElement | null;
                        const hoverCard = pointEl.closest(".pwb-draggable-row-item") as HTMLElement | null;
                        if (hoverContainer) {
                            if (hoverCard) {
                                const idxAttr = hoverCard.getAttribute("data-index");
                                if (idxAttr !== null) {
                                    finalIndex = parseInt(idxAttr, 10);
                                }
                            } else {
                                const countAttr = hoverContainer.getAttribute("data-items-count");
                                if (countAttr !== null) {
                                    finalIndex = parseInt(countAttr, 10);
                                }
                            }
                        }
                    }

                    if (targetContainerId === containerId) {
                        // Drop in SAME Container: Reorder list
                        if (index !== finalIndex) {
                            const nextItems = [...orderedItems];
                            const [movedItem] = nextItems.splice(index, 1);
                            nextItems.splice(finalIndex, 0, movedItem);

                            setOrderedItems(nextItems);
                            onOrderChange(nextItems.map(item => item.id));
                        }
                    } else {
                        // Drop in EXTERNAL Container: Trigger Mendix Kanban drop persistence
                        const targetDragGroup = lastTargetContainer.getAttribute("data-drag-group") || undefined;
                        const targetEnableKanban = lastTargetContainer.getAttribute("data-enable-kanban") === "true";

                        if (targetEnableKanban && (!targetDragGroup || targetDragGroup === registry.sourceDragGroup)) {
                            if (onDropExternal) {
                                onDropExternal(registry.itemId, registry.sourceContainerId, finalIndex);
                            }
                        }
                    }
                }
            }

            setDraggingIndex(null);
            setDragOverIndex(null);
            window.__pwbDragRegistry = undefined;
        };

        document.addEventListener("pointermove", onPointerMove);
        document.addEventListener("pointerup", onPointerUp);
        document.addEventListener("pointercancel", onPointerUp);
    };

    return (
        <div
            ref={containerRef}
            data-container-id={containerId}
            data-drag-group={dragGroup}
            data-enable-kanban={String(enableKanban)}
            data-items-count={orderedItems.length}
            className={`pwb-drag-container pwb-direction-${layoutDirection} ${
                orderedItems.length === 0 ? "pwb-empty-container-dropzone" : ""
            }`}
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
                        data-index={idx}
                        onPointerDown={e => handlePointerDown(e, idx)}
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
