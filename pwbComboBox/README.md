# PWB ComboBox 📅🚀 (v3.10.0)

**PWB ComboBox** is a premium, high-performance, and fully customizable pluggable widget designed for Mendix Studio Pro. It delivers a modern, glassmorphic dropdown search autocomplete interface with full native support for **Single-Select** (featuring text, pill, or rich selection styles) and **Multi-Select Tag mode**, restructured to match the **native Mendix Studio Pro properties sheet 100%** with dedicated **General**, **Events** (including native `onChange`, `onEnter`, `onLeave`, and dynamic `onFilterChange` text updates!), and **Advanced** search matching tabs!

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

### 2. Interactive Testing Playground (แผงทดสอบจำลอง - แนะนำ!)

To launch the interactive **Vite Properties Simulator Dashboard** locally in your browser:

```bash
npm run playground
```

_This starts a local dev server at `http://localhost:3001/` and opens it in your default browser. It allows you to toggle and simulate Mendix properties (Source, Type, Custom Boolean keys, Selection Modes, and new **Advanced Search Matching Algorithms**) dynamically. It also contains a real-time **Widget Events Log** feed displaying focused/blurred/changed actions in real-time as you play!_

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

_This automatically builds the production JavaScript bundles, runs validations, packages everything into `pwb.PwbComboBox_3.10.0_...mpk` inside `dist/`, and copies the dated/timed package straight into your Mendix project's `widgets/` folder!_

---

## ⚙️ Properties Configuration Summary (v3.10.0 specs)

- **sourceMode**: Data Source Mode: `association` (Association / Entity Datasource), `enumeration` (Enumeration Attribute), or `boolean` (Boolean Attribute).
- **selectedAttribute**: Attribute selection, matched to the caption **"Attribute"** in Mendix Studio Pro.
- **selectedAssociation**: Reference/ReferenceSet association for database object mapping.
- **onChangeAction**: Native event handler triggered instantly when a selection is modified or cleared.
- **onEnterAction**: Focus event handler triggered when the search box receives focus.
- **onLeaveAction**: Focus event handler triggered when the search box loses focus (entirely leaves the widget).
- **onFilterChangeAction**: Real-time action triggered as the user types search queries.
- **filterAttribute**: Optional String attribute to synchronize the typed search query before calling `onFilterChangeAction`.
- **searchMethod**: Matching algorithms under Advanced tab (`contains`, `startsWith`, `endsWith`, `equals`, `fuzzy`).
- **searchCaseSensitive**: Case-sensitive search toggle under Advanced tab.
- **maxSearchResults**: Display limit parameter under Advanced tab to protect DOM rendering when loading massive lists.
- **enableGrouping**: Enable/disable collapsible category grouping inside dropdown list options.
- **Aesthetics & Virtualization**: CSS styling variables (blur power, popover background fill, accent Hex color, maximum scrolling height) and DOM node virtualization are fully integrated straight from Mendix parameters.
