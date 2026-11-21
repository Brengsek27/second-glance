// Tiny WebAudio module for SECOND GLANCE
let ctx = null;
let muted = false;
function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}
function play(freq, duration = 0.2, type = 'sine') {
  if (muted) return;
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(0.5, c.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}
export const sfx = {
  muted,
  toggle() { sfx.muted = !sfx.muted; },
  find() { play(880, 0.15, 'triangle'); },
  wrong() { play(110, 0.3, 'sawtooth'); },
  hint() { play(660, 0.2, 'square'); },
  win() { play(440, 0.5, 'sine'); },
  tick() { play(1200, 0.05, 'sine'); },
};
// Add sceneComplete jingle
sfx.sceneComplete = function() {
  // small three‑note ascending jingle
  const notes = [440, 554, 660];
  notes.forEach((freq, i) => {
    setTimeout(() => play(freq, 0.15, 'sine'), i * 200);
  });
};
