import { ReactElement, useState, useEffect, useRef, PointerEvent as ReactPointerEvent } from "react";
import { ObjectItem } from "mendix";

export interface DragItem {
    id: string;
    rawObject: ObjectItem;
}

export interface DragContainerProps {
    containerId: string;
    items: DragItem[];
    renderItem: (rawObject: ObjectItem) => ReactElement;
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
    themePreset: "default_rounded" | "modern_glass" | "minimalist_flat" | "neo_brutalist";
    darkModeBehavior: "auto" | "light" | "dark";
    itemPadding?: string;
    itemGap?: string;
}

interface DragRegistry {
    itemId: string;
    draggedItem: ObjectItem;
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

const getScrollParent = (node: HTMLElement | null): HTMLElement | null => {
    if (!node || node === document.body || node === document.documentElement) {
        return null;
    }
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;
    const isScrollableY = (overflowY === "auto" || overflowY === "scroll") && node.scrollHeight > node.clientHeight;
    const isScrollableX = (overflowX === "auto" || overflowX === "scroll") && node.scrollWidth > node.clientWidth;
    if (isScrollableY || isScrollableX) {
        return node;
    }
    return getScrollParent(node.parentElement);
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
    themePreset,
    darkModeBehavior,
    itemPadding,
    itemGap
}: DragContainerProps): ReactElement {
    const [orderedItems, setOrderedItems] = useState<DragItem[]>([]);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [wobblingItemId, setWobblingItemId] = useState<string | null>(null);
    const [keyboardGrabbedId, setKeyboardGrabbedId] = useState<string | null>(null);
    const [originalItemsBeforeKeyboardDrag, setOriginalItemsBeforeKeyboardDrag] = useState<DragItem[]>([]);
    const [announcement, setAnnouncement] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
        const item = orderedItems[index];
        const isGrabbed = keyboardGrabbedId === item.id;
        const itemTitle = e.currentTarget.innerText.split("\n")[0] || `Item ${index + 1}`;

        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            if (isGrabbed) {
                // Drop the item
                setKeyboardGrabbedId(null);
                setOriginalItemsBeforeKeyboardDrag([]);
                // Trigger save
                const currentOrderIds = orderedItems.map(it => it.id);
                const originalOrderIds = originalItemsBeforeKeyboardDrag.map(it => it.id);
                const orderChanged = currentOrderIds.some((id, idx) => id !== originalOrderIds[idx]);
                if (orderChanged) {
                    onOrderChange(currentOrderIds);
                    setAnnouncement(`Dropped ${itemTitle}. Order updated.`);
                } else {
                    setAnnouncement(`Dropped ${itemTitle}. Position unchanged.`);
                }
            } else {
                // Grab the item
                setKeyboardGrabbedId(item.id);
                setOriginalItemsBeforeKeyboardDrag([...orderedItems]);
                setAnnouncement(`Grabbed ${itemTitle}. Use Up or Down Arrow keys to reorder. Press Space or Enter to drop, or Escape to cancel.`);
            }
        } else if (e.key === "Escape") {
            if (isGrabbed) {
                e.preventDefault();
                // Cancel reordering and restore original state
                setOrderedItems(originalItemsBeforeKeyboardDrag);
                setKeyboardGrabbedId(null);
                const origIndex = originalItemsBeforeKeyboardDrag.findIndex(it => it.id === item.id);
                setAnnouncement(`Reordering canceled. ${itemTitle} returned to position ${origIndex + 1}.`);
                setOriginalItemsBeforeKeyboardDrag([]);
            }
        } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
            if (isGrabbed) {
                e.preventDefault();
                if (index < orderedItems.length - 1) {
                    const nextItems = [...orderedItems];
                    const temp = nextItems[index];
                    nextItems[index] = nextItems[index + 1];
                    nextItems[index + 1] = temp;
                    setOrderedItems(nextItems);
                    setAnnouncement(`Moved ${itemTitle} to position ${index + 2} of ${orderedItems.length}.`);
                    setTimeout(() => {
                        const nextEl = containerRef.current?.querySelector(`[data-index="${index + 1}"]`) as HTMLElement;
                        nextEl?.focus();
                    }, 0);
                }
            }
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
            if (isGrabbed) {
                e.preventDefault();
                if (index > 0) {
                    const nextItems = [...orderedItems];
                    const temp = nextItems[index];
                    nextItems[index] = nextItems[index - 1];
                    nextItems[index - 1] = temp;
                    setOrderedItems(nextItems);
                    setAnnouncement(`Moved ${itemTitle} to position ${index} of ${orderedItems.length}.`);
                    setTimeout(() => {
                        const prevEl = containerRef.current?.querySelector(`[data-index="${index - 1}"]`) as HTMLElement;
                        prevEl?.focus();
                    }, 0);
                }
            }
        }
    };

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
        const scrollParent = getScrollParent(containerRef.current);

        // Tracks original and current order states directly in closure for 100% async state safety
        const originalOrderIds = orderedItems.map(item => item.id);
        let currentOrderIds = [...originalOrderIds];
        let draggingIndexState = index;

        // Prevent default touch gestures (elastic scroll, pull refresh) on mobile
        const preventDefaultTouch = (touchEvent: TouchEvent): void => {
            if (dragInitiated) {
                touchEvent.preventDefault();
            }
        };
        document.addEventListener("touchmove", preventDefaultTouch, { passive: false });

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
                setDraggingIndex(draggingIndexState);
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

                // Initial scale pop for iOS tactile representation
                ghostEl.style.transform = "scale(0.97) rotate(0deg)";

                // Clone only the visible inner custom content for flawless look
                const contentWrapper = cardEl.querySelector(".pwb-draggable-item-content");
                if (contentWrapper) {
                    ghostEl.innerHTML = contentWrapper.innerHTML;
                } else {
                    ghostEl.innerHTML = cardEl.innerHTML;
                }

                document.body.appendChild(ghostEl);

                // Trigger spring animation transition using requestAnimationFrame
                requestAnimationFrame(() => {
                    if (ghostEl) {
                        ghostEl.style.transform = ""; // Let CSS class transform transition kick in!
                    }
                });
            }

            if (dragInitiated && ghostEl) {
                // Instantly sync coordinates with finger/mouse cursor
                ghostEl.style.left = `${moveEvent.clientX - offsetX}px`;
                ghostEl.style.top = `${moveEvent.clientY - offsetY}px`;

                // Premium Dynamic Mobile Auto-Scrolling Engine for nested Scroll Containers + Window Fallback
                const scrollThreshold = 75;
                let scrolled = false;

                if (scrollParent) {
                    const parentRect = scrollParent.getBoundingClientRect();
                    const parentTop = parentRect.top;
                    const parentBottom = parentRect.bottom;
                    const parentLeft = parentRect.left;
                    const parentRight = parentRect.right;
                    const clientY = moveEvent.clientY;
                    const clientX = moveEvent.clientX;

                    // Vertical scroll of parent container
                    if (clientY < parentTop + scrollThreshold && clientY > parentTop) {
                        const distance = clientY - parentTop;
                        const speed = Math.max(1, Math.min(25, Math.round((scrollThreshold - distance) * 0.4)));
                        scrollParent.scrollTop -= speed;
                        scrolled = true;
                    } else if (clientY > parentBottom - scrollThreshold && clientY < parentBottom) {
                        const distance = parentBottom - clientY;
                        const speed = Math.max(1, Math.min(25, Math.round((scrollThreshold - distance) * 0.4)));
                        scrollParent.scrollTop += speed;
                        scrolled = true;
                    }

                    // Horizontal scroll of parent container (if layoutDirection is horizontal)
                    if (layoutDirection === "horizontal") {
                        if (clientX < parentLeft + scrollThreshold && clientX > parentLeft) {
                            const distance = clientX - parentLeft;
                            const speed = Math.max(1, Math.min(25, Math.round((scrollThreshold - distance) * 0.4)));
                            scrollParent.scrollLeft -= speed;
                            scrolled = true;
                        } else if (clientX > parentRight - scrollThreshold && clientX < parentRight) {
                            const distance = parentRight - clientX;
                            const speed = Math.max(1, Math.min(25, Math.round((scrollThreshold - distance) * 0.4)));
                            scrollParent.scrollLeft += speed;
                            scrolled = true;
                        }
                    }
                }

                // Fallback to Window Scrolling if parent didn't scroll or no scroll parent exists
                if (!scrolled) {
                    const viewHeight = window.innerHeight;
                    const viewWidth = window.innerWidth;
                    const clientY = moveEvent.clientY;
                    const clientX = moveEvent.clientX;

                    if (clientY < scrollThreshold) {
                        const distance = Math.max(0, clientY);
                        const speed = Math.max(1, Math.min(25, Math.round((scrollThreshold - distance) * 0.4)));
                        window.scrollBy(0, -speed);
                    } else if (clientY > viewHeight - scrollThreshold) {
                        const distance = Math.max(0, viewHeight - clientY);
                        const speed = Math.max(1, Math.min(25, Math.round((scrollThreshold - distance) * 0.4)));
                        window.scrollBy(0, speed);
                    }

                    if (layoutDirection === "horizontal") {
                        if (clientX < scrollThreshold) {
                            const distance = Math.max(0, clientX);
                            const speed = Math.max(1, Math.min(25, Math.round((scrollThreshold - distance) * 0.4)));
                            window.scrollBy(-speed, 0);
                        } else if (clientX > viewWidth - scrollThreshold) {
                            const distance = Math.max(0, viewWidth - clientX);
                            const speed = Math.max(1, Math.min(25, Math.round((scrollThreshold - distance) * 0.4)));
                            window.scrollBy(speed, 0);
                        }
                    }
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

                    // A. Same Container Dropzone: Transient Real-time Shifting!
                    if (hoverContainer === containerRef.current) {
                        if (hoverCard && targetIdx !== draggingIndexState) {
                            // Swap array element positions in local React visual state immediately
                            setOrderedItems(prevItems => {
                                const nextItems = [...prevItems];
                                const [movedItem] = nextItems.splice(draggingIndexState, 1);
                                nextItems.splice(targetIdx, 0, movedItem);
                                currentOrderIds = nextItems.map(item => item.id);
                                return nextItems;
                            });

                            setDraggingIndex(targetIdx);
                            draggingIndexState = targetIdx; // Update closure variable to keep track!
                        }
                    } else {
                        // B. External Container Dropzone: Dispatch custom cross-container hover event
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
            document.removeEventListener("touchmove", preventDefaultTouch);

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
                if (registry) {
                    let orderChanged = false;

                    if (lastTargetContainer) {
                        const targetContainerId = lastTargetContainer.getAttribute("data-container-id");

                        // Resolve exact drop coordinate details
                        const pointEl = document.elementFromPoint(
                            upEvent.clientX,
                            upEvent.clientY
                        ) as HTMLElement | null;
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
                            // Drop in SAME Container:
                            // Since orderedItems visual positions are already updated in real-time in Phase 1,
                            // we compare final visual order with the starting order to trigger Mendix sync exactly once.
                            orderChanged = currentOrderIds.some((id, idx) => id !== originalOrderIds[idx]);
                            if (orderChanged) {
                                onOrderChange(currentOrderIds);
                            }
                        } else {
                            // Drop in EXTERNAL Container: Trigger Mendix Kanban drop persistence
                            const targetDragGroup = lastTargetContainer.getAttribute("data-drag-group") || undefined;
                            const targetEnableKanban =
                                lastTargetContainer.getAttribute("data-enable-kanban") === "true";

                            if (
                                targetEnableKanban &&
                                (!targetDragGroup || targetDragGroup === registry.sourceDragGroup)
                            ) {
                                if (onDropExternal) {
                                    onDropExternal(registry.itemId, registry.sourceContainerId, finalIndex);
                                    orderChanged = true;
                                }
                            }
                        }
                    }

                    if (!orderChanged) {
                        // Drop canceled or dropped in same slot: trigger wobble spring shake
                        setWobblingItemId(registry.itemId);
                        setTimeout(() => setWobblingItemId(null), 400);
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
            className={`pwb-drag-container pwb-direction-${layoutDirection} ${themeClass} ${modeClass} ${
                orderedItems.length === 0 ? "pwb-empty-container-dropzone" : ""
            }`}
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

            {orderedItems.map((item, idx) => {
                const isDragging = idx === draggingIndex;
                const isDragOver = idx === dragOverIndex;
                const isGrabbed = item.id === keyboardGrabbedId;

                return (
                    <div
                        key={item.id}
                        data-index={idx}
                        tabIndex={0}
                        role="listitem"
                        aria-grabbed={isDragging || isGrabbed}
                        aria-roledescription="Draggable row card. Press Spacebar or Enter to grab, then use Arrow Up or Arrow Down keys to reorder. Press Escape to cancel."
                        onPointerDown={e => handlePointerDown(e, idx)}
                        onKeyDown={e => handleKeyDown(e, idx)}
                        className={`pwb-draggable-row-item ${isDragging ? "pwb-dragging" : ""} ${
                            isDragOver ? "pwb-drag-over" : ""
                        } ${isGrabbed ? "pwb-keyboard-grabbed" : ""} ${wobblingItemId === item.id ? "pwb-wobble-shake" : ""}`}
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
