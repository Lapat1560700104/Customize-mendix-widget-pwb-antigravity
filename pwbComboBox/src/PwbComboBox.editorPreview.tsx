import { ReactElement } from "react";
import { PwbComboBoxPreviewProps } from "../typings/PwbComboBoxProps";

export function preview({
    selectionMode,
    placeholder,
    accentColor,
    borderRadius,
    bgBlur,
    popoverBg
}: PwbComboBoxPreviewProps): ReactElement {
    const isMulti = selectionMode === "multi";
    const safeColor = accentColor || "#3b82f6";
    const safeRadius = borderRadius || "16px";

    return (
        <div
            className="pwb-combobox-wrapper"
            style={
                {
                    "--accent-color": safeColor,
                    "--border-radius": safeRadius,
                    "--bg-blur": bgBlur || "16px",
                    "--popover-bg": popoverBg || "rgba(255, 255, 255, 0.9)"
                } as any
            }
        >
            {/* Input Selection Bar Container */}
            <div className="pwb-combobox-input-container">
                {isMulti && (
                    <div className="pwb-combobox-tags-list">
                        {/* 1. Initials Avatar tag pill */}
                        <div className="pwb-combobox-tag-pill pwb-tag-avatar-style">
                            <span className="pwb-combobox-tag-avatar" style={{ backgroundColor: safeColor }}>
                                R
                            </span>
                            <span className="pwb-combobox-tag-text">React</span>
                            <button type="button" className="pwb-combobox-tag-remove-btn">
                                &times;
                            </button>
                        </div>
                        {/* 2. Custom Color tag pill */}
                        <div
                            className="pwb-combobox-tag-pill pwb-tag-avatar-style"
                            style={{
                                borderColor: "#10b981",
                                color: "#10b981",
                                backgroundColor: "rgba(16, 185, 129, 0.08)"
                            }}
                        >
                            <span className="pwb-combobox-tag-avatar" style={{ backgroundColor: "#10b981" }}>
                                P
                            </span>
                            <span className="pwb-combobox-tag-text" style={{ color: "#10b981" }}>
                                Python
                            </span>
                            <button type="button" className="pwb-combobox-tag-remove-btn" style={{ color: "#10b981" }}>
                                &times;
                            </button>
                        </div>
                    </div>
                )}

                <input
                    type="text"
                    className="pwb-combobox-search-input"
                    placeholder={isMulti ? "" : placeholder || "Search and select..."}
                    readOnly
                />

                <div className="pwb-combobox-actions">
                    <button type="button" className="pwb-combobox-chevron-btn" style={{ color: safeColor }}>
                        <svg
                            className="pwb-combobox-chevron-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            style={{ width: "16px", height: "16px", transform: "rotate(180deg)" }}
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mocked Popover Dropdown Panel visible in Mendix Studio Pro */}
            <div
                className="pwb-combobox-popover"
                style={{
                    position: "relative",
                    top: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.6)",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)"
                }}
            >
                <div className="pwb-combobox-options-list" style={{ maxHeight: "none" }}>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                        {/* Group Header 1 */}
                        <li className="pwb-combobox-group-header" style={{ borderTop: "none" }}>
                            <div className="pwb-combobox-group-header-content">
                                <span>FRONTEND STACKS</span>
                                <span className="pwb-combobox-group-count">2</span>
                            </div>
                            <svg
                                className="pwb-combobox-group-chevron"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                style={{ width: "12px", height: "12px" }}
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </li>

                        {/* Option 1: Selected with initials */}
                        <li className="pwb-combobox-option-item pwb-option-selected pwb-option-two-line">
                            <div
                                className="pwb-combobox-option-avatar-container"
                                style={{
                                    backgroundColor: `color-mix(in srgb, ${safeColor} 12%, transparent)`,
                                    color: safeColor,
                                    borderColor: `color-mix(in srgb, ${safeColor} 30%, transparent)`
                                }}
                            >
                                <span className="pwb-combobox-option-avatar-initials">R</span>
                            </div>
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                                <div className="pwb-combobox-option-label">React</div>
                                <div
                                    className="pwb-combobox-option-subtitle"
                                    style={{ color: "rgba(59, 130, 246, 0.7)" }}
                                >
                                    Frontend JavaScript Library
                                </div>
                            </div>
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
                        </li>

                        {/* Option 2: Normal item */}
                        <li className="pwb-combobox-option-item pwb-option-two-line">
                            <div
                                className="pwb-combobox-option-avatar-container"
                                style={{
                                    backgroundColor: "color-mix(in srgb, #00add8 12%, transparent)",
                                    color: "#00add8",
                                    borderColor: "color-mix(in srgb, #00add8 30%, transparent)"
                                }}
                            >
                                <span className="pwb-combobox-option-avatar-initials">G</span>
                            </div>
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                                <div className="pwb-combobox-option-label">Go (Golang)</div>
                                <div className="pwb-combobox-option-subtitle">High Performance Backend Language</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/PwbComboBox.css");
}
