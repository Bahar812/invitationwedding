import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArchPhoto, CornerFlora } from './Decor.jsx';
import Reveal from './Reveal.jsx';
import { invitation as d } from '../data/invitation.js';

function useCountdown(target) {
  const calc = () => {
    const diff = Math.max(0, new Date(target) - Date.now());
    return {
      Hari: Math.floor(diff / 86400000),
      Jam: Math.floor(diff / 3600000) % 24,
      Menit: Math.floor(diff / 60000) % 60,
      Detik: Math.floor(diff / 1000) % 60,
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

const saveDateUrl = () => {
  const s = new Date(d.date);
  const f = (x) => x.toISOString().replace(/[-:]|\.\d{3}/g, '');
  const e = new Date(s.getTime() + 4 * 3600000);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `Pernikahan ${d.groom.nick} & ${d.bride.nick}`
  )}&dates=${f(s)}/${f(e)}`;
};

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const t = useCountdown(d.date);

  return (
    <section ref={ref} className="hero section paper">
      <CornerFlora position="top" />
      <motion.div style={{ opacity, y }} className="hero-inner">
        <Reveal type="down"><p className="cinzel">THE WEDDING OF</p></Reveal>
        <ArchPhoto src={d.coverPhoto} alt="Mempelai" />
        <Reveal type="zoom" delay={0.2}><h1 className="script big">{d.groom.nick} &amp; {d.bride.nick}</h1></Reveal>
        <Reveal delay={0.3}><p className="small">Kami berharap Anda menjadi bagian dari hari istimewa kami.</p></Reveal>
        <div className="countdown">
          {Object.entries(t).map(([k, v], i) => (
            <Reveal key={k} type="up" delay={0.1 * i} className="cd-box">
              <b>{v}</b>
              <span>{k}</span>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}><p className="date-text">{d.dateText}</p></Reveal>
        <Reveal delay={0.3}>
          <a className="btn" href={saveDateUrl()} target="_blank" rel="noreferrer">Save The Date</a>
        </Reveal>
      </motion.div>
    </section>
  );
}
