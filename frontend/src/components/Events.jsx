import { motion } from 'framer-motion';
import Reveal from './Reveal.jsx';
import { CornerFlora } from './Decor.jsx';
import { invitation as d } from '../data/invitation.js';

const Wave = () => (
  <svg className="wave" viewBox="0 0 400 80" preserveAspectRatio="none" aria-hidden>
    <path d="M0 40 C70 5 150 15 230 38 S350 55 400 25 L400 80 L0 80Z" fill="#c3cde0" opacity=".75" />
    <path d="M0 55 C90 25 180 35 260 55 S360 62 400 42 L400 80 L0 80Z" fill="#12336b" />
  </svg>
);

const Pin = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="#fff"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" /></svg>;

export default function Events() {
  return (
    <>
      <div className="wave-wrap"><Wave /></div>
      <section className="section navy savedate">
        <Reveal type="zoom"><h2 className="script big white">Save The Date</h2></Reveal>
        <Reveal delay={0.15}><p className="quote">{d.quote.text}</p></Reveal>
        <Reveal delay={0.25}><p className="quote"><b>{d.quote.source}</b></p></Reveal>
      </section>

      <section className="section paper events">
        {d.events.map((e, i) => (
          <Reveal key={e.title} type={i % 2 ? 'right' : 'left'} className="card event">
            <h2 className="script gold">{e.title}</h2>
            <p className="bold">{e.date}</p>
            <p className="it">{e.time}</p>
            <p className="place">Tempat : <b>{e.place}</b><br />{e.address.split('\n').map((l, k) => <span key={k}>{l}<br /></span>)}</p>
            <motion.a whileTap={{ scale: 0.95 }} className="btn" href={e.map} target="_blank" rel="noreferrer"><Pin /> Lihat Lokasi</motion.a>
          </Reveal>
        ))}
        <CornerFlora position="bottom" />
      </section>
    </>
  );
}
