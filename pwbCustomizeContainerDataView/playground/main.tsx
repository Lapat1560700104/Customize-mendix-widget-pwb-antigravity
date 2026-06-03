import { createRoot } from "react-dom/client";
import { useState, useCallback, ReactNode, useRef, useEffect } from "react";
import { PwbCustomizeContainerDataView } from "../src/PwbCustomizeContainerDataView";
import "../src/ui/PwbCustomizeContainerDataView.css";

// ─── Simulated data items ────────────────────────────────────────────────────
interface TaskItem {
    id: string;
    title: string;
    priority: "high" | "medium" | "low";
    category: string;
    assignee: string;
    progress: number;
    status: "todo" | "in_progress" | "done" | "archived";
}

const INITIAL_TASKS: TaskItem[] = [
    { id: "task-1", title: "ออกแบบ UI หน้าหลัก", priority: "high", category: "Design", assignee: "สมชาย", progress: 85, status: "todo" },
    { id: "task-2", title: "พัฒนา API Backend", priority: "high", category: "Development", assignee: "สมหญิง", progress: 60, status: "in_progress" },
    { id: "task-3", title: "เขียน Unit Tests", priority: "medium", category: "QA", assignee: "สมศักดิ์", progress: 40, status: "todo" },
    { id: "task-4", title: "Deploy สู่ Production", priority: "low", category: "DevOps", assignee: "สมใจ", progress: 10, status: "done" },
    { id: "task-5", title: "ทำเอกสาร API", priority: "medium", category: "Documentation", assignee: "สมพร", progress: 70, status: "in_progress" },
    { id: "task-6", title: "เก็บกวาดโค้ดเก่า (Refactor)", priority: "low", category: "Development", assignee: "สมนึก", progress: 100, status: "archived" },
];

const PRIORITY_CONFIG = {
    high: { label: "สูง", color: "#ef4444", bg: "rgba(239,68,68,0.1)", badge: "🔴" },
    medium: { label: "กลาง", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", badge: "🟡" },
    low: { label: "ต่ำ", color: "#22c55e", bg: "rgba(34,197,94,0.1)", badge: "🟢" },
};

const CATEGORY_COLORS: Record<string, string> = {
    Design: "#a855f7",
    Development: "#3b82f6",
    QA: "#f59e0b",
    DevOps: "#ec4899",
    Documentation: "#14b8a6",
};

// ─── Card Renderers ───────────────────────────────────────────────────────────
function CardStyleA({ task, accentColor }: { task: TaskItem; accentColor: string }): ReactNode {
    const prio = PRIORITY_CONFIG[task.priority];
    const catColor = CATEGORY_COLORS[task.category] || accentColor;
    return (
        <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontWeight: 700, fontSize: "14px", color: "#f1f5f9" }}>{task.title}</span>
                <span style={{
                    fontSize: "10px", fontWeight: 600, padding: "2px 6px", borderRadius: "12px",
                    background: prio.bg, color: prio.color, whiteSpace: "nowrap", marginLeft: "8px"
                }}>{prio.badge} {prio.label}</span>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{
                    fontSize: "11px", padding: "2px 8px", borderRadius: "8px", fontWeight: 600,
                    background: `${catColor}18`, color: catColor
                }}>{task.category}</span>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>👤 {task.assignee}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                    flex: 1, height: "6px", borderRadius: "3px", background: "#334155", overflow: "hidden"
                }}>
                    <div style={{
                        height: "100%", borderRadius: "3px",
                        width: `${task.progress}%`,
                        background: `linear-gradient(90deg, ${accentColor}, ${catColor})`,
                        transition: "width 0.4s ease"
                    }} />
                </div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: accentColor, minWidth: "30px" }}>
                    {task.progress}%
                </span>
            </div>
        </div>
    );
}

function CardStyleB({ task }: { task: TaskItem }): ReactNode {
    const catColor = CATEGORY_COLORS[task.category] || "#3b82f6";
    return (
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
                width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                background: `linear-gradient(135deg, ${catColor}30, ${catColor}15)`,
                border: `1.5px solid ${catColor}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px"
            }}>
                {task.category === "Design" ? "🎨" :
                    task.category === "Development" ? "💻" :
                        task.category === "QA" ? "🧪" :
                            task.category === "DevOps" ? "🚀" : "📝"}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "#f1f5f9", marginBottom: "2px" }}>{task.title}</div>
                <div style={{ fontSize: "11px", color: "#94a3b8" }}>{task.assignee} · {task.progress}%</div>
            </div>
        </div>
    );
}

// ─── Layout UI Helpers ────────────────────────────────────────────────────────
function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0" }}>
            <span style={{ fontSize: "13px", color: "#94a3b8" }}>{label}</span>
            <div
                onClick={() => onChange(!value)}
                style={{
                    width: "40px", height: "22px", borderRadius: "11px", cursor: "pointer",
                    background: value ? "#3b82f6" : "#334155",
                    position: "relative", transition: "background 0.2s"
                }}
            >
                <div style={{
                    position: "absolute", top: "3px",
                    left: value ? "21px" : "3px",
                    width: "16px", height: "16px", borderRadius: "50%",
                    background: "white", transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.3)"
                }} />
            </div>
        </div>
    );
}

function Slider({ value, min, max, onChange, label, unit = "" }: {
    value: number; min: number; max: number;
    onChange: (v: number) => void; label: string; unit?: string;
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", color: "#94a3b8" }}>{label}</span>
                <span style={{ fontSize: "13px", color: "#3b82f6", fontWeight: 700 }}>{value}{unit}</span>
            </div>
            <input type="range" min={min} max={max} value={value}
                onChange={e => onChange(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#3b82f6", cursor: "pointer" }}
            />
        </div>
    );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div style={{ marginBottom: "20px" }}>
            <div style={{
                fontSize: "10px", fontWeight: 700, letterSpacing: "1.2px",
                color: "#475569", textTransform: "uppercase", marginBottom: "10px",
                paddingBottom: "6px", borderBottom: "1px solid #1e293b"
            }}>{title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>{children}</div>
        </div>
    );
}

function ColorPicker({ value, onChange, label, presets }: {
    value: string; onChange: (v: string) => void;
    label: string; presets: string[];
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "#94a3b8" }}>{label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <input type="color" value={value} onChange={e => onChange(e.target.value)}
                        style={{
                            width: "28px", height: "24px", border: "none", borderRadius: "6px",
                            cursor: "pointer", background: "none", padding: 0
                        }}
                    />
                    <span style={{ fontSize: "12px", color: "#64748b", fontFamily: "monospace" }}>{value}</span>
                </div>
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {presets.map(c => (
                    <button key={c} onClick={() => onChange(c)} style={{
                        width: "22px", height: "22px", borderRadius: "6px",
                        background: c, border: value === c ? "2px solid white" : "2px solid transparent",
                        cursor: "pointer", padding: 0,
                        boxShadow: value === c ? `0 0 0 2px ${c}` : "none",
                        transition: "all 0.15s"
                    }} />
                ))}
            </div>
        </div>
    );
}

// ─── Main App Component ──────────────────────────────────────────────────────
function App() {
    // Styling Options
    const [accentColor, setAccentColor] = useState("#3b82f6");
    const [borderRadiusPx, setBorderRadiusPx] = useState(16);
    const [layoutDirection, setLayoutDirection] = useState<"vertical" | "horizontal">("vertical");
    const [cardStyle, setCardStyle] = useState<"progress" | "icon">("progress");
    const [dragHandleDisplay, setDragHandleDisplay] = useState<"left" | "hide">("left");

    // Performance Options
    const [saveDelay, setSaveDelay] = useState<number>(300);
    const [enableKanban, setEnableKanban] = useState<boolean>(true);

    // Header & Footer Options
    const [enableHeader, setEnableHeader] = useState<boolean>(true);
    const [enableFooter, setEnableFooter] = useState<boolean>(true);
    const [enableMainFooter, setEnableMainFooter] = useState<boolean>(true);

    // Kanban Lanes count (defaults to 3, max 4)
    const [laneCount, setLaneCount] = useState<number>(3);

    // Mendix Simulated DB / Global Task state
    const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);

    // Mendix Simulated Attributes (Serialized order of each column)
    const [todoOrderIds, setTodoOrderIds] = useState<string>("task-1,task-3");
    const [inProgressOrderIds, setInProgressOrderIds] = useState<string>("task-2,task-5");
    const [doneOrderIds, setDoneOrderIds] = useState<string>("task-4");
    const [archivedOrderIds, setArchivedOrderIds] = useState<string>("task-6");

    // Event Logs Panel
    const [logs, setLogs] = useState<string[]>([]);
    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 19)]);
    };

    // Resets order and status
    const handleReset = () => {
        setTasks(INITIAL_TASKS);
        setTodoOrderIds("task-1,task-3");
        setInProgressOrderIds("task-2,task-5");
        setDoneOrderIds("task-4");
        setArchivedOrderIds("task-6");
        setLogs([]);
        addLog("Database reset to defaults.");
    };

    // Helper: Gets simulated props for a column status
    const getColumnProps = (status: "todo" | "in_progress" | "done" | "archived") => {
        // Filter tasks that have this status in DB
        const statusItems = tasks.filter(t => t.status === status);

        // Simulated Mendix ListValue
        const itemsSource = {
            status: "available" as const,
            items: statusItems.map(t => ({
                id: t.id,
                ...t
            }))
        };

        // Determine which order attribute to bind
        let sortedValue = "";
        let setSortedValue: (val: string) => void = () => { };

        if (status === "todo") {
            sortedValue = todoOrderIds;
            setSortedValue = (val) => {
                setTodoOrderIds(val);
                addLog(`💾 [Debounced Sync - TODO] → Value: "${val}"`);
            };
        } else if (status === "in_progress") {
            sortedValue = inProgressOrderIds;
            setSortedValue = (val) => {
                setInProgressOrderIds(val);
                addLog(`💾 [Debounced Sync - PROGRESS] → Value: "${val}"`);
            };
        } else if (status === "done") {
            sortedValue = doneOrderIds;
            setSortedValue = (val) => {
                setDoneOrderIds(val);
                addLog(`💾 [Debounced Sync - DONE] → Value: "${val}"`);
            };
        } else {
            sortedValue = archivedOrderIds;
            setSortedValue = (val) => {
                setArchivedOrderIds(val);
                addLog(`💾 [Debounced Sync - ARCHIVED] → Value: "${val}"`);
            };
        }

        // Simulated Mendix EditableValue
        const sortedAttribute = {
            value: sortedValue,
            readOnly: false,
            setValue: (val: string) => {
                setSortedValue(val);
            }
        };

        // Simulated Mendix ListAttributeValue for item status update
        const itemColumnAttribute = {
            get: (itemObj: any) => ({
                readOnly: false,
                setValue: (newStatus: "todo" | "in_progress" | "done" | "archived") => {
                    addLog(`🔄 [Item Status Shift] → Item "${itemObj.id}" status set to "${newStatus}"`);
                    // Update main DB state
                    setTasks(prev => prev.map(t => t.id === itemObj.id ? { ...t, status: newStatus } : t));
                }
            })
        };

        // Action simulator
        const onSortAction = {
            canExecute: true,
            isExecuting: false,
            execute: () => {
                addLog(`⚡ [Action Triggered] → onSortAction executed for "${status}" column!`);
            }
        };

        // Custom Mendix Content renderer simulator
        const customItemContent = {
            get: (itemObj: any) => {
                const task = tasks.find(t => t.id === itemObj.id)!;
                return cardStyle === "progress"
                    ? <CardStyleA task={task} accentColor={accentColor} />
                    : <CardStyleB task={task} />;
            }
        };

        // Simulated custom widgets for Header and Footer
        const headerContent = (
            <div style={{
                background: "rgba(59, 130, 246, 0.08)",
                border: "1.5px solid rgba(59, 130, 246, 0.2)",
                borderRadius: "10px",
                padding: "8px 12px",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
                color: "#93c5fd",
                boxSizing: "border-box"
            }}>
                <span style={{ fontWeight: 600 }}>📢 Column Header: {status.toUpperCase()}</span>
                <span style={{ fontSize: "10px", background: "rgba(255, 255, 255, 0.1)", padding: "1px 6px", borderRadius: "4px" }}>Static</span>
            </div>
        );

        const footerContent = (
            <button
                onClick={() => {
                    const newId = `task-${Date.now()}`;
                    const newTask: TaskItem = {
                        id: newId,
                        title: `งานใหม่ (${status.toUpperCase()})`,
                        priority: "medium",
                        category: "Development",
                        assignee: "ผู้ใช้",
                        progress: 0,
                        status: status
                    };
                    setTasks(prev => [...prev, newTask]);

                    if (status === "todo") setTodoOrderIds(prev => prev ? `${prev},${newId}` : newId);
                    else if (status === "in_progress") setInProgressOrderIds(prev => prev ? `${prev},${newId}` : newId);
                    else if (status === "done") setDoneOrderIds(prev => prev ? `${prev},${newId}` : newId);
                    else setArchivedOrderIds(prev => prev ? `${prev},${newId}` : newId);

                    addLog(`➕ [Card Added] → Added task inside "${status.toUpperCase()}" lane`);
                }}
                style={{
                    width: "100%",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px dashed rgba(255, 255, 255, 0.15)",
                    borderRadius: "10px",
                    padding: "8px",
                    color: "#94a3b8",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.color = "#f1f5f9";
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                    e.currentTarget.style.color = "#94a3b8";
                }}
            >
                ➕ Add Task Card
            </button>
        );

        const mainFooterContent = (
            <div style={{
                background: "rgba(16, 185, 129, 0.08)",
                border: "1.5px solid rgba(16, 185, 129, 0.2)",
                borderRadius: "10px",
                padding: "6px 12px",
                fontSize: "11px",
                textAlign: "center",
                color: "#86efac",
                boxSizing: "border-box"
            }}>
                <span>📊 summary: {statusItems.length} task{statusItems.length !== 1 ? "s" : ""} active</span>
            </div>
        );

        return {
            name: `simulated-column-${status}`,
            class: `pwb-column-${status}`,
            itemsSource: itemsSource as any,
            customItemContent: customItemContent as any,
            sortedAttribute: sortedAttribute as any,
            onSortAction: onSortAction as any,
            layoutDirection,
            dragHandleDisplay,
            accentColor,
            borderRadius: `${borderRadiusPx}px`,
            enableKanban,
            dragGroup: "kanban-playground",
            columnValue: status,
            itemColumnAttribute: itemColumnAttribute as any,
            saveDelay,
            enableHeader,
            headerContent,
            enableFooter,
            footerContent,
            enableMainFooter,
            mainFooterContent
        };
    };

    return (
        <div style={{
            display: "flex", minHeight: "100vh", width: "100%",
            background: "#0b0f19",
            color: "#f1f5f9",
            fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
        }}>

            {/* ── LEFT: Properties Control Panel ─────────────────────── */}
            <div style={{
                width: "320px", minHeight: "100vh", flexShrink: 0,
                background: "rgba(15,23,42,0.95)",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                display: "flex", flexDirection: "column",
                backdropFilter: "blur(12px)",
                zIndex: 10
            }}>
                <div style={{ padding: "20px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: "10px", color: "#3b82f6", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>
                        🧩 Pluggable Widget Upgrade
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: 800, color: "#f1f5f9" }}>
                        Kanban & Perf Playground
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                        pwbCustomizeContainerDataView v1.1.0
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>

                    <Section title="Performance Settings">
                        <Slider
                            label="Save Debounce Delay"
                            value={saveDelay}
                            min={0} max={2000}
                            onChange={setSaveDelay}
                            unit="ms"
                        />
                        <div style={{ fontSize: "11px", color: "#475569", marginTop: "4px", lineHeight: "1.4" }}>
                            ⏰ หน่วงเวลาบันทึกและส่ง Action กลับ Mendix ช่วยลด Database workload
                        </div>
                    </Section>

                    <Section title="Kanban Core Attributes">
                        <Toggle
                            label="Enable Kanban Support"
                            value={enableKanban}
                            onChange={(v) => {
                                setEnableKanban(v);
                                if (!v) {
                                    setLaneCount(1);
                                } else {
                                    setLaneCount(3);
                                }
                                addLog(`🎛️ [Kanban Toggle] → ${v ? "Enabled (cross-column)" : "Disabled (single column)"}`);
                            }}
                        />
                        {enableKanban && (
                            <Slider
                                label="Simulated Lanes"
                                value={laneCount}
                                min={1} max={4}
                                onChange={(val) => {
                                    setLaneCount(val);
                                    addLog(`🎛️ [Lane Count] → Set to ${val} columns`);
                                }}
                                unit=" Lanes"
                            />
                        )}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "8px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                                <span style={{ color: "#94a3b8" }}>Drag Group:</span>
                                <span style={{ color: "#3b82f6", fontWeight: 700 }}>kanban-playground</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                                <span style={{ color: "#94a3b8" }}>Column Attribute:</span>
                                <span style={{ color: "#10b981", fontWeight: 700 }}>status (Enum/String)</span>
                            </div>
                        </div>
                    </Section>

                    <Section title="Layout Direction">
                        <div style={{ display: "flex", gap: "8px" }}>
                            {(["vertical", "horizontal"] as const).map(dir => (
                                <button key={dir} onClick={() => setLayoutDirection(dir)} style={{
                                    flex: 1, padding: "8px", borderRadius: "8px", cursor: "pointer",
                                    border: `1.5px solid ${layoutDirection === dir ? "#3b82f6" : "#1e293b"}`,
                                    background: layoutDirection === dir ? "rgba(59,130,246,0.15)" : "#0f172a",
                                    color: layoutDirection === dir ? "#3b82f6" : "#64748b",
                                    fontWeight: layoutDirection === dir ? 700 : 400,
                                    fontSize: "13px", transition: "all 0.2s"
                                }}>
                                    {dir === "vertical" ? "⬇ แนวตั้ง" : "➡ แนวนอน"}
                                </button>
                            ))}
                        </div>
                    </Section>

                    <Section title="Card Display Style">
                        <div style={{ display: "flex", gap: "8px" }}>
                            {([
                                { key: "progress", label: "📊 Progress Bar" },
                                { key: "icon", label: "🎯 Icon Badge" }
                            ] as const).map(s => (
                                <button key={s.key} onClick={() => setCardStyle(s.key)} style={{
                                    flex: 1, padding: "8px", borderRadius: "8px", cursor: "pointer",
                                    border: `1.5px solid ${cardStyle === s.key ? "#a855f7" : "#1e293b"}`,
                                    background: cardStyle === s.key ? "rgba(168,85,247,0.12)" : "#0f172a",
                                    color: cardStyle === s.key ? "#c084fc" : "#64748b",
                                    fontWeight: cardStyle === s.key ? 700 : 400,
                                    fontSize: "12px", transition: "all 0.2s"
                                }}>
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </Section>

                    <Section title="Header & Footer Settings">
                        <Toggle
                            label="Enable Section Header"
                            value={enableHeader}
                            onChange={(v) => {
                                setEnableHeader(v);
                                addLog(`🎛️ [Header Toggle] → ${v ? "Enabled" : "Disabled"}`);
                            }}
                        />
                        <Toggle
                            label="Enable Section Footer (Button)"
                            value={enableFooter}
                            onChange={(v) => {
                                setEnableFooter(v);
                                addLog(`🎛️ [Footer Toggle] → ${v ? "Enabled" : "Disabled"}`);
                            }}
                        />
                        <Toggle
                            label="Enable Main Footer (Summary)"
                            value={enableMainFooter}
                            onChange={(v) => {
                                setEnableMainFooter(v);
                                addLog(`🎛️ [Main Footer Toggle] → ${v ? "Enabled" : "Disabled"}`);
                            }}
                        />
                    </Section>

                    <Section title="Aesthetics">
                        <ColorPicker
                            label="Accent Color"
                            value={accentColor}
                            onChange={setAccentColor}
                            presets={["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"]}
                        />
                        <Slider
                            label="Border Radius"
                            value={borderRadiusPx}
                            min={0} max={24}
                            onChange={setBorderRadiusPx}
                            unit="px"
                        />
                        <Toggle
                            label="Show Drag Handles (⠿)"
                            value={dragHandleDisplay === "left"}
                            onChange={v => setDragHandleDisplay(v ? "left" : "hide")}
                        />
                    </Section>

                    <button onClick={handleReset} style={{
                        width: "100%", padding: "10px", marginTop: "8px",
                        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
                        borderRadius: "10px", color: "#f87171", fontSize: "13px",
                        fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
                    }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.18)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
                    >
                        🔄 รีเซ็ตกระดาน & ฐานข้อมูล
                    </button>
                </div>
            </div>

            {/* ── RIGHT: Live Canvas ─────────────────────────────────── */}
            <div style={{
                flex: 1, display: "flex", flexDirection: "column",
                padding: "24px 32px", overflowY: "auto", height: "100vh"
            }}>
                {/* Header */}
                <div style={{ marginBottom: "20px" }}>
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: "8px",
                        background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
                        borderRadius: "8px", padding: "6px 12px", marginBottom: "10px"
                    }}>
                        <div style={{
                            width: "8px", height: "8px", borderRadius: "50%", background: "#10b981",
                            boxShadow: "0 0 6px #10b981", animation: "pulse 2s infinite"
                        }} />
                        <span style={{ color: "#a7f3d0", fontSize: "12px", fontWeight: 600 }}>Playground Mode - 3 Columns Kanban Board Simulation</span>
                    </div>
                    <h1 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 800 }}>
                        PWB Customize Container DataView (Kanban Engine)
                    </h1>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                        ทดลองลากการ์ดสลับระหว่าง **คอลัมน์แนวตั้ง** หรือ **กล่องแนวนอน** และสังเกตการหน่วงเวลาบันทึก (Debounce Delay) เพื่อยืนยันความไหลลื่นและประสิทธิภาพ
                    </p>
                </div>

                {/* DYNAMIC KANBAN BOARD CONTAINER */}
                <div style={{
                    display: "flex",
                    gap: "20px",
                    flex: 1,
                    minHeight: "450px",
                    marginBottom: "20px"
                }}>
                    {/* Column 1: TODO */}
                    {laneCount >= 1 && (
                        <div style={{
                            flex: 1,
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "16px",
                            padding: "16px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#94a3b8", margin: 0 }}>🔴 TO DO</h3>
                                <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "rgba(239,68,68,0.15)", color: "#f87171" }}>
                                    {tasks.filter(t => t.status === "todo").length}
                                </span>
                            </div>
                            <div style={{ flex: 1, overflowY: "auto" }}>
                                <PwbCustomizeContainerDataView themePreset={"default_rounded"} darkModeBehavior={"auto"} itemPadding={""} itemGap={""} {...getColumnProps("todo")} />
                            </div>
                        </div>
                    )}

                    {/* Column 2: IN PROGRESS */}
                    {laneCount >= 2 && (
                        <div style={{
                            flex: 1,
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "16px",
                            padding: "16px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#94a3b8", margin: 0 }}>🟡 IN PROGRESS</h3>
                                <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "rgba(245,158,11,0.15)", color: "#fbbf24" }}>
                                    {tasks.filter(t => t.status === "in_progress").length}
                                </span>
                            </div>
                            <div style={{ flex: 1, overflowY: "auto" }}>
                                <PwbCustomizeContainerDataView themePreset={"default_rounded"} darkModeBehavior={"auto"} itemPadding={""} itemGap={""} {...getColumnProps("in_progress")} />
                            </div>
                        </div>
                    )}

                    {/* Column 3: DONE */}
                    {laneCount >= 3 && (
                        <div style={{
                            flex: 1,
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "16px",
                            padding: "16px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#94a3b8", margin: 0 }}>🟢 DONE</h3>
                                <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "rgba(34,197,94,0.15)", color: "#34d399" }}>
                                    {tasks.filter(t => t.status === "done").length}
                                </span>
                            </div>
                            <div style={{ flex: 1, overflowY: "auto" }}>
                                <PwbCustomizeContainerDataView themePreset={"default_rounded"} darkModeBehavior={"auto"} itemPadding={""} itemGap={""} {...getColumnProps("done")} />
                            </div>
                        </div>
                    )}

                    {/* Column 4: ARCHIVED */}
                    {laneCount >= 4 && (
                        <div style={{
                            flex: 1,
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "16px",
                            padding: "16px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#94a3b8", margin: 0 }}>🟣 ARCHIVED</h3>
                                <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "rgba(168,85,247,0.15)", color: "#c084fc" }}>
                                    {tasks.filter(t => t.status === "archived").length}
                                </span>
                            </div>
                            <div style={{ flex: 1, overflowY: "auto" }}>
                                <PwbCustomizeContainerDataView themePreset={"default_rounded"} darkModeBehavior={"auto"} itemPadding={""} itemGap={""} {...getColumnProps("archived")} />
                            </div>
                        </div>
                    )}
                </div>

                {/* LOGS PANEL */}
                <div style={{
                    background: "#080c14",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    height: "150px",
                    display: "flex",
                    flexDirection: "column",
                    boxSizing: "border-box"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "1px" }}>
                            📋 Real-time Event & Performance Logs
                        </span>
                        <span style={{ fontSize: "10px", color: saveDelay > 0 ? "#60a5fa" : "#94a3b8" }}>
                            {saveDelay > 0 ? `Debounce Delay active: ${saveDelay}ms` : "Synchronous Saving"}
                        </span>
                    </div>
                    <div style={{
                        flex: 1,
                        overflowY: "auto",
                        fontFamily: "monospace",
                        fontSize: "11px",
                        lineHeight: "1.6",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px"
                    }}>
                        {logs.length === 0 ? (
                            <span style={{ color: "#334155" }}>— ลากวางหรือขยับตำแหน่งการ์ดเพื่อจับตาดูระบบประมวลผล —</span>
                        ) : logs.map((log, i) => (
                            <span key={i} style={{ color: i === 0 ? "#22c55e" : "#475569" }}>
                                {i === 0 ? "▶ " : "  "}{log}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                input[type="range"] {
                    height: 4px;
                    border-radius: 2px;
                }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
            `}</style>
        </div>
    );
}

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
