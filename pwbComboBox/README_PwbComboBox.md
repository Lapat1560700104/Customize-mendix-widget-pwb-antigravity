# README - PWB Advanced ComboBox Ultimate Specification (v3.2.0)

**PWB ComboBox** is a premium, enterprise-grade, high-performance, and fully accessible pluggable autocomplete dropdown search widget designed for Mendix Studio Pro. It delivers a modern, glassmorphic option selection interface with native support for **Dynamic Option Grouping (หมวดหมู่พับได้)**, **Dynamic Tag Coloring (ระบายสีตามประเภท)**, **Real Avatar Image Rendering (อวาตาร์รูปภาพจริง)**, **Multi-Style Selected Representations (สไตล์แสดงผลเมื่อเลือก)**, **Grid Option Cards (ตารางกริดสองคอลัมน์)**, fuzzy autocomplete segments, and direct delimited string attribute storage.

---

## 🌟 Key Features

* **Dual Selection Modes**: Supports standard `Single Select` list picker and `Multi Select` tag mode (renders selected objects as customizable pill tag badges with close buttons).
* **Option List Alphabetical Sorting (`sortOrder`)**: Sort dropdown options alphabetically in ascending (`asc` ก-ฮ / A-Z) or descending (`desc` ฮ-ก / Z-A) sequence, or retain original Mendix datasource sequence.
* **Premium Custom Selected Display Styles (`singleSelectStyle`)**: Renders the selected option in Single-Select mode as a traditional text input field (`text`), a beautiful removable badge (`pill`), or a premium full card (`rich`) showing profile avatar, label, and subtitle.
* **Dynamic Option Grouping (`optionGroup`)**: Group dropdown list options under styled categories (e.g. Frontend vs Backend) with search highlights, custom headers, and **Collapsible (พับปิด/เปิดได้)** interactivity.
* **Dynamic Tag Coloring (`tagColorExpression`)**: Apply custom Hex colors or standard CSS color terms individually to selected tag pills based on item properties (e.g. status) using a modern, semi-transparent backdrop-filter (`color-mix` engine).
* **Real Avatar Image Rendering (`optionImage`)**: Displays dynamic profile thumbnails or product vector icons in selected tags and dropdown lists, with an automatic linter fallback to stylized initials.
* **Custom Dropdown Layout & Options Customization**:
  * **Layouts (`dropdownLayout`)**: Select between standard vertical list (`list`) or a compact 2-column grid cards arrangement (`grid`).
  * **Avatar Shapes (`optionAvatarShape`)**: Style profile/product thumbnails as perfect circles (`circle`), squircle/rounded rectangles (`rounded`), or perfect squares (`square`).
  * **Option Checkboxes (`showOptionCheckbox`)**: Render customized left-aligned checkboxes (for multi-select) or radio buttons (for single-select) to provide clear interactive indicators.
  * **Dynamic Hover Highlights (`highlightColorMode`)**: Automatically neon-glow options on hover using the global accent color (`accent`) or each option's unique category color (`optionColor`).
* **Fuzzy Autocomplete Search with Highlights**: Extremely responsive filtering across primary labels and subtitles with character segment matches highlighted in bold theme accent color.
* **Large List Lazy Scroll Loading**: Ultra-efficient lazy scrolling optimized to render massive list sources (10,000+ items) cleanly in 60 FPS.
* **WCAG 2.1 AA Screen Reader Compliance**: Enriched with ARIA roles, checkboxes, active state attributes, and full keyboard navigation loops.
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
| `sortOrder` | Sort Dropdown Options | Enumeration | Yes | `none` | Options: `none` (Datasource sequence), `asc` (A to Z), `desc` (Z to A) |
| `sortField` | Sort Field | Enumeration | Yes | `label` | Specify item field to sort: `label` (Option Label), `detail` (Option Detail/Subtitle), `group` (Group Category) |
| `selectedOptionLabel` | Selected Option Label | Expression (String) | No | - | Optional expression to render custom label format ONLY when selected |

### 2. Selection

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `selectionMode` | Selection Mode | Enumeration | Yes | `single` | Choose `single` (Single Select) or `multi` (Multi Select tags mode) |
| `singleSelectStyle` | Single Select Style | Enumeration | Yes | `text` | Selected value layout: `text` (standard field), `pill` (badge tag), `rich` (Avatar + Label + Subtitle card) |
| `showSelectedAvatar` | Show Selected Avatar | Boolean | Yes | `true` | Enable or disable rendering avatar thumbnails in tags or selected fields |
| `tagStyle` | Tag Badge Style | Enumeration | Yes | `pill` | Renders tags as standard pills (`pill`) or round colored avatar circles (`avatar`) |
| `tagColorExpression` | Tag Color (Hex/CSS) | Expression (String) | No | - | Optional expression returning color code to style tag badges dynamically |
| `selectedAttribute` | Selected Attribute | Attribute (String/Integer) | No | - | Stores selected key (Single Mode) or Delimited String (Multi Mode) |
| `delimiter` | Delimiter | String | No | `,` | Separator character used to split/join multiple values in Multi Mode String attribute |
| `maxVisibleTags` | Max Visible Tags | Integer | Yes | `0` | Maximum number of selected tags shown before collapsing. Set to 0 to show all |
| `selectedAssociation` | Selected Association | Association | No | - | Reference (Single) or ReferenceSet (Multi) association to store selected object. Must link to optionsSource |

### 3. Aesthetics

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `placeholder` | Placeholder Text | String | No | `Search and select...` | Custom grey placeholder text shown when selection is empty |
| `accentColor` | Accent Color (Hex) | String | No | `#3b82f6` | Central theme color (e.g., `#3b82f6` for Neon Blue) |
| `borderRadius` | Border Radius | String | No | `16px` | Corner roundness of borders (`16px`, `8px`, `0px`) |
| `bgBlur` | Background Blur | String | No | `16px` | Backdrop-filter glassmorphic blur level (`16px`, `8px`, `0px` to disable) |
| `popoverBg` | Dropdown Background | String | No | `rgba(...)` | Fill color of floating popover (`rgba(255,255,255,0.85)`, `#ffffff`) |
| `maxDropdownHeight` | Max Dropdown Height | String | No | `250px` | Maximum scrolling height of the results panel |
| `dropdownLayout` | Dropdown List Layout | Enumeration | Yes | `list` | Arrange items vertically (`list`) or in a compact card grid (`grid`) |
| `optionAvatarShape` | Option Avatar Shape | Enumeration | Yes | `circle` | Shape for thumbnail pictures: `circle` (round), `rounded` (squircle), `square` (sharp block) |
| `showOptionCheckbox` | Show Checkbox/Radio Option | Boolean | Yes | `false` | Display Left-aligned interactive checkboxes (multi) or radio buttons (single) |
| `highlightColorMode` | Hover Highlight Color Mode | Enumeration | Yes | `accent` | Highlight color on hover: `accent` (theme main) or `optionColor` (item dynamic category color) |
| `searchDebounce` | Search Input Debounce (ms) | Integer | Yes | `300` | Time in ms to wait after typing stops before filtering dropdown lists |

---

## ⚡ Integration & Upgrades Guide (คู่มือฟังก์ชันอัปเกรดระดับสูง)

### 1. Collapsible Option Grouping (ระบบจัดหมวดหมู่พับปิด-เปิดได้)
* **การคำนวณตำแหน่ง**: เมื่อตั้งค่า `optionGroup` วิดเจ็ตจะจัดกลุ่มข้อมูลเป็นหมวดหมู่อัตโนมัติ โดยเรียงลำดับกลุ่มตามตัวอักษร และแสดงผลกลุ่มที่มีค่าว่าง (Ungrouped/Others) ไว้ท้ายสุดเสมอ
* **ระบบพับปิด-เปิด (Collapsible Accordion)**: ผู้ใช้สามารถกดคลิกที่แถวหัวข้อกลุ่ม (Group Header) เพื่อย่อพับซ่อนตัวเลือกย่อยภายในได้ทันที ทำให้แสดงรายการที่หลากหลายในหน้าต่างสั้นๆ ได้อย่างเป็นระเบียบสุดๆ!
* **การนำทางอัจฉริยะ**: การค้นหาและการกดปุ่มลูกศรขึ้น-ลงบนคีย์บอร์ด (Keyboard Navigation) จะสแกนผ่านและไฮไลต์รายการเฉพาะกลุ่มที่เปิดแสดง (Expanded) อยู่เท่านั้น โดยข้ามกลุ่มที่พับซ่อนอยู่โดยอัตโนมัติ

### 2. Modern Dynamic Tag Coloring (สไตล์แท็กสีสันโปร่งแสงตามประเภท)
* **กลไกการเปลี่ยนสี**: ด้วยการเชื่อมต่อกับ CSS `color-mix` engine ของเบราว์เซอร์ยุคใหม่ เมื่อป้อนค่าสีผ่าน `tagColorExpression` ป้ายแท็กจะระบายสีขอบ ข้อมูลอักษรย่อ และปุ่มลบให้เด่นชัด พร้อมแปลงค่าพื้นหลังให้มีระดับความโปร่งแสงต่ำแบบพรีเมียม (8% translucent overlay) ทันทีอย่างสวยงาม โดยรองรับทั้งรหัส Hex (e.g. `#10b981`) และชื่อสี CSS ทั่วไป (e.g. `gold`, `pink`, `tomato`)
* **การใช้งานใน Dropdown**: หากใช้ร่วมกับโหมดเปิดอวาตาร์ วงกลมรูปโปรไฟล์ใน Dropdown จะตกแต่งพื้นหลังโปร่งแสงและเส้นขอบล้อมด้วยโทนสีที่ผูกกับตัวเลือกนั้นๆ โดยอัตโนมัติ ช่วยสร้างความโดดเด่นของสถานะ (เช่น สีเขียวสำหรับ Active, สีแดงสำหรับ Error) ได้อย่างเฉียบขาด!

### 3. Custom Selected Display Formats (สไตล์แสดงผลเมื่อเลือกรายการเดี่ยว)
* สำหรับโหมด Single Select เมื่อผู้ใช้เปิดใช้งานคุณสมบัติ `singleSelectStyle` ที่ไม่ใช่ `text`:
  * **`pill` Style**: รายการที่เลือกจะเปลี่ยนสัณฐานเป็น Badge ป้ายกำกับโค้งมนสวยงามลอยอยู่บนช่องกรอกคั่นกลาง พร้อมรูปอวาตาร์และปุ่มลบค่าอย่างเป็นเอกเทศ
  * **`rich` Style**: แสดงผลแบบการ์ดประชิดตัวสมบูรณ์แบบ ทั้งไอคอนรูปกลม/เหลี่ยม, หัวข้อหลักตัวหนา และคำบรรยายย่อยซ้อนกันอย่างมีระดับ
  * **UX Interactive Transform**: เมื่อผู้ใช้ทำการโฟกัสคลิกกล่องอินพุตเพื่อพิมพ์ค้นหา ตัวการ์ดหรือป้ายสะกดค่าจะสไลด์หายไปอย่างแนบเนียนเพื่อเผยช่องพิมพ์ตัวอักษรพิมพ์ค้นหาแบบโล่ง และจะแสดงผลการ์ดสวยงามใหม่อีกครั้งเมื่อปิด Dropdown หรือเลือกรายการเสร็จสิ้น!

### 4. Grid Options Layout & Checkbox Indicators (การแสดงผลแบบตารางและการทำกล่องเครื่องหมาย)
* **ตารางการ์ด Dropdown (`grid` layout)**: เหมาะอย่างยิ่งสำหรับความต้องการเลือกรูปสินค้า, รูปภาพพนักงาน หรือไอคอนแบบรวดเร็ว โดยจะแปลงรายการ Dropdown เป็นการ์ดสองคอลุมน์แบบขนาน จัดระเบียบด้วย Grid System สวยงาม
* **กล่องทำเครื่องหมายด่วน (`showOptionCheckbox`)**: แสดงผลช่อง Radio block หรือ Checkbox คัสตอมทางซ้ายมือเพื่อให้ผู้ใช้สัมผัสถึงความลึกของการติ๊กเลือกตัวเลือกได้ดียิ่งขึ้น

---

## ♿ Keyboard Navigation Support (คู่มือการนำทางด้วยแป้นพิมพ์)

เพื่อความเท่าเทียมและการเข้าถึงข้อมูลตามมาตรฐานระดับสากล (WCAG 2.1 AA) ComboBox มาพร้อมคีย์บอร์ดชอร์ตคัตและปุ่มควบคุมทิศทางอย่างครบถ้วน:
* **ArrowDown / ArrowUp**: เลื่อนโฟกัสแถวตัวเลือกที่ปรากฏลงหรือขึ้นในรายการ (รวมถึงข้ามแถวหัวข้อกลุ่ม และตัวเลือกที่ถูกพับซ่อนอยูอย่างชาญฉลาด)
* **Enter**: เลือกบันทึกรายการที่กำลังโฟกัสอยู่ (หรือกางเปิดหน้า dropdown ในจังหวะแรก)
* **Escape**: พับปิดหน้าต่าง dropdown ที่ลอยอยู่ลงทันทีเพื่ออำนวยความสะดวก
* **Backspace**: หากกล่องค้นหาว่างเปล่าและเลือกใช้งาน Multi mode การกด Backspace จะลบแท็กตัวเลือกอันล่าสุด (Last Badge) ออกไปให้ทันทีโดยไม่ต้องคลิกเมาส์!

---

## 🎨 CSS Styling Architecture

### Upgraded HTML Layout Class Targets

* `.pwb-combobox-wrapper`: Root container element.
* `.pwb-avatar-circle`, `.pwb-avatar-rounded`, `.pwb-avatar-square`: Controls shape definitions of image profiles dynamically.
* `.pwb-layout-grid`: Class injected to container to enable compact two-column card placements.
* `.pwb-combobox-option-checkbox-wrapper`: Left side custom checkbox or radio button wrapper.
* `.pwb-combobox-single-rich-display`: Card markup layer displaying selected profile image + title + subtitle.
* `.pwb-combobox-single-pill-display`: Inline tag displaying single selection as a badge capsule inside input bar.
* `.pwb-highlight-dynamic`: Applies color-mix glow and unique border boundaries dynamically for category highlights.

---

## 🌐 Right-to-Left (RTL) Layout Support

ตัววิดเจ็ตรุ่นนี้รองรับการกระจกเลย์เอาต์ (Native Mirroring) แบบสมบูรณ์แบบ 100% สำหรับการนำไปใช้งานในบราวเซอร์ภาษาอาหรับหรือภาษาที่เขียนจากขวาไปซ้าย โดยเมื่อเปิดใช้งาน หน้ากาก UI จะสลับตำแหน่งของ:
* ข้อความพิมพ์และตัวอักษรกล่องค้นหาจัดทิศชิดขวา
* ไอคอนปุ่ม chevron ลอยตัว และปุ่มกากบาทล้างค่า ย้ายมาอยู่ฝั่งซ้ายมือ
* ลำดับการเรียงตัวของแผ่นป้ายแท็ก badge ไหลตัวจากขวาไปซ้ายอย่างสวยงาม
* อวาตาร์รูปโปรไฟล์และรูปภาพสินค้าจัดตำแหน่งเยื้องขวามือด้านหน้าตัวอักษรอย่างสมดุล!

---

## 📊 โครงสร้างข้อมูลแหล่งเชื่อมโยง (Section Data Source: Source Type Attributes)

เพื่อให้เข้าใจโครงสร้างการเชื่อมต่อข้อมูลของวิดเจ็ตใน Mendix Studio Pro และ Mendix Client API ด้านล่างนี้คือข้อมูลสถาปัตยกรรมเชิงลึกของแหล่งข้อมูล (DataSource) ที่ใช้งานในวิดเจ็ต `pwbComboBox` นี้:

### 1. โครงสร้างประเภทแหล่งข้อมูล (Source Type Attributes ใน XML)
ในไฟล์โครงสร้างคุณสมบัติ (`PwbComboBox.xml`) แหล่งข้อมูลหลักจะถูกประกาศเป็นประเภท `datasource` โดยรับค่าเป็นรายการวัตถุ (`isList="true"`) ซึ่งระบุคุณสมบัติดังนี้:

```xml
<property key="optionsSource" type="datasource" isList="true" required="true">
    <caption>Options Source</caption>
    <description>Dynamic list of options to display in the dropdown</description>
</property>
```

### 2. โครงสร้างข้อมูลในโค้ด React / TypeScript (ListValue API)
เมื่อ Mendix Compiler ทำการแปลงข้อมูลจากโมเดลมาเป็น Props ในฝั่ง React ตัวแปร `optionsSource` จะมีรูปแบบโครงสร้างข้อมูลเป็นอินเตอร์เฟซ **`ListValue`** ซึ่งประกอบด้วยรายละเอียดสมาชิกหลักดังนี้:

#### A. ข้อมูลและสถานะ (Data & States)
* **`status`** (`"loading"` | `"available"` | `"unavailable"`):
  * **`loading`**: ระบบหลังบ้านกำลังดึงข้อมูล (Async Fetching) วิดเจ็ตจะแสดงสถานะโหลดข้อความหรือ Loading Message
  * **`available`**: ข้อมูลถูกโหลดเสร็จสมบูรณ์ วิดเจ็ตจะนำรายการไปเรนเดอร์ใน Dropdown List
  * **`unavailable`**: เกิดข้อผิดพลาดในการโหลด หรือไม่มีสิทธิ์เข้าถึงอ็อบเจกต์ วิดเจ็ตจะเข้าสู่สถานะว่างเปล่าหรือมีข้อความ No Options Found
* **`items`** (`ObjectItem[]` | `undefined`):
  * อาร์เรย์ของอ็อบเจกต์จริง ซึ่งแต่ละตัวเรียกว่า **`ObjectItem`** 
  * แต่ละ `ObjectItem` จะมีคุณสมบัติสำคัญที่เป็น **GUID** (เช่น `item.id`) ซึ่งเป็น String ประจำตัววัตถุที่ไม่ซ้ำกันในฐานข้อมูลของ Mendix โดยวิดเจ็ตใช้เป็นคีย์เชื่อมโยงและนำไปจัดเก็บบันทึกรหัสลงใน `selectedAttribute` หรือผูกความสัมพันธ์กับ `selectedAssociation`

#### B. ข้อมูลปริมาณและการแบ่งหน้า (Paging & Totals)
* **`totalCount`** (`number` | `undefined`): จำนวนวัตถุทั้งหมดในฐานข้อมูล
* **`hasMoreItems`** (`boolean`): มีวัตถุในหน้าถัดไปอีกหรือไม่ (ใช้ตรวจสอบเพื่อดึงข้อมูลเพิ่มเมื่อ Scroll ลงล่าง)
* **`offset`** (`number`): ลำดับแถวเริ่มต้นในการดึงข้อมูลปัจจุบัน
* **`limit`** (`number`): จำนวนแถวข้อมูลสูงสุดที่ดึงมาแสดงผลต่อหนึ่งครั้ง

#### C. ฟังก์ชันโต้ตอบเชิงคำสั่ง (Interactive operations)
วิดเจ็ตสามารถจัดการคัดกรอง หรือปรับขนาดข้อมูลจากฝั่งบราวเซอร์กลับไปยังฐานข้อมูล Mendix ได้โดยตรงผ่านฟังก์ชันเหล่านี้:
* **`setPageSize(size: number)`**: กำหนดจำนวนแถวข้อมูลสูงสุดที่ต้องการโหลด
* **`setOffset(offset: number)`**: สั่งเปลี่ยนจุดเริ่มต้นข้อมูลเพื่อทำระบบแบ่งหน้า (Paging)
* **`setSortOrder(SortInstruction[] | undefined)`**: สั่งเรียงลำดับข้อมูลระดับ Server (Server-side Sorting)
* **`setFilter(FilterCondition | undefined)`**: ส่งตัวกรองไปประมวลผลค้นหาข้อมูลที่ Database โดยตรง (Server-side Filtering) ซึ่งทำงานสอดรับกับค่าหน่วงเวลา `searchDebounce`
