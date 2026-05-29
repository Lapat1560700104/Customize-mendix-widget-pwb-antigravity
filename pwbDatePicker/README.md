# PWB Advanced DatePicker 📅🚀 (v1.0.5)

**PWB Advanced DatePicker** is a premium, high-performance pluggable widget designed for Mendix Studio Pro. It delivers a modern, glassmorphic date and range selection interface with full native support for **Thai Buddhist Era (พ.ศ.)**, dynamic date formatting, direct boundary-limited numerical time selection, custom validation, and zero-code CSS customization properties.

---

## 📁 Project File Structure (โครงสร้างไฟล์ในโปรเจกต์)

```bash
pwbDatePicker/
├── tsconfig.json          # TypeScript compilation parameters
├── package.json           # Package details, npm workspaces config, and scripts
├── src/                   # Main development source folder
│   ├── package.xml        # Packing configuration for the Mendix Pluggable Widget (.mpk)
│   ├── PwbDatePicker.xml  # Widget Properties configuration visible inside Mendix Studio Pro
│   ├── PwbDatePicker.tsx  # Main React wrapper container connecting Mendix attributes
│   ├── PwbDatePicker.editorPreview.tsx # React preview for Mendix Studio Pro page builder
│   ├── PwbDatePicker.editorConfig.ts   # Property validation constraints for Mendix editor
│   ├── components/
│   │   └── DatePicker.tsx # Core calendar, date range selection, presets, and time logic
│   └── ui/
│       └── PwbDatePicker.css  # Widget premium layout styling and design tokens
```

---

## 🛠️ Getting Started (ขั้นตอนการติดตั้งและรันพัฒนา)

### 1. Install Dependencies

Navigate to the `pwbDatePicker` directory and run:

```bash
npm install
```

### 2. Development Mode (โหมดพัฒนา)

Builds the widget and watches for source file changes in real-time. Changes are hot-compiled into your Mendix app widgets folder:

```bash
npm run dev
```

### 3. Production Release & Bundling (บิวด์เพื่อนำไปใช้จริง)

Compiles, lint-checks, minifies, and packages the widget into an optimized `.mpk` package:

```bash
npm run release
```

*The output package will be generated inside `dist/1.0.5/pwb.PwbDatePicker_1.0.5_YYYYMMDD_HHMMSS.mpk` and automatically copied to your Mendix project's `widgets/` folder.*

---

## ✨ Core Features & Constraints (ฟังก์ชันการใช้งานหลัก)

- **Selection Modes**: Supports standard `Single Date` selection or start/end `Date Range` picker.
- **Thai Buddhist Era (พ.ศ.)**: Toggle between A.D. and B.E. years display (+543 Offset) dynamically on the fly. Internally stores standard Gregorian Dates.
- **Numerical Time Input (HH:MM)**: Direct, high-precision boundary inputs ($0 \le \text{Hour} \le 23$ and $0 \le \text{Minute} \le 59$) replacing sluggish slider inputs.
- **Dynamic Constraints**:
  - `Min Date` constraint (DateTime Expression check)
  - `Max Date` constraint (DateTime Expression check)
  - `Disable Weekends` (Blocks Saturdays & Sundays)
- **High-End Glassmorphism**: Supports CSS custom variables (`--accent-color`, `--border-radius`, `--bg-blur`, `--popover-bg`) editable straight from Mendix Studio Pro properties.

---

## 🔥 5 Ultra-Wow Premium Upgrades (ฟังก์ชันพรีเมียมที่อัปเดตใหม่)

We have recently upgraded the widget's UX and aesthetics with 5 major premium features:

### 1. Airbnb-Style Visual Pill Range Selection (แถบเลือกช่วงวันที่ต่อกันไร้รอยต่อ)

- **What it does**: When selecting a date range, the day boxes merge into a continuous, sleek colored banner. The start date has a rounded left edge, the end date has a rounded right edge, and in-between dates connect seamlessly without gaps.
- **Hover effects**: The visual pill adjusts dynamically while you hover your cursor to choose the range end.

### 2. Sleek SVG Chevrons for Navigation (ไอคอนเปลี่ยนเดือนเส้นเวกเตอร์แบบบาง)

- **What it does**: Replaced standard text arrows (`<` and `>`) with minimalist, modern SVG Chevron icons that smoothly scale up on mouse hover for a high-end desktop feel.

### 3. Month & Year Quick Jump Grids (แผงตารางเลือกเดือนและปีด่วน)

- **What it does**: Clicking on the month or year name in the calendar header switches the display into a **3x4 Month Select Grid** or **3x4 Year Select Grid** (with `<<` and `>>` fast-scroll wrappers to skip years by 12).
- **Benefit**: Resolves the classic pain point of clicking month navigation arrows dozens of times to select far-away dates.

### 4. Fluid Month Slide Animations (แอนิเมชันเปลี่ยนเดือนแบบสไลด์ข้าง)

- **What it does**: Changing months triggers an elegant horizontal sliding keyframe transition (`slideLeftIn` / `slideRightIn`) matching the user's click direction for a natural, fluid interface flow.

### 5. Arrow Key Keyboard Navigation (การควบคุมปฏิทินผ่านแป้นพิมพ์)

- **What it does**: Full accessibility navigation using keyboard arrows (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`) to move focus around calendar days. Displays a visually distinct flashing focus ring (`.pwb-day-focused`) and supports pressing `Enter` or `Space` to confirm selection, and `Escape` to close.
