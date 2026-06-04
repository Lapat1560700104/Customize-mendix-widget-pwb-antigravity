# คู่มืออ้างอิง - รายละเอียดทางเทคนิค PWB Customize Container DataView (v1.1.0)

**PWB Customize Container DataView** เป็น Mendix Pluggable Widget เกรดพรีเมียมระดับองค์กร (Enterprise-grade) ที่ออกแบบมาเพื่อทำหน้าที่เป็น **Container อัจฉริยะแบบลากสลับลำดับได้ (Drag & Drop Sortable) พร้อมรองรับสภาพแวดล้อม DataView เต็มรูปแบบ** ช่วยให้นักพัฒนาสามารถวาง Mendix Widget มาตรฐานหรือ Widget กำหนดเองใดๆ เข้าไปด้านในตัวมันได้ตามใจชอบ ช่วยให้ผู้ใช้งานทั่วไปสามารถลากสลับตำแหน่งสิ่งของต่างๆ ได้อย่างลื่นไหล และบันทึกผลการจัดลำดับกลับไปยัง String Attribute ของ Mendix โดยอัตโนมัติในรูปแบบ Comma-separated GUIDs ทำให้เหมาะอย่างยิ่งสำหรับการสร้างบอร์ดคัมบัง (Kanban Board) รายการจัดลำดับความสำคัญ (Priority List) และการจัดหน้าจอแสดงผลคอนเทนต์ที่สามารถจัดเรียงลำดับขั้นความสำคัญได้

---

## 🌟 คุณสมบัติหลัก (Key Features)

* **Nested Widget Dropzone (การลากวาง Widget ซ้อนด้านใน)**: รองรับการวาง Mendix Widget ใดๆ (เช่น Cards, Buttons, Images, หรือ Custom Widgets) เข้าไปในแต่ละแถวรายการของตัวลากวาง โดยจะส่งต่อ Entity Context ของแต่ละไอเทมไปยัง Widget ด้านในโดยอัตโนมัติผ่านการผูก Datasource แบบ `ListWidgetValue`
* **Drag & Drop Reordering (ระบบลากจัดลำดับที่ลื่นไหล)**: ใช้ **Web Pointer Events API** เต็มรูปแบบ (ไม่ใช่ HTML5 DnD แบบเดิม) รองรับ Mouse, Stylus และ Touch Screen บนโทรศัพท์มือถือและ Safari 100% พร้อมฟิสิกส์จังหวะยกการ์ดขณะลาก (Item lift physics) แอนิเมชันสั่นดีดกลับ (Wobble Snap-Back) และ Drop indicator glow
* **Keyboard Navigation & WCAG 2.1 (การเข้าถึงด้วยแป้นพิมพ์)**: สนับสนุนการควบคุมด้วยคีย์บอร์ดโดยใช้ปุ่ม Tab เพื่อย้ายโฟกัส, Spacebar/Enter เพื่อคีบจับหรือปล่อยวางการ์ดไอเทม, ปุ่มลูกศร Arrow Keys เพื่อเลื่อนระดับตำแหน่งขึ้น/ลง/ซ้าย/ขวา และ Escape เพื่อยกเลิกดีดแถวกลับคืนตำแหน่งเดิม พร้อมการแจ้งเตือนเสียง (Aria Live assertive region)
* **Container-Aware Auto-Scrolling (เลื่อนหน้าจออัตโนมัติระดับกล่องซ้อน)**: ค้นหา Scroll parent ที่มีแถบเลื่อนซ้อนอยู่ (`overflow: auto`) และสั่งเลื่อนแถบสกロールนั้นโดยตรงเมื่อลากการ์ดเข้าใกล้ขอบกล่อง และใช้ window scrolling เป็นระบบ Fallback เสมอ
* **Optimistic UI transitions (การอัปเดตแบบคาดคะเน)**: จัดการตัดดีเลย์ Asynchronous Database ของ Mendix ในช่วงลากย้ายการ์ดข้ามระหว่างคอลัมน์คัมบัน (Kanban columns) ด้วย Event-driven optimistic transition ทำให้อินเตอร์เฟซไม่กะพริบหรือการ์ดโผล่ซ้อนกัน
* **DataView Context Provider (การรองรับ Context ของหน้าหลัก)**: ถูกประกาศแบบ `needsEntityContext="true"` ทำให้นักพัฒนาสามารถดึงข้อมูล Context ของ Entity หลักส่งเข้ามาในตัว Widget เพื่อใช้ผูกเข้ากับ Attributes ต่างๆ ได้โดยตรง
* **Sorted Order Persistence (การบันทึกลำดับแบบอัตโนมัติ)**: ในทุกจังหวะที่ลากสลับตำแหน่งสำเร็จ ตัว Widget จะแปลงการจัดเรียงลำดับใหม่ให้อยู่ในรูปข้อความ GUIDs คั่นด้วยเครื่องหมายจุลภาค (เช่น `"id_3,id_1,id_2"`) แล้วเขียนค่าดังกล่าวลง String Attribute ของ Mendix โดยตรงผ่านคำสั่ง `sortedAttribute.setValue()`
* **On Sort Action (ทำงานหลังการจัดเรียง)**: เรียกใช้งาน Action แบบ Microflow หรือ Nanoflow (`onSortAction`) ทันทีเมื่อผู้ใช้ลากวางสลับตำแหน่งเสร็จสิ้น ช่วยให้นักพัฒนาสามารถรันโปรเซสบันทึกค่าลงฐานข้อมูลทางฝั่งเซิร์ฟเวอร์ต่อได้ในทันที
* **Loading & Empty States (สถานะดาวน์โหลดและไม่มีข้อมูล)**: แสดงแอนิเมชัน Spinner ระหว่างดาวน์โหลดแหล่งข้อมูล และแสดงหน้าจอรูปภาพประกอบระบุสถานะว่างเปล่า (Empty State) ที่สวยงามเมื่อไม่มีข้อมูลในรายการ

---

## ⚙️ การตั้งค่าพารามิเตอร์ (XML Schema Properties)

### 1. แหล่งข้อมูล (Data Source)

| Property Key | Caption | Type | Required | Default | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `itemsSource` | Items Source | Datasource (isList) | ✅ | — | รายการข้อมูลแบบไดนามิกที่ต้องการนำมาแสดงผลและจัดเรียงลำดับ |

### 2. คอนเทนต์กำหนดเอง (Custom Content)

| Property Key | Caption | Type | Required | Default | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `customItemContent` | Custom Option Content | Widgets | ✅ | — | ลากวาง Mendix Widget ใดๆ ตรงนี้ โดยจะได้รับ Entity Context ของแต่ละแถวโดยอัตโนมัติ |

### 3. การบันทึกข้อมูลเรียงลำดับ (Sorting Persistence)

| Property Key | Caption | Type | Required | Default | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `sortedAttribute` | Sorted IDs Attribute | Attribute (String) | ✅ | — | String Attribute บน Entity หลักเพื่อเก็บบันทึกข้อมูลลำดับไอดีคั่นด้วยจุลภาค (Comma-separated GUIDs) |
| `onSortAction` | On Sort Complete Action | Action | No | — | Action แบบ Microflow หรือ Nanoflow ที่จะทำงานทันทีเมื่อผู้ใช้ลากวางสลับตำแหน่งสำเร็จ |

### 4. รูปลักษณ์และความสวยงาม (Aesthetics)

| Property Key | Caption | Type | Required | Default | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `layoutDirection` | Layout Direction | Enumeration | No | `vertical` | ทิศทางการจัดรายการ: `vertical` = คอลัมน์แนวตั้ง · `horizontal` = แถวแนวนอนพันรอบ (Row wrap grid) |
| `dragHandleDisplay` | Drag Handle Position | Enumeration | No | `left` | การแสดงผลปุ่มลาก: `left` = แสดงปุ่มลากจับด้านซ้ายของแต่ละการ์ด · `hide` = ซ่อนปุ่มลากจับทั้งหมด |
| `accentColor` | Accent Color (Hex) | String | No | `#3b82f6` | สีหลักสำหรับเน้นกรอบแอกทีฟขณะลาก เส้นบอกทิศการวาง และเอฟเฟกต์ไฟเรืองแสงรอบตัวการ์ด |
| `borderRadius` | Border Radius | String | No | `16px` | ความโค้งมนมุมขอบของแถวไอเทมและการ์ดวางทับ (เช่น `8px`, `16px`, `0px`) |
| `themePreset` | Theme Preset | Enumeration | No | `default_rounded` | พรีเซ็ตสไตล์การแสดงผล: `default_rounded` (กลมมนมาตรฐาน), `modern_glass` (กระจกฝ้าพรีเมียม), `minimalist_flat` (แบนราบมินิมอล), `neo_brutalist` (กรอบหนาแนวอินดี้) |
| `darkModeBehavior` | Dark Mode Behavior | Enumeration | No | `auto` | การเลือกใช้งานธีมมืด: `auto` (ตรวจจับอัตโนมัติ), `light` (บังคับธีมสว่าง), `dark` (บังคับธีมมืด) |
| `itemPadding` | Card Padding | String | No | `12px 16px` | กำหนดขนาดระยะห่างด้านในการ์ดไอเทมแต่ละชิ้น (เช่น `12px 16px`, `16px`, `20px`) |
| `itemGap` | Card Spacing Gap | String | No | `12px` | กำหนดระยะห่างช่องไฟว่างระหว่างการ์ดแต่ละใบ (เช่น `12px`, `8px`, `24px`) |

### 5. การตั้งค่ากระดานคัมบัง (Kanban Settings)

| Property Key | Caption | Type | Required | Default | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `enableKanban` | Enable Kanban Support | Boolean | No | `true` | เปิดใช้งานโหมด Kanban ลากข้ามตู้คอนเทนเนอร์ (หากเป็น `false` จะล็อกให้ลากเฉพาะภายในตัวเอง) |
| `dragGroup` | Drag Group Name | String | No | — | ชื่อกลุ่มลากวาง สำหรับจับคู่วิจเจตคอลัมน์ต่างๆ ให้ลากข้ามหากันได้ (เช่น 'board-1') |
| `columnValue` | Column Value | String | No | — | ค่าสถานะข้อความประจำคอลัมน์นี้ สำหรับอัปเดตลงในการ์ดที่ย้ายเข้ามา (เช่น 'Done', 'ToDo') |
| `itemColumnAttribute` | Item Column Attribute | Attribute | No | — | String หรือ Enum Attribute บนไอเทมการ์ดที่จะถูกเขียนสถานะใหม่ทับลงไปเมื่อย้ายคอลัมน์สำเร็จ |

### 6. การตั้งค่าประสิทธิภาพ (Performance Settings)

| Property Key | Caption | Type | Required | Default | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `saveDelay` | Save Delay (ms) | Integer | ✅ | `0` | ค่าหน่วยมิลลิวินาทีสำหรับการหน่วงเซฟ (Debounce) เพื่อลดภาระการเขียนบันทึกเข้าเซิร์ฟเวอร์แบบถี่ๆ (ต้องมีค่า >= 0) |

---

## 🎨 โครงสร้างการแต่งสไตล์ด้วย CSS (CSS Styling Architecture)

Widget ได้เปิดเผยตัวแปร CSS Custom Properties (Variables) ต่างๆ เอาไว้ใน `PwbCustomizeContainerDataView.css` เพื่อความสะดวกในการกำหนดธีมสีของนักพัฒนา

### Layout CSS Variables (ตัวแปร CSS สำหรับปรับสไตล์)

```css
.pwb-drag-container {
    --accent-color: #3b82f6;    /* สีธีมหลักที่ส่งมาจากคุณสมบัติ Mendix */
    --border-radius: 16px;      /* ความโค้งมนขอบการ์ดของแต่ละแถว */
    --accent-glow: rgba(...);   /* แสงเรืองรองขณะลากการ์ดมาทับ (คำนวณอัตโนมัติจากสีหลัก) */
    
    /* Design Spacing */
    --pwb-item-padding: 12px 16px; /* ขนาด Padding ภายในการ์ดแต่ละใบ */
    --pwb-item-gap: 12px;          /* ขนาดช่องว่าง Gap ระหว่างแต่ละการ์ด */
    
    /* Design Tokens Bridging to Mendix Atlas UI */
    --pwb-bg-main: var(--mx-bg-color-main);  /* สีพื้นหลังตัวการ์ดหลัก */
    --pwb-bg-hover: var(--mx-bg-color-secondary); /* สีพื้นหลังเมื่อเมาส์โฮเวอร์การ์ด */
    --pwb-border-color: var(--mx-border-color); /* สีเส้นขอบตัวการ์ด */
    --pwb-text-primary: var(--mx-text-color-primary); /* สีตัวอักษรของเนื้อหาหลัก */
}
```

### คลาสหลักใน HTML สำหรับเขียน CSS เจาะจง (Core HTML Layout Class Targets)

* `.pwb-customize-container-dataview-wrapper` — กรอบด้านนอกสุดของ Widget สามารถใช้สำหรับเขียนคลาสทับได้
* `.pwb-drag-container` — คอนเทนเนอร์แกนหลัก (Flex Container) สำหรับแถวรายการที่ลากวางได้
* `.pwb-drag-container.pwb-direction-vertical` — ทำงานเมื่อคุณสมบัติ `layoutDirection = "vertical"`
* `.pwb-drag-container.pwb-direction-horizontal` — ทำงานเมื่อคุณสมบัติ `layoutDirection = "horizontal"`
* `.pwb-draggable-row-item` — แผ่นการ์ด/แถวรายการแต่ละแถวที่สามารถทำการจับลากได้
* `.pwb-draggable-row-item.pwb-dragging` — คลาสสถานะที่จะทำงานเฉพาะกับการ์ดที่กำลังโดนลากอยู่ ณ ขณะนั้น (ความโปร่งใสลดลง, กรอบเปลี่ยนเป็นเส้นประ)
* `.pwb-draggable-row-item.pwb-drag-over` — คลาสสถานะที่จะทำงานกับแถวการ์ดอื่นๆ ที่โดนการ์ดตัวลากวางทับซ้อนอยู่ (ขอบจะแสดงแสงเรืองรองสี Accent)
* `.pwb-drag-handle` — คอนเทนเนอร์ไอคอน 6 จุดสำหรับให้ผู้ใช้เล็งเมาส์มาเพื่อทำการคลิกค้างแล้วลากจับ
* `.pwb-draggable-item-content` — กรอบครอบสำหรับแสดงผล Mendix Widget ทั้งหมดที่เรานำมาลากวางซ้อนด้านใน (รองรับ Flex-grow เพื่อขยายตามความกว้างของหน้าจอ)
* `.pwb-loading-state` — คอนเทนเนอร์แอนิเมชันโหลดดิ้งแสดงผลหมุนติ้วๆ ขณะ Mendix กำลังดึงข้อมูล
* `.pwb-empty-state` — แผงพรีเซนต์ภาพประกอบ empty state แสดงเมื่อรายการจาก `itemsSource` ไม่มีค่าใดๆ เลย
* `.pwb-empty-icon` — คลาสควบคุมแอนิเมชันชีพจรเต้น (Pulse animation) ของรูปไอคอนในแผง Empty state

---

## 🔄 กลไกการบันทึกการจัดเรียง (Sorted Order Persistence Flow)

```text
1. ผู้ใช้ทำการลากการ์ดไปสลับวางในตำแหน่งใหม่
         │
         ▼
2. Component 'DragContainer' ทำการคำนวณสลับตำแหน่งอาร์เรย์ในระบบ React State
         │
         ▼
3. คอลแบ็กฟังก์ชัน 'onOrderChange' ทำงานพร้อมส่งชุด GUIDs ชุดใหม่:
   ["task-3", "task-1", "task-5", "task-2", "task-4"]
         │
         ▼
4. โปรแกรมสั่งบันทึก: sortedAttribute.setValue("task-3,task-1,task-5,task-2,task-4")
   → ทำการเขียนข้อมูลสายอักขระ (String) คั่นด้วยจุลภาคลงใน Attribute ของ Mendix
         │
         ▼
5. โปรแกรมสั่งเรียกใช้: onSortAction.execute()
   → สั่งรันชุดคำสั่ง Microflow หรือ Nanoflow ที่นักพัฒนากำหนดไว้ทันที
         │
         ▼
6. เมื่อมีการโหลดหน้าจอขึ้นมาใหม่ในครั้งถัดไป ตัว Widget จะอ่านค่าจาก 'sortedAttribute.value'
   → แหล่งข้อมูลจะถูกจัดเรียงตำแหน่งใหม่ตาม GUIDs ที่เซฟไว้ล่าสุดโดยอัตโนมัติ
```

---

## 🗂️ การโหลดเรียงตำแหน่งหน้าแรก (Sorted Order Hydration on Load)

ในขั้นตอนการเริ่มต้นทำงาน (Initialization) ของตัว Widget โปรแกรมจะทำการอ่านข้อมูลล่าสุดที่จัดเก็บอยู่ในคุณสมบัติ `sortedAttribute.value` และนำตำแหน่งของไอเทม GUIDs นั้นมาจัดระเบียบลำดับของตัวแปรอาร์เรย์ `itemsSource.items` ใหม่ให้สอดคล้องกันอย่างสมบูรณ์แบบ ทั้งนี้ หากมีรายการใหม่ที่ถูกเพิ่มเข้ามาในดาต้าเบสทีหลังและยังไม่ถูกจัดลำดับ (ยังไม่มีข้อมูลใน String) ตัว Widget จะจัดลำดับของไอเทมเหล่านั้นให้ออกไปปรากฏต่อท้ายที่สุดของลิสต์รายการโดยอัตโนมัติ

```typescript
// โครงสร้างตรรกะภายในระบบจัดคิวลำดับของ Widget
const sortedIds = sortedAttribute.value?.split(",") ?? [];
const reordered = [
    ...sortedIds.map(id => items.find(i => i.id === id)).filter(Boolean),
    ...items.filter(i => !sortedIds.includes(i.id))  // ไอเทมใหม่จะเอาไปปัดต่อท้ายรายการ
];
```

---

## 🛠️ คำสั่งสำหรับนักพัฒนาในการต่อยอดและบิวด์ชิ้นงาน (Developer Lifecycle Commands)

### 1. ติดตั้งไลบรารีที่จำเป็น (Install Dependencies)

```bash
cd pwbCustomizeContainerDataView
npm install
```

### 2. หน้าบอร์ดทดลองแบบ Standalone (Standalone Playground - แนะนำมาก!)

คุณสามารถเปิดเซิร์ฟเวอร์จำลองการลากวางได้อย่างรวดเร็วที่พอร์ต `http://localhost:3002/` เพื่อใช้ในการทดสอบแก้ไข UI:

```bash
npm run playground
```

_มีแผงเมนูด้านข้างที่เปิดให้คุณคลิกสลับปรับทิศทางจัดหน้า (Layout), ปรับสีธีม (Accent color), ความโค้งมนมุมขอบ (Border radius), และลองลากสลับตำแหน่งเล่นได้แบบเรียลไทม์ โดยไม่ต้องรันโปรเซสแพ็กไฟล์หรือเปิดโปรแกรม Mendix Studio Pro แต่อย่างใด_

### 3. คอมไพล์ทดสอบความถูกต้อง (Build Development Check)

```bash
npm run build
```

### 4. ตรวจสอบโค้ดและปรับฟอร์แมต (Lint & Format)

```bash
npm run lint:fix
```

### 5. แพ็กไฟล์จัดส่งเข้าหน้า Mendix Project (Production Release & Bundle)

```bash
npm run release
```

_ไฟล์ผลลัพธ์: ไฟล์ในรูปแบบแพ็กเกจ `.mpk` จะถูกสร้างขึ้นมาในตำแหน่ง `dist/1.1.0/pwb.PwbCustomizeContainerDataView_1.1.0_YYYYMMDD_HHMMSS.mpk` และตัวสคริปต์จะคัดลอกไฟล์เวอร์ชันนี้ไปทับในโฟลเดอร์ `widgets/` ของโปรเจกต์ Mendix โดยอัตโนมัติทันที_

---

## 📁 โครงสร้างไฟล์ทั้งหมดภายในโปรเจกต์ (Project File Structure)

```bash
pwbCustomizeContainerDataView/
├── tsconfig.json                 # การกำหนดค่าสำหรับการคอมไพล์ TypeScript
├── package.json                  # ข้อมูลรายละเอียดสคริปต์ และ DevDependencies ต่างๆ
├── playground/                   # โค้ดระบบบอร์ดบิลเดอร์จำลองลากวางสำหรับทำงานบนเว็บโลคอล
│   ├── index.html                # ไฟล์ทางเข้าหลัก HTML
│   ├── main.tsx                  # จุดเริ่มต้น React ของหน้าคอนโซล Playground
│   └── vite.config.ts            # การตั้งค่า Vite Server (รันบนพอร์ต 3002)
├── typings/
│   └── PwbCustomizeContainerDataViewProps.d.ts  # ไฟล์อินเทอร์เฟซไทป์ดิ้งของ Mendix (บิวด์ออโต้)
└── src/
    ├── package.xml                                      # ข้อมูลตั้งค่าสำหรับห่อหุ้มไฟล์ .mpk
    ├── PwbCustomizeContainerDataView.xml                # ข้อมูลโมเดลคุณสมบัติต่างๆ ใน Studio Pro
    ├── PwbCustomizeContainerDataView.tsx                # จุดเชื่อมแกนหลัก React Component
    ├── PwbCustomizeContainerDataView.editorPreview.tsx  # ส่วนพรีวิวโครงสร้างแบบสมจริงใน Studio Pro
    ├── PwbCustomizeContainerDataView.editorConfig.ts    # ชุดตรวจจับกฎปัญหาสำหรับ Studio Pro
    ├── components/
    │   └── DragContainer.tsx      # กลไกระบบ Drag & Drop, Web Pointer Events และ Keyboard/Accessibility Engine
    └── ui/
        └── PwbCustomizeContainerDataView.css  # ชุด CSS และ CSS Variables สำหรับตกแต่งรูปลักษณ์
```

---

## 🧩 คำแนะนำการใช้งานภายในโปรแกรม Mendix Studio Pro

### ขั้นตอนที่ 1: วาง Widget บนหน้าเพจ
ค้นหาชื่อลากวาง **Pwb Customize Container Data View** จากกล่องเครื่องมือ Toolbox นำมาวางบนหน้าเพจของ Mendix ทั้งนี้กรอบเพจจำเป็นต้องเป็นสเปซที่มีตัวแปร Context ของ Entity อยู่ด้วย (ระบบ Context ของ Entity จะถูกตรวจพบและส่งเข้าตัว Widget โดยอัตโนมัติ)

### ขั้นตอนที่ 2: ตั้งค่าแหล่งข้อมูลดาต้า
ไปที่แท็บตั้งค่า **Data Source** → หัวข้อ **Items Source**: เลือกแหล่งข้อมูลไอเทมที่คุณต้องการนำข้อมูลขึ้นมาแสดงผลและสลับลำดับบนหน้าเว็บบอร์ด

### ขั้นตอนที่ 3: ออกแบบชุดข้อมูลด้านในการ์ด
ในส่วนตั้งค่าของ **Custom Content** → หัวข้อ **Custom Option Content**: ลากเอาองค์ประกอบต่างๆ ของ Mendix มาหยอดใส่ตรงนี้ (เช่น วางการ์ด, ป้ายกำกับข้อความ, ภาพโปรไฟล์, ปุ่ม) โดยทุกชิ้นจะทำงานในระดับ Context แถวของข้อมูลชิ้นนั้นๆ เสมอ สามารถดึงเอาแอททริบิวต์มาผูกแสดงผลได้โดยตรง

### ขั้นตอนที่ 4: เชื่อมตัวแปรจัดเก็บลำดับ
ไปที่แท็บตั้งค่า **Sorting Persistence** → หัวข้อ **Sorted IDs Attribute**: เลือกเชื่อมคุณสมบัติเข้ากับแอททริบิวต์ประเภท `String` บน Context Entity หลัก (ตัวอย่างเช่นแอททริบิวต์ `TaskBoard.SortedTaskIds`) ซึ่งตัวแปรข้อความยาวๆ นี้จะได้รับการบันทึกข้อมูลไอดีเรียงสลับตัวเลขใหม่ทุกครั้งเมื่อลากวางเสร็จ

### ขั้นตอนที่ 5: ตั้งค่า Action หลังจัดตำแหน่งสำเร็จ (ไม่บังคับ)
ในส่วนตั้งค่าของ **Sorting Persistence** → หัวข้อ **On Sort Complete Action**: คุณสามารถเลือกผูกเข้ากับ Microflow หรือ Nanoflow เพื่อสั่งการให้ระบบรันโปรเซสเซฟความคืบหน้า คอมมิทข้อมูลการเปลี่ยนแปลงลำดับใหม่ หรือส่งคำสั่งแจ้งเตือน (Notification) ต่อไปยังเซิร์ฟเวอร์ปลายทางภายนอกตามความต้องการได้ทันที
