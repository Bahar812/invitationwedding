# Undangan Pernikahan (React + Framer Motion)

```
frontend/  React (Vite) + framer-motion, mobile first
backend/   Express API untuk ucapan & konfirmasi kehadiran (disimpan di data/wishes.json)
```

## Menjalankan
```bash
cd backend  && npm install && npm run dev     # http://localhost:4000
cd frontend && npm install && npm run dev     # http://localhost:5173 (proxy /api ke backend)
```
Buka dengan nama tamu: `http://localhost:5173/?to=Budi+Santoso`
(tanpa `?to=` form ucapan menampilkan "Khusus untuk tamu undangan").

## Kustomisasi
- Semua teks, foto, tanggal, rekening: `frontend/src/data/invitation.js`
- Musik: taruh `frontend/public/music.mp3`
- Foto saat ini placeholder (picsum); ganti dengan foto asli di `frontend/public/` lalu isi path-nya.
- Produksi: set `VITE_API_URL` ke URL backend, lalu `npm run build`.
