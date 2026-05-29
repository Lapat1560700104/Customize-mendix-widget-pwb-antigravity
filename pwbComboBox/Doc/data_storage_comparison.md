# 🗄️ ธรรมชาติการจัดเก็บข้อมูล: ComboBox ปกติ vs. pwbComboBox

---

## 📌 ภาพรวม: ความแตกต่างหลัก

```
ComboBox ปกติ (Mendix Built-in)        pwbComboBox (Widget ของเรา)
─────────────────────────────          ──────────────────────────────────
เก็บได้แค่ 1 วิธี (ตาม widget)         เก็บได้ 3 วิธีในคราวเดียว
ไม่ยืดหยุ่น                            เลือกได้ตามโครงสร้าง domain
Single-select เท่านั้น (พื้นฐาน)       Single + Multi-select ในตัว
```

---

## 🧠 วิธีที่ Mendix เก็บค่าที่ผู้ใช้เลือก

ใน Mendix มีกลไกหลัก **2 ประเภท** ในการเก็บค่าที่ user เลือกจาก ComboBox:

### ประเภท A — Attribute (เก็บเป็น "ค่า" โดยตรง)
> เก็บ "ตัวเลขหรือข้อความ" ของ option ที่เลือกไว้ใน attribute ของ entity ปัจจุบัน

### ประเภท B — Association (เก็บเป็น "ความสัมพันธ์" ไปยัง object อื่น)
> เก็บ pointer/GUID ที่ชี้ไปยัง object ใน entity อื่น — ฐานข้อมูลจะเก็บ foreign key

---

## 1️⃣ ComboBox ปกติของ Mendix

### วิธีเก็บข้อมูล

```
[Entity: Order]                     [Entity: Product]
──────────────────                  ─────────────────
ProductID    (Integer)  ←────────── ID (AutoNumber)
                                    Name
                                    Price
```

**หรือแบบ Association:**
```
[Entity: Order]          Association          [Entity: Product]
─────────────── Order_Product (Reference) ──── ─────────────────
                  └──── Foreign Key ────────►  ID
                                               Name
```

**ข้อจำกัดของ Mendix Standard ComboBox:**
| ข้อ | ข้อจำกัด |
|---|---|
| ❌ | Single-select เท่านั้น |
| ❌ | ต้องเลือกว่าจะเป็น Attribute หรือ Association — ไม่ใช่ทั้งคู่ |
| ❌ | Appearance ปรับได้จำกัด |
| ❌ | ไม่มี search/filter |
| ❌ | ไม่รองรับ Multi-select โดยธรรมชาติ |

---

## 2️⃣ pwbComboBox — รองรับทั้ง 3 Pattern พร้อมกัน

Widget ของเราอ่าน `selectedAttribute` **และ** `selectedAssociation` ได้พร้อมกัน
ทำให้ developer เลือก pattern ที่ต้องการได้อิสระ

---

### 🅰️ Pattern 1 — String Attribute (Single Select)

**ใช้เมื่อ:** ต้องการเก็บ label ของ option ลงใน String attribute โดยตรง

```
User เลือก: "Thailand"
                │
                ▼
Entity.CountryName (String) = "Thailand"
```

**ใน Code (PwbComboBox.tsx บรรทัด 109):**
```typescript
// เมื่อ user เลือก option
selectedAttribute.setValue(option.label);
// → เก็บ "Thailand" ลงใน String attribute
```

**ใน Database:**
```
Table: Customer
┌────┬───────────────┬─────────────┐
│ ID │ Name          │ CountryName │
├────┼───────────────┼─────────────┤
│  1 │ John Doe      │ Thailand    │
│  2 │ Jane Smith    │ Japan       │
└────┴───────────────┴─────────────┘
```

> ✅ **เหมาะเมื่อ:** ข้อมูล option ไม่มี entity เป็นของตัวเอง (เช่น status, country code)

---

### 🅱️ Pattern 2 — Integer Attribute (Single Select via ID)

**ใช้เมื่อ:** Option list มาจาก Enum หรือ lookup table ที่ใช้ ID เป็น key

```
User เลือก: "Manager" (ID = 3)
                │
                ▼
Entity.RoleID (Integer) = 3
```

**ใน Code (PwbComboBox.tsx บรรทัด 68–74):**
```typescript
// อ่าน: จับคู่ ID หรือ label กับ option list
const matched = options.find(o => o.id === attrVal || o.label === attrVal);

// เขียน: เก็บ label (developer ต้องออกแบบ mapping เอง)
selectedAttribute.setValue(option.label);
```

---

### 🅲 Pattern 3 — Reference Association (Single Select Object Pointer)

**ใช้เมื่อ:** ต้องการ link object จาก entity หนึ่งไปยังอีก entity ด้วย Mendix Reference

```
User เลือก: "Product A" (GUID: abc-123)
                │
                ▼
Order.Order_Product (Reference) → Product{id: "abc-123"}
```

**ใน Code (PwbComboBox.tsx บรรทัด 106):**
```typescript
// เขียน: pass rawObject (Mendix ObjectItem) ลง association
assoc.setValue(option.rawObject);
// Mendix จัดการ foreign key ใน DB ให้อัตโนมัติ
```

**อ่านค่ากลับ (บรรทัด 62–67):**
```typescript
if (assoc && assoc.value) {
    const matched = options.find(o => o.id === assoc.value.id);
    if (matched) {
        selectedIds = [matched.id];   // ← highlight option ที่ถูก select ใน UI
    }
}
```

**ใน Database:**
```
Table: Order                    Table: Product
┌────┬──────────────────────┐   ┌──────────┬───────────┬───────┐
│ ID │ Order_Product_fk     │   │ ID (GUID)│ Name      │ Price │
├────┼──────────────────────┤   ├──────────┼───────────┼───────┤
│  1 │ abc-123 ─────────────┼──►│ abc-123  │ Product A │ 500   │
│  2 │ def-456 ─────────────┼──►│ def-456  │ Product B │ 800   │
└────┴──────────────────────┘   └──────────┴───────────┴───────┘
```

> ✅ **เหมาะเมื่อ:** Option มี entity เป็นของตัวเอง (Product, Employee, Category ฯลฯ)

---

### 🅳 Pattern 4 — ReferenceSet + Delimited String (Multi Select) ⭐ ไม่มีใน Mendix Standard

**ใช้เมื่อ:** ต้องการ Multi-Select

#### Option A: ReferenceSet (หลาย object)
```
User เลือก: ["Tag A", "Tag B", "Tag C"]
                │
                ▼
Article.Article_Tags (ReferenceSet) → [Tag{1}, Tag{2}, Tag{3}]
```

**ใน Code (PwbComboBox.tsx บรรทัด 116):**
```typescript
// เพิ่ม object เข้า reference set
assoc.setValue([...currentSelected, option.rawObject]);

// ลบ object ออก
assoc.setValue(currentSelected.filter(item => item.id !== id));
```

**ใน Database (Junction Table):**
```
Table: Article_Tags (auto-generated by Mendix)
┌────────────┬────────┐
│ Article_ID │ Tag_ID │
├────────────┼────────┤
│    1       │   10   │
│    1       │   11   │
│    1       │   12   │
└────────────┴────────┘
```

#### Option B: Delimited String (เก็บใน String attribute เดียว)
```
User เลือก: ["Bangkok", "Chiang Mai", "Phuket"]
                │
                ▼
Customer.Cities (String) = "Bangkok, Chiang Mai, Phuket"
```

**ใน Code (PwbComboBox.tsx บรรทัด 124–131):**
```typescript
const delim = delimiter || ",";   // ← กำหนดได้จาก Mendix Studio Pro

// Serialize: ["Bangkok", "Chiang Mai"] → "Bangkok, Chiang Mai"
const serializedValue = currentIds
    .map(cid => {
        const opt = options.find(o => o.id === cid);
        return opt ? opt.label : cid;
    })
    .join(delim + " ");

selectedAttribute.setValue(serializedValue);
```

**ใน Database:**
```
Table: Customer
┌────┬───────────────────────────────┐
│ ID │ Cities                        │
├────┼───────────────────────────────┤
│  1 │ Bangkok, Chiang Mai, Phuket   │
│  2 │ Tokyo, Osaka                  │
└────┴───────────────────────────────┘
```

> ⚠️ **ข้อควรระวัง:** Delimited String ง่ายแต่ Query ยาก — ใช้เมื่อไม่ต้องการ filter/join บน DB

---

## 📊 ตารางสรุปเปรียบเทียบ

| | Standard Mendix CB | pwbComboBox (Attribute) | pwbComboBox (Association) |
|---|---|---|---|
| **เก็บอะไร** | ค่า/ID | String หรือ Integer | GUID → Object pointer |
| **Single Select** | ✅ | ✅ | ✅ |
| **Multi Select** | ❌ | ✅ (Delimited) | ✅ (ReferenceSet) |
| **Query จาก DB** | ✅ ง่าย | ⚠️ ยากถ้า delimited | ✅ ง่าย (JOIN) |
| **Data integrity** | ⚠️ ขึ้นกับ developer | ⚠️ ไม่มี FK constraint | ✅ FK constraint ใน DB |
| **รองรับ Object ซับซ้อน** | ❌ | ❌ | ✅ |
| **Search/Filter** | ❌ | ✅ | ✅ |
| **Avatar / Color / Group** | ❌ | ❌ | ✅ (ผ่าน expression) |

---

## 🧭 Decision Guide: ควรใช้ Pattern ไหน?

```
ต้องการ Multi-Select?
├── ใช่ → มี Entity สำหรับ Option?
│         ├── ใช่ → ✅ ReferenceSet Association
│         └── ไม่ → ✅ Delimited String Attribute
└── ไม่ → Option มี Entity เป็นของตัวเอง?
          ├── ใช่ → ✅ Reference Association  (ดีที่สุดสำหรับ data integrity)
          └── ไม่ → ✅ String/Integer Attribute (เร็ว เรียบง่าย)
```
