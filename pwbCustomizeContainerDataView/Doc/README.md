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

### Features:
* **Nested Widget Dropzone**: Drop any standard or custom Mendix widgets inside the list cards. Row-level context is fully propagated to all children.
* **Fluid Drag & Drop**: Built using Web Pointer Events API for smooth touch-screen, mobile, and desktop interactions.
* **Custom Card Actions (Actions Section)**: Embed a secondary action panel directly inside cards. Supports layout orientations:
  * **Side by Side**: Actions are placed horizontally on the **Left** or **Right**.
  * **Stacked**: Actions are placed vertically on the **Top** or **Bottom**.
* **Flexible Sizing**: Adjust the width/height allocation of the Actions Section using pre-defined ratios (`15%`, `20%`, `25%`, `30%`, `40%`, `Auto`) or a custom size (e.g. `120px`).
* **Read Only Mode**: Statically displays items ordered by a database-mapped `SortID` attribute, disabling drag functionality and hiding grab handles.
* **A11y (WCAG 2.1)**: Fully keyboard navigable with live screen-reader announcements.
* **Visual Presets**: Choose between **Modern Rounded**, **Glassmorphism**, **Minimalist Flat**, and **Neo-Brutalist** styles with built-in dark mode adaptation.

### Limitations:
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

#### Q: How do I save the new sorting order to the database?
A: Configure the **Sort ID Attribute** and implement a microflow/nanoflow in the **On Drag End Action** that updates the sequence values in the database and refreshes the client.

#### Q: Can I put another Pluggable Widget inside this container?
A: Yes! You can nest any Mendix widget (including text boxes, dropdowns, images, or even other nested containers) inside the custom item content dropzone.
