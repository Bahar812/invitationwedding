import { useEffect, useState } from 'react';
import { api } from './api.js';
import { invitation } from '../data/invitation.js';

const API = import.meta.env.VITE_API_URL || '/api';
const clone = (o) => JSON.parse(JSON.stringify(o));
const pretty = (k) => k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
const isFileKey = (k) => /photo|music/i.test(k);
const blank = (o) =>
  Array.isArray(o) ? [] : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, blank(v)])) : typeof o === 'number' ? 0 : '';

function FileField({ label, k, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const audio = /music/i.test(k);
  const pick = async (e) => {
    const f = e.target.files[0];
    e.target.value = '';
    if (!f) return;
    setBusy(true);
    setErr('');
    try {
      const form = new FormData();
      form.append('file', f);
      const j = await api('/admin/upload', { method: 'POST', form });
      onChange(j.url);
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="ad-field">
      <label>{label}</label>
      {value && (audio ? <audio src={value} controls /> : <img className="ad-thumb" src={value} alt="" />)}
      <div className="ad-row">
        <input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="URL atau upload" />
        <label className="ad-btn ghost sm">
          {busy ? '…' : '⬆ Upload'}
          <input type="file" hidden accept={audio ? 'audio/*' : 'image/*'} onChange={pick} />
        </label>
      </div>
      {err && <p className="ad-err">{err}</p>}
    </div>
  );
}

function Node({ k, value, onChange }) {
  if (Array.isArray(value)) {
    const set = (i, v) => onChange(value.map((x, j) => (j === i ? v : x)));
    const del = (i) => onChange(value.filter((_, j) => j !== i));
    const sample = value[0];
    const add = () => onChange([...value, sample === undefined ? '' : blank(sample)]);
    return (
      <fieldset>
        <legend>{pretty(k)}</legend>
        {value.map((v, i) => (
          <div className="ad-sub" key={i}>
            <div className="ad-row between"><small>#{i + 1}</small><button type="button" className="ad-btn danger sm" onClick={() => del(i)}>Hapus</button></div>
            <Node k={k === 'gallery' ? 'photo' : `${pretty(k)} ${i + 1}`} value={v} onChange={(nv) => set(i, nv)} />
          </div>
        ))}
        <button type="button" className="ad-btn ghost sm" onClick={add}>+ Tambah</button>
      </fieldset>
    );
  }
  if (value && typeof value === 'object') {
    return (
      <fieldset>
        {k && <legend>{pretty(k)}</legend>}
        {Object.keys(value).map((kk) => (
          <Node key={kk} k={kk} value={value[kk]} onChange={(nv) => onChange({ ...value, [kk]: nv })} />
        ))}
      </fieldset>
    );
  }
  if (typeof value === 'number') {
    return (
      <div className="ad-field"><label>{pretty(k)}</label>
        <input type="number" step="any" value={value} onChange={(e) => onChange(Number(e.target.value))} /></div>
    );
  }
  if (isFileKey(k)) return <FileField label={pretty(k)} k={k} value={value} onChange={onChange} />;
  const long = String(value).length > 60 || /text|intro|quote|closing|address/i.test(k);
  return (
    <div className="ad-field">
      <label>{pretty(k)}</label>
      {long ? <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} /> : <input value={value} onChange={(e) => onChange(e.target.value)} />}
    </div>
  );
}

export default function Settings() {
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch(`${API}/invitation`).then((r) => r.json()).then((j) => setData(clone({ ...invitation, ...(j.data || {}) })));
  }, []);

  const save = async () => {
    setMsg('');
    try {
      await api('/admin/invitation', { method: 'PUT', body: data });
      setMsg('Tersimpan ✓ — undangan langsung terbarui.');
    } catch (e) {
      setMsg(e.message);
    }
  };

  if (!data) return <p className="ad-hint">Memuat…</p>;
  return (
    <div className="ad-card">
      <h3>Pengaturan Undangan</h3>
      <p className="ad-hint">Ubah nama, foto, tanggal, acara, rekening, love story, musik, dll. Tanggal memakai format ISO, contoh <code>2026-12-28T08:00:00+07:00</code>.</p>
      <Node k="" value={data} onChange={setData} />
      <div className="ad-save">
        <button className="ad-btn" onClick={save}>Simpan</button>
        {msg && <span className="ad-msg">{msg}</span>}
      </div>
    </div>
  );
}
