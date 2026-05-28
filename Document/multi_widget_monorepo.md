# คู่มือการจัดเก็บและพัฒนาหลาย Widget ในโปรเจคเดียวกัน (Multi-Widget Monorepo Guide)

เอกสารฉบับนี้จัดทำขึ้นเพื่ออธิบายแนวคิดการจัดโครงสร้างโปรเจคแบบ **Monorepo (Multi-project)** ในกรณีที่ต้องการพัฒนาและจัดเก็บ Mendix Pluggable Widgets หลายๆ ตัวไว้ภายใน Repository หลักเดียวกัน พร้อมระบบคอมไพล์แยกออกมาเป็นแต่ละไฟล์ `.mpk` อย่างสมบูรณ์

---

## 💡 แนวคิดและข้อจำกัดเชิงเทคนิค (Technical Concepts)

ในการทำงานร่วมกับเครื่องมือพัฒนาอย่างเป็นทางการของ Mendix (`@mendix/pluggable-widgets-tools`):
*   **ข้อจำกัด**: เครื่องมือบิลด์ถูกออกแบบมาให้อ่านการตั้งค่าแบบ **1-to-1** (หนึ่งโฟลเดอร์โปรเจคที่มี `package.json` และ XML คุณสมบัติ = บิลด์ออกเป็น **1 ไฟล์ `.mpk` เสมอ**)
*   **ทางออก**: เราใช้สถาปัตยกรรมแบบ **Monorepo** โดยเก็บโค้ดของแต่ละ Widget แยกออกจากกันเป็นโฟลเดอร์โปรเจคย่อยภายใน Repository หลักตัวเดียวกัน ซึ่งจะทำให้รักษาความเป็นสัดส่วน สะดวกต่อการใช้ Git และสามารถสั่งคอมไพล์บิลด์แยกออกมาเป็นรายไฟล์ได้อย่างเป็นอิสระ

---

## 📂 โครงสร้างโฟลเดอร์แนะนำ (Recommended Directory Structure)

โครงสร้างโฟลเดอร์ภายในโครงการหลัก `Customize-mendix-widget-pwb-antigravity/` จะถูกปรับปรุงให้รองรับโปรเจคย่อยได้ดังนี้:

```bash
Customize-mendix-widget-pwb-antigravity/       # [Repository หลัก]
├── README.md                                  # คู่มือภาพรวมระดับรูท
├── package.json                               # รูทสคริปต์สำหรับคุมเวิร์กสเปซทั้งหมด
├── Document/                                  # โฟลเดอร์จัดเก็บเอกสาร
│   ├── widget_overview.md
│   ├── widget_usage.md
│   └── multi_widget_monorepo.md               # เอกสารฉบับนี้ (คู่มือ Monorepo)
│
├── pwbCustomWidget/                           # [Widget ตัวที่ 1: DatePicker]
│   ├── package.json                           # การตั้งค่าและ Dependencies ของตัวที่ 1
│   ├── src/
│   │   ├── PwbCustomWidget.xml                # XML กำหนด Properties ของตัวที่ 1
│   │   └── PwbCustomWidget.tsx
│   └── dist/
│       └── 1.0.0/pwb.PwbCustomWidget.mpk      # ผลลัพธ์บิลด์ของตัวที่ 1
│
└── pwbAnotherWidget/                          # [Widget ตัวที่ 2: สร้างเพิ่มเติม]
    ├── package.json                           # การตั้งค่าและ Dependencies ของตัวที่ 2
    ├── src/
    │   ├── PwbAnotherWidget.xml               # XML กำหนด Properties ของตัวที่ 2
    │   └── PwbAnotherWidget.tsx
    └── dist/
        └── 1.0.0/pwb.PwbAnotherWidget.mpk     # ผลลัพธ์บิลด์ของตัวที่ 2
```

---

## 🔧 ขั้นตอนการเพิ่ม Widget ตัวใหม่ (Adding a New Widget)

หากคุณต้องการเพิ่ม Widget ตัวที่สอง (หรือตัวถัดๆ ไป) ภายใน Repository นี้ สามารถทำได้โดย:

1.  เปิด Terminal ที่รูทระดับบนสุดของโปรเจค
2.  ใช้เครื่องมือ Yeoman เพื่อสั่งสร้าง Widget ตัวใหม่โดยระบุชื่อโฟลเดอร์ปลายทางแยกจากกัน:
    ```bash
    npx @mendix/generator-widget pwbAnotherWidget
    ```
3.  ป้อนค่าคุณสมบัติต่างๆ ตามขั้นตอนของ Generator จนเสร็จสิ้น
4.  หลังจากนั้นคุณจะได้รับโฟลเดอร์โปรเจคย่อยตัวใหม่ (`pwbAnotherWidget/`) ซึ่งแยกการทำงาน ตัวแปร XML และ `.mpk` เป็นเอกเทศ

---

## ⚡ ระบบสั่งการควบคุมจากจุดศูนย์กลาง (Root Workspace Automation)

เพื่อเพิ่มความสะดวก รวดเร็ว และไม่ต้องเปลี่ยนโฟลเดอร์ (`cd`) ไปมาเพื่อสั่งบิลด์ทีละชิ้นงาน เราสามารถเขียนไฟล์ **`package.json`** ไว้ที่โฟลเดอร์รูทหลักระดับบนสุด เพื่อใช้ความสามารถของ **NPM Workspaces** ในการจัดการเวิร์กสเปซทั้งหมด:

### ไฟล์ตัวอย่าง: `package.json` (ที่โฟลเดอร์หลักนอกสุด)
```json
{
  "name": "pwb-widgets-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "pwb*"
  ],
  "scripts": {
    "install:all": "npm install",
    "build:all": "npm run build --workspaces",
    "release:all": "npm run release --workspaces",
    "lint:all": "npm run lint --workspaces",
    "lint:fix:all": "npm run lint:fix --workspaces",
    "build:pwbCustomWidget": "npm run build -w pwbCustomWidget",
    "release:pwbCustomWidget": "npm run release -w pwbCustomWidget"
  }
}
```

### คำสั่งศูนย์กลางที่ใช้งานได้ทันที (จากโฟลเดอร์นอกสุด):

#### A. สั่งการพร้อมกันทุก Widget (All Workspaces):
*   **ติดตั้ง Dependencies ทุกโครงการพร้อมกัน**:
    ```bash
    npm run install:all
    ```
*   **บิลด์ทดสอบ (Development Build) ทุกตัวพร้อมกัน**:
    ```bash
    npm run build:all
    ```
*   **สร้างไฟล์ `.mpk` (Production Release) ทุกตัวพร้อมกัน**:
    ```bash
    npm run release:all
    ```

#### B. สั่งการแยกกันทีละ Widget (Individual Workspace):
คุณสามารถสั่งงานคอมไพล์แยกเฉพาะเจาะจงเจาะจงรายตัวจากรูทด้านนอกได้ 2 วิธี:

**วิธีที่ 1: ใช้สคริปต์ทางลัดที่เราลงทะเบียนไว้ใน package.json**:
*   บิลด์ทดสอบเฉพาะ DatePicker: `npm run build:pwbCustomWidget`
*   บิลด์ออกไฟล์ `.mpk` เฉพาะ DatePicker: `npm run release:pwbCustomWidget`

**วิธีที่ 2: ใช้คำสั่งมาตรฐานของ NPM Workspace (สำหรับโปรเจคที่สร้างขึ้นใหม่ในอนาคต)**:
*   คุณไม่จำเป็นต้องแอดสคริปต์ใหม่ลงในรูททุกครั้ง เพียงพิมพ์คำสั่งและระบุชื่อโฟลเดอร์ผ่านธง `-w` (หรือ `--workspace`):
    ```bash
    npm run build -w <ชื่อโฟลเดอร์-widget>
    npm run release -w <ชื่อโฟลเดอร์-widget>
    ```
    *ตัวอย่างเช่น: `npm run release -w pwbCustomWidget`*

---

## 🌟 ข้อดีของการจัดโครงสร้างแบบ Monorepo ในโครงการ Mendix
1.  **การควบคุมผ่าน Git (Single Repository)**: โค้ดทั้งหมดของทุก Widget อยู่ใน Repository เดียวกัน ทำให้ควบคุมเวอร์ชัน ตรวจสอบประวัติโค้ด (Git History) และอัปเดตงานร่วมกันได้ง่าย
2.  **การแยก Dependency เป็นสัดส่วน (Dependency Isolation)**: Widget แต่ละตัวสามารถลง Library แยกกัน หรืออัปเกรดเวอร์ชันต่างกันได้ตามความเหมาะสม โดยไม่ส่งผลกระทบและไม่ตีกันเอง
3.  **การสร้างสรรค์ที่รวดเร็ว (Automated Orchestration)**: สั่งคอมไพล์ แพ็กเกจ และอัปเดตไฟล์เข้าไปยังโฟลเดอร์ Mendix App ปลายทางของทุก Widget ได้พร้อมกันผ่านศูนย์บัญชาการเดียวกัน
