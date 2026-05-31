# PWB ComboBox 📅🚀 (v3.7.0)

**PWB ComboBox** is a premium, high-performance, and fully customizable pluggable widget designed for Mendix Studio Pro. It delivers a modern, glassmorphic dropdown search autocomplete interface with full native support for **Single-Select** (featuring text, pill, or rich selection styles) and **Multi-Select Tag mode**, highlighted fuzzy search segments, collapsible grouping, customized alphabetical sorting, left checkboxes, multi-shape avatars, dual vertical-list/grid layouts, WCAG 2.1 AA screen-reader compliance, and zero-code style configurations.

---

## 📁 Project File Structure (โครงสร้างไฟล์ในโปรเจกต์)

```bash
pwbComboBox/
├── tsconfig.json          # TypeScript compilation parameters
├── package.json           # Package details and dependencies
├── playground/            # Interactive local web playground for developer live-testing
│   ├── index.html         # Web page template for the playground canvas
│   ├── vite.config.ts     # Vite compilation rules (Port 3001)
│   └── main.tsx           # React simulation panel with sidebar properties sliders
├── src/                   # Main development source folder
│   ├── package.xml        # Packing configuration for the Mendix Pluggable Widget (.mpk)
│   ├── PwbComboBox.xml    # Widget Properties configuration visible inside Mendix Studio Pro
│   ├── PwbComboBox.tsx    # Main React wrapper container connecting Mendix attributes
│   ├── PwbComboBox.editorPreview.tsx # React preview for Mendix Studio Pro page builder
│   ├── PwbComboBox.editorConfig.ts   # Property validation constraints for Mendix editor
│   ├── components/
│   │   └── ComboBox.tsx   # Core search, autocomplete, highlight, and tagging logic
│   └── ui/
│       └── PwbComboBox.css # Widget premium layout styling and design tokens
```

---

## 🛠️ Developer Lifecycle Commands (คู่มือรันพัฒนาและสร้างชิ้นงาน)

We have established a comprehensive developer workflow:

### 1. Install Dependencies

Navigate to the `pwbComboBox` directory and run:

```bash
npm install
```

### 2. Standalone Testing Playground (แผงทดสอบจำลอง - แนะนำ!)

To launch the interactive **Vite Properties Simulator Dashboard** locally in your browser in milliseconds:

```bash
npm run playground
```

_This starts a local dev server at `http://localhost:3001/` and opens it in your default browser. It allows you to
toggle and simulate Mendix properties (Selection Modes, Accent Colors, Loading state, Read Only state, and Translations)
dynamically and see how the ComboBox updates in real-time without having to compile an `.mpk` or launch Mendix!_

### 3. Standalone Code Compilation (ตรวจเช็คโค้ด)

To run typescript checks and format all files cleanly using Prettier:

```bash
npm run lint:fix
```

### 4. Compile Mendix Production Package (สร้างไฟล์ .mpk ไปยัง Mendix)

To compile and package the production widget cleanly:

```bash
npm run release
```

_This automatically builds the production JavaScript bundles, runs validations, packages everything into
`pwb.PwbComboBox_3.2.0_...mpk` inside `dist/`, and copies the dated/timed package straight into your Mendix project's
`widgets/` folder!_

---

## ⚙️ Properties Configuration Summary (v3.7.0 specs)

-   **sourceMode**: Data Source Mode: Association (Entity Datasource), Enumeration Attribute, or Boolean Attribute.
-   **selectedAttribute**: Primary binding attribute to store/retrieve selections (supports String, Integer, Enum, Boolean).
-   **selectedAssociation**: Reference/ReferenceSet association for database object mapping.
-   **booleanTrueLabel / booleanFalseLabel**: Custom display text for True/False (e.g. Yes/No, Active/Inactive) in Boolean Mode.
-   **booleanOutputFormat**: Save native `Boolean` type or custom `String Keys` (e.g., `'Y'`/`'N'`).
-   **optionsSource**: Dynamic database list of options to populate the dropdown (in Association Mode).
-   **optionLabel**: Text expression to display for each option item.
-   **enableGrouping**: Enable/disable collapsible category grouping inside dropdown list options.
-   **highlightColorMode**: Highlight hovered items with global `accent` color or dynamic unique `optionColor` (which is automatically computed via stable HSL coloring in Enum/Boolean modes).
-   **Aesthetics & Virtualization**: CSS styling variables (blur power, popover background fill, accent Hex color, maximum scrolling height) and DOM node virtualization are fully integrated straight from Mendix parameters.
