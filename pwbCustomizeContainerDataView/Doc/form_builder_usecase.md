# 📋 กรณีใช้งาน: ระบบจัดรูปแบบคำถามฟอร์มไดนามิก (Dynamic Form Builder Use Case)

---

## 📌 1. ภาพรวมของระบบ (Overview)

ในระบบงานองค์กรหรือการทำแบบสอบถามออนไลน์ มักมีความจำเป็นต้องออกแบบฟอร์มตอบคำถามที่มี **คำถามหลากหลายรูปแบบคละกันอยู่ในหน้าเดียว** (เช่น ข้อความสั้น, ข้อความยาว, เลือกตอบวิทยุ, หลายตัวเลือก, และปฏิทินวันที่) และผู้สร้างแบบฟอร์มต้องการสลับตำแหน่ง ลำดับข้อคำถาม (Question Reordering) ได้ตามต้องการ

**`PwbCustomizeContainerDataView`** ทำหน้าที่เป็นตัวสลับลำดับอัจฉริยะ โดยเปิดให้นำ Mendix Widget ที่แตกต่างกันมาประกอบเข้าด้วยกันในแต่ละแถวรายการ (Row Item) และสลับตำแหน่งได้แบบเรียลไทม์

---

## 🏗️ 2. สถาปัตยกรรมระดับออบเจกต์ (Object Architecture & Domain Model)

ในการทำ Form Builder ระบบจะสร้างความสัมพันธ์ดังนี้:

```
┌──────────────────────────────────────┐          ┌──────────────────────────────────────┐
│             FormTemplate             │          │             FormQuestion             │
│   (Context Entity ของหน้าหลัก)         │          │      (Datasource - แถวไอเทมคำถาม)     │
├──────────────────────────────────────┤          ├──────────────────────────────────────┤
│ - TemplateName (String)              │ 1      * │ - QuestionText (String)              │
│ - SortedQuestionIds (Unlimited String)◄─────────┼─ - QuestionType (Enum: Text, Choice) │
└──────────────────────────────────────┘          └──────────────────────────────────────┘
```

* **`FormTemplate`**: เป็นแม่แบบใหญ่ของฟอร์ม (Parent) เก็บคอนฟิกชื่อฟอร์ม และข้อความเรียงลำดับ `SortedQuestionIds`
* **`FormQuestion`**: เป็นคำถามแต่ละข้อ (Child) เก็บข้อความตัวคำถาม ประเภทของคำถาม (เช่น Text, Choice, Date) และการตั้งค่าอื่นๆ

---

## 🛠️ 3. แนวทางการจัดหน้าจอใน Mendix Studio Pro (Mendix Layout Setup)

เพื่อให้แต่ละแถวคำถามสามารถแสดงผลประเภทคำรับข้อมูลที่ต่างกันได้ ให้ทำตามขั้นตอนการวาง Layout ซ้อนด้านในช่อง **Custom Option Content** ดังนี้:

```
[ Custom Option Content Dropzone ]
  └─ [ Main Row Container ]
       ├─ [ Header Area: แสดง QuestionText เช่น "1. กรุณากรอกอายุของคุณ" ]
       └─ [ Body Area: คอนเทนเนอร์คละสลับการเรนเดอร์คำตอบ ]
            ├─ [ Container A ] (Visible if: QuestionType = 'Text')
            │    └─ [ Mendix Standard TextBox Widget ]
            ├─ [ Container B ] (Visible if: QuestionType = 'MultipleChoice')
            │    └─ [ Mendix Standard RadioButtons or custom Dropdown Widget ]
            └─ [ Container C ] (Visible if: QuestionType = 'Date')
                 └─ [ Mendix Standard DatePicker or custom DatePicker Widget ]
```

### การตั้งค่า Conditional Visibility (การแสดงผลตามเงื่อนไข):
* **Container A (คำตอบเขียนตอบ)**: ตั้งค่าการมองเห็นให้ตรวจสอบเงื่อนไข `QuestionType = 'Text'`
* **Container B (คำตอบแบบตัวเลือก)**: ตั้งค่าให้มองเห็นเมื่อ `QuestionType = 'MultipleChoice'`
* **Container C (คำตอบแบบปฏิทินวันที่)**: ตั้งค่าให้มองเห็นเมื่อ `QuestionType = 'Date'`

---

## 🔄 4. ผลลัพธ์และจังหวะการเปลี่ยนลำดับ (Sorting Behavior)

เมื่อรันแอปพลิเคชันจริง:
1. **ความยืดหยุ่นสูง**: แถวที่ 1 อาจแสดงช่องอินพุตประเภทข้อความ แถวที่ 2 แสดงประเภท Choice และแถวที่ 3 แสดงประเภทปฏิทินวันที่ คละกันตามข้อมูลในฐานข้อมูลจริง
2. **การเรียงลำดับที่นุ่มนวล**: ผู้ใช้เล็งเมาส์ไปคลิกค้างที่ปุ่มจับลาก (Drag Handle) ของแถวใดๆ แล้วลากสลับขึ้นลง เส้นบอกตำแหน่งวาง (Drop indicator) จะเรืองแสงนำสายตาอย่างราบรื่น
3. **การบันทึกข้อมูลอัตโนมัติ**: ทุกๆ ครั้งที่มีการปล่อยออบเจกต์สำเร็จ ตัวเลข GUIDs ชุดใหม่จะเขียนลงฟิลด์ `SortedQuestionIds` และยิงสั่งรัน Microflow หลังการลากเพื่อคอมมิทค่าตำแหน่งเซฟลงฐานข้อมูลฝั่ง Server ทันที
