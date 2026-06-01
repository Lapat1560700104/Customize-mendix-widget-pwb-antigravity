# 📋 PwbComboBox — Changelog & Release Notes

เอกสารนี้บันทึกประวัติการเปลี่ยนแปลงทั้งหมดของ **PwbComboBox** Widget ตั้งแต่เวอร์ชันแรกจนถึงปัจจุบัน เรียงลำดับจากล่าสุดไปเก่าสุด

---

## [v3.10.0] — Documentation Sync Release 📝

**Release:** `pwb.PwbComboBox_3.10.0_20260601_163852.mpk`
**Released:** 2026-06-01 16:38:52

### 📚 Documentation Updates

- อัพเดท `README_PwbComboBox.md` ให้ตรงกับ XML ล่าสุดครบทุก Property:
  - เพิ่มหัวข้อ **Selection Mode Config** (`selectionMode`, `singleSelectStyle`, `showSelectedAvatar`, `tagStyle`, `tagColorExpression`, `showSelectAll`, `selectAllText`, `deselectAllText`)
  - เพิ่มหัวข้อ **Dynamic Creation Config** (`onCreateText`)
  - เพิ่มหัวข้อ **Aesthetics Tab** ครบทุก property (13 รายการ)
  - เพิ่มหัวข้อ **Translations Tab** (`noOptionsMessage`, `loadingMessage`, `clearButtonTitle`)
  - เพิ่มหัวข้อ **Validation Tab** (`required`, `requiredMessage`, `validationExpression`, `customValidationMessage`)
  - เพิ่มตาราง **Conditional Visibility Logic** สรุป editorConfig rules
  - เพิ่มตาราง **Validation Rules** สรุป check() errors ทั้งหมด
  - แก้ version header จาก `v4.0.0` → `v3.10.0` ให้ตรงกับ `package.json`
- อัพเดท `Doc/widget_properties_guide.md` ให้ตรงกับ XML ล่าสุด:
  - เพิ่ม **Dynamic Creation Config Group** (`onCreateText`) ที่ขาดหายไป
  - แก้ default values ทั้ง 8 จุดที่ไม่ตรงกับ XML (`placeholder`, `selectAllText`, `deselectAllText`, `noOptionsMessage`, `loadingMessage`, `clearButtonTitle`, `customValidationMessage`)
  - อัพเดท Mermaid diagram ให้แสดง subgroups ของ General Tab
  - แก้ version references จาก `v4.0.0` → `v3.10.0`

### 🔧 No Code Changes

- ไม่มีการเปลี่ยนแปลง source code, XML หรือ logic — documentation sync release เท่านั้น

---

## [v3.10.0] — Secret Features Edition 🆕

**Release:** `pwb.PwbComboBox_3.10.0_20260601_122215.mpk`

### ⚡ New: Weighted Search Ranking

- **Property:** `enableWeightedSearch` (Boolean, default: `true`)
- **Location:** Advanced → Search & Filtering Config
- ผลการค้นหาถูกเรียงลำดับตามคะแนนความแม่นยำ 5 ระดับ:

  | ระดับ | คะแนน | ตัวอย่าง (ค้นหา "สม") |
  |---|---|---|
  | Exact Match | 1000 | `"สม"` |
  | Starts With | 800 | `"สมชาย"` |
  | Word Start | 600 | `"นาย สมศักดิ์"` |
  | Contains | 400 | `"กิตติ สม ศรี"` |
  | Fuzzy | 200 | `"สัมมนา"` |

- ทำงานร่วมกับทุก `searchMethod` — backward compatible 100%

### ♾️ New: Infinite Scroll (Lazy Load)

- **Property:** `enableInfiniteScroll` (Boolean, default: `false`)
- **Location:** Advanced → Search & Filtering Config
- โหลด datasource ทีละ **30 รายการ** ผ่าน `optionsSource.setLimit()` เมื่อ scroll ลงก้น Dropdown
- ลดเวลาโหลดครั้งแรกสำหรับ Entity datasource ขนาดใหญ่
- ⚠️ ใช้ได้เฉพาะ `sourceMode = association` เท่านั้น

### 🗄️ New: Client-Side LRU Cache

- **Property:** `enableSearchCache` (Boolean, default: `true`)
- **Location:** Advanced → Search & Filtering Config
- Cache ผลการกรองสูงสุด **5 queries** ด้วย LRU (Least Recently Used) eviction
- Cache key ประกอบด้วย: query + searchMethod + caseSensitive + selectionMode + selectedIds + weightedSearch
- Cache clear อัตโนมัติเมื่อ `options.length` เปลี่ยน (เช่น Infinite Scroll โหลดหน้าใหม่)

### 🔧 Technical Changes

- `ComboBox.tsx`:
  - เพิ่ม `useMemo` import
  - เพิ่ม `createLRUCache<K, V>()` factory function (Map-based)
  - เพิ่ม `computeMatchScore()` function พร้อม tier constants
  - แปลง `getFilteredOptions()` จาก inline function เป็น `useMemo` dependency-tracked
  - เพิ่ม `onLoadMore` callback ใน `handleDropdownScroll`
  - เพิ่ม `enableWeightedSearch`, `onLoadMore`, `enableSearchCache` ใน `ComboBoxProps`
- `PwbComboBox.tsx`:
  - เพิ่ม `useRef` import
  - เพิ่ม `infinitePageRef` + `handleLoadMore()` สำหรับ page management
  - Destructure + pass `enableWeightedSearch`, `enableInfiniteScroll`, `enableSearchCache`
- `PwbComboBox.xml`:
  - เพิ่ม 3 boolean properties ใน `Advanced > Search & Filtering Config`

---

## [v3.10.0] — Consolidation & sourceMode Edition

**Release:** `pwb.PwbComboBox_3.10.0_20260601_113040.mpk`

### 🔄 Breaking: sourceMode Consolidation

- รวม `source` (context/database) + `sourceType` (association/enumeration/boolean) เป็น `sourceMode` เดียว:
  - `association` = Association (Entity Datasource)
  - `enumeration` = Enumeration Attribute
  - `boolean` = Boolean Attribute
- อัปเดต `PwbComboBox.editorConfig.ts` visibility filters และ `PwbComboBox.tsx` destructuring

### 🐛 Fix: Compilation Error

- แก้ไข error: `Property must specify selectableObjects attribute or have isMetaData="true"`
- คืน `optionsSource` datasource และ `selectableObjects="optionsSource"` ใน `selectedAssociation`

### 📚 Documentation

- สร้าง `Doc/widget_properties_guide.md` — คู่มือ Properties ฉบับละเอียด
- สร้าง `Doc/combobox_comparison_guide.md` — เปรียบเทียบ vs Mendix Native
- สร้าง `Doc/data_storage_comparison.md` — อธิบาย Data Storage Patterns

---

## [v3.9.x และก่อนหน้า]

- รองรับ Multi-select, Fuzzy Search, Debounce, Dynamic Tag Colors, Glassmorphism UI
- รองรับ Keyboard Navigation, ARIA Accessibility, Smart Enum Color
- รองรับ Grouping, Virtualization, Custom Item Content

---

> [!TIP]
> สำหรับการอัปเกรดจาก v3.9.x → v3.10.0:
>
> - ไม่มี Breaking Changes — properties ใหม่ทั้งหมดมี default value
> - Properties ใหม่จะปรากฏใน **Advanced → Search & Filtering Config** ทันที
> - `enableWeightedSearch` และ `enableSearchCache` เปิดโดย default — ผู้ใช้จะรู้สึกถึงความแตกต่างทันที
