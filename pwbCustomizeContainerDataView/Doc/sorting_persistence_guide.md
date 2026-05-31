# 🗄️ กลไกการบันทึกและคืนค่าลำดับรายการ: pwbCustomizeContainerDataView

---

## 📌 ภาพรวม: ปัญหาของ Mendix Standard List และทางแก้ที่สมบูรณ์

```
Mendix Standard ListView           pwbCustomizeContainerDataView
─────────────────────────          ──────────────────────────────────
ลำดับถูกกำหนดจาก DataSource       ลำดับควบคุมได้จากการลาก-วาง
ผู้ใช้จัดลำดับเองไม่ได้            ผู้ใช้ลากสลับลำดับได้อิสระ
ไม่มีกลไกบันทึกลำดับ              บันทึกลำดับอัตโนมัติทุก Drop
ต้องเขียน Custom JS เอง           ไม่ต้องเขียนโค้ดเพิ่มเติม
```

---

## 🧠 กลไกหลักของ Sorted Order System

Widget มีระบบจัดการลำดับ 2 ทิศทาง:

### ทิศทาง A — Serialization (บันทึกลำดับ ขาออก)
> เมื่อผู้ใช้ลากรายการไปวางในตำแหน่งใหม่ → Widget รวบรวม GUIDs ล่าสุด → Serialize เป็น String → บันทึกลง Mendix Attribute

### ทิศทาง B — Hydration (คืนลำดับ ขาเข้า)
> เมื่อ Widget โหลดขึ้นมาแสดงผล → อ่าน String จาก Attribute → แยก GUIDs → จัดเรียง Item ให้ตรงกับลำดับที่บันทึกไว้

---

## 1️⃣ กลไกบันทึก (Serialization — ขาออก)

### วิธีทำงาน

```
ผู้ใช้ลาก "Task B" จากตำแหน่งที่ 1 ไปวางที่ตำแหน่งที่ 3
                    │
                    ▼
ก่อนลาก: [Task-A, Task-B, Task-C, Task-D]
                    │
         DragContainer สลับ State Array
                    │
หลังวาง: [Task-A, Task-C, Task-B, Task-D]
                    │
         onOrderChange(["guid-A", "guid-C", "guid-B", "guid-D"])
                    │
         sortedAttribute.setValue("guid-A,guid-C,guid-B,guid-D")
                    │
         onSortAction.execute()   ← เรียก Microflow/Nanoflow
```

### ใน Code (PwbCustomizeContainerDataView.tsx)

```typescript
const handleOrderChange = (newOrderIds: string[]): void => {
    if (sortedAttribute && !sortedAttribute.readOnly) {
        // Serialize: ["guid-A", "guid-C", "guid-B"] → "guid-A,guid-C,guid-B"
        const serialized = newOrderIds.join(",");
        sortedAttribute.setValue(serialized);

        // Trigger Mendix Action
        if (onSortAction && onSortAction.canExecute && !onSortAction.isExecuting) {
            onSortAction.execute();
        }
    }
};
```

### ในฐานข้อมูล Mendix

```
Entity: TaskBoard
┌────┬───────────────────────────────────────────────────┐
│ ID │ SortedTaskIds (String)                            │
├────┼───────────────────────────────────────────────────┤
│  1 │ guid-A,guid-C,guid-B,guid-D                       │
│  2 │ guid-X,guid-Y,guid-Z                              │
└────┴───────────────────────────────────────────────────┘
```

---

## 2️⃣ กลไกคืนลำดับ (Hydration — ขาเข้า)

### วิธีทำงาน

```
Widget โหลดขึ้นมา
        │
        ▼
sortedAttribute.value = "guid-C,guid-A,guid-D,guid-B"
        │
        ▼
แยก: ["guid-C", "guid-A", "guid-D", "guid-B"]
        │
        ▼
จับคู่กับ itemsSource.items และเรียงตามลำดับที่บันทึกไว้:
  1. Task-C  ← guid-C
  2. Task-A  ← guid-A
  3. Task-D  ← guid-D
  4. Task-B  ← guid-B
        │
        ▼
DragContainer แสดงผลตามลำดับที่ถูกต้อง ✅
```

### ใน Code (PwbCustomizeContainerDataView.tsx)

```typescript
const dragItems: DragItem[] = useMemo(() => {
    if (!itemsSource.items) return [];
    
    const rawList = itemsSource.items.map(item => ({
        id: item.id,
        rawObject: item
    }));

    if (sortedAttribute?.value) {
        const sortedIds = sortedAttribute.value
            .split(",")
            .map(id => id.trim())
            .filter(id => id !== "");

        if (sortedIds.length > 0) {
            const sortedMap = new Map<string, number>();
            sortedIds.forEach((id, idx) => sortedMap.set(id, idx));

            return [...rawList].sort((a, b) => {
                const idxA = sortedMap.has(a.id) ? sortedMap.get(a.id)! : Infinity;
                const idxB = sortedMap.has(b.id) ? sortedMap.get(b.id)! : Infinity;
                return idxA - idxB;
            });
        }
    }

    return rawList;  // ← คืน item ตามลำดับ datasource หาก attribute ยังว่าง
}, [itemsSource.items, sortedAttribute?.value]);
```

---

## 3️⃣ การจัดการ Item ใหม่ที่ยังไม่มีในลำดับที่บันทึก

เมื่อมีการเพิ่ม Item ใหม่เข้า Datasource โดยที่ `sortedAttribute` ยังไม่มี GUID ของ Item นั้น — Widget จะแสดง Item ใหม่ต่อท้ายรายการเสมอ

```
sortedAttribute.value = "guid-A,guid-B"
itemsSource.items     = [Task-A, Task-B, Task-C ← ใหม่]

ผลลัพธ์:
  1. Task-A  ← มีใน saved order
  2. Task-B  ← มีใน saved order
  3. Task-C  ← ใหม่, ต่อท้ายอัตโนมัติ
```

---

## 📊 การออกแบบ Mendix Entity Schema ที่แนะนำ

### Pattern 1 — ผูกกับ Parent Entity โดยตรง

```
Entity: TaskBoard                    Entity: Task
──────────────────                   ──────────────────
ID (AutoNumber)                      ID (AutoNumber)
Name (String)                        Title (String)
SortedTaskIds (String) ◄─ ผูกกับ   Priority (String)
                            widget   Assignee (String)
                          ↑
                sortedAttribute property
```

**เหมาะสำหรับ**: มี Board หนึ่งตัวที่ Task ทั้งหมดอยู่ด้วยกัน

### Pattern 2 — ผูกกับ Column Entity (Kanban Style)

```
Entity: KanbanColumn                 Entity: Task
──────────────────                   ──────────────────
ID (AutoNumber)                      ID (AutoNumber)
ColumnName (String)                  Title (String)
SortedTaskIds (String) ◄─ ผูกกับ   Status (String)
                            widget
                          ↑
                sortedAttribute property
```

**เหมาะสำหรับ**: มีหลาย Column (Todo, In Progress, Done) แต่ละ Column มีลำดับ Task เป็นของตัวเอง

---

## 🧭 Decision Guide: ควรออกแบบ Mendix Schema อย่างไร?

```
มีหน้า Board เดียวหรือไม่?
├── ใช่ → ผูก SortedIds ที่ Entity ระดับหน้า (Page Entity / Dashboard Entity)
└── ไม่ → มีหลาย Group/Column/Category หรือไม่?
           ├── ใช่ → ผูก SortedIds ที่แต่ละ Column/Group Entity
           └── ไม่ → ผูกที่ Parent Object ที่เป็นเจ้าของ List นั้น
```

---

## ⚠️ ข้อควรระวังและข้อจำกัด

| ประเด็น | รายละเอียด |
|---|---|
| **Format ของ sortedAttribute** | ค่าที่บันทึกเป็น `GUID,GUID,GUID` ใช้ Mendix Internal ID — ไม่ใช่ค่า Attribute ทั่วไป ห้ามแก้ค่านี้ใน Microflow โดยไม่ระวัง |
| **Read-only Attribute** | หาก `sortedAttribute.readOnly = true` (เช่น อยู่ใน DataView แบบ Read-Only) Widget จะไม่เขียนค่าลงไป ต้องตรวจสอบสิทธิ์ Entity ให้ถูกต้อง |
| **การลบ Item** | เมื่อ Item ถูกลบจาก Datasource, GUID นั้นจะหายไปจาก `sortedAttribute` ในการโหลดรอบถัดไปโดยอัตโนมัติ (Widget filter ออก) |
| **จำนวน Item มาก** | สำหรับรายการที่มีมากกว่า 500 Item แนะนำให้ Paginate ใน Datasource เพื่อประสิทธิภาพ การ Drag & Drop ยังทำงานได้ แต่ String ที่บันทึกจะยาวมาก |
