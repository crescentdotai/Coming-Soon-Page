import { useEffect, useRef } from "react";

const STEP = 4; // horizontal resolution of the text mask, px
const INK = "#090909";
const ORANGE = "#ec3503";
const MAGENTA = "#ee20e1";
const FONT = '"Archivo", "Arial Black", sans-serif';

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// Rasterises the headline once, then samples it per scan-line so each row
// knows which x-ranges become thick "ink" bars instead of hairlines.
function buildLayout(W, H, lines) {
  const top = clamp(H * 0.085, 56, 88);
  const spacing = clamp(Math.round((H - top) / 56), 11, 18);
  const rowCount = Math.floor((H - top) / spacing);

  const mask = document.createElement("canvas");
  mask.width = W;
  mask.height = H;
  const c = mask.getContext("2d", { willReadFrequently: true });
  c.textAlign = "center";
  c.textBaseline = "alphabetic";

  c.font = `900 100px ${FONT}`;
  const widest = Math.max(...lines.map((l) => c.measureText(l).width));
  const cap100 = c.measureText("H").actualBoundingBoxAscent;
  const gapRatio = 0.3;
  const fitW = (W * 0.745 * 100) / widest;
  const fitH =
    ((H - top) * 0.7 * 100) / (cap100 * (lines.length + gapRatio * (lines.length - 1)));
  const fs = Math.min(fitW, fitH);

  const cap = (cap100 * fs) / 100;
  const gap = cap * gapRatio;
  const block = cap * lines.length + gap * (lines.length - 1);
  let baseline = top + (H - top) * 0.52 - block / 2 + cap;

  c.font = `900 ${fs}px ${FONT}`;
  const centers = [];
  for (const line of lines) {
    c.fillText(line, W / 2, baseline);
    centers.push(baseline - cap / 2);
    baseline += cap + gap;
  }

  const px = c.getImageData(0, 0, W, H).data;
  const cols = Math.ceil(W / STEP) + 1;
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    const y = top + (i + 0.5) * spacing;
    const yi = clamp(Math.round(y), 0, H - 1);
    const hits = new Uint8Array(cols);
    let any = false;
    for (let j = 0; j < cols; j++) {
      const x = Math.min(j * STEP, W - 1);
      if (px[(yi * W + x) * 4 + 3] > 127) {
        hits[j] = 1;
        any = true;
      }
    }
    rows.push({ y, hits: any ? hits : null });
  }

  return { rows, cols, bar: spacing - 2, centers };
}

function render(ctx, L, W, H, p) {
  ctx.clearRect(0, 0, W, H);

  const sx = Math.max(100, W * 0.1);
  const sy = Math.max(60, H * 0.075);
  const amp = H * 0.065;
  const live = p.s > 0.002;

  // Lines are pushed away from the cursor along y; the hypot term keeps the
  // row under the cursor from snapping between "up" and "down".
  const shift = (x, y) => {
    if (!live) return 0;
    const dx = x - p.x;
    const dy = y - p.y;
    const g = Math.exp(-(dx * dx) / (2 * sx * sx) - (dy * dy) / (2 * sy * sy));
    return (dy / Math.hypot(dy, 14)) * amp * p.s * g;
  };

  // Ink bars near the cursor switch to the brand colours in concentric bands
  const colorAt = (x, y) => {
    if (p.s < 0.15) return INK;
    const r = Math.hypot((x - p.x) / sx, (y - p.y) / sy) / p.s;
    if (r < 0.45) return "#fff";
    if (r < 0.95) return MAGENTA;
    if (r < 1.45) return ORANGE;
    return INK;
  };

  ctx.lineWidth = 1;
  ctx.strokeStyle = INK;
  ctx.beginPath();
  for (const row of L.rows) {
    ctx.moveTo(0, row.y + shift(0, row.y));
    for (let x = 8; x < W + 8; x += 8) {
      const xx = Math.min(x, W);
      ctx.lineTo(xx, row.y + shift(xx, row.y));
    }
  }
  ctx.stroke();

  const half = L.bar / 2;
  const fillPiece = (pts, color) => {
    if (pts.length < 2) return;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let k = 1; k < pts.length; k++) ctx.lineTo(pts[k][0], pts[k][1]);
    for (let k = pts.length - 1; k >= 0; k--) ctx.lineTo(pts[k][0], pts[k][2]);
    ctx.closePath();
    ctx.fill();
  };

  for (const row of L.rows) {
    if (!row.hits) continue;
    let pts = [];
    let color = null;
    for (let j = 0; j <= L.cols; j++) {
      if (j === L.cols || !row.hits[j]) {
        fillPiece(pts, color);
        pts = [];
        color = null;
        continue;
      }
      const x = Math.min(j * STEP, W);
      const d = shift(x, row.y);
      const pt = [x, row.y + d - half, row.y + d + half];
      const col = colorAt(x, row.y);
      if (color !== null && col !== color) {
        pts.push(pt); // shared edge so colour bands butt up without a seam
        fillPiece(pts, color);
        pts = [];
      }
      color = col;
      pts.push(pt);
    }
  }
}

export default function LineField({ lines = ["COMING", "SOON"] }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const s = { L: null, W: 0, H: 0, dirty: true, userActive: false, ready: false };
    const p = { x: 0, y: 0, tx: 0, ty: 0, s: 0, ts: 0 };
    const start = performance.now();
    let raf = 0;
    let timer = 0;
    let disposed = false;

    const layout = () => {
      if (!s.ready) return;
      const r = wrap.getBoundingClientRect();
      const W = Math.round(r.width);
      const H = Math.round(r.height);
      if (!W || !H) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      Object.assign(s, { W, H, L: buildLayout(W, H, lines), dirty: true });
    };

    // Rebuild the text mask at a throttled rate while the window resizes
    const scheduleLayout = () => {
      if (timer) return;
      timer = window.setTimeout(() => {
        timer = 0;
        layout();
      }, 70);
    };

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (!s.L) return;

      if (!reduceMotion) {
        // One intro sweep so touch devices (no hover) see the effect too
        if (!s.userActive) {
          const t = (now - start - 600) / 4200;
          if (t >= 0 && t < 1) {
            const [first, last] = [s.L.centers[0], s.L.centers[s.L.centers.length - 1]];
            p.tx = s.W * (0.16 + 0.68 * t);
            p.ty = first + (last - first) * (0.5 - 0.5 * Math.cos(t * Math.PI * 3));
            p.ts = t < 0.88 ? 1 : 0;
          }
        }
        if (p.s < 0.01 && p.ts > 0) {
          p.x = p.tx;
          p.y = p.ty;
        }
        p.x += (p.tx - p.x) * 0.16;
        p.y += (p.ty - p.y) * 0.16;
        p.s += (p.ts - p.s) * 0.09;
        if (Math.abs(p.ts - p.s) < 0.002) p.s = p.ts;
      }

      const moving =
        Math.abs(p.tx - p.x) > 0.2 || Math.abs(p.ty - p.y) > 0.2 || p.s !== p.ts;
      if (moving || s.dirty) {
        render(ctx, s.L, s.W, s.H, p);
        s.dirty = false;
      }
    };

    const onMove = (e) => {
      if (reduceMotion) return;
      const r = wrap.getBoundingClientRect();
      s.userActive = true;
      p.tx = e.clientX - r.left;
      p.ty = e.clientY - r.top;
      p.ts = 1;
    };
    const onLeave = () => {
      p.ts = 0;
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    const ro = new ResizeObserver(scheduleLayout);
    ro.observe(wrap);

    document.fonts
      .load(`900 100px ${FONT}`)
      .catch(() => {})
      .then(() => {
        if (disposed) return;
        s.ready = true;
        layout();
        raf = requestAnimationFrame(tick);
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      ro.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, [lines]);

  return <canvas ref={canvasRef} className="line-field" aria-hidden="true" />;
}
