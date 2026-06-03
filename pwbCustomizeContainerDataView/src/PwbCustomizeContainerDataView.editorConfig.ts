import { PwbCustomizeContainerDataViewPreviewProps } from "../typings/PwbCustomizeContainerDataViewProps";

export type Platform = "web" | "desktop";

export type Properties = PropertyGroup[];

type PropertyGroup = {
    caption: string;
    propertyGroups?: PropertyGroup[];
    properties?: Property[];
};

type Property = {
    key: string;
    caption: string;
    description?: string;
    objectHeaders?: string[]; // used for customizing object grids
    objects?: ObjectProperties[];
    properties?: Properties[];
};

type ObjectProperties = {
    properties: PropertyGroup[];
    captions?: string[]; // used for customizing object grids
};

export type Problem = {
    property?: string; // key of the property, at which the problem exists
    severity?: "error" | "warning" | "deprecation"; // default = "error"
    message: string; // description of the problem
    studioMessage?: string; // studio-specific message, defaults to message
    url?: string; // link with more information about the problem
    studioUrl?: string; // studio-specific link
};

type BaseProps = {
    type: "Image" | "Container" | "RowLayout" | "Text" | "DropZone" | "Selectable" | "Datasource";
    grow?: number; // optionally sets a growth factor if used in a layout (default = 1)
};

type ImageProps = BaseProps & {
    type: "Image";
    document?: string; // svg image
    data?: string; // base64 image
    property?: object; // widget image property object from Values API
    width?: number; // sets a fixed maximum width
    height?: number; // sets a fixed maximum height
};

type ContainerProps = BaseProps & {
    type: "Container" | "RowLayout";
    children: PreviewProps[]; // any other preview element
    borders?: boolean; // sets borders around the layout to visually group its children
    borderRadius?: number; // integer. Can be used to create rounded borders
    backgroundColor?: string; // HTML color, formatted #RRGGBB
    borderWidth?: number; // sets the border width
    padding?: number; // integer. adds padding around the container
};

type RowLayoutProps = ContainerProps & {
    type: "RowLayout";
    columnSize?: "fixed" | "grow"; // default is fixed
};

type TextProps = BaseProps & {
    type: "Text";
    content: string; // text that should be shown
    fontSize?: number; // sets the font size
    fontColor?: string; // HTML color, formatted #RRGGBB
    bold?: boolean;
    italic?: boolean;
};

type DropZoneProps = BaseProps & {
    type: "DropZone";
    property: object; // widgets property object from Values API
    placeholder: string; // text to be shown inside the dropzone when empty
    showDataSourceHeader?: boolean; // true by default. Toggles whether to show a header containing information about the datasource
};

type SelectableProps = BaseProps & {
    type: "Selectable";
    object: object; // object property instance from the Value API
    child: PreviewProps; // any type of preview property to visualize the object instance
};

type DatasourceProps = BaseProps & {
    type: "Datasource";
    property: object | null; // datasource property object from Values API
    child?: PreviewProps; // any type of preview property component (optional)
};

export type PreviewProps =
    | ImageProps
    | ContainerProps
    | RowLayoutProps
    | TextProps
    | DropZoneProps
    | SelectableProps
    | DatasourceProps;

export function getProperties(
    values: PwbCustomizeContainerDataViewPreviewProps,
    defaultProperties: Properties /* , target: Platform*/
): Properties {
    const propsToHide: string[] = [];
    if (!values.enableKanban) {
        propsToHide.push("dragGroup", "columnValue", "itemColumnAttribute");
    }
    if (!values.enableHeader) {
        propsToHide.push("headerContent");
    }
    if (!values.enableFooter) {
        propsToHide.push("footerContent");
    }
    if (!values.enableMainFooter) {
        propsToHide.push("mainFooterContent");
    }
    if (!values.enableLaneTitle) {
        propsToHide.push("laneTitle", "laneTitleContent");
    }
    if (!values.enableOuterFooter) {
        propsToHide.push("outerFooterContent");
    }

    if (propsToHide.length > 0) {
        const filterProperties = (groups: PropertyGroup[]): PropertyGroup[] => {
            return groups.map(group => {
                const newGroup = { ...group };
                if (group.properties) {
                    newGroup.properties = group.properties.filter(prop => !propsToHide.includes(prop.key));
                }
                if (group.propertyGroups) {
                    newGroup.propertyGroups = filterProperties(group.propertyGroups);
                }
                return newGroup;
            });
        };

        return filterProperties(defaultProperties);
    }
    return defaultProperties;
}

export function check(values: PwbCustomizeContainerDataViewPreviewProps): Problem[] {
    const errors: Problem[] = [];

    if (!values.sortedAttribute) {
        errors.push({
            property: "sortedAttribute",
            severity: "error",
            message: "A Sorted IDs Attribute is required to persist the sorted order of child items."
        });
    }

    if (
        values.accentColor &&
        !/^(#([0-9a-fA-F]{3}){1,2}|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[0-9.]+\s*)?\)|[a-zA-Z]+)$/.test(
            values.accentColor.trim()
        )
    ) {
        errors.push({
            property: "accentColor",
            severity: "warning",
            message: "Please enter a valid CSS hex, rgb, or color name."
        });
    }

    if (values.enableKanban) {
        if (!values.dragGroup || values.dragGroup.trim() === "") {
            errors.push({
                property: "dragGroup",
                severity: "error",
                message:
                    "When Kanban mode is active, a Drag Group Name is required to bind drag interactions between columns."
            });
        }
        if (!values.itemColumnAttribute) {
            errors.push({
                property: "itemColumnAttribute",
                severity: "error",
                message:
                    "An Item Column Attribute is required to persist status changes when moving cards across Kanban columns."
            });
        }
    }

    if (values.saveDelay !== undefined && values.saveDelay !== null && values.saveDelay < 0) {
        errors.push({
            property: "saveDelay",
            severity: "error",
            message: "Save Delay must be a positive integer in milliseconds (use 0 for immediate sync)."
        });
    }

    return errors;
}

/**
 * getPreview — renders the real-time Mendix Studio Pro structural preview.
 *
 * Strategy:
 * - Wrap everything in a Container that mimics the drag list appearance.
 * - Use a Datasource node to show the itemsSource binding header.
 * - Inside it, use a DropZone linked to `customItemContent` so Studio Pro
 *   renders the ACTUAL widgets dropped by the developer — not a placeholder.
 * - Show drag handle decoration on the left of each row via RowLayout.
 */
export function getPreview(
    values: PwbCustomizeContainerDataViewPreviewProps,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _isDarkMode: boolean
): PreviewProps {
    const accentColor = values.accentColor || "#3b82f6";
    const isHorizontal = values.layoutDirection === "horizontal";

    // ── Drag Handle ── visual grip dots column
    const dragHandleSvg =
        `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#94a3b8" stroke-width="2.5">` +
        `<circle cx="9" cy="5" r="1.2" fill="#94a3b8"/>` +
        `<circle cx="9" cy="12" r="1.2" fill="#94a3b8"/>` +
        `<circle cx="9" cy="19" r="1.2" fill="#94a3b8"/>` +
        `<circle cx="15" cy="5" r="1.2" fill="#94a3b8"/>` +
        `<circle cx="15" cy="12" r="1.2" fill="#94a3b8"/>` +
        `<circle cx="15" cy="19" r="1.2" fill="#94a3b8"/>` +
        `</svg>`;

    // ── Single item row children: [Handle (optional)] [DropZone with real widgets] ──
    const rowChildren: PreviewProps[] = [];
    if (values.dragHandleDisplay === "left") {
        rowChildren.push({
            type: "Container",
            grow: 0,
            children: [
                {
                    type: "Image",
                    document: dragHandleSvg,
                    width: 14,
                    height: 14
                }
            ],
            padding: 4
        });
    }
    rowChildren.push({
        type: "DropZone",
        property: values.customItemContent as object,
        placeholder: "⬇ Drop your content widgets here — each item row will display these widgets",
        showDataSourceHeader: false,
        grow: 1
    });

    const itemRow: RowLayoutProps = {
        type: "RowLayout",
        columnSize: "grow",
        borders: true,
        borderRadius: 8,
        borderWidth: 1,
        padding: 8,
        backgroundColor: "#ffffff",
        children: rowChildren
    };

    // ── Direction label in header ──
    const directionLabel = isHorizontal ? "Horizontal Grid →" : "Vertical List ↓";

    const presetLabelMap: Record<string, string> = {
        default_rounded: "Default Rounded",
        modern_glass: "Glassmorphism",
        minimalist_flat: "Minimalist Flat",
        neo_brutalist: "Neo-Brutalist"
    };
    const presetLabel = presetLabelMap[values.themePreset] || "Default Rounded";

    // ── Header bar: widget identity + current config summary ──
    const headerBar: RowLayoutProps = {
        type: "RowLayout",
        columnSize: "grow",
        backgroundColor: accentColor,
        borderRadius: 6,
        padding: 6,
        children: [
            {
                type: "Text",
                content: `⠿ PWB Container  ·  ${directionLabel}  ·  Theme: ${presetLabel}`,
                fontSize: 10,
                fontColor: "#ffffff",
                bold: true
            }
        ]
    };

    // ── Datasource wrapper: shows bound datasource name + one item row ──
    const datasourceWrapper: DatasourceProps = {
        type: "Datasource",
        property: values.itemsSource as object | null,
        child: itemRow
    };

    // ── Outer container: header + datasource row ──
    return {
        type: "Container",
        borders: true,
        borderRadius: 10,
        borderWidth: 1,
        padding: 8,
        children: [headerBar, datasourceWrapper]
    };
}

export function getCustomCaption(
    values: PwbCustomizeContainerDataViewPreviewProps,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _platform: Platform
): string {
    const dir = values.layoutDirection === "horizontal" ? "↔ Horizontal" : "↕ Vertical";
    const src = values.itemsSource ? "bound" : "no datasource";
    return `PWB Container [${dir}] (${src})`;
}
