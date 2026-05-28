# PwbCustomWidget 🚀

Custom pluggable widget developed with React and TypeScript. This widget is built using modern JavaScript tools and is fully optimized for Mendix Studio Pro.

---

## 📁 Project Structure (โครงสร้างไฟล์ในโปรเจค)

```bash
pwbCustomWidget/
├── tsconfig.json          # TypeScript configurations
├── package.json           # Package details, npm scripts, and Mendix settings
├── src/                   # Main development source folder
│   ├── package.xml        # Packing configuration for the Mendix Pluggable Widget (.mpk)
│   ├── PwbCustomWidget.xml # Widget properties configuration for Mendix Studio Pro
│   ├── PwbCustomWidget.tsx # Main React runtime component
│   ├── PwbCustomWidget.editorPreview.tsx # React preview for Mendix page builder
│   ├── PwbCustomWidget.editorConfig.ts   # Property validations for Mendix editor
│   ├── components/
│   │   └── HelloWorldSample.tsx # Custom React sub-components
│   └── ui/
│       └── PwbCustomWidget.css  # Widget custom styles
```

---

## 🛠️ Getting Started (ขั้นตอนการติดตั้งและรันโปรเจค)

### 1. Install Dependencies (ติดตั้งโมดูลที่เกี่ยวข้อง)
Ensure you have **Node.js** installed, then run inside the widget root folder:
```bash
npm install
```

### 2. Development Mode (โหมดพัฒนา)
To run a local watch server that automatically recompiles your code whenever you make a change:
```bash
npm run dev
```
*(Or use `npm start` to run the widget package watcher).*

### 3. Production Release & Bundling (สร้างแพ็กเกจนำไปใช้จริง)
To package the widget into a production-ready `.mpk` file:
```bash
npm run release
```
The compiled `.mpk` package will be generated inside the `dist/` directory (e.g. `dist/1.0.0/PwbCustomWidget.mpk`). You can copy this file directly into the `widgets/` folder of your target Mendix project.

---

## ✨ Features & Architecture

- **React Functional Components & Hooks**: Modern component structure for high performance and maintainable UI state management.
- **Strict TypeScript (TSX)**: Full type safety, auto-completion, and developer-friendly IDE integration.
- **Tailored CSS Styling**: Clean UI design utilizing vanilla CSS modules under `src/ui/`.
- **Mendix Pluggable Widget Compliant**: Seamlessly integrates into Mendix Studio Pro page builders.

---

## 💡 Developer Tips

- **Customizing properties**: If you need to add custom fields, text inputs, drop-downs, or data sources visible in Mendix Studio Pro, configure them in `src/PwbCustomWidget.xml`.
- **Styling**: Add your styles in `src/ui/PwbCustomWidget.css`. Mendix automatically bundles and loads this CSS when the widget is rendered.
