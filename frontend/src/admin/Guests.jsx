import { useEffect, useMemo, useState } from 'react';
import readXlsxFile from 'read-excel-file';
import { api } from './api.js';
import { invitation } from '../data/invitation.js';

const linkOf = (g) => `${window.location.origin}/?to=${g.slug}`;

async function namesFromFile(file) {
  let rows;
  if (/\.csv$|\.txt$/i.test(file.name)) {
    rows = (await file.text()).split(/\r?\n/).map((l) => [l.split(/[,;\t]/)[0]]);
  } else {
    rows = await readXlsxFile(file); // sheet pertama
  }
  const names = rows.map((r) => String(r[0] ?? '').trim()).filter(Boolean);
  if (names.length && /^(nama|name|tamu)/i.test(names[0])) names.shift(); // buang header
  return names;
}

export default function Guests() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [copied, setCopied] = useState(null);

  const load = () => api('/admin/guests').then((j) => setList(j.data)).catch((e) => setMsg(e.message));
  useEffect(() => { load(); }, []);

  const add = async (names) => {
    setMsg('');
    try {
      const j = await api('/admin/guests', { method: 'POST', body: { names } });
      setList(j.data);
      setMsg(`${j.added} tamu ditambahkan${j.skipped ? `, ${j.skipped} dilewati (nama sudah ada)` : ''}.`);
    } catch (e) {
      setMsg(e.message);
    }
  };

  const onFile = async (e) => {
    const f = e.target.files[0];
    e.target.value = '';
    if (!f) return;
    try {
      const names = await namesFromFile(f);
      if (!names.length) return setMsg('Tidak ada nama di kolom A file tersebut.');
      await add(names);
    } catch {
      setMsg('Gagal membaca file. Gunakan .xlsx atau .csv dengan nama di kolom pertama.');
    }
  };

  const remove = async (g) => {
    if (!confirm(`Hapus tamu "${g.name}"? Link-nya tidak akan berlaku lagi.`)) return;
    await api(`/admin/guests/${g.id}`, { method: 'DELETE' });
    load();
  };
  const rename = async (g) => {
    const n = prompt('Ubah nama tamu (link tetap sama):', g.name);
    if (n && n.trim()) { await api(`/admin/guests/${g.id}`, { method: 'PUT', body: { name: n } }); load(); }
  };
  const removeAll = async () => {
    if (!confirm('Hapus SEMUA tamu? Semua link akan tidak berlaku.')) return;
    await api('/admin/guests', { method: 'DELETE' });
    load();
  };

  const copy = (g) => {
    navigator.clipboard?.writeText(linkOf(g));
    setCopied(g.id);
    setTimeout(() => setCopied(null), 1500);
  };
  const wa = (g) => {
    const text = `Assalamu'alaikum Wr. Wb.\n\nKepada Yth. ${g.name}\n\nKami mengundang Anda ke pernikahan ${invitation.groom.nick} & ${invitation.bride.nick}.\nDetail undangan:\n${linkOf(g)}\n\nTerima kasih.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const exportCsv = () => {
    const esc = (s) => `"${String(s).replace(/"/g, '""')}"`;
    const csv = '﻿Nama,Link,Kehadiran\n' + list.map((g) => [g.name, linkOf(g), g.attendance || ''].map(esc).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'daftar-tamu.csv';
    a.click();
  };

  const shown = useMemo(() => list.filter((g) => g.name.toLowerCase().includes(q.toLowerCase())), [list, q]);
  const hadir = list.filter((g) => g.attendance === 'hadir').length;
  const tidak = list.filter((g) => g.attendance === 'tidak').length;

  return (
    <>
      <div className="ad-stats">
        <div><b>{list.length}</b><span>Total tamu</span></div>
        <div><b>{hadir}</b><span>Hadir</span></div>
        <div><b>{tidak}</b><span>Tidak hadir</span></div>
        <div><b>{list.length - hadir - tidak}</b><span>Belum konfirmasi</span></div>
      </div>

      <div className="ad-card">
        <h3>Tambah Tamu</h3>
        <form className="ad-row" onSubmit={(e) => { e.preventDefault(); if (name.trim()) { add([name]); setName(''); } }}>
          <input placeholder="Nama tamu" value={name} onChange={(e) => setName(e.target.value)} />
          <button className="ad-btn">Tambah</button>
        </form>
        <p className="ad-hint">Atau upload Excel (.xlsx) / CSV: nama tamu di <b>kolom A</b>, satu nama per baris (baris header "Nama" otomatis dilewati).</p>
        <label className="ad-btn ghost">
          ⬆ Upload Excel
          <input type="file" accept=".xlsx,.csv,.txt" hidden onChange={onFile} />
        </label>
        {msg && <p className="ad-msg">{msg}</p>}
      </div>

      <div className="ad-card">
        <div className="ad-row between">
          <h3>Daftar Tamu</h3>
          <div className="ad-row">
            <button className="ad-btn ghost sm" onClick={exportCsv} disabled={!list.length}>Unduh CSV</button>
            <button className="ad-btn danger sm" onClick={removeAll} disabled={!list.length}>Hapus semua</button>
          </div>
        </div>
        <input placeholder="Cari nama…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="ad-list">
          {shown.map((g) => (
            <div className="ad-item" key={g.id}>
              <div className="grow">
                <b>{g.name}</b>
                <small className="ad-link">{linkOf(g)}</small>
                <span className={`tag ${g.attendance || ''}`}>{g.attendance === 'hadir' ? 'Hadir' : g.attendance === 'tidak' ? 'Tidak hadir' : 'Belum konfirmasi'}</span>
              </div>
              <div className="ad-actions">
                <button className="ad-btn sm" onClick={() => copy(g)}>{copied === g.id ? 'Tersalin ✓' : 'Salin link'}</button>
                <button className="ad-btn sm wa" onClick={() => wa(g)}>WhatsApp</button>
                <button className="ad-btn ghost sm" onClick={() => rename(g)}>Ubah</button>
                <button className="ad-btn danger sm" onClick={() => remove(g)}>Hapus</button>
              </div>
            </div>
          ))}
          {!shown.length && <p className="ad-hint">Belum ada tamu.</p>}
        </div>
      </div>
    </>
  );
}
