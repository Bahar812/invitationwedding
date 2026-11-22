import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal from './Reveal.jsx';
import { Float, Branch } from './Decor.jsx';
import { invitation as d } from '../data/invitation.js';

export default function Live() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(null);
  const copy = (n) => {
    navigator.clipboard?.writeText(n);
    setCopied(n);
    setTimeout(() => setCopied(null), 1500);
  };
  return (
    <section className="section navy live">
      <Float className="leaf-bg lb-1" amp={12} dur={9} rotate={4}><Branch tone="light" /></Float>
      <Float className="leaf-bg lb-2" amp={12} dur={8} rotate={4} delay={1}><Branch tone="light" flip /></Float>

      <Reveal type="zoom"><h2 className="script big white">Live Streaming</h2></Reveal>
      <Reveal delay={0.1}><p className="quote">{d.live.text}</p></Reveal>
      <Reveal delay={0.15}><p className="quote"><b>{d.dateText}</b></p></Reveal>
      <Reveal delay={0.2}><p className="quote"><b>{d.live.time}</b></p></Reveal>
      <Reveal delay={0.25}><a className="btn light" href={d.live.url} target="_blank" rel="noreferrer">◎ {d.live.label}</a></Reveal>

      <Reveal type="zoom" className="gift-title"><h2 className="script big white">Amplop Digital</h2></Reveal>
      <Reveal delay={0.1}><p className="quote">{d.gift.text}</p></Reveal>
      <Reveal delay={0.2}><button className="btn light" onClick={() => setOpen(true)}>🎁 Klik Disini</button></Reveal>

      <AnimatePresence>
        {open && (
          <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.div className="modal-card" initial={{ y: 60, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: 60, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <h3 className="script mid navy">Amplop Digital</h3>
              {d.gift.accounts.map((a) => (
                <div className="acc" key={a.number}>
                  <b>{a.bank}</b>
                  <span className="num">{a.number}</span>
                  <small>a.n. {a.name}</small>
                  <button className="btn sm" onClick={() => copy(a.number)}>
                    {copied === a.number ? 'Tersalin ✓' : 'Salin No. Rekening'}
                  </button>
                </div>
              ))}
              <button className="btn ghost" onClick={() => setOpen(false)}>Tutup</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
