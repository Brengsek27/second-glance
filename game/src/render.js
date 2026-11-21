// Render utilities
export function panelSVG(scene, side, mutSet) {
  const svg = scene.draw(mutSet);
  if (side === "right") {
    return `<svg viewBox="0 0 620 620" xmlns="http://www.w3.org/2000/svg">` +
      svg.replace(/id="${scene.id}-/g, `id="${scene.id}R-`).replace(/url\(#${scene.id}-/g, `url(#${scene.id}R-`) + `</svg>`;
  }
  return `<svg viewBox="0 0 620 620" xmlns="http://www.w3.org/2000/svg">` + svg + `</svg>`;
}
export function markerSVG(diff) {
  const R = Math.max(14, Math.min(46, diff.r));
  return `<g transform="translate(${diff.x},${diff.y})">` +
    `<circle fill="#f5c542" opacity="0.12" r="${R}" />` +
    `<circle fill="none" stroke="#f5c542" stroke-width="3" r="${R}" />` +
    `<circle fill="none" stroke="#ffffff" stroke-width="1.5" r="${R-4}" />` +
    `<circle cx="${R*0.72}" cy="${-R*0.72}" r="8" fill="#2ecc71" />` +
    `<path d="M${R*0.72-3},${-R*0.72} l2,2 l4,-4" fill="none" stroke="#ffffff" stroke-width="2"/>` +
    `</g>`;
}
export function pulseSVG(diff) {
  return `<g>` +
    `<circle cx="${diff.x}" cy="${diff.y}" fill="none" stroke="#ffd76a" stroke-width="3" r="${diff.r}">` +
      `<animate attributeName="r" from="${diff.r}" to="${diff.r+26}" dur="1.6s" repeatCount="indefinite"/>` +
      `<animate attributeName="opacity" from="0.9" to="0" dur="1.6s" repeatCount="indefinite"/>` +
    `</circle>` +
    `</g>`;
}
export function lensSVG(x, y) {
  const r = 46;
  const circle = `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,0.06)" stroke="#c9a227" stroke-width="7"/>`;
  const highlight = `<path d="M${x - r * 0.7},${y - r * 0.7} A${r},${r} 0 0,1 ${x},${y - r}" fill="none" stroke="#ffffff" opacity="0.35"/>`;
  const handle = `<line x1="${x + 34}" y1="${y + 34}" x2="${x + 58}" y2="${y + 58}" stroke="#c9a227" stroke-width="9" stroke-linecap="round"/>`;
  return `<g>${circle}${highlight}${handle}</g>`;
}

export function crosshairSVG(x, y) {
  const circle = `<circle cx="${x}" cy="${y}" r="12" fill="none" stroke="#ffd76a" stroke-width="2"/>`;
  const ticks = [
    `<line x1="${x}" y1="${y - 16}" x2="${x}" y2="${y - 23}" stroke="#ffd76a" stroke-width="2"/>`,
    `<line x1="${x}" y1="${y + 16}" x2="${x}" y2="${y + 23}" stroke="#ffd76a" stroke-width="2"/>`,
    `<line x1="${x - 16}" y1="${y}" x2="${x - 23}" y2="${y}" stroke="#ffd76a" stroke-width="2"/>`,
    `<line x1="${x + 16}" y1="${y}" x2="${x + 23}" y2="${y}" stroke="#ffd76a" stroke-width="2"/>`
  ].join('');
  return `<g class="crosshair">${circle}${ticks}</g>`;
}
