import Reveal from './Reveal.jsx';
import { Float, Branch } from './Decor.jsx';
import { invitation as d } from '../data/invitation.js';

export default function Story() {
  return (
    <section className="section paper story">
      <Float className="side-deco sd-r" amp={10} dur={7} rotate={3}><Branch tone="dark" /></Float>
      <Reveal type="zoom"><h2 className="script big navy">{d.story.title}</h2></Reveal>
      <Reveal delay={0.1}><p className="cinzel story-sub">{d.story.subtitle}</p></Reveal>
      <Reveal className="story-photo">
        <img src={d.story.photo} alt="Love story" loading="lazy" />
      </Reveal>
      <div className="story-card">
        {d.story.items.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.05}>
            <h4>{it.title}</h4>
            <hr />
            <p>{it.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
