# คู่มือการนำ Mendix Pluggable Widget ไปใช้งาน (Widget Usage Guide)

เอกสารฉบับนี้อธิบายสเต็ปขั้นตอนโดยละเอียดในการนำ **Pwb Custom Widget** ที่ได้รับการคอมไพล์แล้ว ไปติดตั้ง กำหนดค่า และแสดงผลในโปรแกรม **Mendix Studio Pro**

---

## 🛠️ ขั้นตอนที่ 1: การแพ็กเกจ Widget (Bundling the Widget)

ก่อนนำ Widget ไปติดตั้งใน Mendix คุณต้องแปลงไฟล์原始โค้ดทั้งหมด (TypeScript + React) ให้เป็นไฟล์แพ็กเกจสำเร็จรูปในนามสกุล `.mpk` เสียก่อน

1. เปิด Terminal และเข้าไปในโฟลเดอร์โครงการ:

    ```bash
    cd pwbCustomWidget
    ```

2. รันคำสั่งสำหรับคอมไพล์เพื่อใช้งานจริง (Production Build):

    ```bash
    npm run release
    ```

3. หลังจากคอมไพล์สำเร็จ ระบบจะสร้างโฟลเดอร์ `dist/` ขึ้นมาและบันทึกไฟล์แพ็กเกจไว้ที่:
    `pwbCustomWidget/dist/1.0.0/pwb.pwbcustomwidget.PwbCustomWidget.mpk`

---

## 📥 ขั้นตอนที่ 2: การนำไฟล์เข้าสู่ Mendix App (Importing to Mendix App)

เมื่อได้ไฟล์ `.mpk` แล้ว ให้ดำเนินการดังนี้เพื่อนำเข้าสู่แอปพลิเคชัน Mendix ของคุณ:

### วิธีที่ A: การคัดลอกไฟล์โดยตรง (แนะนำ)

1. คัดลอกไฟล์ `.mpk` ที่เพิ่งได้มาจากโฟลเดอร์ `dist/`
2. ไปที่โฟลเดอร์โครงการของ Mendix App ของคุณ (โฟลเดอร์ที่จัดเก็บไฟล์ `.mpr` ของ Mendix)
3. คัดลอกไปวางไว้ภายในโฟลเดอร์ย่อยชื่อ **`widgets`** (ถ้าไม่มีโฟลเดอร์ `widgets` ให้ทำการสร้างโฟลเดอร์ใหม่ขึ้นมาได้เลย)

   ```bash
   [Mendix Project Root]/
   ├── widgets/
   │   └── pwb.pwbcustomwidget.PwbCustomWidget.mpk  <-- วางไฟล์ที่นี่
   └── [ProjectName].mpr
   ```

### วิธีที่ B: การอิมพอร์ตผ่านหน้าโปรแกรม

1. เปิดโปรแกรม Mendix Studio Pro
2. ไปที่เมนู **App** > **Import Widget Package...** (หรือกดปุ่มลัด **F4** เพื่อรีเฟรชโครงสร้างโฟลเดอร์)
3. เลือกไฟล์ `.mpk` จากเครื่องของคุณ

---

## 🖥️ ขั้นตอนที่ 3: การวาง Widget บนหน้าเพจ (Placing the Widget on a Page)

1. เปิด Mendix Studio Pro และดับเบิ้ลคลิกเปิดหน้าเพจ (Page) ที่คุณต้องการนำ Widget ไปแสดงผล
2. ดูแผงด้านขวาในส่วนของ **Toolbox**
3. เลื่อนหาหัวข้อชื่อกลุ่มการใช้งาน (หรือค้นหาจากช่องค้นหาพิมพ์ว่า `"Pwb Custom Widget"`)
4. ทำการ **ลากและวาง (Drag & Drop)** Widget ไปยังตำแหน่งบนหน้าเพจที่คุณต้องการ

---

## ⚙️ ขั้นตอนที่ 4: การกำหนดค่า Properties (Configuring Properties)

1. **ดับเบิ้ลคลิก** ที่ตัว Widget บนหน้าเพจ เพื่อเปิดหน้าต่างการตั้งค่า (Properties Dialog)
2. ในแท็บ **General** จะพบฟิลด์สำหรับป้อนข้อมูล:
   * **Default value (sampleText)**: กรอกข้อความที่คุณต้องการแสดงผล (เช่น `"นวัตกรรม PWB"`)
3. คลิก **OK** เพื่อบันทึกค่า

---

## 🔄 ขั้นตอนที่ 5: การพัฒนาแบบเรียลไทม์ (Hot Reloading during Development)

หากคุณกำลังปรับแต่ง Widget และต้องการเห็นการเปลี่ยนแปลงบน Mendix App ในทันทีขณะเขียนโค้ด:

1. แก้ไขไฟล์ `pwbCustomWidget/package.json` ตรงการตั้งค่า `config.projectPath` ให้ชี้ไปยังที่ตั้งโฟลเดอร์ Mendix App ของคุณ:

   ```json
   "config": {
     "projectPath": "../path/to/your/mendix-app-folder"
   }
   ```

2. รันคำสั่ง Watch ใน Terminal:

   ```bash
   npm run dev
   ```

3. ทุกครั้งที่คุณกด Save โค้ดในโปรเจคนี้ ระบบจะคอมไพล์ใหม่และคัดลอกไฟล์เข้าไปในโฟลเดอร์ Mendix App โดยอัตโนมัติ
4. ใน Mendix Studio Pro ให้กดปุ่ม **F4** (เพื่อซิงค์ข้อมูลโฟลเดอร์) แล้วคุณจะเห็นหน้าตาของ Widget ที่อัปเดตใหม่ได้ทันที!
