# 📋 PwbCustomizeContainerDataView — Changelog & Release Notes

เอกสารนี้บันทึกประวัติการเปลี่ยนแปลงทั้งหมดของ **PwbCustomizeContainerDataView** Widget ตั้งแต่เวอร์ชันแรกจนถึงปัจจุบัน เรียงลำดับจากล่าสุดไปเก่าสุด

---

## [v1.1.0] — Feature Expansion & Playground Release 🚀

**Release:** `pwb.PwbCustomizeContainerDataView_1.1.0_20260605_140549.mpk`
**Released:** 2026-06-05 14:05:49

### 🧩 New Features

- **Configurable Actions Section:** เพิ่มการรองรับส่วน Action ของไอเทมการ์ด (`actionsContent`) สามารถกำหนดทิศทาง Layout ได้ทั้งแบบ:
  - **Side by Side**: จัดเรียงแนวนอนทางฝั่งซ้าย (`Left`) หรือฝั่งขวา (`Right`)
  - **Stacked**: จัดเรียงแนวตั้งทางฝั่งบน (`Top`) หรือฝั่งล่าง (`Bottom`)
  - **Sizing Customization**: กำหนดขนาดสัดส่วนพื้นที่ Actions Section ได้อย่างยืดหยุ่น (15%, 20%, 25%, 30%, 40%, Auto หรือระบุ Custom size เช่น `120px`)
- **Read-Only Mode & Sorting Simulation:** เพิ่มการตั้งค่า `readOnlyMode` เพื่อล็อคหน้าจอให้แสดงผลรายการอย่างเดียว ปิดปุ่มลากและซ่อนปุ่ม Drag handle โดยจัดเรียงตาม attribute `sortIdAttribute` โดยอัตโนมัติ พร้อมรองรับการจำลองการจัดเรียงใน Playground
- **Form Builder Mode inside Playground:** เพิ่มโหมดตัวสร้างฟอร์ม (Form Builder) ลงใน Vite Playground เพื่อทดสอบการลากสลับลำดับของ Layout และ Field ในรูปแบบฟอร์มจริง พร้อมมีระบบบันทึกสถานะและการ Sync การจัดเรียงบน canvas preview
- **Cross-Container Keyboard Dragging:** เพิ่มประสิทธิภาพและเปิดใช้งานการย้ายตำแหน่งการ์ดข้ามระหว่างหลายๆ คอลัมน์ (Kanban columns) ผ่านการกดคีย์บอร์ดได้โดยตรงและลื่นไหล
- **Atlas Design Token Integration:** ผสานตัวแปรสไตล์ของ Atlas UI (Mendix) เข้ากับ CSS custom properties ช่วยให้ Widget สามารถแสดงผลสีและสไตล์ตอบสนองตาม Dark Mode และ Accent Theme ของระบบโดยรอบได้
- **Custom Widget Icon:** เพิ่มไอคอนพิเศษของวิจเจตเพื่อแสดงใน Mendix Studio Pro Toolbox ให้โดดเด่นและสวยงาม

### 🔧 Technical & Refactoring Changes

- **Custom Hooks Extraction:** แยก Logic ควบคุมการลากแบบ Pointer และ Keyboard จาก `DragContainer.tsx` ไปเก็บใน Hooks เฉพาะตัว:
  - `usePointerDrag`: ควบคุม Logic และการจัดการ State สำหรับ Pointer Events
  - `useKeyboardDrag`: ควบคุม Logic และการควบคุมผ่านปุ่มคีย์บอร์ดตามมาตรฐาน Accessibility
- **Decoupled Cross-Container Event:** พัฒนาระบบ `_onDropExternal` และ CustomEvent สำหรับส่งสัญญาณข้อมูลขณะย้ายการ์ดข้ามระหว่าง Container ช่วยให้ Component ทำงานแบบแยกส่วน (Decoupled) ไม่พึ่งพากันโดยตรง
- **Workspace Tooling Configuration:** เพิ่มระบบควบคุม Workspace TypeScript และ ESLint เพื่อการตรวจสอบไวยากรณ์และความถูกต้องของโค้ดให้สม่ำเสมอ
- **Clean-up Properties:** ลบ Property `Label` ที่เป็น Property พื้นฐานของระบบ Mendix ออกเพื่อหลีกเลี่ยงการแสดงข้อความซ้ำซ้อนใน Layout
- **Code Formatting:** จัดรูปแบบโค้ด TypeScript และ CSS ทั่วทั้ง Widget ให้สะอาดตาและใช้การแบ่งบรรทัดที่สม่ำเสมอ

### 📚 Documentation & Metadata

- **Marketplace Profile:** เพิ่มไฟล์ [MARKETPLACE_PROFILE.md](file:///Users/lapat.ta/Desktop/ETC%20Project/Customize-mendix-widget-pwb-antigravity/pwbCustomizeContainerDataView/MARKETPLACE_PROFILE.md) เพื่อใช้เป็นหน้าแนะนำตัววิจเจตบน Mendix Marketplace
- **Widget Readme & Guides:** อัปเดตไฟล์ README และจัดระเบียบคู่มือการใช้งานในโฟลเดอร์ `Doc` ให้สอดคล้องกับคุณสมบัติใหม่ครบถ้วน

---

## [v1.0.0] — Initial Release 🆕

**Release:** `pwb.PwbCustomizeContainerDataView_1.0.0_20260603_163133.mpk`
**Released:** 2026-06-03 16:31:33

### ⚡ Drag & Drop & Kanban Features

- **Pointer Events Reordering:** นำ Pointer Events API มาพัฒนาทดแทนระบบ HTML5 Drag and Drop แบบดั้งเดิม ช่วยให้รองรับการแตะลากสลับตำแหน่งด้วยจอ Touch Screen และ Safari ได้เสถียร 100%
- **Kanban Column Support:** เปิดใช้งานฟีเจอร์การลากย้ายข้าม Container (`enableKanban` และ `dragGroup`) พร้อมระบบช่วยเขียนสถานะลงใน Attribute เมื่อลากย้ายเสร็จอัตโนมัติ ผ่าน `columnValue` และ `itemColumnAttribute`
- **Dynamic Auto-Scrolling:** พัฒนาระบบเลื่อนหน้าจออัตโนมัติเมื่อลากการ์ดชิดขอบจอ หรือชิดขอบ Parent Container ที่มี scrollbar (`overflow-y: auto`)
- **Optimistic UI Transitions:** ใช้ระบบ Event Broker และ Global Registry ในการจำลองการลากวาง เพื่อป้องกันอาการการ์ดกะพริบหรือซ้ำซ้อนกันขณะรอเซฟข้อมูลกลับไปยังระบบ Mendix
- **Haptic Feedback:** เพิ่มระบบสั่นแบบ Tactile (Vibration API) เมื่อเริ่มเคลื่อนย้ายการ์ด ช่วยเพิ่มมิติในการสัมผัสสำหรับผู้ใช้มือถือ

### 🎨 Visual & Spacing Customization

- **Premium Theme Presets:** พรีเซ็ตสไตล์พรีเมียมให้เลือก 4 รูปแบบ:
  - **Modern Rounded**: กลมมน เรียบง่าย ทันสมัย
  - **Glassmorphism**: กระจกใสฝ้าสะท้อนพื้นหลังละมุนตา
  - **Minimalist Flat**: แบนราบลบกรอบ เหลือเพียงขอบล่างบางเบา
  - **Neo-Brutalist**: กรอบหนาสไตล์โมเดิร์นตัดสีคอนทราสต์
- **Accent Glow & Wobble Snap-back:** แอนิเมชัน Drop Indicator แบบเรืองแสง และเอฟเฟกต์การ์ดสั่นส่ายดีดกลับคืน (Wobble Animation) เมื่อยกเลิกการวาง
- **Layout & Spacing Config:** ตั้งค่าสไตล์ Layout ได้ทั้งแนวตั้งและแนวนอน กำหนด Padding ในการ์ด และระยะห่างการ์ด (`itemGap`) ได้อิสระผ่าน Property Panel
- **Mendix Preview:** รองรับการทำ Preview โครงสร้าง Layout และ Custom Caption ในหน้าต่าง Mendix Studio Pro เพื่อการจัดวางหน้าจอที่รวดเร็ว

### ♿ Accessibility (WCAG 2.1)

- **Keyboard Navigation:** รองรับการจัดเรียงลำดับผ่านแป้นพิมพ์คีย์บอร์ด 100% (`Tab` ย้ายการโฟกัส, `Space/Enter` จับ/ปล่อยการ์ด, `Arrow Keys` เลื่อนลำดับขึ้นลงซ้ายขวา, และ `Escape` ยกเลิกกระบวนการดีดการ์ดกลับ)
- **Live Region Announcements:** ประกาศการทำงานสำหรับโปรแกรมอ่านหน้าจอ (Screen Reader) แบบเรียลไทม์ผ่าน HTML Assertive Live Region ในภาษาไทยและภาษาอังกฤษ

### 📚 Structure & Documentation

- **Doc Folder Organization:** ย้ายและจัดระบบเอกสารประกอบการพัฒนาทั้งหมดไว้ในโฟลเดอร์ `Doc`:
  - [comprehensive_widget_manual.md](file:///Users/lapat.ta/Desktop/ETC%20Project/Customize-mendix-widget-pwb-antigravity/pwbCustomizeContainerDataView/Doc/comprehensive_widget_manual.md) — คู่มืออธิบายการใช้งานเบื้องต้น
  - [widget_architecture.md](file:///Users/lapat.ta/Desktop/ETC%20Project/Customize-mendix-widget-pwb-antigravity/pwbCustomizeContainerDataView/Doc/widget_architecture.md) — สถาปัตยกรรมและการไหลของข้อมูล
  - [entity_schema_specification.md](file:///Users/lapat.ta/Desktop/ETC%20Project/Customize-mendix-widget-pwb-antigravity/pwbCustomizeContainerDataView/Doc/entity_schema_specification.md) — รายละเอียดโครงสร้าง Mendix Entity
  - [sorting_persistence_guide.md](file:///Users/lapat.ta/Desktop/ETC%20Project/Customize-mendix-widget-pwb-antigravity/pwbCustomizeContainerDataView/Doc/sorting_persistence_guide.md) — คู่มือการเก็บและคงสถานะลำดับข้อมูล
  - [sorted_task_ids_conceptual_architecture.md](file:///Users/lapat.ta/Desktop/ETC%20Project/Customize-mendix-widget-pwb-antigravity/pwbCustomizeContainerDataView/Doc/sorted_task_ids_conceptual_architecture.md) — แผนผังคอนเซปต์ระบบ IDs
  - [kanban_support.md](file:///Users/lapat.ta/Desktop/ETC%20Project/Customize-mendix-widget-pwb-antigravity/pwbCustomizeContainerDataView/Doc/kanban_support.md) — คู่มือการทำงานในโหมด Kanban
  - [form_builder_usecase.md](file:///Users/lapat.ta/Desktop/ETC%20Project/Customize-mendix-widget-pwb-antigravity/pwbCustomizeContainerDataView/Doc/form_builder_usecase.md) — ตัวอย่างการนำไปประยุกต์ใช้ทำ Form Builder
  - [TestCase](file:///Users/lapat.ta/Desktop/ETC%20Project/Customize-mendix-widget-pwb-antigravity/pwbCustomizeContainerDataView/Doc/TestCase) — โฟลเดอร์เก็บกรณีการทดสอบระบบต่างๆ
- **System Properties:** เพิ่ม Property `saveDelay` และ `dragHandleDisplay` เพื่อการควบคุมประสิทธิภาพและการจัดปุ่มจับเคลื่อนย้าย

---

> [!TIP]
> สำหรับข้อมูลเพิ่มเติมเกี่ยวกับการใช้งานและการตั้งค่าแต่ละหัวข้อ นักพัฒนาสามารถอ่านรายละเอียดได้จากไฟล์ [README.md](file:///Users/lapat.ta/Desktop/ETC%20Project/Customize-mendix-widget-pwb-antigravity/pwbCustomizeContainerDataView/README.md) และเอกสารต่างๆ ภายในโฟลเดอร์ [Doc](file:///Users/lapat.ta/Desktop/ETC%20Project/Customize-mendix-widget-pwb-antigravity/pwbCustomizeContainerDataView/Doc) ได้เลยครับ
