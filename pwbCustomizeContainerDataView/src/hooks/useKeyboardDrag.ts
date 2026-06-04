import { useState, KeyboardEvent, RefObject } from "react";
import { GUID } from "mendix";
import { DragItem } from "../components/DragContainer";

interface UseKeyboardDragProps {
    readOnlyMode: boolean;
    orderedItems: DragItem[];
    setOrderedItems: (items: DragItem[]) => void;
    onOrderChange: (newOrderIds: GUID[]) => void;
    enableKanban: boolean;
    dragGroup?: string;
    columnValue?: string;
    onRemoveItemExternal?: (itemId: GUID) => void;
    containerId: string;
    containerRef: RefObject<HTMLDivElement | null>;
}

interface UseKeyboardDragResult {
    keyboardGrabbedId: GUID | null;
    setKeyboardGrabbedId: (id: GUID | null) => void;
    originalItemsBeforeKeyboardDrag: DragItem[];
    setOriginalItemsBeforeKeyboardDrag: (items: DragItem[]) => void;
    announcement: string;
    setAnnouncement: (announcement: string) => void;
    handleKeyDown: (e: KeyboardEvent<HTMLDivElement>, index: number) => void;
}

export function useKeyboardDrag({
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
}: UseKeyboardDragProps): UseKeyboardDragResult {
    const [keyboardGrabbedId, setKeyboardGrabbedId] = useState<GUID | null>(null);
    const [originalItemsBeforeKeyboardDrag, setOriginalItemsBeforeKeyboardDrag] = useState<DragItem[]>([]);
    const [announcement, setAnnouncement] = useState("");

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number): void => {
        if (readOnlyMode) {
            return;
        }
        const item = orderedItems[index];
        if (!item) {
            return;
        }
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
                setAnnouncement(
                    `Grabbed ${itemTitle}. Use Up or Down Arrow keys to reorder. Press Space or Enter to drop, or Escape to cancel.`
                );
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
        } else if (e.key === "ArrowDown" || (e.key === "ArrowRight" && !(enableKanban && dragGroup))) {
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
                        const nextEl = containerRef.current?.querySelector(
                            `[data-index="${index + 1}"]`
                        ) as HTMLElement;
                        nextEl?.focus();
                    }, 0);
                }
            }
        } else if (e.key === "ArrowUp" || (e.key === "ArrowLeft" && !(enableKanban && dragGroup))) {
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
                        const prevEl = containerRef.current?.querySelector(
                            `[data-index="${index - 1}"]`
                        ) as HTMLElement;
                        prevEl?.focus();
                    }, 0);
                }
            }
        } else if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && enableKanban && dragGroup) {
            if (isGrabbed) {
                e.preventDefault();
                const groupContainers = Array.from(
                    document.querySelectorAll(`.pwb-drag-container[data-drag-group="${dragGroup}"]`)
                ) as HTMLElement[];
                const currentIdx = groupContainers.indexOf(containerRef.current!);
                if (currentIdx !== -1) {
                    const targetIdx = e.key === "ArrowRight" ? currentIdx + 1 : currentIdx - 1;
                    if (targetIdx >= 0 && targetIdx < groupContainers.length) {
                        const targetContainer = groupContainers[targetIdx];
                        const isDenied = targetContainer.getAttribute("data-drop-denied") === "true";
                        if (isDenied) {
                            setAnnouncement(`Cannot move ${itemTitle} to this column: drop is not allowed.`);
                            return;
                        }

                        // Dispatch custom event to target container
                        const accepted = targetContainer.dispatchEvent(
                            new CustomEvent("pwb-keyboard-accept-item", {
                                detail: {
                                    item,
                                    sourceContainerId: containerId,
                                    sourceIndex: index,
                                    sourceColumnValue: columnValue,
                                    onRemoveItemExternal
                                },
                                cancelable: true
                            })
                        );

                        if (accepted) {
                            // Remove item visually from source container
                            setOrderedItems(orderedItems.filter(it => it.id !== item.id));
                            setKeyboardGrabbedId(null);
                        }
                    }
                }
            }
        }
    };

    return {
        keyboardGrabbedId,
        setKeyboardGrabbedId,
        originalItemsBeforeKeyboardDrag,
        setOriginalItemsBeforeKeyboardDrag,
        announcement,
        setAnnouncement,
        handleKeyDown
    };
}
