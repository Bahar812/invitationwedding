import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal from './Reveal.jsx';
import { CornerFlora } from './Decor.jsx';
import { invitation as d } from '../data/invitation.js';

export default function Gallery() {
  const [sel, setSel] = useState(null);
  const cols = [d.gallery.filter((_, i) => i % 2 === 0), d.gallery.filter((_, i) => i % 2 === 1)];
  return (
    <section className="section paper gallery">
      <CornerFlora position="top" />
      <Reveal type="zoom"><h2 className="script big navy g-title">Galeri Foto</h2></Reveal>
      <Reveal className="video" delay={0.1}>
        <iframe src={`https://www.youtube.com/embed/${d.video}`} title="Video prewedding" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" />
      </Reveal>
      <div className="masonry">
        {cols.map((col, ci) => (
          <div className="mcol" key={ci} style={{ marginTop: ci ? 24 : 0 }}>
            {col.map((src, i) => (
              <Reveal key={src} type={ci ? 'right' : 'left'} delay={i * 0.08}>
                <motion.img src={src} alt="Galeri" loading="lazy" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setSel(src)} />
              </Reveal>
            ))}
          </div>
        ))}
      </div>
      <AnimatePresence>
        {sel && (
          <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSel(null)}>
            <motion.img className="lightbox" src={sel} initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} alt="" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
