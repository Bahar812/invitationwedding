import { lazy, Suspense, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Cover from './components/Cover.jsx';
import Hero from './components/Hero.jsx';
import Couple from './components/Couple.jsx';
import Events from './components/Events.jsx';
import Live from './components/Live.jsx';
import Gallery from './components/Gallery.jsx';
import Story from './components/Story.jsx';
import Wishes from './components/Wishes.jsx';
import Closing from './components/Closing.jsx';
import MusicButton from './components/MusicButton.jsx';
import { invitation } from './data/invitation.js';

const Admin = lazy(() => import('./admin/Admin.jsx'));
const API = import.meta.env.VITE_API_URL || '/api';

// Link tamu: /?to=<slug>  (dibuat otomatis di panel admin)
const slug = new URLSearchParams(window.location.search).get('to');

function Invitation() {
  const [ready, setReady] = useState(false);
  const [guest, setGuest] = useState(null);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const inv = fetch(`${API}/invitation`).then((r) => r.json()).then((j) => Object.assign(invitation, j.data || {})).catch(() => {});
    const g = slug
      ? fetch(`${API}/guests/${encodeURIComponent(slug)}`).then((r) => (r.ok ? r.json() : null)).then((j) => j && setGuest(j.data.name)).catch(() => {})
      : Promise.resolve();
    Promise.all([inv, g]).then(() => setReady(true));
  }, []);

  useEffect(() => {
    document.body.style.overflow = opened || !ready ? '' : 'hidden';
    if (opened) window.scrollTo(0, 0);
  }, [opened, ready]);

  if (!ready) return <div className="app" />;

  return (
    <div className="app">
      <AnimatePresence>{!opened && <Cover guest={guest} onOpen={() => setOpened(true)} />}</AnimatePresence>
      {opened && (
        <main>
          <Hero />
          <Couple />
          <Events />
          <Live />
          <Gallery />
          <Story />
          <Wishes guest={guest} slug={slug} />
          <Closing />
        </main>
      )}
      <MusicButton start={opened} />
    </div>
  );
}

export default function App() {
  // Halaman admin hanya lewat URL /admin (tidak ada tombol di undangan)
  if (window.location.pathname.replace(/\/$/, '') === '/admin') {
    return (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    );
  }
  return <Invitation />;
}
