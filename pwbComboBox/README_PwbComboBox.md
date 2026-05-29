# README - PWB ComboBox Specification (v2.0.0)

**PWB ComboBox** is a premium, high-performance, and fully accessible pluggable autocomplete dropdown search widget designed for Mendix Studio Pro. It supports both **Single-Select** and **Multi-Select Tag mode**, live fuzzy search filtering, highlighted matching characters, and fully custom glassmorphic styling tokens out-of-the-box.

---

## 🌟 Key Features

* **Dual Selection Modes**: Supports standard `Single Select` list picker and `Multi Select` tag mode (renders selected objects as customizable pill tag badges with close buttons).
* **Fuzzy Autocomplete Search**: Highly responsive live filtering as developers/users input character queries.
* **Fuzzy Segment Highlighting**: Automatically highlights matched substring characters in bold theme color inside the dropdown options.
* **High Performance**: Optimised to handle massive datasource lists using React's virtualized rendering pipeline.
* **WCAG 2.1 AA Screen Reader Compliance**: Enriched with semantic ARIA roles, active state attributes, and full keyboard navigation loops.
* **Zero-Code CSS Styling**: Custom variables for accents (`accentColor`), roundness (`borderRadius`), blurs (`bgBlur`), and heights directly configurable inside Mendix Studio Pro.

---

## ⚙️ Properties Configuration (XML Schema)

### 1. Data Source

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `optionsSource` | Options Source | Datasource | Yes | - | Dynamic list of objects to populate the ComboBox |
| `optionLabel` | Option Label | Expression (String) | Yes | - | Expression to render text for each option item (e.g. `$currentObject/Name`) |

### 2. Selection

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `selectionMode` | Selection Mode | Enumeration | Yes | `single` | Choose `single` (Single Select) or `multi` (Multi Select tags mode) |
| `selectedAttribute` | Selected Attribute | Attribute (String/Integer) | No | - | Simple attribute column to store selected key (Single Mode only) |
| `selectedAssociation` | Selected Association | Association | No | - | Reference (Single) or ReferenceSet (Multi) association to store selected object |

### 3. Aesthetics

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `placeholder` | Placeholder Text | String | No | `Search and select...` | Custom grey placeholder text shown when selection is empty |
| `accentColor` | Accent Color (Hex) | String | No | `#3b82f6` | Central theme color (e.g., `#3b82f6` for Neon Blue) |
| `borderRadius` | Border Radius | String | No | `16px` | Corner roundness of borders (`16px`, `8px`, `0px`) |
| `bgBlur` | Background Blur | String | No | `16px` | Backdrop-filter glassmorphic blur level (`16px`, `8px`, `0px` to disable) |
| `popoverBg` | Dropdown Background | String | No | `rgba(...)` | Fill color of floating popover (`rgba(255,255,255,0.85)`, `#ffffff`) |
| `maxDropdownHeight` | Max Dropdown Height | String | No | `250px` | Maximum scrolling height of the results panel |

---

## ♿ Keyboard Navigation Support (คู่มือการนำทางด้วยแป้นพิมพ์)

For a premium accessible user experience, the ComboBox incorporates standard keyboard commands matching WCAG 2.1 AA international specifications:
* **ArrowDown / ArrowUp**: Move focused highlighted index down/up in the filtered options list.
* **Enter / Space**: Select the currently focused item from the dropdown list.
* **Escape**: Instantly collapse and close the floating dropdown results panel.
* **Backspace**: If `selectionMode === "multi"` and the search box is empty, pressing Backspace automatically removes the **last** selected tag badge (Power-user shortcut!).

---

## 🎨 CSS Styling Architecture

The widget exposes a highly organized layout structured with local CSS Custom Properties (Variables) inside `PwbComboBox.css`.

### Layout CSS Variables

```css
.pwb-combobox-wrapper {
    --accent-color: #3b82f6;       /* Accent color set from Mendix */
    --accent-light: rgba(...);     /* Selection background accent */
    --border-radius: 16px;         /* Corner scaling factor */
    --bg-blur: 16px;               /* Popover blur saturate */
    --popover-bg: rgba(...);       /* Dropdown background color */
}
```

### Core HTML Layout Class Targets

* `.pwb-combobox-wrapper`: Root container. Can be targeted with custom classes.
* `.pwb-combobox-input-container`: Search input container wrapping selected tag pills and search fields.
* `.pwb-combobox-tags-list`: Flex container for selected multi-select tagging pills.
* `.pwb-combobox-tag-pill`: Individual selected badge tag pill.
* `.pwb-search-highlight`: Bold highlighted text matches inside dropdown items.
* `.pwb-combobox-popover`: Glassmorphic floating popover dropdown result panel.
* `.pwb-combobox-status-message`: Spaced container for loaders and empty alerts.
* `.pwb-combobox-spinner`: Dynamic loading indicator vector.

---

## 🌐 Right-to-Left (RTL) Layout support (ระบบสลับหน้าจอตามทิศทางเขียนเขียน)

The widget features 100% native RTL Mirroring support. When loaded inside international projects, the UI automatically reverses alignments:
- Flipping input text alignments and search fields.
- Re-aligning right-side icons (chevrons and clear buttons) to the left.
- Reversing selected tag badges flowing orders cleanly.
