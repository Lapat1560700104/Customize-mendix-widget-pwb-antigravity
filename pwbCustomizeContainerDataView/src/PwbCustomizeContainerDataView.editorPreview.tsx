import { ReactElement, CSSProperties } from "react";
import { PwbCustomizeContainerDataViewPreviewProps } from "../typings/PwbCustomizeContainerDataViewProps";

// ── Drag Handle SVG ──────────────────────────────────────────────────────────
function DragHandle({ color }: { color: string }): ReactElement {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color,
                marginRight: "12px",
                flexShrink: 0,
                opacity: 0.6
            }}
        >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="9" cy="5" r="1.2" fill="currentColor" />
                <circle cx="9" cy="12" r="1.2" fill="currentColor" />
                <circle cx="9" cy="19" r="1.2" fill="currentColor" />
                <circle cx="15" cy="5" r="1.2" fill="currentColor" />
                <circle cx="15" cy="12" r="1.2" fill="currentColor" />
                <circle cx="15" cy="19" r="1.2" fill="currentColor" />
            </svg>
        </div>
    );
}

// ── Main Preview Component ───────────────────────────────────────────────────
export function preview(props: PwbCustomizeContainerDataViewPreviewProps): ReactElement {
    const accentColor = props.accentColor || "#3b82f6";
    const borderRadius = props.borderRadius || "16px";
    const isHorizontal = props.layoutDirection === "horizontal";

    // Detect Studio Pro render modes for optimal styling
    const isXray = props.renderMode === "xray";
    const isStructure = props.renderMode === "structure";

    // ── Theme tokens ────────────────────────────────────────────────────────
    const colors = {
        bg: isXray ? "transparent" : "#f8fafc",
        border: isXray ? accentColor : "#e2e8f0",
        rowBg: isXray ? "rgba(255,255,255,0.06)" : "#ffffff",
        rowBorder: isXray ? `${accentColor}50` : "#e2e8f0",
        handleColor: isXray ? accentColor : "#94a3b8",
        headerBg: accentColor,
        headerText: "#ffffff",
        labelColor: isXray ? accentColor : "#64748b",
        dropzoneBg: isXray ? `${accentColor}12` : "#f1f5f9",
        dropzoneBorder: isXray ? `${accentColor}60` : "#cbd5e1"
    };

    const rowContainerStyle: CSSProperties = {
        display: "flex",
        flexDirection: isHorizontal ? "row" : "column",
        gap: props.itemGap || "12px",
        width: "100%"
    };

    // Calculate dynamic preset overrides for high-fidelity designer preview
    let presetRowStyle: CSSProperties = {};
    if (props.themePreset === "modern_glass") {
        presetRowStyle = {
            backgroundColor: "rgba(255, 255, 255, 0.45)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: `1px solid ${colors.handleColor}40`,
            boxShadow: "0 8px 24px 0 rgba(0, 0, 0, 0.02)"
        };
    } else if (props.themePreset === "minimalist_flat") {
        presetRowStyle = {
            backgroundColor: "transparent",
            border: "none",
            borderBottom: `1px solid ${colors.rowBorder}`,
            borderRadius: "0px",
            boxShadow: "none",
            paddingLeft: "4px",
            paddingRight: "4px"
        };
    } else if (props.themePreset === "neo_brutalist") {
        presetRowStyle = {
            backgroundColor: colors.rowBg,
            border: "3px solid #000000",
            boxShadow: "5px 5px 0px 0px #000000",
            borderRadius: "4px"
        };
    }

    const rowStyle: CSSProperties = {
        display: "flex",
        alignItems: "stretch",
        padding: props.itemPadding || "12px 16px",
        borderRadius: `calc(${borderRadius} * 0.5)`,
        border: `1px solid ${colors.rowBorder}`,
        backgroundColor: colors.rowBg,
        flexGrow: isHorizontal ? 1 : undefined,
        minWidth: isHorizontal ? "180px" : undefined,
        gap: "0",
        position: "relative",
        overflow: "hidden",
        ...presetRowStyle
    };

    // Subtle accent left bar on each row (hidden in Brutalist or Flat mode for consistency)
    const accentBarStyle: CSSProperties = {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "3px",
        backgroundColor: accentColor,
        opacity: props.themePreset === "neo_brutalist" || props.themePreset === "minimalist_flat" ? 0 : 0.35,
        borderRadius: "2px 0 0 2px"
    };

    // ── Header strip ────────────────────────────────────────────────────────
    const headerStyle: CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 10px",
        borderRadius: "6px",
        background: `linear-gradient(135deg, ${accentColor}ee, ${accentColor}bb)`,
        marginBottom: "2px"
    };

    const dirIcon = isHorizontal ? "↔" : "↕";
    const dirLabel = isHorizontal ? "Horizontal Grid" : "Vertical List";
    const presetLabelMap: Record<string, string> = {
        default_rounded: "Default Rounded",
        modern_glass: "Glassmorphism",
        minimalist_flat: "Minimalist Flat",
        neo_brutalist: "Neo-Brutalist"
    };
    const presetLabel = presetLabelMap[props.themePreset] || "Default Rounded";

    const sourceLabel = props.itemsSource
        ? typeof props.itemsSource === "object" && "caption" in props.itemsSource
            ? String((props.itemsSource as { caption: string }).caption)
            : "Items Source bound"
        : "⚠ No datasource";

    const widgetCount = props.customItemContent?.widgetCount ?? 0;

    // Resolve actions size styling variables
    let resolvedActionsSize = "auto";
    if (props.enableActionsSection) {
        if (props.actionsSectionSize === "custom") {
            resolvedActionsSize = props.actionsSectionSizeCustom || "200px";
        } else if (props.actionsSectionSize && props.actionsSectionSize.startsWith("ratio_")) {
            const pct = props.actionsSectionSize.replace("ratio_", "");
            resolvedActionsSize = `${pct}%`;
        }
    }

    const actionsLayoutStyles = props.enableActionsSection
        ? ({ "--pwb-actions-size-resolved": resolvedActionsSize } as CSSProperties)
        : {};

    const containerStyle: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        padding: "10px",
        borderRadius: "10px",
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.bg,
        width: "100%",
        fontFamily: "system-ui, -apple-system, sans-serif",
        ...actionsLayoutStyles
    };

    const actionsPreview = props.enableActionsSection && props.actionsSectionContent?.renderer && (
        <div className="pwb-actions-section-card" style={{ flexGrow: 1 }}>
            <props.actionsSectionContent.renderer caption="Actions Content — Drag widgets here">
                <div
                    style={{
                        padding: "8px 10px",
                        background: colors.dropzoneBg,
                        borderRadius: "6px",
                        fontSize: "11px",
                        color: colors.labelColor,
                        border: `1px dashed ${colors.dropzoneBorder}`,
                        textAlign: "center"
                    }}
                >
                    ⬇ Drop buttons/actions here
                </div>
            </props.actionsSectionContent.renderer>
        </div>
    );

    const listContent = (
        <>
            {/* ── Lane Title Section Preview ── */}
            {props.enableLaneTitle && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        border: `1px solid ${colors.border}`,
                        marginBottom: props.itemGap || "12px",
                        backgroundColor: colors.rowBg
                    }}
                >
                    <span style={{ fontSize: "13px", fontWeight: 700, color: colors.labelColor }}>
                        📌 {props.laneTitle || "Lane Title Text"}
                    </span>
                    {props.laneTitleContent?.renderer && (
                        <div style={{ flexGrow: 1, marginLeft: "16px" }}>
                            <props.laneTitleContent.renderer caption="Title Widgets">
                                <div
                                    style={{
                                        padding: "4px 8px",
                                        background: colors.dropzoneBg,
                                        borderRadius: "4px",
                                        fontSize: "10px",
                                        color: colors.labelColor,
                                        border: `1px dashed ${colors.dropzoneBorder}`,
                                        textAlign: "center"
                                    }}
                                >
                                    ⬇ Drop title widgets here
                                </div>
                            </props.laneTitleContent.renderer>
                        </div>
                    )}
                </div>
            )}

            {/* ── Header Section Preview ── */}
            {props.enableHeader && props.headerContent?.renderer && (
                <div
                    style={{
                        border: `1px dashed ${colors.border}`,
                        borderRadius: `calc(${borderRadius} * 0.5)`,
                        padding: "8px 12px",
                        marginBottom: props.itemGap || "12px",
                        backgroundColor: colors.rowBg,
                        boxSizing: "border-box"
                    }}
                >
                    <props.headerContent.renderer caption="Header Content — Drag widgets here">
                        <div
                            style={{
                                padding: "8px 10px",
                                background: colors.dropzoneBg,
                                borderRadius: "6px",
                                fontSize: "11px",
                                color: colors.labelColor,
                                border: `1px dashed ${colors.dropzoneBorder}`,
                                textAlign: "center"
                            }}
                        >
                            ⬇ Drop header widgets here
                        </div>
                    </props.headerContent.renderer>
                </div>
            )}

            {/* ── Sortable Rows ── */}
            <div style={rowContainerStyle}>
                {/* Row 1 — shows the LIVE nested widgets via renderer */}
                <div style={rowStyle}>
                    <div style={accentBarStyle} />
                    {props.dragHandleDisplay === "left" && !props.readOnlyMode && (
                        <DragHandle color={colors.handleColor} />
                    )}
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <props.customItemContent.renderer caption="Row 1 — Your content widgets render here">
                            {/* Fallback shown only when dropzone is empty */}
                            <div
                                style={{
                                    padding: "8px 10px",
                                    background: colors.dropzoneBg,
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                    color: colors.labelColor,
                                    border: `1px dashed ${colors.dropzoneBorder}`,
                                    textAlign: "center"
                                }}
                            >
                                ⬇ Drop widgets here — they appear in every row
                            </div>
                        </props.customItemContent.renderer>
                    </div>
                </div>

                {/* Row 2 — mirror of row 1, shows same live content */}
                <div style={{ ...rowStyle, opacity: 0.65 }}>
                    <div style={accentBarStyle} />
                    {props.dragHandleDisplay === "left" && !props.readOnlyMode && (
                        <DragHandle color={colors.handleColor} />
                    )}
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <props.customItemContent.renderer caption="Row 2 — Repeated for each datasource item">
                            <div
                                style={{
                                    padding: "8px 10px",
                                    background: colors.dropzoneBg,
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                    color: colors.labelColor,
                                    border: `1px dashed ${colors.dropzoneBorder}`,
                                    opacity: 0.7,
                                    textAlign: "center"
                                }}
                            >
                                ⬇ Same template — repeated per item
                            </div>
                        </props.customItemContent.renderer>
                    </div>
                </div>

                {/* Row 3 — ghost row hint */}
                {!isXray && (
                    <div
                        style={{
                            ...rowStyle,
                            opacity: 0.3,
                            border: `1px dashed ${colors.rowBorder}`,
                            backgroundColor: "transparent",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "8px 14px"
                        }}
                    >
                        <span style={{ fontSize: "11px", color: colors.labelColor }}>
                            · · · more rows from datasource · · ·
                        </span>
                    </div>
                )}
            </div>

            {/* ── Footer Section Preview ── */}
            {props.enableFooter && props.footerContent?.renderer && (
                <div
                    style={{
                        border: `1px dashed ${colors.border}`,
                        borderRadius: `calc(${borderRadius} * 0.5)`,
                        padding: "8px 12px",
                        marginTop: props.itemGap || "12px",
                        backgroundColor: colors.rowBg,
                        boxSizing: "border-box"
                    }}
                >
                    <props.footerContent.renderer caption="Footer Content — Drag widgets here">
                        <div
                            style={{
                                padding: "8px 10px",
                                background: colors.dropzoneBg,
                                borderRadius: "6px",
                                fontSize: "11px",
                                color: colors.labelColor,
                                border: `1px dashed ${colors.dropzoneBorder}`,
                                textAlign: "center"
                            }}
                        >
                            ⬇ Drop footer widgets here
                        </div>
                    </props.footerContent.renderer>
                </div>
            )}

            {/* ── Main Footer Section Preview ── */}
            {props.enableMainFooter && props.mainFooterContent?.renderer && (
                <div
                    style={{
                        border: `1px dashed ${colors.border}`,
                        borderRadius: `calc(${borderRadius} * 0.5)`,
                        padding: "8px 12px",
                        marginTop: props.itemGap || "12px",
                        backgroundColor: colors.rowBg,
                        boxSizing: "border-box"
                    }}
                >
                    <props.mainFooterContent.renderer caption="Main Footer Content — Drag widgets here">
                        <div
                            style={{
                                padding: "8px 10px",
                                background: colors.dropzoneBg,
                                borderRadius: "6px",
                                fontSize: "11px",
                                color: colors.labelColor,
                                border: `1px dashed ${colors.dropzoneBorder}`,
                                textAlign: "center"
                            }}
                        >
                            ⬇ Drop main footer widgets here
                        </div>
                    </props.mainFooterContent.renderer>
                </div>
            )}

            {/* ── onSortAction indicator ── */}
            {!isStructure && props.onSortAction && (
                <div
                    style={{
                        fontSize: "10px",
                        color: "#22c55e",
                        padding: "4px 8px",
                        background: "rgba(34,197,94,0.08)",
                        borderRadius: "6px",
                        border: "1px solid rgba(34,197,94,0.2)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                    }}
                >
                    ⚡ On Sort Action: connected
                </div>
            )}
        </>
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
            <div style={containerStyle}>
                {/* ── Header ── */}
                <div style={headerStyle}>
                    <span style={{ color: "#fff", fontSize: "11px", fontWeight: 700, letterSpacing: "0.3px" }}>
                        ⠿ PWB Container &nbsp;·&nbsp; {dirIcon} {dirLabel} ({presetLabel})
                    </span>
                    <span
                        style={{
                            color: `${accentColor}22` === accentColor ? "#fff" : "rgba(255,255,255,0.75)",
                            fontSize: "10px",
                            background: "rgba(255,255,255,0.18)",
                            padding: "2px 7px",
                            borderRadius: "10px"
                        }}
                    >
                        {sourceLabel}
                    </span>
                </div>

                {/* ── Widget count badge ── */}
                {!isStructure && (
                    <div
                        style={{
                            fontSize: "10px",
                            color: colors.labelColor,
                            padding: "0 2px",
                            display: "flex",
                            gap: "12px",
                            alignItems: "center",
                            marginBottom: "4px"
                        }}
                    >
                        <span>
                            🧩{" "}
                            {widgetCount > 0
                                ? `${widgetCount} widget${widgetCount > 1 ? "s" : ""} inside each row`
                                : "Drop widgets into rows below ↓"}
                        </span>
                        {props.sortedAttribute && !props.readOnlyMode && (
                            <span style={{ color: accentColor, fontWeight: 600 }}>💾 Sorted IDs: bound</span>
                        )}
                        {props.readOnlyMode && props.sortIdAttribute && (
                            <span style={{ color: accentColor, fontWeight: 600 }}>🔒 Read Only (Sort ID: bound)</span>
                        )}
                    </div>
                )}

                {/* ── Inner Content (Actions Layout & List Content) ── */}
                {props.enableActionsSection ? (
                    <div
                        className={`pwb-actions-layout-container pwb-actions-layout-${props.actionsSectionLayout} pwb-actions-pos-${props.actionsSectionPosition}`}
                    >
                        {props.actionsSectionPosition === "before" && actionsPreview}
                        <div
                            style={{
                                minWidth: 0,
                                minHeight: 0,
                                display: "flex",
                                flexDirection: "column",
                                width: "100%"
                            }}
                        >
                            {listContent}
                        </div>
                        {props.actionsSectionPosition === "after" && actionsPreview}
                    </div>
                ) : (
                    listContent
                )}
            </div>

            {/* ── Outer Footer Section Preview ── */}
            {props.enableOuterFooter && props.outerFooterContent?.renderer && (
                <div
                    style={{
                        border: `1px dashed ${colors.border}`,
                        borderRadius: `calc(${borderRadius} * 0.5)`,
                        padding: "8px 12px",
                        backgroundColor: colors.rowBg,
                        boxSizing: "border-box"
                    }}
                >
                    <props.outerFooterContent.renderer caption="Outer Footer Content — Drag widgets here">
                        <div
                            style={{
                                padding: "8px 10px",
                                background: colors.dropzoneBg,
                                borderRadius: "6px",
                                fontSize: "11px",
                                color: colors.labelColor,
                                border: `1px dashed ${colors.dropzoneBorder}`,
                                textAlign: "center"
                            }}
                        >
                            ⬇ Drop outer footer widgets here
                        </div>
                    </props.outerFooterContent.renderer>
                </div>
            )}
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/PwbCustomizeContainerDataView.css");
}
