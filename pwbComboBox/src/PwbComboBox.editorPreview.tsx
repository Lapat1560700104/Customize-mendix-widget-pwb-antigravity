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
                    "--popover-bg": popoverBg || "rgba(255, 255, 255, 0.85)"
                } as any
            }
        >
            <div className="pwb-combobox-input-container">
                {isMulti && (
                    <div className="pwb-combobox-tags-list">
                        <div className="pwb-combobox-tag-pill">
                            <span>Option 1</span>
                            <button type="button" className="pwb-combobox-tag-remove-btn">
                                &times;
                            </button>
                        </div>
                        <div className="pwb-combobox-tag-pill">
                            <span>Option 2</span>
                            <button type="button" className="pwb-combobox-tag-remove-btn">
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
                            style={{ width: "16px", height: "16px" }}
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/PwbComboBox.css");
}
