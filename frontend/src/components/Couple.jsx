import { motion } from 'framer-motion';
import { Branch, ArchPhoto, Float } from './Decor.jsx';
import Reveal from './Reveal.jsx';
import { invitation as d } from '../data/invitation.js';

const Insta = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="#fff" /></svg>
);

function Person({ p, flip }) {
  return (
    <div className="person">
      <ArchPhoto src={p.photo} alt={p.name} flora={false} zoom={p.zoom} focus={p.focus} />
      <Reveal type={flip ? 'right' : 'left'}><h2 className="script mid">{p.name}</h2></Reveal>
      <Reveal delay={0.15}><p className="small">{p.parents}</p></Reveal>
      <Reveal type="zoom" delay={0.25}>
        <motion.a className="ig" href={p.instagram} target="_blank" rel="noreferrer" whileHover={{ scale: 1.15 }} aria-label="Instagram"><Insta /></motion.a>
      </Reveal>
    </div>
  );
}

export default function Couple() {
  return (
    <section className="section paper couple">
      <Float className="side-deco sd-r" amp={10} dur={6} rotate={3}><Branch tone="dark" /></Float>
      <Float className="side-deco sd-l" amp={10} dur={7} rotate={3}><Branch tone="mid" flip /></Float>
      <Reveal type="down"><p className="arabic">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p></Reveal>
      <Reveal><h3 className="script sm navy">Assalamu’alaikum Wr. Wb.</h3></Reveal>
      <Reveal delay={0.1}><p className="body">{d.intro}</p></Reveal>
      <Person p={d.groom} />
      <Reveal type="zoom"><div className="amp script">&amp;</div></Reveal>
      <Person p={d.bride} flip />
    </section>
  );
}
