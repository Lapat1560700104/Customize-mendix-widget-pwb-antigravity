import { createRoot } from "react-dom/client";
import { useState, useCallback, ReactNode } from "react";
import { DragContainer, DragItem } from "../src/components/DragContainer";
import "../src/ui/PwbCustomizeContainerDataView.css";

// ─── Simulated data items ────────────────────────────────────────────────────
interface TaskItem {
    id: string;
    title: string;
    priority: "high" | "medium" | "low";
    category: string;
    assignee: string;
    progress: number;
}

const INITIAL_TASKS: TaskItem[] = [
    { id: "task-1", title: "ออกแบบ UI หน้าหลัก", priority: "high", category: "Design", assignee: "สมชาย", progress: 85 },
    { id: "task-2", title: "พัฒนา API Backend", priority: "high", category: "Development", assignee: "สมหญิง", progress: 60 },
    { id: "task-3", title: "เขียน Unit Tests", priority: "medium", category: "QA", assignee: "สมศักดิ์", progress: 40 },
    { id: "task-4", title: "Deploy สู่ Production", priority: "low", category: "DevOps", assignee: "สมใจ", progress: 10 },
    { id: "task-5", title: "ทำเอกสาร API", priority: "medium", category: "Documentation", assignee: "สมพร", progress: 70 },
];

const PRIORITY_CONFIG = {
    high:   { label: "สูง",    color: "#ef4444", bg: "rgba(239,68,68,0.1)",   badge: "🔴" },
    medium: { label: "กลาง",   color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  badge: "🟡" },
    low:    { label: "ต่ำ",    color: "#22c55e", bg: "rgba(34,197,94,0.1)",   badge: "🟢" },
};

const CATEGORY_COLORS: Record<string, string> = {
    Design:        "#a855f7",
    Development:   "#3b82f6",
    QA:            "#f59e0b",
    DevOps:        "#ec4899",
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
                <span style={{ fontWeight: 700, fontSize: "15px", color: "#1e293b" }}>{task.title}</span>
                <span style={{
                    fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "12px",
                    background: prio.bg, color: prio.color, whiteSpace: "nowrap", marginLeft: "8px"
                }}>{prio.badge} {prio.label}</span>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{
                    fontSize: "11px", padding: "2px 8px", borderRadius: "8px", fontWeight: 600,
                    background: `${catColor}18`, color: catColor
                }}>{task.category}</span>
                <span style={{ fontSize: "12px", color: "#64748b" }}>👤 {task.assignee}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                    flex: 1, height: "6px", borderRadius: "3px", background: "#e2e8f0", overflow: "hidden"
                }}>
                    <div style={{
                        height: "100%", borderRadius: "3px",
                        width: `${task.progress}%`,
                        background: `linear-gradient(90deg, ${accentColor}, ${catColor})`,
                        transition: "width 0.4s ease"
                    }} />
                </div>
                <span style={{ fontSize: "12px", fontWeight: 700, color: accentColor, minWidth: "36px" }}>
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
                width: "42px", height: "42px", borderRadius: "12px", flexShrink: 0,
                background: `linear-gradient(135deg, ${catColor}30, ${catColor}15)`,
                border: `1.5px solid ${catColor}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px"
            }}>
                {task.category === "Design" ? "🎨" :
                 task.category === "Development" ? "💻" :
                 task.category === "QA" ? "🧪" :
                 task.category === "DevOps" ? "🚀" : "📝"}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#1e293b", marginBottom: "2px" }}>{task.title}</div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>{task.assignee} · {task.progress}% เสร็จแล้ว</div>
            </div>
            <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: `conic-gradient(${catColor} ${task.progress * 3.6}deg, #e2e8f0 0deg)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, position: "relative"
            }}>
                <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: "white", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "9px", fontWeight: 700, color: catColor
                }}>
                    {task.progress}%
                </div>
            </div>
        </div>
    );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────
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

// ─── Slider ───────────────────────────────────────────────────────────────────
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

// ─── Section Header ───────────────────────────────────────────────────────────
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

// ─── Color Picker Row ─────────────────────────────────────────────────────────
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
                        style={{ width: "28px", height: "24px", border: "none", borderRadius: "6px",
                            cursor: "pointer", background: "none", padding: 0 }}
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

// ─── Sorted Order Log Panel ───────────────────────────────────────────────────
function SortLog({ logs }: { logs: string[] }) {
    return (
        <div style={{
            background: "#0f172a", borderRadius: "10px", padding: "12px",
            maxHeight: "160px", overflowY: "auto", fontFamily: "monospace"
        }}>
            {logs.length === 0 ? (
                <div style={{ color: "#475569", fontSize: "12px" }}>ลากสลับแถวเพื่อดู Sort Log ที่นี่...</div>
            ) : logs.map((log, i) => (
                <div key={i} style={{ color: i === 0 ? "#22c55e" : "#475569", fontSize: "11px", marginBottom: "4px" }}>
                    {i === 0 ? "▶ " : "  "}{log}
                </div>
            ))}
        </div>
    );
}

// ─── Main Playground App ──────────────────────────────────────────────────────
function App() {
    // Properties
    const [accentColor, setAccentColor] = useState("#3b82f6");
    const [borderRadiusPx, setBorderRadiusPx] = useState(16);
    const [layoutDirection, setLayoutDirection] = useState<"vertical" | "horizontal">("vertical");
    const [cardStyle, setCardStyle] = useState<"progress" | "icon">("progress");
    const [showHandleLabel, setShowHandleLabel] = useState(false);

    // State
    const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
    const [sortLog, setSortLog] = useState<string[]>([]);
    const [sortedAttribute, setSortedAttribute] = useState<string>("");

    // Convert to DragItems
    const dragItems: DragItem[] = tasks.map(t => ({ id: t.id, rawObject: t }));

    const handleOrderChange = useCallback((newIds: string[]) => {
        const reordered = newIds.map(id => tasks.find(t => t.id === id)!).filter(Boolean);
        setTasks(reordered);
        const csv = newIds.join(",");
        setSortedAttribute(csv);
        setSortLog(prev => [
            `[${new Date().toLocaleTimeString()}] → ${csv}`,
            ...prev.slice(0, 9)
        ]);
    }, [tasks]);

    const resetOrder = () => {
        setTasks(INITIAL_TASKS);
        setSortedAttribute("");
        setSortLog([]);
    };

    const renderItem = useCallback((rawObject: TaskItem) => {
        if (cardStyle === "progress") {
            return <CardStyleA task={rawObject} accentColor={accentColor} />;
        }
        return <CardStyleB task={rawObject} />;
    }, [cardStyle, accentColor]);

    const borderRadius = `${borderRadiusPx}px`;

    return (
        <div style={{
            display: "flex", minHeight: "100vh", width: "100%",
            fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
        }}>

            {/* ── LEFT: Properties Panel ──────────────────────────────── */}
            <div style={{
                width: "300px", minHeight: "100vh", flexShrink: 0,
                background: "rgba(15,23,42,0.95)",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                display: "flex", flexDirection: "column",
                backdropFilter: "blur(12px)"
            }}>
                {/* Header */}
                <div style={{ padding: "20px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: "11px", color: "#3b82f6", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>
                        🧩 PWB Container Widget
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: 800, color: "#f1f5f9" }}>
                        Developer Playground
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                        Drag & Drop Reordering · DataView Container
                    </div>
                </div>

                {/* Properties */}
                <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>

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
                                { key: "icon",     label: "🎯 Icon Circle" }
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
                            min={0} max={32}
                            onChange={setBorderRadiusPx}
                            unit="px"
                        />
                    </Section>

                    <Section title="Options">
                        <Toggle value={showHandleLabel} onChange={setShowHandleLabel} label="Show Drag Handle Tooltip" />
                    </Section>

                    {/* Sorted Attribute Simulation */}
                    <Section title="Sorted Attribute (Mendix String)">
                        <div style={{
                            background: "#0f172a", borderRadius: "8px", padding: "10px",
                            fontSize: "11px", color: "#22c55e", fontFamily: "monospace",
                            wordBreak: "break-all", minHeight: "40px", lineHeight: "1.6"
                        }}>
                            {sortedAttribute || <span style={{ color: "#334155" }}>— ยังไม่ได้ลากสลับ —</span>}
                        </div>
                        <div style={{ fontSize: "11px", color: "#475569", marginTop: "4px" }}>
                            💾 ค่าที่จะบันทึกลงใน sortedAttribute ของ Mendix
                        </div>
                    </Section>

                    <Section title="Sort Event Log (onSortAction)">
                        <SortLog logs={sortLog} />
                    </Section>

                    {/* Reset Button */}
                    <button onClick={resetOrder} style={{
                        width: "100%", padding: "10px", marginTop: "8px",
                        background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
                        borderRadius: "10px", color: "#f87171", fontSize: "13px",
                        fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
                    }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.2)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.12)")}
                    >
                        🔄 รีเซ็ตลำดับกลับต้นฉบับ
                    </button>
                </div>

                {/* Footer */}
                <div style={{
                    padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.05)",
                    fontSize: "11px", color: "#334155", textAlign: "center"
                }}>
                    pwbCustomizeContainerDataView v1.0.0 · PWB 2026
                </div>
            </div>

            {/* ── RIGHT: Live Canvas ──────────────────────────────────── */}
            <div style={{
                flex: 1, display: "flex", flexDirection: "column",
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                padding: "32px", overflowY: "auto"
            }}>
                {/* Canvas Header */}
                <div style={{ marginBottom: "24px" }}>
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: "8px",
                        background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)",
                        borderRadius: "8px", padding: "6px 12px", marginBottom: "12px"
                    }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e",
                            boxShadow: "0 0 6px #22c55e", animation: "pulse 2s infinite" }} />
                        <span style={{ color: "#93c5fd", fontSize: "12px", fontWeight: 600 }}>Live Preview</span>
                    </div>
                    <h1 style={{ margin: "0 0 6px", fontSize: "22px", fontWeight: 800, color: "#f1f5f9" }}>
                        PWB Customize Container DataView
                    </h1>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                        ลากแถวรายการด้านซ้าย (⠿) เพื่อสลับลำดับ · ปรับ Properties ทางซ้ายได้ทันที
                    </p>
                </div>

                {/* Widget Canvas Area */}
                <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "20px", padding: "24px",
                    backdropFilter: "blur(8px)"
                }}>
                    {/* Mendix-like property annotation bar */}
                    <div style={{
                        display: "flex", gap: "16px", marginBottom: "16px",
                        padding: "8px 12px", background: "rgba(59,130,246,0.06)",
                        borderRadius: "10px", border: "1px solid rgba(59,130,246,0.1)",
                        flexWrap: "wrap"
                    }}>
                        {[
                            { label: "layoutDirection", value: layoutDirection },
                            { label: "accentColor", value: accentColor },
                            { label: "borderRadius", value: borderRadius },
                            { label: "itemsSource.count", value: `${tasks.length} items` },
                        ].map(p => (
                            <div key={p.label} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                <span style={{ fontSize: "11px", color: "#475569", fontFamily: "monospace" }}>{p.label}:</span>
                                <code style={{ fontSize: "11px", color: "#60a5fa", background: "rgba(96,165,250,0.1)",
                                    padding: "1px 6px", borderRadius: "4px" }}>{p.value}</code>
                            </div>
                        ))}
                    </div>

                    {/* THE WIDGET — DragContainer rendered live */}
                    <DragContainer
                        items={dragItems}
                        renderItem={rawObject => renderItem(rawObject as TaskItem)}
                        onOrderChange={handleOrderChange}
                        accentColor={accentColor}
                        borderRadius={borderRadius}
                        layoutDirection={layoutDirection}
                    />
                </div>

                {/* Info Cards Row */}
                <div style={{ display: "flex", gap: "16px", marginTop: "24px", flexWrap: "wrap" }}>
                    {[
                        { icon: "🧩", title: "Nested Widgets", desc: "รับ Widget ของ Mendix ใดๆ เข้ามาแสดงผลในแต่ละแถวได้อิสระ" },
                        { icon: "🎯", title: "Drag & Drop Sort", desc: "ลากสลับลำดับลื่นไหล HTML5 Native · Vertical / Horizontal" },
                        { icon: "💾", title: "Mendix Attribute Sync", desc: "บันทึก GUIDs ที่เรียงลำดับใหม่กลับสู่ String Attribute โดยอัตโนมัติ" },
                        { icon: "⚡", title: "onSortAction", desc: "เรียก Microflow / Nanoflow ทุกครั้งที่ลากวางเสร็จสมบูรณ์" },
                    ].map(card => (
                        <div key={card.title} style={{
                            flex: "1 1 180px",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "14px", padding: "16px"
                        }}>
                            <div style={{ fontSize: "24px", marginBottom: "8px" }}>{card.icon}</div>
                            <div style={{ fontSize: "14px", fontWeight: 700, color: "#f1f5f9", marginBottom: "4px" }}>{card.title}</div>
                            <div style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.5" }}>{card.desc}</div>
                        </div>
                    ))}
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

// ─── Bootstrap ────────────────────────────────────────────────────────────────
const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
