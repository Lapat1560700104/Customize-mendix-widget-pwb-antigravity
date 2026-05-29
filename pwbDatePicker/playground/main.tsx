import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { DatePicker } from "../src/components/DatePicker";
import "../src/ui/PwbDatePicker.css";

function App() {
    // ----------------------------------------------------
    // Mendix Properties Simulator States
    // ----------------------------------------------------
    const [selectionMode, setSelectionMode] = useState<"single" | "range">("single");
    
    // Core Date Values
    const [singleValue, setSingleValue] = useState<Date | undefined>(() => new Date());
    const [startValue, setStartValue] = useState<Date | undefined>(() => {
        const d = new Date();
        d.setDate(d.getDate() - 3);
        return d;
    });
    const [endValue, setEndValue] = useState<Date | undefined>(() => new Date());

    // Features
    const [showTime, setShowTime] = useState(true);
    const [buddhistEra, setBuddhistEra] = useState(true);
    const [showPresets, setShowPresets] = useState(true);
    const [showEraToggle, setShowEraToggle] = useState(true);

    // Constraints
    const [disableWeekends, setDisableWeekends] = useState(false);

    // Aesthetics
    const [placeholder, setPlaceholder] = useState("กรุณาเลือกวัน...");
    const [accentColor, setAccentColor] = useState("#3b82f6");
    const [borderRadius, setBorderRadius] = useState("16px");
    const [bgBlur, setBgBlur] = useState("16px");
    const [popoverBg, setPopoverBg] = useState("rgba(15, 23, 42, 0.85)");
    const [simulatedIcon, setSimulatedIcon] = useState<"default" | "clock" | "user" | "checkmark" | "calendar-alt">("default");

    // SVG icon mapper for simulation
    const getSimulatedIconNode = (): React.ReactNode => {
        switch (simulatedIcon) {
            case "clock":
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "color 0.2s ease" }}>
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                );
            case "user":
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "color 0.2s ease" }}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                );
            case "checkmark":
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "color 0.2s ease" }}>
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                );
            case "calendar-alt":
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "color 0.2s ease" }}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                );
            default:
                return undefined;
        }
    };

    // Translations (Mendix Batch Translate)
    const [timeLabel, setTimeLabel] = useState("");
    const [todayPresetLabel, setTodayPresetLabel] = useState("");
    const [clearPresetLabel, setClearPresetLabel] = useState("");
    const [selectMonthLabel, setSelectMonthLabel] = useState("");
    const [last7DaysPresetLabel, setLast7DaysPresetLabel] = useState("");
    const [last30DaysPresetLabel, setLast30DaysPresetLabel] = useState("");
    const [thisMonthPresetLabel, setThisMonthPresetLabel] = useState("");

    // Collapsible Categories
    const [openTab, setOpenTab] = useState<string>("general");

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#090d16", color: "#f8fafc", overflow: "hidden" }}>
            
            {/* ----------------------------------------------------
                LEFT SIDEBAR: Mendix Properties Simulator
               ---------------------------------------------------- */}
            <aside style={{ 
                width: "360px", 
                background: "#0f172a", 
                borderRight: "1px solid rgba(255,255,255,0.06)", 
                display: "flex", 
                flexDirection: "column",
                overflowY: "auto",
                flexShrink: 0
            }}>
                {/* Sidebar Title Header */}
                <div style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(15, 23, 42, 0.6)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }}></div>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", letterSpacing: "0.05em", textTransform: "uppercase" }}>Mendix Simulation Panel</span>
                    </div>
                    <h2 style={{ fontSize: "16px", margin: "4px 0 0 0", color: "#cbd5e1" }}>PwbDatePicker Properties</h2>
                </div>

                {/* Property Categories (Accordion style) */}
                <div style={{ flex: 1, padding: "12px" }}>
                    
                    {/* Category A: General */}
                    <div style={{ marginBottom: "10px", borderRadius: "10px", overflow: "hidden", background: openTab === "general" ? "rgba(255,255,255,0.02)" : "transparent" }}>
                        <button 
                            onClick={() => setOpenTab(openTab === "general" ? "" : "general")}
                            style={{ 
                                width: "100%", padding: "12px", border: "none", background: "rgba(255,255,255,0.04)", 
                                color: "#cbd5e1", display: "flex", justifyContent: "space-between", cursor: "pointer",
                                fontSize: "13px", fontWeight: "bold", textAlign: "left"
                            }}
                        >
                            <span>1. General</span>
                            <span>{openTab === "general" ? "▲" : "▼"}</span>
                        </button>
                        {openTab === "general" && (
                            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "#94a3b8" }}>
                                    <span>Selection Mode (รูปแบบการเลือก)</span>
                                    <select 
                                        value={selectionMode} 
                                        onChange={(e: any) => setSelectionMode(e.target.value)}
                                        style={{ background: "#1e293b", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "8px", outline: "none" }}
                                    >
                                        <option value="single">Single Date (วันเดียว)</option>
                                        <option value="range">Date Range (ช่วงวันที่)</option>
                                    </select>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Category B: Features */}
                    <div style={{ marginBottom: "10px", borderRadius: "10px", overflow: "hidden", background: openTab === "features" ? "rgba(255,255,255,0.02)" : "transparent" }}>
                        <button 
                            onClick={() => setOpenTab(openTab === "features" ? "" : "features")}
                            style={{ 
                                width: "100%", padding: "12px", border: "none", background: "rgba(255,255,255,0.04)", 
                                color: "#cbd5e1", display: "flex", justifyContent: "space-between", cursor: "pointer",
                                fontSize: "13px", fontWeight: "bold", textAlign: "left"
                            }}
                        >
                            <span>2. Features</span>
                            <span>{openTab === "features" ? "▲" : "▼"}</span>
                        </button>
                        {openTab === "features" && (
                            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", cursor: "pointer", color: "#cbd5e1" }}>
                                    <input type="checkbox" checked={showTime} onChange={(e) => setShowTime(e.target.checked)} style={{ width: "16px", height: "16px", cursor: "pointer" }} />
                                    <span>Show Time Picker (เปิดระบบระบุเวลา)</span>
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", cursor: "pointer", color: "#cbd5e1" }}>
                                    <input type="checkbox" checked={buddhistEra} onChange={(e) => setBuddhistEra(e.target.checked)} style={{ width: "16px", height: "16px", cursor: "pointer" }} />
                                    <span>Thai Buddhist Era (ปี พ.ศ. เริ่มต้น)</span>
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", cursor: "pointer", color: "#cbd5e1" }}>
                                    <input type="checkbox" checked={showPresets} onChange={(e) => setShowPresets(e.target.checked)} style={{ width: "16px", height: "16px", cursor: "pointer" }} />
                                    <span>Show Presets Panel (ปุ่มลัดด่วน)</span>
                                </label>
                                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", cursor: "pointer", color: "#cbd5e1" }}>
                                    <input type="checkbox" checked={showEraToggle} onChange={(e) => setShowEraToggle(e.target.checked)} style={{ width: "16px", height: "16px", cursor: "pointer" }} />
                                    <span>Show Live Era Switch (สวิตช์ พ.ศ. / ค.ศ.)</span>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Category C: Constraints */}
                    <div style={{ marginBottom: "10px", borderRadius: "10px", overflow: "hidden", background: openTab === "constraints" ? "rgba(255,255,255,0.02)" : "transparent" }}>
                        <button 
                            onClick={() => setOpenTab(openTab === "constraints" ? "" : "constraints")}
                            style={{ 
                                width: "100%", padding: "12px", border: "none", background: "rgba(255,255,255,0.04)", 
                                color: "#cbd5e1", display: "flex", justifyContent: "space-between", cursor: "pointer",
                                fontSize: "13px", fontWeight: "bold", textAlign: "left"
                            }}
                        >
                            <span>3. Constraints</span>
                            <span>{openTab === "constraints" ? "▲" : "▼"}</span>
                        </button>
                        {openTab === "constraints" && (
                            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", cursor: "pointer", color: "#cbd5e1" }}>
                                    <input type="checkbox" checked={disableWeekends} onChange={(e) => setDisableWeekends(e.target.checked)} style={{ width: "16px", height: "16px", cursor: "pointer" }} />
                                    <span>Disable Weekends (ล็อค สัปดาห์/อาทิตย์)</span>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Category D: Aesthetics */}
                    <div style={{ marginBottom: "10px", borderRadius: "10px", overflow: "hidden", background: openTab === "aesthetics" ? "rgba(255,255,255,0.02)" : "transparent" }}>
                        <button 
                            onClick={() => setOpenTab(openTab === "aesthetics" ? "" : "aesthetics")}
                            style={{ 
                                width: "100%", padding: "12px", border: "none", background: "rgba(255,255,255,0.04)", 
                                color: "#cbd5e1", display: "flex", justifyContent: "space-between", cursor: "pointer",
                                fontSize: "13px", fontWeight: "bold", textAlign: "left"
                            }}
                        >
                            <span>4. Aesthetics</span>
                            <span>{openTab === "aesthetics" ? "▲" : "▼"}</span>
                        </button>
                        {openTab === "aesthetics" && (
                            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                                <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", color: "#94a3b8" }}>
                                    <span>Accent Color (ธีมสีเด่น)</span>
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                        <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} style={{ border: "none", background: "none", width: "40px", height: "30px", cursor: "pointer" }} />
                                        <input type="text" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} style={{ background: "#1e293b", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "6px", outline: "none", fontSize: "13px", width: "100%" }} />
                                    </div>
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", color: "#94a3b8" }}>
                                    <span>Placeholder Text</span>
                                    <input type="text" value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} style={{ background: "#1e293b", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "6px", outline: "none", fontSize: "13px" }} />
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", color: "#94a3b8" }}>
                                    <span>Border Radius</span>
                                    <input type="text" value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} style={{ background: "#1e293b", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "6px", outline: "none", fontSize: "13px" }} />
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", color: "#94a3b8" }}>
                                    <span>Background Blur</span>
                                    <input type="text" value={bgBlur} onChange={(e) => setBgBlur(e.target.value)} style={{ background: "#1e293b", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "6px", outline: "none", fontSize: "13px" }} />
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", color: "#94a3b8" }}>
                                    <span>Calendar Background</span>
                                    <input type="text" value={popoverBg} onChange={(e) => setPopoverBg(e.target.value)} style={{ background: "#1e293b", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "6px", outline: "none", fontSize: "13px" }} />
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "#94a3b8" }}>
                                    <span>Custom Input Icon (ไอคอนกล่องข้อความจำลอง)</span>
                                    <select 
                                        value={simulatedIcon} 
                                        onChange={(e: any) => setSimulatedIcon(e.target.value)}
                                        style={{ background: "#1e293b", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "8px", outline: "none", fontSize: "13px", cursor: "pointer" }}
                                    >
                                        <option value="default">Default Calendar Icon (ไอคอนหลัก)</option>
                                        <option value="calendar-alt">Alternative Calendar (ปฏิทินแบบมน)</option>
                                        <option value="clock">Clock Icon (ไอคอนนาฬิกา)</option>
                                        <option value="user">User Icon (ไอคอนบุคคล)</option>
                                        <option value="checkmark">Checkmark Icon (ไอคอนเช็คถูก)</option>
                                    </select>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Category E: Translations */}
                    <div style={{ marginBottom: "10px", borderRadius: "10px", overflow: "hidden", background: openTab === "translations" ? "rgba(255,255,255,0.02)" : "transparent" }}>
                        <button 
                            onClick={() => setOpenTab(openTab === "translations" ? "" : "translations")}
                            style={{ 
                                width: "100%", padding: "12px", border: "none", background: "rgba(255,255,255,0.04)", 
                                color: "#cbd5e1", display: "flex", justifyContent: "space-between", cursor: "pointer",
                                fontSize: "13px", fontWeight: "bold", textAlign: "left"
                            }}
                        >
                            <span>5. Translations (Batch Translate)</span>
                            <span>{openTab === "translations" ? "▲" : "▼"}</span>
                        </button>
                        {openTab === "translations" && (
                            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px", maxHeight: "250px", overflowY: "auto" }}>
                                <label style={{ display: "flex", flexDirection: "column", gap: "3px", fontSize: "11px", color: "#94a3b8" }}>
                                    <span>Time Picker Label</span>
                                    <input type="text" placeholder="เวลา / Time (HH:MM):" value={timeLabel} onChange={(e) => setTimeLabel(e.target.value)} style={{ background: "#1e293b", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "5px", outline: "none", fontSize: "12px" }} />
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "3px", fontSize: "11px", color: "#94a3b8" }}>
                                    <span>Today Preset Label</span>
                                    <input type="text" placeholder="วันนี้ (Today)" value={todayPresetLabel} onChange={(e) => setTodayPresetLabel(e.target.value)} style={{ background: "#1e293b", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "5px", outline: "none", fontSize: "12px" }} />
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "3px", fontSize: "11px", color: "#94a3b8" }}>
                                    <span>Clear Preset Label</span>
                                    <input type="text" placeholder="ล้างค่า (Clear)" value={clearPresetLabel} onChange={(e) => setClearPresetLabel(e.target.value)} style={{ background: "#1e293b", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "5px", outline: "none", fontSize: "12px" }} />
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "3px", fontSize: "11px", color: "#94a3b8" }}>
                                    <span>Select Month View Title</span>
                                    <input type="text" placeholder="เลือกเดือน / Select Month" value={selectMonthLabel} onChange={(e) => setSelectMonthLabel(e.target.value)} style={{ background: "#1e293b", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "5px", outline: "none", fontSize: "12px" }} />
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "3px", fontSize: "11px", color: "#94a3b8" }}>
                                    <span>Last 7 Days Preset Label</span>
                                    <input type="text" placeholder="7 วันล่าสุด" value={last7DaysPresetLabel} onChange={(e) => setLast7DaysPresetLabel(e.target.value)} style={{ background: "#1e293b", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "5px", outline: "none", fontSize: "12px" }} />
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "3px", fontSize: "11px", color: "#94a3b8" }}>
                                    <span>Last 30 Days Preset Label</span>
                                    <input type="text" placeholder="30 วันล่าสุด" value={last30DaysPresetLabel} onChange={(e) => setLast30DaysPresetLabel(e.target.value)} style={{ background: "#1e293b", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "5px", outline: "none", fontSize: "12px" }} />
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "3px", fontSize: "11px", color: "#94a3b8" }}>
                                    <span>This Month Preset Label</span>
                                    <input type="text" placeholder="เดือนนี้" value={thisMonthPresetLabel} onChange={(e) => setThisMonthPresetLabel(e.target.value)} style={{ background: "#1e293b", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "5px", outline: "none", fontSize: "12px" }} />
                                </label>
                            </div>
                        )}
                    </div>

                </div>
            </aside>

            {/* ----------------------------------------------------
                RIGHT CANVAS: Live DatePicker Renderer
               ---------------------------------------------------- */}
            <main style={{ 
                flex: 1, 
                padding: "40px", 
                display: "flex", 
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                overflowY: "auto"
            }}>
                {/* Header Title */}
                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <h1 style={{ 
                        fontSize: "26px", 
                        fontWeight: 800, 
                        margin: "0 0 8px 0",
                        background: "linear-gradient(to right, #38bdf8, #818cf8)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        PWB DatePicker Live Simulator Canvas ⚡
                    </h1>
                    <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>
                        ปรับแต่งปุ่มตั้งค่าจำลองที่แผงควบคุมซ้ายมือ เพื่อดูการเปลี่ยนแปลงรูปทรงและข้อความแปลภาษาแบบทันทีทันใด
                    </p>
                </div>

                {/* Display Canvas Component */}
                <div style={{ 
                    width: "100%", 
                    maxWidth: "500px",
                    background: "rgba(30, 41, 59, 0.3)", 
                    border: "1px dashed rgba(255, 255, 255, 0.08)", 
                    borderRadius: "20px", 
                    padding: "60px 40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)",
                    position: "relative"
                }}>
                    {/* Badge Mode */}
                    <div style={{ 
                        position: "absolute", 
                        top: "15px", 
                        left: "20px",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: selectionMode === "single" ? "#38bdf8" : "#a78bfa",
                        background: selectionMode === "single" ? "rgba(56, 189, 248, 0.08)" : "rgba(167, 139, 250, 0.08)",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em"
                    }}>
                        {selectionMode === "single" ? "Single Date Mode" : "Range Date Mode"}
                    </div>

                    <div style={{ width: "100%" }}>
                        <DatePicker
                            selectionMode={selectionMode}
                            value={singleValue}
                            startValue={startValue}
                            endValue={endValue}
                            onChange={setSingleValue}
                            onRangeChange={(start, end) => {
                                setStartValue(start);
                                setEndValue(end);
                            }}
                            showTime={showTime}
                            buddhistEra={buddhistEra}
                            disableWeekends={disableWeekends}
                            placeholder={placeholder}
                            accentColor={accentColor}
                            readOnly={false}
                            dateFormat={showTime ? "DD/MM/YYYY hh:mm" : "DD/MM/YYYY"}
                            showPresets={showPresets}
                            showEraToggle={showEraToggle}
                            borderRadius={borderRadius}
                            bgBlur={bgBlur}
                            popoverBg={popoverBg}
                            required={false}
                            requiredMessage="This field is required."
                            
                            // Translations
                            timeLabel={timeLabel}
                            todayPresetLabel={todayPresetLabel}
                            clearPresetLabel={clearPresetLabel}
                            selectMonthLabel={selectMonthLabel}
                            last7DaysPresetLabel={last7DaysPresetLabel}
                            last30DaysPresetLabel={last30DaysPresetLabel}
                            thisMonthPresetLabel={thisMonthPresetLabel}
                            
                            // Custom Icon
                            customIcon={getSimulatedIconNode()}
                        />
                    </div>
                </div>

                {/* State Outputs & Interactive Log JSON */}
                <div style={{ width: "100%", maxWidth: "550px", marginTop: "30px" }}>
                    <div style={{ 
                        background: "#0f172a", 
                        border: "1px solid rgba(255, 255, 255, 0.06)", 
                        borderRadius: "14px", 
                        padding: "16px",
                        fontFamily: "monospace",
                        fontSize: "12px",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
                    }}>
                        <div style={{ color: "#38bdf8", marginBottom: "8px", fontWeight: "bold" }}>📦 Real-Time Output State Values (JSON)</div>
                        {selectionMode === "single" ? (
                            <div>
                                <span style={{ color: "#cbd5e1" }}>"value":</span>{" "}
                                <span style={{ color: "#f59e0b" }}>
                                    {singleValue ? `"${singleValue.toISOString()}"` : "null"}
                                </span>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <div>
                                    <span style={{ color: "#cbd5e1" }}>"startDate":</span>{" "}
                                    <span style={{ color: "#c084fc" }}>
                                        {startValue ? `"${startValue.toISOString()}"` : "null"}
                                    </span>
                                </div>
                                <div>
                                    <span style={{ color: "#cbd5e1" }}>"endDate":</span>{" "}
                                    <span style={{ color: "#c084fc" }}>
                                        {endValue ? `"${endValue.toISOString()}"` : "null"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info shortcuts */}
                <div style={{ marginTop: "24px", color: "#64748b", fontSize: "11px", display: "flex", gap: "15px" }}>
                    <span>⌨️ <b>Arrow Keys</b>: เดินปฏิทิน</span>
                    <span>💾 <b>Enter</b>: เลือกวัน</span>
                    <span>❌ <b>Escape</b>: ปิดแผง</span>
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
