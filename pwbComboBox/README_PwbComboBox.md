# README - PWB Advanced ComboBox Ultimate Specification (v3.8.0)

**PWB ComboBox v3.8.0 (Studio Pro Properties Match Edition)** is a premium, enterprise-grade, high-performance, and fully accessible pluggable autocomplete dropdown search widget designed for Mendix Studio Pro. It features a properties panel restructured to match the **native Mendix Studio Pro properties sheet 100%**, supports **native events (On Change)**, and includes a dedicated **Advanced** tab featuring 5 state-of-the-art searching algorithms (including fuzzy matching).

---

## 🌟 Key Features (v3.8.0 Specs)

* **100% Screenshot-Identical "Data source" Layout**:
  * **Source**: Toggles between **Context** (options come from page context) and **Database** (options come from database list query).
  * **Type**: Toggles between **Association**, **Enumeration**, and **Boolean** (only visible when *Source* is set to **Context**!).
  * **Attribute**: Binds the selected value directly, with caption matched to **"Attribute"** (only visible when *Type* is set to **Enumeration** or **Boolean**!).
  * **Selected Association**: Only visible when *Type* is set to **Association**!
* **Native On Change Action Event (`onChangeAction`)**:
  * Triggers a nanoflow, microflow, or action immediately when the user selects a new item, clears selection, or creates a new option, exactly like Mendix's native Combo Box.
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

#### Entity Datasource Config (ตั้งค่าฐานข้อมูล)

| Property Key | Caption | Type | Required | Description |
| :--- | :--- | :--- | :---: | :--- |
| `optionsSource` | Options Source | Datasource | Yes | Dynamic list of objects to populate the dropdown. |
| `optionLabel` | Option Label | Expression (String) | Yes | Expression to render text for each option item. |
| `optionDetail` | Option Detail (Subtitle) | Expression (String) | No | Secondary text displayed below option label. |
| `optionGroup` | Option Group Category | Expression (String) | No | Expression to group option items by a category name. |
| `optionImage` | Option Image URL | Expression (String) | No | Expression to render dynamic profile avatar thumbnails. |
| `selectedOptionLabel` | Selected Option Label | Expression (String) | No | Expression to render custom label format ONLY when selected. |
| `enableGrouping` | Enable Grouping | Boolean | Yes (Default `true`) | Enable or disable collapsible category grouping. |

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

| Property Key | Caption | Type | Required | Description |
| :--- | :--- | :--- | :---: | :--- |
| `onChangeAction` | On Change Action | Action | No | Microflow or Nanoflow triggered when selection changes. |
| `onCreateAction` | On Create Action | Action | No | Optional Microflow or Nanoflow triggered when inline create is used. |

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

### 1. การใช้งานโหมด Enumeration (Zero Configuration)

1. ลากวางวิดเจ็ต `PwbComboBox` ลงบนหน้าเว็บของคุณใน Studio Pro
2. ในแถบ **General** กลุ่ม **Data source**:
   - ตั้งค่า **Source** เป็น **`Context`**
   - ตั้งค่า **Type** เป็น **`Enumeration`**
3. ผูกช่อง **`Attribute`** เข้ากับ Attribute ชนิด **Enum** ในโปรเจกต์ของคุณ
4. **เสร็จสิ้น!** วิดเจ็ตจะดึงรายชื่อคำแปล (Caption) ของ Enum มาทำเป็น Dropdown และทำสลักสีสถานะนีออนอัตโนมัติทันที!

### 2. การตั้งค่าเหตุการณ์เปลี่ยนค่า (On change action)

1. ดับเบิ้ลคลิกเพื่อเปิดหน้าต่างแก้ไข `PwbComboBox`
2. คลิกไปที่แถบ **Events**
3. ที่ช่อง **On Change Action** เลือก Microflow หรือ Nanoflow ที่ต้องการให้ทริกเกอร์
4. เมื่อผู้ใช้คลิกเลือกข้อมูล ลบแท็ก ปล่อยแท็ก หรือกดยกเลิกข้อมูล ระบบจะทำหน้าที่เรียกรันกระบวนงานตามที่คุณเลือกทันที!
