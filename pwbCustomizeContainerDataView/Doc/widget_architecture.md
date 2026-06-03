# 🏗️ โครงสร้างสถาปัตยกรรมและหลักการทำงาน
# pwbCustomizeContainerDataView (v1.1.0)

**เอกสารฉบับนี้อธิบายโครงสร้างภายใน, หลักการทำงานในทุกขั้นตอน, และขอบเขตการรองรับ Widget ที่สามารถนำมา Render ได้ใน Container นี้ โดยอ้างอิงจาก Source Code จริง**

---

## 📐 ภาพรวมสถาปัตยกรรม (Architecture Overview)

```
┌─────────────────────────────────────────────────────────────────┐
│                  Mendix Page / DataView Context                 │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │       PwbCustomizeContainerDataView (Root Widget)         │  │
│  │                                                           │  │
│  │  Props: itemsSource, customItemContent, sortedAttribute,  │  │
│  │         onSortAction, layoutDirection, accentColor,       │  │
│  │         borderRadius                                      │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │              DragContainer (Engine)                 │  │  │
│  │  │                                                     │  │  │
│  │  │  State: orderedItems[], draggingIndex, dragOverIndex │  │  │
│  │  │                                                     │  │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │  │
│  │  │  │ Row Item │  │ Row Item │  │ Row Item │  ...      │  │  │
│  │  │  │ ⠿ [Wdgt] │  │ ⠿ [Wdgt] │  │ ⠿ [Wdgt] │          │  │  │
│  │  │  └──────────┘  └──────────┘  └──────────┘          │  │  │
│  │  │       ↑ customItemContent.get(ObjectItem)           │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 โครงสร้างไฟล์และหน้าที่ (File Structure & Responsibilities)

```
src/
├── PwbCustomizeContainerDataView.tsx        ← Root Component (Controller Layer)
│   • รับ Mendix props ทั้งหมด
│   • ตรวจสอบ Loading / Empty State
│   • คำนวณ dragItems[] จาก itemsSource พร้อม Hydration ลำดับ
│   • ส่ง callback handleOrderChange ลง DragContainer
│   • Sanitize accentColor และ borderRadius ก่อนใช้
│
├── PwbCustomizeContainerDataView.xml        ← Widget Property Schema
│   • กำหนด type, required, dataSource ของแต่ละ Property
│   • needsEntityContext="true" → รับ Entity Context จาก DataView หลัก
│   • offlineCapable="true" → รองรับ Offline App
│
├── PwbCustomizeContainerDataView.editorPreview.tsx  ← Studio Pro Preview (React)
│   • ฟังก์ชัน preview() → แสดงภาพ structural ใน Design Mode
│   • ใช้ customItemContent.renderer → render widget จริงใน Studio Pro
│   • รองรับ renderMode: "design" / "xray" / "structure"
│   • ฟังก์ชัน getPreviewCss() → inject CSS เข้า Studio Pro canvas
│
├── PwbCustomizeContainerDataView.editorConfig.ts    ← Studio Pro Validation
│   • ฟังก์ชัน check() → ตรวจสอบ properties ที่ขาดหาย
│   • ฟังก์ชัน getPreview() → PreviewProps สำหรับ Studio Pro (Datasource + DropZone)
│   • ฟังก์ชัน getCustomCaption() → label ที่แสดงใน Studio Pro property panel
│
├── components/
│   └── DragContainer.tsx                    ← Drag Engine (View Layer)
│       • จัดการ State ของลำดับ (orderedItems[]) และ Keyboard-Drag States
│       • Unified Web Pointer Events Engine: รองรับการลากผ่าน Pointer Down/Move/Up/Cancel
│       • รองรับ Keyboard Navigation (Space/Enter, Arrow Keys, Escape) และ ARIA Accessibility
│       • ไม่พึ่งพา Library ภายนอก (Zero-dependency)
│       • เรียก onOrderChange() เมื่อจัดลำดับสำเร็จ หรือ onDropExternal() เมื่อวางข้ามตู้ Kanban
│       • ระบบคำนวณ Auto-scroll บน Container Parent ที่ซ้อนอยู่ (Nested Scroll Parent)
│
└── ui/
    └── PwbCustomizeContainerDataView.css    ← Styling Layer
        • CSS Custom Properties: --accent-color, --border-radius, --accent-glow
        • Animation: pwb-spin (loading), pwb-pulse (empty state)
        • Responsive breakpoint: 768px (horizontal → column)
```

---

## 🔄 หลักการทำงานทีละขั้นตอน (Step-by-Step Flow)

### Phase 1 — Widget Initialization (Widget โหลดครั้งแรก)

```
Mendix Runtime โหลด Widget
         │
         ▼
PwbCustomizeContainerDataView ได้รับ Props จาก Mendix:
  • itemsSource   → Mendix ListValue (status: "loading" | "available" | "unavailable")
  • sortedAttribute → Mendix EditableValue<string>  (ค่าปัจจุบันจาก Database)
  • customItemContent → Mendix ListWidgetValue
         │
         ▼
Step 1.1: Sanitize Aesthetics
  • accentColor  → ตรวจ Regex CSS Color → fallback "#3b82f6"
  • borderRadius → ตรวจรูปแบบ → เติม "px" ถ้าเป็นตัวเลขล้วน → fallback "16px"
         │
         ▼
Step 1.2: Check Loading State
  • itemsSource.status === "loading" → แสดง Loading Spinner
  • itemsSource.items.length === 0  → แสดง Empty State
  • มี items → ไปยัง Phase 2
```

### Phase 2 — Order Hydration (คืนลำดับที่บันทึกไว้)

```
useMemo() คำนวณ dragItems[] เมื่อ itemsSource.items หรือ sortedAttribute.value เปลี่ยน
         │
         ▼
ดึง itemsSource.items → map เป็น DragItem[]: [ { id: "guid-X", rawObject: ObjectItem }, ... ]
         │
         ▼
ตรวจสอบ sortedAttribute.value:
  ┌── ว่าง (null / "") ──────────────────► ใช้ลำดับ DataSource ตรงๆ
  │
  └── มีค่า "guid-C,guid-A,guid-D,guid-B"
         │
         ▼
         แยก: ["guid-C", "guid-A", "guid-D", "guid-B"]
         สร้าง Map<id, sortIndex>
         เรียงลำดับ rawList ตาม Map:
           • Item ที่มีใน savedOrder → เรียงตาม index ที่บันทึกไว้
           • Item ใหม่ที่ไม่มีใน savedOrder → ต่อท้ายด้วย Infinity sort
         │
         ▼
         ส่ง dragItems[] ที่เรียงแล้วไปยัง DragContainer
```

### Phase 3 — Drag Event & Keyboard Navigation Lifecycle (วงจรการลาก-วาง และคีย์บอร์ด)

#### 3.1 การลากวางผ่าน Pointer Events (Pointer Drag Flow)
```
ผู้ใช้เริ่มลาก Row Item (pointerdown)
         │
         ▼
handlePointerDown(e, index):
  • setPointerCapture(e.pointerId) -> ล็อคพิกัดติดตามพิกัดนิ้ว/เมาส์
  • บันทึกพิกัด startX, startY และ offset
  • บันทึกเดิมลง global window.__pwbDragRegistry
         │
         ▼
ผู้ใช้ลากนิ้ว/เมาส์เคลื่อนที่ (pointermove):
  • ตรวจสอบระยะลากพ้น 5px (Threshold)
  • สร้าง Ghost Card (การ์ดกระจกแก้วจำลอง) เคลื่อนตามพิกัด pointer
  • ตรวจสอบ Proximity ด้านบน/ล่างของ Nested Scroll Parent หรือ Window เพื่อรัน Auto-Scroll
  • ตรวจสอบ Element ใต้พิกัดลากผ่าน document.elementFromPoint()
  • ลากผ่านแถวเดิม -> ทำการสลับลำดับใน orderedItems ทันที (มีแอนิเมชันเลื่อนหลบ)
  • ลากผ่าน Container อื่น -> ยิง CustomEvent "pwb-drag-over-container" ไปยังตู้เป้าหมาย
         │
         ▼
ผู้ใช้ปล่อยมือ/เมาส์ (pointerup / pointercancel):
  • releasePointerCapture(e.pointerId)
  • ลบ Ghost Card ออกจาก body
  • วางใน Container เดิม -> เปรียบเทียบลำดับและยิง onOrderChange()
  • วางต่าง Container (Kanban) -> บันทึก window.__pwbActiveTransition และยิง onDropExternal()
  • หากวางที่เดิม/ยกเลิก -> รันแอนิเมชันสั่นดีดกลับ (Wobble Snap-Back)
```

#### 3.2 การจัดลำดับผ่านแป้นพิมพ์ (Keyboard Accessibility Flow)
```
ผู้ใช้เข้าโฟกัสไอเทมแถวผ่านปุ่ม Tab (tabIndex=0)
         │
         ▼
กดปุ่ม Spacebar หรือ Enter (handleKeyDown):
  • เปิดสเตตัสการคีบจับ (keyboardGrabbedId)
  • บันทึกลำดับเดิมก่อนย้ายไว้สำรองข้อมูล (originalItemsBeforeKeyboardDrag)
  • ส่งประกาศเสียงไปที่ hidden aria-live region (announcement)
         │
         ▼
กดปุ่ม Arrow Up / Left หรือ Arrow Down / Right:
  • สลับตำแหน่งการ์ดใน orderedItems ในทิศทางขึ้น/ลง หรือ ซ้าย/ขวา
  • อัปเดตเสียงไปยังเครื่องอ่านหน้าจอแบบเรียลไทม์
  • ควบคุมการโฟกัสติดตาม (Refocus) ไปยังการ์ดไอเทมที่ย้ายเสมอ
         │
         ▼
กดปุ่ม Spacebar/Enter เพื่อตกลง หรือ Escape เพื่อยกเลิก:
  • ตกลง (Space/Enter) -> ล็อคลำดับใหม่ บันทึก onOrderChange() และประกาศคำยืนยัน
  • ยกเลิก (Escape) -> ดึงชุดข้อมูล originalItems... กลับมาทับและประกาศยกเลิกคืนที่เดิม
```

### Phase 4 — Order Persistence (บันทึกลำดับลง Mendix)

```
handleOrderChange(["guid-C", "guid-A", "guid-D", "guid-B"]) ถูกเรียก
         │
         ▼
ตรวจ: sortedAttribute.readOnly === false ?
  ┌── true (read-only) ──► หยุด ไม่เขียน (เงียบ)
  │
  └── false (แก้ไขได้)
         │
         ▼
         serialized = newOrderIds.join(",")
         → "guid-C,guid-A,guid-D,guid-B"
         │
         ▼
         sortedAttribute.setValue(serialized)
         → Mendix Runtime บันทึก String ลง attribute ของ Entity
         │
         ▼
         ตรวจ: onSortAction.canExecute && !onSortAction.isExecuting ?
           ├── ใช่ → onSortAction.execute()
           │          → Mendix เรียก Microflow / Nanoflow
           └── ไม่ → ข้าม (ไม่มี action / กำลัง execute อยู่)
```

---

## 🔗 Widget Property Reference (อ้างอิงจาก XML Schema จริง)

| Property Key | XML Type | isList | dataSource | Required | Default | หมายเหตุ |
|---|---|---|---|---|---|---|
| `itemsSource` | `datasource` | `true` | — | ✅ | — | List ของ Mendix Objects ที่จะแสดงและจัดลำดับ |
| `customItemContent` | `widgets` | — | `itemsSource` | ✅ | — | Widget template ที่ bind กับ itemsSource แต่ละ item |
| `sortedAttribute` | `attribute` (String) | — | — | ✅ | — | String attribute บน parent Entity สำหรับบันทึก GUIDs |
| `onSortAction` | `action` | — | — | ❌ | — | Microflow/Nanoflow ยิงหลัง Drop สำเร็จ |
| `layoutDirection` | `enumeration` | — | — | ❌ | `vertical` | `vertical` หรือ `horizontal` |
| `accentColor` | `string` | — | — | ❌ | `#3b82f6` | CSS Color: hex, rgb(), rgba(), color name |
| `borderRadius` | `string` | — | — | ❌ | `16px` | CSS length: `16px`, `1rem`, `0px` |

> [!IMPORTANT]
> **Widget Attribute Flags (จาก XML)**
> - `needsEntityContext="true"` → Widget **ต้องอยู่ภายใน DataView** หรือ List View ที่มี Entity Context
> - `offlineCapable="true"` → รองรับ Mendix Offline-First Application
> - `supportedPlatform="Web"` → รองรับ Web Browser เท่านั้น (ไม่รองรับ Native Mobile)

---

## 🧩 ขอบเขตการรองรับ Widget ที่ Render ได้ภายใน Container

### กลไกการส่ง Context ให้ Widget ภายใน

```typescript
// ใน PwbCustomizeContainerDataView.tsx
renderItem={rawObject => customItemContent.get(rawObject) as JSX.Element}

// customItemContent.get(ObjectItem) คือ Mendix ListWidgetValue API
// → Mendix Runtime สร้าง React Element ของ Widget ที่ developer กำหนดไว้
// → พร้อม inject Entity Context ของ ObjectItem นั้น ให้ Widget ด้านในทุกตัว
```

Widget ที่ drop ไว้ใน `customItemContent` จะได้รับ **Entity Context ของแต่ละ item** โดยอัตโนมัติ ทำให้ทุก Text Box, Button, หรือ Widget ใดๆ สามารถ bind กับ attribute ของ item นั้นได้ตรงๆ

---

### ✅ Widget ที่รองรับ (Supported — รันได้เต็มรูปแบบ)

#### 1. Mendix Standard Widgets (Built-in)

| Widget | เงื่อนไข | หมายเหตุ |
|---|---|---|
| **Text** | ✅ รองรับเต็ม | bind กับ String attribute ของ item ได้ตรงๆ |
| **Text Box** | ✅ รองรับเต็ม | แก้ไข String attribute ได้ (ถ้า Entity มีสิทธิ์ Write) |
| **Text Area** | ✅ รองรับเต็ม | bind กับ String ยาวได้ |
| **Image** | ✅ รองรับเต็ม | แสดง Static URL หรือ Dynamic URL จาก attribute |
| **Image Viewer** | ✅ รองรับเต็ม | แสดงรูปจาก FileDocument Entity |
| **Button** | ✅ รองรับเต็ม | เรียก Microflow/Nanoflow พร้อมส่ง Entity ของ item นั้น |
| **Action Button** | ✅ รองรับเต็ม | รองรับ confirmation dialog, progress bar |
| **Dropdown** | ✅ รองรับเต็ม | bind กับ Enumeration หรือ Association |
| **Check Box** | ✅ รองรับเต็ม | bind กับ Boolean attribute |
| **Date Picker** | ✅ รองรับเต็ม | bind กับ DateTime attribute |
| **Radio Buttons** | ✅ รองรับเต็ม | bind กับ Enumeration |
| **Static Image** | ✅ รองรับเต็ม | แสดงรูปจาก Image Collection |
| **Badge** | ✅ รองรับเต็ม | แสดงค่า Numeric badge |
| **Progress Bar** | ✅ รองรับเต็ม | แสดง progress จาก Integer/Decimal |
| **Slider** | ✅ รองรับเต็ม | bind กับ Integer/Decimal |
| **Star Rating** | ✅ รองรับเต็ม | แสดงและแก้ไข rating |
| **HTML Snippet** | ✅ รองรับเต็ม | inject custom HTML (ต้องระวัง XSS) |
| **Container** | ✅ รองรับเต็ม | ใช้เป็น wrapper จัด layout ภายใน row |
| **Row** | ✅ รองรับเต็ม | จัดวาง Widget เป็น column ได้ |
| **Group Box** | ✅ รองรับเต็ม | จัดกลุ่ม widgets ด้วย border/label |
| **Tab Container** | ✅ รองรับเต็ม | Tab navigation ภายใน row |
| **Conditional Visibility** | ✅ รองรับเต็ม | ซ่อน/แสดง Widget ตาม expression ของ item |

#### 2. Mendix Marketplace Widgets (ที่ผ่านการทดสอบ)

| Widget | เงื่อนไข | หมายเหตุ |
|---|---|---|
| **Rich Text** | ✅ รองรับเต็ม | แสดง HTML content จาก String attribute |
| **Color Picker** | ✅ รองรับเต็ม | bind กับ String attribute (hex color) |
| **Maps (Google/Leaflet)** | ✅ รองรับ (บาง config) | latitude/longitude จาก Decimal attribute ได้ |
| **Charts (any)** | ✅ รองรับ | ใช้ data จาก association ของ item นั้นได้ |
| **File Manager** | ✅ รองรับเต็ม | upload ไฟล์ผูกกับ item |
| **Signature** | ✅ รองรับเต็ม | บันทึก signature ลง item |
| **Gallery** | ⚠️ ระวัง Nested | Gallery ใน Container ได้ แต่อย่าให้มี Drag & Drop ซ้อน |
| **Data Grid 2** | ⚠️ ระวัง Nested | List View ซ้อนได้ แต่ scroll อาจชนกัน |

#### 3. Custom PWB Widgets

| Widget | เงื่อนไข | หมายเหตุ |
|---|---|---|
| **pwbComboBox** | ✅ รองรับเต็ม | ใช้เป็น Dropdown เลือกค่าใน row ได้ Entity Context ผ่านไปเต็มรูปแบบ |
| **pwbDatePicker** | ✅ รองรับเต็ม | ใช้เป็น Date input ใน row ได้ |
| **pwbCustomizeContainerDataView** | ⚠️ Nested ได้ แต่ไม่แนะนำ | Nested Container ทำงานได้ แต่ลำดับ sortedAttribute ของ parent/child อาจ conflict กันได้ |

---

### ⚠️ Widget ที่ต้องระวัง (Use with Caution)

| Widget / สถานการณ์ | ปัญหาที่อาจเกิด | วิธีแก้ |
|---|---|---|
| **Widget ที่มี Drag & Drop ของตัวเอง** | Mouse event ชนกัน อาจ trigger drag ผิด widget | วาง Handle region ให้ชัดเจน หรือ disable inner drag |
| **List View / Gallery ที่ scroll แนวนอน** | Scroll event อาจขัดกับ horizontal layout ของ Container | ใช้ vertical layout แทน |
| **Popup / Dialog ที่เปิดบน row** | ถ้าใช้ Modal Widget, pointer-events อาจถูก DragContainer รบกวน | เพิ่ม `stopPropagation` ใน button onClick หรือใช้ `draggable={false}` บน Popup trigger |
| **Widget ที่ใช้ `pointer-events: none`** | Drag จะไม่ตอบสนอง ถ้า wrapper element มี pointer-events ปิดอยู่ | ตรวจ CSS ของ widget นั้นๆ |
| **Video Player (autoplay)** | onDragStart จะ interrupt การเล่น video | ใช้ `controls` mode หรือ pause ก่อน drag |

---

### ❌ Widget ที่ไม่รองรับ (Not Supported)

| Widget | เหตุผล |
|---|---|
| **Native Mobile Widgets** | Widget มี `supportedPlatform="Web"` เท่านั้น |
| **Mendix App Store Widgets ที่ต้องการ Page Context ระดับบน** | เช่น Widget ที่ต้องการ `pageTitle` หรือ `currentUser` จาก global scope อาจไม่มี context ถูกต้อง |
| **Widget ที่ต้อง render ใน `<body>` โดยตรง** | เช่น Portal-based Popup ที่ append ตัวเองที่ document.body — จะ break layout ของ Drag Container |
| **WebSocket / Real-time Widgets ที่ re-mount ต่อเนื่อง** | การ Drag & Drop เรียง orderedItems ใหม่ทำให้ React re-render ทั้ง Row นั้น — Widget ที่มี expensive mount/unmount จะกระตุก |

---

## 🎨 CSS Architecture (โครงสร้าง CSS จริง)

### CSS Custom Properties (ตัวแปรที่ Widget กำหนด)

```css
.pwb-drag-container {
    --accent-color: #3b82f6;   /* ← จาก accentColor property */
    --border-radius: 16px;     /* ← จาก borderRadius property */
    --accent-glow: color-mix(in srgb, var(--accent-color) 15%, transparent);
                               /* ← คำนวณอัตโนมัติจาก accent color */

    /* Slate color palette (internal use) */
    --slate-50:  #f8fafc;
    --slate-100: #f1f5f9;
    --slate-200: #e2e8f0;
    --slate-300: #cbd5e1;
    --slate-400: #94a3b8;
    --slate-500: #64748b;
    --slate-600: #475569;
    --slate-700: #334155;
    --slate-800: #1e293b;

    /* Shadow */
    --shadow-premium: 0 10px 25px -5px rgba(0,0,0,0.04),
                      0 8px 10px -6px rgba(0,0,0,0.03);
}
```

### State-based CSS Classes และ Effect ที่เกิดขึ้น

| Class | เงื่อนไข | Visual Effect |
|---|---|---|
| `.pwb-direction-vertical` | `layoutDirection = "vertical"` | `flex-direction: column` |
| `.pwb-direction-horizontal` | `layoutDirection = "horizontal"` | `flex-direction: row + flex-wrap: wrap` |
| `.pwb-dragging` | Row กำลังถูกลาก | `opacity: 0.45`, `transform: scale(0.97)`, `border: dashed accent` |
| `.pwb-drag-over` (vertical) | Row ถูกลากมาผ่าน (แนวตั้ง) | `border-top: 3.5px solid accent`, `box-shadow glow` |
| `.pwb-drag-over` (horizontal) | Row ถูกลากมาผ่าน (แนวนอน) | `border-left: 3.5px solid accent`, `box-shadow glow` |
| `.pwb-loading-state` | `status === "loading"` | Centered spinner animation |
| `.pwb-empty-state` | `items.length === 0` | Dashed border, pulsing icon |

### Responsive Behavior

```css
@media (max-width: 768px) {
    .pwb-drag-container.pwb-direction-horizontal {
        flex-direction: column;  /* ← Horizontal Grid พังเป็น Column บน mobile */
    }
}
```

---

## 🧠 Studio Pro Preview Architecture (สถาปัตยกรรม Preview)

### ฟังก์ชัน getPreview() → PreviewProps Tree

```
getPreview() คืน PreviewProps ให้ Mendix Studio Pro renderer:

Container (outer, border, padding=8, borderRadius=10)
└── RowLayout (header bar, backgroundColor=accentColor, borderRadius=6)
│   └── Text "⠿ PWB Container DataView · ↕ Vertical List"
│
└── Datasource (property=itemsSource)     ← แสดงชื่อ DataSource ที่ bind ไว้
    └── RowLayout (item row, borders=true, borderRadius=8)
        ├── Container (drag handle SVG image, grow=0)
        └── DropZone (property=customItemContent, grow=1)
                      ↑
                      นี่คือ Live DropZone — Studio Pro render widget จริงๆ ที่
                      developer ลาก drop ลงไปใน customItemContent property
```

### ฟังก์ชัน preview() (editorPreview.tsx) → React Component

```
preview() รับ PwbCustomizeContainerDataViewPreviewProps:
  • renderMode: "design" | "xray" | "structure"
  • customItemContent.renderer: ComponentType<{children, caption}>
  • customItemContent.widgetCount: number
  • itemsSource: PreviewDatasource
  • อื่นๆ...

ผลลัพธ์:
  Header bar (gradient accent) + datasource label + widgetCount badge
  │
  Row 1 (opacity 1.0):
    DragHandle SVG ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
    <customItemContent.renderer>               │
      ← ใช้ renderer ทำให้ Studio Pro แสดง   │ ← LIVE WIDGET จริง
      Widget ที่ developer drop ลงไป          │
    </customItemContent.renderer>              │
  Row 2 (opacity 0.65): เหมือน Row 1 ─ ─ ─ ─ ┘
  Row 3 (opacity 0.3): Ghost "more rows" hint
  onSortAction badge (ถ้าผูก action ไว้)
```

---

## 🚦 Validation Rules (check function)

```typescript
// กฎที่ Studio Pro ตรวจสอบทุกครั้งที่ Properties เปลี่ยน:

Rule 1: sortedAttribute ต้องถูกกำหนด (severity: "error")
  → ถ้าไม่กำหนด → Error "A Sorted IDs Attribute is required..."

Rule 2: accentColor ต้องเป็น valid CSS color (severity: "warning")
  → ตรวจด้วย Regex: hex | rgb() | rgba() | color name
  → ถ้าไม่ถูก format → Warning แต่ไม่ block build
```

---

## 📊 Data Flow Summary (สรุปทิศทางข้อมูลทั้งหมด)

```
Mendix Database
      │
      ▼  (อ่านครั้งแรก)
  sortedAttribute.value: "guid-C,guid-A,guid-D"
  itemsSource.items: [ObjectItem-A, ObjectItem-C, ObjectItem-D]
      │
      ▼  (Hydration — useMemo)
  dragItems: [
    { id: "guid-C", rawObject: ObjectItem-C },
    { id: "guid-A", rawObject: ObjectItem-A },
    { id: "guid-D", rawObject: ObjectItem-D }
  ]
      │
      ▼  (Render)
  DragContainer → Row[C] Row[A] Row[D]
  แต่ละ Row เรียก customItemContent.get(rawObject)
  → Mendix inject Entity Context ของ ObjectItem นั้น
  → Widget ภายใน Row อ่าน/เขียน attribute ของ item นั้นโดยตรง
      │
      ▼  (User drags Row[A] → ก่อน Row[C])
  orderedItems ใหม่: [A, C, D]
  handleOrderChange(["guid-A", "guid-C", "guid-D"])
      │
      ├── sortedAttribute.setValue("guid-A,guid-C,guid-D")
      │         ↓
      │   Mendix บันทึกลง Database
      │
      └── onSortAction.execute()
                ↓
          Microflow / Nanoflow ทำงาน
```

---

## ⚡ Performance & Accessibility Characteristics (ลักษณะประสิทธิภาพและการเข้าถึง)

| ประเด็น | การออกแบบ | ผลลัพธ์ |
|---|---|---|
| **Re-render on drag** | `orderedItems` state อยู่ใน DragContainer เท่านั้น — ไม่ bubble ขึ้น parent จนกว่า Drop | เฉพาะ DragContainer re-render ระหว่างลาก ไม่กระทบ Widget อื่นบนหน้า |
| **Optimistic UI Updates** | ใช้ `window.__pwbActiveTransition` และ Event Broker ในการย้ายข้าม Kanban | ขจัดปัญหากระพริบและซ้ำซ้อนของการ์ดระหว่างรอดึงสเตตัส Asynchronous จาก Mendix DB |
| **useMemo Hydration** | คำนวณ dragItems ใหม่เฉพาะเมื่อ items หรือ sortedValue เปลี่ยน | ไม่ re-compute ทุก render |
| **Unified Pointer Events** | พัฒนา Drag Engine สถาปัตยกรรม pointer capture ไร้ library | Bundle size เล็ก เบาบาง รองรับ Touch และ Mouse บนมือถือ/Safari อย่างยอดเยี่ยม |
| **Keyboard Accessibility** | รองรับ Tab focus, Space/Enter grab/drop, arrow navigation, escape cancel | ตรงตามมาตรฐาน WCAG 2.1 AA รองรับการใช้งานผ่านหน้าจออ่านออกเสียง (Screen Readers) |
| **Container Auto-Scrolling** | ค้นหากล่อง Parent overflow ที่ซ้อนอยู่และสั่งเลื่อน scrollTop/Left | ลากการ์ดขึ้นขอบแผงที่ซ้อนอยู่แล้วลากสกロールได้โดยไม่เลื่อนหน้าเว็บหลัก |

---

## 🏷️ Widget Identity (ข้อมูลตัวตน Widget)

| ข้อมูล | ค่า |
|---|---|
| **Widget ID** | `pwb.pwbcustomizecontainerdataview.PwbCustomizeContainerDataView` |
| **Package Path** | `pwb` |
| **Version** | `1.1.0` |
| **Supported Platform** | `Web` เท่านั้น |
| **Needs Entity Context** | `true` (ต้องอยู่ใน DataView) |
| **Offline Capable** | `true` |
| **Plugin Widget** | `true` (Pluggable Widget Architecture) |
| **React Version** | `~18.0.0` |
| **Build Tool** | `@mendix/pluggable-widgets-tools ^11.6.0` |
