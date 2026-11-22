import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB = path.join(__dirname, 'data', 'wishes.json');
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json({ limit: '10kb' }));

async function readAll() {
  try {
    return JSON.parse(await fs.readFile(DB, 'utf8'));
  } catch {
    return [];
  }
}

// Antrian tulis sederhana agar file JSON tidak rusak saat request bersamaan
let queue = Promise.resolve();
const writeAll = (list) => (queue = queue.then(() => fs.writeFile(DB, JSON.stringify(list, null, 2))));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/wishes', async (_req, res) => {
  const list = await readAll();
  res.json({ data: list.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
});

app.post('/api/wishes', async (req, res) => {
  const name = String(req.body?.name ?? '').trim().slice(0, 60);
  const message = String(req.body?.message ?? '').trim().slice(0, 500);
  const attendance = req.body?.attendance === 'tidak' ? 'tidak' : 'hadir';

  if (!name) return res.status(403).json({ error: 'Mohon maaf! Khusus untuk tamu undangan.' });
  if (!message) return res.status(400).json({ error: 'Ucapan tidak boleh kosong.' });

  const item = { id: crypto.randomUUID(), name, message, attendance, createdAt: new Date().toISOString() };
  const list = await readAll();
  list.push(item);
  await writeAll(list);
  res.status(201).json({ data: item });
});

app.listen(PORT, () => console.log(`Backend berjalan di http://localhost:${PORT}`));
