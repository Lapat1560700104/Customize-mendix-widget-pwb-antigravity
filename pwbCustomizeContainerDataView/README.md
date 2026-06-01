# PWB Customize Container DataView 🚀 (v1.0.0)

**pwbCustomizeContainerDataView** เป็น Premium Mendix Pluggable Widget ที่ออกแบบมาเพื่อเป็น **Container อัจฉริยะที่รับ Widget Mendix ตัวอื่นๆ ได้ทุกชนิด** พร้อมระบบ **Drag & Drop เพื่อสลับลำดับรายการแบบลื่นไหล** และมีคุณสมบัติพื้นฐานของ **DataView** ในตัว (Context Provider สำหรับ Entity)

---

## ✨ คุณสมบัติหลัก (Key Features)

1. **🧩 รับ Widget ตัวอื่นเข้ามาข้างใน (Nested Widget Dropzone)**
   - รองรับการลากวาง Mendix Widget ใดๆ (Card, Button, TextBox, Image ฯลฯ) เข้ามาแสดงผลในแต่ละแถวรายการได้อย่างอิสระ
   - ระบบ Context binding ส่งข้อมูลของแต่ละ Object เข้าไปใน Widget ที่วางไว้โดยอัตโนมัติ

2. **🎯 Drag & Drop Selected Tag Reordering**
   - ลากสลับลำดับรายการได้อิสระทั้งแนวตั้ง (Vertical List) และแนวนอน (Horizontal Grid)
   - เส้นบอกทิศทางการวาง (Drop Indicator) แบบ Glow Animation
   - ประสิทธิภาพ Smooth Physics — ใช้ HTML5 Native Drag Events

3. **📦 คุณสมบัติ DataView พื้นฐาน (Entity Context Provider)**
   - รองรับ `needsEntityContext="true"` — ผูก Entity Object ของหน้าหลักได้โดยตรง
   - บันทึกลำดับ GUIDs ที่จัดเรียงใหม่กลับไปยัง String Attribute ในรูปแบบ comma-separated
   - รองรับ On Sort Action (Microflow / Nanoflow) ที่จะถูกเรียกโดยอัตโนมัติเมื่อการลากวางเสร็จสิ้น

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
| `sortedAttribute` | Attribute (String) | ✅ Yes | — | Attribute เก็บผลลัพธ์ GUIDs ที่เรียงลำดับแล้ว (comma-separated) |
| `onSortAction` | Action | No | — | Microflow/Nanoflow ที่จะถูกเรียกเมื่อลากวางเสร็จ |
| `layoutDirection` | Enumeration | No | `vertical` | ทิศทางการจัดวาง: `vertical` (แนวตั้ง) หรือ `horizontal` (แนวนอน) |
| `dragHandleDisplay` | Enumeration | No | `left` | การแสดงผลปุ่ม Drag Handle: `left` (แสดงทางซ้าย) หรือ `hide` (ซ่อนปุ่ม) |
| `accentColor` | String | No | `#3b82f6` | สีไฮไลต์และ Drop Indicator Glow (เช่น `#3b82f6`, `#10b981`) |
| `borderRadius` | String | No | `16px` | ความโค้งมนขอบการ์ด (เช่น `8px`, `16px`, `0px`) |

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
└── 1.0.0/
    └── pwb.PwbCustomizeContainerDataView_1.0.0_<timestamp>.mpk
```

คัดลอกไฟล์ `.mpk` นี้ไปวางใน `widgets/` ของ Mendix App แล้วเปิด Studio Pro เพื่อ Synchronize ได้เลยครับ
