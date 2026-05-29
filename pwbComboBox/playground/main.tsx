import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { ComboBox, ComboBoxOption } from "../src/components/ComboBox";
import "../src/ui/PwbComboBox.css";

// ----------------------------------------------------
// Mock Datasets
// ----------------------------------------------------
const DATASETS = {
    fruits: [
        { id: "1", label: "Apple 🍎", rawObject: { id: "1", val: "apple" } },
        { id: "2", label: "Banana 🍌", rawObject: { id: "2", val: "banana" } },
        { id: "3", label: "Orange 🍊", rawObject: { id: "3", val: "orange" } },
        { id: "4", label: "Mango 🥭", rawObject: { id: "4", val: "mango" } },
        { id: "5", label: "Grape 🍇", rawObject: { id: "5", val: "grape" } },
        { id: "6", label: "Strawberry 🍓", rawObject: { id: "6", val: "strawberry" } },
        { id: "7", label: "Pineapple 🍍", rawObject: { id: "7", val: "pineapple" } },
        { id: "8", label: "Watermelon 🍉", rawObject: { id: "8", val: "watermelon" } },
        { id: "9", label: "Peach 🍑", rawObject: { id: "9", val: "peach" } },
        { id: "10", label: "Kiwi 🥝", rawObject: { id: "10", val: "kiwi" } }
    ],
    tech: [
        { id: "t1", label: "React", rawObject: { id: "t1", val: "react" } },
        { id: "t2", label: "Vue.js", rawObject: { id: "t2", val: "vue" } },
        { id: "t3", label: "Angular", rawObject: { id: "t3", val: "angular" } },
        { id: "t4", label: "Next.js", rawObject: { id: "t4", val: "next" } },
        { id: "t5", label: "Vite", rawObject: { id: "t5", val: "vite" } },
        { id: "t6", label: "Mendix Pluggable Widgets", rawObject: { id: "t6", val: "mendix" } },
        { id: "t7", label: "TypeScript", rawObject: { id: "t7", val: "ts" } },
        { id: "t8", label: "Go (Golang)", rawObject: { id: "t8", val: "go" } },
        { id: "t9", label: "Python", rawObject: { id: "t9", val: "python" } },
        { id: "t10", label: "Rust Programming", rawObject: { id: "t10", val: "rust" } }
    ],
    provinces: [
        { id: "p1", label: "กรุงเทพมหานคร (Bangkok)", rawObject: { id: "p1", val: "bkk" } },
        { id: "p2", label: "เชียงใหม่ (Chiang Mai)", rawObject: { id: "p2", val: "cm" } },
        { id: "p3", label: "ภูเก็ต (Phuket)", rawObject: { id: "p3", val: "pkt" } },
        { id: "p4", label: "ขอนแก่น (Khon Kaen)", rawObject: { id: "p4", val: "kk" } },
        { id: "p5", label: "ชลบุรี (Chonburi)", rawObject: { id: "p5", val: "cb" } },
        { id: "p6", label: "นครราชสีมา (Korat)", rawObject: { id: "p6", val: "km" } }
    ]
};

function App() {
    // ----------------------------------------------------
    // Mendix Properties Simulator States
    // ----------------------------------------------------
    const [selectionMode, setSelectionMode] = useState<"single" | "multi">("single");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Delimited String simulator states
    const [delimiter, setDelimiter] = useState(",");
    const [simulatedStringVal, setSimulatedStringVal] = useState("");

    // Dataset and Loader States
    const [datasetKey, setDatasetKey] = useState<keyof typeof DATASETS>("fruits");
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

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

    // Form Statuses
    const [readOnly, setReadOnly] = useState(false);
    const [required, setRequired] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorText, setErrorText] = useState("กรุณาเลือกข้อมูลให้ครบถ้วน");

    // Collapsible Panel State
    const [openTab, setOpenTab] = useState<string>("general");

    // Get Active Options list based on simulation controls
    const activeOptions = isEmpty ? [] : DATASETS[datasetKey];

    // Reset selected IDs when changing selection modes to prevent overflow
    useEffect(() => {
        setSelectedIds([]);
    }, [selectionMode]);

    // Bidirectional sync: Sync from selectedIds -> simulatedStringVal
    useEffect(() => {
        const delim = delimiter || ",";
        if (selectionMode === "single") {
            if (selectedIds.length > 0) {
                const opt = DATASETS[datasetKey].find(o => o.id === selectedIds[0]);
                setSimulatedStringVal(opt ? opt.label : "");
            } else {
                setSimulatedStringVal("");
            }
        } else {
            const serialized = selectedIds
                .map(id => {
                    const opt = DATASETS[datasetKey].find(o => o.id === id);
                    return opt ? opt.label : id;
                })
                .join(delim + " ");
            setSimulatedStringVal(serialized);
        }
    }, [selectedIds, delimiter, datasetKey, selectionMode]);

    // Bidirectional sync: Parse manually typed string attribute values back into selectedIds
    const handleStringValChange = (val: string) => {
        setSimulatedStringVal(val);
        if (val.trim() === "") {
            setSelectedIds([]);
            return;
        }

        const delim = delimiter || ",";
        if (selectionMode === "single") {
            const matched = DATASETS[datasetKey].find(o => o.id === val.trim() || o.label === val.trim());
            if (matched) {
                setSelectedIds([matched.id]);
            } else {
                setSelectedIds([]);
            }
        } else {
            const tokens = val.split(delim).map(t => t.trim());
            const matchedIds: string[] = [];
            tokens.forEach(token => {
                const matched = DATASETS[datasetKey].find(o => o.id === token || o.label === token);
                if (matched && !matchedIds.includes(matched.id)) {
                    matchedIds.push(matched.id);
                }
            });
            setSelectedIds(matchedIds);
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

                    {/* Category 2: Dynamic Attribute Binding Simulator (NEW) */}
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
                            <span>2. Delimited String Attribute Simulator</span>
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

                    {/* Category 3: Aesthetics */}
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
                            <span>3. Aesthetics (ความสวยงาม)</span>
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

                    {/* Category 4: Readonly & Validation */}
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
                            <span>4. Validation & States</span>
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

                    {/* Category 5: Translations */}
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
                            <span>5. Translations (แปลภาษา)</span>
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
                        ปรับแต่งคุณลักษณะที่ฝั่งแผงควบคุมซ้ายมือ เพื่อจำลองการตัดและประกอบคำ String แบบ Comma
                        คั่นอัตโนมัติ
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
                            onSelect={handleSelect}
                            onRemove={handleRemove}
                            onClear={handleClear}
                            isLoading={isLoading}
                            placeholder={placeholder}
                            accentColor={accentColor}
                            borderRadius={borderRadius}
                            bgBlur={bgBlur}
                            popoverBg={popoverBg}
                            maxDropdownHeight={maxDropdownHeight}
                            noOptionsMessage={noOptionsMessage}
                            loadingMessage={loadingMessage}
                            clearButtonTitle={clearButtonTitle}
                            readOnly={readOnly}
                            required={required}
                            hasError={hasError}
                            errorText={errorText}
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

                    {/* Simulated Delimited String Attribute Visualizer (NEW) */}
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
