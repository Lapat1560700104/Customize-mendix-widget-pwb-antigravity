import {
    ReactElement,
    ReactNode,
    useState,
    useEffect,
    useRef,
    useMemo,
    useId,
    KeyboardEvent as ReactKeyboardEvent,
    UIEvent
} from "react";

export interface ComboBoxOption {
    id: string;
    label: string;
    subtitle?: string;
    groupName?: string;
    colorCode?: string;
    imageUrl?: string;
    selectedLabel?: string;
    rawObject: any;
}

export interface ComboBoxProps {
    options: ComboBoxOption[];
    selectedIds: string[];
    selectionMode: "single" | "multi";
    singleSelectStyle?: "text" | "pill" | "rich";
    showSelectedAvatar?: boolean;
    tagStyle?: "pill" | "avatar";
    onSelect: (id: string) => void;
    onRemove: (id: string) => void;
    onClear: () => void;
    isLoading: boolean;
    placeholder: string;
    accentColor: string;
    searchHighlightColor?: string;
    borderRadius: string;
    bgBlur: string;
    popoverBg: string;
    maxDropdownHeight: string;
    dropdownLayout?: "list" | "grid";
    optionAvatarShape?: "circle" | "rounded" | "square";
    showOptionCheckbox?: boolean;
    highlightColorMode?: "accent" | "optionColor";
    searchDebounce?: number;
    maxVisibleTags?: number;
    showSelectAll?: boolean;
    selectAllText?: string;
    deselectAllText?: string;
    onCreateOption?: (text: string) => void;
    hasCreateAction?: boolean;
    onCreateText?: string;
    noOptionsMessage: string;
    loadingMessage: string;
    clearButtonTitle: string;
    readOnly: boolean;
    required: boolean;
    hasError?: boolean;
    errorText?: string;
    showOptionAvatar?: boolean;
    enableGrouping?: boolean;
    renderCustomItem?: (item: any) => ReactNode;
    searchMethod?: "contains" | "startsWith" | "endsWith" | "equals" | "fuzzy";
    searchCaseSensitive?: boolean;
    maxSearchResults?: number;
    onEnter?: () => void;
    onLeave?: () => void;
    onFilterChange?: (text: string) => void;
    /** [Secret Feature] Weighted Search Ranking — sorts results by match tier quality */
    enableWeightedSearch?: boolean;
    /** [Secret Feature] Infinite Scroll — calls this callback when user nears the bottom of dropdown */
    onLoadMore?: () => void;
    /** [Secret Feature] Client-Side LRU Cache — caches last 5 search results for instant re-query */
    enableSearchCache?: boolean;
}

const normalizeText = (str: string): string => {
    if (!str) {
        return "";
    }
    return (
        str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            // Thai vowels above/below and tone marks:
            // \u0e31 (Mai Han-Akat), \u0e34-\u0e3a (Sara I, Ii, Ue, Uee, U, Uu, Phinthu), \u0e47-\u0e4e (Mai Tai-Khu, tone marks, Karan)
            .replace(/[\u0e31\u0e34-\u0e3a\u0e47-\u0e4e]/g, "")
            .toLowerCase()
    );
};

const EmptySearchIllustration = (): ReactElement => (
    <svg className="pwb-combobox-empty-svg" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Glow effect */}
        <circle cx="60" cy="60" r="30" fill="var(--accent-glow)" opacity="0.5" />

        {/* Sleek dashboard card grid */}
        <rect x="35" y="35" width="50" height="6" rx="3" fill="var(--slate-200)" />
        <rect x="35" y="47" width="35" height="6" rx="3" fill="var(--slate-200)" opacity="0.6" />
        <rect x="35" y="59" width="42" height="6" rx="3" fill="var(--slate-200)" opacity="0.4" />

        {/* Floating Glassmorphic Magnifier */}
        <g className="pwb-floating-magnifier">
            <circle
                cx="70"
                cy="70"
                r="18"
                stroke="var(--accent-color)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="rgba(255,255,255,0.75)"
            />
            <line
                x1="83"
                y1="83"
                x2="98"
                y2="98"
                stroke="var(--accent-color)"
                strokeWidth="3.5"
                strokeLinecap="round"
            />
            <circle cx="66" cy="66" r="6" fill="#fff" opacity="0.5" />
        </g>

        {/* Tiny stars/particles */}
        <circle cx="28" cy="28" r="2.5" fill="var(--accent-color)" opacity="0.6" className="pwb-particle-star-1" />
        <circle cx="95" cy="40" r="1.5" fill="var(--accent-color)" opacity="0.4" className="pwb-particle-star-2" />
        <circle cx="85" cy="20" r="2" fill="var(--accent-color)" opacity="0.7" className="pwb-particle-star-3" />
    </svg>
);

// ─── LRU Cache Helper (5-entry Map-based) ────────────────────────────────────
const LRU_CAPACITY = 5;

interface LRUCache<K, V> {
    get: (key: K) => V | undefined;
    set: (key: K, value: V) => void;
    clear: () => void;
}

function createLRUCache<K, V>(capacity: number): LRUCache<K, V> {
    const cache = new Map<K, V>();
    return {
        get(key: K): V | undefined {
            if (!cache.has(key)) {
                return undefined;
            }
            // Refresh entry — move to end (most recently used)
            const val = cache.get(key)!;
            cache.delete(key);
            cache.set(key, val);
            return val;
        },
        set(key: K, value: V): void {
            if (cache.has(key)) {
                cache.delete(key);
            } else if (cache.size >= capacity) {
                // Evict least recently used (first key in Map iteration order)
                const lruKey = cache.keys().next().value;
                if (lruKey !== undefined) {
                    cache.delete(lruKey);
                }
            }
            cache.set(key, value);
        },
        clear(): void {
            cache.clear();
        }
    };
}

// ─── Weighted Scoring ────────────────────────────────────────────────────────
const SCORE_EXACT = 1000;
const SCORE_STARTS_WITH = 800;
const SCORE_WORD_START = 600;
const SCORE_CONTAINS = 400;
const SCORE_FUZZY = 200;
const SCORE_NO_MATCH = -1;

function computeMatchScore(text: string, query: string): number {
    if (!query) {
        return SCORE_CONTAINS; // No filter → treat all as "contains" tier
    }
    if (text === query) {
        return SCORE_EXACT;
    }
    if (text.startsWith(query)) {
        return SCORE_STARTS_WITH;
    }
    // Word-start: any word within text begins with query
    if (text.split(/[\s\-_]+/).some(word => word.startsWith(query))) {
        return SCORE_WORD_START;
    }
    if (text.includes(query)) {
        return SCORE_CONTAINS;
    }
    // Fuzzy check
    let tIdx = 0;
    let qIdx = 0;
    while (tIdx < text.length && qIdx < query.length) {
        if (text[tIdx] === query[qIdx]) {
            qIdx++;
        }
        tIdx++;
    }
    if (qIdx === query.length) {
        return SCORE_FUZZY;
    }
    return SCORE_NO_MATCH;
}

export function ComboBox({
    options,
    selectedIds,
    selectionMode,
    singleSelectStyle = "text",
    showSelectedAvatar = true,
    tagStyle = "pill",
    onSelect,
    onRemove,
    onClear,
    isLoading,
    placeholder,
    accentColor,
    searchHighlightColor,
    borderRadius,
    bgBlur,
    popoverBg,
    maxDropdownHeight,
    dropdownLayout = "list",
    optionAvatarShape = "circle",
    showOptionCheckbox = false,
    highlightColorMode = "accent",
    searchDebounce = 300,
    maxVisibleTags = 0,
    showSelectAll = false,
    selectAllText,
    deselectAllText,
    onCreateOption,
    hasCreateAction = false,
    onCreateText,
    noOptionsMessage,
    loadingMessage,
    clearButtonTitle,
    readOnly,
    required,
    hasError,
    errorText,
    showOptionAvatar = true,
    enableGrouping = true,
    renderCustomItem,
    searchMethod = "contains",
    searchCaseSensitive = false,
    maxSearchResults = 0,
    onEnter,
    onLeave,
    onFilterChange,
    enableWeightedSearch = true,
    onLoadMore,
    enableSearchCache = true
}: ComboBoxProps): ReactElement {
    const uid = useId();
    const listboxId = `pwb-listbox-${uid}`;
    const getOptionId = (optId: string): string => `pwb-opt-${uid}-${optId}`;

    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [debouncedSearchText, setDebouncedSearchText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [visibleCount, setVisibleCount] = useState(50);
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
    const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
    const [isTagsExpanded, setIsTagsExpanded] = useState(false);
    const [popoverPlacement, setPopoverPlacement] = useState<"bottom" | "top">("bottom");

    // LRU search results cache (5 entries, key = "query::method::caseSensitive")
    const searchCacheRef = useRef(createLRUCache<string, ComboBoxOption[]>(LRU_CAPACITY));

    // Clear cache when options list changes (e.g. new page loaded by Infinite Scroll)
    const optionsLengthRef = useRef(options.length);
    useEffect(() => {
        if (options.length !== optionsLengthRef.current) {
            searchCacheRef.current.clear();
            optionsLengthRef.current = options.length;
        }
    }, [options.length]);

    const popoverRef = useRef<HTMLDivElement>(null);
    const inputContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const prevIsOpenRef = useRef(false);

    // Sync input value for single select when dropdown closes
    useEffect(() => {
        if (!isOpen) {
            if (selectionMode === "single" && selectedIds.length > 0) {
                const selectedOption = options.find(o => o.id === selectedIds[0]);
                setSearchText(selectedOption ? selectedOption.selectedLabel || selectedOption.label : "");
            } else {
                setSearchText("");
            }
            setFocusedIndex(-1);
            setIsTyping(false);
        }
    }, [isOpen, selectedIds, selectionMode, options]);

    // Handle search text debouncing
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchText(searchText);
        }, searchDebounce);

        return () => {
            clearTimeout(handler);
        };
    }, [searchText, searchDebounce]);

    // Reset visible count when debounced search text changes
    useEffect(() => {
        setVisibleCount(50);
    }, [debouncedSearchText]);

    // Automatically expand visible count when keyboard focuses near the end of visible list
    useEffect(() => {
        if (focusedIndex >= visibleCount - 2) {
            setVisibleCount(prev => Math.max(prev, focusedIndex + 10));
        }
    }, [focusedIndex, visibleCount]);

    // Handle outside clicks to close popover
    useEffect(() => {
        function handleClickOutside(event: MouseEvent): void {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node) &&
                inputContainerRef.current &&
                !inputContainerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle collision detection and smart flipping of dropdown popover placement
    useEffect(() => {
        if (!isOpen || !inputContainerRef.current) {
            return;
        }

        const updatePlacement = (): void => {
            const inputRect = inputContainerRef.current!.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            const spaceBelow = viewportHeight - inputRect.bottom;
            const spaceAbove = inputRect.top;

            // Extract numerical value of maxDropdownHeight (e.g. "300px" or "40vh")
            let parsedHeight = 320;
            if (maxDropdownHeight.endsWith("px")) {
                parsedHeight = parseInt(maxDropdownHeight, 10);
            } else if (maxDropdownHeight.endsWith("vh")) {
                parsedHeight = (parseFloat(maxDropdownHeight) / 100) * viewportHeight;
            }

            const requiredSpace = parsedHeight + 50;

            if (spaceBelow < requiredSpace && spaceAbove > spaceBelow) {
                setPopoverPlacement("top");
            } else {
                setPopoverPlacement("bottom");
            }
        };

        updatePlacement();

        window.addEventListener("resize", updatePlacement);
        window.addEventListener("scroll", updatePlacement, true);

        return () => {
            window.removeEventListener("resize", updatePlacement);
            window.removeEventListener("scroll", updatePlacement, true);
        };
    }, [isOpen, maxDropdownHeight]);

    // Filter + optionally rank options in real-time
    const filteredOptions = useMemo((): ComboBoxOption[] => {
        // Cache key encodes all filter parameters
        const cacheKey = `${debouncedSearchText}::${searchMethod}::${searchCaseSensitive}::${selectionMode}::${selectedIds.join(
            ","
        )}::${enableWeightedSearch}`;

        // LRU cache hit check (only when cache is enabled and we have a non-trivial query)
        if (enableSearchCache && debouncedSearchText.trim() !== "") {
            const cached = searchCacheRef.current.get(cacheKey);
            if (cached) {
                return cached;
            }
        }

        // If selectionMode is single and the user hasn't started typing yet, show all options.
        const shouldFilter = selectionMode === "multi" || isTyping || debouncedSearchText === "";

        let query = debouncedSearchText;
        if (!searchCaseSensitive) {
            query = normalizeText(query);
        } else {
            query = query
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[\u0e31\u0e34-\u0e3a\u0e47-\u0e4e]/g, "");
        }

        // Helper: normalize option text the same way as the query
        const normalizeOpt = (text: string): string => {
            if (!searchCaseSensitive) {
                return normalizeText(text);
            }
            return text
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[\u0e31\u0e34-\u0e3a\u0e47-\u0e4e]/g, "");
        };

        // Weighted scoring — returns best score of label vs subtitle
        const getOptionScore = (opt: ComboBoxOption): number => {
            if (!shouldFilter || !query) {
                return SCORE_CONTAINS; // Not filtering → neutral score
            }
            const labelText = normalizeOpt(opt.label);
            const subtitleText = normalizeOpt(opt.subtitle || "");

            if (searchMethod === "startsWith") {
                const hit = labelText.startsWith(query) || subtitleText.startsWith(query);
                return hit ? SCORE_STARTS_WITH : SCORE_NO_MATCH;
            }
            if (searchMethod === "endsWith") {
                const hit = labelText.endsWith(query) || subtitleText.endsWith(query);
                return hit ? SCORE_CONTAINS : SCORE_NO_MATCH;
            }
            if (searchMethod === "equals") {
                const hit = labelText === query || subtitleText === query;
                return hit ? SCORE_EXACT : SCORE_NO_MATCH;
            }
            if (searchMethod === "fuzzy") {
                // In fuzzy mode, weighted ranking still applies but max tier is FUZZY
                const labelScore = computeMatchScore(labelText, query);
                const subtitleScore = computeMatchScore(subtitleText, query);
                return Math.max(labelScore, subtitleScore);
            }
            // "contains" mode — use full weighted scoring for richer ranking
            const labelScore = computeMatchScore(labelText, query);
            const subtitleScore = computeMatchScore(subtitleText, query);
            return Math.max(labelScore, subtitleScore);
        };

        // 1. Filter options
        let result = options;
        if (selectionMode === "multi") {
            result = options.filter(opt => {
                if (selectedIds.includes(opt.id)) {
                    return false;
                }
                return getOptionScore(opt) > SCORE_NO_MATCH;
            });
        } else {
            result = options.filter(opt => {
                if (!shouldFilter) {
                    return true;
                }
                return getOptionScore(opt) > SCORE_NO_MATCH;
            });
        }

        // 2. Sort by weighted score (highest first) when enabled and a query exists
        if (enableWeightedSearch && debouncedSearchText.trim() !== "") {
            result = [...result].sort((a, b) => getOptionScore(b) - getOptionScore(a));
        }

        // 3. Apply max results limit
        if (maxSearchResults && maxSearchResults > 0) {
            result = result.slice(0, maxSearchResults);
        }

        // 4. Write to cache
        if (enableSearchCache && debouncedSearchText.trim() !== "") {
            searchCacheRef.current.set(cacheKey, result);
        }

        return result;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        options,
        debouncedSearchText,
        searchMethod,
        searchCaseSensitive,
        selectionMode,
        selectedIds,
        enableWeightedSearch,
        enableSearchCache,
        maxSearchResults,
        isTyping
    ]);

    // Set initial focused index when dropdown opens
    useEffect(() => {
        if (isOpen && !prevIsOpenRef.current) {
            if (selectionMode === "single" && selectedIds.length > 0) {
                const idx = filteredOptions.findIndex(o => o.id === selectedIds[0]);
                if (idx >= 0) {
                    setFocusedIndex(idx);
                } else {
                    setFocusedIndex(0);
                }
            } else {
                setFocusedIndex(0);
            }
        }
        prevIsOpenRef.current = isOpen;
    }, [isOpen, selectedIds, selectionMode, filteredOptions]);

    const typedText = searchText.trim();
    const exactMatchExists = options.some(
        opt =>
            normalizeText(opt.label) === normalizeText(typedText) ||
            (opt.selectedLabel && normalizeText(opt.selectedLabel) === normalizeText(typedText))
    );
    const showQuickCreator = hasCreateAction && typedText !== "" && !exactMatchExists;

    // Select All / Deselect All computations (v3.4.0)
    const queryMatchedOptions = options.filter(opt => {
        let query = debouncedSearchText;
        let labelText = opt.label;
        let subtitleText = opt.subtitle || "";

        if (!searchCaseSensitive) {
            query = normalizeText(query);
            labelText = normalizeText(labelText);
            subtitleText = normalizeText(subtitleText);
        } else {
            query = query
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[\u0e31\u0e34-\u0e3a\u0e47-\u0e4e]/g, "");
            labelText = labelText
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[\u0e31\u0e34-\u0e3a\u0e47-\u0e4e]/g, "");
            subtitleText = subtitleText
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[\u0e31\u0e34-\u0e3a\u0e47-\u0e4e]/g, "");
        }

        switch (searchMethod) {
            case "startsWith":
                return labelText.startsWith(query) || subtitleText.startsWith(query);
            case "endsWith":
                return labelText.endsWith(query) || subtitleText.endsWith(query);
            case "equals":
                return labelText === query || subtitleText === query;
            case "fuzzy": {
                const fuzzyMatch = (text: string, q: string): boolean => {
                    let textIdx = 0;
                    let qIdx = 0;
                    while (textIdx < text.length && qIdx < q.length) {
                        if (text[textIdx] === q[qIdx]) {
                            qIdx++;
                        }
                        textIdx++;
                    }
                    return qIdx === q.length;
                };
                return fuzzyMatch(labelText, query) || fuzzyMatch(subtitleText, query);
            }
            case "contains":
            default:
                return labelText.includes(query) || subtitleText.includes(query);
        }
    });
    const querySelectedOptions = queryMatchedOptions.filter(opt => selectedIds.includes(opt.id));
    const isAllQuerySelected =
        queryMatchedOptions.length > 0 && querySelectedOptions.length === queryMatchedOptions.length;

    // Grouping calculations:
    // Extract unique group names and sort them alphabetically, keeping empty group at the end
    const groupNames = enableGrouping ? Array.from(new Set(filteredOptions.map(o => o.groupName || ""))) : [""];
    const sortedGroupNames = enableGrouping
        ? groupNames.sort((a, b) => {
              if (a === "") {
                  return 1;
              }
              if (b === "") {
                  return -1;
              }
              return a.localeCompare(b);
          })
        : [""];

    // Compute visible options (excluding collapsed groups) for keyboard navigation
    const visibleFilteredOptions: ComboBoxOption[] = [];
    sortedGroupNames.forEach(gName => {
        const isCollapsed = !!collapsedGroups[gName];
        if (!isCollapsed) {
            const optsInGroup = filteredOptions.filter(o => (o.groupName || "") === gName);
            visibleFilteredOptions.push(...optsInGroup);
        }
    });

    // Generate renderable items list (combines group headers and sliced options)
    interface RenderableItem {
        type: "header" | "option";
        groupName?: string;
        count?: number;
        isCollapsed?: boolean;
        option?: ComboBoxOption;
        index?: number;
        isSelected?: boolean;
        isFocused?: boolean;
    }

    const renderableItems: RenderableItem[] = [];
    let optionIndex = 0;

    sortedGroupNames.forEach(gName => {
        const optsInGroup = filteredOptions.filter(o => (o.groupName || "") === gName);
        if (optsInGroup.length === 0) {
            return;
        }

        const isCollapsed = !!collapsedGroups[gName];

        if (gName !== "") {
            renderableItems.push({
                type: "header",
                groupName: gName,
                count: optsInGroup.length,
                isCollapsed
            });
        }

        if (!isCollapsed) {
            optsInGroup.forEach(opt => {
                if (optionIndex < visibleCount) {
                    renderableItems.push({
                        type: "option",
                        option: opt,
                        index: optionIndex,
                        isSelected: selectedIds.includes(opt.id),
                        isFocused: optionIndex === focusedIndex
                    });
                }
                optionIndex++;
            });
        }
    });

    const toggleGroup = (gName: string): void => {
        setCollapsedGroups(prev => ({
            ...prev,
            [gName]: !prev[gName]
        }));
    };

    const handleImageError = (id: string): void => {
        setBrokenImages(prev => ({
            ...prev,
            [id]: true
        }));
    };

    const shouldShowOptionAvatars = showOptionAvatar && (options.some(o => !!o.imageUrl) || tagStyle === "avatar");

    // Handle lazy scroll loading (local virtual paging) + Infinite Scroll callback (external datasource paging)
    const handleDropdownScroll = (e: UIEvent<HTMLDivElement>): void => {
        const target = e.currentTarget;
        const nearBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 60;
        if (nearBottom) {
            // Local virtual paging: increase visible render window
            setVisibleCount(prev => prev + 50);
            // External datasource paging: call onLoadMore when provided (Infinite Scroll feature)
            onLoadMore?.();
        }
    };

    // Select an option
    const handleSelectOption = (id: string): void => {
        onSelect(id);
        if (selectionMode === "single") {
            setIsOpen(false);
        } else {
            setSearchText("");
            inputRef.current?.focus();
        }
    };

    // Keyboard handlers
    const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>): void => {
        if (readOnly) {
            return;
        }

        if (e.ctrlKey && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            e.preventDefault();
            if (!isOpen) {
                setIsOpen(true);
                return;
            }
            if (visibleFilteredOptions.length === 0) {
                return;
            }

            const currentOpt =
                focusedIndex >= 0 && focusedIndex < visibleFilteredOptions.length
                    ? visibleFilteredOptions[focusedIndex]
                    : null;

            if (!currentOpt) {
                setFocusedIndex(0);
                return;
            }

            const currentGroup = currentOpt.groupName || "";
            const currentGroupIdx = sortedGroupNames.indexOf(currentGroup);

            if (e.key === "ArrowDown") {
                let nextGroupIdx = currentGroupIdx + 1;
                let foundNext = false;
                while (nextGroupIdx < sortedGroupNames.length) {
                    const nextGroup = sortedGroupNames[nextGroupIdx];
                    const targetIdx = visibleFilteredOptions.findIndex(o => (o.groupName || "") === nextGroup);
                    if (targetIdx !== -1) {
                        setFocusedIndex(targetIdx);
                        foundNext = true;
                        break;
                    }
                    nextGroupIdx++;
                }
                if (!foundNext) {
                    const targetIdx = visibleFilteredOptions.findIndex(
                        o => (o.groupName || "") === sortedGroupNames[0]
                    );
                    if (targetIdx !== -1) {
                        setFocusedIndex(targetIdx);
                    }
                }
            } else {
                let prevGroupIdx = currentGroupIdx - 1;
                let foundPrev = false;
                while (prevGroupIdx >= 0) {
                    const prevGroup = sortedGroupNames[prevGroupIdx];
                    const targetIdx = visibleFilteredOptions.findIndex(o => (o.groupName || "") === prevGroup);
                    if (targetIdx !== -1) {
                        setFocusedIndex(targetIdx);
                        foundPrev = true;
                        break;
                    }
                    prevGroupIdx--;
                }
                if (!foundPrev) {
                    let loopIdx = sortedGroupNames.length - 1;
                    while (loopIdx >= 0) {
                        const nextGroup = sortedGroupNames[loopIdx];
                        const targetIdx = visibleFilteredOptions.findIndex(o => (o.groupName || "") === nextGroup);
                        if (targetIdx !== -1) {
                            setFocusedIndex(targetIdx);
                            break;
                        }
                        loopIdx--;
                    }
                }
            }
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (!isOpen) {
                setIsOpen(true);
            } else {
                setFocusedIndex(prev => (prev < visibleFilteredOptions.length - 1 ? prev + 1 : 0));
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (isOpen) {
                setFocusedIndex(prev => (prev > 0 ? prev - 1 : visibleFilteredOptions.length - 1));
            }
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (isOpen && focusedIndex >= 0 && focusedIndex < visibleFilteredOptions.length) {
                handleSelectOption(visibleFilteredOptions[focusedIndex].id);
            } else if (isOpen && showQuickCreator) {
                onCreateOption?.(typedText);
                setSearchText("");
                setIsOpen(false);
            } else if (!isOpen) {
                setIsOpen(true);
            }
        } else if (e.key === "Escape") {
            e.preventDefault();
            setIsOpen(false);
        } else if (e.key === "Backspace" && searchText === "" && selectionMode === "multi" && selectedIds.length > 0) {
            // Delete last tag on backspace when text is empty
            onRemove(selectedIds[selectedIds.length - 1]);
        }
    };

    // Render option list label with high-fidelity highlights (supports Thai/Latin diacritics normalization)
    const renderOptionLabel = (label: string, search: string): ReactElement => {
        if (!search.trim()) {
            return <span>{label}</span>;
        }

        const normalizedLabel = normalizeText(label);
        const normalizedSearch = normalizeText(search);

        if (!normalizedLabel || !normalizedSearch || !normalizedLabel.includes(normalizedSearch)) {
            return <span>{label}</span>;
        }

        // We want to find matches in normalizedLabel, and map the matches to the original label.
        // Let's do a character-by-character mapping of original string index to normalized string index!
        const originalToNormalizedIndices: number[] = [];
        let normalizedIdx = 0;
        for (const char of label) {
            const normalizedChar = normalizeText(char);
            if (normalizedChar === "") {
                originalToNormalizedIndices.push(normalizedIdx);
            } else {
                originalToNormalizedIndices.push(normalizedIdx);
                normalizedIdx += normalizedChar.length;
            }
        }

        // Now we find all occurrences of normalizedSearch in normalizedLabel
        const matchRanges: Array<{ start: number; end: number }> = [];
        let searchIndex = 0;
        while ((searchIndex = normalizedLabel.indexOf(normalizedSearch, searchIndex)) !== -1) {
            matchRanges.push({
                start: searchIndex,
                end: searchIndex + normalizedSearch.length
            });
            searchIndex += normalizedSearch.length;
        }

        if (matchRanges.length === 0) {
            return <span>{label}</span>;
        }

        // Map these normalized ranges back to original label character indices!
        // An original character at index `i` is highlighted if its mapped index (originalToNormalizedIndices[i])
        // falls within any of the matchRanges.
        const highlightedChars: boolean[] = new Array(label.length).fill(false);
        for (let i = 0; i < label.length; i++) {
            const normIdx = originalToNormalizedIndices[i];
            const isMatch = matchRanges.some(r => normIdx >= r.start && normIdx < r.end);
            highlightedChars[i] = isMatch;
        }

        // Now reconstruct the React node by grouping sequential highlighted/unhighlighted characters!
        const elements: Array<string | ReactElement> = [];
        let currentChunk = "";
        let isCurrentChunkHighlighted = highlightedChars[0];

        for (let i = 0; i < label.length; i++) {
            if (highlightedChars[i] === isCurrentChunkHighlighted) {
                currentChunk += label[i];
            } else {
                if (isCurrentChunkHighlighted) {
                    elements.push(
                        <mark key={i} className="pwb-search-highlight">
                            {currentChunk}
                        </mark>
                    );
                } else {
                    elements.push(currentChunk);
                }
                currentChunk = label[i];
                isCurrentChunkHighlighted = highlightedChars[i];
            }
        }

        if (currentChunk) {
            const key = label.length;
            if (isCurrentChunkHighlighted) {
                elements.push(
                    <mark key={key} className="pwb-search-highlight">
                        {currentChunk}
                    </mark>
                );
            } else {
                elements.push(currentChunk);
            }
        }

        return <span>{elements}</span>;
    };

    const getInitials = (label: string): string => {
        const clean = label
            .replace(
                /[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g,
                ""
            )
            .replace(/[^\w\s\u0e00-\u0e7f]/g, "")
            .trim();
        return clean ? clean.charAt(0).toUpperCase() : "?";
    };

    const hasSelection = selectedIds.length > 0;
    const selectedOption =
        selectionMode === "single" && hasSelection ? options.find(o => o.id === selectedIds[0]) : null;

    const avatarShapeClass =
        optionAvatarShape === "rounded"
            ? "pwb-avatar-rounded"
            : optionAvatarShape === "square"
            ? "pwb-avatar-square"
            : "pwb-avatar-circle";

    const hasSelectedClass =
        selectionMode === "single" && hasSelection && !isOpen
            ? singleSelectStyle === "pill"
                ? "pwb-input-has-selected-pill"
                : singleSelectStyle === "rich"
                ? "pwb-input-has-selected-rich"
                : ""
            : "";

    return (
        <div
            className={`pwb-combobox-wrapper ${readOnly ? "pwb-disabled" : ""} ${avatarShapeClass}`}
            style={
                {
                    "--accent-color": accentColor,
                    "--search-highlight-color": searchHighlightColor || accentColor,
                    "--border-radius": borderRadius,
                    "--bg-blur": bgBlur,
                    "--popover-bg": popoverBg
                } as any
            }
        >
            {/* Input Selection Bar Container */}
            <div
                ref={inputContainerRef}
                className={`pwb-combobox-input-container ${isOpen ? "pwb-input-active" : ""} ${
                    hasError ? "pwb-input-error" : ""
                } ${hasSelectedClass}`}
                onClick={() => {
                    if (!readOnly && !isOpen) {
                        setIsOpen(true);
                        inputRef.current?.focus();
                    }
                }}
            >
                {/* Pill/Rich display for Single Select */}
                {selectionMode === "single" &&
                    hasSelection &&
                    !isOpen &&
                    (singleSelectStyle === "pill" ? (
                        <div
                            className="pwb-combobox-single-pill-display"
                            style={
                                selectedOption?.colorCode
                                    ? {
                                          borderColor: selectedOption.colorCode,
                                          color: selectedOption.colorCode,
                                          backgroundColor: `color-mix(in srgb, ${selectedOption.colorCode} 8%, transparent)`
                                      }
                                    : {}
                            }
                        >
                            {showSelectedAvatar && (tagStyle === "avatar" || !!selectedOption?.imageUrl) && (
                                <span
                                    className="pwb-combobox-single-pill-avatar"
                                    style={
                                        selectedOption?.colorCode
                                            ? { backgroundColor: selectedOption.colorCode }
                                            : { backgroundColor: accentColor }
                                    }
                                >
                                    {selectedOption?.imageUrl && !brokenImages[selectedOption.id] ? (
                                        <img
                                            src={selectedOption.imageUrl}
                                            className="pwb-combobox-tag-img"
                                            alt=""
                                            onError={() => handleImageError(selectedOption.id)}
                                        />
                                    ) : (
                                        getInitials(selectedOption?.label || "")
                                    )}
                                </span>
                            )}
                            <span className="pwb-combobox-single-pill-text">
                                {selectedOption?.selectedLabel || selectedOption?.label}
                            </span>
                        </div>
                    ) : singleSelectStyle === "rich" ? (
                        <div className="pwb-combobox-single-rich-display">
                            {showSelectedAvatar && (tagStyle === "avatar" || !!selectedOption?.imageUrl) && (
                                <span
                                    className="pwb-combobox-single-rich-avatar"
                                    style={
                                        selectedOption?.colorCode
                                            ? { backgroundColor: selectedOption.colorCode }
                                            : { backgroundColor: accentColor }
                                    }
                                >
                                    {selectedOption?.imageUrl && !brokenImages[selectedOption.id] ? (
                                        <img
                                            src={selectedOption.imageUrl}
                                            className="pwb-combobox-tag-img"
                                            alt=""
                                            onError={() => handleImageError(selectedOption.id)}
                                        />
                                    ) : (
                                        getInitials(selectedOption?.label || "")
                                    )}
                                </span>
                            )}
                            <div className="pwb-combobox-single-rich-text">
                                <span className="pwb-combobox-single-rich-label">
                                    {selectedOption?.selectedLabel || selectedOption?.label}
                                </span>
                                {selectedOption?.subtitle && (
                                    <span className="pwb-combobox-single-rich-subtitle">{selectedOption.subtitle}</span>
                                )}
                            </div>
                        </div>
                    ) : null)}

                {/* Selected Tag Pills (Multi-Select) */}
                {selectionMode === "multi" && (
                    <div className="pwb-combobox-tags-list">
                        {(maxVisibleTags > 0 && selectedIds.length > maxVisibleTags && !isTagsExpanded
                            ? selectedIds.slice(0, maxVisibleTags)
                            : selectedIds
                        ).map(id => {
                            const option = options.find(o => o.id === id);
                            if (!option) {
                                return null;
                            }

                            const hasAvatar = tagStyle === "avatar" || !!option.imageUrl;
                            const tagStyleObject = option.colorCode
                                ? {
                                      borderColor: option.colorCode,
                                      color: option.colorCode,
                                      backgroundColor: `color-mix(in srgb, ${option.colorCode} 8%, transparent)`
                                  }
                                : {};

                            return (
                                <div
                                    key={id}
                                    className={`pwb-combobox-tag-pill ${hasAvatar ? "pwb-tag-avatar-style" : ""}`}
                                    style={tagStyleObject}
                                >
                                    {hasAvatar && showSelectedAvatar && (
                                        <span
                                            className="pwb-combobox-tag-avatar"
                                            style={
                                                option.colorCode
                                                    ? { backgroundColor: option.colorCode }
                                                    : { backgroundColor: accentColor }
                                            }
                                        >
                                            {option.imageUrl && !brokenImages[option.id] ? (
                                                <img
                                                    src={option.imageUrl}
                                                    className="pwb-combobox-tag-img"
                                                    alt={option.label}
                                                    onError={() => handleImageError(option.id)}
                                                />
                                            ) : (
                                                getInitials(option.label)
                                            )}
                                        </span>
                                    )}
                                    <span className="pwb-combobox-tag-text">
                                        {option.selectedLabel || option.label}
                                    </span>
                                    {!readOnly && (
                                        <button
                                            type="button"
                                            className="pwb-combobox-tag-remove-btn"
                                            onClick={e => {
                                                e.stopPropagation();
                                                onRemove(id);
                                            }}
                                            style={option.colorCode ? { color: option.colorCode } : {}}
                                            aria-label={`Remove tag ${option.label}`}
                                        >
                                            &times;
                                        </button>
                                    )}
                                </div>
                            );
                        })}

                        {/* Collapsed tags badge */}
                        {maxVisibleTags > 0 &&
                            selectedIds.length > maxVisibleTags &&
                            (!isTagsExpanded ? (
                                <button
                                    type="button"
                                    className="pwb-tag-collapsed-pill"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setIsTagsExpanded(true);
                                    }}
                                    aria-label={`Show ${selectedIds.length - maxVisibleTags} more selected items`}
                                >
                                    +{selectedIds.length - maxVisibleTags} more
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="pwb-tag-collapsed-pill pwb-tag-expanded-collapse"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setIsTagsExpanded(false);
                                    }}
                                    aria-label="Collapse tag list"
                                >
                                    Collapse
                                </button>
                            ))}
                    </div>
                )}

                {/* Main Input Element */}
                <input
                    ref={inputRef}
                    type="text"
                    className="pwb-combobox-search-input"
                    value={searchText}
                    onChange={e => {
                        const val = e.target.value;
                        setSearchText(val);
                        setIsTyping(true);
                        if (!isOpen) {
                            setIsOpen(true);
                        }
                        onFilterChange?.(val);
                    }}
                    onFocus={e => {
                        if (selectionMode === "single" && selectedIds.length > 0) {
                            const target = e.currentTarget;
                            setTimeout(() => {
                                target.select();
                            }, 0);
                        }
                        onEnter?.();
                    }}
                    onBlur={e => {
                        const relatedTarget = e.relatedTarget as Node | null;
                        const wrapper = inputRef.current?.closest(".pwb-combobox-wrapper");
                        if (wrapper && relatedTarget && wrapper.contains(relatedTarget)) {
                            return;
                        }
                        onLeave?.();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={selectionMode === "multi" && hasSelection ? "" : placeholder}
                    readOnly={readOnly}
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    aria-autocomplete="list"
                    aria-disabled={readOnly}
                    aria-required={required}
                    aria-invalid={hasError}
                    aria-controls={isOpen ? listboxId : undefined}
                    aria-activedescendant={
                        isOpen && focusedIndex >= 0 && focusedIndex < visibleFilteredOptions.length
                            ? getOptionId(visibleFilteredOptions[focusedIndex].id)
                            : undefined
                    }
                />

                {/* Right Action Icons (Clear and Dropdown Arrow) */}
                <div className="pwb-combobox-actions">
                    {hasSelection && !readOnly && (
                        <button
                            type="button"
                            className="pwb-combobox-clear-btn"
                            onClick={e => {
                                e.stopPropagation();
                                onClear();
                                setSearchText("");
                                setIsTyping(true);
                                inputRef.current?.focus();
                            }}
                            title={clearButtonTitle}
                            aria-label={clearButtonTitle}
                        >
                            &times;
                        </button>
                    )}
                    <button
                        type="button"
                        className="pwb-combobox-chevron-btn"
                        onClick={e => {
                            e.stopPropagation();
                            if (!readOnly) {
                                setIsOpen(!isOpen);
                                if (!isOpen) {
                                    inputRef.current?.focus();
                                }
                            }
                        }}
                        aria-label="Toggle options dropdown"
                    >
                        <svg
                            className="pwb-combobox-chevron-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Dropdown list popover panel */}
            {isOpen && (
                <div
                    ref={popoverRef}
                    id={listboxId}
                    className={`pwb-combobox-popover animate-slide-up pwb-placement-${popoverPlacement}`}
                    role="listbox"
                >
                    {isLoading ? (
                        <div className="pwb-combobox-status-message">
                            <div className="pwb-combobox-spinner" />
                            <span>{loadingMessage}</span>
                        </div>
                    ) : filteredOptions.length === 0 ? (
                        showQuickCreator ? (
                            <div className="pwb-combobox-empty-illustration-container pwb-combobox-empty-create">
                                <EmptySearchIllustration />
                                <span className="pwb-no-options-text">{noOptionsMessage}</span>
                                <button
                                    type="button"
                                    className="pwb-combobox-inline-create-btn"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onCreateOption?.(typedText);
                                        setSearchText("");
                                        setIsOpen(false);
                                    }}
                                >
                                    {onCreateText ? onCreateText.replace("{value}", typedText) : `+ Add "${typedText}"`}
                                </button>
                            </div>
                        ) : (
                            <div className="pwb-combobox-empty-illustration-container">
                                <EmptySearchIllustration />
                                <span className="pwb-no-options-text">{noOptionsMessage}</span>
                            </div>
                        )
                    ) : (
                        <>
                            {selectionMode === "multi" && showSelectAll && queryMatchedOptions.length > 0 && (
                                <div className="pwb-combobox-select-all-bar">
                                    <button
                                        type="button"
                                        className="pwb-combobox-select-all-btn"
                                        onClick={e => {
                                            e.stopPropagation();
                                            if (isAllQuerySelected) {
                                                querySelectedOptions.forEach(opt => onRemove(opt.id));
                                            } else {
                                                queryMatchedOptions.forEach(opt => {
                                                    if (!selectedIds.includes(opt.id)) {
                                                        onSelect(opt.id);
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        <span
                                            className={`pwb-combobox-select-all-checkbox ${
                                                isAllQuerySelected ? "pwb-checked" : ""
                                            }`}
                                        >
                                            {isAllQuerySelected && (
                                                <svg className="pwb-combobox-option-checkbox-tick" viewBox="0 0 24 24">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            )}
                                        </span>
                                        <span className="pwb-combobox-select-all-text">
                                            {isAllQuerySelected
                                                ? deselectAllText || "ล้างทั้งหมด / Deselect All"
                                                : selectAllText || "เลือกทั้งหมด / Select All"}
                                        </span>
                                        <span className="pwb-combobox-select-all-count">
                                            (
                                            {isAllQuerySelected
                                                ? querySelectedOptions.length
                                                : queryMatchedOptions.length - querySelectedOptions.length}
                                            )
                                        </span>
                                    </button>
                                </div>
                            )}
                            <div
                                className={`pwb-combobox-options-list ${
                                    dropdownLayout === "grid" ? "pwb-layout-grid" : ""
                                }`}
                                style={{ maxHeight: maxDropdownHeight }}
                                onScroll={handleDropdownScroll}
                            >
                                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                                    {renderableItems.map(item => {
                                        if (item.type === "header") {
                                            const groupName = item.groupName || "";
                                            const isCollapsed = !!item.isCollapsed;
                                            return (
                                                <li
                                                    key={`header-${groupName}`}
                                                    className="pwb-combobox-group-header"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        toggleGroup(groupName);
                                                    }}
                                                >
                                                    <div className="pwb-combobox-group-header-content">
                                                        <span>{renderOptionLabel(groupName, debouncedSearchText)}</span>
                                                        <span className="pwb-combobox-group-count">{item.count}</span>
                                                    </div>
                                                    <svg
                                                        className={`pwb-combobox-group-chevron ${
                                                            isCollapsed ? "pwb-collapsed" : ""
                                                        }`}
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <polyline points="6 9 12 15 18 9"></polyline>
                                                    </svg>
                                                </li>
                                            );
                                        }

                                        const opt = item.option!;
                                        const idx = item.index!;
                                        const isSelected = !!item.isSelected;
                                        const isFocused = !!item.isFocused;

                                        const isDynamicHighlight =
                                            highlightColorMode === "optionColor" && !!opt.colorCode;
                                        const optionStyle = isDynamicHighlight
                                            ? ({
                                                  "--item-color-code": opt.colorCode,
                                                  "--item-glow-bg": `color-mix(in srgb, ${opt.colorCode} 8%, transparent)`,
                                                  "--item-glow-bg-strong": `color-mix(in srgb, ${opt.colorCode} 15%, transparent)`
                                              } as any)
                                            : {};

                                        return (
                                            <li
                                                key={opt.id}
                                                id={getOptionId(opt.id)}
                                                className={`pwb-combobox-option-item ${
                                                    isSelected ? "pwb-option-selected" : ""
                                                } ${isFocused ? "pwb-option-focused" : ""} ${
                                                    opt.subtitle ? "pwb-option-two-line" : ""
                                                } ${isDynamicHighlight ? "pwb-highlight-dynamic" : ""}`}
                                                style={optionStyle}
                                                onClick={() => handleSelectOption(opt.id)}
                                                onMouseEnter={() => setFocusedIndex(idx)}
                                                role="option"
                                                aria-selected={isSelected}
                                            >
                                                {/* Checkbox or Radio button on the left */}
                                                {showOptionCheckbox && (
                                                    <div className="pwb-combobox-option-checkbox-wrapper">
                                                        <div
                                                            className={`pwb-combobox-option-checkbox ${
                                                                selectionMode === "multi"
                                                                    ? "pwb-checkbox-multi"
                                                                    : "pwb-checkbox-single"
                                                            }`}
                                                        >
                                                            {selectionMode === "multi"
                                                                ? isSelected && (
                                                                      <svg
                                                                          className="pwb-combobox-option-checkbox-tick"
                                                                          viewBox="0 0 24 24"
                                                                      >
                                                                          <polyline points="20 6 9 17 4 12"></polyline>
                                                                      </svg>
                                                                  )
                                                                : isSelected && (
                                                                      <div className="pwb-combobox-option-checkbox-dot" />
                                                                  )}
                                                        </div>
                                                    </div>
                                                )}
                                                {renderCustomItem ? (
                                                    <div
                                                        className="pwb-custom-widget-content-wrapper"
                                                        style={{ flex: 1, minWidth: 0 }}
                                                    >
                                                        {renderCustomItem(opt.rawObject)}
                                                    </div>
                                                ) : (
                                                    <>
                                                        {shouldShowOptionAvatars && (
                                                            <div
                                                                className="pwb-combobox-option-avatar-container"
                                                                style={
                                                                    opt.colorCode
                                                                        ? {
                                                                              backgroundColor: `color-mix(in srgb, ${opt.colorCode} 12%, transparent)`,
                                                                              color: opt.colorCode,
                                                                              borderColor: `color-mix(in srgb, ${opt.colorCode} 30%, transparent)`
                                                                          }
                                                                        : {
                                                                              backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
                                                                              color: accentColor,
                                                                              borderColor: `color-mix(in srgb, ${accentColor} 30%, transparent)`
                                                                          }
                                                                }
                                                            >
                                                                {opt.imageUrl && !brokenImages[opt.id] ? (
                                                                    <img
                                                                        src={opt.imageUrl}
                                                                        className="pwb-combobox-option-avatar-img"
                                                                        onError={() => handleImageError(opt.id)}
                                                                        alt={opt.label}
                                                                    />
                                                                ) : (
                                                                    <span className="pwb-combobox-option-avatar-initials">
                                                                        {getInitials(opt.label)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                        <div
                                                            style={{
                                                                flex: 1,
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                minWidth: 0
                                                            }}
                                                        >
                                                            <div className="pwb-combobox-option-label">
                                                                {renderOptionLabel(opt.label, debouncedSearchText)}
                                                            </div>
                                                            {opt.subtitle && (
                                                                <div className="pwb-combobox-option-subtitle">
                                                                    {renderOptionLabel(
                                                                        opt.subtitle,
                                                                        debouncedSearchText
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                                {isSelected && !showOptionCheckbox && (
                                                    <svg
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        style={{ flexShrink: 0, marginLeft: "8px" }}
                                                    >
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </>
                    )}
                    {showQuickCreator && filteredOptions.length > 0 && (
                        <div className="pwb-combobox-popover-footer">
                            <button
                                type="button"
                                className="pwb-combobox-inline-create-btn"
                                onClick={e => {
                                    e.stopPropagation();
                                    onCreateOption?.(typedText);
                                    setSearchText("");
                                    setIsOpen(false);
                                }}
                            >
                                {onCreateText ? onCreateText.replace("{value}", typedText) : `+ Add "${typedText}"`}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Error Message Alert */}
            {hasError && errorText && (
                <div className="pwb-validation-message">
                    <svg
                        className="pwb-warning-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <span>{errorText}</span>
                </div>
            )}
        </div>
    );
}
