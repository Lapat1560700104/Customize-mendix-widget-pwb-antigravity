# รายละเอียดและการทำงานของ Mendix Custom Widget (PwbDatePicker)

เอกสารฉบับนี้อธิบายถึงโครงสร้าง สถาปัตยกรรม และตรรกะการทำงานของ **PwbDatePicker** ซึ่งเป็น Pluggable Widget ที่ถูกสร้างขึ้นเพื่อขยายความสามารถด้าน UI/UX ในโปรเจค Mendix Studio Pro

---

## 🚀 ภาพรวมของ Widget (Widget Overview)

* **ชื่ออย่างเป็นทางการ**: `PWB Advanced DatePicker`
* **Widget ID**: `pwb.pwbdatepicker.PwbDatePicker`
* **สถาปัตยกรรมที่ใช้**: React (Function Components & Hooks) ร่วมกับ TypeScript
* **เป้าหมายการรัน**: รองรับแพลตฟอร์ม Web และ Hybrid Mobile Apps

---

## 🛠️ หลักการทำงาน (Logic & Data Flow)

Widget นี้ทำงานในลักษณะ **Unidirectional Data Flow** (การไหลของข้อมูลทิศทางเดียว) จากแพลตฟอร์ม Mendix เข้าสู่คอมโพเนนต์ React ดังแผนภาพด้านล่างนี้:

```mermaid
graph TD
    M["Mendix Studio Pro / Config Panel"] -- "กรอกข้อความ sampleText" --> XML["PwbDatePicker.xml"]
    XML -- "รับข้อมูลผ่าน Properties" --> TSX["PwbDatePicker.tsx"]
    TSX -- "ตรวจสอบค่าเริ่มต้น" --> COMP["DatePicker.tsx"]
    COMP -- "เรนเดอร์ HTML DOM" --> Browser["เว็บเบราว์เซอร์ของผู้ใช้งาน"]
```

1. **การตั้งค่าใน Mendix (Configuration)**: นักพัฒนาของ Mendix จะกรอกข้อความในช่องตั้งค่า **"Default value"** ในแผงการตั้งค่า of Widget
2. **การผ่านข้อมูลเข้าสู่โค้ด (Data Pipeline)**: ข้อมูลจากช่องตั้งค่าดังกล่าวจะถูกเก็บและส่งผ่านตัวแปร `sampleText`
3. **การตรวจสอบตรรกะเริ่มต้น (Logical Evaluation)**:
    * ถ้าผู้ใช้งานมีการพิมพ์ข้อความเข้ามา -> ส่งข้อความนั้นไปแสดงผล
    * ถ้าไม่มีการพิมพ์ข้อความใดๆ -> ใช้คำเริ่มต้นว่า `"World"`
4. **การแสดงผลสู่หน้าจอ (Rendering)**: React จะเรนเดอร์โครงสร้าง `div` เพื่อนำคำทักทายออกไปแสดงผลผ่านเบราว์เซอร์ในรูปแบบ `Hello [ข้อความ]`

---

## 📁 โค้ดที่ควบคุมการทำงานหลัก (Source Code Implementation)

### 1. ส่วนนิยามคุณสมบัติ (Property Definitions)

* **ไฟล์**: [PwbDatePicker.xml](file:///Users/lapat.ta/Desktop/ETC%20Project/Customize-mendix-widget-pwb-antigravity/pwbDatePicker/src/PwbDatePicker.xml)
* **หน้าที่**: กำหนดฟิลด์ให้ฝั่ง Mendix สามารถส่งค่าเข้ามายัง Widget ได้

---

### 2. คอมโพเนนต์หลักที่ควบคุมระบบ (Container Component)

* **ไฟล์**: [PwbDatePicker.tsx](file:///Users/lapat.ta/Desktop/ETC%20Project/Customize-mendix-widget-pwb-antigravity/pwbDatePicker/src/PwbDatePicker.tsx)
* **หน้าที่**: รับข้อมูล Props และเชื่อมโยง CSS สำหรับจัดแต่งรูปทรงของหน้าตา Widget

---

### 3. ส่วนเรนเดอร์ UI ย่อย (Presentational Component)

* **ไฟล์**: [DatePicker.tsx](file:///Users/lapat.ta/Desktop/ETC%20Project/Customize-mendix-widget-pwb-antigravity/pwbDatePicker/src/components/DatePicker.tsx)
* **หน้าที่**: แปลงข้อมูลที่ประมวลผลแล้วให้อยู่ในรูป HTML `div` เพื่อขึ้นแสดงบนหน้าจอของผู้ใช้งาน

---

## 🎨 สไตล์และการตกแต่งหน้าตา (Styling Guide)

ความสวยงามของ Widget นี้สามารถจัดแต่งได้อย่างอิสระผ่านไฟล์ CSS ที่ [PwbDatePicker.css](file:///Users/lapat.ta/Desktop/ETC%20Project/Customize-mendix-widget-pwb-antigravity/pwbDatePicker/src/ui/PwbDatePicker.css)

---

## 💡 แนวทางการขยายความสามารถในอนาคต (Future Enhancements Guide)

เมื่อต้องการปรับปรุงหรือพัฒนาความสามารถของ Widget เพิ่มขึ้น แนะนำให้ปฏิบัติตามขั้นตอนต่อไปนี้:

1. **การเพิ่ม Properties ใหม่**: เข้าไปเพิ่มฟิลด์ใน `<properties>` ของไฟล์ XML จากนั้นให้ทำการสั่งรันคำสั่งคอมไพล์ เพื่อสร้างประเภทตัวแปร TypeScript (Typings) ตัวใหม่ในโฟลเดอร์ `typings/` โดยอัตโนมัติ
2. **การเรียกใช้งานฟังก์ชันซับซ้อน**: แนะนำให้สร้างคอมโพเนนต์ย่อยแยกออกมาไว้ภายใต้โฟลเดอร์ `src/components/` เพื่อแยกบทบาทความรับผิดชอบของโค้ดให้ชัดเจนและเป็นระเบียบ (Single Responsibility Principle)
3. **การเปลี่ยนรูปแบบให้รองรับระดับ Native Mobile**: หากต้องการให้ Widget รันได้ทั้งบนระบบ Web และ iOS/Android แบบ Native ให้เปลี่ยนค่า `supportedPlatform` ในไฟล์ XML และเปลี่ยนโฟลเดอร์สไตล์ให้เป็น JavaScript Stylesheet ของ React Native แทน
