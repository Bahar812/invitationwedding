# Undangan Pernikahan (React + Framer Motion)

```
frontend/  React (Vite) + framer-motion, mobile first (+ halaman /admin)
backend/   Express API: tamu, ucapan, pengaturan, upload (disimpan sebagai JSON di backend/data)
```

## Menjalankan
```bash
cd backend  && npm install && ADMIN_PASSWORD=passwordrahasia npm run dev   # http://localhost:4000
cd frontend && npm install && npm run dev                                   # http://localhost:5173
```
PowerShell: `$env:ADMIN_PASSWORD='passwordrahasia'; npm run dev`
Tanpa `ADMIN_PASSWORD`, password default adalah `admin123` — **wajib diganti** sebelum online.

## Admin panel
- Akses hanya lewat URL: `/admin` (tidak ada tombol di undangan).
- **Tamu**: tambah manual atau upload Excel `.xlsx` / `.csv` (nama di kolom A, satu per baris).
  Tiap tamu otomatis punya link unik `/?to=<slug>`; bisa salin link, kirim lewat WhatsApp, ubah nama, hapus, dan unduh CSV.
  Mengubah nama tidak mengubah link.
- **Ucapan**: lihat/hapus ucapan dan konfirmasi hadir.
- **Pengaturan**: ubah nama, foto (upload), tanggal, acara, rekening, love story, musik, dll. Tersimpan di `backend/data/invitation.json` dan menimpa nilai default di `frontend/src/data/invitation.js`.

Hanya tamu dengan link valid yang bisa mengirim ucapan; tanpa link, form menampilkan "Khusus untuk tamu undangan".

## Produksi
- Set `VITE_API_URL` (URL backend + `/api`) lalu `npm run build` di frontend.
- Web server harus mengarahkan semua path (termasuk `/admin`) ke `index.html` (SPA fallback) dan meneruskan `/api` & `/uploads` ke backend.
- `backend/data` dan `backend/uploads` berisi data nyata (nama tamu, foto); backup dan jangan di-commit.
