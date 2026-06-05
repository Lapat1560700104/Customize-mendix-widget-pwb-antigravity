# Mendix Marketplace Profile - PWB Customize Container DataView

## 1. Title

PWB Customize Container DataView

## 2. Description

A premium, highly customizable React-based pluggable widget for Mendix that acts as an intelligent drag-and-drop sortable container. It allows developers to place any standard or custom Mendix widgets (like cards, text boxes, buttons, or images) inside list rows, automatically propagating row-level entity contexts. It supports fluid drag-and-drop sorting (vertical lists or horizontal wrap grids), cross-column Kanban boards, debounced saves, and a robust **Read Only Mode** that disables layout adjustments and displays items ordered by a configurable `SortID` attribute.

## 3. Key Features

* **Nested Widget Dropzone**: Drop any standard or custom Mendix widgets inside rows; row-level entity context is fully propagated to nested elements.
* **Fluid Drag & Drop Reordering**: Powered by Web Pointer Events API for flawless touch screen and mobile/Safari support. Includes smooth hover glows and spring bounce physics.
* **Cross-Column Kanban Support**: Fully supports dragging cards across multiple columns/lanes. Handles optimistic UI transitions to eliminate visual flicker during asynchronous Mendix database commits.
* **Read Only Mode**: Easy toggle to display list contents statically, hiding grab handles and disabling dragging. Items automatically sort based on a custom `SortID` attribute (supporting Integer, Decimal, or String).
* **Keyboard Accessibility (WCAG 2.1)**: Fully keyboard-navigable (Tab to focus, Space/Enter to grab/drop, Arrows to move, Escape to cancel) with live screen-reader speech announcements.
* **Dynamic Styling & Presets**: Built-in visual presets (Modern Rounded, Glassmorphism, Minimalist Flat, and Neo-Brutalist) with standard custom padding, margins, and dark mode adaptations.

---

*(ภาษาไทย / Thai Version)*

## 1. ชื่อวิจเจต (Title)

PWB Customize Container DataView

## 2. คำอธิบายฟีเจอร์การทำงาน (Description)

วิจเจตประเภท Container ระดับพรีเมียมสำหรับ Mendix ที่เปิดโอกาสให้นักพัฒนาสามารถลากวาง Mendix Widget มาตรฐานหรือวิดเจ็ตกำหนดเองใดๆ เข้าไปจัดแสดงผลอยู่ด้านในแต่ละแถวรายการได้อย่างอิสระ พร้อมระบบลากสลับลำดับการ์ด (Drag & Drop Sorting) ที่มีประสิทธิภาพสูง รองรับบอร์ดคัมบังข้ามคอลัมน์ (Kanban Mode) และการบันทึกแบบลดภาระเซิร์ฟเวอร์ (Debounce Save) รวมถึงมี **Read Only Mode** สำหรับแสดงผลข้อมูลอย่างเดียวโดยไม่ยอมให้ย้ายตำแหน่งการ์ด และจัดเรียงข้อมูลอิงตามแอตทริบิวต์ `SortID` ของข้อมูลโดยอัตโนมัติ

## 3. คุณสมบัติเด่น (Key Features)

* **การลากวาง Widget ซ้อนด้านใน (Nested Widget Dropzone)**: วาง Widget อะไรก็ได้ลงในการ์ด โดยจะได้รับ Context ของไอเทมแต่ละแถวโดยอัตโนมัติ
* **ระบบลากย้ายลำดับแบบลื่นไหล (Fluid Drag & Drop)**: พัฒนาบน Web Pointer Events API รองรับหน้าจอสัมผัสบนสมาร์ทโฟนและแท็บเล็ต 100% พร้อม Drop Indicator แสดงทิศทางการวาง และระบบสปริงสั่นดีดกลับหากปล่อยการ์ดผิดที่
* **โหมดแสดงผลอย่างเดียว (Read Only Mode)**: ปิดการลากวางการ์ด ลำดับแสดงผลจะถูกจัดเรียงตามค่าในคุณสมบัติ `SortID` (รองรับฟิลด์ประเภท Integer, Decimal หรือ String) และซ่อนปุ่มปุ่มลากจับทั้งหมด
* **รองรับการจัดคอลัมน์คัมบัง (Kanban Column Support)**: ลากการ์ดข้ามระหว่างหลายๆ วิดเจตคอนเทนเนอร์เพื่อเปลี่ยนสถานะได้ พร้อมระบบ Optimistic UI ป้องกันอาการกระพริบของการ์ดขณะกำลังอัปเดตฐานข้อมูล Asynchronous
* **การเข้าถึงมาตรฐาน WCAG 2.1**: จัดเรียงลำดับได้ 100% ผ่านคีย์บอร์ด (Tab, Space, Enter, Arrow Keys, Escape) พร้อมเสียงอ่านออกลำโพงช่วยผู้บกพร่องทางการมองเห็น
* **ธีมความสวยงามสำเร็จรูป (Theme Presets)**: ปรับดีไซน์ได้หลากหลายในปุ่มเดียว ทั้งโหมดขอบมนปกติ (Modern Rounded), กระจกใสฝ้า (Glassmorphism), แบนราบลบขอบ (Minimalist Flat) และขอบดำเงาย้อนยุค (Neo-Brutalist)

---

## 4. Marketplace Assets (ไฟล์ภาพสำหรับอัปโหลด)

* **Marketplace Icon (ภาพไอคอนหลัก)**: [widget_icon.png](file:///Users/lapat.ta/.gemini/antigravity-ide/brain/bd4da4f5-7d0a-4a0e-94f0-3d2ce827e6d5/widget_icon_1780642974709.png)
* **Marketplace Cover Banner (ภาพหน้าปกสไตล์แลนด์สเคป)**: [widget_banner.png](file:///Users/lapat.ta/.gemini/antigravity-ide/brain/bd4da4f5-7d0a-4a0e-94f0-3d2ce827e6d5/widget_banner_1780642993416.png)

# PWB Customize Container DataView - Documentation

A premium, highly customizable React-based pluggable widget for Mendix that acts as an intelligent drag-and-drop sortable container. It enables Mendix developers to build fluid, interactive layouts (lists, columns, or grids) where nested items can be dragged and reordered.

---

## 1. Typical Usage Scenario

This widget is designed for scenarios where users need to organize, prioritize, or visually manage items dynamically. Typical use cases include:

* **Kanban Boards & Task Management**: Creating workflow lanes (e.g., Backlog, In Progress, Done) where cards can be dragged horizontally or vertically across status columns.
* **Interactive Dashboards**: Allowing end-users to customize the ordering of their dashboard components or KPI widgets.
* **Sortable Rows / Structured Lists**: Reordering product lists, document tables, attachments, or workflow steps with immediate or debounced persistence.
* **Master-Detail Layouts**: Displaying items that contain nested actions (like delete buttons or status toggles) mapped directly to each item's database context.

---

## 2. Features and Limitations

### Features

* **Nested Widget Dropzone**: Drop any standard or custom Mendix widgets inside the list cards. Row-level context is fully propagated to all children.
* **Fluid Drag & Drop**: Built using Web Pointer Events API for smooth touch-screen, mobile, and desktop interactions.
* **Custom Card Actions (Actions Section)**: Embed a secondary action panel directly inside cards. Supports layout orientations:
  * **Side by Side**: Actions are placed horizontally on the **Left** or **Right**.
  * **Stacked**: Actions are placed vertically on the **Top** or **Bottom**.
* **Flexible Sizing**: Adjust the width/height allocation of the Actions Section using pre-defined ratios (`15%`, `20%`, `25%`, `30%`, `40%`, `Auto`) or a custom size (e.g. `120px`).
* **Read Only Mode**: Statically displays items ordered by a database-mapped `SortID` attribute, disabling drag functionality and hiding grab handles.
* **A11y (WCAG 2.1)**: Fully keyboard navigable with live screen-reader announcements.
* **Visual Presets**: Choose between **Modern Rounded**, **Glassmorphism**, **Minimalist Flat**, and **Neo-Brutalist** styles with built-in dark mode adaptation.

### Limitations

* **DataSource Bound**: The widget requires a database list source (`DataSource`). It cannot render statically without a Mendix entity list.
* **Drag Handles**: When placing highly interactive elements (like text boxes or sliders) inside the custom content dropzone, users must use the provided drag handle to drag items rather than clicking directly on the card.

---

## 3. Dependencies

* **Mendix Version**: Mendix Studio Pro `9.18.0` or higher is recommended.
* **React Support**: Built on React 18/19 and pluggable-widgets-tools.
* **No External CSS Frameworks**: The widget is styled with pure CSS and does not require TailwindCSS or Bootstrap to render correctly.

---

## 4. Installation

1. Download the widget `.mpk` package file.
2. Copy the file into your Mendix project directory under the `widgets` folder (e.g., `[YourProject]/widgets/pwb.PwbCustomizeContainerDataView.mpk`).
3. In Mendix Studio Pro, select **App > Synchronize App Directory** (or press `F4`) to load the new widget.
4. The widget will now appear in your **Toolbox** under the category of your choice, ready to be dragged onto any Page.

---

## 5. Configuration

To configure the widget, place it on a page inside Mendix Studio Pro and fill in the following properties:

### Data Source Tab

* **Items Source**: The list of objects (Mendix entity) to display in the container.
* **Sort ID Attribute**: (Required for Read-only ordering and reorder persistence) The attribute containing the sort order value (can be an Integer, Decimal, or String).
* **On Drag End Action**: Microflow, Nanoflow, or Action to trigger once a user completes a drag-and-drop reorder (typically updates the `SortID` and commits).

### Layout & Appearance Tab

* **Layout Style**: Choose **Side by Side** (horizontal column alignment) or **Stacked** (vertical row alignment).
* **Position**:
  * If Layout Style is *Side by Side*, configure **Position (Horizontal)** to `Left` or `Right`.
  * If Layout Style is *Stacked*, configure **Position (Vertical)** to `Top` or `Bottom`.
* **Theme Preset**: Select `Modern Rounded`, `Glassmorphism`, `Minimalist Flat`, or `Neo-Brutalist` to change visual styling instantly.

### Actions Section Tab

* **Enable Actions Section**: Toggle to show a dedicated helper layout inside each item card.
* **Actions Content**: The Mendix widgets (e.g., helper buttons) to place in the Actions Section.

---

## 6. Known Bugs

* There are currently no known bugs. Please report any issues to the project maintainers.

---

## 7. Frequently Asked Questions

### Q: How do I save the new sorting order to the database?

A: Configure the **Sort ID Attribute** and implement a microflow/nanoflow in the **On Drag End Action** that updates the sequence values in the database and refreshes the client.

### Q: Can I put another Pluggable Widget inside this container?

A: Yes! You can nest any Mendix widget (including text boxes, dropdowns, images, or even other nested containers) inside the custom item content dropzone.
