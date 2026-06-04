# Mendix Marketplace Profile - PWB Advanced DatePicker

## 1. Title
**PWB Advanced DatePicker**

## 2. Description
A premium, highly interactive pluggable calendar widget for Mendix. It offers single date and range selections with native support for the Thai Buddhist Era (พ.ศ.), fluid slide animations, and quick jump grids for months and years. It supports binding to both native DateTime and formatted String attributes (with auto-serialization and parsing), custom boundary time inputs, weekend blocking, custom uploaded calendar icons, and full Mendix Batch Translation compatibility.

## 3. Key Features
* **Single Date & Date Range Modes**: Pick a single date or select start/end ranges with a continuous Airbnb-style visual pill highlighter and hover range previews.
* **Thai Buddhist Era (พ.ศ.) Support**: Turn on B.E. offset year display (+543 offset) on the fly while seamlessly storing standard Gregorian dates in the backend.
* **Fast Month & Year Jump Grids**: Click headers to swap into 3x4 selection tables, bypassing tedious navigation arrow clicking to select far-away dates.
* **DateTime & String Dual-Attribute Support**: Binds directly to standard `DateTime` attributes or formatted `String` attributes. String binding parses incoming text and serializes selected dates automatically using custom patterns (e.g., `DD/MM/YYYY hh:mm`).
* **Direct Numerical Time Input**: Boundary-limited, direct typing fields for Hours (00-23) and Minutes (00-59) replacing slow slider controls.
* **Calendar Custom Icons**: Upload custom SVG/PNG calendar icons directly into Mendix Image Collections or choose standard FontAwesome/Glyphicon glyphs.
* **Accessibility & Animations**: Keyboard arrow key navigation with visual focus rings, and slide-in transition animations matching navigation directions.
* **Batch Translation Ready**: Fully compatible with native Mendix Translation tables.

---

*(ภาษาไทย / Thai Version)*

## 1. ชื่อวิจเจต (Title)
**PWB Advanced DatePicker**

## 2. คำอธิบายฟีเจอร์การทำงาน (Description)
ปฏิทินเลือกวันที่และช่วงเวลา (DatePicker & DateRange) ระดับพรีเมียมสำหรับ Mendix ที่รองรับพุทธศักราช (พ.ศ.) สมบูรณ์แบบ มาพร้อมแอนิเมชันสไลด์ขยับเดือน แผงลัดสำหรับคลิกกระโดดข้ามเดือนและปีด่วนเพื่อหลีกเลี่ยงความยุ่งยากในการกดลูกศรถี่ๆ พร้อมความสามารถพิเศษในการผูกข้อความเข้ากับแอตทริบิวต์ได้ทั้งประเภท DateTime และ String ฟอร์แมตสำเร็จ รวมถึงสามารถระบุเวลาหลักชั่วโมงและนาทีด้วยการพิมพ์ตัวเลขขอบเขต และเปิดให้อัพโหลดไอคอนปฏิทินขององค์กรเข้าไปใช้งานได้อย่างอิสระ

## 3. คุณสมบัติเด่น (Key Features)
* **โหมดเลือกเดี่ยวและแบบช่วงวันที่ (DatePicker & Range Mode)**: เลือกวันที่เดียวหรือระบุวันที่เริ่มต้น-สิ้นสุด โดยการ์ดจะแสดงผลด้วยแถบไฮไลต์เชื่อมต่อกันไร้รอยต่อสไตล์ Airbnb
* **รองรับศักราช พ.ศ. (Thai Buddhist Era)**: สามารถเลือกแสดงผลเป็นปี พ.ศ. (บวกชดเชยปี +543 ปี) สำหรับหน้าจอผู้ใช้งานในไทย โดยจะเก็บบันทึกข้อมูลโครงสร้างเป็น Gregorian Date มาตรฐานในฝั่งเซิร์ฟเวอร์โดยอัตโนมัติ
* **ระบบเลือกเดือนและปีแบบก้าวกระโดด (Fast Month/Year Jump Grids)**: คลิกแถบหัวกระดาษปฏิทินเพื่อขยายแผงตารางเลือกเดือน 3x4 หรือตารางปี 3x4 ช่วยให้ผู้ใช้สามารถข้ามปีไปเลือกวันเกิดหรือวันที่ย้อนหลังมากๆ ได้ในคลิกเดียว
* **การผูกแอตทริบิวต์ 2 รูปแบบ (Dual-Attribute)**: ผูกข้อมูลได้ทั้ง DateTime และ String โดย String Mode จะทำการแปลงข้อความวันที่ขาเข้าและเขียนจัดฟอร์แมตขาออกตามแพทเทิร์นที่กำหนด (เช่น `DD/MM/YYYY hh:mm`) ให้โดยอัตโนมัติ
* **ช่องพิมพ์ระบุชั่วโมงนาทีโดยตรง (Numerical Time Picker)**: พิมพ์ตัวเลขชั่วโมง (0-23) และนาที (0-59) ในช่องพิมพ์ได้โดยตรงและจำกัดขอบเขตความปลอดภัย ปราศจากปัญหาแถบเลื่อน (Slider) ที่ควบคุมยาก
* **กำหนดไอคอนปฏิทินกำหนดเอง (Custom Calendar Icon)**: อัพโหลดไฟล์ SVG คมชัดสูงหรือ PNG จาก Image Collection ใน Mendix ไปแสดงผลบนปุ่มเปิดปิดปฏิทินได้โดยอิสระ
* **การเปลี่ยนเดือนแบบลื่นไหลและคีย์บอร์ด**: แอนิเมชันสไลด์ซ้าย-ขวาอย่างเป็นธรรมชาติขณะเปลี่ยนเดือน คุมปฏิทินด้วยปุ่มคีย์บอร์ดลูกศร และกด Space/Enter เพื่อเลือกยืนยันได้
* **รองรับระบบแปลภาษา (Batch Translate)**: ตั้งค่าข้อความปุ่มและข้อความแสดงผลทั้งหมดผ่านระะบบ Batch Translation มาตรฐานของ Mendix Studio Pro ได้โดยตรง
