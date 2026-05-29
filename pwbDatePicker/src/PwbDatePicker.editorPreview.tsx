import { ReactElement } from "react";
import { PwbDatePickerPreviewProps } from "../typings/PwbDatePickerProps";

export function preview(props: PwbDatePickerPreviewProps): ReactElement {
    const isRange = props.selectionMode === "range";
    const placeholderText = props.placeholder || (isRange ? "Start Date ~ End Date" : "Select date...");

    // Accent color and border radius for editor preview
    const accentColor = props.accentColor || "#3b82f6";
    const borderRadius = props.borderRadius || "16px";

    // Dynamic icon rendering inside Mendix Editor
    const renderPreviewIcon = (): ReactElement => {
        if (props.calendarIcon) {
            if (props.calendarIcon.type === "image") {
                return (
                    <img
                        src={props.calendarIcon.iconUrl || props.calendarIcon.imageUrl}
                        alt="Calendar Icon"
                        style={{
                            width: "16px",
                            height: "16px",
                            objectFit: "contain",
                            opacity: 0.8
                        }}
                    />
                );
            } else if (props.calendarIcon.iconClass) {
                return (
                    <span
                        className={props.calendarIcon.iconClass}
                        style={{ fontSize: "16px", opacity: 0.8, color: "#94a3b8" }}
                    />
                );
            }
        }

        // Default modern minimalist calendar icon fallback
        return (
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: 0.8 }}
            >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        );
    };

    return (
        <div className="pwb-datepicker-preview" style={{ fontFamily: "Inter, system-ui, sans-serif", padding: "10px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {/* Header label inside editor */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: accentColor }} />
                    <span
                        style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#94a3b8",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em"
                        }}
                    >
                        PWB Advanced DatePicker {isRange ? "[Range Mode]" : "[Single Mode]"}
                    </span>
                </div>

                {/* Input Field Mockup */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius,
                        padding: "8px 14px",
                        width: "100%",
                        maxWidth: "320px",
                        boxSizing: "border-box"
                    }}
                >
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>{placeholderText}</span>
                    <div style={{ display: "flex", alignItems: "center", height: "16px", width: "16px" }}>
                        {renderPreviewIcon()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/PwbDatePicker.css");
}
