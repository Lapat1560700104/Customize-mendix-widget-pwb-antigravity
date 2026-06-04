# PWB Customize Container DataView 🚀 (v1.1.0)

**pwbCustomizeContainerDataView** เป็น Premium Mendix Pluggable Widget ที่ออกแบบมาเพื่อเป็น **Container อัจฉริยะที่รับ Widget Mendix ตัวอื่นๆ ได้ทุกชนิด** พร้อมระบบ **Drag & Drop เพื่อสลับลำดับรายการแบบลื่นไหล** และมีคุณสมบัติพื้นฐานของ **DataView** ในตัว (Context Provider สำหรับ Entity)

---

## ✨ คุณสมบัติหลัก (Key Features)

1. **🧩 รับ Widget ตัวอื่นเข้ามาข้างใน (Nested Widget Dropzone)**
   - รองรับการลากวาง Mendix Widget ใดๆ (Card, Button, TextBox, Image ฯลฯ) เข้ามาแสดงผลในแต่ละแถวรายการได้อย่างอิสระ
   - ระบบ Context binding ส่งข้อมูลของแต่ละ Object Context เข้าไปใน Widget ที่วางไว้โดยอัตโนมัติ

2. **🎯 Pointer Events Drag & Drop Selected Tag Reordering**
   - ลากสลับลำดับรายการได้อิสระทั้งแนวตั้ง (Vertical List) และแนวนอน (Horizontal Grid) ด้วยสถาปัตยกรรม Pointer Events API (ไม่ใช่ HTML5 DnD แบบเก่า) ทำให้รองรับ Touch Screen บนมือถือและ Safari ได้ลื่นไหล 100%
   - เส้นบอกทิศทางการวาง (Drop Indicator) แบบ Glow Animation
   - ประสิทธิภาพ Smooth Physics และ wobble snap-back เมื่อปล่อยคืนตำแหน่งเดิม

3. **♿ การรองรับคีย์บอร์ดและเครื่องอ่านหน้าจอ (Keyboard Navigation & WCAG 2.1)**
   - สามารถใช้งาน reorder ลำดับได้ 100% ผ่านคีย์บอร์ดโดยไม่ต้องพึ่งพาเมาส์ (ปุ่ม **Tab** เพื่อย้ายโฟกัส, **Spacebar / Enter** เพื่อคีบจับหรือวางปล่อยการ์ด, **Arrow Keys** เพื่อย้ายตำแหน่งการ์ด และ **Escape** เพื่อยกเลิกกระบวนการและดีดการ์ดกลับคืนลำดับเดิม)
   - มีการส่งสัญญาณเสียงแจ้งเตือนแบบเรียลไทม์ (Live screen-reader announcements) ผ่าน Assertive Live Region ในภาษาไทยและภาษาอังกฤษ

4. **📜 ระบบเลื่อนจออัจฉริยะระดับกล่องซ้อน (Container-Aware Auto-Scrolling)**
   - ค้นหากล่อง Parent Container ที่สกรอเลอร์แยกต่างหาก (`overflow-y: auto`) และสั่งเลื่อนตำแหน่งการสกロールเมื่อลากการ์ดชิดขอบกล่องนั้นโดยตรง และรัน window scrolling เป็นระบบ Fallback เสมอ ช่วยเพิ่มความพรีเมียมในทุกแผงควบคุม Dashboard

5. **⚡ ระบบแสดงผลแบบคาดการณ์และป้องกันอาการกะพริบ (Optimistic UI Transitions)**
   - นำสถาปัตยกรรม Event Broker และ Global Registry มาตัดช่วงดีเลย์ Asynchronous Mendix reload เพื่อประคอง UI ไม่ให้การ์ดกระพริบหรือซ้ำซ้อนเวลาลากวางการ์ดข้ามระหว่างคอลัมน์คัมบัน (Kanban columns)

6. **🎨 ระบบสไตล์และธีมสำเร็จรูปพรีเมียม (Premium Style & Theme Presets)**
   - **Glassmorphism (ความโปร่งแสงพรีเมียม):** ขอบใสและเบลอพื้นหลังอย่างนุ่มนวล
   - **Minimalist Flat (มินิมอลคลาสสิก):** ลบขอบและเงาเหลือเพียงเส้นแบ่งขอบล่างบางเบา
   - **Neo-Brutalist (คอนทราสต์จัดจ้าน):** เส้นขอบหนาสามมิติและเงาเบลอแบบออฟเซ็ตสีดำ/สีเน้น
   - **Adaptive Dark Mode:** ปรับเปลี่ยนชุดสีของวิจเจตตามระบบ Dark Mode ของบราวเซอร์หรือคลาส Mendix IDE อัตโนมัติ
   - **Custom Spacing Controls:** กำหนดระยะห่าง Padding และ Gap ระหว่างการ์ดได้โดยตรงผ่าน Property Panel

---

## 📁 โครงสร้างไฟล์ (File Structure)

```bash
pwbCustomizeContainerDataView/
├── tsconfig.json                             # TypeScript compilation config
├── package.json                              # Widget package configuration
├── typings/
│   └── PwbCustomizeContainerDataViewProps.d.ts  # Auto-generated Mendix props typings
└── src/
    ├── package.xml                                      # Mendix .mpk packaging config
    ├── PwbCustomizeContainerDataView.xml                # Widget properties (Studio Pro)
    ├── PwbCustomizeContainerDataView.tsx                # Main React component wrapper
    ├── PwbCustomizeContainerDataView.editorPreview.tsx  # Studio Pro design preview
    ├── PwbCustomizeContainerDataView.editorConfig.ts    # Property validation rules
    ├── components/
    │   └── DragContainer.tsx                # Drag & Drop sorting engine
    └── ui/
        └── PwbCustomizeContainerDataView.css  # Widget premium styling
```

---

## 🛠️ Developer Commands

### 1. Install Dependencies

```bash
npm install
```

### 2. Build (Development)

```bash
npm run build
```

### 3. Lint & Format

```bash
npm run lint:fix
```

### 4. Build Production Package (.mpk)

```bash
npm run release
```

_คำสั่งนี้จะ build JavaScript bundle, package ทุกอย่างเป็นไฟล์ `.mpk` ใน `dist/` และคัดลอกไปยัง Mendix project `widgets/` folder โดยอัตโนมัติ_

---

## ⚙️ Widget Properties

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `itemsSource` | Datasource (List) | ✅ Yes | — | รายการข้อมูลที่จะแสดงและจัดลำดับ |
| `customItemContent` | Widgets | ✅ Yes | — | Widget ที่จะแสดงในแต่ละแถว (ผูกกับ `itemsSource`) |
| `readOnlyMode` | Boolean | No | `false` | เมื่อเปิดใช้งาน จะล็อคการแสดงผลอย่างเดียว ไม่สามารถลากสลับหรือจับย้ายตำแหน่งการ์ดใดๆ ได้ |
| `sortIdAttribute` | Attribute (Integer/Decimal/String) | No (Required in Read Only) | — | Attribute เก็บค่า Sort ID ประจำไอเทม สำหรับใช้จัดเรียงลำดับเมื่อเปิดใช้งาน Read Only Mode |
| `sortedAttribute` | Attribute (String) | No (Required in normal mode) | — | Attribute เก็บผลลัพธ์ GUIDs ที่เรียงลำดับแล้ว (comma-separated) |
| `onSortAction` | Action | No | — | Microflow/Nanoflow ที่จะถูกเรียกเมื่อลากวางเสร็จ |
| `layoutDirection` | Enumeration | No | `vertical` | ทิศทางการจัดวาง: `vertical` (แนวตั้ง) หรือ `horizontal` (แนวนอน) |
| `dragHandleDisplay` | Enumeration | No | `left` | การแสดงผลปุ่ม Drag Handle: `left` (แสดงทางซ้าย) หรือ `hide` (ซ่อนปุ่ม) |
| `accentColor` | String | No | `#3b82f6` | สีไฮไลต์และ Drop Indicator Glow (เช่น `#3b82f6`, `#10b981`) |
| `borderRadius` | String | No | `16px` | ความโค้งมนขอบการ์ด (เช่น `8px`, `16px`, `0px`) |
| `themePreset` | Enumeration | No | `default_rounded` | พรีเซ็ตสไตล์: `default_rounded` (กลมมนมาตรฐาน), `modern_glass` (กระจกฝ้า), `minimalist_flat` (แบนราบมินิมอล), `neo_brutalist` (กรอบหนาแนวอินดี้) |
| `darkModeBehavior` | Enumeration | No | `auto` | การตรวจจับ Dark Mode: `auto` (อัตโนมัติ), `light` (บังคับธีมสว่าง), `dark` (บังคับธีมมืด) |
| `itemPadding` | String | No | `12px 16px` | ระยะขอบด้านในของการ์ดแต่ละใบ (เช่น `12px 16px`, `16px`) |
| `itemGap` | String | No | `12px` | ระยะห่างช่องว่างระหว่างการ์ด (เช่น `12px`, `8px`, `20px`) |
| `enableKanban` | Boolean | No | `true` | เปิดใช้งานโหมดคัมบัง (ลากย้ายการ์ดข้ามระหว่างหลายวิจเจตที่มีกลุ่มเดียวกันได้) |
| `dragGroup` | String | No | — | ชื่อกลุ่มลากวาง สำหรับจัดกลุ่มกระดานที่ลากข้ามหากันได้ (ต้องตั้งชื่อตรงกันทั้งสองฝั่ง เช่น 'kanban-board') |
| `columnValue` | String | No | — | ค่าสถานะ/ประเภทประจำคอลัมน์นี้ สำหรับนำไปอัปเดตลงในการ์ดที่ย้ายเข้ามา (เช่น 'ToDo', 'Done') |
| `itemColumnAttribute` | Attribute (String/Enum) | No | — | แอททริบิวต์บน Entity การ์ดที่จะถูกเขียนค่า `columnValue` ทับลงไปเมื่อมีการย้ายการ์ด |
| `saveDelay` | Integer | ✅ Yes | `0` | ดีเลย์ในหน่วยมิลลิวินาทีก่อนบันทึกและรัน action เพื่อลดการเซฟถี่เกินไปในบราวเซอร์ (ต้องระบุเป็นตัวเลข >= 0) |

---

## 🔄 การทำงานของระบบเรียงลำดับ (Sorting Persistence Flow)

```
ผู้ใช้ลากสลับลำดับรายการ
         │
         ▼
DragContainer จัดเรียง State ใหม่
         │
         ▼
สร้าง comma-separated GUIDs: "id_3,id_1,id_2"
         │
         ▼
sortedAttribute.setValue("id_3,id_1,id_2")   ← บันทึกลง Mendix Attribute
         │
         ▼
onSortAction.execute()   ← เรียก Microflow/Nanoflow
```

---

## 🎨 Styling Customization

Widget รองรับการปรับแต่งสีและความโค้งมนผ่าน Mendix Studio Pro Properties โดยตรง โดยใช้ CSS Variables:

| CSS Variable | Property | ค่าตัวอย่าง |
|---|---|---|
| `--accent-color` | `accentColor` | `#3b82f6` |
| `--border-radius` | `borderRadius` | `16px` |
| `--accent-glow` | คำนวณอัตโนมัติ | `rgba(59,130,246,0.15)` |

---

## 📦 Generated Output

หลัง `npm run release` จะได้ไฟล์:

```
dist/
└── 1.1.0/
    └── pwb.PwbCustomizeContainerDataView_1.1.0_<timestamp>.mpk
```

คัดลอกไฟล์ `.mpk` นี้ไปวางใน `widgets/` ของ Mendix App แล้วเปิด Studio Pro เพื่อ Synchronize ได้เลยครับ
