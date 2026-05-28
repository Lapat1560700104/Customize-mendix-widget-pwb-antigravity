# PWB Advanced DatePicker 📅🚀

Premium high-performance Date and Range Picker pluggable widget with Thai Buddhist Era (พ.ศ.) support, interactive time selectors, weekend disabling, and dynamic min/max date constraints.

---

## 📁 Project Structure (โครงสร้างไฟล์ในโปรเจค)

```bash
pwbCustomWidget/
├── tsconfig.json          # TypeScript configurations
├── package.json           # Package details, npm scripts, and Mendix settings
├── src/                   # Main development source folder
│   ├── package.xml        # Packing configuration for the Mendix Pluggable Widget (.mpk)
│   ├── PwbCustomWidget.xml # Widget properties configuration for Mendix Studio Pro
│   ├── PwbCustomWidget.tsx # Main React container connecting to Mendix props
│   ├── PwbCustomWidget.editorPreview.tsx # React preview for Mendix page builder
│   ├── PwbCustomWidget.editorConfig.ts   # Property validations for Mendix editor
│   ├── components/
│   │   └── DatePicker.tsx # Core calendar, date range, and time picker logic
│   └── ui/
│       └── PwbCustomWidget.css  # Widget premium glassmorphic stylings
```

---

## 🛠️ Getting Started (ขั้นตอนการติดตั้งและรันโปรเจค)

### 1. Install Dependencies
Run inside the `pwbCustomWidget` folder:
```bash
npm install
```

### 2. Development Mode (โหมดพัฒนา)
To run a local watch server that automatically recompiles your code whenever you make a change:
```bash
npm run dev
```

### 3. Production Release & Bundling (สร้างแพ็กเกจนำไปใช้จริง)
To package the widget into an optimized, lightweight `.mpk` package:
```bash
npm run release
```
The compiled package will be generated inside the `dist/` directory:
`dist/1.0.0/pwb.PwbCustomWidget.mpk` (~14.5 KB)

---

## ✨ Features & Constraints (ฟังก์ชันการใช้งาน)

- **Selection Modes**: Supports standard `Single Date` selection or start/end `Date Range` picker.
- **Thai Buddhist Era (พ.ศ.)**: Toggle between A.D. and B.E. years display (+543 Offset). Internally stores Gregorian Dates.
- **Show Time Selection**: Hours and Minutes sliders for custom time picking.
- **Dynamic Constraints**:
  - `Min Date` constraint (DateTime Expression)
  - `Max Date` constraint (DateTime Expression)
  - `Disable Weekends` (Saturdays & Sundays locked)
- **High-End Styling**: Premium HSL harmonies, frosted glass blurs, subtle glowing shadows, and micro-animations for month-switching.
