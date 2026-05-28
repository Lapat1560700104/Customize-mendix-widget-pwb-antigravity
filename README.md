# Customize Mendix Widget PWB

This repository contains the source code and development environment for custom Mendix Pluggable Widgets. Built using modern JavaScript tools, React, and TypeScript, these widgets are designed to extend the UI and logic capabilities of Mendix Studio Pro.

---

## 📁 Repository Structure (โครงสร้างของ Repository)

```bash
Customize-mendix-widget-pwb-antigravity/
├── README.md               # Repository documentation (this file)
└── pwbDatePicker/          # The custom Mendix Pluggable DatePicker widget
    ├── package.json        # Widget build configurations & npm scripts
    ├── tsconfig.json       # TypeScript configurations
    ├── src/                # Source code (TypeScript, React, CSS)
    └── dist/               # Generated Mendix Widget Packages (.mpk) (after build/release)
```

---

## 🛠️ Getting Started (เริ่มต้นพัฒนา)

### Prerequisites (สิ่งที่ต้องมี)
- **Node.js** (Recommended: LTS version >= 16)
- **Yeoman** & **Mendix Widget Generator** (Already pre-configured globally in your workspace)
  - `npm install -g yo`
  - `npm install -g @mendix/generator-widget`

---

## 💻 Working with the Widget (`pwbDatePicker`)

Navigate to the widget folder to run commands:
```bash
cd pwbDatePicker
```

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Watcher (Development)
Builds the widget and watches for source file changes in real-time:
```bash
npm run dev
```

### 3. Package Widget for Studio Pro (Production Release)
Compiles, optimizes, and bundles the widget into a `.mpk` package:
```bash
npm run release
```
*The output package will be created in `pwbDatePicker/dist/1.0.0/pwb.PwbDatePicker.mpk`.*

---

## 📄 Key Files for Customization

- **Properties Definitions**: To add/edit widget configurations visible in Mendix Studio Pro, edit `pwbDatePicker/src/PwbDatePicker.xml`.
- **Runtime Logic**: To build features using React Function Components & TypeScript, edit `pwbDatePicker/src/PwbDatePicker.tsx`.
- **Styling**: To customize CSS stylings, edit `pwbDatePicker/src/ui/PwbDatePicker.css`.
