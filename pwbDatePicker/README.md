# PWB Advanced DatePicker 📅🚀 (v1.0.5)

**PWB Advanced DatePicker** is a premium, high-performance pluggable widget designed for Mendix Studio Pro. It delivers a modern, glassmorphic date and range selection interface with full native support for **Thai Buddhist Era (พ.ศ.)**, dynamic date formatting, direct boundary-limited numerical time selection, custom validation, and zero-code CSS customization properties.

---

## 📁 Project File Structure (โครงสร้างไฟล์ในโปรเจกต์)

```bash
pwbDatePicker/
├── tsconfig.json          # TypeScript compilation parameters
├── package.json           # Package details, npm workspaces config, and scripts
├── playground/            # Standing interactive test dashboard & simulator
│   ├── index.html         # Developer testing website entrypoint
│   ├── main.tsx           # React dashboard combining properties simulator and canvas
│   └── vite.config.ts     # Super-fast Vite compiler server configuration
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

## 🛠️ Developer Lifecycle Commands (คู่มือรันพัฒนาและสร้างชิ้นงาน)

We have established a comprehensive, ultra-fast developer workflow:

### 1. Install Dependencies

Navigate to the `pwbDatePicker` directory and run:

```bash
npm install
```

### 2. Standalone Testing Playground (แผงทดสอบจำลอง - แนะนำ!)

To launch the interactive **Vite Properties Simulator Dashboard** locally in your browser in milliseconds:

```bash
npm run playground
```

*This starts a local dev server at `http://localhost:3000/` and opens it in your default browser. It allows you to toggle Mendix properties (Selection Mode, Accent Colors, Time Picker, and Translations) dynamically and see how the DatePicker updates in real-time without having to compile an `.mpk` or launch Mendix!*

### 3. Development Mode (โหมดซิงค์เชื่อมต่อ Mendix)

Builds the widget and watches for source file changes in real-time. Changes are hot-compiled and automatically synced into your Mendix app's widgets folder:

```bash
npm run dev
```

### 4. Production Release & Bundling (บิวด์เพื่อนำไปใช้จริง)

Compiles, lint-checks, minifies, and packages the widget into an optimized, lightweight `.mpk` package:

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

---

## 🌐 Mendix Batch Translate Compatibility (รองรับระบบระบบหลายภาษา)

The widget features an integrated `"Translations"` property group, making it **100% compatible** with Mendix Studio Pro's **Batch Translate** and **Language Manager**:

- Exposes 7 customizable string fields: `timeLabel`, `todayPresetLabel`, `clearPresetLabel`, `selectMonthLabel`, `last7DaysPresetLabel`, `last30DaysPresetLabel`, `thisMonthPresetLabel`.
- Provides built-in premium bilingual fallbacks (Thai/English) if Mendix properties are left blank, ensuring visual stability.
- Allows developers to manage all user-facing widget text centrally via Mendix's native translation tables.

---

## 🎨 Dynamic Icon Selection & Custom Uploads (ระบบไอคอนปรับเปลี่ยนได้ตามต้องการ)

In addition to translation controls, the widget now features **Dynamic Calendar Icon selection** natively inside Mendix's properties:

- **Custom Calendar Icon Property**: Exposes `calendarIcon` (type `icon`) under the **Aesthetics** property group.
- **Support Formats**: Fully supports Mendix standard Glyphicons, FontAwesome glyphs, as well as **custom uploaded images (SVG, PNG, JPG)**.
- **SVG Upload Support**: Highly recommended for crisp scaling at Retina/4K resolutions.

### 1. วิธีใช้และอัพโหลดไอคอนของคุณเองใน Mendix Studio Pro (การใช้งานจริง)

เมื่อคุณนำ Widget นี้ไปใช้ในโครงการ Mendix คุณสามารถอัพโหลดไอคอนของตัวเองขึ้นไปใช้ได้ทันทีผ่านขั้นตอนปกติของ Mendix Studio Pro:

#### อัพโหลดรูปภาพของตัวเอง (SVG / PNG / JPG)

- **สร้าง Image Collection** ขึ้นมาในโมดูลของแอป Mendix (หรือใช้ Image Collection ที่มีอยู่แล้ว)
- **อัพโหลดรูปไอคอนของคุณ**เข้าไปเก็บไว้ใน Image Collection นั้น (แนะนำอย่างยิ่งให้ใช้ไฟล์ `.svg` เพราะจะคมชัดและย่อขยายขนาดได้สวยงามโดยไม่แตก หรือสามารถใช้ไฟล์ `.png` แบบพื้นหลังโปร่งใส ก็ได้เช่นกัน)
- **ดับเบิลคลิกที่วิดเจ็ต PwbDatePicker** บนหน้า Page ของ Mendix จากนั้นที่หัวข้อ Custom Calendar Icon ในแท็บ Aesthetics ให้คลิกปุ่ม Select
- **เลือกรูปภาพจาก Image Collection**ที่คุณอัพโหลดไว้ได้ทันทีครับ! ตัววิดเจ็ตจะประมวลผลและปรับขนาดการแสดงผลลงไปในปุ่มกดให้สวยงามพอดีโดยอัตโนมัติ

#### เลือกใช้ไอคอนระบบมาตรฐาน (Glyphicon / FontAwesome)

- นอกเหนือจากการอัพโหลดรูปภาพเองแล้ว หากคุณต้องการใช้ไอคอนสัญลักษณ์ทั่วไป คุณก็สามารถเลือกจากชุดไอคอนมาตรฐานของ Mendix หรือไอคอนจาก FontAwesome ผ่านหน้าต่างเลือกไอคอนแบบปกติได้ทันทีด้วยเช่นกันครับ

### 2. การรันตรวจสอบการทำงานไอคอนบนหน้า Playground Simulator (แบบ Local)

- หน้าจอจำลอง **Vite Playground** (ที่เปิดด้วยคำสั่ง `npm run playground` ที่ `http://localhost:3000/`) ได้รับการติดตั้ง **สวิตช์จำลองไอคอนแบบสไตล์ SVG 5 Preset** (Default, Rounded Calendar, Clock, User, Checkmark) เพื่อให้นักพัฒนาสามารถทดลองกดเลือกดูการดัดแปลงและขนาดสเกลของรูปกล่องข้อความได้แบบสด ๆ ทันทีโดยไม่ต้องรัน Mendix App!

- หากคุณมี SVG ใหม่ที่อยากนำมาเทสใน Playground คุณสามารถแก้สโคดเวกเตอร์เพิ่มได้โดยตรงในไฟล์ [playground/main.tsx](file:///Users/lapat.ta/Desktop/ETC%20Project/Customize-mendix-widget-pwb-antigravity/pwbDatePicker/playground/main.tsx) (บรรทัดที่ 38)

---

## 🌐 Dynamic String & DateTime Dual-Attribute Support (v1.2.0)

Widget รุ่น **v1.2.0** เพิ่มขีดความสามารถการผูกแอตทริบิวต์ได้อย่างอิสระ ทั้งประเภท **DateTime** และ **String** เพื่อลดความซับซ้อนในการเขียน Microflow/Nanoflow สำหรับแปลงค่าใน Mendix

### 1. กฏเกณฑ์การแปลงค่าและการบันทึก (Data Integration Rules)

* **เมื่อผูกกับแอตทริบิวต์ประเภท `DateTime`**:
  * ระบบจะดึงค่าเริ่มต้นและบันทึกค่าที่ผู้ใช้เลือกในรูปแบบออบเจกต์ `Date` มาตรฐานของ JavaScript/Mendix โดยตรง (พฤทีดั้งเดิม)
* **เมื่อผูกกับแอตทริบิวต์ประเภท `String`**:
  * **ขาออก (Serialization)**: เมื่อผู้ใช้คลิกเลือกวันที่บนปฏิทิน ตัว Widget จะนำข้อมูลวันที่นั้นไปแปลงเป็นข้อความ (`String`) จัดฟอร์แมตอัตโนมัติตามแพทเทิร์นที่ระบุในหัวข้อ **Date Format** (เช่น `"DD/MM/YYYY hh:mm"` หรือ `"YYYY-MM-DD"`) และคำนวณตามปีศักราชที่เปิดใช้งาน (เช่น พ.ศ. หรือ ค.ศ.) ก่อนส่งกลับไปบันทึกยัง Entity ใน Mendix
  * **ขาเข้า (Hydration)**: เมื่อเริ่มต้นโหลด Widget ขึ้นมาแสดงผล ระบบจะสแกนข้อความ String เริ่มต้น และแปลง (Parse) ค่ากลับมาเป็นโครงสร้าง `Date` เพื่อป้อนค่าตารางปฏิทินให้ทำงานได้อย่างถูกต้องแม่นยำ โดยหากเป็นข้อความศักราช พ.ศ. (B.E.) ระบบจะคำนวณหักลบ `-543` ปีกลับมาเป็นโครงสร้าง ค.ศ. (A.D.) ภายในคอมโพเนนต์โดยอัตโนมัติ

### 2. ฟอร์แมต Token ที่รองรับการประมวลผล (Supported Custom Date-Time Tokens)

คุณสามารถป้อนแพทเทิร์นการแปลงวันที่ลงในคุณสมบัติ **Date Format** ภายใต้แถบ Aesthetics ได้ตามต้องการ โดยระบบรองรับโครงสร้างต่อไปนี้:
* `DD`: แสดงเลขวันที่แบบมีศูนย์นำหน้า (01 - 31)
* `MM`: แสดงเลขเดือนแบบมีศูนย์นำหน้า (01 - 12)
* `YYYY`: แสดงเลขปีคริสต์ศักราช (ค.ศ.) หรือพุทธศักราช (พ.ศ.) แบบ 4 หลัก (เช่น 2026 หรือ 2569)
* `YY`: แสดงเลขปีแบบย่อ 2 หลัก (เช่น 26 หรือ 69)
* `hh`: แสดงชั่วโมงในระบบ 24 ชั่วโมงแบบมีศูนย์นำหน้า (00 - 23)
* `mm`: แสดงนาทีแบบมีศูนย์นำหน้า (00 - 59)

*หมายเหตุ: หากแปลงค่าล้มเหลวหรือไม่ตรงฟอร์แมตที่ระบุ ตัวดักจับข้อผิดพลาดเชิงรับ (Defensive Parser Fallback) จะทำการแปลงค่าข้อความผ่านฟังก์ชัน `Date.parse(value)` มาตรฐานของเว็บบราวเซอร์อัตโนมัติเพื่อป้องกันข้อมูลสูญหาย*
