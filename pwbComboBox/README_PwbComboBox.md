# README - PWB Advanced ComboBox Ultimate Specification (v3.10.0)

**PWB ComboBox v3.10.0 (Secret Features Edition)** is a premium, enterprise-grade, high-performance, and fully accessible pluggable autocomplete dropdown search widget designed for Mendix Studio Pro. It features a properties panel matching the **native Mendix Studio Pro properties sheet 100%**, supports **complete native events (On Change, On Enter, On Leave, and On filter input change)**, and includes a dedicated **Advanced** tab featuring 5 state-of-the-art searching algorithms (including fuzzy matching) and **3 hidden performance features** (Weighted Search Ranking, Infinite Scroll, and Client-Side LRU Cache).

---

## 🌟 Key Features

* **Flexible Data Source Modes**:
  * **Data Source Mode**: Toggles between **Association (Entity Datasource)**, **Enumeration Attribute**, and **Boolean Attribute**.
  * **Attribute**: Binds the selected value directly (only visible when *Data Source Mode* is set to **Enumeration Attribute** or **Boolean Attribute**).
  * **Selected Association**: Reference or ReferenceSet to store selected object(s). Only visible when *Data Source Mode* is **Association**.
* **Dual Selection Modes (Single & Multi)**:
  * **Single Select**: Standard dropdown with optional text, pill badge, or full rich-row display styles.
  * **Multi Select**: Tag-based multi-selection with optional pill or avatar-circle tag styles, Select/Deselect All buttons, configurable tag colors, and max visible tag collapsing.
* **Native Focus & Filter Action Events**:
  * **On Change Action**: Triggers when selection changes (item selected, removed, cleared, or dynamically created).
  * **On Enter Action**: Triggers immediately when the widget gains focus (via mouse click, touch, or keyboard Tab key).
  * **On Leave Action**: Triggers when focus leaves the entire widget wrapper (e.g. user tabs away or clicks outside).
  * **On Filter Input Change Action**: Triggers in real-time as the user types a search query in the text box.
  * **Filter Input Attribute**: Stores the typed search string in a bound Mendix String Attribute before triggering *On filter input change*, allowing microflows/nanoflows to inspect the active search filter.
* **Ultimate Advanced Search Matching (5 Algorithms)**:
  * **Contains (Default)**: Normalizes text and matches terms anywhere inside label/subtitle.
  * **Starts With**: Matches only when the option label or subtitle starts with the query.
  * **Ends With**: Matches only when the option label or subtitle ends with the query.
  * **Equals**: Exact matching of normalized strings.
  * **Fuzzy Search**: Matches letters appearing sequentially anywhere in the string, making search extremely forgiving.
  * **Case Sensitive Toggle**: Strips accent/tone marks (crucial for Thai character sets) while strictly respecting letter casing.
* **Smart Dynamic Status Coloring (`getSmartEnumColor`)**:
  * Automatically color-codes options and selected pills using premium HSL values. Identifies keywords (*approve/active/success* → green, *reject/danger/error* → red, *pending/warning* → amber, *draft/new* → blue), applying consistent, beautiful themes automatically!
* **Large List DOM Recycling Virtualization**:
  * Recycles dropdown viewport rows. Renders only visible options, allowing it to scroll smoothly at 60fps even with massive 1,000+ record databases.
* **Highly Customizable Aesthetics Tab**:
  * Configure placeholder text, accent color, search highlight color, border radius, glassmorphism blur, dropdown background, max dropdown height, dropdown layout (list or grid), avatar shape, and custom option content (Mendix widgets slot).
* **⚡ Secret Feature: Weighted Search Ranking** (`enableWeightedSearch`, default: `true`) 🆕:
  * Sorts search results by a 5-tier priority score: **Exact (1000)** → **Starts With (800)** → **Word Start (600)** → **Contains (400)** → **Fuzzy (200)**. Users always see the most relevant result first, not the first match in order.
* **♾️ Secret Feature: Infinite Scroll / Lazy Load** (`enableInfiniteScroll`, default: `false`) 🆕:
  * Loads the entity datasource in **30-item chunks** via `optionsSource.setLimit()` as the user scrolls down the dropdown. Dramatically reduces initial load time for datasources with hundreds or thousands of records.
* **🗄️ Secret Feature: Client-Side LRU Cache** (`enableSearchCache`, default: `true`) 🆕:
  * Maintains a **5-entry LRU (Least Recently Used) cache** of filter results. Re-typing a previously searched query returns results instantly without recomputing. Cache is automatically invalidated when the options list changes (e.g. after Infinite Scroll loads a new page).

---

## ⚙️ Properties Configuration (XML Schema)

### 1. General Tab (แถบตั้งค่าทั่วไป)

#### Data source (แหล่งข้อมูล)

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `sourceMode` | Data Source Mode | Enumeration | Yes | `association` | Options: `association` (Association / Entity Datasource), `enumeration` (Enumeration Attribute), `boolean` (Boolean Attribute). |
| `selectedAttribute` | Attribute | Attribute | No | — | Binds selected key/boolean or delimited string in Multi Mode. Supports String, Integer, Enum, Boolean. |
| `selectedAssociation` | Selected Association | Association | No | — | Reference (Single Mode) or ReferenceSet (Multi Mode) association to store selected object(s). **Only shown when sourceMode = association.** |
| `delimiter` | Delimiter (Multi Mode String Only) | String | No | `,` | Delimiter character used to separate values in Multi Mode String attribute (e.g. `,` or `;` or `\|`). **Only shown in Multi Select mode.** |
| `maxVisibleTags` | Max Visible Tags | Integer | No | `0` | Maximum selected tags shown before collapsing. Set to 0 to show all. **Only shown in Multi Select mode.** |

#### Entity Datasource Config (ตั้งค่าฐานข้อมูล)

> **Visible only when Data Source Mode = `association`**

| Property Key | Caption | Type | Required | Description |
| :--- | :--- | :--- | :---: | :--- |
| `optionsSource` | Options Source | Datasource | Yes | Dynamic list of objects to populate the dropdown. |
| `optionLabel` | Option Label | Expression (String) | Yes | Expression to render text for each option item (e.g. `$currentObject/Name`). |
| `optionDetail` | Option Detail (Subtitle) | Expression (String) | No | Secondary text displayed below option label (e.g. Email under Name). |
| `optionGroup` | Option Group Category | Expression (String) | No | Expression to group option items by a category name (e.g. `$currentObject/Category`). |
| `optionImage` | Option Image URL | Expression (String) | No | Expression to render dynamic profile avatar thumbnails (e.g. `$currentObject/AvatarUrl`). |
| `selectedOptionLabel` | Selected Option Label | Expression (String) | No | Expression to render custom label format ONLY when the option is selected (e.g. a shorter tag name). If empty, Option Label is used. |
| `enableGrouping` | Enable Grouping | Boolean | Yes | Enable or disable collapsible category grouping. Default `true`. |

#### Boolean Mode Config (ตั้งค่าข้อมูลจริง/เท็จ)

> **Visible only when Data Source Mode = `boolean`**

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `booleanTrueLabel` | Yes / True Display Label | String | No | `Yes` | Text to display for the 'True' option (e.g. Yes, Active, Enabled). |
| `booleanFalseLabel` | No / False Display Label | String | No | `No` | Text to display for the 'False' option (e.g. No, Inactive, Disabled). |
| `booleanOutputFormat` | Output Value Format | Enumeration | Yes | `boolean` | Options: `boolean` (Save native true/false), `string` (Save custom string keys). |
| `booleanTrueValue` | True String Value Key | String | No | `true` | String stored in database when selected True (e.g. 'active', 'Y'). **Only shown when Output Value Format = string.** |
| `booleanFalseValue` | False String Value Key | String | No | `false` | String stored in database when selected False (e.g. 'inactive', 'N'). **Only shown when Output Value Format = string.** |

#### Selection Mode Config (ตั้งค่าโหมดการเลือก)

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `selectionMode` | Selection Mode | Enumeration | Yes | `single` | Options: `single` (Single Select), `multi` (Multi Select). |
| `singleSelectStyle` | Single Select Style | Enumeration | Yes | `text` | UI visual format for selected item in Single Select mode: `text` (Standard Text Field), `pill` (Removable Badge), `rich` (Premium Full Row with Avatar + Label + Subtitle). **Only shown in Single Select mode.** |
| `showSelectedAvatar` | Show Selected Avatar | Boolean | Yes | `true` | Enable or disable showing avatar thumbnail for selected items in the input/tags. |
| `tagStyle` | Tag Badge Style | Enumeration | Yes | `pill` | UI layout style of selected tags in Multi Select mode: `pill` (Standard Pill), `avatar` (Avatar Circle). **Only shown in Multi Select mode.** |
| `tagColorExpression` | Tag Color (Hex/CSS) | Expression (String) | No | — | Optional expression returning a dynamic color code or name to style tag badges individually (e.g. `$currentObject/Color`). **Only shown in Multi Select mode.** |
| `showSelectAll` | Show Select All | Boolean | Yes | `false` | Enable a button in multi-select mode to quickly select or deselect all items in the list. **Only shown in Multi Select mode.** |
| `selectAllText` | Select All Text | String | No | `เลือกทั้งหมด / Select All` | Label for the Select All button. **Only shown in Multi Select mode.** |
| `deselectAllText` | Deselect All Text | String | No | `ล้างทั้งหมด / Deselect All` | Label for the Deselect All button. **Only shown in Multi Select mode.** |

#### Dynamic Creation Config (ตั้งค่าการสร้างรายการใหม่)

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `onCreateText` | Create Option Text Template | String | No | `+ Add '{value}'` | Button label template shown at the bottom of the dropdown when user's query matches no existing option. `{value}` will be replaced by user's search query at runtime. |

---

### 2. Events Tab (แถบตั้งค่าเหตุการณ์)

#### Selection Events

| Property Key | Caption | Type | Required | Description |
| :--- | :--- | :--- | :---: | :--- |
| `onChangeAction` | On Change Action | Action | No | Microflow, nanoflow, or action triggered when the selection changes (item selected, removed, cleared, or dynamically created). |

#### Focus Events

| Property Key | Caption | Type | Required | Description |
| :--- | :--- | :--- | :---: | :--- |
| `onEnterAction` | On Enter Action | Action | No | Microflow, nanoflow, or action triggered when the widget receives focus (via mouse click, touch, or keyboard Tab key). |
| `onLeaveAction` | On Leave Action | Action | No | Microflow, nanoflow, or action triggered when the widget loses focus (e.g. user tabs away or clicks outside). |

#### Filter Events

| Property Key | Caption | Type | Required | Description |
| :--- | :--- | :--- | :---: | :--- |
| `onFilterChangeAction` | On Filter Input Change Action | Action | No | Microflow, nanoflow, or action triggered when the search filter input text changes. |
| `filterAttribute` | Filter Input Attribute | Attribute (String) | No | Optional String attribute to store the current search filter query. This value is updated dynamically as the user types, before triggering *On filter input change*. |

---

### 3. Advanced Tab (แถบตั้งค่าการค้นหาและฟิลเตอร์ขั้นสูง)

#### Search & Filtering Config

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `searchMethod` | Search Matching Method | Enumeration | Yes | `contains` | Search algorithm to use: `contains` (Any Match), `startsWith` (Prefix Match), `endsWith` (Suffix Match), `equals` (Exact Match), `fuzzy` (Approximate Match). |
| `searchCaseSensitive` | Case Sensitive Search | Boolean | Yes | `false` | Enable/disable case-sensitive matching for queries. When disabled, also strips accent/tone marks (crucial for Thai character sets). |
| `searchDebounce` | Search Debounce (ms) | Integer | Yes | `300` | Time to wait in milliseconds after the user stops typing before filtering lists. Helps optimize database/nanoflow queries. |
| `maxSearchResults` | Max Search Results | Integer | Yes | `0` | Limits the maximum number of matching items displayed in the dropdown at once. Set to 0 for unlimited (virtualized). |
| `enableWeightedSearch` | ⚡ Weighted Search Ranking | Boolean | Yes | `true` | **[Secret Feature]** Sort search results by match-quality tier score: **Exact (1000)** → **Starts With (800)** → **Word Start (600)** → **Contains (400)** → **Fuzzy (200)**. Produces far more intuitive search results. |
| `enableInfiniteScroll` | ♾️ Infinite Scroll (Lazy Load) | Boolean | Yes | `false` | **[Secret Feature]** Load entity datasource in 30-item chunks via `setLimit()` as the user scrolls down the dropdown. Association mode only. Significantly reduces initial load time for large entity lists. |
| `enableSearchCache` | 🗄️ Client-Side Search Cache | Boolean | Yes | `true` | **[Secret Feature]** Enable a 5-entry LRU (Least Recently Used) cache for search results. Re-typing a previously searched query returns results instantly without recomputing filters. Cache is auto-invalidated when the options list changes. |

---

### 4. Aesthetics Tab (แถบตั้งค่าหน้าตา)

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `placeholder` | Placeholder Text | String | No | `Search and select...` | Input box placeholder text shown when nothing is selected and the search box is empty. |
| `accentColor` | Accent Color (Hex) | String | No | `#3b82f6` | Accent theme color applied to focused borders, selected highlights, and pill badges (e.g. `#3b82f6`). |
| `searchHighlightColor` | Search Highlight Color | String | No | — | Optional Hex/CSS color code for matching search term highlight background. If empty, Accent Color is used. |
| `borderRadius` | Border Radius | String | No | `16px` | Corner roundness of the input box and popover dropdown (e.g. `16px`, `8px`, `0px`). |
| `bgBlur` | Background Blur | String | No | `16px` | Glassmorphism `backdrop-filter: blur()` power applied to the dropdown panel (e.g. `16px`, `8px`, `0px`). |
| `popoverBg` | Dropdown Background Color | String | No | `rgba(255, 255, 255, 0.85)` | Background fill color of the popover dropdown (e.g. `rgba(255,255,255,0.85)`, `#ffffff`). |
| `maxDropdownHeight` | Max Dropdown Height | String | No | `250px` | Maximum height of the dropdown panel before virtual scrolling activates (e.g. `250px`, `300px`). |
| `dropdownLayout` | Dropdown List Layout | Enumeration | Yes | `list` | Layout structure of options in the dropdown: `list` (Standard Row List), `grid` (Compact 2-Column Grid Cards). |
| `optionAvatarShape` | Option Avatar Shape | Enumeration | Yes | `circle` | Geometric shape for dropdown and selected avatars: `circle` (Circular), `rounded` (Rounded Square / macOS squircle), `square` (Perfect Square). |
| `showOptionAvatar` | Show Option Avatar | Boolean | Yes | `true` | Enable or disable showing avatar thumbnail inside the options list dropdown. |
| `customItemContent` | Custom Option Content | Widgets | No | — | Render custom Mendix widgets inside the dropdown options list for each item instead of standard avatar/label/subtitle. **Only shown when sourceMode = association.** |
| `showOptionCheckbox` | Show Checkbox/Radio Option | Boolean | Yes | `false` | Show standard checkbox (Multi Select mode) or radio button (Single Select mode) next to dropdown list choices. |
| `highlightColorMode` | Hover Highlight Color Mode | Enumeration | Yes | `accent` | Color scheme used when hovering over options: `accent` (Universal Accent Color), `optionColor` (Dynamic Option Color — uses Tag Color Expression if defined). |

---

### 5. Translations Tab (แถบตั้งค่าข้อความ)

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `noOptionsMessage` | No Options Alert | String | No | `ไม่พบตัวเลือก / No options found` | Text displayed when search results are empty or no options exist. |
| `loadingMessage` | Loading Text | String | No | `กำลังโหลด... / Loading...` | Message displayed while Mendix is fetching options from the datasource. |
| `clearButtonTitle` | Clear Button Accessibility Title | String | No | `ล้างค่า / Clear` | Accessible help text announced to screen readers and shown as tooltip when clearing selections. |

---

### 6. Validation Tab (แถบตั้งค่าการตรวจสอบ)

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `required` | Is Required | Boolean | Yes | `false` | Enforce required-field checking inside the widget. Shows validation message if user submits without selecting. |
| `requiredMessage` | Validation Error Message | String | No | `This field is required.` | Custom alert text shown when required condition is violated. |
| `validationExpression` | Custom Validation Rule | Expression (Boolean) | No | — | Mendix expression that must evaluate to `true` for the selection to be considered valid. |
| `customValidationMessage` | Custom Validation Message | String | No | `Selection violates custom validation rule.` | Alert text displayed when Custom Validation Rule evaluates to `false`. |

---

## 🔒 Conditional Visibility Logic (editorConfig)

The widget uses `getProperties()` in `PwbComboBox.editorConfig.ts` to dynamically show/hide properties in Studio Pro:

| Condition | Hidden Properties |
| :--- | :--- |
| `sourceMode ≠ association` | Entire **Entity Datasource Config** section |
| `sourceMode ≠ boolean` | Entire **Boolean Mode Config** section |
| `sourceMode ≠ association` | `selectedAssociation`, `customItemContent` |
| `selectionMode ≠ multi` | `delimiter`, `maxVisibleTags`, `tagStyle`, `tagColorExpression`, `showSelectAll`, `selectAllText`, `deselectAllText` |
| `selectionMode ≠ single` | `singleSelectStyle` |
| `booleanOutputFormat ≠ string` | `booleanTrueValue`, `booleanFalseValue` |

---

## ✅ Validation Rules (editorConfig `check()`)

| Condition | Error Property | Severity | Message |
| :--- | :--- | :---: | :--- |
| `sourceMode = enumeration` and no `selectedAttribute` | `selectedAttribute` | error | "An Attribute is required when Data Source Type is 'Enumeration'." |
| `sourceMode = boolean` and no `selectedAttribute` | `selectedAttribute` | error | "An Attribute is required when Data Source Type is 'Boolean'." |
| `sourceMode = boolean`, `booleanOutputFormat = string`, no `booleanTrueValue` | `booleanTrueValue` | error | "True String Value Key is required when Output Value Format is 'String Key Type'." |
| `sourceMode = boolean`, `booleanOutputFormat = string`, no `booleanFalseValue` | `booleanFalseValue` | error | "False String Value Key is required when Output Value Format is 'String Key Type'." |
| `sourceMode = association` and no `optionsSource` | `optionsSource` | error | "Options Source is required when Data Source Mode is 'Association'." |
| `sourceMode = association` and no `optionLabel` | `optionLabel` | error | "Option Label is required when Data Source Mode is 'Association'." |
| `sourceMode = association`, `selectionMode = single`, no `selectedAttribute` AND no `selectedAssociation` | `selectedAttribute` | error | "Please bind either 'Attribute' or 'Selected Association' to save the selected option." |
| `sourceMode = association`, `selectionMode = multi`, no `selectedAttribute` AND no `selectedAssociation` | `selectedAssociation` | error | "Please bind either 'Selected Association' (ReferenceSet) or 'Attribute' (Delimited String) to save the multiple selections." |

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
4. เมื่อผู้ใช้พิมพ์คำค้นหา เช่น "R" → "Re" → "React" ทุกการเคาะตัวอักษรจะทำการบันทึกประโยคนั้นลงใน attribute ทันที จากนั้นเรียกใช้ action เพื่อดึงตัวเลือกที่ตรงกันจาก Server มาแสดงผลในตัวเลือกอย่างนุ่มนวลและทรงพลัง!

### 3. Multi Select พร้อม Select All

1. ตั้ง **Selection Mode** เป็น `Multi Select`
2. เปิด **Show Select All** เป็น `true`
3. กำหนด **Select All Text** และ **Deselect All Text** ตามภาษาที่ต้องการ
4. ใช้ **Selected Association** แบบ ReferenceSet หรือ **Attribute** แบบ String พร้อม **Delimiter** เพื่อจัดเก็บหลายค่า

### 4. Dynamic Option Creation

1. กำหนด **Create Option Text Template** เช่น `+ สร้าง '{value}'`
2. Widget จะแสดงปุ่มสร้างที่ท้ายรายการโดยอัตโนมัติเมื่อการค้นหาไม่พบรายการที่ตรงกัน
3. เชื่อม **On Change Action** เพื่อ handle การสร้าง Object ใหม่ใน Microflow/Nanoflow
