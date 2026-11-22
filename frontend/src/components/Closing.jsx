import Reveal from './Reveal.jsx';
import { ArchPhoto, Monstera, Float } from './Decor.jsx';
import { invitation as d } from '../data/invitation.js';

export default function Closing() {
  return (
    <section className="section paper closing">
      <ArchPhoto src={d.closingPhoto} alt="Mempelai" flip />
      <Reveal><p className="body">{d.closing}</p></Reveal>
      <Reveal type="zoom" delay={0.1}><h3 className="script sm navy">Wassalamu’alaikum Wr. Wb.</h3></Reveal>
      <Reveal type="zoom" delay={0.2}><h2 className="script mid navy">{d.groom.nick} &amp; {d.bride.nick}</h2></Reveal>
      <Float className="mons ml" amp={8} dur={6} rotate={4}><Monstera /></Float>
      <Float className="mons mr" amp={8} dur={7} rotate={4}><Monstera flip /></Float>
      <p className="credit">Dibuat dengan ♥ React &amp; Framer Motion</p>
    </section>
  );
}
