# README - PWB Customize Container DataView Specification (v1.0.0)

**PWB Customize Container DataView** is a premium, enterprise-grade Mendix Pluggable Widget designed as an intelligent **Drag & Drop Sortable Container with full DataView context support**. It enables developers to nest any standard or custom Mendix widget inside it, allow end-users to freely reorder items by dragging, and automatically persist the new sorted order back into a Mendix String Attribute — making it the perfect foundation for sortable Kanban boards, priority lists, and any ranked-content layout.

---

## 🌟 Key Features

* **Nested Widget Dropzone**: Accepts any Mendix widget (Cards, Buttons, Images, Custom Widgets) inside each sortable row. Provides per-item Entity Context to nested widgets automatically via `ListWidgetValue` datasource binding.
* **Drag & Drop Reordering**: HTML5 Native drag events with smooth animations — drop indicator glow, item lift physics, and insertion markers. Works in both **Vertical List** and **Horizontal Grid** layout orientations.
* **DataView Context Provider**: Declared with `needsEntityContext="true"`, enabling the widget to receive the parent Entity Context from Mendix and bind directly to its attributes.
* **Sorted Order Persistence**: On every successful drop, serializes the new item order as a comma-separated GUID string (e.g. `"id_3,id_1,id_2"`) and writes it directly to a bound String Attribute via `sortedAttribute.setValue()`.
* **On Sort Action**: Fires a configurable Mendix Microflow or Nanoflow (`onSortAction`) immediately after sorting completes, enabling server-side order saving workflows.
* **Loading & Empty States**: Renders a premium spinner during datasource loading and a beautifully illustrated empty state when the items list is blank.

---

## ⚙️ Properties Configuration (XML Schema)

### 1. Data Source

| Property Key | Caption | Type | Required | Default | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `itemsSource` | Items Source | Datasource (isList) | ✅ | — | Dynamic list of child items to display and reorder |

### 2. Custom Content

| Property Key | Caption | Type | Required | Default | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `customItemContent` | Custom Option Content | Widgets | ✅ | — | Drop any Mendix widget here. Receives each item's Entity Context automatically |

### 3. Sorting Persistence

| Property Key | Caption | Type | Required | Default | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `sortedAttribute` | Sorted IDs Attribute | Attribute (String) | ✅ | — | String attribute on the parent context entity to store comma-separated sorted GUIDs |
| `onSortAction` | On Sort Complete Action | Action | No | — | Microflow or Nanoflow triggered immediately when drag-and-drop sorting completes |

### 4. Aesthetics

| Property Key | Caption | Type | Required | Default | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `layoutDirection` | Layout Direction | Enumeration | No | `vertical` | `vertical` = column list layout · `horizontal` = row wrap grid layout |
| `dragHandleDisplay` | Drag Handle Position | Enumeration | No | `left` | `left` = show drag handle icon on the left of each row · `hide` = hide drag handle icon entirely |
| `accentColor` | Accent Color (Hex) | String | No | `#3b82f6` | Theme color for active drag outlines, drop markers, and glow effects |
| `borderRadius` | Border Radius | String | No | `16px` | Corner roundness of item rows and drop overlays (e.g. `8px`, `16px`, `0px`) |

---

## 🎨 CSS Styling Architecture

The widget exposes a set of CSS Custom Properties (Variables) inside `PwbCustomizeContainerDataView.css` for developer theming.

### Layout CSS Variables

```css
.pwb-drag-container {
    --accent-color: #3b82f6;    /* Accent color from Mendix property */
    --border-radius: 16px;      /* Row corner rounding */
    --accent-glow: rgba(...);   /* Drop-zone insertion glow (auto-computed) */
}
```

### Core HTML Layout Class Targets

* `.pwb-customize-container-dataview-wrapper` — Root outer wrapper. Target with custom classes.
* `.pwb-drag-container` — Core flex container for all draggable rows.
* `.pwb-drag-container.pwb-direction-vertical` — Applied when `layoutDirection = "vertical"`.
* `.pwb-drag-container.pwb-direction-horizontal` — Applied when `layoutDirection = "horizontal"`.
* `.pwb-draggable-row-item` — Each individual draggable row card.
* `.pwb-draggable-row-item.pwb-dragging` — State applied to the row currently being dragged (reduced opacity, dashed border).
* `.pwb-draggable-row-item.pwb-drag-over` — State applied to a row being hovered as a drop target (glow border indicator).
* `.pwb-drag-handle` — The 6-dot grip icon on the left of each row.
* `.pwb-draggable-item-content` — Flex-grow wrapper that hosts the nested Mendix widgets.
* `.pwb-loading-state` — Animated spinner container shown during datasource loading.
* `.pwb-empty-state` — Illustrated empty state panel shown when `itemsSource` has zero items.
* `.pwb-empty-icon` — Pulsing SVG icon inside the empty state panel.

---

## 🔄 Sorted Order Persistence Flow (กลไกการบันทึกลำดับ)

```
1. End-user drags a row item to a new position
         │
         ▼
2. DragContainer swaps internal state array
         │
         ▼
3. onOrderChange callback fires with new GUID array:
   ["task-3", "task-1", "task-5", "task-2", "task-4"]
         │
         ▼
4. sortedAttribute.setValue("task-3,task-1,task-5,task-2,task-4")
   → Writes comma-separated GUIDs to Mendix String attribute
         │
         ▼
5. onSortAction.execute()
   → Triggers developer-defined Microflow or Nanoflow
         │
         ▼
6. On next widget load, sortedAttribute.value is read
   → Items are re-sorted to match the stored order automatically
```

---

## 🗂️ Sorted Order Hydration on Load (การโหลดลำดับที่บันทึกไว้)

When the widget initializes, it reads `sortedAttribute.value` and re-orders `itemsSource.items` to match the persisted sorted sequence. New items not yet present in the saved order are appended to the end of the list.

```typescript
// Simplified internal logic
const sortedIds = sortedAttribute.value?.split(",") ?? [];
const reordered = [
    ...sortedIds.map(id => items.find(i => i.id === id)).filter(Boolean),
    ...items.filter(i => !sortedIds.includes(i.id))  // new items appended
];
```

---

## 🛠️ Developer Lifecycle Commands (คู่มือรันพัฒนาและสร้างชิ้นงาน)

### 1. Install Dependencies

```bash
cd pwbCustomizeContainerDataView
npm install
```

### 2. Standalone Playground (แผงทดสอบจำลอง - แนะนำ!)

Launch the interactive **Vite Drag & Drop Live Simulator** at `http://localhost:3002/`:

```bash
npm run playground
```

_Allows testing layout direction, card styles, accent colors, border radius, and drag reordering without compiling an `.mpk` or launching Mendix Studio Pro._

### 3. Build (Development Check)

```bash
npm run build
```

### 4. Lint & Format

```bash
npm run lint:fix
```

### 5. Production Release & Bundle

```bash
npm run release
```

_Output: `dist/1.0.0/pwb.PwbCustomizeContainerDataView_1.0.0_YYYYMMDD_HHMMSS.mpk` copied automatically to your Mendix project's `widgets/` folder._

---

## 📁 Project File Structure (โครงสร้างไฟล์)

```bash
pwbCustomizeContainerDataView/
├── tsconfig.json                 # TypeScript compilation parameters
├── package.json                  # Package details, scripts, and devDependencies
├── playground/                   # Interactive local web simulator for development
│   ├── index.html                # HTML entry point
│   ├── main.tsx                  # React dashboard: property controls + live canvas
│   └── vite.config.ts            # Vite server config (port 3002)
├── typings/
│   └── PwbCustomizeContainerDataViewProps.d.ts  # Mendix generated props interface
└── src/
    ├── package.xml                                      # Mendix .mpk packaging config
    ├── PwbCustomizeContainerDataView.xml                # Widget properties definition
    ├── PwbCustomizeContainerDataView.tsx                # Main React wrapper component
    ├── PwbCustomizeContainerDataView.editorPreview.tsx  # Studio Pro design preview
    ├── PwbCustomizeContainerDataView.editorConfig.ts    # Studio Pro property validation
    ├── components/
    │   └── DragContainer.tsx      # HTML5 Drag & Drop sorting engine
    └── ui/
        └── PwbCustomizeContainerDataView.css  # Widget premium styling & CSS variables
```

---

## 🧩 Usage Guide in Mendix Studio Pro

### Step 1: Add the Widget to a Page
Drag **Pwb Customize Container Data View** from the Widget toolbox onto any Mendix page that has a DataView context (the parent entity context will be passed in automatically).

### Step 2: Configure Data Source
Under **Data Source** → **Items Source**: Select the list datasource containing the objects you want to display and reorder.

### Step 3: Design Custom Content
Under **Custom Content** → **Custom Option Content**: Drop any Mendix widget(s) into the dropzone. The widget has access to each item's full entity context, so you can bind Text, Images, Buttons, etc. directly to item attributes.

### Step 4: Bind Sorted Attribute
Under **Sorting Persistence** → **Sorted IDs Attribute**: Select a `String` attribute on your parent entity (e.g. `TaskBoard.SortedTaskIds`). This attribute will be written with the comma-separated GUIDs after each drag-drop.

### Step 5: Configure On Sort Action (Optional)
Under **Sorting Persistence** → **On Sort Complete Action**: Select a Microflow or Nanoflow to run after each sort. Typically used to commit the object and propagate the sort order to a backend API or external system.
