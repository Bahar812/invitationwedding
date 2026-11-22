import { motion } from 'framer-motion';

const NAVY = '#17345f';
const BLUE = '#4a7ba3';
const LIGHT = '#8fb4cf';

// Cabang daun (SVG sederhana)
export function Branch({ className = '', style, flip = false, tone = 'mid' }) {
  const fills = { dark: [NAVY, '#24507f'], mid: [BLUE, '#2f5f8a'], light: [LIGHT, BLUE] };
  const [a, b] = fills[tone];
  const leaves = [
    [60, 150, -35, 1], [90, 125, 30, 1], [50, 100, -40, 0.95], [88, 80, 35, 0.95],
    [48, 55, -35, 0.85], [84, 35, 30, 0.8], [66, 12, -10, 0.7],
  ];
  return (
    <svg viewBox="0 0 140 190" className={className} style={{ ...style, transform: `${flip ? 'scaleX(-1) ' : ''}${style?.transform || ''}` }} aria-hidden>
      <path d="M70 190 C66 140 74 80 70 6" stroke={NAVY} strokeWidth="2" fill="none" />
      {leaves.map(([x, y, r, s], i) => (
        <ellipse key={i} cx={x} cy={y} rx={9 * s} ry={22 * s} fill={i % 2 ? a : b} opacity="0.92" transform={`rotate(${r} ${x} ${y})`} />
      ))}
    </svg>
  );
}

export function Flower({ className = '', style }) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} aria-hidden>
      {[0, 60, 120, 180, 240, 300].map((r) => (
        <ellipse key={r} cx="60" cy="30" rx="17" ry="28" fill={r % 120 ? BLUE : LIGHT} opacity="0.9" transform={`rotate(${r} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="11" fill={NAVY} />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={60 + 6 * Math.cos(i * 1.256)} cy={60 + 6 * Math.sin(i * 1.256)} r="2" fill="#f5d99b" />
      ))}
    </svg>
  );
}

export function Monstera({ className = '', style, flip }) {
  return (
    <svg viewBox="0 0 120 140" className={className} style={{ ...style, transform: flip ? 'scaleX(-1)' : undefined }} aria-hidden>
      <path d="M60 135 C10 120 -5 60 40 15 C48 30 55 25 60 5 C65 25 72 30 80 15 C125 60 110 120 60 135Z" fill="#3f6a8e" />
      <path d="M60 135 L60 20 M60 100 L28 80 M60 100 L92 80 M60 70 L34 48 M60 70 L86 48" stroke="#e9f0f5" strokeWidth="2" opacity=".7" fill="none" />
    </svg>
  );
}

// Elemen mengambang
export function Float({ children, amp = 10, dur = 5, delay = 0, rotate = 0, className = '', style }) {
  return (
    <motion.div
      className={className}
      style={style}
      animate={{ y: [0, -amp, 0], rotate: rotate ? [-rotate, rotate, -rotate] : 0 }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  );
}

// Sudut berhias bunga & daun (atas / bawah)
export function CornerFlora({ position = 'top' }) {
  const top = position === 'top';
  return (
    <div className={`corner ${top ? 'corner-top' : 'corner-bottom'}`} aria-hidden>
      <motion.div className="corner-l" initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1.2 }}>
        <Float amp={6} dur={6} rotate={2}>
          <Monstera className="c-monstera" style={{ transform: top ? 'rotate(160deg)' : 'rotate(-10deg)' }} />
          <Flower className="c-flower" />
          <Branch className="c-branch" tone="dark" />
        </Float>
      </motion.div>
      <motion.div className="corner-r" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1.2 }}>
        <Float amp={6} dur={7} rotate={2} delay={0.6}>
          <Monstera className="c-monstera" flip style={{ transform: top ? 'rotate(-160deg)' : 'rotate(10deg)' }} />
          <Flower className="c-flower" />
          <Branch className="c-branch" flip tone="dark" />
        </Float>
      </motion.div>
    </div>
  );
}

// Foto lengkung (pill) dengan bunga
export function ArchPhoto({ src, alt, flora = true, flip = false, zoom = 1, focus = '50% 50%' }) {
  return (
    <div className="arch-wrap">
      <motion.div
        className="arch"
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        <img src={src} alt={alt} loading="lazy" style={{ transform: `scale(${zoom})`, transformOrigin: focus }} />
      </motion.div>
      {flora && (
        <>
          <Float className={`arch-deco a-left ${flip ? 'flip' : ''}`} amp={8} dur={5} rotate={3}>
            <Branch tone="mid" />
          </Float>
          <Float className={`arch-deco a-right ${flip ? 'flip' : ''}`} amp={8} dur={6} rotate={3} delay={0.5}>
            <Flower />
          </Float>
        </>
      )}
    </div>
  );
}
