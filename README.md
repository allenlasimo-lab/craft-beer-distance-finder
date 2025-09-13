# Craft Beer Distance Finder (No-build React, ESM)

วิธีรันแบบง่ายสุด (ไม่ต้องติดตั้งอะไรเพิ่ม นอกจากมีตัวเสิร์ฟไฟล์ให้เปิดบน `http://localhost`):

1) แตก zip แล้วเปิดโฟลเดอร์นี้

2) รันเว็บเซิร์ฟเวอร์ชั่วคราว (เลือกอย่างใดอย่างหนึ่ง)

   - ถ้ามี Python: `python -m http.server 8000`

   - หรือ Node.js: `npx serve` (ถ้ายังไม่มี ติดตั้งด้วย `npm i -g serve`)

3) เปิดเบราว์เซอร์ไปที่ `http://localhost:8000` (หรือพอร์ตที่เครื่องมือบอก)

4) กดปุ่ม "ใช้ตำแหน่งปัจจุบัน" เพื่อคำนวณระยะทาง (ต้องรันผ่าน http://localhost หรือ https เท่านั้น ถ้าเปิดจาก file:// จะใช้ geolocation ไม่ได้)


## แก้ไขลิสต์ร้าน
- กดปุ่ม **Import JSON** ในหน้าเว็บ แล้ววางข้อมูลรูปแบบ:

```json
[
  {"name":"Your Taproom","city":"Bangkok","lat":13.75,"lng":100.50,"address":"...","url":"https://..."}
]
```

- หรือจะแก้ที่ไฟล์ `app.js` โดยแก้ค่าในตัวแปร `DEFAULT_SHOPS` แล้วรีเฟรชหน้า


## ทางเลือกอื่น ๆ

### รันด้วย Vite (โหมด Dev)

```

npm create vite@latest craft-beer-distance -- --template react

cd craft-beer-distance

npm i

# แทนที่ไฟล์ src/App.jsx ด้วยโค้ดคอมโพเนนต์จาก app.js (แก้ import เป็น: import React, { ... } from 'react')

# เพิ่ม Tailwind ตามคู่มือ หรือใช้คลาสธรรมดาแทน

npm run dev

```

### Deploy ขึ้น Vercel/Netlify

- ใช้โปรเจกต์ Vite/Next.js แล้วค่อยอัปโหลด

- โปรดใช้ HTTPS เพื่อให้ geolocation ทำงานบนโดเมนจริง

