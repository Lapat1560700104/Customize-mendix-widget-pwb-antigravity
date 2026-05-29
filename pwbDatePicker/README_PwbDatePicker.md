# README - PWB Advanced DatePicker Specification (v1.0.5)

**PWB Advanced DatePicker** is a premium, high-performance pluggable widget designed for Mendix Studio Pro. It delivers a modern, glassmorphic date and range selection interface with full native support for **Thai Buddhist Era (พ.ศ.)**, dynamic date formatting, direct numerical time selection, custom validation, and zero-code CSS configurations.

---

## 🌟 Key Features

* **Dual Selection Modes**: Supports both `Single Date` selection and `Date Range` (Start/End) selection in a single, fluid component.
* **Thai Buddhist Era (พ.ศ.)**: Supports displaying years in the Thai Buddhist Era offset (+543 years) with a live switch button on the calendar popover.
* **Direct Numerical Time Input (HH:MM)**: Elegant numerical inputs with boundary limitations ($0 \le \text{Hour} \le 23$, $0 \le \text{Minute} \le 59$) replacing inaccurate range sliders.
* **Dynamic Date Formatting**: Custom token parsing (`DD`, `MM`, `YYYY`, `YY`, `hh`, `mm`) to match localized formatting standards.
* **Zero-Code Aesthetic Parameters**: Corner roundness (`Border Radius`), glassmorphism backdrop-blur (`Background Blur`), and color configurations (`Popover Background`) customizable straight from Mendix.
* **Comprehensive Validations**: Seamless support for Mendix native microflow validations, required-field checks, and custom Boolean validation rules.

---

## ⚙️ Properties Configuration (XML Schema)

### 1. General

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `selectionMode` | Selection Mode | Enumeration | Yes | `single` | Selection mode: `single` (Single Date) or `range` (Date Range) |
| `dateAttribute` | Date Attribute | Attribute (DateTime) | No | - | Datetime attribute for storing date in `single` mode |
| `startDateAttribute` | Start Date Attribute | Attribute (DateTime) | No | - | Datetime attribute for range start date |
| `endDateAttribute` | End Date Attribute | Attribute (DateTime) | No | - | Datetime attribute for range end date |

### 2. Features

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `showTime` | Show Time Picker | Boolean | Yes | `false` | Enable numerical time picker input fields |
| `buddhistEra` | Thai Buddhist Year (พ.ศ.) | Boolean | Yes | `false` | Default calendar view to Thai Buddhist Era (adds 543 year offset) |
| `showPresets` | Show Presets Panel | Boolean | Yes | `true` | Show quick select shortcuts (e.g. Today, Last 7 Days, This Month) |
| `showEraToggle` | Show Live Era Switch | Boolean | Yes | `true` | Show interactive "พ.ศ. / ค.ศ." live switch in calendar header |

### 3. Constraints

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `minDate` | Min Date | Expression (DateTime) | No | - | Minimum date allowed to select |
| `maxDate` | Max Date | Expression (DateTime) | No | - | Maximum date allowed to select |
| `disableWeekends` | Disable Weekends | Boolean | Yes | `false` | Disallow users from picking Saturdays and Sundays |

### 4. Aesthetics

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `placeholder` | Placeholder Text | String | No | `Select date...` | Text shown when no date value is selected |
| `accentColor` | Accent Color (Hex) | String | No | `#3b82f6` | Central theme color (e.g. `#3b82f6` for Neon Blue) |
| `dateFormat` | Date Format | String | No | `DD/MM/YYYY` | Custom formatting format (`DD`, `MM`, `YYYY`, `YY`, `hh`, `mm`) |
| `borderRadius` | Border Radius | String | No | `16px` | Roundness of input borders & popover calendar (`16px`, `8px`, `0px`) |
| `bgBlur` | Background Blur | String | No | `16px` | Backdrop-filter glassmorphic blur power (`16px`, `8px`, `0px`) |
| `popoverBg` | Calendar Background Color | String | No | `rgba(...)` | Fill color of popover pop-up (`rgba(255,255,255,0.85)`, `#ffffff`) |
| `calendarIcon` | Custom Calendar Icon | Icon | No | - | Custom Mendix Icon (Glyphicon, FontAwesome, or uploaded SVG/Image) |

### 5. Validation

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `required` | Is Required | Boolean | Yes | `false` | Enforce required-field checking inside the widget |
| `requiredMessage` | Validation Error Message | String | No | `This field is required.`| Message displayed when required field is empty |
| `validationExpression` | Custom Validation Rule | Expression (Boolean) | No | - | Mendix expression returning Boolean. Must evaluate to True to be valid |
| `customValidationMessage` | Custom Validation Message | String | No | `Date selection...` | Custom alert message displayed when Custom Validation Rule returns False |

### 6. Translations (Batch Translate)

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `timeLabel` | Time Picker Label | String | No | `เวลา / Time (HH:MM):` | Label displayed in the custom time picker section |
| `todayPresetLabel` | Today Preset Button Label | String | No | `วันนี้ (Today)` | Label for the Today shortcut preset button |
| `clearPresetLabel` | Clear Preset Button Label | String | No | `ล้างค่า (Clear)` | Label for the Clear/Reset shortcut button |
| `selectMonthLabel` | Select Month View Title | String | No | `เลือกเดือน / Select Month` | Header title displayed in the month selection view |
| `last7DaysPresetLabel` | Last 7 Days Preset Label | String | No | `7 วันล่าสุด` | Label for the 7 Days range shortcut button |
| `last30DaysPresetLabel` | Last 30 Days Preset Label | String | No | `30 วันล่าสุด` | Label for the 30 Days range shortcut button |
| `thisMonthPresetLabel` | This Month Preset Label | String | No | `เดือนนี้` | Label for the This Month range shortcut button |

---

## 🎨 CSS Styling Architecture

The widget exposes a highly organized layout structured with local CSS Custom Properties (Variables) inside `PwbDatePicker.css`.

### Layout CSS Variables

```css
.pwb-datepicker-wrapper {
    --accent-color: #3b82f6;       /* Accent color set from Mendix */
    --accent-light: rgba(...);     /* Selection background accent */
    --border-radius: 16px;         /* Corner scaling factor (Calculates relative borders) */
    --bg-blur: 16px;               /* Popover blur saturate */
    --popover-bg: rgba(...);       /* Calendar background color */
}
```

### Core HTML Layout Class Targets

* `.pwb-datepicker-wrapper`: Root container. Can be targeted with custom classes.
* `.pwb-datepicker-input`: Input box container.
* `.pwb-datepicker-input.pwb-input-error`: Input box when active validation fails (adds glowing red border).
* `.pwb-datepicker-popover`: Floating dropdown calendar calendar card.
* `.pwb-calendar-day`: Individual date slot.
* `.pwb-day-selected`: Selected active day slot.
* `.pwb-day-in-range`: Days contained within start/end range bounds.
* `.pwb-time-input-field`: Direct numerical HH/MM text entry fields.
* `.pwb-era-btn-active`: Live Era Toggle active switch states.
* `.pwb-validation-message`: Slide-down red validation warning alerts.
* `.pwb-custom-calendar-icon`: Styled wrapper for the custom calendar icon container.

---

## 🎨 คู่มือการอัปโหลดและใช้งานไอคอนปฏิทินของตนเอง (Custom Icon Guide)

### 1. วิธีใช้และอัพโหลดไอคอนของคุณเองใน Mendix Studio Pro (การใช้งานจริง)

เมื่อคุณนำ Widget นี้ไปใช้ในโครงการ Mendix คุณสามารถอัพโหลดไอคอนของตัวเองขึ้นไปใช้ได้ทันทีผ่านขั้นตอนปกติของ Mendix Studio Pro:

#### อัพโหลดรูปภาพของตัวเอง (SVG / PNG / JPG)

* **สร้าง Image Collection** ขึ้นมาในโมดูลของแอป Mendix (หรือใช้ Image Collection ที่มีอยู่แล้ว)

* **อัพโหลดรูปไอคอนของคุณ**เข้าไปเก็บไว้ใน Image Collection นั้น (แนะนำอย่างยิ่งให้ใช้ไฟล์ `.svg` เพราะจะคมชัดและย่อขยายขนาดได้สวยงามโดยไม่แตก หรือสามารถใช้ไฟล์ `.png` แบบพื้นหลังโปร่งใส ก็ได้เช่นกัน)
* **ดับเบิลคลิกที่วิดเจ็ต PwbDatePicker** บนหน้า Page ของ Mendix จากนั้นที่หัวข้อ Custom Calendar Icon ในแท็บ Aesthetics ให้คลิกปุ่ม Select
* **เลือกรูปภาพจาก Image Collection**ที่คุณอัพโหลดไว้ได้ทันทีครับ! ตัววิดเจ็ตจะประมวลผลและปรับขนาดการแสดงผลลงไปในปุ่มกดให้สวยงามพอดีโดยอัตโนมัติ

#### เลือกใช้ไอคอนระบบมาตรฐาน (Glyphicon / FontAwesome)

* นอกเหนือจากการอัพโหลดรูปภาพเองแล้ว หากคุณต้องการใช้ไอคอนสัญลักษณ์ทั่วไป คุณก็สามารถเลือกจากชุดไอคอนมาตรฐานของ Mendix หรือไอคอนจาก FontAwesome ผ่านหน้าต่างเลือกไอคอนแบบปกติได้ทันทีด้วยเช่นกันครับ

### 2. การรันตรวจสอบการทำงานไอคอนบนหน้า Playground Simulator (แบบ Local)

* หน้าจอจำลอง **Vite Playground** (ที่เปิดด้วยคำสั่ง `npm run playground`) ได้รับการติดตั้ง **สวิตช์จำลองไอคอนแบบสไตล์ SVG 5 Preset** (Default, Rounded Calendar, Clock, User, Checkmark) เพื่อให้นักพัฒนาสามารถทดลองกดเลือกดูการดัดแปลงและขนาดสเกลของรูปกล่องข้อความได้แบบสด ๆ ทันทีโดยไม่ต้องรัน Mendix App!
* หากคุณมี SVG ใหม่ที่อยากนำมาเทสใน Playground คุณสามารถแก้สโคดเวกเตอร์เพิ่มได้โดยตรงในไฟล์ [playground/main.tsx](file:///Users/lapat.ta/Desktop/ETC%20Project/Customize-mendix-widget-pwb-antigravity/pwbDatePicker/playground/main.tsx) (บรรทัดที่ 38)

---

## 🌐 Dynamic String & DateTime Dual-Attribute Support (v1.2.0)

Widget รุ่น **v1.2.0** เพิ่มขีดความสามารถการผูกแอตทริบิวต์ได้อย่างอิสระ ทั้งประเภท **DateTime** และ **String** เพื่อลดความซับซ้อนในการเขียน Microflow/Nanoflow สำหรับแปลงค่าใน Mendix

### 1. กฏเกณฑ์การแปลงค่าและการบันทึก (Data Integration Rules)

* **เมื่อผูกกับแอตทริบิวต์ประเภท `DateTime`**:
  * ระบบจะดึงค่าเริ่มต้นและบันทึกค่าที่ผู้ใช้เลือกในรูปแบบออบเจกต์ `Date` มาตรฐานของ JavaScript/Mendix โดยตรง (พฤติกรรมดั้งเดิม)
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
