import { useState, RefObject, PointerEvent as ReactPointerEvent } from "react";
import { GUID } from "mendix";
import Big from "big.js";
import { DragItem } from "../components/DragContainer";

interface UsePointerDragProps {
    readOnlyMode: boolean;
    orderedItems: DragItem[];
    setOrderedItems: (items: DragItem[] | ((prev: DragItem[]) => DragItem[])) => void;
    onOrderChange: (newOrderIds: GUID[]) => void;
    accentColor: string;
    borderRadius: string;
    layoutDirection: "vertical" | "horizontal";
    dragHandleDisplay: "left" | "hide";
    enableKanban: boolean;
    dragGroup?: string;
    columnValue?: string;
    onDropExternal?: (draggedItemId: GUID, sourceContainerId: string, targetIndex: number) => void;
    onRemoveItemExternal?: (itemId: GUID) => void;
    containerId: string;
    containerRef: RefObject<HTMLDivElement | null>;
    dragGhostScale?: Big;
    dragGhostOpacity?: Big;
    dragGhostShadow?: string;
    enable2DGrid: boolean;
    vibrateDragStart?: number;
    vibrateDrop?: number;
    vibrateError?: number;
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

// Safeguard vibration for non-supported browsers (Safari/iOS)
const triggerVibrate = (pattern: number | number[]): void => {
    if (typeof window !== "undefined" && window.navigator && typeof window.navigator.vibrate === "function") {
        try {
            if (typeof pattern === "number" && pattern <= 0) {
                return;
            }
            if (Array.isArray(pattern) && (pattern.length === 0 || pattern[0] <= 0)) {
                return;
            }
            window.navigator.vibrate(pattern);
        } catch {
            // Ignore error
        }
    }
};

interface UsePointerDragResult {
    draggingIndex: number | null;
    dragOverIndex: number | null;
    dropDenied: boolean;
    wobblingItemId: GUID | null;
    setDraggingIndex: (idx: number | null) => void;
    setDragOverIndex: (idx: number | null) => void;
    setDropDenied: (denied: boolean) => void;
    setWobblingItemId: (id: GUID | null) => void;
    handlePointerDown: (e: ReactPointerEvent<HTMLDivElement>, index: number) => void;
}

export function usePointerDrag({
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
    onDropExternal: _onDropExternal,
    onRemoveItemExternal,
    containerId,
    containerRef,
    dragGhostScale,
    dragGhostOpacity,
    dragGhostShadow,
    enable2DGrid,
    vibrateDragStart,
    vibrateDrop,
    vibrateError
}: UsePointerDragProps): UsePointerDragResult {
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [dropDenied, setDropDenied] = useState(false);
    const [wobblingItemId, setWobblingItemId] = useState<GUID | null>(null);

    const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>, index: number): void => {
        if (readOnlyMode) {
            return;
        }
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

        // Cache all lane boundaries on drag start to prevent layout thrashing from document.elementFromPoint
        const cachedLanes: Array<{
            element: HTMLElement;
            rect: DOMRect;
        }> = [];
        try {
            const laneElements = Array.from(document.querySelectorAll(".pwb-drag-container")) as HTMLElement[];
            laneElements.forEach(lane => {
                cachedLanes.push({
                    element: lane,
                    rect: lane.getBoundingClientRect()
                });
            });
        } catch {
            // Fallback
        }

        let dragInitiated = false;
        let ghostEl: HTMLDivElement | null = null;
        let lastTargetContainer: HTMLElement | null = null;

        const scrollParent = getScrollParent(containerRef.current);
        const initialScrollTop = scrollParent ? scrollParent.scrollTop : 0;
        const initialScrollLeft = scrollParent ? scrollParent.scrollLeft : 0;
        const initialWindowScrollY = window.scrollY;
        const initialWindowScrollX = window.scrollX;

        let lastX = startX;
        let tiltResetTimeout: ReturnType<typeof setTimeout> | null = null;
        let reorderScheduled = false;

        // Tracks original and current order states directly in closure for 100% async state safety
        const originalOrderIds = orderedItems.map(item => item.id);
        const activeItemsState = [...orderedItems];
        let currentOrderIds = [...originalOrderIds];
        let draggingIndexState = index;

        // Prevent default touch gestures (elastic scroll, pull refresh) on mobile
        const preventDefaultTouch = (touchEvent: TouchEvent): void => {
            if (dragInitiated) {
                touchEvent.preventDefault();
            }
        };
        document.addEventListener("touchmove", preventDefaultTouch, { passive: false });

        triggerVibrate(vibrateDragStart ?? 15);

        // Mount current item parameters to the global dragging registry
        window.__pwbDragRegistry = {
            itemId: orderedItems[index].id,
            draggedItem: orderedItems[index].rawObject,
            sourceDragGroup: enableKanban ? dragGroup : undefined,
            sourceContainerId: containerId,
            sourceColumnValue: columnValue,
            onRemoveItem: enableKanban ? onRemoveItemExternal : undefined,
            draggedSize: { width: rect.width, height: rect.height }
        };

        let cleanupDone = false;
        const cleanup = (): void => {
            if (cleanupDone) {
                return;
            }
            cleanupDone = true;

            if (tiltResetTimeout) {
                clearTimeout(tiltResetTimeout);
                tiltResetTimeout = null;
            }

            reorderScheduled = false;

            document.body.style.cursor = "";
            document.removeEventListener("pointermove", onPointerMove);
            document.removeEventListener("pointerup", onPointerUp);
            document.removeEventListener("pointercancel", onPointerCancel);
            cardEl.removeEventListener("lostpointercapture", onLostPointerCapture);
            document.removeEventListener("touchmove", preventDefaultTouch);

            document.body.classList.remove("pwb-drag-active-body");

            if (ghostEl) {
                ghostEl.remove();
                ghostEl = null;
            }

            if (lastTargetContainer) {
                lastTargetContainer.dispatchEvent(new CustomEvent("pwb-drag-leave-container"));
            }

            setDraggingIndex(null);
            setDragOverIndex(null);
            window.__pwbDragRegistry = undefined;
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

                triggerVibrate(vibrateDragStart ?? 15);

                // Construct premium glassmorphic ghost card clone
                ghostEl = document.createElement("div");
                ghostEl.className = "pwb-pointer-drag-ghost";
                ghostEl.style.width = `${rect.width}px`;
                ghostEl.style.height = `${rect.height}px`;
                ghostEl.style.setProperty("--accent-color", accentColor);
                ghostEl.style.setProperty("--border-radius", borderRadius);
                if (dragGhostScale !== undefined && dragGhostScale !== null) {
                    ghostEl.style.setProperty("--pwb-ghost-scale", String(dragGhostScale));
                }
                if (dragGhostOpacity !== undefined && dragGhostOpacity !== null) {
                    ghostEl.style.setProperty("--pwb-ghost-opacity", String(dragGhostOpacity));
                }
                if (dragGhostShadow && dragGhostShadow.trim() !== "") {
                    ghostEl.style.setProperty("--pwb-ghost-shadow", dragGhostShadow.trim());
                }

                // Fixed baseline coords so translate3d operates purely on viewport coordinates
                ghostEl.style.left = "0px";
                ghostEl.style.top = "0px";

                // Initial scale pop for iOS tactile representation
                ghostEl.style.transform = `translate3d(${startX - offsetX}px, ${startY - offsetY}px, 0)`;
                ghostEl.style.scale = "0.97";
                ghostEl.style.rotate = "0deg";

                // Clone only the visible inner custom content for flawless look
                const contentWrapper = cardEl.querySelector(".pwb-draggable-item-content");
                const sourceNode = contentWrapper || cardEl;
                const clonedNode = sourceNode.cloneNode(true) as HTMLElement;

                // Strip ID attributes to prevent duplicate DOM IDs during drag
                if (clonedNode.id) {
                    clonedNode.removeAttribute("id");
                }
                clonedNode.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));

                // Copy canvas elements content if any
                const sourceCanvases = Array.from(sourceNode.querySelectorAll("canvas"));
                if (sourceCanvases.length > 0) {
                    const clonedCanvases = Array.from(clonedNode.querySelectorAll("canvas"));
                    sourceCanvases.forEach((srcCanvas, i) => {
                        const destCanvas = clonedCanvases[i];
                        if (destCanvas) {
                            const destCtx = destCanvas.getContext("2d");
                            if (destCtx) {
                                try {
                                    destCtx.drawImage(srcCanvas, 0, 0);
                                } catch {
                                    // Ignore security/drawing issues
                                }
                            }
                        }
                    });
                }

                // Copy user input values if any
                const sourceInputs = Array.from(
                    sourceNode.querySelectorAll("input, textarea, select")
                ) as HTMLInputElement[];
                if (sourceInputs.length > 0) {
                    const clonedInputs = Array.from(
                        clonedNode.querySelectorAll("input, textarea, select")
                    ) as HTMLInputElement[];
                    sourceInputs.forEach((srcInput, i) => {
                        const destInput = clonedInputs[i];
                        if (destInput) {
                            destInput.value = srcInput.value;
                            if (srcInput.type === "checkbox" || srcInput.type === "radio") {
                                destInput.checked = srcInput.checked;
                            }
                        }
                    });
                }

                ghostEl.appendChild(clonedNode);
                document.body.appendChild(ghostEl);

                // Trigger spring animation transition using requestAnimationFrame
                requestAnimationFrame(() => {
                    if (ghostEl) {
                        ghostEl.style.scale = ""; // Let CSS class scale transition kick in!
                        ghostEl.style.rotate = ""; // Let CSS class rotate transition kick in!
                    }
                });
            }

            if (dragInitiated && ghostEl) {
                const currentX = moveEvent.clientX;
                const velocityX = currentX - lastX;
                lastX = currentX;

                // Instantly sync coordinates with finger/mouse cursor using GPU-accelerated translate3d
                ghostEl.style.transform = `translate3d(${currentX - offsetX}px, ${moveEvent.clientY - offsetY}px, 0)`;

                // Dynamic tilt rotation based on velocityX
                const tiltAngle = Math.max(-6, Math.min(6, velocityX * 0.25));
                ghostEl.style.rotate = `${tiltAngle}deg`;

                if (tiltResetTimeout) {
                    clearTimeout(tiltResetTimeout);
                }
                tiltResetTimeout = setTimeout(() => {
                    if (ghostEl) {
                        ghostEl.style.rotate = "";
                    }
                }, 100);

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

                // Determine hoverContainer using cached lane bounds and current scroll deltas
                let hoverContainer: HTMLElement | null = null;
                const currentScrollTop = scrollParent ? scrollParent.scrollTop : 0;
                const currentScrollLeft = scrollParent ? scrollParent.scrollLeft : 0;
                const scrollDeltaY = currentScrollTop - initialScrollTop;
                const scrollDeltaX = currentScrollLeft - initialScrollLeft;

                const currentWindowScrollY = window.scrollY;
                const currentWindowScrollX = window.scrollX;
                const windowScrollDeltaY = currentWindowScrollY - initialWindowScrollY;
                const windowScrollDeltaX = currentWindowScrollX - initialWindowScrollX;

                for (const lane of cachedLanes) {
                    const r = lane.rect;
                    let left = r.left - windowScrollDeltaX;
                    let right = r.right - windowScrollDeltaX;
                    let top = r.top - windowScrollDeltaY;
                    let bottom = r.bottom - windowScrollDeltaY;

                    if (scrollParent && scrollParent.contains(lane.element)) {
                        left -= scrollDeltaX;
                        right -= scrollDeltaX;
                        top -= scrollDeltaY;
                        bottom -= scrollDeltaY;
                    }

                    if (
                        moveEvent.clientX >= left &&
                        moveEvent.clientX <= right &&
                        moveEvent.clientY >= top &&
                        moveEvent.clientY <= bottom
                    ) {
                        hoverContainer = lane.element;
                        break;
                    }
                }

                let hoverCard: HTMLElement | null = null;
                if (hoverContainer) {
                    const cards = Array.from(
                        hoverContainer.querySelectorAll(".pwb-draggable-row-item:not(.pwb-pointer-drag-ghost)")
                    ) as HTMLElement[];

                    if (enable2DGrid) {
                        let closestCard: HTMLElement | null = null;
                        let minDistance = Infinity;
                        cards.forEach(card => {
                            const cardRect = card.getBoundingClientRect();
                            const centerX = cardRect.left + cardRect.width / 2;
                            const centerY = cardRect.top + cardRect.height / 2;
                            const dist = Math.sqrt(
                                Math.pow(moveEvent.clientX - centerX, 2) + Math.pow(moveEvent.clientY - centerY, 2)
                            );
                            if (dist < minDistance) {
                                minDistance = dist;
                                closestCard = card;
                            }
                        });
                        if (closestCard) {
                            hoverCard = closestCard;
                        }
                    } else {
                        for (const card of cards) {
                            const cardRect = card.getBoundingClientRect();
                            if (
                                moveEvent.clientX >= cardRect.left &&
                                moveEvent.clientX <= cardRect.right &&
                                moveEvent.clientY >= cardRect.top &&
                                moveEvent.clientY <= cardRect.bottom
                            ) {
                                hoverCard = card;
                                break;
                            }
                        }
                    }
                }

                // Handle pointer hover crossing container boundaries
                if (hoverContainer !== lastTargetContainer) {
                    if (lastTargetContainer) {
                        lastTargetContainer.dispatchEvent(new CustomEvent("pwb-drag-leave-container"));
                    }
                    lastTargetContainer = hoverContainer;
                }

                if (hoverContainer) {
                    const isDenied = hoverContainer.getAttribute("data-drop-denied") === "true";
                    if (isDenied) {
                        document.body.style.cursor = "not-allowed";
                        if (ghostEl) {
                            ghostEl.style.borderColor = "#ef4444";
                            ghostEl.style.boxShadow = "0 20px 40px -10px rgba(239, 68, 68, 0.3)";
                        }
                    } else {
                        document.body.style.cursor = "grabbing";
                        if (ghostEl) {
                            ghostEl.style.borderColor = accentColor;
                            ghostEl.style.boxShadow = "";
                        }
                    }

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
                        if (hoverCard && targetIdx !== draggingIndexState && !reorderScheduled) {
                            // Midpoint Thresholding: Swap only when pointer crosses the midpoint of the target item card
                            const hoverCardRect = hoverCard.getBoundingClientRect();
                            let isThresholdPassed = false;

                            if (layoutDirection === "horizontal") {
                                const midX = hoverCardRect.left + hoverCardRect.width / 2;
                                if (targetIdx > draggingIndexState) {
                                    // Dragging right
                                    isThresholdPassed = moveEvent.clientX > midX;
                                } else {
                                    // Dragging left
                                    isThresholdPassed = moveEvent.clientX < midX;
                                }
                            } else {
                                const midY = hoverCardRect.top + hoverCardRect.height / 2;
                                if (targetIdx > draggingIndexState) {
                                    // Dragging down
                                    isThresholdPassed = moveEvent.clientY > midY;
                                } else {
                                    // Dragging up
                                    isThresholdPassed = moveEvent.clientY < midY;
                                }
                            }

                            if (isThresholdPassed) {
                                reorderScheduled = true;

                                // Swap array element positions synchronously in mutable closure state
                                const [movedItem] = activeItemsState.splice(draggingIndexState, 1);
                                activeItemsState.splice(targetIdx, 0, movedItem);
                                currentOrderIds = activeItemsState.map(item => item.id);
                                draggingIndexState = targetIdx; // Update closure variable to keep track!

                                // Schedule React re-render visually at next frame
                                requestAnimationFrame(() => {
                                    setOrderedItems([...activeItemsState]);
                                    setDraggingIndex(targetIdx);
                                    reorderScheduled = false;
                                });
                            }
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

            if (dragInitiated) {
                const registry = window.__pwbDragRegistry;
                if (registry) {
                    let orderChanged = false;

                    if (lastTargetContainer) {
                        const targetContainerId = lastTargetContainer.getAttribute("data-container-id");

                        // Resolve exact drop coordinate details using the same cached bounds logic
                        let finalIndex = 0;
                        const cards = Array.from(
                            lastTargetContainer.querySelectorAll(".pwb-draggable-row-item:not(.pwb-pointer-drag-ghost)")
                        ) as HTMLElement[];

                        let hoverCard: HTMLElement | null = null;
                        if (enable2DGrid) {
                            let closestCard: HTMLElement | null = null;
                            let minDistance = Infinity;
                            cards.forEach(card => {
                                const cardRect = card.getBoundingClientRect();
                                const centerX = cardRect.left + cardRect.width / 2;
                                const centerY = cardRect.top + cardRect.height / 2;
                                const dist = Math.sqrt(
                                    Math.pow(upEvent.clientX - centerX, 2) + Math.pow(upEvent.clientY - centerY, 2)
                                );
                                if (dist < minDistance) {
                                    minDistance = dist;
                                    closestCard = card;
                                }
                            });
                            if (closestCard) {
                                hoverCard = closestCard;
                            }
                        } else {
                            for (const card of cards) {
                                const cardRect = card.getBoundingClientRect();
                                if (
                                    upEvent.clientX >= cardRect.left &&
                                    upEvent.clientX <= cardRect.right &&
                                    upEvent.clientY >= cardRect.top &&
                                    upEvent.clientY <= cardRect.bottom
                                ) {
                                    hoverCard = card;
                                    break;
                                }
                            }
                        }

                        if (hoverCard) {
                            const idxAttr = hoverCard.getAttribute("data-index");
                            if (idxAttr !== null) {
                                finalIndex = parseInt(idxAttr, 10);
                            }
                        } else {
                            const countAttr = lastTargetContainer.getAttribute("data-items-count");
                            if (countAttr !== null) {
                                finalIndex = parseInt(countAttr, 10);
                            }
                        }

                        if (targetContainerId === containerId) {
                            // Drop in SAME Container:
                            orderChanged = currentOrderIds.some((id, idx) => id !== originalOrderIds[idx]);
                            if (orderChanged) {
                                triggerVibrate(vibrateDrop ?? 10);
                                onOrderChange(currentOrderIds);
                            }
                        } else {
                            // Drop in EXTERNAL Container: Trigger Mendix Kanban drop persistence
                            const targetDragGroup = lastTargetContainer.getAttribute("data-drag-group") || undefined;
                            const targetEnableKanban =
                                lastTargetContainer.getAttribute("data-enable-kanban") === "true";
                            const isDenied = lastTargetContainer.getAttribute("data-drop-denied") === "true";

                            if (
                                targetEnableKanban &&
                                !isDenied &&
                                (!targetDragGroup || targetDragGroup === registry.sourceDragGroup)
                            ) {
                                triggerVibrate(vibrateDrop ?? 10);
                                lastTargetContainer.dispatchEvent(
                                    new CustomEvent("pwb-pointer-drop-item", {
                                        detail: {
                                            itemId: registry.itemId,
                                            sourceContainerId: registry.sourceContainerId,
                                            targetIndex: finalIndex
                                        }
                                    })
                                );
                                orderChanged = true;
                            }
                        }
                    }

                    if (!orderChanged) {
                        // Drop canceled or dropped in same slot: trigger wobble spring shake
                        setWobblingItemId(registry.itemId);
                        const errorVibe = vibrateError ?? 30;
                        if (errorVibe > 0) {
                            triggerVibrate([errorVibe, 50, errorVibe]);
                        }
                        setTimeout(() => setWobblingItemId(null), 400);
                    }
                }
            }

            try {
                cardEl.releasePointerCapture(pointerId);
            } catch {
                cleanup();
            }
        };

        const onPointerCancel = (cancelEvent: PointerEvent): void => {
            if (cancelEvent.pointerId !== pointerId) {
                return;
            }
            try {
                cardEl.releasePointerCapture(pointerId);
            } catch {
                cleanup();
            }
        };

        const onLostPointerCapture = (): void => {
            cleanup();
        };

        document.addEventListener("pointermove", onPointerMove);
        document.addEventListener("pointerup", onPointerUp);
        document.addEventListener("pointercancel", onPointerCancel);
        cardEl.addEventListener("lostpointercapture", onLostPointerCapture);
    };

    return {
        draggingIndex,
        dragOverIndex,
        dropDenied,
        wobblingItemId,
        setDraggingIndex,
        setDragOverIndex,
        setDropDenied,
        setWobblingItemId,
        handlePointerDown
    };
}
