import { PwbComboBoxPreviewProps } from "../typings/PwbComboBoxProps";

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
    values: PwbComboBoxPreviewProps,
    defaultProperties: Properties /* , target: Platform*/
): Properties {
    const computedSourceMode = values.source === "database" ? "association" : values.sourceType;

    // 1. Find "General" group and filter subgroups
    const generalGroup = defaultProperties.find(g => g.caption === "General");
    if (generalGroup && generalGroup.propertyGroups) {
        generalGroup.propertyGroups = generalGroup.propertyGroups.filter(subGroup => {
            if (subGroup.caption === "3. Entity Datasource Config") {
                return computedSourceMode === "association";
            }
            if (subGroup.caption === "4. Boolean Mode Config") {
                return computedSourceMode === "boolean";
            }
            return true;
        });

        // Inside "Data source" group, filter properties based on source and selectionMode
        const dataSourceGroup = generalGroup.propertyGroups.find(g => g.caption === "Data source");
        if (dataSourceGroup && dataSourceGroup.properties) {
            dataSourceGroup.properties = dataSourceGroup.properties.filter(prop => {
                if (prop.key === "sourceType") {
                    return values.source === "context";
                }
                if (prop.key === "selectedAssociation") {
                    return computedSourceMode === "association";
                }
                if (prop.key === "delimiter" || prop.key === "maxVisibleTags") {
                    return values.selectionMode === "multi";
                }
                return true;
            });
        }

        // Inside "4. Boolean Mode Config", filter properties if output format is native boolean
        const booleanConfigGroup = generalGroup.propertyGroups.find(g => g.caption === "4. Boolean Mode Config");
        if (booleanConfigGroup && booleanConfigGroup.properties) {
            booleanConfigGroup.properties = booleanConfigGroup.properties.filter(prop => {
                if (prop.key === "booleanTrueValue" || prop.key === "booleanFalseValue") {
                    return values.booleanOutputFormat === "string";
                }
                return true;
            });
        }

        // Inside "5. Selection Mode Config", filter properties
        const selectionGroup = generalGroup.propertyGroups.find(g => g.caption === "5. Selection Mode Config");
        if (selectionGroup && selectionGroup.properties) {
            selectionGroup.properties = selectionGroup.properties.filter(prop => {
                if (prop.key === "singleSelectStyle") {
                    return values.selectionMode === "single";
                }
                if (
                    prop.key === "tagStyle" ||
                    prop.key === "tagColorExpression" ||
                    prop.key === "showSelectAll" ||
                    prop.key === "selectAllText" ||
                    prop.key === "deselectAllText"
                ) {
                    return values.selectionMode === "multi";
                }
                return true;
            });
        }
    }

    // 2. Find "Aesthetics" group and filter properties
    const aestheticsGroup = defaultProperties.find(g => g.caption === "Aesthetics");
    if (aestheticsGroup && aestheticsGroup.properties) {
        aestheticsGroup.properties = aestheticsGroup.properties.filter(prop => {
            if (prop.key === "customItemContent") {
                return computedSourceMode === "association";
            }
            return true;
        });
    }

    return defaultProperties;
}

export function check(values: PwbComboBoxPreviewProps): Problem[] {
    const errors: Problem[] = [];
    const computedSourceMode = values.source === "database" ? "association" : values.sourceType;

    if (computedSourceMode === "enumeration") {
        if (!values.selectedAttribute) {
            errors.push({
                property: "selectedAttribute",
                severity: "error",
                message: "An Attribute is required when Data Source Type is 'Enumeration'."
            });
        }
    } else if (computedSourceMode === "boolean") {
        if (!values.selectedAttribute) {
            errors.push({
                property: "selectedAttribute",
                severity: "error",
                message: "An Attribute is required when Data Source Type is 'Boolean'."
            });
        }
        if (values.booleanOutputFormat === "string") {
            if (!values.booleanTrueValue) {
                errors.push({
                    property: "booleanTrueValue",
                    severity: "error",
                    message: "True String Value Key is required when Output Value Format is 'String Key Type'."
                });
            }
            if (!values.booleanFalseValue) {
                errors.push({
                    property: "booleanFalseValue",
                    severity: "error",
                    message: "False String Value Key is required when Output Value Format is 'String Key Type'."
                });
            }
        }
    } else {
        // ── Association / Database Mode ──
        if (!values.optionsSource) {
            errors.push({
                property: "optionsSource",
                severity: "error",
                message: "Options Source is required when Data Source is 'Database' or Type is 'Association'."
            });
        }
        if (!values.optionLabel) {
            errors.push({
                property: "optionLabel",
                severity: "error",
                message: "Option Label is required when Data Source is 'Database' or Type is 'Association'."
            });
        }

        if (values.selectionMode === "single") {
            if (!values.selectedAttribute && !values.selectedAssociation) {
                errors.push({
                    property: "selectedAttribute",
                    severity: "error",
                    message: "Please bind either 'Attribute' or 'Selected Association' to save the selected option."
                });
            }
        } else if (values.selectionMode === "multi") {
            if (!values.selectedAttribute && !values.selectedAssociation) {
                errors.push({
                    property: "selectedAssociation",
                    severity: "error",
                    message:
                        "Please bind either 'Selected Association' (ReferenceSet) or 'Attribute' (Delimited String) to save the multiple selections."
                });
            }
        }
    }

    return errors;
}

// export function getPreview(values: PwbComboBoxPreviewProps, isDarkMode: boolean, version: number[]): PreviewProps {
//     // Customize your pluggable widget appearance for Studio Pro.
//     return {
//         type: "Container",
//         children: []
//     }
// }

// export function getCustomCaption(values: PwbComboBoxPreviewProps, platform: Platform): string {
//     return "PwbComboBox";
// }
