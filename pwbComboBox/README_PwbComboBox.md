# README - PWB ComboBox Specification

**PWB ComboBox** is a premium, high-performance pluggable widget designed for Mendix Studio Pro. It delivers a modern, highly customizable search autocomplete dropdown picker, providing users with a fast and intuitive way to filter, search, and select options from massive datasets.

---

## 🌟 Key Features

*   **Search Autocomplete**: Instantly filters options as users type in the input field.
*   **Zero-Code Styling Support**: Designed to absorb custom classes and inline styles directly from Mendix properties.
*   **High Performance**: Handles massive options lists smoothly, utilizing React's optimized rendering pipelines.
*   **Modern Aesthetics**: Glassmorphic styling default templates that integrate beautifully with contemporary design systems.

---

## ⚙️ Properties Configuration (XML Schema)

### 1. General

| Property Key | Caption | Type | Required | Default Value | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `sampleText` | Default value | String | No | - | Sample input configuration field for testing placeholder or values |

---

## 🎨 Future Aesthetic Customizations

The widget supports classes and inline styles pass-through matching our unified design system:
*   `.pwb-combobox-wrapper`: Root container target.
*   `.pwb-combobox-input`: Custom search input text field.
*   `.pwb-combobox-dropdown`: Glassmorphic dropdown results popup.
