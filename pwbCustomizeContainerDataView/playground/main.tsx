import { createRoot } from "react-dom/client";
import React, { useState, ReactNode, useRef, CSSProperties } from "react";
import { PwbCustomizeContainerDataView } from "../src/PwbCustomizeContainerDataView";
import "../src/ui/PwbCustomizeContainerDataView.css";
import Big from "big.js";

// ─── Simulated data items ────────────────────────────────────────────────────
interface TaskItem {
    id: string;
    title: string;
    priority: "high" | "medium" | "low";
    category: string;
    assignee: string;
    progress: number;
    status: "todo" | "in_progress" | "done" | "archived";
    sortId: number;
}

const INITIAL_TASKS: TaskItem[] = [
    {
        id: "task-1",
        title: "ออกแบบ UI หน้าหลัก",
        priority: "high",
        category: "Design",
        assignee: "สมชาย",
        progress: 85,
        status: "todo",
        sortId: 2
    },
    {
        id: "task-2",
        title: "พัฒนา API Backend",
        priority: "high",
        category: "Development",
        assignee: "สมหญิง",
        progress: 60,
        status: "in_progress",
        sortId: 1
    },
    {
        id: "task-3",
        title: "เขียน Unit Tests",
        priority: "medium",
        category: "QA",
        assignee: "สมศักดิ์",
        progress: 40,
        status: "todo",
        sortId: 1
    },
    {
        id: "task-4",
        title: "Deploy สู่ Production",
        priority: "low",
        category: "DevOps",
        assignee: "สมใจ",
        progress: 10,
        status: "done",
        sortId: 1
    },
    {
        id: "task-5",
        title: "ทำเอกสาร API",
        priority: "medium",
        category: "Documentation",
        assignee: "สมพร",
        progress: 70,
        status: "in_progress",
        sortId: 2
    },
    {
        id: "task-6",
        title: "เก็บกวาดโค้ดเก่า (Refactor)",
        priority: "low",
        category: "Development",
        assignee: "สมนึก",
        progress: 100,
        status: "archived",
        sortId: 1
    }
];

const PRIORITY_CONFIG = {
    high: { label: "สูง", color: "#ef4444", bg: "rgba(239,68,68,0.1)", badge: "🔴" },
    medium: { label: "กลาง", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", badge: "🟡" },
    low: { label: "ต่ำ", color: "#22c55e", bg: "rgba(34,197,94,0.1)", badge: "🟢" }
};

const CATEGORY_COLORS: Record<string, string> = {
    Design: "#a855f7",
    Development: "#3b82f6",
    QA: "#f59e0b",
    DevOps: "#ec4899",
    Documentation: "#14b8a6"
};

// ─── Card Renderers ───────────────────────────────────────────────────────────
function CardStyleA({ task, accentColor }: { task: TaskItem; accentColor: string }): ReactNode {
    const prio = PRIORITY_CONFIG[task.priority];
    const catColor = CATEGORY_COLORS[task.category] || accentColor;
    return (
        <div
            style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "8px"
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontWeight: 700, fontSize: "14px", color: "#f1f5f9" }}>{task.title}</span>
                <span
                    style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        padding: "2px 6px",
                        borderRadius: "12px",
                        background: prio.bg,
                        color: prio.color,
                        whiteSpace: "nowrap",
                        marginLeft: "8px"
                    }}
                >
                    {prio.badge} {prio.label}
                </span>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span
                    style={{
                        fontSize: "11px",
                        padding: "2px 8px",
                        borderRadius: "8px",
                        fontWeight: 600,
                        background: `${catColor}18`,
                        color: catColor
                    }}
                >
                    {task.category}
                </span>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>👤 {task.assignee}</span>
                <span
                    style={{
                        fontSize: "11px",
                        color: "#64748b",
                        background: "rgba(255,255,255,0.05)",
                        padding: "1px 5px",
                        borderRadius: "4px"
                    }}
                >
                    SortID: {task.sortId}
                </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                    style={{
                        flex: 1,
                        height: "6px",
                        borderRadius: "3px",
                        background: "#334155",
                        overflow: "hidden"
                    }}
                >
                    <div
                        style={{
                            height: "100%",
                            borderRadius: "3px",
                            width: `${task.progress}%`,
                            background: `linear-gradient(90deg, ${accentColor}, ${catColor})`,
                            transition: "width 0.4s ease"
                        }}
                    />
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
            <div
                style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    flexShrink: 0,
                    background: `linear-gradient(135deg, ${catColor}30, ${catColor}15)`,
                    border: `1.5px solid ${catColor}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px"
                }}
            >
                {task.category === "Design"
                    ? "🎨"
                    : task.category === "Development"
                    ? "💻"
                    : task.category === "QA"
                    ? "🧪"
                    : task.category === "DevOps"
                    ? "🚀"
                    : "📝"}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "#f1f5f9", marginBottom: "2px" }}>
                    {task.title}
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                    {task.assignee} · {task.progress}% · SortID: {task.sortId}
                </div>
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
                    width: "40px",
                    height: "22px",
                    borderRadius: "11px",
                    cursor: "pointer",
                    background: value ? "#3b82f6" : "#334155",
                    position: "relative",
                    transition: "background 0.2s"
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "3px",
                        left: value ? "21px" : "3px",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background: "white",
                        transition: "left 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.3)"
                    }}
                />
            </div>
        </div>
    );
}

function Slider({
    value,
    min,
    max,
    onChange,
    label,
    unit = ""
}: {
    value: number;
    min: number;
    max: number;
    onChange: (v: number) => void;
    label: string;
    unit?: string;
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", color: "#94a3b8" }}>{label}</span>
                <span style={{ fontSize: "13px", color: "#3b82f6", fontWeight: 700 }}>
                    {value}
                    {unit}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={e => onChange(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#3b82f6", cursor: "pointer" }}
            />
        </div>
    );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div style={{ marginBottom: "20px" }}>
            <div
                style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "1.2px",
                    color: "#475569",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                    paddingBottom: "6px",
                    borderBottom: "1px solid #1e293b"
                }}
            >
                {title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>{children}</div>
        </div>
    );
}

function ColorPicker({
    value,
    onChange,
    label,
    presets
}: {
    value: string;
    onChange: (v: string) => void;
    label: string;
    presets: string[];
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "#94a3b8" }}>{label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <input
                        type="color"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        style={{
                            width: "28px",
                            height: "24px",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            background: "none",
                            padding: 0
                        }}
                    />
                    <span style={{ fontSize: "12px", color: "#64748b", fontFamily: "monospace" }}>{value}</span>
                </div>
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {presets.map(c => (
                    <button
                        key={c}
                        onClick={() => onChange(c)}
                        style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "6px",
                            background: c,
                            border: value === c ? "2px solid white" : "2px solid transparent",
                            cursor: "pointer",
                            padding: 0,
                            boxShadow: value === c ? `0 0 0 2px ${c}` : "none",
                            transition: "all 0.15s"
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

// ─── Form Builder Configurations ─────────────────────────────────────────────
interface FormField {
    id: string;
    type: "text" | "number" | "dropdown" | "checkbox" | "textarea" | "datepicker" | "button";
    label: string;
    placeholder: string;
    required: boolean;
    options?: string;
    status: "toolbox" | "canvas";
    sortId: number;
}

const FORM_TEMPLATES: FormField[] = [
    {
        id: "tmpl-text",
        type: "text",
        label: "ข้อความสั้น (Short Text)",
        placeholder: "ระบุข้อความ...",
        required: false,
        status: "toolbox",
        sortId: 1
    },
    {
        id: "tmpl-number",
        type: "number",
        label: "ตัวเลข (Number)",
        placeholder: "0",
        required: false,
        status: "toolbox",
        sortId: 2
    },
    {
        id: "tmpl-dropdown",
        type: "dropdown",
        label: "ตัวเลือก (Dropdown)",
        placeholder: "โปรดเลือก...",
        required: false,
        options: "ตัวเลือก 1, ตัวเลือก 2, ตัวเลือก 3",
        status: "toolbox",
        sortId: 3
    },
    {
        id: "tmpl-datepicker",
        type: "datepicker",
        label: "วันที่ (Date Picker)",
        placeholder: "วว/ดด/ปปปป",
        required: false,
        status: "toolbox",
        sortId: 4
    },
    {
        id: "tmpl-checkbox",
        type: "checkbox",
        label: "กล่องเลือก (Checkbox)",
        placeholder: "",
        required: false,
        status: "toolbox",
        sortId: 5
    },
    {
        id: "tmpl-textarea",
        type: "textarea",
        label: "ข้อความยาว (Textarea)",
        placeholder: "ระบุรายละเอียดเพิ่มเติม...",
        required: false,
        status: "toolbox",
        sortId: 6
    },
    {
        id: "tmpl-button",
        type: "button",
        label: "ปุ่มส่งข้อมูล (Submit Button)",
        placeholder: "",
        required: false,
        status: "toolbox",
        sortId: 7
    }
];

const inputStyle: CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    background: "rgba(15, 23, 42, 0.6)",
    color: "#f1f5f9",
    fontSize: "13px",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s"
};

// ─── Main App Component ──────────────────────────────────────────────────────
function App() {
    // Mode Switcher: "kanban" | "form_builder"
    const [playgroundMode, setPlaygroundMode] = useState<"kanban" | "form_builder">("kanban");

    // Actions Section settings state
    const [enableActionsSection, setEnableActionsSection] = useState<boolean>(false);
    const [actionsSectionPositionRow, setActionsSectionPositionRow] = useState<"left" | "right">("left");
    const [actionsSectionPositionCol, setActionsSectionPositionCol] = useState<"top" | "bottom">("top");
    const [actionsSectionLayout, setActionsSectionLayout] = useState<"side_by_side" | "stacked">("side_by_side");
    const [actionsSectionSize, setActionsSectionSize] = useState<
        "auto" | "ratio_15" | "ratio_20" | "ratio_25" | "ratio_30" | "ratio_40" | "custom"
    >("ratio_25");
    const [actionsSectionSizeCustom, setActionsSectionSizeCustom] = useState<string>("200px");
    const [accentColor, setAccentColor] = useState("#3b82f6");
    const [borderRadiusPx, setBorderRadiusPx] = useState(16);
    const [layoutDirection, setLayoutDirection] = useState<"vertical" | "horizontal">("vertical");
    const [cardStyle, setCardStyle] = useState<"progress" | "icon">("progress");
    const [dragHandleDisplay, setDragHandleDisplay] = useState<"left" | "hide">("left");
    const [themePreset, setThemePreset] = useState<
        "default_rounded" | "modern_glass" | "minimalist_flat" | "neo_brutalist"
    >("default_rounded");
    const [darkModeBehavior, setDarkModeBehavior] = useState<"auto" | "light" | "dark">("auto");
    const [itemPadding, setItemPadding] = useState<string>("");
    const [itemGap, setItemGap] = useState<string>("");
    const [saveDelay, setSaveDelay] = useState<number>(300);
    const [dragHandleIcon, setDragHandleIcon] = useState<"dots" | "bars" | "hand" | "crosshair" | "custom_svg">("dots");
    const [dragHandleSvg, setDragHandleSvg] = useState<string>("");
    const [dragHandlePosition, setDragHandlePosition] = useState<"left" | "right">("left");
    const [dragGhostScale, setDragGhostScale] = useState<number>(1.03);
    const [dragGhostOpacity, setDragGhostOpacity] = useState<number>(0.85);
    const [dragGhostShadow, setDragGhostShadow] = useState<string>("");
    const [hoverRevealActions, setHoverRevealActions] = useState<boolean>(false);
    const [animationSpeed, setAnimationSpeed] = useState<number>(250);
    const [wobbleStrength, setWobbleStrength] = useState<number>(1.0);
    const [enableKanban, setEnableKanban] = useState<boolean>(true);
    const [enableHeader, setEnableHeader] = useState<boolean>(true);
    const [enableFooter, setEnableFooter] = useState<boolean>(true);
    const [enableMainFooter, setEnableMainFooter] = useState<boolean>(true);
    const [enableLaneTitle, setEnableLaneTitle] = useState<boolean>(true);
    const [enableOuterFooter, setEnableOuterFooter] = useState<boolean>(true);
    const [readOnlyMode, setReadOnlyMode] = useState<boolean>(false);
    const [laneCount, setLaneCount] = useState<number>(3);
    const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
    const [todoOrderIds, setTodoOrderIds] = useState<string>("task-1,task-3");
    const [inProgressOrderIds, setInProgressOrderIds] = useState<string>("task-2,task-5");
    const [doneOrderIds, setDoneOrderIds] = useState<string>("task-4");
    const [archivedOrderIds, setArchivedOrderIds] = useState<string>("task-6");

    // Form Builder Simulation State (New)
    const [formTitle, setFormTitle] = useState<string>("แบบฟอร์มติดต่อสอบถาม (Contact Form)");
    const [formFields, setFormFields] = useState<FormField[]>([]);
    const [canvasOrderIds, setCanvasOrderIds] = useState<string>("");
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const [formBuilderTab, setFormBuilderTab] = useState<"preview" | "schema">("preview");
    const [liveFormValues, setLiveFormValues] = useState<Record<string, any>>({});
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const lastClonedIdRef = useRef<string | null>(null);

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

    const handleClearFormCanvas = () => {
        setFormFields([]);
        setCanvasOrderIds("");
        setSelectedFieldId(null);
        setLiveFormValues({});
        setIsSubmitted(false);
        setFormErrors({});
        addLog("🧹 [Form Builder] Canvas cleared");
    };

    const loadContactTemplate = () => {
        const fields: FormField[] = [
            {
                id: "contact-name",
                type: "text",
                label: "ชื่อผู้ติดต่อ (Full Name)",
                placeholder: "ระบุชื่อ-นามสกุล",
                required: true,
                status: "canvas",
                sortId: 1
            },
            {
                id: "contact-email",
                type: "text",
                label: "อีเมล (Email Address)",
                placeholder: "example@domain.com",
                required: true,
                status: "canvas",
                sortId: 2
            },
            {
                id: "contact-message",
                type: "textarea",
                label: "ข้อความถึงเรา (Your Message)",
                placeholder: "ระบุรายละเอียดข้อความ...",
                required: false,
                status: "canvas",
                sortId: 3
            },
            {
                id: "contact-submit",
                type: "button",
                label: "ส่งข้อความ (Send Message)",
                placeholder: "",
                required: false,
                status: "canvas",
                sortId: 4
            }
        ];
        setFormFields(fields);
        setCanvasOrderIds(fields.map(f => f.id).join(","));
        setSelectedFieldId("contact-name");
        setLiveFormValues({});
        setIsSubmitted(false);
        setFormErrors({});
        addLog("📋 [Form Builder] Loaded 'Contact Us' template");
    };

    const loadRegisterTemplate = () => {
        const fields: FormField[] = [
            {
                id: "reg-name",
                type: "text",
                label: "ชื่อผู้ลงทะเบียน (Full Name)",
                placeholder: "นาย/นาง/นางสาว...",
                required: true,
                status: "canvas",
                sortId: 1
            },
            {
                id: "reg-qty",
                type: "number",
                label: "จำนวนบัตรที่จอง (Ticket Qty)",
                placeholder: "1",
                required: true,
                status: "canvas",
                sortId: 2
            },
            {
                id: "reg-date",
                type: "datepicker",
                label: "วันที่เข้าร่วมงาน (Attendance Date)",
                placeholder: "วว/ดด/ปปปป",
                required: true,
                status: "canvas",
                sortId: 3
            },
            {
                id: "reg-type",
                type: "dropdown",
                label: "ประเภทบัตร (Ticket Type)",
                placeholder: "เลือกประเภทบัตร...",
                required: true,
                options: "General Admission, VIP Pass, Student Pass",
                status: "canvas",
                sortId: 4
            },
            {
                id: "reg-terms",
                type: "checkbox",
                label: "ฉันยอมรับข้อตกลงและเงื่อนไขการร่วมงาน",
                placeholder: "",
                required: true,
                status: "canvas",
                sortId: 5
            },
            {
                id: "reg-submit",
                type: "button",
                label: "ยืนยันลงทะเบียน (Confirm Registration)",
                placeholder: "",
                required: false,
                status: "canvas",
                sortId: 6
            }
        ];
        setFormFields(fields);
        setCanvasOrderIds(fields.map(f => f.id).join(","));
        setSelectedFieldId("reg-name");
        setLiveFormValues({});
        setIsSubmitted(false);
        setFormErrors({});
        addLog("📋 [Form Builder] Loaded 'Event Registration' template");
    };

    // Helper: Gets sorted list of fields on Canvas.
    // formFields is directly reordered in state by setSortedValue on every drag,
    // so filtering by "canvas" status gives the correct order without needing canvasOrderIds.
    const getSortedCanvasFields = () => formFields.filter(f => f.status === "canvas");

    // Helper: Updates selected field properties
    const updateSelectedField = (updated: Partial<FormField>) => {
        if (!selectedFieldId) return;
        setFormFields(prev => prev.map(f => (f.id === selectedFieldId ? { ...f, ...updated } : f)));
    };

    // Helper: Gets simulated props for a column status
    const getColumnProps = (status: "todo" | "in_progress" | "done" | "archived") => {
        // Filter tasks that have this status in DB
        const statusItems = tasks.filter(t => t.status === status);

        // Simulated Mendix ListValue
        const itemsSource = {
            status: "available" as const,
            items: statusItems.map(t => ({ ...t }))
        };

        // Determine which order attribute to bind
        let sortedValue = "";
        let setSortedValue: (val: string) => void = () => {};

        if (status === "todo") {
            sortedValue = todoOrderIds;
            setSortedValue = val => {
                setTodoOrderIds(val);
                addLog(`💾 [Debounced Sync - TODO] → Value: "${val}"`);
            };
        } else if (status === "in_progress") {
            sortedValue = inProgressOrderIds;
            setSortedValue = val => {
                setInProgressOrderIds(val);
                addLog(`💾 [Debounced Sync - PROGRESS] → Value: "${val}"`);
            };
        } else if (status === "done") {
            sortedValue = doneOrderIds;
            setSortedValue = val => {
                setDoneOrderIds(val);
                addLog(`💾 [Debounced Sync - DONE] → Value: "${val}"`);
            };
        } else {
            sortedValue = archivedOrderIds;
            setSortedValue = val => {
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
                    setTasks(prev => prev.map(t => (t.id === itemObj.id ? { ...t, status: newStatus } : t)));
                }
            })
        };

        // Simulated Mendix ListAttributeValue for SortID
        const sortIdAttribute = {
            get: (itemObj: any) => {
                const task = tasks.find(t => t.id === itemObj.id)!;
                const bigVal = {
                    comparedTo: (other: any) => {
                        const otherVal = other && typeof other === "object" && "value" in other ? other.value : other;
                        if (task.sortId < otherVal) {
                            return -1;
                        }
                        if (task.sortId > otherVal) {
                            return 1;
                        }
                        return 0;
                    },
                    value: task.sortId,
                    toString: () => String(task.sortId)
                };
                return {
                    value: bigVal
                };
            }
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
                return cardStyle === "progress" ? (
                    <CardStyleA task={task} accentColor={accentColor} />
                ) : (
                    <CardStyleB task={task} />
                );
            }
        };

        // Simulated custom widgets for Header and Footer
        const headerContent = (
            <div
                style={{
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
                }}
            >
                <span style={{ fontWeight: 600 }}>📢 Column Header: {status.toUpperCase()}</span>
                <span
                    style={{
                        fontSize: "10px",
                        background: "rgba(255, 255, 255, 0.1)",
                        padding: "1px 6px",
                        borderRadius: "4px"
                    }}
                >
                    Static
                </span>
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
                        status: status,
                        sortId: 1
                    };
                    setTasks(prev => [...prev, newTask]);

                    if (status === "todo") setTodoOrderIds(prev => (prev ? `${prev},${newId}` : newId));
                    else if (status === "in_progress")
                        setInProgressOrderIds(prev => (prev ? `${prev},${newId}` : newId));
                    else if (status === "done") setDoneOrderIds(prev => (prev ? `${prev},${newId}` : newId));
                    else setArchivedOrderIds(prev => (prev ? `${prev},${newId}` : newId));

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
            <div
                style={{
                    background: "rgba(16, 185, 129, 0.08)",
                    border: "1.5px solid rgba(16, 185, 129, 0.2)",
                    borderRadius: "10px",
                    padding: "6px 12px",
                    fontSize: "11px",
                    textAlign: "center",
                    color: "#86efac",
                    boxSizing: "border-box"
                }}
            >
                <span>
                    📊 summary: {statusItems.length} task{statusItems.length !== 1 ? "s" : ""} active
                </span>
            </div>
        );

        const laneTitle = {
            status: "available" as const,
            value:
                status === "todo"
                    ? "🔴 TO DO"
                    : status === "in_progress"
                    ? "🟡 IN PROGRESS"
                    : status === "done"
                    ? "🟢 DONE"
                    : "🟣 ARCHIVED"
        } as any;

        const laneTitleContent = (
            <span
                style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "10px",
                    background:
                        status === "todo"
                            ? "rgba(239,68,68,0.15)"
                            : status === "in_progress"
                            ? "rgba(245,158,11,0.15)"
                            : status === "done"
                            ? "rgba(34,197,94,0.15)"
                            : "rgba(168,85,247,0.15)",
                    color:
                        status === "todo"
                            ? "#f87171"
                            : status === "in_progress"
                            ? "#fbbf24"
                            : status === "done"
                            ? "#34d399"
                            : "#c084fc"
                }}
            >
                {statusItems.length} items
            </span>
        );

        const outerFooterContent = (
            <div
                style={{
                    fontSize: "11px",
                    color: "#64748b",
                    textAlign: "right",
                    padding: "4px 8px",
                    borderTop: "1px dashed rgba(255,255,255,0.06)",
                    marginTop: "8px"
                }}
            >
                🎛️ Outer Footer Level
            </div>
        );

        const mockActionsContent = {
            get: (itemObj: any) => (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", boxSizing: "border-box" }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            addLog(`🔥 Action clicked on card: "${itemObj.title}"`);
                        }}
                        style={{
                            background: accentColor,
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "4px 8px",
                            fontSize: "11px",
                            cursor: "pointer",
                            fontWeight: 600,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            whiteSpace: "nowrap"
                        }}
                    >
                        ⚡ Action
                    </button>
                </div>
            )
        };

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
            mainFooterContent,
            enableLaneTitle,
            laneTitle,
            laneTitleContent,
            enableOuterFooter,
            outerFooterContent,
            laneClass: "playground-inner-lane-card",
            themePreset,
            darkModeBehavior,
            itemPadding,
            itemGap,
            readOnlyMode,
            sortIdAttribute: sortIdAttribute as any,
            enableActionsSection,
            actionsSectionContent: mockActionsContent,
            actionsSectionPositionRow: actionsSectionPositionRow as any,
            actionsSectionPositionCol: actionsSectionPositionCol as any,
            actionsSectionLayout: actionsSectionLayout as any,
            actionsSectionSize: actionsSectionSize as any,
            actionsSectionSizeCustom,
            dragHandleIcon,
            dragHandleSvg,
            dragHandlePosition,
            dragGhostScale: new Big(dragGhostScale),
            dragGhostOpacity: new Big(dragGhostOpacity),
            dragGhostShadow,
            hoverRevealActions,
            animationSpeed,
            wobbleStrength: new Big(wobbleStrength)
        };
    };

    // Helper: Gets simulated props for the Form Builder Columns (Toolbox / Canvas)
    const getFormColumnProps = (column: "toolbox" | "canvas") => {
        const columnItems = column === "toolbox" ? FORM_TEMPLATES : formFields;

        const itemsSource = {
            status: "available" as const,
            items: columnItems.map(f => ({ ...f }))
        };

        let sortedValue = "";
        let setSortedValue: (val: string) => void = () => {};

        if (column === "canvas") {
            sortedValue = canvasOrderIds;
            setSortedValue = val => {
                const ids = val.split(",").map(id => {
                    if (id.startsWith("tmpl-")) {
                        return lastClonedIdRef.current || id;
                    }
                    return id;
                });
                const cleanedIds = ids.join(",");
                setCanvasOrderIds(cleanedIds);

                // Update formFields order in state to guarantee Live Preview re-renders in correct order
                const idArray = cleanedIds
                    .split(",")
                    .map(id => id.trim())
                    .filter(Boolean);
                if (idArray.length > 0) {
                    setFormFields(prev => {
                        const fieldMap = new Map(prev.map(f => [f.id, f]));
                        const reordered = idArray.map(id => fieldMap.get(id)).filter(Boolean) as FormField[];
                        const addedIds = new Set(idArray);
                        const remaining = prev.filter(f => !addedIds.has(f.id));
                        return [...reordered, ...remaining];
                    });
                }

                addLog(`💾 [Form Builder] Canvas order updated: "${cleanedIds}"`);
            };
        }

        const sortedAttribute = {
            value: sortedValue,
            readOnly: false,
            setValue: (val: string) => {
                setSortedValue(val);
            }
        };

        const itemColumnAttribute = {
            get: (itemObj: any) => ({
                readOnly: false,
                setValue: (_newStatus: "toolbox" | "canvas") => {
                    if (column === "canvas" && itemObj.status === "toolbox") {
                        const newId = `field-${Date.now()}`;
                        lastClonedIdRef.current = newId;
                        const clonedField: FormField = {
                            id: newId,
                            type: itemObj.type,
                            label: itemObj.label.split(" (")[0] + " Field",
                            placeholder: itemObj.placeholder,
                            required: itemObj.required,
                            options: itemObj.options,
                            status: "canvas",
                            sortId: formFields.length + 1
                        };
                        setFormFields(prev => [...prev, clonedField]);
                        setSelectedFieldId(newId);
                        setIsSubmitted(false);
                        addLog(`➕ [Form Builder] Created field instance "${newId}" from template "${itemObj.type}"`);
                    } else if (column === "toolbox" && itemObj.status === "canvas") {
                        setFormFields(prev => prev.filter(f => f.id !== itemObj.id));
                        if (selectedFieldId === itemObj.id) {
                            setSelectedFieldId(null);
                        }
                        setIsSubmitted(false);
                        addLog(`🗑️ [Form Builder] Deleted field "${itemObj.id}" by dragging back to Toolbox`);
                    }
                }
            })
        };

        const sortIdAttribute = {
            get: (itemObj: any) => {
                const f = formFields.find(x => x.id === itemObj.id);
                const val = f ? f.sortId : 0;
                return {
                    value: {
                        comparedTo: (other: any) => {
                            const otherVal =
                                other && typeof other === "object" && "value" in other ? other.value : other;
                            return val - otherVal;
                        },
                        value: val,
                        toString: () => String(val)
                    }
                };
            }
        };

        const onSortAction = {
            canExecute: true,
            isExecuting: false,
            execute: () => {}
        };

        const customItemContent = {
            get: (itemObj: any) => {
                if (column === "toolbox") {
                    return (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}>
                            <span style={{ fontSize: "18px" }}>
                                {itemObj.type === "text" && "🔤"}
                                {itemObj.type === "number" && "🔢"}
                                {itemObj.type === "dropdown" && "🔽"}
                                {itemObj.type === "datepicker" && "📅"}
                                {itemObj.type === "checkbox" && "☑️"}
                                {itemObj.type === "textarea" && "📝"}
                                {itemObj.type === "button" && "🔘"}
                            </span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "12px", fontWeight: 700, color: "#f1f5f9" }}>
                                    {itemObj.label}
                                </div>
                            </div>
                        </div>
                    );
                } else {
                    const isSelected = selectedFieldId === itemObj.id;
                    return (
                        <div
                            onClick={e => {
                                e.stopPropagation();
                                setSelectedFieldId(itemObj.id);
                            }}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "6px",
                                width: "100%",
                                cursor: "pointer",
                                border: isSelected ? "1.5px solid #8b5cf6" : "1.5px solid rgba(255,255,255,0.06)",
                                borderRadius: "8px",
                                padding: "8px",
                                background: isSelected ? "rgba(139,92,246,0.06)" : "rgba(255,255,255,0.02)",
                                transition: "all 0.15s"
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "12px", fontWeight: 700, color: "#cbd5e1" }}>
                                    {itemObj.label} {itemObj.required && <span style={{ color: "#ef4444" }}>*</span>}
                                </span>
                                <div style={{ display: "flex", gap: "6px" }} onClick={e => e.stopPropagation()}>
                                    <button
                                        onClick={() => setSelectedFieldId(itemObj.id)}
                                        style={{
                                            border: "none",
                                            background: "rgba(255,255,255,0.05)",
                                            color: "#cbd5e1",
                                            borderRadius: "4px",
                                            padding: "2px 6px",
                                            fontSize: "10px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        ⚙️ ตั้งค่า
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFormFields(prev => prev.filter(f => f.id !== itemObj.id));
                                            if (selectedFieldId === itemObj.id) {
                                                setSelectedFieldId(null);
                                            }
                                            setIsSubmitted(false);
                                            addLog(`🗑️ [Form Builder] Removed field "${itemObj.id}"`);
                                        }}
                                        style={{
                                            border: "none",
                                            background: "rgba(239,68,68,0.15)",
                                            color: "#f87171",
                                            borderRadius: "4px",
                                            padding: "2px 6px",
                                            fontSize: "10px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        🗑️ ลบ
                                    </button>
                                </div>
                            </div>

                            <div style={{ pointerEvents: "none", opacity: 0.8 }}>
                                {itemObj.type === "text" && (
                                    <input type="text" placeholder={itemObj.placeholder} style={inputStyle} readOnly />
                                )}
                                {itemObj.type === "number" && (
                                    <input
                                        type="number"
                                        placeholder={itemObj.placeholder}
                                        style={inputStyle}
                                        readOnly
                                    />
                                )}
                                {itemObj.type === "textarea" && (
                                    <textarea
                                        placeholder={itemObj.placeholder}
                                        rows={2}
                                        style={{ ...inputStyle, resize: "none" }}
                                        readOnly
                                    />
                                )}
                                {itemObj.type === "datepicker" && <input type="date" style={inputStyle} readOnly />}
                                {itemObj.type === "dropdown" && (
                                    <select style={inputStyle} disabled>
                                        <option value="">{itemObj.placeholder || "เลือก..."}</option>
                                        {(itemObj.options || "").split(",").map((opt: string) => (
                                            <option key={opt} value={opt.trim()}>
                                                {opt.trim()}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {itemObj.type === "checkbox" && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <input type="checkbox" style={{ width: "16px", height: "16px" }} disabled />
                                        <label style={{ fontSize: "11px", color: "#94a3b8" }}>กดยอมรับเงื่อนไข</label>
                                    </div>
                                )}
                                {itemObj.type === "button" && (
                                    <button
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            borderRadius: "6px",
                                            background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                                            border: "none",
                                            color: "#fff",
                                            fontWeight: 600,
                                            fontSize: "12px"
                                        }}
                                    >
                                        {itemObj.label}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                }
            }
        };

        return {
            name: `form-column-${column}`,
            class: `pwb-form-${column}`,
            itemsSource: itemsSource as any,
            customItemContent: customItemContent as any,
            sortedAttribute: sortedAttribute as any,
            onSortAction: onSortAction as any,
            layoutDirection: "vertical" as const,
            dragHandleDisplay: "left" as const,
            accentColor: "#8b5cf6",
            borderRadius: `${borderRadiusPx}px`,
            enableKanban: true,
            dragGroup: "form-builder-group",
            columnValue: column,
            itemColumnAttribute: itemColumnAttribute as any,
            saveDelay: 0,
            enableHeader: false,
            enableFooter: false,
            enableMainFooter: false,
            enableLaneTitle: false,
            enableOuterFooter: false,
            themePreset,
            darkModeBehavior,
            itemPadding: "8px 12px",
            itemGap: "8px",
            readOnlyMode: false,
            laneClass: `playground-form-${column}`,
            sortIdAttribute: sortIdAttribute as any,
            enableActionsSection: false,
            actionsSectionContent: undefined,
            actionsSectionPositionRow: "left" as any,
            actionsSectionPositionCol: "top" as any,
            actionsSectionLayout: "side_by_side" as any,
            actionsSectionSize: "auto" as any,
            actionsSectionSizeCustom: "200px",
            dragHandleIcon,
            dragHandleSvg,
            dragHandlePosition,
            dragGhostScale: new Big(dragGhostScale),
            dragGhostOpacity: new Big(dragGhostOpacity),
            dragGhostShadow,
            hoverRevealActions,
            animationSpeed,
            wobbleStrength: new Big(wobbleStrength)
        };
    };

    const selectedField = formFields.find(f => f.id === selectedFieldId);

    const handlePreviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors: Record<string, string> = {};
        const activeFields = getSortedCanvasFields();

        activeFields.forEach(f => {
            if (f.type !== "button") {
                const val = liveFormValues[f.id];
                if (f.required && (val === undefined || val === null || val === "" || val === false)) {
                    errors[f.id] = `โปรดป้อนหรือกดยอมรับ ${f.label}`;
                }
            }
        });

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            addLog("⚠️ [Live Form] Validation failed. Missing required fields.");
        } else {
            setFormErrors({});
            setIsSubmitted(true);
            addLog("🎉 [Live Form] Submitted successfully!");
        }
    };

    const handleFormValueChange = (fieldId: string, value: any) => {
        setLiveFormValues(prev => ({
            ...prev,
            [fieldId]: value
        }));
    };

    const schemaObj = {
        formTitle,
        totalFields: formFields.length,
        fields: getSortedCanvasFields().map(f => ({
            id: f.id,
            type: f.type,
            label: f.label,
            placeholder: f.placeholder,
            required: f.required,
            options: f.type === "dropdown" ? f.options?.split(",").map(o => o.trim()) : undefined
        }))
    };
    const schemaStr = JSON.stringify(schemaObj, null, 2);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                width: "100%",
                background: "#0b0f19",
                color: "#f1f5f9",
                fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
            }}
        >
            {/* ── TOP: High-Premium Navigation Bar ─────────────────────── */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 24px",
                    background: "rgba(15, 23, 42, 0.8)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(12px)",
                    position: "sticky",
                    top: 0,
                    zIndex: 20
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "20px" }}>⚡</span>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: "15px", color: "#f1f5f9" }}>
                            Mendix Customize Container DataView
                        </div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>Developer Playground Workspace</div>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        background: "#090d16",
                        borderRadius: "10px",
                        padding: "4px",
                        border: "1px solid rgba(255,255,255,0.06)"
                    }}
                >
                    <button
                        onClick={() => {
                            setPlaygroundMode("kanban");
                            addLog("🔄 Switched to Kanban Simulation Mode");
                        }}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border: "none",
                            background:
                                playgroundMode === "kanban"
                                    ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                                    : "transparent",
                            color: playgroundMode === "kanban" ? "#fff" : "#64748b",
                            fontWeight: 600,
                            fontSize: "13px",
                            cursor: "pointer",
                            transition: "all 0.2s"
                        }}
                    >
                        📋 Kanban Simulation
                    </button>
                    <button
                        onClick={() => {
                            setPlaygroundMode("form_builder");
                            addLog("🔄 Switched to Form Builder Test Mode");
                        }}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border: "none",
                            background:
                                playgroundMode === "form_builder"
                                    ? "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                                    : "transparent",
                            color: playgroundMode === "form_builder" ? "#fff" : "#64748b",
                            fontWeight: 600,
                            fontSize: "13px",
                            cursor: "pointer",
                            transition: "all 0.2s"
                        }}
                    >
                        🛠️ Form Builder Test Mode
                    </button>
                </div>
            </div>

            {/* ── BOTTOM CONTENT AREA ────────────────────────────────── */}
            <div style={{ display: "flex", flex: 1, minHeight: "calc(100vh - 65px)" }}>
                {/* ── LEFT: Properties Control Panel ─────────────────────── */}
                <div
                    style={{
                        width: "320px",
                        background: "rgba(15,23,42,0.95)",
                        borderRight: "1px solid rgba(255,255,255,0.06)",
                        display: "flex",
                        flexDirection: "column",
                        backdropFilter: "blur(12px)",
                        zIndex: 10,
                        maxHeight: "calc(100vh - 65px)",
                        overflowY: "auto"
                    }}
                >
                    {playgroundMode === "kanban" ? (
                        /* Kanban Properties */
                        <div style={{ padding: "16px 20px" }}>
                            <div
                                style={{
                                    marginBottom: "14px",
                                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                                    paddingBottom: "10px"
                                }}
                            >
                                <div style={{ fontSize: "16px", fontWeight: 800, color: "#f1f5f9" }}>
                                    Kanban & Perf Playground
                                </div>
                                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                                    pwbCustomizeContainerDataView v1.1.0
                                </div>
                            </div>
                            <Section title="Read Only Settings">
                                <Toggle
                                    label="Enable Read Only Mode"
                                    value={readOnlyMode}
                                    onChange={v => {
                                        setReadOnlyMode(v);
                                        addLog(
                                            `🎛️ [Read Only Toggle] → ${v ? "Enabled (sorting by SortID)" : "Disabled"}`
                                        );
                                    }}
                                />
                                {readOnlyMode && (
                                    <div
                                        style={{
                                            fontSize: "11px",
                                            color: "#64748b",
                                            marginTop: "4px",
                                            lineHeight: "1.4"
                                        }}
                                    >
                                        🔒 ล็อกไม่ให้ลากวางหรือขยับตำแหน่งการ์ด และจัดเรียงรายการอ้างอิงตามค่า SortID
                                        ของการ์ดแต่ละใบ
                                    </div>
                                )}
                            </Section>

                            <Section title="Performance Settings">
                                <Slider
                                    label="Save Debounce Delay"
                                    value={saveDelay}
                                    min={0}
                                    max={2000}
                                    onChange={setSaveDelay}
                                    unit="ms"
                                />
                                <div
                                    style={{ fontSize: "11px", color: "#475569", marginTop: "4px", lineHeight: "1.4" }}
                                >
                                    ⏰ หน่วงเวลาบันทึกและส่ง Action กลับ Mendix ช่วยลด Database workload
                                </div>
                            </Section>

                            <Section title="Kanban Core Attributes">
                                <Toggle
                                    label="Enable Kanban Support"
                                    value={enableKanban}
                                    onChange={v => {
                                        setEnableKanban(v);
                                        if (!v) {
                                            setLaneCount(1);
                                        } else {
                                            setLaneCount(3);
                                        }
                                        addLog(
                                            `🎛️ [Kanban Toggle] → ${
                                                v ? "Enabled (cross-column)" : "Disabled (single column)"
                                            }`
                                        );
                                    }}
                                />
                                {enableKanban && (
                                    <Slider
                                        label="Simulated Lanes"
                                        value={laneCount}
                                        min={1}
                                        max={4}
                                        onChange={val => {
                                            setLaneCount(val);
                                            addLog(`🎛️ [Lane Count] → Set to ${val} columns`);
                                        }}
                                        unit=" Lanes"
                                    />
                                )}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "6px",
                                        marginTop: "8px",
                                        borderTop: "1px solid rgba(255,255,255,0.04)",
                                        paddingTop: "8px"
                                    }}
                                >
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
                                        <button
                                            key={dir}
                                            onClick={() => setLayoutDirection(dir)}
                                            style={{
                                                flex: 1,
                                                padding: "8px",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                                border: `1.5px solid ${
                                                    layoutDirection === dir ? "#3b82f6" : "#1e293b"
                                                }`,
                                                background:
                                                    layoutDirection === dir ? "rgba(59,130,246,0.15)" : "#0f172a",
                                                color: layoutDirection === dir ? "#3b82f6" : "#64748b",
                                                fontWeight: layoutDirection === dir ? 700 : 400,
                                                fontSize: "13px",
                                                transition: "all 0.2s"
                                            }}
                                        >
                                            {dir === "vertical" ? "⬇ แนวตั้ง" : "➡ แนวนอน"}
                                        </button>
                                    ))}
                                </div>
                            </Section>

                            <Section title="Card Display Style">
                                <div style={{ display: "flex", gap: "8px" }}>
                                    {(
                                        [
                                            { key: "progress", label: "📊 Progress Bar" },
                                            { key: "icon", label: "🎯 Icon Badge" }
                                        ] as const
                                    ).map(s => (
                                        <button
                                            key={s.key}
                                            onClick={() => setCardStyle(s.key)}
                                            style={{
                                                flex: 1,
                                                padding: "8px",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                                border: `1.5px solid ${cardStyle === s.key ? "#a855f7" : "#1e293b"}`,
                                                background: cardStyle === s.key ? "rgba(168,85,247,0.12)" : "#0f172a",
                                                color: cardStyle === s.key ? "#c084fc" : "#64748b",
                                                fontWeight: cardStyle === s.key ? 700 : 400,
                                                fontSize: "12px",
                                                transition: "all 0.2s"
                                            }}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </Section>

                            <Section title="Header & Footer Settings">
                                <Toggle
                                    label="Enable Lane Title"
                                    value={enableLaneTitle}
                                    onChange={v => {
                                        setEnableLaneTitle(v);
                                        addLog(`🎛️ [Lane Title Toggle] → ${v ? "Enabled" : "Disabled"}`);
                                    }}
                                />
                                <Toggle
                                    label="Enable Section Header"
                                    value={enableHeader}
                                    onChange={v => {
                                        setEnableHeader(v);
                                        addLog(`🎛️ [Header Toggle] → ${v ? "Enabled" : "Disabled"}`);
                                    }}
                                />
                                <Toggle
                                    label="Enable Section Footer (Button)"
                                    value={enableFooter}
                                    onChange={v => {
                                        setEnableFooter(v);
                                        addLog(`🎛️ [Footer Toggle] → ${v ? "Enabled" : "Disabled"}`);
                                    }}
                                />
                                <Toggle
                                    label="Enable Main Footer (Summary)"
                                    value={enableMainFooter}
                                    onChange={v => {
                                        setEnableMainFooter(v);
                                        addLog(`🎛️ [Main Footer Toggle] → ${v ? "Enabled" : "Disabled"}`);
                                    }}
                                />
                                <Toggle
                                    label="Enable Outer Footer"
                                    value={enableOuterFooter}
                                    onChange={v => {
                                        setEnableOuterFooter(v);
                                        addLog(`🎛️ [Outer Footer Toggle] → ${v ? "Enabled" : "Disabled"}`);
                                    }}
                                />
                            </Section>

                            <Section title="Theme & Dark Mode">
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <span style={{ fontSize: "13px", color: "#94a3b8" }}>Theme Preset</span>
                                    <select
                                        value={themePreset}
                                        onChange={e => setThemePreset(e.target.value as any)}
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            borderRadius: "8px",
                                            background: "#0f172a",
                                            border: "1.5px solid #1e293b",
                                            color: "#f1f5f9",
                                            fontSize: "13px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <option value="default_rounded">Default Rounded</option>
                                        <option value="modern_glass">Glassmorphism</option>
                                        <option value="minimalist_flat">Minimalist Flat</option>
                                        <option value="neo_brutalist">Neo-Brutalist</option>
                                    </select>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                                    <span style={{ fontSize: "13px", color: "#94a3b8" }}>Dark Mode Behavior</span>
                                    <div style={{ display: "flex", gap: "6px" }}>
                                        {(["auto", "light", "dark"] as const).map(mode => (
                                            <button
                                                key={mode}
                                                onClick={() => setDarkModeBehavior(mode)}
                                                style={{
                                                    flex: 1,
                                                    padding: "6px",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                    border: `1.5px solid ${
                                                        darkModeBehavior === mode ? "#3b82f6" : "#1e293b"
                                                    }`,
                                                    background:
                                                        darkModeBehavior === mode ? "rgba(59,130,246,0.15)" : "#0f172a",
                                                    color: darkModeBehavior === mode ? "#3b82f6" : "#64748b",
                                                    fontSize: "12px",
                                                    transition: "all 0.2s"
                                                }}
                                            >
                                                {mode.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </Section>

                            <Section title="Item Spacing">
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <span style={{ fontSize: "13px", color: "#94a3b8" }}>Item Padding</span>
                                    <select
                                        value={itemPadding}
                                        onChange={e => setItemPadding(e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            borderRadius: "8px",
                                            background: "#0f172a",
                                            border: "1.5px solid #1e293b",
                                            color: "#f1f5f9",
                                            fontSize: "13px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <option value="">Default (12px 16px)</option>
                                        <option value="6px 10px">Compact (6px 10px)</option>
                                        <option value="16px 20px">Coarse (16px 20px)</option>
                                        <option value="24px">Spacious (24px)</option>
                                    </select>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                                    <span style={{ fontSize: "13px", color: "#94a3b8" }}>Item Gap</span>
                                    <select
                                        value={itemGap}
                                        onChange={e => setItemGap(e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            borderRadius: "8px",
                                            background: "#0f172a",
                                            border: "1.5px solid #1e293b",
                                            color: "#f1f5f9",
                                            fontSize: "13px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <option value="">Default (12px)</option>
                                        <option value="6px">Tight (6px)</option>
                                        <option value="16px">Spacious (16px)</option>
                                        <option value="24px">Extra Large (24px)</option>
                                    </select>
                                </div>
                            </Section>

                            <Section title="Actions Section Settings">
                                <Toggle
                                    label="Enable Actions Section"
                                    value={enableActionsSection}
                                    onChange={setEnableActionsSection}
                                />
                                {enableActionsSection && (
                                    <>
                                        {actionsSectionLayout === "side_by_side" ? (
                                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                                <span style={{ fontSize: "13px", color: "#94a3b8" }}>Position (Horizontal)</span>
                                                <select
                                                    value={actionsSectionPositionRow}
                                                    onChange={e => setActionsSectionPositionRow(e.target.value as any)}
                                                    style={{
                                                        width: "100%",
                                                        padding: "8px",
                                                        borderRadius: "8px",
                                                        background: "#0f172a",
                                                        border: "1.5px solid #1e293b",
                                                        color: "#f1f5f9",
                                                        fontSize: "13px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    <option value="left">Left</option>
                                                    <option value="right">Right</option>
                                                </select>
                                            </div>
                                        ) : (
                                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                                <span style={{ fontSize: "13px", color: "#94a3b8" }}>Position (Vertical)</span>
                                                <select
                                                    value={actionsSectionPositionCol}
                                                    onChange={e => setActionsSectionPositionCol(e.target.value as any)}
                                                    style={{
                                                        width: "100%",
                                                        padding: "8px",
                                                        borderRadius: "8px",
                                                        background: "#0f172a",
                                                        border: "1.5px solid #1e293b",
                                                        color: "#f1f5f9",
                                                        fontSize: "13px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    <option value="top">Top</option>
                                                    <option value="bottom">Bottom</option>
                                                </select>
                                            </div>
                                        )}
                                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                                            <span style={{ fontSize: "13px", color: "#94a3b8" }}>Layout Style</span>
                                            <select
                                                value={actionsSectionLayout}
                                                onChange={e => setActionsSectionLayout(e.target.value as any)}
                                                style={{
                                                    width: "100%",
                                                    padding: "8px",
                                                    borderRadius: "8px",
                                                    background: "#0f172a",
                                                    border: "1.5px solid #1e293b",
                                                    color: "#f1f5f9",
                                                    fontSize: "13px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <option value="side_by_side">Side-by-Side (Row)</option>
                                                <option value="stacked">Stacked (Column)</option>
                                            </select>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                                            <span style={{ fontSize: "13px", color: "#94a3b8" }}>Section Size Ratio</span>
                                            <select
                                                value={actionsSectionSize}
                                                onChange={e => setActionsSectionSize(e.target.value as any)}
                                                style={{
                                                    width: "100%",
                                                    padding: "8px",
                                                    borderRadius: "8px",
                                                    background: "#0f172a",
                                                    border: "1.5px solid #1e293b",
                                                    color: "#f1f5f9",
                                                    fontSize: "13px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <option value="auto">Auto (Fit Content)</option>
                                                <option value="ratio_15">15% Width/Height</option>
                                                <option value="ratio_20">20% Width/Height</option>
                                                <option value="ratio_25">25% Width/Height</option>
                                                <option value="ratio_30">30% Width/Height</option>
                                                <option value="ratio_40">40% Width/Height</option>
                                                <option value="custom">Custom Size</option>
                                            </select>
                                        </div>
                                        {actionsSectionSize === "custom" && (
                                            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                                                <span style={{ fontSize: "13px", color: "#94a3b8" }}>Custom Size Value</span>
                                                <input
                                                    type="text"
                                                    value={actionsSectionSizeCustom}
                                                    onChange={e => setActionsSectionSizeCustom(e.target.value)}
                                                    style={{
                                                        width: "100%",
                                                        padding: "8px 12px",
                                                        borderRadius: "8px",
                                                        border: "1.5px solid #1e293b",
                                                        background: "#0f172a",
                                                        color: "#f1f5f9",
                                                        fontSize: "13px",
                                                        boxSizing: "border-box",
                                                        outline: "none"
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </Section>

                            <Section title="Aesthetics">
                                <ColorPicker
                                    label="Accent Color"
                                    value={accentColor}
                                    onChange={setAccentColor}
                                    presets={[
                                        "#3b82f6",
                                        "#8b5cf6",
                                        "#ec4899",
                                        "#10b981",
                                        "#f59e0b",
                                        "#ef4444",
                                        "#06b6d4"
                                    ]}
                                />
                                <Slider
                                    label="Border Radius"
                                    value={borderRadiusPx}
                                    min={0}
                                    max={24}
                                    onChange={setBorderRadiusPx}
                                    unit="px"
                                />
                                <Toggle
                                    label="Show Drag Handles (⠿)"
                                    value={dragHandleDisplay === "left"}
                                    onChange={v => setDragHandleDisplay(v ? "left" : "hide")}
                                />
                                {dragHandleDisplay === "left" && (
                                    <>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                            <span style={{ fontSize: "13px", color: "#94a3b8" }}>Drag Handle Position</span>
                                            <select
                                                value={dragHandlePosition}
                                                onChange={e => setDragHandlePosition(e.target.value as any)}
                                                style={{
                                                    width: "100%",
                                                    padding: "8px",
                                                    borderRadius: "8px",
                                                    background: "#0f172a",
                                                    border: "1.5px solid #1e293b",
                                                    color: "#f1f5f9",
                                                    fontSize: "13px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <option value="left">Left</option>
                                                <option value="right">Right</option>
                                            </select>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                            <span style={{ fontSize: "13px", color: "#94a3b8" }}>Drag Handle Icon</span>
                                            <select
                                                value={dragHandleIcon}
                                                onChange={e => setDragHandleIcon(e.target.value as any)}
                                                style={{
                                                    width: "100%",
                                                    padding: "8px",
                                                    borderRadius: "8px",
                                                    background: "#0f172a",
                                                    border: "1.5px solid #1e293b",
                                                    color: "#f1f5f9",
                                                    fontSize: "13px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <option value="dots">Dots (6-dots)</option>
                                                <option value="bars">Bars (3-bars)</option>
                                                <option value="hand">Hand</option>
                                                <option value="crosshair">Crosshair</option>
                                                <option value="custom_svg">Custom SVG</option>
                                            </select>
                                        </div>
                                        {dragHandleIcon === "custom_svg" && (
                                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                                <span style={{ fontSize: "13px", color: "#94a3b8" }}>Custom Handle SVG</span>
                                                <textarea
                                                    value={dragHandleSvg}
                                                    onChange={e => setDragHandleSvg(e.target.value)}
                                                    placeholder="Paste SVG XML content here..."
                                                    rows={3}
                                                    style={{
                                                        width: "100%",
                                                        padding: "8px 12px",
                                                        borderRadius: "8px",
                                                        border: "1.5px solid #1e293b",
                                                        background: "#0f172a",
                                                        color: "#f1f5f9",
                                                        fontSize: "12px",
                                                        boxSizing: "border-box",
                                                        outline: "none",
                                                        fontFamily: "monospace"
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                                <Slider
                                    label="Ghost Scale"
                                    value={Math.round(dragGhostScale * 100)}
                                    min={50}
                                    max={150}
                                    onChange={v => setDragGhostScale(v / 100)}
                                    unit="%"
                                />
                                <Slider
                                    label="Ghost Opacity"
                                    value={Math.round(dragGhostOpacity * 100)}
                                    min={10}
                                    max={100}
                                    onChange={v => setDragGhostOpacity(v / 100)}
                                    unit="%"
                                />
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <span style={{ fontSize: "13px", color: "#94a3b8" }}>Ghost Shadow (CSS)</span>
                                    <input
                                        type="text"
                                        value={dragGhostShadow}
                                        onChange={e => setDragGhostShadow(e.target.value)}
                                        placeholder="e.g. 0 10px 30px rgba(0,0,0,0.5)"
                                        style={{
                                            width: "100%",
                                            padding: "8px 12px",
                                            borderRadius: "8px",
                                            border: "1.5px solid #1e293b",
                                            background: "#0f172a",
                                            color: "#f1f5f9",
                                            fontSize: "13px",
                                            boxSizing: "border-box",
                                            outline: "none"
                                        }}
                                    />
                                </div>
                                {enableActionsSection && (
                                    <Toggle
                                        label="Hover Reveal Actions"
                                        value={hoverRevealActions}
                                        onChange={setHoverRevealActions}
                                    />
                                )}
                                <Slider
                                    label="Animation Speed"
                                    value={animationSpeed}
                                    min={50}
                                    max={1000}
                                    onChange={setAnimationSpeed}
                                    unit="ms"
                                />
                                <Slider
                                    label="Wobble Strength"
                                    value={Math.round(wobbleStrength * 100)}
                                    min={0}
                                    max={300}
                                    onChange={v => setWobbleStrength(v / 100)}
                                    unit="%"
                                />
                            </Section>

                            <button
                                onClick={handleReset}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginTop: "8px",
                                    background: "rgba(239,68,68,0.1)",
                                    border: "1px solid rgba(239,68,68,0.25)",
                                    borderRadius: "10px",
                                    color: "#f87171",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.18)")}
                                onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
                            >
                                🔄 รีเซ็ตกระดาน & ฐานข้อมูล
                            </button>
                        </div>
                    ) : (
                        /* Form Builder Properties */
                        <div style={{ padding: "16px 20px" }}>
                            <div
                                style={{
                                    marginBottom: "14px",
                                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                                    paddingBottom: "10px"
                                }}
                            >
                                <div style={{ fontSize: "16px", fontWeight: 800, color: "#f1f5f9" }}>
                                    Form Builder Core
                                </div>
                                <div style={{ fontSize: "12px", color: "#8b5cf6", marginTop: "2px" }}>
                                    Drag field template into canvas to instantiate.
                                </div>
                            </div>

                            <Section title="Preload Templates">
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <button
                                        onClick={loadContactTemplate}
                                        style={{
                                            padding: "8px 12px",
                                            borderRadius: "8px",
                                            border: "1px solid rgba(139,92,246,0.25)",
                                            background: "rgba(139,92,246,0.1)",
                                            color: "#c084fc",
                                            fontSize: "12px",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            textAlign: "left"
                                        }}
                                    >
                                        📞 โหลดแบบฟอร์มติดต่อ (Contact Form)
                                    </button>
                                    <button
                                        onClick={loadRegisterTemplate}
                                        style={{
                                            padding: "8px 12px",
                                            borderRadius: "8px",
                                            border: "1px solid rgba(139,92,246,0.25)",
                                            background: "rgba(139,92,246,0.1)",
                                            color: "#c084fc",
                                            fontSize: "12px",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            textAlign: "left"
                                        }}
                                    >
                                        🎟️ โหลดแบบฟอร์มลงทะเบียน (Registration Form)
                                    </button>
                                </div>
                            </Section>

                            <Section title="Form Options">
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <div>
                                        <span
                                            style={{
                                                fontSize: "12px",
                                                color: "#94a3b8",
                                                display: "block",
                                                marginBottom: "4px"
                                            }}
                                        >
                                            หัวข้อแบบฟอร์ม (Form Title)
                                        </span>
                                        <input
                                            type="text"
                                            value={formTitle}
                                            onChange={e => setFormTitle(e.target.value)}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <button
                                        onClick={handleClearFormCanvas}
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            borderRadius: "8px",
                                            border: "1px solid rgba(239,68,68,0.25)",
                                            background: "rgba(239,68,68,0.1)",
                                            color: "#f87171",
                                            fontSize: "12px",
                                            fontWeight: 600,
                                            cursor: "pointer"
                                        }}
                                    >
                                        🧹 เคลียร์หน้ากระดาษ (Clear Canvas)
                                    </button>
                                </div>
                            </Section>

                            {selectedField ? (
                                <Section title="Field Properties">
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        <div>
                                            <span
                                                style={{
                                                    fontSize: "11px",
                                                    color: "#64748b",
                                                    display: "block",
                                                    marginBottom: "2px"
                                                }}
                                            >
                                                ID
                                            </span>
                                            <input
                                                type="text"
                                                value={selectedField.id}
                                                disabled
                                                style={{ ...inputStyle, opacity: 0.6, fontSize: "11px" }}
                                            />
                                        </div>
                                        <div>
                                            <span
                                                style={{
                                                    fontSize: "11px",
                                                    color: "#64748b",
                                                    display: "block",
                                                    marginBottom: "2px"
                                                }}
                                            >
                                                ประเภทช่อง (Type)
                                            </span>
                                            <input
                                                type="text"
                                                value={selectedField.type.toUpperCase()}
                                                disabled
                                                style={{ ...inputStyle, opacity: 0.6, fontSize: "11px" }}
                                            />
                                        </div>
                                        <div>
                                            <span
                                                style={{
                                                    fontSize: "11px",
                                                    color: "#94a3b8",
                                                    display: "block",
                                                    marginBottom: "4px"
                                                }}
                                            >
                                                ป้ายกำกับ (Label)
                                            </span>
                                            <input
                                                type="text"
                                                value={selectedField.label}
                                                onChange={e => updateSelectedField({ label: e.target.value })}
                                                style={inputStyle}
                                            />
                                        </div>
                                        {selectedField.type !== "checkbox" && selectedField.type !== "button" && (
                                            <div>
                                                <span
                                                    style={{
                                                        fontSize: "11px",
                                                        color: "#94a3b8",
                                                        display: "block",
                                                        marginBottom: "4px"
                                                    }}
                                                >
                                                    คำอธิบายเสริม (Placeholder)
                                                </span>
                                                <input
                                                    type="text"
                                                    value={selectedField.placeholder}
                                                    onChange={e => updateSelectedField({ placeholder: e.target.value })}
                                                    style={inputStyle}
                                                />
                                            </div>
                                        )}
                                        {selectedField.type === "dropdown" && (
                                            <div>
                                                <span
                                                    style={{
                                                        fontSize: "11px",
                                                        color: "#94a3b8",
                                                        display: "block",
                                                        marginBottom: "4px"
                                                    }}
                                                >
                                                    ตัวเลือก (แยกด้วยเครื่องหมายลูกน้ำ ,)
                                                </span>
                                                <textarea
                                                    value={selectedField.options || ""}
                                                    onChange={e => updateSelectedField({ options: e.target.value })}
                                                    rows={3}
                                                    style={{ ...inputStyle, fontSize: "11px", fontFamily: "monospace" }}
                                                />
                                            </div>
                                        )}
                                        {selectedField.type !== "button" && (
                                            <Toggle
                                                label="จำเป็นต้องกรอก (Required)"
                                                value={selectedField.required}
                                                onChange={v => updateSelectedField({ required: v })}
                                            />
                                        )}
                                    </div>
                                </Section>
                            ) : (
                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "16px",
                                        color: "#475569",
                                        fontSize: "12px",
                                        border: "1px dashed rgba(255,255,255,0.06)",
                                        borderRadius: "8px"
                                    }}
                                >
                                    💡 คลิกที่ช่องฟิลด์ในการ์ดสีม่วงเพื่อตั้งค่ารายละเอียดฟิลด์ได้ที่นี่
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── RIGHT: Live Canvas ─────────────────────────────────── */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        padding: "24px 32px",
                        overflowY: "auto",
                        maxHeight: "calc(100vh - 65px)",
                        boxSizing: "border-box"
                    }}
                >
                    {playgroundMode === "kanban" ? (
                        /* KANBAN LAYOUT */
                        <>
                            {/* Header */}
                            <div style={{ marginBottom: "20px" }}>
                                <div
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        background: "rgba(16,185,129,0.1)",
                                        border: "1px solid rgba(16,185,129,0.25)",
                                        borderRadius: "8px",
                                        padding: "6px 12px",
                                        marginBottom: "10px"
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "8px",
                                            height: "8px",
                                            borderRadius: "50%",
                                            background: "#10b981",
                                            boxShadow: "0 0 6px #10b981",
                                            animation: "pulse 2s infinite"
                                        }}
                                    />
                                    <span style={{ color: "#a7f3d0", fontSize: "12px", fontWeight: 600 }}>
                                        Playground Mode - 3 Columns Kanban Board Simulation
                                    </span>
                                </div>
                                <h1 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 800 }}>
                                    PWB Customize Container DataView (Kanban Engine)
                                </h1>
                                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                                    ทดลองลากการ์ดสลับระหว่าง **คอลัมน์แนวตั้ง** หรือ **กล่องแนวนอน**
                                    และสังเกตการหน่วงเวลาบันทึก (Debounce Delay) เพื่อยืนยันความไหลลื่นและประสิทธิภาพ
                                </p>
                            </div>

                            {/* DYNAMIC KANBAN BOARD CONTAINER */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "20px",
                                    flex: 1,
                                    minHeight: "450px",
                                    marginBottom: "20px"
                                }}
                            >
                                {/* Column 1: TODO */}
                                {laneCount >= 1 && (
                                    <div
                                        style={{
                                            flex: 1,
                                            background: "rgba(255,255,255,0.02)",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "16px",
                                            padding: "16px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "12px"
                                        }}
                                    >
                                        {!enableLaneTitle && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <h3
                                                    style={{
                                                        fontSize: "14px",
                                                        fontWeight: 700,
                                                        color: "#94a3b8",
                                                        margin: 0
                                                    }}
                                                >
                                                    🔴 TO DO
                                                </h3>
                                                <span
                                                    style={{
                                                        fontSize: "11px",
                                                        fontWeight: 700,
                                                        padding: "2px 8px",
                                                        borderRadius: "10px",
                                                        background: "rgba(239,68,68,0.15)",
                                                        color: "#f87171"
                                                    }}
                                                >
                                                    {tasks.filter(t => t.status === "todo").length}
                                                </span>
                                            </div>
                                        )}
                                        <div style={{ flex: 1, overflowY: "auto" }}>
                                            <PwbCustomizeContainerDataView {...getColumnProps("todo")} />
                                        </div>
                                    </div>
                                )}

                                {/* Column 2: IN PROGRESS */}
                                {laneCount >= 2 && (
                                    <div
                                        style={{
                                            flex: 1,
                                            background: "rgba(255,255,255,0.02)",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "16px",
                                            padding: "16px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "12px"
                                        }}
                                    >
                                        {!enableLaneTitle && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <h3
                                                    style={{
                                                        fontSize: "14px",
                                                        fontWeight: 700,
                                                        color: "#94a3b8",
                                                        margin: 0
                                                    }}
                                                >
                                                    🟡 IN PROGRESS
                                                </h3>
                                                <span
                                                    style={{
                                                        fontSize: "11px",
                                                        fontWeight: 700,
                                                        padding: "2px 8px",
                                                        borderRadius: "10px",
                                                        background: "rgba(245,158,11,0.15)",
                                                        color: "#fbbf24"
                                                    }}
                                                >
                                                    {tasks.filter(t => t.status === "in_progress").length}
                                                </span>
                                            </div>
                                        )}
                                        <div style={{ flex: 1, overflowY: "auto" }}>
                                            <PwbCustomizeContainerDataView {...getColumnProps("in_progress")} />
                                        </div>
                                    </div>
                                )}

                                {/* Column 3: DONE */}
                                {laneCount >= 3 && (
                                    <div
                                        style={{
                                            flex: 1,
                                            background: "rgba(255,255,255,0.02)",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "16px",
                                            padding: "16px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "12px"
                                        }}
                                    >
                                        {!enableLaneTitle && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <h3
                                                    style={{
                                                        fontSize: "14px",
                                                        fontWeight: 700,
                                                        color: "#94a3b8",
                                                        margin: 0
                                                    }}
                                                >
                                                    🟢 DONE
                                                </h3>
                                                <span
                                                    style={{
                                                        fontSize: "11px",
                                                        fontWeight: 700,
                                                        padding: "2px 8px",
                                                        borderRadius: "10px",
                                                        background: "rgba(34,197,94,0.15)",
                                                        color: "#34d399"
                                                    }}
                                                >
                                                    {tasks.filter(t => t.status === "done").length}
                                                </span>
                                            </div>
                                        )}
                                        <div style={{ flex: 1, overflowY: "auto" }}>
                                            <PwbCustomizeContainerDataView {...getColumnProps("done")} />
                                        </div>
                                    </div>
                                )}

                                {/* Column 4: ARCHIVED */}
                                {laneCount >= 4 && (
                                    <div
                                        style={{
                                            flex: 1,
                                            background: "rgba(255,255,255,0.02)",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                            borderRadius: "16px",
                                            padding: "16px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "12px"
                                        }}
                                    >
                                        {!enableLaneTitle && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <h3
                                                    style={{
                                                        fontSize: "14px",
                                                        fontWeight: 700,
                                                        color: "#94a3b8",
                                                        margin: 0
                                                    }}
                                                >
                                                    🟣 ARCHIVED
                                                </h3>
                                                <span
                                                    style={{
                                                        fontSize: "11px",
                                                        fontWeight: 700,
                                                        padding: "2px 8px",
                                                        borderRadius: "10px",
                                                        background: "rgba(168,85,247,0.15)",
                                                        color: "#c084fc"
                                                    }}
                                                >
                                                    {tasks.filter(t => t.status === "archived").length}
                                                </span>
                                            </div>
                                        )}
                                        <div style={{ flex: 1, overflowY: "auto" }}>
                                            <PwbCustomizeContainerDataView {...getColumnProps("archived")} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        /* FORM BUILDER WORKSPACE */
                        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "20px" }}>
                            {/* Info Banner */}
                            <div>
                                <div
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        background: "rgba(139,92,246,0.15)",
                                        border: "1px solid rgba(139,92,246,0.3)",
                                        borderRadius: "8px",
                                        padding: "6px 12px",
                                        marginBottom: "10px"
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "8px",
                                            height: "8px",
                                            borderRadius: "50%",
                                            background: "#a78bfa",
                                            boxShadow: "0 0 6px #a78bfa",
                                            animation: "pulse 2s infinite"
                                        }}
                                    />
                                    <span style={{ color: "#ddd6fe", fontSize: "12px", fontWeight: 600 }}>
                                        Playground Mode - Drag-and-drop Form Builder Simulation
                                    </span>
                                </div>
                                <h1
                                    style={{
                                        margin: "0 0 4px",
                                        fontSize: "22px",
                                        fontWeight: 800,
                                        background: "linear-gradient(90deg, #a78bfa, #818cf8)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent"
                                    }}
                                >
                                    Drag-and-Drop Form Builder
                                </h1>
                                <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                                    ทดลองลากเทมเพลตฟิลด์จากฝั่งซ้ายมือ (Toolbox) ไปวางลงบนพื้นที่ออกแบบฟอร์ม (Form
                                    Canvas) แล้วจัดเรียง หรือลบได้ตามใจชอบ
                                </p>
                            </div>

                            {/* Split Columns Grid */}
                            <div style={{ display: "flex", gap: "20px", flex: 1, minHeight: "500px" }}>
                                {/* 1. Toolbox Column */}
                                <div
                                    style={{
                                        width: "240px",
                                        background: "rgba(255,255,255,0.01)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        borderRadius: "16px",
                                        padding: "16px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "12px"
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontSize: "13px",
                                            fontWeight: 700,
                                            color: "#94a3b8",
                                            margin: 0,
                                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                                            paddingBottom: "8px"
                                        }}
                                    >
                                        📥 เทมเพลตฟิลด์ (Toolbox)
                                    </h3>
                                    <div style={{ flex: 1, overflowY: "auto" }}>
                                        <PwbCustomizeContainerDataView {...getFormColumnProps("toolbox")} />
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "10px",
                                            color: "#64748b",
                                            textAlign: "center",
                                            lineHeight: "1.4"
                                        }}
                                    >
                                        💡 ลากจากกล่องนี้ไป Canvas เพื่อสร้างฟิลด์ใหม่
                                    </div>
                                </div>

                                {/* 2. Active Canvas Column */}
                                <div
                                    style={{
                                        flex: 1.2,
                                        background: "rgba(139,92,246,0.02)",
                                        border: "1px dashed rgba(139,92,246,0.15)",
                                        borderRadius: "16px",
                                        padding: "16px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "12px"
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            borderBottom: "1px dashed rgba(139,92,246,0.15)",
                                            paddingBottom: "8px"
                                        }}
                                    >
                                        <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#a78bfa", margin: 0 }}>
                                            📝 พื้นที่ออกแบบฟอร์ม (Form Canvas)
                                        </h3>
                                        <span
                                            style={{
                                                fontSize: "11px",
                                                fontWeight: 700,
                                                padding: "2px 8px",
                                                borderRadius: "10px",
                                                background: "rgba(139,92,246,0.15)",
                                                color: "#c084fc"
                                            }}
                                        >
                                            {formFields.length} ฟิลด์
                                        </span>
                                    </div>

                                    <div style={{ flex: 1, overflowY: "auto" }}>
                                        <PwbCustomizeContainerDataView {...getFormColumnProps("canvas")} />
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "10px",
                                            color: "#8b5cf6",
                                            textAlign: "center",
                                            lineHeight: "1.4"
                                        }}
                                    >
                                        💡 ลากย้อนกลับไปด้านซ้ายเพื่อลบออกจาก Canvas
                                    </div>
                                </div>

                                {/* 3. Preview/Schema Column */}
                                <div
                                    style={{
                                        flex: 1.2,
                                        background: "rgba(15,23,42,0.4)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        borderRadius: "16px",
                                        padding: "16px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "12px"
                                    }}
                                >
                                    {/* Tabs */}
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "4px",
                                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                                            paddingBottom: "8px"
                                        }}
                                    >
                                        <button
                                            onClick={() => setFormBuilderTab("preview")}
                                            style={{
                                                padding: "6px 12px",
                                                borderRadius: "6px",
                                                border: "none",
                                                background:
                                                    formBuilderTab === "preview"
                                                        ? "rgba(255,255,255,0.08)"
                                                        : "transparent",
                                                color: formBuilderTab === "preview" ? "#f1f5f9" : "#64748b",
                                                fontWeight: 600,
                                                fontSize: "12px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            👁️ แสดงผลจริง (Live Preview)
                                        </button>
                                        <button
                                            onClick={() => setFormBuilderTab("schema")}
                                            style={{
                                                padding: "6px 12px",
                                                borderRadius: "6px",
                                                border: "none",
                                                background:
                                                    formBuilderTab === "schema"
                                                        ? "rgba(255,255,255,0.08)"
                                                        : "transparent",
                                                color: formBuilderTab === "schema" ? "#f1f5f9" : "#64748b",
                                                fontWeight: 600,
                                                fontSize: "12px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            💻 ข้อมูลโมเดล (JSON Schema)
                                        </button>
                                    </div>

                                    <div style={{ flex: 1, overflowY: "auto" }}>
                                        {formBuilderTab === "preview" ? (
                                            /* Live Form Preview */
                                            isSubmitted ? (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        height: "100%",
                                                        padding: "20px",
                                                        textAlign: "center",
                                                        animation: "pulse 1.5s infinite"
                                                    }}
                                                >
                                                    <span style={{ fontSize: "40px" }}>🎉</span>
                                                    <h3
                                                        style={{
                                                            fontSize: "16px",
                                                            fontWeight: 700,
                                                            color: "#10b981",
                                                            margin: "10px 0 6px"
                                                        }}
                                                    >
                                                        ส่งข้อมูลสำเร็จ! (Submit Success)
                                                    </h3>
                                                    <p
                                                        style={{
                                                            fontSize: "12px",
                                                            color: "#94a3b8",
                                                            margin: "0 0 16px"
                                                        }}
                                                    >
                                                        นี่คือข้อมูลที่ท่านกรอกส่งจำลองกลับระบบ
                                                    </p>
                                                    <div
                                                        style={{
                                                            width: "100%",
                                                            background: "#090d16",
                                                            borderRadius: "10px",
                                                            padding: "12px",
                                                            textAlign: "left",
                                                            fontSize: "11px",
                                                            border: "1px solid rgba(255,255,255,0.06)",
                                                            boxSizing: "border-box"
                                                        }}
                                                    >
                                                        {getSortedCanvasFields()
                                                            .filter(f => f.type !== "button")
                                                            .map(f => (
                                                                <div
                                                                    key={f.id}
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "space-between",
                                                                        padding: "4px 0",
                                                                        borderBottom: "1px solid rgba(255,255,255,0.03)"
                                                                    }}
                                                                >
                                                                    <span style={{ color: "#64748b" }}>{f.label}:</span>
                                                                    <span style={{ color: "#10b981", fontWeight: 600 }}>
                                                                        {String(liveFormValues[f.id] ?? "—")}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setIsSubmitted(false);
                                                            setLiveFormValues({});
                                                        }}
                                                        style={{
                                                            marginTop: "16px",
                                                            padding: "8px 16px",
                                                            borderRadius: "8px",
                                                            border: "none",
                                                            background: "rgba(255,255,255,0.05)",
                                                            color: "#f1f5f9",
                                                            fontSize: "12px",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        กรอกฟอร์มใหม่อีกครั้ง
                                                    </button>
                                                </div>
                                            ) : (
                                                <form
                                                    onSubmit={handlePreviewSubmit}
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "14px",
                                                        padding: "4px"
                                                    }}
                                                >
                                                    <h3
                                                        style={{
                                                            fontSize: "15px",
                                                            fontWeight: 700,
                                                            margin: "0 0 4px",
                                                            color: "#f1f5f9",
                                                            textAlign: "center"
                                                        }}
                                                    >
                                                        {formTitle || "ไม่ได้ระบุหัวข้อ"}
                                                    </h3>

                                                    {getSortedCanvasFields().length === 0 ? (
                                                        <div
                                                            style={{
                                                                textAlign: "center",
                                                                padding: "40px 10px",
                                                                color: "#475569",
                                                                fontSize: "12px",
                                                                border: "1px dashed rgba(255,255,255,0.06)",
                                                                borderRadius: "8px"
                                                            }}
                                                        >
                                                            ฟอร์มว่างเปล่า ลากฟิลด์มาใส่เพื่อจำลองใช้งานจริง
                                                        </div>
                                                    ) : (
                                                        getSortedCanvasFields().map(f => (
                                                            <div
                                                                key={f.id}
                                                                style={{
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    gap: "4px"
                                                                }}
                                                            >
                                                                {f.type !== "button" && f.type !== "checkbox" && (
                                                                    <label
                                                                        style={{
                                                                            fontSize: "12px",
                                                                            fontWeight: 600,
                                                                            color: "#cbd5e1"
                                                                        }}
                                                                    >
                                                                        {f.label}{" "}
                                                                        {f.required && (
                                                                            <span style={{ color: "#ef4444" }}>*</span>
                                                                        )}
                                                                    </label>
                                                                )}

                                                                {f.type === "text" && (
                                                                    <input
                                                                        type="text"
                                                                        placeholder={f.placeholder}
                                                                        value={liveFormValues[f.id] || ""}
                                                                        onChange={e =>
                                                                            handleFormValueChange(f.id, e.target.value)
                                                                        }
                                                                        style={{
                                                                            ...inputStyle,
                                                                            borderColor: formErrors[f.id]
                                                                                ? "#ef4444"
                                                                                : "rgba(255, 255, 255, 0.12)"
                                                                        }}
                                                                    />
                                                                )}
                                                                {f.type === "number" && (
                                                                    <input
                                                                        type="number"
                                                                        placeholder={f.placeholder}
                                                                        value={liveFormValues[f.id] || ""}
                                                                        onChange={e =>
                                                                            handleFormValueChange(f.id, e.target.value)
                                                                        }
                                                                        style={{
                                                                            ...inputStyle,
                                                                            borderColor: formErrors[f.id]
                                                                                ? "#ef4444"
                                                                                : "rgba(255, 255, 255, 0.12)"
                                                                        }}
                                                                    />
                                                                )}
                                                                {f.type === "textarea" && (
                                                                    <textarea
                                                                        placeholder={f.placeholder}
                                                                        rows={3}
                                                                        value={liveFormValues[f.id] || ""}
                                                                        onChange={e =>
                                                                            handleFormValueChange(f.id, e.target.value)
                                                                        }
                                                                        style={{
                                                                            ...inputStyle,
                                                                            borderColor: formErrors[f.id]
                                                                                ? "#ef4444"
                                                                                : "rgba(255, 255, 255, 0.12)",
                                                                            resize: "vertical"
                                                                        }}
                                                                    />
                                                                )}
                                                                {f.type === "datepicker" && (
                                                                    <input
                                                                        type="date"
                                                                        value={liveFormValues[f.id] || ""}
                                                                        onChange={e =>
                                                                            handleFormValueChange(f.id, e.target.value)
                                                                        }
                                                                        style={{
                                                                            ...inputStyle,
                                                                            borderColor: formErrors[f.id]
                                                                                ? "#ef4444"
                                                                                : "rgba(255, 255, 255, 0.12)"
                                                                        }}
                                                                    />
                                                                )}
                                                                {f.type === "dropdown" && (
                                                                    <select
                                                                        value={liveFormValues[f.id] || ""}
                                                                        onChange={e =>
                                                                            handleFormValueChange(f.id, e.target.value)
                                                                        }
                                                                        style={{
                                                                            ...inputStyle,
                                                                            borderColor: formErrors[f.id]
                                                                                ? "#ef4444"
                                                                                : "rgba(255, 255, 255, 0.12)"
                                                                        }}
                                                                    >
                                                                        <option value="">
                                                                            {f.placeholder || "เลือก..."}
                                                                        </option>
                                                                        {(f.options || "")
                                                                            .split(",")
                                                                            .map((opt: string) => (
                                                                                <option key={opt} value={opt.trim()}>
                                                                                    {opt.trim()}
                                                                                </option>
                                                                            ))}
                                                                    </select>
                                                                )}
                                                                {f.type === "checkbox" && (
                                                                    <div
                                                                        style={{
                                                                            display: "flex",
                                                                            alignItems: "flex-start",
                                                                            gap: "8px",
                                                                            padding: "4px 0"
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            id={`preview-chk-${f.id}`}
                                                                            checked={liveFormValues[f.id] || false}
                                                                            onChange={e =>
                                                                                handleFormValueChange(
                                                                                    f.id,
                                                                                    e.target.checked
                                                                                )
                                                                            }
                                                                            style={{
                                                                                width: "16px",
                                                                                height: "16px",
                                                                                marginTop: "2px",
                                                                                accentColor: "#8b5cf6"
                                                                            }}
                                                                        />
                                                                        <label
                                                                            htmlFor={`preview-chk-${f.id}`}
                                                                            style={{
                                                                                fontSize: "12px",
                                                                                color: formErrors[f.id]
                                                                                    ? "#ef4444"
                                                                                    : "#94a3b8",
                                                                                cursor: "pointer",
                                                                                lineHeight: "1.4"
                                                                            }}
                                                                        >
                                                                            {f.label}{" "}
                                                                            {f.required && (
                                                                                <span style={{ color: "#ef4444" }}>
                                                                                    *
                                                                                </span>
                                                                            )}
                                                                        </label>
                                                                    </div>
                                                                )}
                                                                {f.type === "button" && (
                                                                    <button
                                                                        type="submit"
                                                                        style={{
                                                                            width: "100%",
                                                                            padding: "10px",
                                                                            borderRadius: "8px",
                                                                            background:
                                                                                "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                                                                            border: "none",
                                                                            color: "#fff",
                                                                            fontWeight: 700,
                                                                            fontSize: "13px",
                                                                            cursor: "pointer",
                                                                            marginTop: "8px",
                                                                            boxShadow:
                                                                                "0 4px 12px rgba(139, 92, 246, 0.2)"
                                                                        }}
                                                                    >
                                                                        {f.label}
                                                                    </button>
                                                                )}

                                                                {formErrors[f.id] && (
                                                                    <span
                                                                        style={{ fontSize: "10px", color: "#f87171" }}
                                                                    >
                                                                        ⚠️ {formErrors[f.id]}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))
                                                    )}
                                                </form>
                                            )
                                        ) : (
                                            /* JSON Schema Code Render */
                                            <div style={{ position: "relative", height: "100%" }}>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(schemaStr);
                                                        addLog("📋 Schema JSON copied to clipboard!");
                                                    }}
                                                    style={{
                                                        position: "absolute",
                                                        top: "8px",
                                                        right: "8px",
                                                        background: "rgba(255,255,255,0.06)",
                                                        border: "1px solid rgba(255,255,255,0.1)",
                                                        borderRadius: "4px",
                                                        padding: "4px 8px",
                                                        color: "#cbd5e1",
                                                        fontSize: "10px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Copy JSON
                                                </button>
                                                <pre
                                                    style={{
                                                        margin: 0,
                                                        padding: "12px",
                                                        background: "#080c14",
                                                        border: "1px solid rgba(255,255,255,0.06)",
                                                        borderRadius: "10px",
                                                        color: "#86efac",
                                                        fontSize: "11px",
                                                        fontFamily: "monospace",
                                                        lineHeight: "1.5",
                                                        overflowX: "auto",
                                                        maxHeight: "450px"
                                                    }}
                                                >
                                                    {schemaStr}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* LOGS PANEL */}
                    <div
                        style={{
                            background: "#080c14",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "12px",
                            padding: "12px 16px",
                            height: "150px",
                            display: "flex",
                            flexDirection: "column",
                            boxSizing: "border-box",
                            marginTop: "20px"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <span
                                style={{
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    color: "#475569",
                                    textTransform: "uppercase",
                                    letterSpacing: "1px"
                                }}
                            >
                                📋 Real-time Event & Performance Logs
                            </span>
                            <span style={{ fontSize: "10px", color: saveDelay > 0 ? "#60a5fa" : "#94a3b8" }}>
                                {playgroundMode === "kanban"
                                    ? saveDelay > 0
                                        ? `Debounce Delay active: ${saveDelay}ms`
                                        : "Synchronous Saving"
                                    : "Interactive UI Mapping"}
                            </span>
                        </div>
                        <div
                            style={{
                                flex: 1,
                                overflowY: "auto",
                                fontFamily: "monospace",
                                fontSize: "11px",
                                lineHeight: "1.6",
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px"
                            }}
                        >
                            {logs.length === 0 ? (
                                <span style={{ color: "#334155" }}>
                                    — ลากวางหรือขยับตำแหน่งการ์ดเพื่อจับตาดูระบบประมวลผล —
                                </span>
                            ) : (
                                logs.map((log, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            color:
                                                i === 0
                                                    ? playgroundMode === "kanban"
                                                        ? "#22c55e"
                                                        : "#a78bfa"
                                                    : "#475569"
                                        }}
                                    >
                                        {i === 0 ? "▶ " : "  "}
                                        {log}
                                    </span>
                                ))
                            )}
                        </div>
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
                .playground-inner-lane-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    padding: 12px;
                }
            `}</style>
        </div>
    );
}

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
