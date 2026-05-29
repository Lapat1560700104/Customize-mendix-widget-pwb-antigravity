# README - PWB Advanced DatePicker Specification (v1.0.5)

**PWB Advanced DatePicker** is a premium, high-performance pluggable widget designed for Mendix Studio Pro. It delivers a modern, glassmorphic date and range selection interface with full native support for **Thai Buddhist Era (พ.ศ.)**, dynamic date formatting, direct numerical time selection, custom validation, and zero-code CSS configurations.

---

## 🌟 Key Features

* **Dual Selection Modes**: Supports both `Single Date` selection and `Date Range` (Start/End) selection in a single, fluid component.
* **Thai Buddhist Era (พ.ศ.)**: Supports displaying years in the Thai Buddhist Era offset (+543 years) with a live switch button on the calendar popover.
* **Direct Numerical Time Input (HH:MM)**: Elegant numerical inputs with boundary limitations ($0 \le \text{Hour} \le 23$, $0 \le \text{Minute} \le 59$) replacing inaccurate range sliders.
* **Dynamic Date Formatting**: Custom token parsing (`DD`, `MM`, `YYYY`, `YY`, `hh`, `mm`) to match localized formatting standards.
* **Zero-Code Aesthetic Parameters**: Corner roundness (`Border Radius`), glassmorphism backdrop-blur (`Background Blur`), and color configurations (`Popover Background`) customizable straight from Mendix.
* **Comprehensive Validations**: Seamless support for Mendix native microflow validations, required-field checks, and custom Boolean validation rules.

---

## ⚙️ Properties Configuration (XML Schema)

### 1. General

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `selectionMode` | Selection Mode | Enumeration | Yes | `single` | Selection mode: `single` (Single Date) or `range` (Date Range) |
| `dateAttribute` | Date Attribute | Attribute (DateTime) | No | - | Datetime attribute for storing date in `single` mode |
| `startDateAttribute` | Start Date Attribute | Attribute (DateTime) | No | - | Datetime attribute for range start date |
| `endDateAttribute` | End Date Attribute | Attribute (DateTime) | No | - | Datetime attribute for range end date |

### 2. Features

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `showTime` | Show Time Picker | Boolean | Yes | `false` | Enable numerical time picker input fields |
| `buddhistEra` | Thai Buddhist Year (พ.ศ.) | Boolean | Yes | `false` | Default calendar view to Thai Buddhist Era (adds 543 year offset) |
| `showPresets` | Show Presets Panel | Boolean | Yes | `true` | Show quick select shortcuts (e.g. Today, Last 7 Days, This Month) |
| `showEraToggle` | Show Live Era Switch | Boolean | Yes | `true` | Show interactive "พ.ศ. / ค.ศ." live switch in calendar header |

### 3. Constraints

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `minDate` | Min Date | Expression (DateTime) | No | - | Minimum date allowed to select |
| `maxDate` | Max Date | Expression (DateTime) | No | - | Maximum date allowed to select |
| `disableWeekends` | Disable Weekends | Boolean | Yes | `false` | Disallow users from picking Saturdays and Sundays |

### 4. Aesthetics

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `placeholder` | Placeholder Text | String | No | `Select date...` | Text shown when no date value is selected |
| `accentColor` | Accent Color (Hex) | String | No | `#3b82f6` | Central theme color (e.g. `#3b82f6` for Neon Blue) |
| `dateFormat` | Date Format | String | No | `DD/MM/YYYY` | Custom formatting format (`DD`, `MM`, `YYYY`, `YY`, `hh`, `mm`) |
| `borderRadius` | Border Radius | String | No | `16px` | Roundness of input borders & popover calendar (`16px`, `8px`, `0px`) |
| `bgBlur` | Background Blur | String | No | `16px` | Backdrop-filter glassmorphic blur power (`16px`, `8px`, `0px`) |
| `popoverBg` | Calendar Background Color | String | No | `rgba(...)` | Fill color of popover pop-up (`rgba(255,255,255,0.85)`, `#ffffff`) |

### 5. Validation

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `required` | Is Required | Boolean | Yes | `false` | Enforce required-field checking inside the widget |
| `requiredMessage` | Validation Error Message | String | No | `This field is required.`| Message displayed when required field is empty |
| `validationExpression` | Custom Validation Rule | Expression (Boolean) | No | - | Mendix expression returning Boolean. Must evaluate to True to be valid |
| `customValidationMessage` | Custom Validation Message | String | No | `Date selection...` | Custom alert message displayed when Custom Validation Rule returns False |

### 6. Translations (Batch Translate)

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `timeLabel` | Time Picker Label | String | No | `เวลา / Time (HH:MM):` | Label displayed in the custom time picker section |
| `todayPresetLabel` | Today Preset Button Label | String | No | `วันนี้ (Today)` | Label for the Today shortcut preset button |
| `clearPresetLabel` | Clear Preset Button Label | String | No | `ล้างค่า (Clear)` | Label for the Clear/Reset shortcut button |
| `selectMonthLabel` | Select Month View Title | String | No | `เลือกเดือน / Select Month` | Header title displayed in the month selection view |
| `last7DaysPresetLabel` | Last 7 Days Preset Label | String | No | `7 วันล่าสุด` | Label for the 7 Days range shortcut button |
| `last30DaysPresetLabel` | Last 30 Days Preset Label | String | No | `30 วันล่าสุด` | Label for the 30 Days range shortcut button |
| `thisMonthPresetLabel` | This Month Preset Label | String | No | `เดือนนี้` | Label for the This Month range shortcut button |

---

## 🎨 CSS Styling Architecture

The widget exposes a highly organized layout structured with local CSS Custom Properties (Variables) inside `PwbDatePicker.css`.

### Layout CSS Variables

```css
.pwb-datepicker-wrapper {
    --accent-color: #3b82f6;       /* Accent color set from Mendix */
    --accent-light: rgba(...);     /* Selection background accent */
    --border-radius: 16px;         /* Corner scaling factor (Calculates relative borders) */
    --bg-blur: 16px;               /* Popover blur saturate */
    --popover-bg: rgba(...);       /* Calendar background color */
}
```

### Core HTML Layout Class Targets

* `.pwb-datepicker-wrapper`: Root container. Can be targeted with custom classes.
* `.pwb-datepicker-input`: Input box container.
* `.pwb-datepicker-input.pwb-input-error`: Input box when active validation fails (adds glowing red border).
* `.pwb-datepicker-popover`: Floating dropdown calendar calendar card.
* `.pwb-calendar-day`: Individual date slot.
* `.pwb-day-selected`: Selected active day slot.
* `.pwb-day-in-range`: Days contained within start/end range bounds.
* `.pwb-time-input-field`: Direct numerical HH/MM text entry fields.
* `.pwb-era-btn-active`: Live Era Toggle active switch states.
* `.pwb-validation-message`: Slide-down red validation warning alerts.
