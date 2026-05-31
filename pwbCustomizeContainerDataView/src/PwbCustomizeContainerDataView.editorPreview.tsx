import { ReactElement } from "react";
import { PwbCustomizeContainerDataViewPreviewProps } from "../typings/PwbCustomizeContainerDataViewProps";

export function preview(props: PwbCustomizeContainerDataViewPreviewProps): ReactElement {
    const safeColor = props.accentColor || "#3b82f6";
    const safeRadius = props.borderRadius || "16px";

    // We render a preview that closely resembles the vertical/horizontal drag list
    const items = [
        { id: "1", name: "Custom Nested Widget Dropzone - Item A" },
        { id: "2", name: "Custom Nested Widget Dropzone - Item B" }
    ];

    return (
        <div
            className={`pwb-drag-container pwb-direction-${props.layoutDirection}`}
            style={{
                "--accent-color": safeColor,
                "--border-radius": safeRadius,
                "--accent-glow": `rgba(59, 130, 246, 0.15)`,
                border: "1px dashed #cbd5e1",
                padding: "12px",
                backgroundColor: "#f8fafc",
                display: "flex",
                flexDirection: props.layoutDirection === "vertical" ? "column" : "row",
                gap: "8px",
                width: "100%"
            } as any}
        >
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "8px", fontWeight: "bold", width: "100%" }}>
                PWB Customize Container DataView (Drag & Drop Sortable Container Preview)
            </div>

            {items.map((item, idx) => (
                <div
                    key={item.id}
                    className="pwb-draggable-row-item"
                    style={{
                        borderRadius: `calc(${safeRadius} * 0.5)`,
                        border: "1px solid #e2e8f0",
                        backgroundColor: "#ffffff",
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        flexGrow: 1
                    }}
                >
                    {/* Drag Handle Icon */}
                    <div className="pwb-drag-handle" style={{ marginRight: "14px", color: "#94a3b8", display: "flex", alignItems: "center" }}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ display: "block" }}>
                            <circle cx="9" cy="5" r="1.2" fill="currentColor" />
                            <circle cx="9" cy="12" r="1.2" fill="currentColor" />
                            <circle cx="9" cy="19" r="1.2" fill="currentColor" />
                            <circle cx="15" cy="5" r="1.2" fill="currentColor" />
                            <circle cx="15" cy="12" r="1.2" fill="currentColor" />
                            <circle cx="15" cy="19" r="1.2" fill="currentColor" />
                        </svg>
                    </div>

                    {/* Mendix Widget DropZone Preview */}
                    <div style={{ flexGrow: 1 }}>
                        <props.customItemContent.renderer caption={`Drop widgets here [Item Row ${idx + 1}]`}>
                            <div style={{ padding: "8px", background: "#f1f5f9", borderRadius: "4px", fontSize: "13px", border: "1px dashed #cbd5e1" }}>
                                {item.name}
                            </div>
                        </props.customItemContent.renderer>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/PwbCustomizeContainerDataView.css");
}
