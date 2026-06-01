# README - PWB Advanced ComboBox Ultimate Specification (v4.0.0)

**PWB ComboBox v4.0.0 (Pure Attribute & Purged Datasource Edition)** is a premium, enterprise-grade, high-performance, and fully accessible pluggable autocomplete dropdown search widget designed for Mendix Studio Pro. It features a properties panel matching the **native Mendix Studio Pro properties sheet 100%**, supports **complete native events (On Change, On Enter, On Leave, and On filter input change)**, and includes a dedicated **Advanced** tab featuring 5 state-of-the-art searching algorithms (including fuzzy matching).

---

## 🌟 Key Features (v4.0.0 Specs)

* **100% Screenshot-Identical "Data source" Layout**:
  * **Source**: Toggles between **Context** (options come from page context) and **Database** (options come from database list query).
  * **Type**: Toggles between **Association**, **Enumeration**, and **Boolean** (only visible when *Source* is set to **Context**!).
  * **Attribute**: Binds the selected value directly, with caption matched to **"Attribute"** (only visible when *Type* is set to **Enumeration** or **Boolean**!).
  * **Selected Association**: Only visible when *Type* is set to **Association**!
* **Native Focus & Filter Action Events**:
  * **On Change Action**: Triggers when selection changes (item selected, removed, cleared, or dynamically created).
  * **On Enter Action**: Triggers immediately when the widget gains focus (via mouse click, touch, or keyboard Tab key).
  * **On Leave Action**: Triggers when focus leaves the entire widget wrapper (e.g. user tabs away or clicks outside).
  * **On Filter Input Change Action**: Triggers in real-time as the user types a search query in the text box.
  * **Filter Input Attribute**: Stores the typed search string in a bound Mendix String Attribute before triggering *On filter input change*, allowing microflows/nanoflows to inspect the active search filter!
* **Ultimate Advanced Search Matching (5 Algorithms)**:
  * **Contains (Default)**: Normalizes text and matches terms anywhere inside label/subtitle.
  * **Starts With**: Matches only when the option label or subtitle starts with the query.
  * **Ends With**: Matches only when the option label or subtitle ends with the query.
  * **Equals**: Exact matching of normalized strings.
  * **Fuzzy Search**: Matches letters appearing sequentially anywhere in the string, making search extremely forgiving.
  * **Case Sensitive Toggle**: Strips accent/tone marks (crucial for Thai character sets) while strictly respecting letter casing.
* **Smart Dynamic Status Coloring (`getSmartEnumColor`)**:
  * Automatically color-codes options and selected pills using premium HSL values. Identifies keywords (*approve/active/success* -> green, *reject/danger/error* -> red, *pending/warning* -> amber, *draft/new* -> blue), applying consistent, beautiful themes automatically!
* **Large List DOM Recycling Virtualization**:
  * Recycles dropdown viewport rows. Renders only visible options, allowing it to scroll smoothly at 60fps even with massive 1,000+ databases.

---

## ⚙️ Properties Configuration (XML Schema)

### 1. General Tab (แถบตั้งค่าทั่วไป)

#### Data source (แหล่งข้อมูล)

| Property Key | Caption | Type | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- |
| `source` | Source | Enumeration | `context` | Options: `context` (Page context), `database` (Database list query). |
| `sourceType` | Type | Enumeration | `association` | Options: `association` (Association mapping), `enumeration` (Enum Attribute), `boolean` (Boolean Attribute). |
| `selectedAttribute` | Attribute | Attribute | No | Binds selected key/boolean or delimited string in Multi Mode. |
| `selectedAssociation` | Selected Association | Association | No | Reference/ReferenceSet to store selected object. |
| `delimiter` | Delimiter | String | No | Delimiter character used to join/split multiple values. |
| `maxVisibleTags` | Max Visible Tags | Integer | Yes | Maximum selected tags shown before collapsing. Set to 0 for all. |

#### Boolean Mode Config (ตั้งค่าข้อมูลจริง/เท็จ)

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `booleanTrueLabel` | Yes / True Display Label | String | No | `Yes` | Text to display for the 'True' option (e.g. Yes, Active, Enabled). |
| `booleanFalseLabel` | No / False Display Label | String | No | `No` | Text to display for the 'False' option (e.g. No, Inactive, Disabled). |
| `booleanOutputFormat` | Output Value Format | Enumeration | Yes | `boolean` | Options: `boolean` (Save native true/false), `string` (Save custom string keys). |
| `booleanTrueValue` | True String Value Key | String | No | `true` | String stored in database when selected True (e.g. 'active', 'Y'). |
| `booleanFalseValue` | False String Value Key | String | No | `false` | String stored in database when selected False (e.g. 'inactive', 'N'). |

---

### 2. Events Tab (แถบตั้งค่าเหตุการณ์)

#### Selection Events
| Property Key | Caption | Type | Required | Description |
| :--- | :--- | :--- | :---: | :--- |
| `onChangeAction` | On Change Action | Action | No | Microflow or Nanoflow triggered when selection changes. |

#### Focus Events
| Property Key | Caption | Type | Required | Description |
| :--- | :--- | :--- | :---: | :--- |
| `onEnterAction` | On Enter Action | Action | No | Microflow, nanoflow, or action triggered when the widget receives focus. |
| `onLeaveAction` | On Leave Action | Action | No | Microflow, nanoflow, or action triggered when the widget loses focus. |

#### Filter Events
| Property Key | Caption | Type | Required | Description |
| :--- | :--- | :--- | :---: | :--- |
| `onFilterChangeAction` | On Filter Input Change Action | Action | No | Microflow, nanoflow, or action triggered when the search query filter changes. |
| `filterAttribute` | Filter Input Attribute | Attribute | No | Optional String attribute to store the current search filter query. This value is updated dynamically as the user types, before triggering *On filter input change*. |

---

### 3. Advanced Tab (แถบตั้งค่าการค้นหาและฟิลเตอร์ขั้นสูง)

| Property Key | Caption | Type | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- |
| `searchMethod` | Search Matching Method | Enumeration | `contains` | Search algorithm to use (`contains`, `startsWith`, `endsWith`, `equals`, `fuzzy`). |
| `searchCaseSensitive` | Case Sensitive Search | Boolean | `false` | Enable/disable case-sensitive matching for queries. |
| `searchDebounce` | Search Debounce (ms) | Integer | `300` | Input debounce interval to optimize database/nanoflow queries. |
| `maxSearchResults` | Max Search Results | Integer | `0` | Limits options shown at once. Set to 0 for unlimited. |

---

## ⚡ Integration Guide (คู่มือการติดตั้งและการนำไปใช้)

### 1. การใช้งานโหมด Focus Events (On Enter / On Leave)
* **On Enter Action** มีประโยชน์อย่างยิ่งในการโหลดข้อมูลล่วงหน้า (Preloading) หรือนับจำนวนการเปิด dropdown เมื่อได้รับโฟกัส
* **On Leave Action** เหมาะสำหรับทำการบันทึกข้อมูลแบบร่างโดยอัตโนมัติ (Auto-save) หรือตรวจเช็คเงื่อนไขความถูกต้องทันทีที่ผู้ใช้ออกจากกล่องคำค้น

### 2. การค้นหาแบบไดนามิกด้วยโหมด Filter Change Events
หากคุณต้องการดึงข้อมูลผลลัพธ์มาแสดงผลแบบ Real-time จาก Server-side Database ด้วยคำค้นหาของผู้ใช้ ให้ทำดังนี้:

1. ผูก **Filter Input Attribute** เข้ากับ String attribute ชนิดไม่ถาวร (Non-persistable string attribute) ของ Entity เช่น `$currentObject/SearchQuery`
2. เลือก Microflow หรือ Nanoflow ในช่อง **On Filter Input Change Action**
3. ใน Microflow/Nanoflow นั้น ให้คุณสืบค้นข้อมูลจาก Database โดยกรองด้วยเงื่อนไข:
   `[AttributeName = $currentObject/SearchQuery]`
4. เมื่อผู้ใช้พิมพ์คำค้นหา เช่น "R" -> "Re" -> "React" ทุกการเคาะตัวอักษรจะทำการบันทึกประโยคนั้นลงใน attribute ทันที จากนั้นเรียกใช้ action เพื่อดึงตัวเลือกที่ตรงกันจาก Server มาแสดงผลในตัวเลือกอย่างนุ่มนวลและทรงพลัง!
