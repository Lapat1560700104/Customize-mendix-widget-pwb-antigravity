# README - PWB Advanced ComboBox Ultimate Specification (v3.7.0)

**PWB ComboBox v3.7.0 (Ultimate Absolute Edition)** is a premium, enterprise-grade, high-performance, and fully accessible pluggable autocomplete dropdown search widget designed for Mendix Studio Pro. It supports **three Data Source Modes (Association, Enumeration, and Boolean)** with a highly polished dynamic settings panel, native database sorting, smart status coloring, fuzzy autocomplete matching (with Thai diacritic normalization strip), collapsible grouping, and DOM recycling virtualization.

---

## 🌟 Key Features (v3.7.0 Specs)

* **Multi-Type Data Source Modes (`sourceMode`)**:
  * **Association (Entity Datasource)**: Populate options dynamically from a database query, supporting full custom Mendix widgets inside options, images, and subtitles.
  * **Enumeration Attribute**: Zero-configuration integration! Simply bind an Enum attribute, and the widget automatically detects its universe (`selectedAttribute.universe`) and active localized language captions (`selectedAttribute.formatter.format`) with zero extra data source config!
  * **Boolean Attribute**: Custom-tailor Boolean select fields! Create custom labels for True/False (e.g. "ใช่/ไม่ใช่", "Active/Inactive"), and choose whether to save native `Boolean` (`true`/`false`) or custom `String Keys` (e.g., `'Y'`/`'N'`) directly to a String database attribute.
* **Smart Dynamic Status Coloring (`getSmartEnumColor`)**:
  * Automatically color-codes dropdown options and selected tag pills using premium HSL values!
  * **Keyword Overrides**: Identifies words like *approve/active/success* (Emerald Green `#10b981`), *reject/danger/error* (Ruby Red `#ef4444`), *pending/warning* (Amber Gold `#f59e0b`), and *draft/new* (Ocean Blue `#3b82f6`).
  * **Stable Arithmetic Hashing**: For other values, it uses an arithmetic hashing algorithm (complying with `no-bitwise` ESLint rules) to generate a stable, consistent, and beautiful pastel color code based on the option key string. Every status gets its own consistent, beautiful color theme automatically!
* **Dynamic Property Visibility (`editorConfig`)**:
  * Property subgroups in Mendix Studio Pro automatically hide/show to keep the editor clean! Selecting a mode dynamically filters out all irrelevant settings, creating an extremely tidy and clean configuration panel.
* **Native Database Sorting**:
  * Replaced manual sorting dropdowns with Mendix's native **`type="sorting"`** support integrated on the `optionsSource` datasource. Developers can sort options using any Entity attribute directly via Mendix's native sort dialog.
* **Thai Diacritics Normalization Fuzzy Search**:
  * Strips Thai tone marks and diacritics (e.g. `คาเฟ่` matches typing `คาเฟ`) and matches segments fuzzily, highlighting character matches in bold theme accent color.
* **Smart Collision Detection (Popover Flipping)**:
  * Measures browser viewports in real-time, automatically flipping the popover panel upwards (`pwb-placement-top`) if it would collide with the bottom edge of the screen.
* **Large List DOM Recycling Virtualization**:
  * Recycles dropdown viewport rows. Renders only visible options, allowing it to scroll smoothly at 60fps even with massive 1,000+ databases.
* **Mendix Custom Widgets inside Options (`customItemContent`)**:
  * Allows developers to drag and drop **any Mendix widgets** directly inside the dropdown list row wrapper, allowing stars, custom badges, or complex card layouts inside the options.
* **Dual Selection Modes**: Supports standard `Single Select` (renders as text field, tag pill, or rich profile cards) and `Multi Select` tag mode (renders as removable pills with expandable collapses `+X more`).

---

## ⚙️ Properties Configuration (XML Schema)

### 1. Data Source

#### 1. Data Source Mode

| Property Key | Caption | Type | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- |
| `sourceMode` | Data Source Mode | Enumeration | `association` | Options: `association` (Entity Datasource), `enumeration` (Enum Attribute), `boolean` (Boolean Attribute). |

#### 2. Selection Binding (Visible in all Modes)

| Property Key | Caption | Type | Required | Description |
| :--- | :--- | :--- | :---: | :--- |
| `selectedAttribute` | Selected Attribute | Attribute (String/Enum/Boolean) | No | Stores single selected key/boolean or delimited string in Multi Mode. |
| `selectedAssociation` | Selected Association | Association | No | Reference/ReferenceSet to store selected object. Visible in Association Mode. |
| `delimiter` | Delimiter | String | No | Separator character used to split/join multiple values in Multi Mode String. |
| `maxVisibleTags` | Max Visible Tags | Integer | Yes | Maximum number of selected tags shown before collapsing. Set to 0 to show all. |

#### 3. Entity Datasource Config (Visible ONLY in Association Mode)

| Property Key | Caption | Type | Required | Description |
| :--- | :--- | :--- | :---: | :--- |
| `optionsSource` | Options Source | Datasource | Yes | Dynamic list of objects to populate the dropdown. |
| `optionLabel` | Option Label | Expression (String) | Yes | Expression to render text for each option item (e.g. `$currentObject/Name`). |
| `optionDetail` | Option Detail (Subtitle) | Expression (String) | No | Secondary text displayed below option label (e.g. Email under Name). |
| `optionGroup` | Option Group Category | Expression (String) | No | Expression to group option items by a category name (e.g. `$currentObject/Category`). |
| `optionImage` | Option Image URL | Expression (String) | No | Expression to render dynamic profile avatar thumbnails. |
| `optionsSort` | Sort Options | Native Sorting | No | Mendix native sorting configuration panel to sort datasource items. |
| `selectedOptionLabel` | Selected Option Label | Expression (String) | No | Expression to render custom label format ONLY when selected. |
| `enableGrouping` | Enable Grouping | Boolean | Yes (Default `true`) | Enable or disable collapsible category grouping. |

#### 4. Boolean Mode Config (Visible ONLY in Boolean Mode)

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `booleanTrueLabel` | Yes / True Display Label | String | No | `Yes` | Text to display for the 'True' option (e.g. Yes, Active, Enabled). |
| `booleanFalseLabel` | No / False Display Label | String | No | `No` | Text to display for the 'False' option (e.g. No, Inactive, Disabled). |
| `booleanOutputFormat` | Output Value Format | Enumeration | Yes | `boolean` | Options: `boolean` (Save native true/false), `string` (Save custom string keys). |
| `booleanTrueValue` | True String Value Key | String | No | `true` | String stored in database when selected True (e.g. 'active', 'Y'). |
| `booleanFalseValue` | False String Value Key | String | No | `false` | String stored in database when selected False (e.g. 'inactive', 'N'). |

---

## ⚡ Integration Guide (คู่มือการติดตั้งและการนำไปใช้)

### 1. การใช้งานโหมด Enumeration (Zero Configuration)

1. ดึงวิดเจ็ต `PwbComboBox` ไปวางบนหน้าออกแบบใน Studio Pro
2. สลับช่อง **Data Source Mode** เป็น **`Enumeration Attribute`**
3. ที่กลุ่มตั้งค่า **2. Selection Binding** ให้ผูกช่อง **`Selected Attribute`** เข้ากับ Attribute ชนิด **Enum** ในโปรเจกต์ของคุณ
4. **เสร็จสิ้น!** วิดเจ็ตจะประมวลผลดึงรายชื่อและคำแปลภาษา (Caption) ของ Enum ตัวนั้นมาสร้างเป็น Dropdown และทำสลักสีสถานะที่หรูหราโดยอัตโนมัติทันที!

### 2. การตั้งค่า Boolean แบบสลับรหัส String คีย์ (Custom String Return Values)

หากต้องการให้ตัวเลือก Boolean บันทึกค่าเป็นตัวอักษรพิเศษ (เช่น `'Y'` / `'N'`) ลงในฟิลด์ String:

1. สลับ **Data Source Mode** เป็น **`Boolean Attribute`**
2. ผูกช่อง **`Selected Attribute`** เข้ากับแอตทริบิวต์ชนิด **String**
3. ตั้งข้อความในช่อง **Yes / True Display Label** เป็น `"ใช่"` และ **No / False Display Label** เป็น `"ไม่ใช่"`
4. ตั้งค่า **Output Value Format** เป็น **`String Key Type`**
5. ระบุค่าในช่อง **True String Value Key** เป็น `"Y"` และ **False String Value Key** เป็น `"N"`
6. เมื่อผู้ใช้คลิกเลือก "ใช่" วิดเจ็ตจะบันทึกตัวอักษร `'Y'` ลงสู่ฐานข้อมูลโดยตรงทันทีอย่างแม่นยำ!

### 3. ระบบ Dynamic Status Coloring (สลักโทนสีนีออนตามสถานะ)

* ตัววิดเจ็ตจะวิเคราะห์และสลักโทนสี HSL นุ่มนวลให้แก่ตัวเลือกและป้ายแท็ก (Pills) อัตโนมัติในโหมด Enum และ Boolean
* แผ่นป้าย tag badges ด้านนอกจะผสมสีพื้นหลังโปร่งแสง 8% (`color-mix`) ล้อมกรอบและไฮไลต์นีออนเวลาผู้ใช้ Hover แถวในดร็อปดาวน์ เพื่อความสวยงามกลมกลืนตามมาตรฐาน Visual Aesthetics ยุคใหม่

---

## ♿ Keyboard Navigation Support (คู่มือการนำทางด้วยแป้นพิมพ์)

* **ArrowDown / ArrowUp**: เลื่อนโฟกัสแถวตัวเลือกขึ้นลง (ข้ามหัวข้อกลุ่มย่อยและข้ามกลุ่มที่ถูกพับซ่อนอยู่อย่างอัจฉริยะ)
* **Enter**: เลือกบันทึกรายการที่กำลังไฮไลต์อยู่ (หรือกางเปิดหน้า dropdown)
* **Escape**: พับปิดหน้าต่าง dropdown ที่ลอยอยู่ลงทันที
* **Backspace**: หากช่องค้นหาว่างและอยู่ในโหมดสะสมแท็ก (Multi Mode) การกด Backspace จะลบแท็กตัวเลือกอันล่าสุด (Last Badge) ออกไปให้ทันทีโดยอัตโนมัติ!
