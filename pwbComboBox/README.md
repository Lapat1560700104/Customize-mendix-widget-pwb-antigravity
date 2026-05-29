# PWB ComboBox 📅🚀 (v2.0.0)

**PWB ComboBox** is a premium, high-performance pluggable widget designed for Mendix Studio Pro. It delivers a modern,
glassmorphic dropdown search autocomplete interface with full native support for **Single-Select** and **Multi-Select
Tag mode**, highlighted search segments, WCAG 2.1 AA screen-reader compliance, and zero-code CSS configurations.

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
`pwb.PwbComboBox_1.0.5_...mpk` inside `dist/`, and copies the dated/timed package straight into your Mendix project's
`widgets/` folder!_

---

## ⚙️ Properties Configuration Summary

-   **optionsSource**: Dynamic list of objects to populate the dropdown.
-   **optionLabel**: Text expression to display for each option item.
-   **selectionMode**: Choose between `Single Select` and `Multi Select` tags mode.
-   **selectedAttribute**: Attribute to store single selected value (String/Integer).
-   **selectedAssociation**: Reference/ReferenceSet association to store selected object(s).
-   **Aesthetic Parameters**: Corner roundness (`Border Radius`), backdrop-blur (`Background Blur`), and colors
    customizable straight from Mendix.
