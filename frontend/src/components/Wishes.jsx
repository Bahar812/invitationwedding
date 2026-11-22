import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal from './Reveal.jsx';
import { Float, Branch } from './Decor.jsx';

const API = import.meta.env.VITE_API_URL || '/api';

export default function Wishes({ guest, slug }) {
  const [list, setList] = useState([]);
  const [message, setMessage] = useState('');
  const [attend, setAttend] = useState('hadir');
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const load = () =>
    fetch(`${API}/wishes`).then((r) => r.json()).then((j) => setList(j.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!guest) return;
    setSending(true);
    setStatus(null);
    try {
      const r = await fetch(`${API}/wishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, message, attendance: attend }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Gagal mengirim');
      setMessage('');
      setStatus({ ok: true, text: 'Terima kasih, ucapan Anda terkirim!' });
      load();
    } catch (err) {
      setStatus({ ok: false, text: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section navy wishes">
      <Float className="leaf-bg lb-1" amp={12} dur={9} rotate={4}><Branch tone="light" /></Float>
      <Reveal type="zoom"><h2 className="script big white">Ucapkan Sesuatu</h2></Reveal>
      <Reveal delay={0.1}><p className="quote"><b>Berikan Ucapan &amp; Doa Restu</b></p></Reveal>
      <Reveal delay={0.15}>
        <form onSubmit={submit}>
          <input value={guest || ''} placeholder="Nama Kamu" readOnly />
          {!guest && <div className="alert">Mohon maaf! Khusus untuk tamu undangan.</div>}
          <textarea rows={4} placeholder="Berikan Ucapan & Do'a" value={message} onChange={(e) => setMessage(e.target.value)} required disabled={!guest} maxLength={500} />
          <p className="q">Konfirmasi Kehadiran ?</p>
          <div className="attend">
            <button type="button" className={attend === 'hadir' ? 'on' : ''} onClick={() => setAttend('hadir')}><span style={{ color: '#2e9e4f' }}>✔</span> Hadir</button>
            <button type="button" className={attend === 'tidak' ? 'on' : ''} onClick={() => setAttend('tidak')}><span style={{ color: '#d33' }}>✖</span> Tidak Hadir</button>
          </div>
          <button className="btn gold" disabled={!guest || sending}>{sending ? 'Mengirim…' : 'Kirim'}</button>
          {status && <div className={`alert ${status.ok ? 'ok' : ''}`}>{status.text}</div>}
        </form>
      </Reveal>

      <div className="wish-list">
        <AnimatePresence initial={false}>
          {list.map((w) => (
            <motion.div key={w.id} className="wish" layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <b>{w.name}</b>
              <em className={w.attendance === 'hadir' ? 'y' : 'n'}>{w.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir'}</em>
              <p>{w.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
