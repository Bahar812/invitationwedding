import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Di produksi arahkan DATA_DIR / UPLOADS_DIR ke volume persisten agar data tidak hilang saat redeploy
const DATA = process.env.DATA_DIR || path.join(__dirname, 'data');
const UPLOADS = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads');
const DIST = process.env.FRONTEND_DIST || path.join(__dirname, '..', 'frontend', 'dist');
await fs.mkdir(DATA, { recursive: true });
await fs.mkdir(UPLOADS, { recursive: true });

const PORT = process.env.PORT || 4000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
if (!process.env.ADMIN_PASSWORD) console.warn('[!] ADMIN_PASSWORD belum di-set, memakai default "admin123". Ganti lewat environment variable.');
const SECRET = process.env.ADMIN_SECRET || crypto.createHash('sha256').update('inv-secret:' + ADMIN_PASSWORD).digest('hex');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(UPLOADS, { maxAge: '7d' }));

/* ---------- penyimpanan JSON sederhana ---------- */
const locks = new Map();
const file = (n) => path.join(DATA, n);
async function read(name, fallback) {
  try { return JSON.parse(await fs.readFile(file(name), 'utf8')); } catch { return fallback; }
}
function write(name, value) {
  const prev = locks.get(name) || Promise.resolve();
  const next = prev.then(() => fs.writeFile(file(name), JSON.stringify(value, null, 2)));
  locks.set(name, next.catch(() => {}));
  return next;
}

/* ---------- auth admin (token bertanda tangan HMAC) ---------- */
const sign = (p) => crypto.createHmac('sha256', SECRET).update(p).digest('base64url');
const makeToken = () => {
  const exp = String(Date.now() + 1000 * 60 * 60 * 24 * 7);
  return `${exp}.${sign(exp)}`;
};
const safeEq = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
function auth(req, res, next) {
  const [exp, sig] = (req.headers.authorization || '').replace('Bearer ', '').split('.');
  if (!exp || !sig || !safeEq(sig, sign(exp)) || Number(exp) < Date.now()) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

let failures = 0;
app.post('/api/admin/login', (req, res) => {
  const pw = String(req.body?.password ?? '');
  if (failures > 20) return res.status(429).json({ error: 'Terlalu banyak percobaan, coba lagi nanti.' });
  if (!safeEq(crypto.createHash('sha256').update(pw).digest('hex'), crypto.createHash('sha256').update(ADMIN_PASSWORD).digest('hex'))) {
    failures++;
    setTimeout(() => (failures = Math.max(0, failures - 1)), 60_000);
    return res.status(401).json({ error: 'Password salah.' });
  }
  res.json({ token: makeToken() });
});

/* ---------- util ---------- */
const slugify = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'tamu';
const newSlug = (name, used) => {
  let s;
  do s = `${slugify(name)}-${crypto.randomBytes(3).toString('hex')}`; while (used.has(s));
  used.add(s);
  return s;
};

/* ---------- publik ---------- */
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/invitation', async (_req, res) => res.json({ data: await read('invitation.json', {}) }));

app.get('/api/guests/:slug', async (req, res) => {
  const g = (await read('guests.json', [])).find((x) => x.slug === req.params.slug);
  if (!g) return res.status(404).json({ error: 'Tamu tidak ditemukan' });
  res.json({ data: { name: g.name } });
});

app.get('/api/wishes', async (_req, res) => {
  const list = await read('wishes.json', []);
  res.json({ data: list.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(({ guestId, ...w }) => w) });
});

app.post('/api/wishes', async (req, res) => {
  const guests = await read('guests.json', []);
  const g = guests.find((x) => x.slug === String(req.body?.slug ?? ''));
  if (!g) return res.status(403).json({ error: 'Mohon maaf! Khusus untuk tamu undangan.' });
  const message = String(req.body?.message ?? '').trim().slice(0, 500);
  const attendance = req.body?.attendance === 'tidak' ? 'tidak' : 'hadir';
  if (!message) return res.status(400).json({ error: 'Ucapan tidak boleh kosong.' });

  const item = { id: crypto.randomUUID(), guestId: g.id, name: g.name, message, attendance, createdAt: new Date().toISOString() };
  const list = await read('wishes.json', []);
  list.push(item);
  await write('wishes.json', list);
  g.attendance = attendance;
  await write('guests.json', guests);
  res.status(201).json({ data: item });
});

/* ---------- admin ---------- */
const admin = express.Router();
admin.use(auth);

admin.get('/guests', async (_req, res) => res.json({ data: await read('guests.json', []) }));

// Tambah satu atau banyak tamu (hasil import Excel): { names: [...] }
admin.post('/guests', async (req, res) => {
  const names = (Array.isArray(req.body?.names) ? req.body.names : [])
    .map((n) => String(n ?? '').trim().slice(0, 80))
    .filter(Boolean)
    .slice(0, 5000);
  if (!names.length) return res.status(400).json({ error: 'Tidak ada nama.' });
  const list = await read('guests.json', []);
  const used = new Set(list.map((g) => g.slug));
  const existing = new Set(list.map((g) => g.name.toLowerCase()));
  const added = [];
  let skipped = 0;
  for (const name of names) {
    if (existing.has(name.toLowerCase())) { skipped++; continue; }
    existing.add(name.toLowerCase());
    const g = { id: crypto.randomUUID(), name, slug: newSlug(name, used), attendance: null, createdAt: new Date().toISOString() };
    list.push(g);
    added.push(g);
  }
  await write('guests.json', list);
  res.status(201).json({ added: added.length, skipped, data: list });
});

admin.put('/guests/:id', async (req, res) => {
  const list = await read('guests.json', []);
  const g = list.find((x) => x.id === req.params.id);
  const name = String(req.body?.name ?? '').trim().slice(0, 80);
  if (!g || !name) return res.status(400).json({ error: 'Data tidak valid.' });
  g.name = name; // slug tetap agar link yang sudah dibagikan tidak rusak
  await write('guests.json', list);
  res.json({ data: g });
});

admin.delete('/guests/:id', async (req, res) => {
  await write('guests.json', (await read('guests.json', [])).filter((g) => g.id !== req.params.id));
  res.json({ ok: true });
});

admin.delete('/guests', async (_req, res) => {
  await write('guests.json', []);
  res.json({ ok: true });
});

admin.get('/wishes', async (_req, res) => {
  const list = await read('wishes.json', []);
  res.json({ data: list.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
});

admin.delete('/wishes/:id', async (req, res) => {
  await write('wishes.json', (await read('wishes.json', [])).filter((w) => w.id !== req.params.id));
  res.json({ ok: true });
});

admin.put('/invitation', async (req, res) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return res.status(400).json({ error: 'Data tidak valid.' });
  await write('invitation.json', req.body);
  res.json({ ok: true });
});

const ALLOWED = /^(image\/(jpeg|png|webp|gif)|audio\/(mpeg|mp3|ogg|wav|mp4|aac|x-m4a))$/;
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS,
    filename: (_req, f, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(3).toString('hex')}${path.extname(f.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '')}`),
  }),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, f, cb) => cb(null, ALLOWED.test(f.mimetype)),
});
admin.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'File harus berupa gambar (jpg/png/webp) atau audio (mp3), maks 15MB.' });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

app.use('/api/admin', admin);

// Sajikan frontend hasil build (1 container untuk semuanya) + fallback SPA untuk /admin dan /?to=
if (await fs.stat(path.join(DIST, 'index.html')).then(() => true, () => false)) {
  app.use(express.static(DIST, { maxAge: '1h', index: false }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(path.join(DIST, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Terjadi kesalahan server.' });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Backend berjalan di http://localhost:${PORT}`));
