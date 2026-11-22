import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { invitation as d } from '../data/invitation.js';

export default function MusicButton({ start }) {
  const audio = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (start && audio.current) audio.current.play().then(() => setPlaying(true)).catch(() => {});
  }, [start]);

  const toggle = () => {
    const a = audio.current;
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {});
    else { a.pause(); setPlaying(false); }
  };

  return (
    <>
      <audio ref={audio} src={d.music} loop preload="auto" />
      {start && (
        <motion.button className="music" onClick={toggle} aria-label="Musik" initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <motion.span animate={{ rotate: playing ? 360 : 0 }} transition={playing ? { repeat: Infinity, duration: 4, ease: 'linear' } : {}}>
            {playing ? '◉' : '❚❚'}
          </motion.span>
        </motion.button>
      )}
    </>
  );
}
