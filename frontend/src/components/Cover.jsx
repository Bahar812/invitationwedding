import { motion } from 'framer-motion';
import { Branch, Flower, Float } from './Decor.jsx';
import { invitation as d } from '../data/invitation.js';

export default function Cover({ guest, onOpen }) {
  return (
    <motion.section className="cover" exit={{ y: '-100%', opacity: 0.6 }} transition={{ duration: 1, ease: [0.7, 0, 0.3, 1] }}>
      <Float className="cv-deco cv-tl" amp={8} dur={6} rotate={3}><Branch tone="dark" /></Float>
      <Float className="cv-deco cv-tr" amp={8} dur={7} rotate={3}><Branch tone="dark" flip /></Float>
      <Float className="cv-deco cv-bl" amp={10} dur={6}><Flower /></Float>
      <Float className="cv-deco cv-br" amp={10} dur={5}><Flower /></Float>

      <motion.p className="cinzel" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9 }}>
        THE WEDDING OF
      </motion.p>
      <motion.div className="arch cover-arch" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 1 }}>
        <img src={d.coverPhoto} alt="Mempelai" />
      </motion.div>
      <motion.h1 className="script big" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 1 }}>
        {d.groom.nick} &amp; {d.bride.nick}
      </motion.h1>
      <motion.div className="guest-box" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}>
        <small>Kepada Yth. Bapak/Ibu/Saudara/i</small>
        <strong>{guest || 'Tamu Undangan'}</strong>
        <motion.button className="btn" whileTap={{ scale: 0.95 }} animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }} onClick={onOpen}>
          ✉ Buka Undangan
        </motion.button>
      </motion.div>
    </motion.section>
  );
}
