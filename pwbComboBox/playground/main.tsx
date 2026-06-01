import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { ComboBox, ComboBoxOption } from "../src/components/ComboBox";
import "../src/ui/PwbComboBox.css";

// ----------------------------------------------------
// Generate Massive Dataset dynamically (1,000 items)
// ----------------------------------------------------
const MASSIVE_DATASET = Array.from({ length: 1000 }).map((_, index) => {
    const isEven = index % 2 === 0;
    return {
        id: `m_${index}`,
        label: `รายการตัวเลือกที่ ${index + 1} 🚀`,
        subtitle: `รหัสสินค้า: OP-${10000 + index} | สินค้านำเข้าหมวดหมู่พรีเมียม`,
        groupName: isEven ? "สินค้าพรีเมียม (Premium)" : "สินค้าขายดี (Best Seller)",
        colorCode: isEven ? "#10b981" : "#3b82f6",
        imageUrl: isEven 
            ? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80"
            : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=100&q=80",
        rawObject: { id: `m_${index}`, index }
    };
});

// ----------------------------------------------------
// Mock Datasets with dynamic subtitles
// ----------------------------------------------------
const DATASETS = {
    fruits: [
        {
            id: "1",
            label: "Apple 🍎",
            subtitle: "ผลไม้แอปเปิ้ลสดสีแดง | Cal: 52 kcal",
            groupName: "หวาน / Sweet",
            colorCode: "#ef4444",
            imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "1", val: "apple" }
        },
        {
            id: "2",
            label: "Banana 🍌",
            subtitle: "กล้วยหอมทองอุดมโพแทสเซียม | Cal: 89 kcal",
            groupName: "หวาน / Sweet",
            colorCode: "#eab308",
            imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "2", val: "banana" }
        },
        {
            id: "3",
            label: "Orange 🍊",
            subtitle: "ส้มสายน้ำผึ้งรสเปรี้ยวหวาน | Cal: 47 kcal",
            groupName: "เปรี้ยว / Sour",
            colorCode: "#f97316",
            imageUrl: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "3", val: "orange" }
        },
        {
            id: "4",
            label: "Mango 🥭",
            subtitle: "มะม่วงอกร่องสีเหลืองทอง | Cal: 60 kcal",
            groupName: "หวาน / Sweet",
            colorCode: "#facc15",
            imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "4", val: "mango" }
        },
        {
            id: "5",
            label: "Grape 🍇",
            subtitle: "องุ่นไร้เมล็ดสีม่วงเข้ม | Cal: 67 kcal",
            groupName: "หวาน / Sweet",
            colorCode: "#8b5cf6",
            imageUrl: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "5", val: "grape" }
        },
        {
            id: "6",
            label: "Strawberry 🍓",
            subtitle: "สตรอว์เบอร์รี่สดจากเชียงใหม่ | Cal: 33 kcal",
            groupName: "เปรี้ยว / Sour",
            colorCode: "#f43f5e",
            imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "6", val: "strawberry" }
        },
        {
            id: "7",
            label: "Pineapple 🍍",
            subtitle: "สับปะรดภูแลหวานกรอบ | Cal: 50 kcal",
            groupName: "เปรี้ยว / Sour",
            colorCode: "#eab308",
            imageUrl: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "7", val: "pineapple" }
        },
        {
            id: "8",
            label: "Watermelon 🍉",
            subtitle: "แตงโมตอร์ปิโดเนื้อหวานฉ่ำ | Cal: 30 kcal",
            groupName: "หวาน / Sweet",
            colorCode: "#10b981",
            imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "8", val: "watermelon" }
        },
        {
            id: "9",
            label: "Peach 🍑",
            subtitle: "ลูกพีชนำเข้าจากญี่ปุ่นกลิ่นหอม | Cal: 39 kcal",
            groupName: "หวาน / Sweet",
            colorCode: "#f472b6",
            imageUrl: "https://images.unsplash.com/photo-1595124253363-c59659b19350?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "9", val: "peach" }
        },
        {
            id: "10",
            label: "Kiwi 🥝",
            subtitle: "กีวี่สีทองรสชาติกลมกล่อม | Cal: 61 kcal",
            groupName: "เปรี้ยว / Sour",
            colorCode: "#84cc16",
            imageUrl: "https://images.unsplash.com/photo-1585059895524-72359e061381?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "10", val: "kiwi" }
        }
    ],
    tech: [
        {
            id: "t1",
            label: "React",
            subtitle: "Frontend JavaScript Library | Creator: Meta",
            groupName: "Frontend Stacks",
            colorCode: "#06b6d4",
            imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "t1", val: "react" }
        },
        {
            id: "t2",
            label: "Vue.js",
            subtitle: "Progressive Web Framework | Creator: Evan You",
            groupName: "Frontend Stacks",
            colorCode: "#10b981",
            imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "t2", val: "vue" }
        },
        {
            id: "t3",
            label: "Angular",
            subtitle: "Enterprise MVC Platform | Creator: Google",
            groupName: "Frontend Stacks",
            colorCode: "#ef4444",
            imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "t3", val: "angular" }
        },
        {
            id: "t4",
            label: "Next.js",
            subtitle: "Fullstack React SSR Framework | Creator: Vercel",
            groupName: "Frontend Stacks",
            colorCode: "#ffffff",
            imageUrl: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "t4", val: "next" }
        },
        {
            id: "t5",
            label: "Vite",
            subtitle: "Next Generation Fast Build Tool | Creator: Evan You",
            groupName: "Frontend Stacks",
            colorCode: "#8b5cf6",
            imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "t5", val: "vite" }
        },
        {
            id: "t6",
            label: "Mendix Pluggable Widgets",
            subtitle: "Low-code Custom Extension | Powered by React",
            groupName: "Frontend Stacks",
            colorCode: "#3b82f6",
            imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "t6", val: "mendix" }
        },
        {
            id: "t7",
            label: "TypeScript",
            subtitle: "Typed Superset of JavaScript | Creator: Microsoft",
            groupName: "Frontend Stacks",
            colorCode: "#2563eb",
            imageUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "t7", val: "ts" }
        },
        {
            id: "t8",
            label: "Go (Golang)",
            subtitle: "High Performance Backend Language | Creator: Google",
            groupName: "Backend Stacks",
            colorCode: "#00add8",
            imageUrl: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "t8", val: "go" }
        },
        {
            id: "t9",
            label: "Python",
            subtitle: "AI and Data Science Scripting | Syntax: Simple",
            groupName: "Backend Stacks",
            colorCode: "#eab308",
            imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "t9", val: "python" }
        },
        {
            id: "t10",
            label: "Rust Programming",
            subtitle: "Safe and Ultra Fast Systems Language | Memory: Safe",
            groupName: "Backend Stacks",
            colorCode: "#f97316",
            imageUrl: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "t10", val: "rust" }
        }
    ],
    provinces: [
        {
            id: "p1",
            label: "กรุงเทพมหานคร (Bangkok)",
            subtitle: "เมืองหลวงของประเทศไทย | ภูมิภาค: ภาคกลาง",
            groupName: "ภาคกลาง (Central)",
            colorCode: "#ef4444",
            imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "p1", val: "bkk" }
        },
        {
            id: "p2",
            label: "เชียงใหม่ (Chiang Mai)",
            subtitle: "ศูนย์กลางวัฒนธรรมและการท่องเที่ยว | ภูมิภาค: ภาคเหนือ",
            groupName: "ภาคเหนือ (North)",
            colorCode: "#10b981",
            imageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "p2", val: "cm" }
        },
        {
            id: "p3",
            label: "ภูเก็ต (Phuket)",
            subtitle: "เกาะไข่มุกแห่งอันดามันยอดนิยม | ภูมิภาค: ภาคใต้",
            groupName: "ภาคใต้ (South)",
            colorCode: "#3b82f6",
            imageUrl: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "p3", val: "pkt" }
        },
        {
            id: "p4",
            label: "ขอนแก่น (Khon Kaen)",
            subtitle: "ศูนย์กลางเศรษฐกิจและการศึกษา | ภูมิภาค: ภาคอีสาน",
            groupName: "ภาคอีสาน (Northeast)",
            colorCode: "#eab308",
            imageUrl: "https://images.unsplash.com/photo-1558409038-f3d9b1a5518b?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "p4", val: "kk" }
        },
        {
            id: "p5",
            label: "ชลบุรี (Chonburi)",
            subtitle: "เมืองพัทยาและอุตสาหกรรมฝั่งตะวันออก | ภูมิภาค: ภาคตะวันออก",
            groupName: "ภาคตะวันออก (East)",
            colorCode: "#f97316",
            imageUrl: "https://images.unsplash.com/photo-1534008897995-27a23e859048?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "p5", val: "cb" }
        },
        {
            id: "p6",
            label: "นครราชสีมา (Korat)",
            subtitle: "ประตูสู่อีสานเมืองย่าโมสุดยิ่งใหญ่ | ภูมิภาค: ภาคอีสาน",
            groupName: "ภาคอีสาน (Northeast)",
            colorCode: "#a855f7",
            imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=100&q=80",
            rawObject: { id: "p6", val: "km" }
        }
    ],
    massive: MASSIVE_DATASET
};

function getSmartEnumColor(key: string): string {
    const lowerKey = key.toLowerCase();

    // 1. Success / Approved / Active / Enabled / Done keys -> Green
    if (
        lowerKey.includes("approve") ||
        lowerKey.includes("active") ||
        lowerKey.includes("success") ||
        lowerKey.includes("true") ||
        lowerKey.includes("complete") ||
        lowerKey.includes("enable") ||
        lowerKey.includes("yes") ||
        lowerKey.includes("done") ||
        lowerKey.includes("finish") ||
        lowerKey.includes("pass") ||
        lowerKey.includes("ok")
    ) {
        return "#10b981";
    }

    // 2. Reject / Danger / Error / False / Disable / Cancel / Fail / Inactive keys -> Red
    if (
        lowerKey.includes("reject") ||
        lowerKey.includes("danger") ||
        lowerKey.includes("error") ||
        lowerKey.includes("false") ||
        lowerKey.includes("disable") ||
        lowerKey.includes("no") ||
        lowerKey.includes("cancel") ||
        lowerKey.includes("fail") ||
        lowerKey.includes("inactive") ||
        lowerKey.includes("stop") ||
        lowerKey.includes("block") ||
        lowerKey.includes("deny")
    ) {
        return "#ef4444";
    }

    // 3. Pending / Process / Warning / Wait / Review keys -> Amber
    if (
        lowerKey.includes("pending") ||
        lowerKey.includes("process") ||
        lowerKey.includes("warning") ||
        lowerKey.includes("wait") ||
        lowerKey.includes("review") ||
        lowerKey.includes("hold") ||
        lowerKey.includes("progress") ||
        lowerKey.includes("queue")
    ) {
        return "#f59e0b";
    }

    // 4. Draft / New / Prepare / Initial keys -> Blue
    if (
        lowerKey.includes("draft") ||
        lowerKey.includes("new") ||
        lowerKey.includes("prepare") ||
        lowerKey.includes("init") ||
        lowerKey.includes("plan")
    ) {
        return "#3b82f6";
    }

    // 5. Stable color hashing for other statuses (beautiful HSL pastel colors)
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) % 1000000;
    }
    const hue = hash % 360;
    return `hsl(${hue}, 65%, 50%)`;
}

function App() {
    // ----------------------------------------------------
    // Mendix Properties Simulator States
    // ----------------------------------------------------
    const [selectionMode, setSelectionMode] = useState<"single" | "multi">("single");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // New v3.8.0 Data Source Mode simulation states
    const [source, setSource] = useState<"context" | "database">("context");
    const [sourceType, setSourceType] = useState<"association" | "enumeration" | "boolean">("association");
    const sourceMode = source === "database" ? "association" : sourceType;
    const [booleanTrueLabel, setBooleanTrueLabel] = useState("Yes");
    const [booleanFalseLabel, setBooleanFalseLabel] = useState("No");
    const [booleanOutputFormat, setBooleanOutputFormat] = useState<"boolean" | "string">("boolean");
    const [booleanTrueValue, setBooleanTrueValue] = useState("true");
    const [booleanFalseValue, setBooleanFalseValue] = useState("false");

    // Premium upgrades simulator states
    const [tagStyle, setTagStyle] = useState<"pill" | "avatar">("pill");
    const [showSubtitles, setShowSubtitles] = useState(true);
    const [showGroups, setShowGroups] = useState(true);
    const [showAvatars, setShowAvatars] = useState(true);
    const [showColors, setShowColors] = useState(true);

    // New v3.2.0 simulation states
    const [sortOrder, setSortOrder] = useState<"none" | "asc" | "desc">("none");
    const [sortField, setSortField] = useState<"label" | "detail" | "group">("label");
    const [singleSelectStyle, setSingleSelectStyle] = useState<"text" | "pill" | "rich">("text");
    const [showSelectedAvatar, setShowSelectedAvatar] = useState(true);
    const [dropdownLayout, setDropdownLayout] = useState<"list" | "grid">("list");
    const [optionAvatarShape, setOptionAvatarShape] = useState<"circle" | "rounded" | "square">("circle");
    const [showOptionCheckbox, setShowOptionCheckbox] = useState(false);
    const [highlightColorMode, setHighlightColorMode] = useState<"accent" | "optionColor">("accent");

    // New v3.3.0 Simulation States
    const [maxVisibleTags, setMaxVisibleTags] = useState(2);
    const [searchHighlightColor, setSearchHighlightColor] = useState("#f43f5e");
    const [hasCreateAction, setHasCreateAction] = useState(true);
    const [onCreateText, setOnCreateText] = useState("+ Add '{value}' dynamically");

    // New v3.4.0 Simulation States
    const [showSelectAll, setShowSelectAll] = useState(true);
    const [selectAllText, setSelectAllText] = useState("เลือกทั้งหมด / Select All");
    const [deselectAllText, setDeselectAllText] = useState("ล้างทั้งหมด / Deselect All");

    // Delimited String simulator states
    const [delimiter, setDelimiter] = useState(",");
    const [simulatedStringVal, setSimulatedStringVal] = useState("");

    // Dataset and Loader States
    const [datasetKey, setDatasetKey] = useState<keyof typeof DATASETS>("fruits");
    const [optionsList, setOptionsList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

    // Set optionsList on dataset switch
    useEffect(() => {
        setOptionsList(DATASETS[datasetKey]);
    }, [datasetKey]);

    // Aesthetics Config
    const [placeholder, setPlaceholder] = useState("ค้นหาและเลือกข้อมูล...");
    const [accentColor, setAccentColor] = useState("#3b82f6");
    const [borderRadius, setBorderRadius] = useState("16px");
    const [bgBlur, setBgBlur] = useState("16px");
    const [popoverBg, setPopoverBg] = useState("rgba(15, 23, 42, 0.85)");
    const [maxDropdownHeight, setMaxDropdownHeight] = useState("250px");

    // Translations
    const [noOptionsMessage, setNoOptionsMessage] = useState("ไม่พบตัวเลือกที่ค้นหา");
    const [loadingMessage, setLoadingMessage] = useState("กำลังโหลดข้อมูล...");
    const [clearButtonTitle, setClearButtonTitle] = useState("ล้างตัวเลือกทั้งหมด");

    // New Advanced Search Config States
    const [searchMethod, setSearchMethod] = useState<"contains" | "startsWith" | "endsWith" | "equals" | "fuzzy">("contains");
    const [searchCaseSensitive, setSearchCaseSensitive] = useState(false);
    const [maxSearchResults, setMaxSearchResults] = useState(0);
    const [searchDebounce, setSearchDebounce] = useState(300);

    // Form Statuses
    const [readOnly, setReadOnly] = useState(false);
    const [required, setRequired] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorText, setErrorText] = useState("กรุณาเลือกข้อมูลให้ครบถ้วน");

    // Collapsible Panel State
    const [openTab, setOpenTab] = useState<string>("general");

    // Get Active Options list based on simulation controls and sourceMode
    let activeOptions: any[] = [];
    if (isEmpty) {
        activeOptions = [];
    } else if (sourceMode === "association") {
        activeOptions = optionsList.map(opt => ({
            ...opt,
            subtitle: showSubtitles ? opt.subtitle : undefined,
            groupName: showGroups ? (opt as any).groupName : undefined,
            imageUrl: showAvatars ? (opt as any).imageUrl : undefined,
            colorCode: showColors ? (opt as any).colorCode : undefined
        }));
    } else if (sourceMode === "enumeration") {
        activeOptions = [
            { id: "draft", label: "แบบร่าง / Draft", colorCode: getSmartEnumColor("draft"), rawObject: "draft" },
            { id: "submitted", label: "ส่งแล้ว / Submitted", colorCode: getSmartEnumColor("submitted"), rawObject: "submitted" },
            { id: "approved", label: "อนุมัติแล้ว / Approved", colorCode: getSmartEnumColor("approved"), rawObject: "approved" },
            { id: "rejected", label: "ปฏิเสธ / Rejected", colorCode: getSmartEnumColor("rejected"), rawObject: "rejected" }
        ];
    } else if (sourceMode === "boolean") {
        activeOptions = [
            { id: "true", label: booleanTrueLabel || "Yes", colorCode: "#10b981", rawObject: true },
            { id: "false", label: booleanFalseLabel || "No", colorCode: "#ef4444", rawObject: false }
        ];
    }

    // Apply sorting in playground if simulated
    if (sortOrder && sortOrder !== "none") {
        const fieldKey = sortField || "label";
        activeOptions = [...activeOptions].sort((a, b) => {
            let valA = "";
            let valB = "";
            
            if (fieldKey === "label") {
                valA = a.label;
                valB = b.label;
            } else if (fieldKey === "detail") {
                valA = a.subtitle || "";
                valB = b.subtitle || "";
            } else if (fieldKey === "group") {
                valA = a.groupName || "";
                valB = b.groupName || "";
            }
            
            const comparison = valA.localeCompare(valB, undefined, { sensitivity: "base", numeric: true });
            return sortOrder === "asc" ? comparison : -comparison;
        });
    }

    // Reset selected IDs when changing selection modes to prevent overflow
    useEffect(() => {
        setSelectedIds([]);
    }, [selectionMode]);

    // Bidirectional sync: Sync from selectedIds -> simulatedStringVal
    useEffect(() => {
        const delim = delimiter || ",";
        if (sourceMode === "boolean") {
            if (selectedIds.length > 0) {
                const isTrue = selectedIds[0] === "true";
                if (booleanOutputFormat === "string") {
                    setSimulatedStringVal(isTrue ? booleanTrueValue || "true" : booleanFalseValue || "false");
                } else {
                    setSimulatedStringVal(isTrue ? "true (boolean)" : "false (boolean)");
                }
            } else {
                setSimulatedStringVal("");
            }
        } else if (sourceMode === "enumeration") {
            if (selectedIds.length > 0) {
                setSimulatedStringVal(selectedIds[0]);
            } else {
                setSimulatedStringVal("");
            }
        } else {
            if (selectionMode === "single") {
                if (selectedIds.length > 0) {
                    const opt = optionsList.find(o => o.id === selectedIds[0]);
                    setSimulatedStringVal(opt ? opt.label : "");
                } else {
                    setSimulatedStringVal("");
                }
            } else {
                const serialized = selectedIds
                    .map(id => {
                        const opt = optionsList.find(o => o.id === id);
                        return opt ? opt.label : id;
                    })
                    .join(delim + " ");
                setSimulatedStringVal(serialized);
            }
        }
    }, [selectedIds, delimiter, optionsList, selectionMode, sourceMode, booleanOutputFormat, booleanTrueValue, booleanFalseValue]);

    // Bidirectional sync: Parse manually typed string attribute values back into selectedIds
    const handleStringValChange = (val: string) => {
        setSimulatedStringVal(val);
        const trimmed = val.trim();
        if (trimmed === "") {
            setSelectedIds([]);
            return;
        }

        if (sourceMode === "boolean") {
            const isTrueMatch =
                trimmed.toLowerCase() === "true" ||
                trimmed.toLowerCase() === (booleanTrueLabel || "yes").toLowerCase() ||
                trimmed === booleanTrueValue;
            const isFalseMatch =
                trimmed.toLowerCase() === "false" ||
                trimmed.toLowerCase() === (booleanFalseLabel || "no").toLowerCase() ||
                trimmed === booleanFalseValue;
            if (isTrueMatch) {
                setSelectedIds(["true"]);
            } else if (isFalseMatch) {
                setSelectedIds(["false"]);
            } else {
                setSelectedIds([]);
            }
        } else if (sourceMode === "enumeration") {
            const matched = activeOptions.find(
                o => o.id.toLowerCase() === trimmed.toLowerCase() || o.label.toLowerCase() === trimmed.toLowerCase()
            );
            if (matched) {
                setSelectedIds([matched.id]);
            } else {
                setSelectedIds([]);
            }
        } else {
            const delim = delimiter || ",";
            if (selectionMode === "single") {
                const matched = optionsList.find(o => o.id === trimmed || o.label === trimmed);
                if (matched) {
                    setSelectedIds([matched.id]);
                } else {
                    setSelectedIds([]);
                }
            } else {
                const tokens = val.split(delim).map(t => t.trim());
                const matchedIds: string[] = [];
                tokens.forEach(token => {
                    const matched = optionsList.find(o => o.id === token || o.label === token);
                    if (matched && !matchedIds.includes(matched.id)) {
                        matchedIds.push(matched.id);
                    }
                });
                setSelectedIds(matchedIds);
            }
        }
    };

    // Handle Selection changes
    const handleSelect = (id: string) => {
        if (selectionMode === "single") {
            setSelectedIds([id]);
        } else {
            if (!selectedIds.includes(id)) {
                setSelectedIds([...selectedIds, id]);
            }
        }
    };

    const handleRemove = (id: string) => {
        setSelectedIds(selectedIds.filter(x => x !== id));
    };

    const handleClear = () => {
        setSelectedIds([]);
    };

    // Simulate database creation and instant selection
    const handleCreateOption = (text: string) => {
        const newId = `created_${Date.now()}`;
        const newOption = {
            id: newId,
            label: text,
            subtitle: `สร้างขึ้นด่วนผ่าน Inline Creator | ID: ${newId}`,
            groupName: "รายการที่สร้างใหม่ (Newly Created)",
            colorCode: "#a855f7",
            imageUrl: undefined,
            rawObject: { id: newId, isCreated: true }
        };
        setOptionsList(prev => [...prev, newOption]);
        
        if (selectionMode === "single") {
            setSelectedIds([newId]);
        } else {
            setSelectedIds(prev => [...prev, newId]);
        }
    };

    return (
        <div
            style={{ display: "flex", minHeight: "100vh", background: "#090d16", color: "#f8fafc", overflow: "hidden" }}
        >
            {/* ----------------------------------------------------
                LEFT SIDEBAR: Mendix Properties Simulator
               ---------------------------------------------------- */}
            <aside
                style={{
                    width: "360px",
                    background: "#0f172a",
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                    flexShrink: 0
                }}
            >
                {/* Sidebar Title Header */}
                <div
                    style={{
                        padding: "20px",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        background: "rgba(15, 23, 42, 0.6)"
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                            style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "#10b981",
                                boxShadow: "0 0 8px #10b981"
                            }}
                        ></div>
                        <span
                            style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                color: "#10b981",
                                letterSpacing: "0.05em",
                                textTransform: "uppercase"
                            }}
                        >
                            Mendix Simulation Panel
                        </span>
                    </div>
                    <h2 style={{ fontSize: "16px", margin: "4px 0 0 0", color: "#cbd5e1" }}>PwbComboBox Properties</h2>
                </div>

                {/* Property Categories (Accordion) */}
                <div style={{ flex: 1, padding: "12px" }}>
                    {/* Category 0: Data Source Mode Simulator */}
                    <div
                        style={{
                            marginBottom: "10px",
                            borderRadius: "10px",
                            overflow: "hidden",
                            background: openTab === "dataSourceMode" ? "rgba(255,255,255,0.02)" : "transparent"
                        }}
                    >
                        <button
                            onClick={() => setOpenTab(openTab === "dataSourceMode" ? "" : "dataSourceMode")}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "none",
                                background: "rgba(255,255,255,0.04)",
                                color: "#38bdf8",
                                display: "flex",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: "bold",
                                textAlign: "left"
                            }}
                        >
                            <span>⚡ 0. Data Source Mode Simulator</span>
                            <span>{openTab === "dataSourceMode" ? "▲" : "▼"}</span>
                        </button>
                        {openTab === "dataSourceMode" && (
                            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                                <label
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "6px",
                                        fontSize: "12px",
                                        color: "#94a3b8"
                                    }}
                                >
                                    <span>Source (แหล่งข้อมูล)</span>
                                    <select
                                        value={source}
                                        onChange={e => {
                                            setSource(e.target.value as any);
                                            setSelectedIds([]);
                                        }}
                                        style={{
                                            background: "#1e293b",
                                            color: "#f8fafc",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "8px",
                                            padding: "8px",
                                            outline: "none",
                                            fontSize: "12px"
                                        }}
                                    >
                                        <option value="context">Context (บริบทหน้าจอ)</option>
                                        <option value="database">Database (ดึงจากฐานข้อมูล)</option>
                                    </select>
                                </label>

                                {source === "context" && (
                                    <label
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "6px",
                                            fontSize: "12px",
                                            color: "#94a3b8"
                                        }}
                                    >
                                        <span>Type (ประเภทข้อมูล)</span>
                                        <select
                                            value={sourceType}
                                            onChange={e => {
                                                setSourceType(e.target.value as any);
                                                setSelectedIds([]);
                                            }}
                                            style={{
                                                background: "#1e293b",
                                                color: "#f8fafc",
                                                border: "1px solid rgba(255,255,255,0.06)",
                                                borderRadius: "8px",
                                                padding: "8px",
                                                outline: "none",
                                                fontSize: "12px"
                                            }}
                                        >
                                            <option value="association">Association (สมาคมข้อมูล)</option>
                                            <option value="enumeration">Enumeration (ตัวเลือก Enum)</option>
                                            <option value="boolean">Boolean (ค่าจริง/เท็จ)</option>
                                        </select>
                                    </label>
                                )}

                                {sourceMode === "association" && (
                                    <label
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "6px",
                                            fontSize: "12px",
                                            color: "#94a3b8"
                                        }}
                                    >
                                        <span>Active Dataset (Association)</span>
                                        <select
                                            value={datasetKey}
                                            onChange={e => setDatasetKey(e.target.value as any)}
                                            style={{
                                                background: "#1e293b",
                                                color: "#f8fafc",
                                                border: "1px solid rgba(255,255,255,0.06)",
                                                borderRadius: "8px",
                                                padding: "8px",
                                                outline: "none",
                                                fontSize: "12px"
                                            }}
                                        >
                                            <option value="fruits">Fruits & Veggies (10 items)</option>
                                            <option value="tech">Tech Stacks (12 items)</option>
                                            <option value="massive">Massive Database (1,000 items)</option>
                                        </select>
                                    </label>
                                )}

                                {sourceMode === "enumeration" && (
                                    <div
                                        style={{
                                            padding: "10px",
                                            background: "rgba(56, 189, 248, 0.05)",
                                            border: "1px solid rgba(56, 189, 248, 0.1)",
                                            borderRadius: "8px",
                                            fontSize: "11px",
                                            color: "#38bdf8",
                                            lineHeight: "1.4"
                                        }}
                                    >
                                        💡 <b>Enumeration Mode</b>: ดึงค่าตัวเลือกตรงจากโปรเจกต์ Mendix ผ่าน universe API (จำลองจักรวาลตัวเลือก: Draft, Submitted, Approved, Rejected)
                                    </div>
                                )}

                                {sourceMode === "boolean" && (
                                    <>
                                        <label
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "6px",
                                                fontSize: "12px",
                                                color: "#94a3b8"
                                            }}
                                        >
                                            <span>Yes / True Display Label</span>
                                            <input
                                                type="text"
                                                value={booleanTrueLabel}
                                                onChange={e => setBooleanTrueLabel(e.target.value)}
                                                style={{
                                                    background: "#1e293b",
                                                    color: "#f8fafc",
                                                    border: "1px solid rgba(255,255,255,0.06)",
                                                    borderRadius: "8px",
                                                    padding: "8px",
                                                    outline: "none",
                                                    fontSize: "12px"
                                                }}
                                            />
                                        </label>
                                        <label
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "6px",
                                                fontSize: "12px",
                                                color: "#94a3b8"
                                            }}
                                        >
                                            <span>No / False Display Label</span>
                                            <input
                                                type="text"
                                                value={booleanFalseLabel}
                                                onChange={e => setBooleanFalseLabel(e.target.value)}
                                                style={{
                                                    background: "#1e293b",
                                                    color: "#f8fafc",
                                                    border: "1px solid rgba(255,255,255,0.06)",
                                                    borderRadius: "8px",
                                                    padding: "8px",
                                                    outline: "none",
                                                    fontSize: "12px"
                                                }}
                                            />
                                        </label>
                                        <label
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "6px",
                                                fontSize: "12px",
                                                color: "#94a3b8"
                                            }}
                                        >
                                            <span>Output Value Format</span>
                                            <select
                                                value={booleanOutputFormat}
                                                onChange={e => setBooleanOutputFormat(e.target.value as any)}
                                                style={{
                                                    background: "#1e293b",
                                                    color: "#f8fafc",
                                                    border: "1px solid rgba(255,255,255,0.06)",
                                                    borderRadius: "8px",
                                                    padding: "8px",
                                                    outline: "none",
                                                    fontSize: "12px"
                                                }}
                                            >
                                                <option value="boolean">Boolean Type (true / false)</option>
                                                <option value="string">String Key Type (Custom values)</option>
                                            </select>
                                        </label>
                                        {booleanOutputFormat === "string" && (
                                            <>
                                                <label
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "6px",
                                                        fontSize: "12px",
                                                        color: "#94a3b8"
                                                    }}
                                                >
                                                    <span>True String Value Key</span>
                                                    <input
                                                        type="text"
                                                        value={booleanTrueValue}
                                                        onChange={e => setBooleanTrueValue(e.target.value)}
                                                        style={{
                                                            background: "#1e293b",
                                                            color: "#f8fafc",
                                                            border: "1px solid rgba(255,255,255,0.06)",
                                                            borderRadius: "8px",
                                                            padding: "8px",
                                                            outline: "none",
                                                            fontSize: "12px"
                                                        }}
                                                    />
                                                </label>
                                                <label
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "6px",
                                                        fontSize: "12px",
                                                        color: "#94a3b8"
                                                    }}
                                                >
                                                    <span>False String Value Key</span>
                                                    <input
                                                        type="text"
                                                        value={booleanFalseValue}
                                                        onChange={e => setBooleanFalseValue(e.target.value)}
                                                        style={{
                                                            background: "#1e293b",
                                                            color: "#f8fafc",
                                                            border: "1px solid rgba(255,255,255,0.06)",
                                                            borderRadius: "8px",
                                                            padding: "8px",
                                                            outline: "none",
                                                            fontSize: "12px"
                                                        }}
                                                    />
                                                </label>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Category 1: General Options */}
                    <div
                        style={{
                            marginBottom: "10px",
                            borderRadius: "10px",
                            overflow: "hidden",
                            background: openTab === "general" ? "rgba(255,255,255,0.02)" : "transparent"
                        }}
                    >
                        <button
                            onClick={() => setOpenTab(openTab === "general" ? "" : "general")}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "none",
                                background: "rgba(255,255,255,0.04)",
                                color: "#cbd5e1",
                                display: "flex",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: "bold",
                                textAlign: "left"
                            }}
                        >
                            <span>1. Selection & Datasource</span>
                            <span>{openTab === "general" ? "▲" : "▼"}</span>
                        </button>
                        {openTab === "general" && (
                            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                                <label
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "6px",
                                        fontSize: "12px",
                                        color: "#94a3b8"
                                    }}
                                >
                                    <span>Selection Mode (รูปแบบการเลือก)</span>
                                    <select
                                        value={selectionMode}
                                        onChange={e => setSelectionMode(e.target.value as "single" | "multi")}
                                        style={{
                                            background: "#1e293b",
                                            color: "#f8fafc",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "8px",
                                            padding: "8px",
                                            outline: "none"
                                        }}
                                    >
                                        <option value="single">Single (เลือกชิ้นเดียว)</option>
                                        <option value="multi">Multi (เลือกได้หลายแท็ก badge)</option>
                                    </select>
                                </label>

                                {selectionMode === "single" && (
                                    <label
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "6px",
                                            fontSize: "12px",
                                            color: "#94a3b8"
                                        }}
                                    >
                                        <span>Single Select Style (สไตล์แสดงรายการเดี่ยว)</span>
                                        <select
                                            value={singleSelectStyle}
                                            onChange={e => setSingleSelectStyle(e.target.value as "text" | "pill" | "rich")}
                                            style={{
                                                background: "#1e293b",
                                                color: "#f8fafc",
                                                border: "1px solid rgba(255,255,255,0.06)",
                                                borderRadius: "8px",
                                                padding: "8px",
                                                outline: "none"
                                            }}
                                        >
                                            <option value="text">Standard Text Field (ช่องรับส่งข้อความ)</option>
                                            <option value="pill">Removable Pill (ป้ายแกะลบได้)</option>
                                            <option value="rich">Premium Rich Card (การ์ดรูปภาพเด่นเต็มแถว)</option>
                                        </select>
                                    </label>
                                )}

                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <input
                                        id="showSelectedAvatarCheck"
                                        type="checkbox"
                                        checked={showSelectedAvatar}
                                        onChange={e => setShowSelectedAvatar(e.target.checked)}
                                        style={{ cursor: "pointer" }}
                                    />
                                    <label
                                        htmlFor="showSelectedAvatarCheck"
                                        style={{
                                            fontSize: "12px",
                                            color: "#cbd5e1",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Show Selected Avatar (แสดงอวตารป้ายเลือก)
                                    </label>
                                </div>

                                <label
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "6px",
                                        fontSize: "12px",
                                        color: "#94a3b8",
                                        borderTop: "1px solid rgba(255,255,255,0.05)",
                                        paddingTop: "10px",
                                        marginTop: "4px"
                                    }}
                                >
                                    <span>Sort Options Order (จัดเรียงลำดับตัวเลือก)</span>
                                    <select
                                        value={sortOrder}
                                        onChange={e => setSortOrder(e.target.value as "none" | "asc" | "desc")}
                                        style={{
                                            background: "#1e293b",
                                            color: "#f8fafc",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "8px",
                                            padding: "8px",
                                            outline: "none"
                                        }}
                                    >
                                        <option value="none">None (เรียงตาม Datasource)</option>
                                        <option value="asc">Ascending Alphabetical (A-Z / ก-ฮ)</option>
                                        <option value="desc">Descending Alphabetical (Z-A / ฮ-ก)</option>
                                    </select>
                                </label>

                                <label
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "6px",
                                        fontSize: "12px",
                                        color: "#94a3b8",
                                        marginTop: "8px"
                                    }}
                                >
                                    <span>Sort Option Field (ฟิลด์ที่ต้องการจัดเรียง)</span>
                                    <select
                                        value={sortField}
                                        onChange={e => setSortField(e.target.value as "label" | "detail" | "group")}
                                        style={{
                                            background: "#1e293b",
                                            color: "#f8fafc",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "8px",
                                            padding: "8px",
                                            outline: "none"
                                        }}
                                    >
                                        <option value="label">Option Label (ชื่อหลัก)</option>
                                        <option value="detail">Option Detail / Subtitle (รายละเอียดแถวย่อย)</option>
                                        <option value="group">Option Group Category (ชื่อกลุ่มหมวดหมู่)</option>
                                    </select>
                                </label>



                                {selectionMode === "multi" && (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px"
                                        }}
                                    >
                                        <label
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "6px",
                                                fontSize: "12px",
                                                color: "#94a3b8"
                                            }}
                                        >
                                            <span>Tag Pill Style (สไตล์ของป้ายแท็ก)</span>
                                            <select
                                                value={tagStyle}
                                                onChange={e => setTagStyle(e.target.value as "pill" | "avatar")}
                                                style={{
                                                    background: "#1e293b",
                                                    color: "#f8fafc",
                                                    border: "1px solid rgba(255,255,255,0.06)",
                                                    borderRadius: "8px",
                                                    padding: "8px",
                                                    outline: "none"
                                                }}
                                            >
                                                <option value="pill">Standard Pill (ป้ายแท็กปกติ)</option>
                                                <option value="avatar">Avatar Circle (มีวงกลมรูปอักษรย่อ)</option>
                                            </select>
                                        </label>

                                        <div
                                            style={{
                                                borderTop: "1px solid rgba(255,255,255,0.05)",
                                                paddingTop: "10px",
                                                marginTop: "4px",
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "8px"
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <input
                                                    id="showSelectAllCheck"
                                                    type="checkbox"
                                                    checked={showSelectAll}
                                                    onChange={e => setShowSelectAll(e.target.checked)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                                <label
                                                    htmlFor="showSelectAllCheck"
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#cbd5e1",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Show Select All Bar (แสดงแถบเลือกทั้งหมด)
                                                </label>
                                            </div>

                                            {showSelectAll && (
                                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                                    <label
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: "4px",
                                                            fontSize: "11px",
                                                            color: "#94a3b8"
                                                        }}
                                                    >
                                                        <span>Select All Label Text</span>
                                                        <input
                                                            type="text"
                                                            value={selectAllText}
                                                            onChange={e => setSelectAllText(e.target.value)}
                                                            style={{
                                                                background: "#1e293b",
                                                                color: "#f8fafc",
                                                                border: "1px solid rgba(255,255,255,0.06)",
                                                                borderRadius: "8px",
                                                                padding: "8px",
                                                                outline: "none",
                                                                fontSize: "12px"
                                                            }}
                                                        />
                                                    </label>
                                                    <label
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: "4px",
                                                            fontSize: "11px",
                                                            color: "#94a3b8"
                                                        }}
                                                    >
                                                        <span>Deselect All Label Text</span>
                                                        <input
                                                            type="text"
                                                            value={deselectAllText}
                                                            onChange={e => setDeselectAllText(e.target.value)}
                                                            style={{
                                                                background: "#1e293b",
                                                                color: "#f8fafc",
                                                                border: "1px solid rgba(255,255,255,0.06)",
                                                                borderRadius: "8px",
                                                                padding: "8px",
                                                                outline: "none",
                                                                fontSize: "12px"
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {selectionMode === "multi" && (
                                    <label
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "6px",
                                            fontSize: "12px",
                                            color: "#94a3b8"
                                        }}
                                    >
                                        <span>Delimiter (เครื่องหมายคั่น String)</span>
                                        <select
                                            value={delimiter}
                                            onChange={e => setDelimiter(e.target.value)}
                                            style={{
                                                background: "#1e293b",
                                                color: "#f8fafc",
                                                border: "1px solid rgba(255,255,255,0.06)",
                                                borderRadius: "8px",
                                                padding: "8px",
                                                outline: "none"
                                            }}
                                        >
                                            <option value=",">Comma ( , )</option>
                                            <option value=";">Semicolon ( ; )</option>
                                            <option value="|">Pipe ( | )</option>
                                        </select>
                                    </label>
                                )}

                                <label
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "6px",
                                        fontSize: "12px",
                                        color: "#94a3b8"
                                    }}
                                >
                                    <span>Simulated Dataset (ชุดข้อมูลจำลอง)</span>
                                    <select
                                        value={datasetKey}
                                        onChange={e => setDatasetKey(e.target.value as keyof typeof DATASETS)}
                                        style={{
                                            background: "#1e293b",
                                            color: "#f8fafc",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "8px",
                                            padding: "8px",
                                            outline: "none"
                                        }}
                                    >
                                        <option value="fruits">Fruits & Sweets 🍎🍌🍊</option>
                                        <option value="tech">Developer Tech Stacks ⚛️🐍🚀</option>
                                        <option value="provinces">Thai Provinces 🇹🇭🏙️🌴</option>
                                        <option value="massive">Large Dataset Simulator (1,000 items) ⚡📦</option>
                                    </select>
                                </label>

                                <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                                    <label
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            fontSize: "12px",
                                            color: "#cbd5e1",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isLoading}
                                            onChange={e => setIsLoading(e.target.checked)}
                                        />
                                        <span>Simulate Loading</span>
                                    </label>
                                    <label
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            fontSize: "12px",
                                            color: "#cbd5e1",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isEmpty}
                                            onChange={e => setIsEmpty(e.target.checked)}
                                        />
                                        <span>Force Empty Dataset</span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Category 2: Spectacular Upgrades Customizer (NEW v2.2.0) */}
                    <div
                        style={{
                            marginBottom: "10px",
                            borderRadius: "10px",
                            overflow: "hidden",
                            background: openTab === "spectacular" ? "rgba(255,255,255,0.02)" : "transparent"
                        }}
                    >
                        <button
                            onClick={() => setOpenTab(openTab === "spectacular" ? "" : "spectacular")}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "none",
                                background: "rgba(255,255,255,0.04)",
                                color: "#cbd5e1",
                                display: "flex",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: "bold",
                                textAlign: "left"
                            }}
                        >
                            <span>2. Spectacular Upgrades 🚀</span>
                            <span>{openTab === "spectacular" ? "▲" : "▼"}</span>
                        </button>
                        {openTab === "spectacular" && (
                            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        fontSize: "12px",
                                        color: "#cbd5e1",
                                        cursor: "pointer"
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={showSubtitles}
                                        onChange={e => setShowSubtitles(e.target.checked)}
                                    />
                                    <span>Show Subtitles (แสดงรายละเอียดแถวย่อย)</span>
                                </label>

                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        fontSize: "12px",
                                        color: "#cbd5e1",
                                        cursor: "pointer"
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={showGroups}
                                        onChange={e => setShowGroups(e.target.checked)}
                                    />
                                    <span>Group Options by Category (จัดกลุ่มตัวเลือกตามประเภท)</span>
                                </label>

                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        fontSize: "12px",
                                        color: "#cbd5e1",
                                        cursor: "pointer"
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={showAvatars}
                                        onChange={e => setShowAvatars(e.target.checked)}
                                    />
                                    <span>Render Avatar Images (แสดงภาพอวาตาร์จริง)</span>
                                </label>

                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        fontSize: "12px",
                                        color: "#cbd5e1",
                                        cursor: "pointer"
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={showColors}
                                        onChange={e => setShowColors(e.target.checked)}
                                    />
                                    <span>Dynamic Tag Colors (ระบายสีตามประเภท)</span>
                                </label>

                                <div
                                    style={{
                                        borderTop: "1px solid rgba(255,255,255,0.05)",
                                        paddingTop: "10px",
                                        marginTop: "4px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "10px"
                                    }}
                                >
                                    <label
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "4px",
                                            fontSize: "12px",
                                            color: "#94a3b8"
                                        }}
                                    >
                                        <span>Dropdown List Layout (เลย์เอาต์ลิสต์ตัวเลือก)</span>
                                        <select
                                            value={dropdownLayout}
                                            onChange={e => setDropdownLayout(e.target.value as "list" | "grid")}
                                            style={{
                                                background: "#1e293b",
                                                color: "#f8fafc",
                                                border: "1px solid rgba(255,255,255,0.06)",
                                                borderRadius: "8px",
                                                padding: "8px",
                                                outline: "none"
                                            }}
                                        >
                                            <option value="list">Standard Row List (แถวเดี่ยวตามตั้ง)</option>
                                            <option value="grid">Compact 2-Column Grid Cards (การ์ดตารางสองแถว)</option>
                                        </select>
                                    </label>

                                    <label
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "4px",
                                            fontSize: "12px",
                                            color: "#94a3b8"
                                        }}
                                    >
                                        <span>Option Avatar Shape (รูปทรงอวตาร/รูปสินค้า)</span>
                                        <select
                                            value={optionAvatarShape}
                                            onChange={e => setOptionAvatarShape(e.target.value as "circle" | "rounded" | "square")}
                                            style={{
                                                background: "#1e293b",
                                                color: "#f8fafc",
                                                border: "1px solid rgba(255,255,255,0.06)",
                                                borderRadius: "8px",
                                                padding: "8px",
                                                outline: "none"
                                            }}
                                        >
                                            <option value="circle">Circular (วงกลมคลาสสิก)</option>
                                            <option value="rounded">Rounded Square (สี่เหลี่ยมเปียกมุม Squircle)</option>
                                            <option value="square">Sharp Square (สี่เหลี่ยมขอบคมตัด)</option>
                                        </select>
                                    </label>

                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <input
                                            id="showOptionCheckboxCheck"
                                            type="checkbox"
                                            checked={showOptionCheckbox}
                                            onChange={e => setShowOptionCheckbox(e.target.checked)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        <label
                                            htmlFor="showOptionCheckboxCheck"
                                            style={{
                                                fontSize: "12px",
                                                color: "#cbd5e1",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Show Left Option Checkbox/Radio
                                        </label>
                                    </div>

                                    <label
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "4px",
                                            fontSize: "12px",
                                            color: "#94a3b8"
                                        }}
                                    >
                                        <span>Hover Highlight Color Mode</span>
                                        <select
                                            value={highlightColorMode}
                                            onChange={e => setHighlightColorMode(e.target.value as "accent" | "optionColor")}
                                            style={{
                                                background: "#1e293b",
                                                color: "#f8fafc",
                                                border: "1px solid rgba(255,255,255,0.06)",
                                                borderRadius: "8px",
                                                padding: "8px",
                                                outline: "none"
                                            }}
                                        >
                                            <option value="accent">Universal Accent Color (สีแบรนด์เด่นหลัก)</option>
                                            <option value="optionColor">Dynamic Option Color (ใช้รหัสสีกำกับตัวเลือก)</option>
                                        </select>
                                    </label>

                                    {/* Collapsible tags limit */}
                                    {selectionMode === "multi" && (
                                        <label
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "4px",
                                                fontSize: "12px",
                                                color: "#94a3b8",
                                                marginTop: "8px"
                                            }}
                                        >
                                            <span>Max Visible Tags (จำนวนแท็กสูงสุดที่แสดงก่อนย่อ)</span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={maxVisibleTags}
                                                onChange={e => setMaxVisibleTags(parseInt(e.target.value) || 0)}
                                                style={{
                                                    background: "#1e293b",
                                                    color: "#f8fafc",
                                                    border: "1px solid rgba(255,255,255,0.06)",
                                                    borderRadius: "8px",
                                                    padding: "8px",
                                                    outline: "none",
                                                    fontSize: "12px"
                                                }}
                                            />
                                        </label>
                                    )}

                                    {/* Inline Option Creator Action */}
                                    <div
                                        style={{
                                            borderTop: "1px solid rgba(255,255,255,0.05)",
                                            paddingTop: "10px",
                                            marginTop: "12px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "8px"
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <input
                                                id="hasCreateActionCheck"
                                                type="checkbox"
                                                checked={hasCreateAction}
                                                onChange={e => setHasCreateAction(e.target.checked)}
                                                style={{ cursor: "pointer" }}
                                            />
                                            <label
                                                htmlFor="hasCreateActionCheck"
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#cbd5e1",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Enable Inline Option Creator (เปิดโหมดสร้างตัวเลือกด่วน)
                                            </label>
                                        </div>

                                        {hasCreateAction && (
                                            <label
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "4px",
                                                    fontSize: "11px",
                                                    color: "#94a3b8"
                                                }}
                                            >
                                                <span>Create Button Text Template</span>
                                                <input
                                                    type="text"
                                                    value={onCreateText}
                                                    onChange={e => setOnCreateText(e.target.value)}
                                                    style={{
                                                        background: "#1e293b",
                                                        color: "#f8fafc",
                                                        border: "1px solid rgba(255,255,255,0.06)",
                                                        borderRadius: "8px",
                                                        padding: "8px",
                                                        outline: "none",
                                                        fontSize: "12px"
                                                    }}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>


                                <span
                                    style={{
                                        fontSize: "11px",
                                        color: "#64748b",
                                        fontStyle: "italic",
                                        lineHeight: "1.4"
                                    }}
                                >
                                    💡 ฟีเจอร์พรีเมียมแบบ Enterprise (v3.0.0): จัดกลุ่มสินค้าโดย collapsible headers,
                                    ระบายสีแท็กด้วย colors expression และรองรับรูปภาพ Profile/Product จริงพร้อมระบบ initials fallback!
                                </span>

                                <div
                                    style={{
                                        borderTop: "1px solid rgba(255,255,255,0.05)",
                                        paddingTop: "10px",
                                        marginTop: "4px"
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "11px",
                                            color: "#10b981",
                                            fontWeight: "bold",
                                            textTransform: "uppercase"
                                        }}
                                    >
                                        ⚡ Large List Lazy Loading:
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "11px",
                                            color: "#64748b",
                                            marginTop: "4px",
                                            lineHeight: "1.4"
                                        }}
                                    >
                                        เมื่อเลือกชุดข้อมูล **Large Dataset (1,000 items)**
                                        แคนวาสด้านขวาจะโหลดลิสต์ขึ้นมาทันทีและใช้สไลซ์เลดี้โหลด (Lazy-scroll)
                                        ช่วยให้การแสดงผลลื่นไหล 60 FPS ไร้อาการสะดุด
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Category 3: Delimited String Attribute Simulator */}
                    <div
                        style={{
                            marginBottom: "10px",
                            borderRadius: "10px",
                            overflow: "hidden",
                            background: openTab === "attribute" ? "rgba(255,255,255,0.02)" : "transparent"
                        }}
                    >
                        <button
                            onClick={() => setOpenTab(openTab === "attribute" ? "" : "attribute")}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "none",
                                background: "rgba(255,255,255,0.04)",
                                color: "#cbd5e1",
                                display: "flex",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: "bold",
                                textAlign: "left"
                            }}
                        >
                            <span>3. Delimited String Attribute Simulator</span>
                            <span>{openTab === "attribute" ? "▲" : "▼"}</span>
                        </button>
                        {openTab === "attribute" && (
                            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                                <label
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "6px",
                                        fontSize: "12px",
                                        color: "#94a3b8"
                                    }}
                                >
                                    <span>String Attribute Value (แก้ไขเพื่อจำลองการดึงค่า)</span>
                                    <input
                                        type="text"
                                        value={simulatedStringVal}
                                        onChange={e => handleStringValChange(e.target.value)}
                                        placeholder={
                                            selectionMode === "single"
                                                ? "เช่น Apple 🍎"
                                                : `เช่น Apple 🍎 ${delimiter} Orange 🍊`
                                        }
                                        style={{
                                            background: "#1e293b",
                                            color: "#f8fafc",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "8px",
                                            padding: "8px",
                                            outline: "none",
                                            fontSize: "12px"
                                        }}
                                    />
                                </label>
                                <span
                                    style={{
                                        fontSize: "11px",
                                        color: "#64748b",
                                        fontStyle: "italic",
                                        lineHeight: "1.4"
                                    }}
                                >
                                    💡 ท่านสามารถพิมพ์ชื่อป้ายแท็กลงในกล่องข้อความนี้โดยคั้นด้วยตัวอักษร{" "}
                                    <b>{delimiter}</b> ระบบจำลองจะทำการ Split
                                    ข้อมูลและกวาดไปประมวลผลเลือกแท็กป้ายในฝั่งแคนวาสให้ทันทีโดยอัตโนมัติ!
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Category 4: Aesthetics */}
                    <div
                        style={{
                            marginBottom: "10px",
                            borderRadius: "10px",
                            overflow: "hidden",
                            background: openTab === "aesthetics" ? "rgba(255,255,255,0.02)" : "transparent"
                        }}
                    >
                        <button
                            onClick={() => setOpenTab(openTab === "aesthetics" ? "" : "aesthetics")}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "none",
                                background: "rgba(255,255,255,0.04)",
                                color: "#cbd5e1",
                                display: "flex",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: "bold",
                                textAlign: "left"
                            }}
                        >
                            <span>4. Aesthetics (ความสวยงาม)</span>
                            <span>{openTab === "aesthetics" ? "▲" : "▼"}</span>
                        </button>
                        {openTab === "aesthetics" && (
                            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                                <label
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "4px",
                                        fontSize: "12px",
                                        color: "#94a3b8"
                                    }}
                                >
                                    <span>Theme Accent Color (สีเน้นหลัก)</span>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <input
                                            type="color"
                                            value={accentColor}
                                            onChange={e => setAccentColor(e.target.value)}
                                            style={{
                                                width: "38px",
                                                height: "38px",
                                                border: "none",
                                                borderRadius: "8px",
                                                background: "transparent",
                                                cursor: "pointer"
                                            }}
                                        />
                                        <input
                                            type="text"
                                            value={accentColor}
                                            onChange={e => setAccentColor(e.target.value)}
                                            style={{
                                                flex: 1,
                                                background: "#1e293b",
                                                color: "#f8fafc",
                                                border: "1px solid rgba(255,255,255,0.06)",
                                                borderRadius: "8px",
                                                padding: "8px",
                                                outline: "none",
                                                fontSize: "12px"
                                            }}
                                        />
                                    </div>
                                </label>

                                <label
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "4px",
                                        fontSize: "12px",
                                        color: "#94a3b8",
                                        marginTop: "8px"
                                    }}
                                >
                                    <span>Search Term Highlight Color (สีเน้นคำค้นหา)</span>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <input
                                            type="color"
                                            value={searchHighlightColor}
                                            onChange={e => setSearchHighlightColor(e.target.value)}
                                            style={{
                                                width: "38px",
                                                height: "38px",
                                                border: "none",
                                                borderRadius: "8px",
                                                background: "transparent",
                                                cursor: "pointer"
                                            }}
                                        />
                                        <input
                                            type="text"
                                            value={searchHighlightColor}
                                            onChange={e => setSearchHighlightColor(e.target.value)}
                                            style={{
                                                flex: 1,
                                                background: "#1e293b",
                                                color: "#f8fafc",
                                                border: "1px solid rgba(255,255,255,0.06)",
                                                borderRadius: "8px",
                                                padding: "8px",
                                                outline: "none",
                                                fontSize: "12px"
                                            }}
                                        />
                                    </div>
                                </label>

                                <label
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "4px",
                                        fontSize: "12px",
                                        color: "#94a3b8"
                                    }}
                                >
                                    <span>Border Radius (ความโค้งมน)</span>
                                    <input
                                        type="text"
                                        value={borderRadius}
                                        onChange={e => setBorderRadius(e.target.value)}
                                        style={{
                                            background: "#1e293b",
                                            color: "#f8fafc",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "8px",
                                            padding: "8px",
                                            outline: "none",
                                            fontSize: "12px"
                                        }}
                                    />
                                </label>

                                <label
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "4px",
                                        fontSize: "12px",
                                        color: "#94a3b8"
                                    }}
                                >
                                    <span>Background Blur (ความเบลอ)</span>
                                    <input
                                        type="text"
                                        value={bgBlur}
                                        onChange={e => setBgBlur(e.target.value)}
                                        style={{
                                            background: "#1e293b",
                                            color: "#f8fafc",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "8px",
                                            padding: "8px",
                                            outline: "none",
                                            fontSize: "12px"
                                        }}
                                    />
                                </label>

                                <label
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "4px",
                                        fontSize: "12px",
                                        color: "#94a3b8"
                                    }}
                                >
                                    <span>Popover Background fill</span>
                                    <input
                                        type="text"
                                        value={popoverBg}
                                        onChange={e => setPopoverBg(e.target.value)}
                                        style={{
                                            background: "#1e293b",
                                            color: "#f8fafc",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "8px",
                                            padding: "8px",
                                            outline: "none",
                                            fontSize: "12px"
                                        }}
                                    />
                                </label>

                                <label
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "4px",
                                        fontSize: "12px",
                                        color: "#94a3b8"
                                    }}
                                >
                                    <span>Max Dropdown Height</span>
                                    <input
                                        type="text"
                                        value={maxDropdownHeight}
                                        onChange={e => setMaxDropdownHeight(e.target.value)}
                                        style={{
                                            background: "#1e293b",
                                            color: "#f8fafc",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "8px",
                                            padding: "8px",
                                            outline: "none",
                                            fontSize: "12px"
                                        }}
                                    />
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Category 5: Readonly & Validation */}
                    <div
                        style={{
                            marginBottom: "10px",
                            borderRadius: "10px",
                            overflow: "hidden",
                            background: openTab === "validation" ? "rgba(255,255,255,0.02)" : "transparent"
                        }}
                    >
                        <button
                            onClick={() => setOpenTab(openTab === "validation" ? "" : "validation")}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "none",
                                background: "rgba(255,255,255,0.04)",
                                color: "#cbd5e1",
                                display: "flex",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: "bold",
                                textAlign: "left"
                            }}
                        >
                            <span>5. Validation & States</span>
                            <span>{openTab === "validation" ? "▲" : "▼"}</span>
                        </button>
                        {openTab === "validation" && (
                            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        fontSize: "12px",
                                        color: "#cbd5e1",
                                        cursor: "pointer"
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={readOnly}
                                        onChange={e => setReadOnly(e.target.checked)}
                                    />
                                    <span>Read Only (อ่านอย่างเดียว)</span>
                                </label>

                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        fontSize: "12px",
                                        color: "#cbd5e1",
                                        cursor: "pointer"
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={required}
                                        onChange={e => setRequired(e.target.checked)}
                                    />
                                    <span>Required Field (*)</span>
                                </label>

                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        fontSize: "12px",
                                        color: "#cbd5e1",
                                        cursor: "pointer",
                                        borderTop: "1px solid rgba(255,255,255,0.05)",
                                        paddingTop: "8px",
                                        marginTop: "4px"
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={hasError}
                                        onChange={e => setHasError(e.target.checked)}
                                    />
                                    <span>Simulate Validation Alert</span>
                                </label>

                                {hasError && (
                                    <label
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "4px",
                                            fontSize: "11px",
                                            color: "#ef4444"
                                        }}
                                    >
                                        <span>Error Message text</span>
                                        <input
                                            type="text"
                                            value={errorText}
                                            onChange={e => setErrorText(e.target.value)}
                                            style={{
                                                background: "#1e293b",
                                                color: "#f8fafc",
                                                border: "1px solid rgba(239,68,68,0.2)",
                                                borderRadius: "6px",
                                                padding: "6px",
                                                outline: "none",
                                                fontSize: "12px"
                                            }}
                                        />
                                    </label>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Category 6: Translations */}
                    <div
                        style={{
                            marginBottom: "10px",
                            borderRadius: "10px",
                            overflow: "hidden",
                            background: openTab === "translations" ? "rgba(255,255,255,0.02)" : "transparent"
                        }}
                    >
                        <button
                            onClick={() => setOpenTab(openTab === "translations" ? "" : "translations")}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "none",
                                background: "rgba(255,255,255,0.04)",
                                color: "#cbd5e1",
                                display: "flex",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: "bold",
                                textAlign: "left"
                            }}
                        >
                            <span>6. Translations (แปลภาษา)</span>
                            <span>{openTab === "translations" ? "▲" : "▼"}</span>
                        </button>
                        {openTab === "translations" && (
                            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                                <label
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "3px",
                                        fontSize: "11px",
                                        color: "#94a3b8"
                                    }}
                                >
                                    <span>Placeholder Text</span>
                                    <input
                                        type="text"
                                        value={placeholder}
                                        onChange={e => setPlaceholder(e.target.value)}
                                        style={{
                                            background: "#1e293b",
                                            color: "#f8fafc",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "6px",
                                            padding: "6px",
                                            outline: "none",
                                            fontSize: "12px"
                                        }}
                                    />
                                </label>
                                <label
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "3px",
                                        fontSize: "11px",
                                        color: "#94a3b8"
                                    }}
                                >
                                    <span>No Options Found Warning</span>
                                    <input
                                        type="text"
                                        value={noOptionsMessage}
                                        onChange={e => setNoOptionsMessage(e.target.value)}
                                        style={{
                                            background: "#1e293b",
                                            color: "#f8fafc",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "6px",
                                            padding: "6px",
                                            outline: "none",
                                            fontSize: "12px"
                                        }}
                                    />
                                </label>
                                <label
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "3px",
                                        fontSize: "11px",
                                        color: "#94a3b8"
                                    }}
                                >
                                    <span>Loading Text</span>
                                    <input
                                        type="text"
                                        value={loadingMessage}
                                        onChange={e => setLoadingMessage(e.target.value)}
                                        style={{
                                            background: "#1e293b",
                                            color: "#f8fafc",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "6px",
                                            padding: "6px",
                                            outline: "none",
                                            fontSize: "12px"
                                        }}
                                    />
                                </label>
                                <label
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "3px",
                                        fontSize: "11px",
                                        color: "#94a3b8"
                                    }}
                                >
                                    <span>Clear Button Tooltip</span>
                                    <input
                                        type="text"
                                        value={clearButtonTitle}
                                        onChange={e => setClearButtonTitle(e.target.value)}
                                        style={{
                                            background: "#1e293b",
                                            color: "#f8fafc",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "6px",
                                            padding: "6px",
                                            outline: "none",
                                            fontSize: "12px"
                                        }}
                                    />
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Collapsible Panel 7: Advanced Search */}
                    <div
                        style={{
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                            background: openTab === "advancedSearch" ? "rgba(255,255,255,0.02)" : "transparent"
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setOpenTab(openTab === "advancedSearch" ? "" : "advancedSearch")}
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "14px 16px",
                                background: "none",
                                border: "none",
                                color: "#f8fafc",
                                fontWeight: 600,
                                cursor: "pointer",
                                outline: "none",
                                fontSize: "12px"
                            }}
                        >
                            <span>7. Advanced Search (การค้นหาขั้นสูง)</span>
                            <span>{openTab === "advancedSearch" ? "▲" : "▼"}</span>
                        </button>
                        {openTab === "advancedSearch" && (
                            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                                <label
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "3px",
                                        fontSize: "11px",
                                        color: "#94a3b8"
                                    }}
                                >
                                    <span>Search Matching Method (วิธีการค้นหา)</span>
                                    <select
                                        value={searchMethod}
                                        onChange={e => setSearchMethod(e.target.value as any)}
                                        style={{
                                            background: "#1e293b",
                                            color: "#f8fafc",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "6px",
                                            padding: "6px",
                                            outline: "none",
                                            fontSize: "12px"
                                        }}
                                    >
                                        <option value="contains">Contains (มีข้อความ)</option>
                                        <option value="startsWith">Starts With (ขึ้นต้นด้วย)</option>
                                        <option value="endsWith">Ends With (ลงท้ายด้วย)</option>
                                        <option value="equals">Equals (เท่ากับพอดี)</option>
                                        <option value="fuzzy">Fuzzy Search (ค้นหาแบบยืดหยุ่น)</option>
                                    </select>
                                </label>
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        fontSize: "11px",
                                        color: "#94a3b8",
                                        cursor: "pointer",
                                        marginTop: "4px"
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={searchCaseSensitive}
                                        onChange={e => setSearchCaseSensitive(e.target.checked)}
                                        style={{ cursor: "pointer" }}
                                    />
                                    <span>Case Sensitive (ตรงตามพิมพ์เล็ก/ใหญ่)</span>
                                </label>
                                <label
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "3px",
                                        fontSize: "11px",
                                        color: "#94a3b8"
                                    }}
                                >
                                    <span>Max Search Results (0 = Unlimited)</span>
                                    <input
                                        type="number"
                                        value={maxSearchResults}
                                        onChange={e => setMaxSearchResults(Math.max(0, parseInt(e.target.value, 10) || 0))}
                                        style={{
                                            background: "#1e293b",
                                            color: "#f8fafc",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "6px",
                                            padding: "6px",
                                            outline: "none",
                                            fontSize: "12px"
                                        }}
                                    />
                                </label>
                                <label
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "3px",
                                        fontSize: "11px",
                                        color: "#94a3b8"
                                    }}
                                >
                                    <span>Search Input Debounce (ms)</span>
                                    <input
                                        type="number"
                                        value={searchDebounce}
                                        onChange={e => setSearchDebounce(Math.max(0, parseInt(e.target.value, 10) || 0))}
                                        style={{
                                            background: "#1e293b",
                                            color: "#f8fafc",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "6px",
                                            padding: "6px",
                                            outline: "none",
                                            fontSize: "12px"
                                        }}
                                    />
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* ----------------------------------------------------
                RIGHT CANVAS: Live ComboBox Renderer
               ---------------------------------------------------- */}
            <main
                style={{
                    flex: 1,
                    padding: "40px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    overflowY: "auto"
                }}
            >
                {/* Canvas Header */}
                <div style={{ textAlign: "center", marginBottom: "25px" }}>
                    <h1
                        style={{
                            fontSize: "26px",
                            fontWeight: 800,
                            margin: "0 0 8px 0",
                            background: "linear-gradient(to right, #38bdf8, #818cf8)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}
                    >
                        PWB ComboBox Live Playground Canvas ⚡
                    </h1>
                    <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>
                        ทดสอบฟีเจอร์คำบรรยายแถวย่อย (Subtitles), ป้าย Avatar, และการเลื่อนโหลดรายการ Lazy-load 60 FPS
                        ฝั่งขวามือแบบเรียลไทม์
                    </p>
                </div>

                {/* Display Canvas Component wrapper */}
                <div
                    style={{
                        width: "100%",
                        maxWidth: "500px",
                        background: "rgba(30, 41, 59, 0.3)",
                        border: "1px dashed rgba(255, 255, 255, 0.08)",
                        borderRadius: "20px",
                        padding: "60px 40px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        backdropFilter: "blur(20px)",
                        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)",
                        position: "relative",
                        minHeight: "350px"
                    }}
                >
                    {/* Badge Mode */}
                    <div
                        style={{
                            position: "absolute",
                            top: "15px",
                            left: "20px",
                            fontSize: "11px",
                            fontWeight: 700,
                            color: selectionMode === "single" ? "#38bdf8" : "#a78bfa",
                            background:
                                selectionMode === "single" ? "rgba(56, 189, 248, 0.08)" : "rgba(167, 139, 250, 0.08)",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em"
                        }}
                    >
                        {selectionMode === "single" ? "Single Select Mode" : "Multi Select (Tags) Mode"}
                    </div>

                    {/* Simulation Wrapper Injecting Mendix Styles/Vars */}
                    <div
                        className="pwb-combobox-wrapper"
                        style={
                            {
                                width: "100%",
                                "--accent-color": accentColor,
                                "--search-highlight-color": searchHighlightColor || accentColor,
                                "--border-radius": borderRadius,
                                "--bg-blur": bgBlur,
                                "--popover-bg": popoverBg
                            } as React.CSSProperties
                        }
                    >
                        <ComboBox
                            options={activeOptions}
                            selectedIds={selectedIds}
                            selectionMode={selectionMode}
                            singleSelectStyle={singleSelectStyle}
                            showSelectedAvatar={showSelectedAvatar}
                            tagStyle={tagStyle}
                            onSelect={handleSelect}
                            onRemove={handleRemove}
                            onClear={handleClear}
                            isLoading={isLoading}
                            placeholder={placeholder}
                            accentColor={accentColor}
                            searchHighlightColor={searchHighlightColor}
                            borderRadius={borderRadius}
                            bgBlur={bgBlur}
                            popoverBg={popoverBg}
                            maxDropdownHeight={maxDropdownHeight}
                            dropdownLayout={dropdownLayout}
                            optionAvatarShape={optionAvatarShape}
                            showOptionCheckbox={showOptionCheckbox}
                            searchDebounce={searchDebounce}
                            maxVisibleTags={maxVisibleTags}
                            showSelectAll={showSelectAll}
                            selectAllText={selectAllText}
                            deselectAllText={deselectAllText}
                            onCreateOption={handleCreateOption}
                            hasCreateAction={hasCreateAction}
                            onCreateText={onCreateText}
                            noOptionsMessage={noOptionsMessage}
                            loadingMessage={loadingMessage}
                            clearButtonTitle={clearButtonTitle}
                            readOnly={readOnly}
                            required={required}
                            hasError={hasError}
                            errorText={errorText}
                            searchMethod={searchMethod}
                            searchCaseSensitive={searchCaseSensitive}
                            maxSearchResults={maxSearchResults}
                        />
                    </div>
                </div>

                {/* Selected Status Visualizer Dashboard */}
                <div
                    style={{
                        marginTop: "25px",
                        width: "100%",
                        maxWidth: "500px",
                        background: "#0f172a",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "12px",
                        padding: "16px 20px"
                    }}
                >
                    <span
                        style={{
                            fontSize: "11px",
                            fontWeight: "bold",
                            color: "#94a3b8",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em"
                        }}
                    >
                        การจำลองการเขียนข้อมูลลง Entity (Selected State Output)
                    </span>

                    {/* Simulated Delimited String Attribute Visualizer */}
                    <div
                        style={{
                            marginTop: "12px",
                            background: "rgba(255,255,255,0.02)",
                            border: "1px dashed rgba(255,255,255,0.06)",
                            borderRadius: "8px",
                            padding: "10px 12px"
                        }}
                    >
                        <div
                            style={{
                                fontSize: "11px",
                                color: "#10b981",
                                fontWeight: "bold",
                                textTransform: "uppercase"
                            }}
                        >
                            [Database] Simulated String Attribute Value:
                        </div>
                        <div
                            style={{
                                fontSize: "14px",
                                fontFamily: "monospace",
                                color: simulatedStringVal ? "#38bdf8" : "#64748b",
                                marginTop: "4px",
                                wordBreak: "break-all"
                            }}
                        >
                            {simulatedStringVal ? `"${simulatedStringVal}"` : `"" (ค่าว่าง / Null)`}
                        </div>
                    </div>

                    <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {selectedIds.length === 0 ? (
                            <span style={{ fontSize: "13px", color: "#64748b", fontStyle: "italic" }}>
                                (ค่าวัตถุสัมพันธ์ว่างเปล่า / Association Empty - ยังไม่ได้เลือกรายการใด)
                            </span>
                        ) : (
                            selectedIds.map(id => {
                                const opt = activeOptions.find(o => o.id === id);
                                return (
                                    <div
                                        key={id}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            background: "rgba(255,255,255,0.03)",
                                            border: "1px solid rgba(255,255,255,0.08)",
                                            borderRadius: "8px",
                                            padding: "8px 12px"
                                        }}
                                    >
                                        <div style={{ fontSize: "13px", fontWeight: "bold", color: "#f8fafc" }}>
                                            {opt ? opt.label : `ID: ${id}`}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "10px",
                                                color: "#94a3b8",
                                                fontFamily: "monospace",
                                                marginTop: "2px"
                                            }}
                                        >
                                            ID: {id} | Object: {JSON.stringify(opt?.rawObject || {})}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
