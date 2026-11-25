/* LOSTMEDIA · kiddwero · GRo0
   Todo lo que hay que cambiar está en CONFIG. */
const CONFIG = {
  artista: 'KIDDWERO',
  cancion: 'GRo0',
  productor: 'prod. @bruno4vr_',
  audio: 'audio/gro0.mp3',           // avance: solo los primeros 45 s (la rola completa NO va en el sitio)
  ambiente: 'audio/pasillo.mp3',     // la misma rola, lenta y al revés
  sample: 'audio/sample.mp3',         // el sample de estonotesale: de fondo, limpio en los puntos tranquilos
  // PNG pegados en las paredes de los pasillos (agrega los que mande kiddwero)
  // (los 3 primeros salen en los puntos tranquilos)
  posters: ['img/kiddwero.png', 'img/bruno.png', 'img/prodtrash.png', 'img/kiddwero-foto.jpg', 'img/kiddwero.png', 'img/manq-2.png', 'img/bruno.png', 'img/prodtrash.png', 'img/screamer-cara.jpg', 'img/kiddwero-foto.jpg'],
  // los que aparecen parados al fondo del pasillo y se esfuman
  apariciones: ['img/kiddwero.png', 'img/bruno.png', 'img/prodtrash.png'],
  tapiz: 'img/tapiz.png',             // paredes del cuarto de maniquíes (estilo mundo 3D de chat de los 90)
  chat: [
    ['kiddwero', '¿hay alguien?'],
    ['bruno4vr_', 'aquí'],
    ['prodtrash07', 'no te muevas'],
    ['kiddwero', 'no les des la espalda'],
    ['???', 'ya te vimos'],
  ],
  maniquies: ['img/manq-1.png', 'img/manq-2.png', 'img/manq-3.png', 'img/manq-4.png'],
  // el screamer va pasando por estas imágenes en orden (la foto de kiddwero se queda más tiempo)
  screamer: ['img/manq-3.png', 'img/kiddwero-foto.jpg', 'img/kiddwero-foto.jpg', 'img/kiddwero-foto.jpg'],
  fecha: 'LOSTMEDIA · EP · muy pronto',
  links: [
    { label: '@kiddwero', url: 'https://instagram.com/kiddwero' },
    { label: '@bruno4vr_', url: 'https://instagram.com/bruno4vr_' },
    { label: '@prodtrash07', url: 'https://instagram.com/prodtrash07' },
    { label: 'PRE-SAVE', url: '#' },
  ],
};

const $ = (s) => document.querySelector(s);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};
const isHttp = /^https?:/.test(location.protocol);

function loadImg(src) {
  return new Promise((res) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () => res(null);
    i.src = src;
  });
}
const IMGS = {};
const imgsReady = Promise.all(
  [...new Set([...CONFIG.posters, ...CONFIG.apariciones, ...CONFIG.maniquies, ...CONFIG.screamer, CONFIG.tapiz])]
    .map((s) => loadImg(s).then((i) => { IMGS[s] = i; }))
);

function distCurve(k) {
  const n = 1024, c = new Float32Array(n);
  for (let i = 0; i < n; i++) { const x = (i / n) * 2 - 1; c[i] = ((Math.PI + k) * x) / (Math.PI + k * Math.abs(x)); }
  return c;
}

/* =========================================================
   AUDIO
   ========================================================= */
const A = {
  ctx: null,
  init() {
    if (this.ctx) return;
    const C = window.AudioContext || window.webkitAudioContext;
    const c = (this.ctx = new C());
    this.comp = c.createDynamicsCompressor();
    this.comp.threshold.value = -10;
    this.comp.ratio.value = 6;
    this.master = c.createGain();
    this.master.gain.value = 0.85;
    this.master.connect(this.comp);
    this.comp.connect(c.destination);
    const len = c.sampleRate * 2;
    this.nbuf = c.createBuffer(1, len, c.sampleRate);
    const d = this.nbuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const s = this.noise(), hp = c.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 700;
    this.stG = c.createGain();
    this.stG.gain.value = 0;
    s.connect(hp).connect(this.stG).connect(this.master);
    this.base = 0;
  },
  now() { return this.ctx.currentTime; },
  noise() {
    const s = this.ctx.createBufferSource();
    s.buffer = this.nbuf;
    s.loop = true;
    s.start();
    return s;
  },
  setStatic(v, k = 0.06) { this.stG.gain.setTargetAtTime(v, this.now(), k); },
  setBase(v) { this.base = v; this.setStatic(v); },
  burst(ms = 400, vol = 0.45) {
    this.setStatic(vol, 0.004);
    clearTimeout(this._bt);
    this._bt = setTimeout(() => this.setStatic(this.base, 0.03), ms);
  },
  hum(on) {
    const c = this.ctx;
    if (on && !this._hum) {
      const g = c.createGain(), o = c.createOscillator(), g1 = c.createGain();
      g.gain.value = 0;
      g.gain.setTargetAtTime(1, this.now(), 0.4);
      o.frequency.value = 60;
      g1.gain.value = 0.03;
      o.connect(g1).connect(g);
      g.connect(this.master);
      o.start();
      this._hum = { g, o };
    } else if (!on && this._hum) {
      const h = this._hum;
      this._hum = null;
      h.g.gain.setTargetAtTime(0, this.now(), 0.05);
      setTimeout(() => h.o.stop(), 400);
    }
  },
  tone1k() {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain();
    o.frequency.value = 1000;
    g.gain.value = 0.11;
    o.connect(g).connect(this.master);
    o.start();
    return () => { g.gain.setTargetAtTime(0, this.now(), 0.01); o.stop(this.now() + 0.1); };
  },
  thump(f = 70, v = 0.5) {
    const c = this.ctx, t = this.now(), o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(f * 1.6, t);
    o.frequency.exponentialRampToValueAtTime(f * 0.5, t + 0.35);
    g.gain.setValueAtTime(v, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.5);
  },
  step() {
    const c = this.ctx, t = this.now(), s = c.createBufferSource(), lp = c.createBiquadFilter(), g = c.createGain();
    s.buffer = this.nbuf;
    lp.type = 'lowpass';
    lp.frequency.value = 260 + Math.random() * 140;
    g.gain.setValueAtTime(0.55, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    s.connect(lp).connect(g).connect(this.master);
    s.start(t, Math.random() * 1.5, 0.16);
  },
  blip() {
    const c = this.ctx, t = this.now(), o = c.createOscillator(), g = c.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(1320, t);
    o.frequency.setValueAtTime(990, t + 0.05);
    g.gain.setValueAtTime(0.06, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.13);
  },
  drone() {
    const c = this.ctx, g = c.createGain(), lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 160;
    g.gain.value = 0;
    lp.connect(g).connect(this.master);
    const os = [55, 55.6, 82.4, 110.9].map((f) => {
      const o = c.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = f;
      o.connect(lp);
      o.start();
      return o;
    });
    return {
      set: (v) => {
        const t = this.now();
        g.gain.setTargetAtTime(v * 0.16, t, 0.15);
        lp.frequency.setTargetAtTime(160 + v * 1400, t, 0.15);
      },
      stop: () => {
        g.gain.setTargetAtTime(0, this.now(), 0.02);
        setTimeout(() => os.forEach((o) => o.stop()), 300);
      },
    };
  },
  silence() {
    this.setBase(0);
    this.setStatic(0, 0.005);
    this.hum(false);
  },
  scream(d = 1.6) {
    const c = this.ctx, t = this.now(), out = c.createGain();
    out.gain.setValueAtTime(0, t);
    out.gain.linearRampToValueAtTime(1, t + 0.012);
    out.gain.setValueAtTime(1, t + d - 0.3);
    out.gain.exponentialRampToValueAtTime(0.001, t + d);
    const sh = c.createWaveShaper();
    sh.curve = distCurve(300);
    sh.connect(out).connect(this.master);
    [310, 447, 623, 880, 1240, 1710].forEach((f, j) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = j % 2 ? 'sawtooth' : 'square';
      for (let k = 0; k < d; k += 0.03) o.frequency.setValueAtTime(f * (0.78 + Math.random() * 0.5) * (1 + k * 0.35), t + k);
      g.gain.value = 0.12;
      o.connect(g).connect(sh);
      o.start(t);
      o.stop(t + d);
    });
    const ns = this.noise(), bp = c.createBiquadFilter(), ng = c.createGain();
    bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = 0.6;
    ng.gain.value = 0.7;
    ns.connect(bp).connect(ng).connect(sh);
    setTimeout(() => ns.stop(), d * 1000 + 50);
    this.thump(48, 1);
  },
  connectSong(el) {
    if (this.songSrc || !isHttp) return;
    try {
      this.songSrc = this.ctx.createMediaElementSource(el);
      this.an = this.ctx.createAnalyser();
      this.an.fftSize = 2048;
      this.songSrc.connect(this.an);
      this.an.connect(this.ctx.destination);
    } catch { this.an = null; }
  },
};

// ambiente de los pasillos: el sample de fondo + la rola lenta y al revés abajo.
// Con ruido todo se ensucia y se apaga; en los puntos tranquilos se oye limpio.
const Amb = {
  start() {
    const c = A.ctx;
    const el = (this.el = new Audio(CONFIG.ambiente));
    el.loop = true;
    el.preservesPitch = el.mozPreservesPitch = el.webkitPreservesPitch = false;
    if (CONFIG.sample) {
      this.smp = new Audio(CONFIG.sample);
      this.smp.loop = true;
    }
    if (isHttp) {
      try {
        const src = c.createMediaElementSource(el);
        this.dry = c.createGain();
        this.wet = c.createGain();
        this.lp = c.createBiquadFilter();
        this.lp.type = 'lowpass';
        this.songG = c.createGain();
        this.songG.gain.value = this.smp ? 0.28 : 1;
        const sh = c.createWaveShaper();
        sh.curve = distCurve(80);
        src.connect(this.dry).connect(this.lp);
        src.connect(sh).connect(this.wet).connect(this.lp);
        this.lp.connect(this.songG).connect(A.master);
        if (this.smp) {
          const s2 = c.createMediaElementSource(this.smp);
          this.sLp = c.createBiquadFilter();
          this.sLp.type = 'lowpass';
          this.sG = c.createGain();
          this.sG.gain.value = 1.1;
          s2.connect(this.sLp).connect(this.sG).connect(A.master);
        }
        this.routed = true;
      } catch {}
    }
    if (this.smp && !this.routed) this.smp.volume = 0;
    el.play().catch(() => {});
    if (this.smp) this.smp.play().catch(() => {});
  },
  set(noise, calm) {
    if (!this.el) return;
    const t = A.now();
    if (this.routed) {
      this.dry.gain.setTargetAtTime(1 - noise * 0.55, t, 0.2);
      this.wet.gain.setTargetAtTime(noise * 0.45, t, 0.2);
      this.lp.frequency.setTargetAtTime(700 + (1 - noise) * 7000, t, 0.3);
      if (this.sG) {
        this.sG.gain.setTargetAtTime(1.1 + 0.5 * calm, t, 0.3);
        this.sLp.frequency.setTargetAtTime(1800 + (1 - noise) * 12000, t, 0.3);
      }
    } else {
      this.el.volume = (this.smp ? 0.35 : 0.9) * (0.5 + 0.5 * (1 - noise));
      if (this.smp) this.smp.volume = Math.min(1, 0.6 + 0.4 * calm);
    }
    this.el.playbackRate = Math.max(0.6, 1 - noise * 0.14 + Math.sin(performance.now() / 650) * noise * 0.05);
  },
  fade() {
    if (this.routed) {
      const t = A.now();
      this.songG.gain.setTargetAtTime(0, t, 0.35);
      if (this.sG) this.sG.gain.setTargetAtTime(0, t, 0.35);
    } else {
      if (this.el) this.el.volume = 0.15;
      if (this.smp) this.smp.volume = 0.15;
    }
  },
  stop() {
    if (this.el) this.el.pause();
    if (this.smp) this.smp.pause();
  },
};

/* =========================================================
   CAPAS DE TV
   ========================================================= */
const grain = $('#grain'), gx = grain.getContext('2d');
grain.width = 160; grain.height = 120;
const gImg = gx.createImageData(160, 120);
let osdStart = 0, osdOn = false;
const osd = $('#osd');

function fmt(s, h) {
  s = Math.max(0, Math.floor(s));
  const m = Math.floor(s / 60) % 60, ss = String(s % 60).padStart(2, '0');
  return h ? `${Math.floor(s / 3600)}:${String(m).padStart(2, '0')}:${ss}` : `${Math.floor(s / 60)}:${ss}`;
}

let frame = 0;
function tvLoop(t) {
  frame++;
  if (frame % 2 === 0) {
    const d = gImg.data;
    for (let i = 0; i < d.length; i += 4) { const v = (Math.random() * 255) | 0; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
    gx.putImageData(gImg, 0, 0);
  }
  if (osdOn) $('#osd-tc').textContent = 'SP ' + fmt((t - osdStart) / 1000, true);
  requestAnimationFrame(tvLoop);
}
requestAnimationFrame(tvLoop);

function show(id) { document.querySelectorAll('.scene').forEach((s) => s.classList.toggle('on', s.id === id)); }
function setOsd(on, label) {
  osdOn = on;
  osd.classList.toggle('on', on);
  if (label) $('#osd-play').textContent = label;
  if (on && !osdStart) osdStart = performance.now();
}
async function snow(ms = 450, vol = 0.45) {
  document.body.classList.add('snow');
  if (A.ctx) A.burst(ms, vol);
  await sleep(ms);
  document.body.classList.remove('snow');
}
function tear() {
  const tv = $('#tv');
  tv.classList.remove('tear');
  void tv.offsetWidth;
  tv.classList.add('tear');
  setTimeout(() => tv.classList.remove('tear'), 220);
}

document.addEventListener('visibilitychange', () => { document.title = document.hidden ? 'no te vayas' : 'LOSTMEDIA'; });
console.log('%cte estamos viendo.', 'font:16px monospace;color:#f22;background:#000;padding:6px 10px');

/* =========================================================
   INTRO
   ========================================================= */
async function typeInto(el, lines, speed = 20) {
  el.innerHTML = '';
  const caret = document.createElement('span');
  caret.className = 'caret';
  for (const ln of lines) {
    const span = document.createElement('span');
    el.appendChild(span);
    el.appendChild(caret);
    for (const ch of ln.t) {
      span.textContent += ch;
      await sleep(ch === ' ' ? speed * 0.6 : speed);
    }
    span.textContent += '\n';
    await sleep(ln.pause || 220);
  }
}

async function sceneBars() {
  show('s-bars');
  const stop = A.tone1k();
  await sleep(1100);
  stop();
}

async function sceneCard() {
  show('s-card');
  A.hum(true);
  await typeInto($('#card-text'), [
    { t: 'encontramos esta cinta en una caja.', pause: 300 },
    { t: 'adentro venía un juego.', pause: 300 },
    { t: 'nadie sabe quién lo hizo.', pause: 900 },
  ]);
  A.hum(false);
}

// pantalla de carga del juego encontrado (se traba en 87%)
async function sceneBoot() {
  show('s-boot');
  const fill = $('#boot-fill'), s = $('#boot-s');
  for (const p of [9, 26, 33, 61, 87]) {
    fill.style.width = p + '%';
    A.blip();
    await sleep(150 + Math.random() * 150);
  }
  await sleep(650);
  s.textContent = 'nivel 1';
  fill.style.width = '100%';
  A.thump(60, 0.35);
  await sleep(400);
}

// metraje de dominio público: "Operation Cue" (1955) y "Photographic Studies in Hypnosis" (1938), Prelinger Archives
async function playTape() {
  const v = $('#tape'), pres = $('#presenta');
  if (v.error) { // sin video: solo el letrero sobre negro
    show('none');
    pres.classList.add('on');
    A.thump(45, 0.6);
    await sleep(2600);
    pres.classList.remove('on');
    return;
  }
  show('s-tape');
  const presT = setTimeout(() => { pres.classList.add('on'); A.thump(45, 0.6); A.burst(120, 0.4); }, 450);
  try { v.currentTime = 0; } catch {}
  const d = A.drone();
  d.set(0.3);
  A.setBase(0.05);
  const cuts = [0.9, 2.15, 3.0, 4.4, 5.1];
  let ci = 0, live = true;
  (function watch() {
    if (!live) return;
    if (ci < cuts.length && v.currentTime >= cuts[ci]) {
      ci++;
      A.burst(80, 0.5);
      A.thump(50, 0.35);
      d.set(0.3 + ci * 0.14);
      if (ci % 2) tear();
    }
    requestAnimationFrame(watch);
  })();
  await new Promise((r) => {
    v.onended = r;
    v.onerror = r;
    setTimeout(r, 7500);
    v.play().catch(r);
  });
  live = false;
  clearTimeout(presT);
  pres.classList.remove('on');
  d.stop();
  A.setBase(0);
}

// la ventanita de chat del cuarto final
const Chat = {
  async start() {
    const box = $('#chat'), log = $('#chat-log');
    box.hidden = false;
    log.innerHTML = '';
    this.on = true;
    for (const [u, m] of CONFIG.chat) {
      await sleep(1400);
      if (!this.on) return;
      const p = document.createElement('p'), b = document.createElement('b');
      b.textContent = u + ': ';
      p.append(b, m);
      log.appendChild(p);
      log.scrollTop = log.scrollHeight;
      A.blip();
    }
  },
  add(u, m) {
    this.on = false;
    const log = $('#chat-log'), p = document.createElement('p'), b = document.createElement('b');
    b.textContent = u + ': ';
    p.append(b, m);
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    A.blip();
  },
  stop() { this.on = false; $('#chat').hidden = true; },
};

/* =========================================================
   PASILLOS · primera persona, blanco y negro, con ruido
   ========================================================= */
const Maze = (() => {
  const CW = 8, CH = 8, GW = CW * 2 + 1, GH = CH * 2 + 1;
  const FOG = 6.5;
  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const CALM_LINES = ['aquí está tranquilo.', 'sigue.', 'ya casi.'];
  let cv, ctx, W, H, img, buf32, zbuf, spot, planeLen, noiseFrames = [];
  let grid, path, offDist, calmSet, calmIdx, room, exit;
  let tex = {}, faceTex = new Map(), sprites = [], mannequins = [];
  let raf = 0, last = 0, done, drone, ampT = 0;
  const keys = {}, joy = { fwd: 0, turn: 0, look: 0 };
  const coarse = matchMedia('(pointer: coarse)').matches;
  const st = {};
  const cap = () => $('#maze-cc');

  const rng = (seed) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const isWall = (x, y) => x < 0 || y < 0 || x >= GW || y >= GH || grid[y][x] === 1;
  const inRoom = (x, y) => x >= room.x0 && x <= room.x1 && y >= room.y0 && y <= room.y1;

  function bfs(sources) {
    const dist = new Int16Array(GW * GH).fill(-1), prev = new Int32Array(GW * GH).fill(-1), q = [];
    for (const [x, y] of sources) { dist[y * GW + x] = 0; q.push(y * GW + x); }
    for (let h = 0; h < q.length; h++) {
      const i = q[h], x = i % GW, y = (i / GW) | 0;
      for (const [dx, dy] of DIRS) {
        const nx = x + dx, ny = y + dy, ni = ny * GW + nx;
        if (!isWall(nx, ny) && dist[ni] < 0) { dist[ni] = dist[i] + 1; prev[ni] = i; q.push(ni); }
      }
    }
    return { dist, prev };
  }

  // ---------- texturas ----------
  function valueNoise(R, n, cell) {
    const m = n / cell, g = Array.from({ length: m * m }, R);
    return (x, y) => {
      const gx = x / cell, gy = y / cell, x0 = gx | 0, y0 = gy | 0, fx = gx - x0, fy = gy - y0;
      const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      const a = g[(y0 % m) * m + (x0 % m)], b = g[(y0 % m) * m + ((x0 + 1) % m)];
      const c = g[((y0 + 1) % m) * m + (x0 % m)], d = g[((y0 + 1) % m) * m + ((x0 + 1) % m)];
      return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
    };
  }
  function genWall(R, n = 64) {
    const d = new Float32Array(n * n), n1 = valueNoise(R, n, 16), n2 = valueNoise(R, n, 4);
    const drips = Array.from({ length: 6 }, () => ({ x: (R() * n) | 0, len: 8 + R() * 30, w: 1 + ((R() * 2) | 0) }));
    const band = Math.floor(n * 0.62);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      let v = 0.5 + (n1(x, y) - 0.5) * 0.3 + (n2(x, y) - 0.5) * 0.14;
      if (y > band) v *= 0.68;
      if (y === band || y === band + 1) v = 0.24;
      for (const dr of drips) if (x >= dr.x && x < dr.x + dr.w && y < dr.len) v *= 0.72 + (y / dr.len) * 0.2;
      d[y * n + x] = Math.max(0, v + (R() - 0.5) * 0.07);
    }
    return { n, d };
  }
  function genFloor(R, n = 32) {
    const d = new Float32Array(n * n), n1 = valueNoise(R, n, 8);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const tile = (((x >> 4) + (y >> 4)) & 1) ? 0.34 : 0.26;
      const grout = (x % 16 === 0 || y % 16 === 0) ? 0.55 : 1;
      d[y * n + x] = (tile + (n1(x, y) - 0.5) * 0.12 + (R() - 0.5) * 0.05) * grout;
    }
    return { n, d };
  }
  function genCeil(R, n = 32) {
    const d = new Float32Array(n * n), n1 = valueNoise(R, n, 8);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const line = (x === 0 || y === 0) ? 0.5 : 1;
      d[y * n + x] = (0.3 + (n1(x, y) - 0.5) * 0.15) * line;
    }
    return { n, d };
  }
  // texturas a color para el cuarto (mundo 3D de chat abandonado)
  function colorTex(image, n) {
    if (!image) return null;
    try {
      const c = document.createElement('canvas');
      c.width = c.height = n;
      const x = c.getContext('2d');
      x.drawImage(image, 0, 0, n, n);
      return { n, c: new Uint32Array(x.getImageData(0, 0, n, n).data.slice().buffer) };
    } catch { return null; }
  }
  const rgb = (r, g, b) => 0xff000000 | (Math.min(255, Math.max(0, b | 0)) << 16) | (Math.min(255, Math.max(0, g | 0)) << 8) | Math.min(255, Math.max(0, r | 0));
  function genRoomFloor(R, n = 32) {
    const c = new Uint32Array(n * n);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const line = x % 16 === 0 || y % 16 === 0, alt = ((x >> 4) + (y >> 4)) & 1, j = (R() - 0.5) * 18;
      c[y * n + x] = line ? rgb(150 + j, 205 + j, 255) : alt ? rgb(30 + j, 95 + j, 205 + j) : rgb(45 + j, 120 + j, 230 + j);
    }
    return { n, c };
  }
  function genRoomSky(R, n = 32) {
    const c = new Uint32Array(n * n), cl = valueNoise(R, n, 8);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const w = Math.max(0, cl(x, y) - 0.55) * 2.4;
      c[y * n + x] = rgb(110 + w * 140, 165 + w * 90, 235 + w * 20);
    }
    return { n, c };
  }
  function genRoomWall(R, n = 64) {
    const c = new Uint32Array(n * n), pal = [[220, 50, 50], [250, 210, 40], [40, 170, 90], [60, 90, 220]];
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const p = pal[((x >> 4) + (y >> 4)) & 3]; c[y * n + x] = rgb(p[0], p[1], p[2]); }
    return { n, c };
  }

  function posterTex(base, image, R) {
    const n = 128, c = document.createElement('canvas');
    c.width = c.height = n;
    const x = c.getContext('2d'), id = x.createImageData(n, n);
    for (let i = 0; i < n * n; i++) {
      const sx = (i % n) >> 1, sy = ((i / n) | 0) >> 1, v = base.d[sy * base.n + sx] * 255;
      id.data[i * 4] = id.data[i * 4 + 1] = id.data[i * 4 + 2] = v;
      id.data[i * 4 + 3] = 255;
    }
    x.putImageData(id, 0, 0);
    if (image) {
      const box = n * 0.66, s = Math.min(box / image.naturalWidth, box / image.naturalHeight);
      const w = image.naturalWidth * s, h = image.naturalHeight * s;
      x.save();
      x.translate(n / 2 + (R() - 0.5) * 8, n * 0.4);
      x.rotate((R() - 0.5) * 0.12);
      if (!/\.png$/i.test(image.src)) { x.fillStyle = '#111'; x.fillRect(-w / 2 - 3, -h / 2 - 3, w + 6, h + 6); }
      x.drawImage(image, -w / 2, -h / 2, w, h);
      x.restore();
    }
    try {
      const px = x.getImageData(0, 0, n, n).data, d = new Float32Array(n * n);
      for (let i = 0; i < n * n; i++) d[i] = (px[i * 4] * 0.3 + px[i * 4 + 1] * 0.59 + px[i * 4 + 2] * 0.11) / 255;
      return { n, d };
    } catch { return base; } // abierto como archivo: el navegador no deja leer la imagen
  }
  function prelight(image, maxH = 170, color = false) {
    if (!image) return null;
    const s = Math.min(1, maxH / image.naturalHeight);
    const w = Math.max(1, Math.round(image.naturalWidth * s)), h = Math.max(1, Math.round(image.naturalHeight * s));
    const base = document.createElement('canvas');
    base.width = w; base.height = h;
    const bx = base.getContext('2d');
    bx.drawImage(image, 0, 0, w, h);
    const ks = [0.12, 0.25, 0.4, 0.58, 0.78, 1];
    try {
      const src = bx.getImageData(0, 0, w, h);
      const levels = ks.map((k) => {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const cx = c.getContext('2d'), out = cx.createImageData(w, h);
        for (let i = 0; i < src.data.length; i += 4) {
          if (color) {
            out.data[i] = src.data[i] * k; out.data[i + 1] = src.data[i + 1] * k; out.data[i + 2] = src.data[i + 2] * k;
          } else {
            const v = (src.data[i] * 0.3 + src.data[i + 1] * 0.59 + src.data[i + 2] * 0.11) * k;
            out.data[i] = v * 0.86; out.data[i + 1] = v; out.data[i + 2] = v * 0.9;
          }
          out.data[i + 3] = src.data[i + 3];
        }
        cx.putImageData(out, 0, 0);
        return c;
      });
      return { w, h, levels };
    } catch { return { w, h, levels: [base] }; }
  }

  // ---------- mapa ----------
  function build() {
    const R = rng(4427);
    grid = Array.from({ length: GH }, () => new Uint8Array(GW).fill(1));
    const vis = new Uint8Array(CW * CH), stack = [[0, 0]];
    vis[0] = 1;
    grid[1][1] = 0;
    while (stack.length) {
      const [cx, cy] = stack[stack.length - 1];
      const opts = DIRS.filter(([dx, dy]) => {
        const nx = cx + dx, ny = cy + dy;
        return nx >= 0 && ny >= 0 && nx < CW && ny < CH && !vis[ny * CW + nx];
      });
      if (!opts.length) { stack.pop(); continue; }
      const [dx, dy] = opts[(R() * opts.length) | 0], nx = cx + dx, ny = cy + dy;
      vis[ny * CW + nx] = 1;
      grid[cy * 2 + 1 + dy][cx * 2 + 1 + dx] = 0;
      grid[ny * 2 + 1][nx * 2 + 1] = 0;
      stack.push([nx, ny]);
    }
    // unas vueltas extra para que no sea puro callejón sin salida
    for (let k = 0, opened = 0; k < 300 && opened < 8; k++) {
      const x = 1 + ((R() * (GW - 2)) | 0), y = 1 + ((R() * (GH - 2)) | 0);
      if (grid[y][x] !== 1) continue;
      if ((x % 2 === 0 && y % 2 === 1 && !grid[y][x - 1] && !grid[y][x + 1]) || (x % 2 === 1 && y % 2 === 0 && !grid[y - 1][x] && !grid[y + 1][x])) {
        grid[y][x] = 0;
        opened++;
      }
    }
    room = { x0: 11, y0: 11, x1: 15, y1: 15 };
    for (let y = room.y0; y <= room.y1; y++) for (let x = room.x0; x <= room.x1; x++) grid[y][x] = 0;
    exit = { x: 15, y: 15 };

    const { prev } = bfs([[1, 1]]);
    path = [];
    for (let i = exit.y * GW + exit.x; i >= 0; i = prev[i]) path.unshift({ x: i % GW, y: (i / GW) | 0 });
    offDist = bfs(path.map((p) => [p.x, p.y])).dist;

    calmSet = new Set();
    calmIdx = new Map();
    const outside = path.filter((p) => !inRoom(p.x, p.y));
    [0.22, 0.48, 0.74].forEach((f, k) => {
      const i = Math.floor(outside.length * f);
      for (let j = i - 1; j <= i + 1; j++) {
        const p = outside[j];
        if (p) { calmSet.add(p.y * GW + p.x); calmIdx.set(p.y * GW + p.x, k); }
      }
    });

    // texturas y PNG en las paredes
    const wall = genWall(R);
    tex = { wall, floor: genFloor(R), ceil: genCeil(R), rFloor: genRoomFloor(R), rCeil: genRoomSky(R) };
    tex.rWall = colorTex(IMGS[CONFIG.tapiz], 64) || genRoomWall(R);
    faceTex = new Map();
    const faceKey = (wx, wy, dx, dy) => `${wx},${wy},${dx ? 0 : 1},${(dx || dy) > 0 ? 1 : 0}`;
    const addPoster = (p, src) => {
      const opts = DIRS.filter(([dx, dy]) => isWall(p.x + dx, p.y + dy) && !faceTex.has(faceKey(p.x + dx, p.y + dy, dx, dy)));
      if (!opts.length) return;
      const [dx, dy] = opts[(R() * opts.length) | 0];
      faceTex.set(faceKey(p.x + dx, p.y + dy, dx, dy), posterTex(wall, IMGS[src], R));
    };
    let pi = 0;
    const calmDone = new Set();
    outside.forEach((p, i) => {
      const k = calmIdx.get(p.y * GW + p.x);
      if (k !== undefined && !calmDone.has(k)) { calmDone.add(k); addPoster(p, CONFIG.posters[k % 3]); }
      else if (i > 2 && i % 4 === 0) addPoster(p, CONFIG.posters[pi++ % CONFIG.posters.length]);
    });
    for (let y = 1; y < GH; y += 2) for (let x = 1; x < GW; x += 2) { // premio por perderse
      if (inRoom(x, y) || offDist[y * GW + x] < 3 || R() > 0.35) continue;
      addPoster({ x, y }, CONFIG.posters[pi++ % CONFIG.posters.length]);
    }

    // apariciones y maniquíes
    sprites = [];
    [0.34, 0.6, 0.86].forEach((f, k) => {
      const p = outside[Math.floor(outside.length * f)];
      const src = CONFIG.apariciones[k % CONFIG.apariciones.length];
      const pl = prelight(IMGS[src]);
      const mq = src.includes('manq');
      if (p && pl) sprites.push({ kind: 'ap', x: p.x + 0.5, y: p.y + 0.5, p: pl, h: mq ? 0.7 : 0.95, lift: mq ? 0.3 : 0, alive: true });
    });
    mannequins = [];
    const spots = [];
    for (let y = room.y0; y <= room.y1; y++) for (let x = room.x0; x <= room.x1; x++) {
      if ((x === exit.x && y === exit.y) || (x <= room.x0 + 1 && y <= room.y0 + 1)) continue;
      spots.push([x, y]);
    }
    for (let k = 0; k < 9 && spots.length; k++) {
      const [x, y] = spots.splice((R() * spots.length) | 0, 1)[0];
      const pl = prelight(IMGS[CONFIG.maniquies[k % CONFIG.maniquies.length]], 170, true);
      if (!pl) continue;
      const m = { kind: 'mq', x: x + 0.3 + R() * 0.4, y: y + 0.3 + R() * 0.4, p: pl, h: 0.62, lift: 0.36, alive: true };
      mannequins.push(m);
      sprites.push(m);
    }
  }

  // ---------- pantalla ----------
  const B4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const FPS = 15; // como los juegos de antes
  let dith, nextDraw = 0;
  function fit() {
    const ar = innerWidth / innerHeight;
    H = ar >= 1 ? 120 : 170;
    W = Math.max(80, Math.min(240, Math.round(H * ar)));
    planeLen = Math.max(0.42, (0.66 * (W / H)) / (4 / 3));
    cv.width = W; cv.height = H;
    img = ctx.createImageData(W, H);
    buf32 = new Uint32Array(img.data.buffer);
    zbuf = new Float32Array(W);
    spot = new Float32Array(W * H);
    dith = new Float32Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) dith[y * W + x] = (B4[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
    const cx = W / 2, cy = H * 0.52, r = Math.min(W, H) * 0.8;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      spot[y * W + x] = Math.max(0.2, Math.min(1, 1.18 - Math.hypot(x - cx, (y - cy) * 1.2) / r));
    }
    noiseFrames = Array.from({ length: 4 }, () => {
      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      const x = c.getContext('2d'), id = x.createImageData(W, H);
      for (let i = 0; i < W * H; i++) { const v = (Math.random() * 255) | 0; id.data[i * 4] = v * 0.9; id.data[i * 4 + 1] = v; id.data[i * 4 + 2] = v * 0.92; id.data[i * 4 + 3] = 255; }
      x.putImageData(id, 0, 0);
      return c;
    });
  }

  // pocos tonos con tramado, como las tarjetas de video de los 90
  function pix(i, v) {
    v *= 1.75; // ganancia: oscuro, pero que se distinga
    let q = ((v * 18 + dith[i]) | 0) / 18;
    if (q > 1) q = 1;
    const c = (q * 255) | 0;
    buf32[i] = 0xff000000 | (((c * 0.9) | 0) << 16) | (c << 8) | ((c * 0.86) | 0);
  }

  function pixC(i, col, l) {
    l *= 1.25 / 255 * 10;
    const d = dith[i];
    let r = ((((col & 255) * l + d) | 0) * 25.5) | 0, g = (((((col >> 8) & 255) * l + d) | 0) * 25.5) | 0, b = (((((col >> 16) & 255) * l + d) | 0) * 25.5) | 0;
    if (r > 255) r = 255;
    if (g > 255) g = 255;
    if (b > 255) b = 255;
    buf32[i] = 0xff000000 | (b << 16) | (g << 8) | r;
  }
  const roomLit = (d) => Math.max(0.18, 1 - d / 14) * st.flick * st.light;

  function render() {
    const px = st.x, py = st.y, dx = Math.cos(st.a), dy = Math.sin(st.a);
    const plx = -dy * planeLen, ply = dx * planeLen, fl = st.flick * st.light;
    const half = H / 2 + st.bob;
    // piso y techo
    const rx0 = dx - plx, ry0 = dy - ply, rx1 = dx + plx, ry1 = dy + ply;
    for (let y = 0; y < H; y++) {
      const floor = y > half, p = floor ? y - half : half - y, row = y * W;
      if (p < 1) { for (let x = 0; x < W; x++) buf32[row + x] = 0xff000000; continue; }
      const rd = (H * 0.5) / p, fog = Math.max(0, 1 - rd / FOG), f2 = fog * fog * fl * (floor ? 1 : 0.6);
      const T = floor ? tex.floor : tex.ceil, tn = T.n, td = T.d, m = tn - 1;
      let fx = px + rd * rx0, fy = py + rd * ry0;
      const sx = (rd * (rx1 - rx0)) / W, sy = (rd * (ry1 - ry0)) / W;
      const RT = floor ? tex.rFloor : tex.rCeil, rn = RT.n, rm = rn - 1, rl = roomLit(rd);
      for (let x = 0; x < W; x++) {
        const cx = fx | 0, cy = fy | 0;
        if (cx >= room.x0 && cx <= room.x1 && cy >= room.y0 && cy <= room.y1) pixC(row + x, RT.c[(((fy * rn) | 0) & rm) * rn + (((fx * rn) | 0) & rm)], rl);
        else pix(row + x, td[(((fy * tn) | 0) & m) * tn + (((fx * tn) | 0) & m)] * f2 * spot[row + x]);
        fx += sx; fy += sy;
      }
    }
    // paredes
    for (let x = 0; x < W; x++) {
      const cam = (2 * x) / W - 1, rdx = dx + plx * cam, rdy = dy + ply * cam;
      let mx = px | 0, my = py | 0;
      const ddx = Math.abs(1 / rdx), ddy = Math.abs(1 / rdy);
      const stx = rdx < 0 ? -1 : 1, sty = rdy < 0 ? -1 : 1;
      let sdx = rdx < 0 ? (px - mx) * ddx : (mx + 1 - px) * ddx;
      let sdy = rdy < 0 ? (py - my) * ddy : (my + 1 - py) * ddy;
      let side = 0, n = 0;
      while (n++ < 64) {
        if (sdx < sdy) { sdx += ddx; mx += stx; side = 0; } else { sdy += ddy; my += sty; side = 1; }
        if (isWall(mx, my)) break;
      }
      const perp = Math.max(0.05, side === 0 ? sdx - ddx : sdy - ddy);
      zbuf[x] = perp;
      const lh = H / perp, top = half - lh / 2;
      if (inRoom(side === 0 ? mx - stx : mx, side === 1 ? my - sty : my)) { // pared del cuarto, a color
        const RW = tex.rWall, rn = RW.n;
        let wx = side === 0 ? py + perp * rdy : px + perp * rdx;
        wx -= Math.floor(wx);
        const tx = (wx * rn) | 0, lit = roomLit(perp) * (side ? 0.82 : 1);
        const y0 = Math.max(0, Math.ceil(top)), y1 = Math.min(H, Math.floor(top + lh));
        for (let y = y0; y < y1; y++) pixC(y * W + x, RW.c[Math.min(rn - 1, (((y - top) / lh) * rn) | 0) * rn + tx], lit);
        continue;
      }
      const T = faceTex.get(`${mx},${my},${side},${(side ? sty : stx) > 0 ? 1 : 0}`) || tex.wall, tn = T.n, td = T.d;
      let wx = side === 0 ? py + perp * rdy : px + perp * rdx;
      wx -= Math.floor(wx);
      let tx = (wx * tn) | 0;
      if ((side === 0 && rdx < 0) || (side === 1 && rdy > 0)) tx = tn - tx - 1;
      const fog = Math.max(0, 1 - perp / FOG), lit = fog * fog * fl * (side ? 0.78 : 1);
      const y0 = Math.max(0, Math.ceil(top)), y1 = Math.min(H, Math.floor(top + lh));
      for (let y = y0; y < y1; y++) {
        const ty = Math.min(tn - 1, (((y - top) / lh) * tn) | 0);
        pix(y * W + x, td[ty * tn + tx] * lit * spot[y * W + x]);
      }
    }
    ctx.putImageData(img, 0, 0);

    // PNG parados (apariciones y maniquíes)
    const invDet = 1 / (plx * dy - dx * ply);
    const list = sprites.filter((s) => s.alive).map((s) => ({ s, d: (s.x - px) ** 2 + (s.y - py) ** 2 })).sort((a, b) => b.d - a.d);
    for (const { s } of list) {
      const sx = s.x - px, sy = s.y - py;
      const tX = invDet * (dy * sx - dx * sy), tY = invDet * (-ply * sx + plx * sy);
      if (tY < 0.12) continue;
      const fog = Math.max(0, 1 - tY / FOG), lit = s.kind === 'mq' && st.inRoom ? roomLit(tY) : fog * fog * fl;
      if (lit < 0.03) continue;
      const scrX = (W / 2) * (1 + tX / tY), unit = H / tY;
      const sh = unit * s.h, sw = sh * (s.p.w / s.p.h);
      const topY = half + unit / 2 - s.lift * unit - sh;
      const lvl = s.p.levels[Math.min(s.p.levels.length - 1, Math.floor(lit * s.p.levels.length))];
      const left = scrX - sw / 2;
      for (let x = Math.max(0, Math.floor(left)); x < Math.min(W, Math.ceil(left + sw)); x++) {
        if (tY >= zbuf[x]) continue;
        const u = Math.min(lvl.width - 1, Math.floor(((x - left) / sw) * lvl.width));
        ctx.drawImage(lvl, u, 0, 1, lvl.height, x, topY, 1, sh);
      }
    }

    // destello de un PNG, como si la cinta se brincara
    if (st.flash > 0 && st.flashImg) {
      const p = st.flashImg, s = Math.min(W / p.w, H / p.h) * 1.1;
      ctx.globalAlpha = 0.75;
      ctx.drawImage(p.levels[p.levels.length - 1], (W - p.w * s) / 2, (H - p.h * s) / 2, p.w * s, p.h * s);
      ctx.globalAlpha = 1;
    }
    // te alcanzó: el maniquí pegado a tu cara
    if (st.mode === 'caught' && st.caughtImg) {
      const p = st.caughtImg, s = Math.max(W / p.w, H / p.h) * 1.35;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(p.levels[p.levels.length - 1], (W - p.w * s) / 2 + (Math.random() - 0.5) * 6, (H - p.h * s) / 2.4, p.w * s, p.h * s);
    }
    // ruido: grano y cortes horizontales
    const nz = st.noise;
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = (st.inRoom ? 0.04 : 0.08) + nz * 0.32;
    ctx.drawImage(noiseFrames[frame & 3], 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = nz * nz * 0.1;
    ctx.drawImage(noiseFrames[(frame + 1) & 3], 0, 0);
    ctx.globalAlpha = 1;
    if (nz > 0.45 && Math.random() < nz * 0.35) {
      for (let k = 0; k < 1 + nz * 5; k++) {
        const y = Math.random() * H, h = 1 + Math.random() * 8;
        ctx.drawImage(cv, 0, y, W, h, (Math.random() - 0.5) * nz * 26, y, W, h);
      }
    }
    // banda de tracking de VHS que baja por la pantalla
    if (st.band > 0) {
      const bh = Math.max(6, H * 0.08), by = ((1 - st.band) * (H + bh * 2) - bh) | 0;
      ctx.drawImage(cv, 0, by, W, bh, (Math.random() - 0.5) * 12, by, W, bh);
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = 0.6;
      ctx.drawImage(noiseFrames[(frame + 2) & 3], 0, by, W, bh, 0, by, W, bh);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }

  // ---------- lógica ----------
  async function say(t, ms = 1800) {
    cap().textContent = t;
    const id = (st.capId = (st.capId || 0) + 1);
    await sleep(ms);
    if (st.capId === id) cap().textContent = '';
  }

  function update(dt) {
    if (st.mode === 'calm') { st.light = Math.max(0, st.light - dt * 0.75); st.noise += (0 - st.noise) * Math.min(1, dt * 3); return; }
    if (st.mode !== 'play') return;
    let fwd = (keys.u ? 1 : 0) - (keys.d ? 1 : 0) + joy.fwd;
    const turn = (keys.r ? 1 : 0) - (keys.l ? 1 : 0) + joy.turn;
    fwd = Math.max(-1, Math.min(1, fwd));
    const look = joy.look;
    joy.look = 0;
    st.a += Math.max(-1.4, Math.min(1.4, turn)) * 2.3 * dt + look;
    // ayuda: si llevas un rato caminando sin voltear, la vista se endereza sola con el pasillo
    if (Math.abs(turn) > 0.05 || Math.abs(look) > 0.001) st.sinceTurn = 0;
    else st.sinceTurn = (st.sinceTurn || 0) + dt;
    if (Math.abs(fwd) > 0.3 && st.sinceTurn > 0.7) {
      const q = Math.PI / 2, diff = Math.round(st.a / q) * q - st.a;
      if (Math.abs(diff) < 0.35) st.a += diff * Math.min(1, dt * 2.5);
    }
    if ((Math.abs(fwd) > 0.1 || Math.abs(turn) > 0.1 || Math.abs(look) > 0.01) && !st.moved) { st.moved = true; setTimeout(() => $('#maze-hint').classList.add('off'), 2500); }
    const sp = 2.3 * fwd * dt, r = 0.22;
    const nx = st.x + Math.cos(st.a) * sp, ny = st.y + Math.sin(st.a) * sp;
    if (!isWall((nx + Math.sign(nx - st.x) * r) | 0, st.y | 0)) st.x = nx;
    if (!isWall(st.x | 0, (ny + Math.sign(ny - st.y) * r) | 0)) st.y = ny;
    if (Math.abs(fwd) > 0.1) {
      const before = Math.sin(st.walk);
      st.walk += dt * Math.abs(fwd) * 9;
      if (before > 0 && Math.sin(st.walk) <= 0) A.step();
    }
    st.bob = Math.sin(st.walk) * 1.6;

    const cx = st.x | 0, cy = st.y | 0, ci = cy * GW + cx;
    const calm = calmSet.has(ci), here = inRoom(cx, cy);
    let target = calm ? 0.02 : here ? 0.08 : Math.min(0.8, 0.18 + Math.max(0, offDist[ci]) * 0.16);

    if (calm && st.lastCalm !== calmIdx.get(ci)) { st.lastCalm = calmIdx.get(ci); say(CALM_LINES[st.lastCalm] || '', 2200); }
    if (!calm && offDist[ci] >= 3 && !st.saidLost) { st.saidLost = true; say('por aquí no.', 1600); }

    // las apariciones se esfuman cuando te acercas
    for (const s of sprites) {
      if (s.kind !== 'ap' || !s.alive) continue;
      if (Math.hypot(s.x - st.x, s.y - st.y) < 2.3) {
        s.alive = false;
        A.burst(220, 0.6);
        A.thump(45, 0.5);
        st.flash = 0.12;
        st.flashImg = s.p;
        tear();
      }
    }
    // PNG que brincan cuando hay mucho ruido
    st.sinceFlash += dt;
    if (target > 0.8 && st.sinceFlash > 3.5 && Math.random() < dt * 0.5) {
      st.sinceFlash = 0;
      const pool = sprites.filter((s) => s.kind === 'ap');
      if (pool.length) { st.flashImg = pool[(Math.random() * pool.length) | 0].p; st.flash = 0.09; A.burst(120, 0.55); }
    }
    st.flash = Math.max(0, st.flash - dt);

    // cuarto de maniquíes: se mueven cuando no los ves
    let near = 0;
    if (here && !st.inRoom) {
      st.inRoom = true;
      say('conectado.', 1400);
      A.thump(40, 0.7);
      A.burst(300, 0.5);
      tear();
      drone = A.drone();
      Chat.start();
    }
    if (st.inRoom) {
      const dx = Math.cos(st.a), dy = Math.sin(st.a), cone = Math.cos(Math.atan(planeLen) + 0.12);
      for (const m of mannequins) {
        const vx = m.x - st.x, vy = m.y - st.y, d = Math.hypot(vx, vy) || 0.01;
        const seen = (vx * dx + vy * dy) / d > cone;
        if (!seen && d > 0.4) {
          const mvx = m.x - (vx / d) * 1.1 * dt, mvy = m.y - (vy / d) * 1.1 * dt;
          if (!isWall(mvx | 0, mvy | 0)) { m.x = mvx; m.y = mvy; }
        }
        near = Math.max(near, 1 - d / 4);
        if (d < 0.7) { end('caught', m); return; }
      }
      target = Math.max(target, 0.1 + near * 0.75);
      if (drone) drone.set(0.2 + near * 0.8);
    }
    if (cx === exit.x && cy === exit.y) { end('exit'); return; }
    st.band -= dt * 0.8;
    if (st.band <= 0 && st.noise > 0.5 && Math.random() < dt * 0.3) st.band = 1;

    st.noise += (target - st.noise) * Math.min(1, dt * 2.2);
    st.calm += ((calm ? 1 : 0) - st.calm) * Math.min(1, dt * 2);
    st.flick = st.noise > 0.45 && Math.random() < st.noise * 0.07 ? 0.45 : 0.93 + Math.random() * 0.07;
    A.setStatic(st.noise * st.noise * 0.22, 0.1);
    ampT -= dt;
    if (ampT <= 0) { ampT = 0.25; Amb.set(st.noise, st.calm); }
    $('#s-maze').classList.toggle('shake', st.noise > 0.75 || near > 0.6);
  }

  async function end(kind, m) {
    if (st.mode !== 'play') return;
    if (drone) { drone.stop(); drone = null; }
    cap().textContent = '';
    $('#s-maze').classList.remove('shake');
    if (kind === 'caught') {
      // te dio la espalda: el maniquí ya está en tu cara
      st.mode = 'caught';
      st.caughtImg = m.p;
      Amb.stop();
      Chat.stop();
      A.silence();
      A.thump(38, 1);
      A.burst(240, 0.7);
      if (navigator.vibrate) navigator.vibrate(140);
      await sleep(280);
    } else {
      // calma falsa: parece que ya se acabó
      st.mode = 'calm';
      A.silence();
      Amb.fade();
      Chat.add('kiddwero', 'ya te puedes ir');
      await sleep(1700);
      Chat.stop();
      Amb.stop();
      await sleep(1400); // negro y silencio
    }
    stopLoop();
    done();
  }

  function loop(t) {
    const dt = Math.min(0.05, (t - last) / 1000 || 0);
    last = t;
    update(dt);
    if (!raf) return;
    // se dibuja a ~15 cuadros por segundo y, con mucho ruido, a veces se traba
    if (t >= nextDraw) {
      render();
      nextDraw = t + 1000 / FPS + (st.noise > 0.6 && Math.random() < 0.08 ? 120 + Math.random() * 180 : 0);
    }
    if (raf) raf = requestAnimationFrame(loop);
  }
  function stopLoop() { cancelAnimationFrame(raf); raf = 0; }

  const KEYMAP = { ArrowUp: 'u', KeyW: 'u', ArrowDown: 'd', KeyS: 'd', ArrowLeft: 'l', KeyA: 'l', ArrowRight: 'r', KeyD: 'r' };
  addEventListener('keydown', (e) => { const k = KEYMAP[e.code]; if (k) { keys[k] = true; if (raf) e.preventDefault(); } });
  addEventListener('keyup', (e) => { const k = KEYMAP[e.code]; if (k) keys[k] = false; });
  addEventListener('blur', () => { for (const k in keys) keys[k] = false; });

  // controles táctiles: mitad izquierda = joystick para caminar, mitad derecha = deslizar para mirar.
  // Los dos dedos funcionan al mismo tiempo. Con el mouse funciona igual.
  function bindJoy() {
    const sc = $('#s-maze'), ring = $('#joy'), knob = $('#knob');
    let moveId = null, lookId = null, ox = 0, oy = 0, lx = 0;
    const home = () => {
      ring.style.left = Math.min(110, innerWidth * 0.22) + 'px';
      ring.style.top = innerHeight - Math.min(150, innerHeight * 0.2) + 'px';
      knob.style.transform = '';
    };
    if (coarse) { home(); ring.classList.add('on'); addEventListener('resize', () => { if (moveId === null) home(); }); }
    sc.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (e.clientX < innerWidth * 0.5 && moveId === null) {
        moveId = e.pointerId; ox = e.clientX; oy = e.clientY;
        ring.style.left = ox + 'px'; ring.style.top = oy + 'px';
        ring.classList.add('on', 'live');
        knob.style.transform = '';
      } else if (lookId === null) {
        lookId = e.pointerId; lx = e.clientX;
      } else return;
      try { sc.setPointerCapture(e.pointerId); } catch {}
    });
    sc.addEventListener('pointermove', (e) => {
      if (e.pointerId === moveId) {
        let dx = (e.clientX - ox) / 46, dy = (e.clientY - oy) / 46;
        const l = Math.hypot(dx, dy);
        if (l > 1) { dx /= l; dy /= l; }
        joy.fwd = Math.abs(dy) < 0.2 ? 0 : -dy;
        joy.turn = Math.abs(dx) < 0.3 ? 0 : dx * 0.6; // el joystick también voltea, más suave
        knob.style.transform = `translate(${dx * 34}px, ${dy * 34}px)`;
      } else if (e.pointerId === lookId) {
        joy.look += (e.clientX - lx) * (coarse ? 0.009 : 0.006);
        lx = e.clientX;
      }
    });
    const endP = (e) => {
      if (e.pointerId === moveId) {
        moveId = null;
        joy.fwd = joy.turn = 0;
        ring.classList.remove('live');
        if (coarse) home(); else ring.classList.remove('on');
      }
      if (e.pointerId === lookId) lookId = null;
    };
    sc.addEventListener('pointerup', endP);
    sc.addEventListener('pointercancel', endP);
    sc.addEventListener('lostpointercapture', endP);
  }

  return {
    async run() {
      await imgsReady;
      cv = $('#maze');
      ctx = cv.getContext('2d');
      fit();
      addEventListener('resize', () => { if (raf) fit(); });
      build();
      bindJoy();
      const first = path[1] || { x: 2, y: 1 };
      Object.assign(st, {
        x: 1.5, y: 1.5, a: Math.atan2(first.y - 1, first.x - 1), walk: 0, bob: 0, noise: 0.25, calm: 0, flick: 1, light: 1,
        mode: 'play', moved: false, inRoom: false, lastCalm: -1, saidLost: false, flash: 0, flashImg: null, sinceFlash: 0, band: 0, caughtImg: null,
      });
      $('#maze-hint').textContent = coarse
        ? 'dedo izquierdo: caminar · dedo derecho: mirar'
        : 'W/↑ caminar · A/D o ←/→ voltear · o arrastra con el mouse';
      Amb.start();
      const title = $('#maze-title');
      title.classList.remove('show');
      void title.offsetWidth;
      title.classList.add('show');
      setTimeout(() => say('encuentra la salida.', 2200), 2600);
      return new Promise((r) => {
        done = r;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      });
    },
    _st: st,
    _info: () => ({ path, exit, room, GW, grid, faces: [...faceTex.keys()], mannequins }),
  };
})();

/* =========================================================
   SCREAMER
   ========================================================= */
async function screamer() {
  const cv = $('#scream'), x = cv.getContext('2d');
  cv.width = Math.min(innerWidth, 900);
  cv.height = Math.round((cv.width * innerHeight) / innerWidth);
  setOsd(false);
  A.scream(1.05);
  if (navigator.vibrate) navigator.vibrate([80, 30, 300, 30, 500]);
  await sleep(40); // el sonido llega un pelito antes que la imagen
  cv.classList.add('on', 'inv');
  const t0 = performance.now(), D = 880;
  const imgs = CONFIG.screamer.map((s) => IMGS[s]).filter(Boolean);
  setTimeout(() => cv.classList.remove('inv'), 70);
  let lastDraw = 0;
  await new Promise((res) => {
    (function f(t) {
      const k = (t - t0) / D;
      if (k >= 1) return res();
      if (t - lastDraw < 66) return requestAnimationFrame(f); // entrecortado, ~15 cuadros
      lastDraw = t;
      const w = cv.width, h = cv.height;
      x.fillStyle = '#000';
      x.fillRect(0, 0, w, h);
      if (imgs.length) {
        const img = imgs[Math.min(imgs.length - 1, Math.floor(k * imgs.length))];
        const s = Math.max(w / img.naturalWidth, h / img.naturalHeight) * (1 + k * 0.7 + (Math.random() - 0.5) * 0.05);
        const iw = img.naturalWidth * s, ih = img.naturalHeight * s;
        x.drawImage(img, (w - iw) / 2 + (Math.random() - 0.5) * 30, (h - ih) / 2 + (Math.random() - 0.5) * 30, iw, ih);
      }
      for (let i = 0; i < 6; i++) {
        const sy = Math.random() * h, sh = 4 + Math.random() * 28;
        x.drawImage(cv, 0, sy, w, sh, (Math.random() - 0.5) * 60, sy, w, sh);
      }
      x.globalCompositeOperation = 'multiply';
      x.fillStyle = Math.random() < 0.6 ? `rgb(255,${110 + Math.random() * 60},${100 + Math.random() * 40})` : '#c8d0d8';
      x.fillRect(0, 0, w, h);
      x.globalCompositeOperation = 'source-over';
      x.globalAlpha = 0.28;
      x.drawImage(grain, 0, 0, w, h);
      x.globalAlpha = 1;
      requestAnimationFrame(f);
    })(t0);
  });
  cv.classList.remove('on');
  x.clearRect(0, 0, cv.width, cv.height);
}

/* =========================================================
   LA ROLA
   ========================================================= */
function reveal() {
  show('s-reveal');
  store.set('lm_visto', '1');
  setOsd(true, 'PLAY ▶');
  $('#rv-song').textContent = CONFIG.cancion;
  $('#rv-artist').textContent = CONFIG.artista;
  $('#rv-prod').textContent = CONFIG.productor;
  $('#rv-date').textContent = CONFIG.fecha;
  document.title = `${CONFIG.cancion} · ${CONFIG.artista}`;
  const nav = $('#rv-links');
  nav.innerHTML = '';
  CONFIG.links.filter((l) => l.url && l.url !== '#').forEach((l) => {
    const a = document.createElement('a');
    a.textContent = l.label;
    if (l.url && l.url !== '#') { a.href = l.url; a.target = '_blank'; a.rel = 'noopener'; }
    else a.setAttribute('aria-disabled', 'true');
    nav.appendChild(a);
  });

  const song = $('#song'), pp = $('#b-pp');
  song.src = CONFIG.audio;
  A.connectSong(song);
  const setPP = () => {
    pp.textContent = song.paused ? '▶ PLAY' : '❚❚ PAUSA';
    $('#osd-play').textContent = song.paused ? 'PAUSE ❚❚' : 'PLAY ▶';
  };
  song.addEventListener('play', setPP);
  song.addEventListener('pause', setPP);
  song.addEventListener('error', () => { $('#rv-err').hidden = false; });
  // solo es un avance de 45 s: al terminar, se corta como cinta
  song.addEventListener('ended', () => { $('#rv-end').hidden = false; tear(); A.burst(350, 0.4); });
  song.addEventListener('play', () => { $('#rv-end').hidden = true; });
  pp.onclick = () => { A.ctx.resume(); song.paused ? song.play().catch(() => {}) : song.pause(); };
  $('#b-rew').onclick = () => { song.pause(); location.reload(); };
  $('.tape-bar').onclick = (e) => {
    if (!song.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    song.currentTime = ((e.clientX - r.left) / r.width) * song.duration;
  };
  song.play().catch(() => {}).finally(setPP);
  A.setBase(0.012);

  const sc = $('#scope'), sx = sc.getContext('2d'), buf = new Uint8Array(2048);
  (function draw() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    const w = (sc.clientWidth * dpr) | 0, h = (sc.clientHeight * dpr) | 0;
    if (sc.width !== w || sc.height !== h) { sc.width = w; sc.height = h; }
    sx.fillStyle = 'rgba(0,0,0,.32)';
    sx.fillRect(0, 0, w, h);
    sx.strokeStyle = '#a8ffbe'; sx.lineWidth = 2 * dpr; sx.shadowColor = '#5dff8a'; sx.shadowBlur = 10 * dpr;
    sx.beginPath();
    const live = A.an && !song.paused;
    if (live) A.an.getByteTimeDomainData(buf);
    const n = 512;
    for (let i = 0; i < n; i++) {
      const v = live ? (buf[i * 4] - 128) / 128
        : song.paused ? (Math.random() - 0.5) * 0.03 : Math.sin(i / 9 + performance.now() / 120) * 0.25 * Math.random() + (Math.random() - 0.5) * 0.1;
      const px = (i / (n - 1)) * w, py = h / 2 + v * h * 0.44;
      i ? sx.lineTo(px, py) : sx.moveTo(px, py);
    }
    sx.stroke();
    sx.shadowBlur = 0;
    if (song.duration) $('#tape-fill').style.width = (song.currentTime / song.duration) * 100 + '%';
    requestAnimationFrame(draw);
  })();
}

/* =========================================================
   FLUJO
   ========================================================= */
async function run() {
  A.init();
  await A.ctx.resume();
  setOsd(true, 'PLAY ▶');
  A.thump(90, 0.4);
  await snow(350, 0.5);
  await sceneBars();
  await snow(200);
  await sceneCard();
  await snow(250);
  await playTape();
  await snow(300, 0.5);
  await sceneBoot();
  await snow(150, 0.4);
  show('s-maze');
  await Maze.run();
  await screamer();
  show('none');
  await sleep(1200);
  A.thump(90, 0.3);
  await snow(400, 0.35);
  reveal();
}

if (store.get('lm_visto')) $('#b-skip').hidden = false;
$('#b-start').addEventListener('click', run, { once: true });
$('#b-skip').addEventListener('click', async () => {
  A.init();
  await A.ctx.resume();
  await snow(500, 0.4);
  reveal();
}, { once: true });
