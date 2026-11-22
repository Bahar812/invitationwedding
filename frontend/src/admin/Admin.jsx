import { useEffect, useState } from 'react';
import { api, getToken, setToken } from './api.js';
import Guests from './Guests.jsx';
import Wishes from './WishesAdmin.jsx';
import Settings from './Settings.jsx';
import './admin.css';

function Login({ onDone }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const j = await api('/admin/login', { method: 'POST', body: { password: pw } });
      setToken(j.token);
      onDone();
    } catch (e2) {
      setErr(e2.message);
    }
  };
  return (
    <div className="ad-login">
      <form onSubmit={submit} className="ad-card">
        <h2>Admin Undangan</h2>
        <input type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
        {err && <p className="ad-err">{err}</p>}
        <button className="ad-btn">Masuk</button>
      </form>
    </div>
  );
}

const TABS = [
  ['guests', 'Tamu'],
  ['wishes', 'Ucapan'],
  ['settings', 'Pengaturan'],
];

export default function Admin() {
  const [authed, setAuthed] = useState(!!getToken());
  const [tab, setTab] = useState('guests');

  useEffect(() => {
    const f = () => setAuthed(false);
    window.addEventListener('admin-logout', f);
    document.title = 'Admin';
    return () => window.removeEventListener('admin-logout', f);
  }, []);

  if (!authed) return <Login onDone={() => setAuthed(true)} />;

  return (
    <div className="ad">
      <header className="ad-head">
        <b>Admin Undangan</b>
        <button className="ad-btn ghost" onClick={() => { setToken(null); setAuthed(false); }}>Keluar</button>
      </header>
      <nav className="ad-tabs">
        {TABS.map(([k, l]) => (
          <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>
        ))}
      </nav>
      <main className="ad-main">
        {tab === 'guests' && <Guests />}
        {tab === 'wishes' && <Wishes />}
        {tab === 'settings' && <Settings />}
      </main>
    </div>
  );
}
