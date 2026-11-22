import { useEffect, useState } from 'react';
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

// Nama tamu dari URL: ?to=Nama+Tamu
const guest = new URLSearchParams(window.location.search).get('to');

export default function App() {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden';
    if (opened) window.scrollTo(0, 0);
  }, [opened]);

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
          <Wishes guest={guest} />
          <Closing />
        </main>
      )}
      <MusicButton start={opened} />
    </div>
  );
}
