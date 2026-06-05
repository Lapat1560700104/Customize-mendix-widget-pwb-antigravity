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
