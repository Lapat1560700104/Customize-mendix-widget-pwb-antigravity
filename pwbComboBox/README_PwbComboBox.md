# README - PWB Advanced ComboBox Ultimate Specification (v3.0.0)

**PWB ComboBox** is a premium, enterprise-grade, high-performance, and fully accessible pluggable autocomplete dropdown search widget designed for Mendix Studio Pro. It delivers a modern, glassmorphic option selection interface with full native support for **Dynamic Option Grouping (หมวดหมู่พับได้)**, **Dynamic Tag Coloring (ระบายสีตามประเภท)**, **Real Avatar Image Rendering (อวาตาร์รูปภาพจริง)**, fuzzy autocomplete segments, and direct delimited string attribute storage.

---

## 🌟 Key Features

* **Dual Selection Modes**: Supports standard `Single Select` list picker and `Multi Select` tag mode (renders selected objects as customizable pill tag badges with close buttons).
* **Dynamic Option Grouping (`optionGroup`)**: Group dropdown list options under styled categories (e.g. Frontend vs Backend) with search highlights, custom headers, and **Collapsible (พับปิด/เปิดได้)** interactivity.
* **Dynamic Tag Coloring (`tagColorExpression`)**: Apply custom Hex colors or standard CSS color terms individually to selected tag pills based on item properties (e.g. status) using a modern, semi-transparent backdrop-filter (`color-mix` engine).
* **Real Avatar Image Rendering (`optionImage`)**: Displays dynamic circular profile thumbnails or product vector icons in selected tags and dropdown lists, with an automatic linter fallback to stylized initials.
* **Fuzzy Autocomplete Search with Highlights**: Extremely responsive filtering across primary labels and subtitles with character segment matches highlighted in bold theme accent color.
* **Large List Lazy Scroll Loading**: Ultra-efficient lazy scrolling optimized to render massive list sources (10,000+ items) cleanly in 60 FPS.
* **WCAG 2.1 AA Screen Reader Compliance**: Enriched with semantic ARIA roles, active state attributes, and full keyboard navigation loops.
* **Zero-Code CSS Styling**: Custom variables for accents (`accentColor`), roundness (`borderRadius`), blurs (`bgBlur`), and heights directly configurable inside Mendix.

---

## ⚙️ Properties Configuration (XML Schema)

### 1. Data Source

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `optionsSource` | Options Source | Datasource | Yes | - | Dynamic list of objects to populate the ComboBox |
| `optionLabel` | Option Label | Expression (String) | Yes | - | Expression to render text for each option item (e.g. `$currentObject/Name`) |
| `optionDetail` | Option Detail (Subtitle) | Expression (String) | No | - | Secondary text displayed below option label (e.g. Email under Name) |
| `optionGroup` | Option Group Category | Expression (String) | No | - | Expression to group option items by a category name (e.g. `$currentObject/Category`) |
| `optionImage` | Option Image URL | Expression (String) | No | - | Expression to render dynamic profile avatar thumbnails (e.g. `$currentObject/AvatarUrl`) |

### 2. Selection

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `selectionMode` | Selection Mode | Enumeration | Yes | `single` | Choose `single` (Single Select) or `multi` (Multi Select tags mode) |
| `tagStyle` | Tag Badge Style | Enumeration | Yes | `pill` | Renders tags as standard pills (`pill`) or round colored avatar circles (`avatar`) |
| `tagColorExpression` | Tag Color (Hex/CSS) | Expression (String) | No | - | Optional expression returning color code to style tag badges dynamically |
| `selectedAttribute` | Selected Attribute | Attribute (String/Integer) | No | - | Stores selected key (Single Mode) or Delimited String (Multi Mode) |
| `delimiter` | Delimiter | String | No | `,` | Separator character used to split/join multiple values in Multi Mode String attribute |
| `selectedAssociation` | Selected Association | Association | No | - | Reference (Single) or ReferenceSet (Multi) association to store selected object |

### 3. Aesthetics

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `placeholder` | Placeholder Text | String | No | `Search and select...` | Custom grey placeholder text shown when selection is empty |
| `accentColor` | Accent Color (Hex) | String | No | `#3b82f6` | Central theme color (e.g., `#3b82f6` for Neon Blue) |
| `borderRadius` | Border Radius | String | No | `16px` | Corner roundness of borders (`16px`, `8px`, `0px`) |
| `bgBlur` | Background Blur | String | No | `16px` | Backdrop-filter glassmorphic blur level (`16px`, `8px`, `0px` to disable) |
| `popoverBg` | Dropdown Background | String | No | `rgba(...)` | Fill color of floating popover (`rgba(255,255,255,0.85)`, `#ffffff`) |
| `maxDropdownHeight` | Max Dropdown Height | String | No | `250px` | Maximum scrolling height of the results panel |

---

## ⚡ Integration & Upgrades Guide (คู่มือฟังก์ชันอัปเกรดระดับสูง)

### 1. Collapsible Option Grouping (ระบบจัดหมวดหมู่พับปิด-เปิดได้)
* **การคำนวณตำแหน่ง**: เมื่อตั้งค่า `optionGroup` วิดเจ็ตจะจัดกลุ่มข้อมูลเป็นหมวดหมู่อัตโนมัติ โดยเรียงลำดับกลุ่มตามตัวอักษร และแสดงผลกลุ่มที่มีค่าว่าง (Ungrouped/Others) ไว้ท้ายสุดเสมอ
* **ระบบพับปิด-เปิด (Collapsible Accordion)**: ผู้ใช้สามารถกดคลิกที่แถวหัวข้อกลุ่ม (Group Header) เพื่อย่อพับซ่อนตัวเลือกย่อยภายในได้ทันที ทำให้แสดงรายการที่หลากหลายในหน้าต่างสั้นๆ ได้อย่างเป็นระเบียบสุดๆ!
* **การนำทางอัจฉริยะ**: การค้นหาและการกดปุ่มลูกศรขึ้น-ลงบนคีย์บอร์ด (Keyboard Navigation) จะสแกนผ่านและไฮไลต์รายการเฉพาะกลุ่มที่เปิดแสดง (Expanded) อยู่เท่านั้น โดยข้ามกลุ่มที่พับซ่อนอยู่โดยอัตโนมัติ

### 2. Modern Dynamic Tag Coloring (สไตล์แท็กสีสันโปร่งแสงตามประเภท)
* **กลไกการเปลี่ยนสี**: ด้วยการเชื่อมต่อกับ CSS `color-mix` engine ของเบราว์เซอร์ยุคใหม่ เมื่อป้อนค่าสีผ่าน `tagColorExpression` ป้ายแท็กจะระบายสีขอบ ข้อมูลอักษรย่อ และปุ่มลบให้เด่นชัด พร้อมแปลงค่าพื้นหลังให้มีระดับความโปร่งแสงต่ำแบบพรีเมียม (8% translucent overlay) ทันทีอย่างสวยงาม โดยรองรับทั้งรหัส Hex (e.g. `#10b981`) และชื่อสี CSS ทั่วไป (e.g. `gold`, `pink`, `tomato`)
* **การใช้งานใน Dropdown**: หากใช้ร่วมกับโหมดเปิดอวาตาร์ วงกลมรูปโปรไฟล์ใน Dropdown จะตกแต่งพื้นหลังโปร่งแสงและเส้นขอบล้อมด้วยโทนสีที่ผูกกับตัวเลือกนั้นๆ โดยอัตโนมัติ ช่วยสร้างความโดดเด่นของสถานะ (เช่น สีเขียวสำหรับ Active, สีแดงสำหรับ Error) ได้อย่างเฉียบขาด!

### 3. Delimited String Attribute Mode (การเก็บข้อมูลแบบข้อความคั่นเครื่องหมาย)
* สำหรับนักพัฒนาที่ต้องการความรวดเร็วระดับ Low-code โดยข้ามการตั้งค่า Object Association ที่ซับซ้อนในฐานข้อมูล คุณสามารถผูกแอตทริบิวต์ประเภท `String` ตัวเดียวเข้ากับ ComboBox ในโหมด Multi-Select ได้ทันที:
  * **Incoming Hydration**: ตัววิดเจ็ตจะทำความสะอาดข้อมูลข้อความ (เช่น `"React, Next.js, Go"`) แล้วนำมา Split แยกแท็ก badge ขึ้นแสดงบนหน้าจอทันทีเมื่อโหลดหน้าเว็บ
  * **Outgoing Serialization**: เมื่อผู้ใช้ลบหรือเพิ่มป้าย วิดเจ็ตจะนำค่าป้ายทั้งหมดมาเรียงต่อกันคั่นด้วย `delimiter` ที่ตั้งไว้ (เช่น `, ` หรือ `| `) และเซฟบันทึกลงฐานข้อมูล Mendix แบบ Real-time ทันที!

---

## ♿ Keyboard Navigation Support (คู่มือการนำทางด้วยแป้นพิมพ์)

เพื่อความเท่าเทียมและการเข้าถึงข้อมูลตามมาตรฐานระดับสากล (WCAG 2.1 AA) ComboBox มาพร้อมคีย์บอร์ดชอร์ตคัตและปุ่มควบคุมทิศทางอย่างครบถ้วน:
* **ArrowDown / ArrowUp**: เลื่อนโฟกัสแถวตัวเลือกที่ปรากฏลงหรือขึ้นในรายการ (รวมถึงข้ามแถวหัวข้อกลุ่ม และตัวเลือกที่ถูกพับซ่อนอยูอย่างชาญฉลาด)
* **Enter**: เลือกบันทึกรายการที่กำลังโฟกัสอยู่ (หรือกางเปิดหน้า dropdown ในจังหวะแรก)
* **Escape**: พับปิดหน้าต่าง dropdown ที่ลอยอยู่ลงทันทีเพื่ออำนวยความสะดวก
* **Backspace**: หากกล่องค้นหาว่างเปล่าและเลือกใช้งาน Multi mode การกด Backspace จะลบแท็กตัวเลือกอันล่าสุด (Last Badge) ออกไปให้ทันทีโดยไม่ต้องคลิกเมาส์!

---

## 🎨 CSS Styling Architecture

### Layout CSS Variables

```css
.pwb-combobox-wrapper {
    --accent-color: #3b82f6;      /* Accent theme color */
    --accent-light: rgba(...);    /* Soft selection glow */
    --border-radius: 16px;        /* Corner radius ratio */
    --bg-blur: 16px;              /* Blur filter scale */
    --popover-bg: rgba(...);      /* Popover background fill */
}
```

### Upgraded HTML Layout Class Targets

* `.pwb-combobox-wrapper`: Root container element.
* `.pwb-combobox-group-header`: Category section title bar in the list dropdown.
* `.pwb-combobox-group-chevron`: Rotate chevron vector for collapsible accordion status.
* `.pwb-combobox-option-avatar-container`: Circular thumbnail container wrapper in the option item.
* `.pwb-combobox-option-avatar-img`: Profile image avatar loaded dynamically.
* `.pwb-combobox-tag-img`: Avatar picture loaded inside selected tag pill badges.
* `.pwb-combobox-tag-pill`: Individual tag pill layout container.
* `.pwb-search-highlight`: Bold highlights wrapping matching characters in search filter results.

---

## 🌐 Right-to-Left (RTL) Layout Support

ตัววิดเจ็ตรุ่นนี้รองรับการกระจกเลย์เอาต์ (Native Mirroring) แบบสมบูรณ์แบบ 100% สำหรับการนำไปใช้งานในบราวเซอร์ภาษาอาหรับหรือภาษาที่เขียนจากขวาไปซ้าย โดยเมื่อเปิดใช้งาน หน้ากาก UI จะสลับตำแหน่งของ:
* ข้อความพิมพ์และตัวอักษรกล่องค้นหาจัดทิศชิดขวา
* ไอคอนปุ่ม chevron ลอยตัว และปุ่มกากบาทล้างค่า ย้ายมาอยู่ฝั่งซ้ายมือ
* ลำดับการเรียงตัวของแผ่นป้ายแท็ก badge ไหลตัวจากขวาไปซ้ายอย่างสวยงาม
* อวาตาร์รูปโปรไฟล์และรูปภาพสินค้าจัดตำแหน่งเยื้องขวามือด้านหน้าตัวอักษรอย่างสมดุล!
