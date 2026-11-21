/**
 * Art library for SECOND GLANCE spot‑the‑difference game.
 * Provides deterministic SVG fragment generators used by scene painters.
 * All functions return a string containing SVG markup (no DOM manipulation).
 */

/**
 * Helper to generate <defs> with gradient and filter definitions.
 * @param {string} prefix Unique id prefix for this scene panel.
 * @param {object} palette Colour stop definitions, e.g.
 *   { sky: ['#a0c4ff', '#c0e0ff'], sea: ['#005f73', '#0a9396'], ground: ['#7a6e5b', '#c2b280'] }
 * @returns {string} SVG <defs> block.
 */
export function defs(prefix, palette) {
  let out = "<defs>";
  for (const [key, val] of Object.entries(palette)) {
    if (!Array.isArray(val) || val.length < 2) continue;
    const mid = val.length > 2 ? `<stop offset="50%" stop-color="${val[1]}"/>` : "";
    const last = val[val.length - 1];
    out += `<linearGradient id="${prefix}-${key}" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${val[0]}"/>${mid}<stop offset="100%" stop-color="${last}"/></linearGradient>`;
  }
  const glowSrc = palette.glow || palette.sun || ["#fff2b0", "#ffd76a"];
  out += `<radialGradient id="${prefix}-sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${glowSrc[0]}"/><stop offset="100%" stop-color="${glowSrc[1]}" stop-opacity="0"/></radialGradient>`;
  out += `<filter id="${prefix}-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  out += "</defs>";
  return out;
}
/** Soft ground shadow ellipse */
export function groundShadow(cx, cy, rx, ry, colour = 'rgba(0,0,0,0.3)') {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${colour}" filter="url(#shadow)"/>`;
}

/** Highlight sheen ellipse */
export function highlight(cx, cy, rx, ry, opacity = 0.2) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="white" fill-opacity="${opacity}"/>`;
}

/** Cloud painter – position (x,y), scale, and colour options */
export function cloud(x, y, scale = 1, colour = '#ffffff') {
  const w = 120 * scale;
  const h = 80 * scale;
  const cx = x;
  const cy = y;
  return `
    <g transform="translate(${cx - w/2},${cy - h/2})" filter="url(#cloud-shadow)">
      <ellipse cx="${w*0.3}" cy="${h*0.5}" rx="${w*0.3}" ry="${h*0.25}" fill="${colour}"/>
      <ellipse cx="${w*0.5}" cy="${h*0.4}" rx="${w*0.35}" ry="${h*0.3}" fill="${colour}"/>
      <ellipse cx="${w*0.7}" cy="${h*0.55}" rx="${w*0.28}" ry="${h*0.22}" fill="${colour}"/>
    </g>
  `.trim();
}

/** Star painter – five‑point star with glow */
export function star(x, y, size = 30, colour = '#ffd700') {
  const points = [];
  for (let i = 0; i < 5; i++) {
    const angle = (i * 72 - 90) * Math.PI / 180;
    const outerX = x + Math.cos(angle) * size;
    const outerY = y + Math.sin(angle) * size;
    points.push(`${outerX},${outerY}`);
    const innerAngle = angle + Math.PI / 5;
    const innerX = x + Math.cos(innerAngle) * (size * 0.5);
    const innerY = y + Math.sin(innerAngle) * (size * 0.5);
    points.push(`${innerX},${innerY}`);
  }
  const path = points.join(' ');
  return `
    <polygon points="${path}" fill="${colour}" filter="url(#star-glow)"/>
  `.trim();
}

/** Lantern painter – paper lantern with ribs and halo */
export function lantern(x, y, scale = 1, colour = '#ffb347') {
  const w = 60 * scale;
  const h = 80 * scale;
  const ribs = 6;
  const ribLines = [];
  for (let i = 0; i <= ribs; i++) {
    const xi = x - w/2 + (i * w) / ribs;
    ribLines.push(`<line x1="${xi}" y1="${y - h/2}" x2="${xi}" y2="${y + h/2}" stroke="${colour}" stroke-width="1"/>`);
  }
  return `
    <g filter="url(#lantern-glow)">
      <ellipse cx="${x}" cy="${y}" rx="${w/2}" ry="${h/2}" fill="${colour}"/>`
      + ribLines.join('\n') + `
    </g>
  `.trim();
}

/** Pine tree painter – optional snow cap */
export function pineTree(x, y, scale = 1, colour = '#2e8b57', snow = false) {
  const h = 120 * scale;
  const w = 80 * scale;
  const trunkHeight = h * 0.2;
  const trunkWidth = w * 0.2;
  const foliage = [];
  for (let i = 0; i < 3; i++) {
    const levelY = y - h/2 + i * (h/3);
    const levelW = w - i * (w/3);
    foliage.push(`<polygon points="${x},${levelY} ${x - levelW/2},${levelY + h/3} ${x + levelW/2},${levelY + h/3}" fill="${colour}"/>`);
  }
  const trunk = `<rect x="${x - trunkWidth/2}" y="${y + h/2 - trunkHeight}" width="${trunkWidth}" height="${trunkHeight}" fill="#8b5a2b"/>`;
  const snowCap = snow ? `<polygon points="${x},${y - h/2} ${x - w/4},${y - h/2 + 15} ${x + w/4},${y - h/2 + 15}" fill="white"/>` : '';
  return `
    <g>
      ${foliage.join('\n')}
      ${trunk}
      ${snowCap}
    </g>
  `.trim();
}

/** Simple house painter */
export function house(x, y, scale = 1, colour = '#d2691e') {
  const w = 100 * scale;
  const h = 80 * scale;
  const roofHeight = h * 0.5;
  const body = `<rect x="${x - w/2}" y="${y - h/2}" width="${w}" height="${h}" fill="${colour}"/>`;
  const roof = `<polygon points="${x - w/2},${y - h/2} ${x + w/2},${y - h/2} ${x},${y - h/2 - roofHeight}" fill="#8b0000"/>`;
  const window = `<rect x="${x - w/4 - 5}" y="${y - h/4 - 5}" width="10" height="10" fill="yellow"/>`;
  const door = `<rect x="${x + w/4 - 5}" y="${y + h/4 - 10}" width="10" height="20" fill="#654321"/>`;
  return `
    <g>
      ${body}
      ${roof}
      ${window}
      ${door}
    </g>
  `.trim();
}

/** Sailboat painter – hull shadow and sail */
export function sailboat(x, y, scale = 1, hullColour = '#556b2f', sailColour = '#ffffff') {
  const hullWidth = 80 * scale;
  const hullHeight = 20 * scale;
  const hull = `<ellipse cx="${x}" cy="${y}" rx="${hullWidth/2}" ry="${hullHeight/2}" fill="${hullColour}" filter="url(#boat-shadow)"/>`;
  const mastHeight = 60 * scale;
  const mast = `<line x1="${x}" y1="${y - hullHeight/2}" x2="${x}" y2="${y - hullHeight/2 - mastHeight}" stroke="${hullColour}" stroke-width="2"/>`;
  const sail = `<polygon points="${x},${y - hullHeight/2 - mastHeight} ${x},${y - hullHeight/2} ${x + hullWidth/2},${y - hullHeight/2}" fill="${sailColour}"/>`;
  return `
    <g>
      ${hull}
      ${mast}
      ${sail}
    </g>
  `.trim();
}

/** Wave painter – rolling lines with sparkle */
export function wave(x, y, length = 120, amplitude = 10, segment = 6, colour = '#1e90ff') {
  const path = [];
  for (let i = 0; i <= segment; i++) {
    const xi = x + (i * length) / segment;
    const yi = y + ((i % 2 === 0) ? -amplitude : amplitude);
    path.push(`${xi},${yi}`);
  }
  const d = path.map((p, i) => i === 0 ? `M ${p}` : `L ${p}`).join(' ');
  const sparkle = `<circle cx="${x + length*0.25}" cy="${y - amplitude}" r="2" fill="white"/>`;
  return `
    <path d="${d}" stroke="${colour}" stroke-width="2" fill="none"/>${sparkle}
  `.trim();
}

/** Crescent moon painter */
export function moon(x, y, radius = 40, colour = '#fdfd96') {
  const outer = `<circle cx="${x}" cy="${y}" r="${radius}" fill="${colour}"/>`;
  const inner = `<circle cx="${x - radius*0.4}" cy="${y - radius*0.2}" r="${radius}" fill="#16224d"/>`;
  return `${outer}${inner}`;
}

/** Clock face painter */
export function clock(x, y, radius = 30, hour = 3, minute = 15, rimColour = '#333', handColour = '#000') {
  const rim = `<circle cx="${x}" cy="${y}" r="${radius}" fill="none" stroke="${rimColour}" stroke-width="2"/>`;
  const hourAngle = (hour % 12) * 30 - 90;
  const minuteAngle = (minute % 60) * 6 - 90;
  const hx = x + Math.cos(hourAngle * Math.PI/180) * radius * 0.5;
  const hy = y + Math.sin(hourAngle * Math.PI/180) * radius * 0.5;
  const mx = x + Math.cos(minuteAngle * Math.PI/180) * radius * 0.8;
  const my = y + Math.sin(minuteAngle * Math.PI/180) * radius * 0.8;
  const hourHand = `<line x1="${x}" y1="${y}" x2="${hx}" y2="${hy}" stroke="${handColour}" stroke-width="3"/>`;
  const minuteHand = `<line x1="${x}" y1="${y}" x2="${mx}" y2="${my}" stroke="${handColour}" stroke-width="2"/>`;
  return `${rim}${hourHand}${minuteHand}`;
}

/** Brass gear painter */
export function gear(x, y, radius = 30, teeth = 8, colour = '#b8860b') {
  const path = [];
  const step = (2 * Math.PI) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const outerX = x + Math.cos(a) * radius;
    const outerY = y + Math.sin(a) * radius;
    const innerX = x + Math.cos(a + step/2) * (radius * 0.7);
    const innerY = y + Math.sin(a + step/2) * (radius * 0.7);
    path.push(`${outerX},${outerY}`);
    path.push(`${innerX},${innerY}`);
  }
  const d = path.map((p, i) => i === 0 ? `M ${p}` : `L ${p}`).join(' ') + ' Z';
  return `<path d="${d}" fill="${colour}"/>`;
}

/** Coral branch painter */
export function coral(x, y, scale = 1, colour = '#ff7f50') {
  const s = 40 * scale;
  const path = `M ${x} ${y} q ${s*0.2} -${s*0.5} ${s} 0 q ${s*0.2} ${s*0.3} ${s*0.5} ${s*0.5}`;
  return `<path d="${path}" stroke="${colour}" stroke-width="4" fill="none"/>`;
}

/** Fish painter */
export function fish(x, y, scale = 1, colour = '#ff1493') {
  const w = 60 * scale;
  const h = 30 * scale;
  const body = `<ellipse cx="${x}" cy="${y}" rx="${w/2}" ry="${h/2}" fill="${colour}"/>`;
  const tail = `<polygon points="${x - w/2},${y} ${x - w/2 - w*0.2},${y - h/4} ${x - w/2 - w*0.2},${y + h/4}" fill="${colour}"/>`;
  const eye = `<circle cx="${x + w*0.2}" cy="${y - h*0.1}" r="${h*0.08}" fill="white"/>`;
  const pupil = `<circle cx="${x + w*0.2}" cy="${y - h*0.1}" r="${h*0.04}" fill="black"/>`;
  return `${body}${tail}${eye}${pupil}`;
}

/** Bubble painter */
export function bubble(x, y, radius = 15, colour = 'rgba(173,216,230,0.5)') {
  const circle = `<circle cx="${x}" cy="${y}" r="${radius}" fill="${colour}" stroke="white" stroke-width="1"/>`;
  const highlight = `<circle cx="${x - radius*0.3}" cy="${y - radius*0.3}" r="${radius*0.2}" fill="white" fill-opacity="0.6"/>`;
  return `${circle}${highlight}`;
}

/** Mountain silhouette painter */
export function mountain(x, y, width = 200, height = 120, colour = '#2f4f4f') {
  const path = `<polygon points="${x - width/2},${y} ${x},${y - height} ${x + width/2},${y}" fill="${colour}"/>`;
  return path;
}

/** Bunting flag painter */
export function bunting(x1, y1, x2, y2, count = 5, colour = '#ff69b4') {
  const dx = (x2 - x1) / (count + 1);
  const flags = [];
  for (let i = 1; i <= count; i++) {
    const fx = x1 + dx * i;
    const fy = y1 + (y2 - y1) * i / (count + 1);
    const flag = `<polygon points="${fx},${fy} ${fx+10},${fy-5} ${fx+10},${fy+5}" fill="${colour}"/>`;
    flags.push(flag);
  }
  return flags.join('\n');
}

/** Steam curl painter */
export function steam(x, y, length = 40, curls = 3, colour = '#d3d3d3') {
  const paths = [];
  for (let i = 0; i < curls; i++) {
    const cx = x + i * 5;
    const cy = y - i * 5;
    const d = `M ${cx} ${cy} q 5 -10 10 0 q 5 10 10 0`;
    paths.push(`<path d="${d}" stroke="${colour}" fill="none" stroke-width="2"/>`);
  }
  return paths.join('\n');
}

/** Vignette helper – darken corners */
export function vignette(prefix) {
  return `
    <defs>
      <radialGradient id="${prefix}-vignette" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
        <stop offset="0%" stop-color="transparent"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.5)"/>
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="620" height="620" fill="url(#${prefix}-vignette)"/>`
  .trim();
}
