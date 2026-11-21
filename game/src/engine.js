import { SCENES, DIFF_TOTAL } from "./scenes.js";
import { panelSVG, markerSVG, pulseSVG, lensSVG, crosshairSVG } from "./render.js";
import { readShot } from "./shots.js";
import { sfx } from "./audio.js";

const state = {
  sceneIndex: 0,
  found: new Set(),
  strikes: 0,
  hintsLeft: 3,
  score: 0,
  streak: 0,
  bestStreak: 0,
  timeLeft: 0,
  parTotal: 0,
  timerId: null,
  paused: false,
  over: false,
  shotMode: false,
  pulseId: null,
  lensPos: null,
  crossPos: { x: 310, y: 310 },
  crossOn: false,
  bestStars: [0, 0, 0, 0, 0],
  unlocked: 1,
};

const el = (id) => document.getElementById(id);
const OVERLAYS = [
  "overlay-title",
  "overlay-scene-select",
  "overlay-pause",
  "overlay-scene-complete",
  "overlay-campaign-complete",
];
function showOverlay(idOrNull) {
  OVERLAYS.forEach((id) => {
    const node = el(id);
    if (!node) return;
    if (idOrNull === id) {
      node.classList.remove("hidden");
      node.style.display = "flex";
    } else {
      node.classList.add("hidden");
      node.style.display = "none";
    }
  });
}

function scene() {
  return SCENES[state.sceneIndex];
}

function updateHUD() {
  const sc = scene();
  el("scene-name").textContent = sc.name;
  el("scene-caption").textContent = `Scene ${state.sceneIndex + 1} of 5`;
  el("counter").textContent = `${8 - state.found.size} TO FIND`;
  const mins = Math.floor(state.timeLeft / 60);
  const secs = String(state.timeLeft % 60).padStart(2, "0");
  el("timer").textContent = `${mins}:${secs}`;
  el("score").textContent = state.score;
  el("streak").textContent = state.streak;
  const pct = state.parTotal
    ? Math.max(0, Math.min(100, (state.timeLeft / state.parTotal) * 100))
    : 0;
  el("pressure-bar").style.width = `${pct}%`;
  for (let i = 1; i <= 8; i++) {
    const pip = el(`pip-${i}`);
    if (pip) pip.classList.toggle("on", i <= state.found.size);
  }
  el("hint-btn").textContent = `Hint (${state.hintsLeft})`;
}

function setMessage(t) {
  el("message-line").textContent = t;
}

function renderPanels() {
  const sc = scene();
  // left (original)
  const originalContainer = el("original-container");
  originalContainer.innerHTML = panelSVG(sc, "left", new Set());
  // right (spot)
  const spotContainer = el("spot-container");
  spotContainer.innerHTML = panelSVG(sc, "right", new Set(sc.differences.map((d) => d.id)));

  [originalContainer, spotContainer].forEach((container, idx) => {
    const svg = container.querySelector("svg");
    if (!svg) return;
    // insert found markers
    state.found.forEach((id) => {
      const diff = sc.differences.find((d) => d.id === id);
      if (diff) {
        svg.insertAdjacentHTML("beforeend", markerSVG(diff));
        if (state.pulseId === id) {
          svg.insertAdjacentHTML("beforeend", pulseSVG(diff));
        }
      }
    });
    // lens on spot side only
    if (idx === 1 && state.lensPos) {
      svg.insertAdjacentHTML("beforeend", lensSVG(state.lensPos.x, state.lensPos.y));
    }
    // crosshair on spot side only
    if (idx === 1 && state.crossOn) {
      svg.insertAdjacentHTML("beforeend", crosshairSVG(state.crossPos.x, state.crossPos.y));
    }
  });
}

function startScene(i) {
  state.sceneIndex = i;
  state.found = new Set();
  state.strikes = 0;
  state.hintsLeft = 3;
  state.over = false;
  state.paused = false;
  state.pulseId = null;
  state.parTotal = scene().par + 45;
  state.timeLeft = state.parTotal;
  showOverlay(null);
  renderPanels();
  updateHUD();
  setMessage("Find the 8 differences — click a picture when you spot one.");
  clearInterval(state.timerId);
  state.timerId = setInterval(tick, 1000);
}

export { startScene, updateHUD, renderPanels, setMessage, showOverlay, state, scene, el };

function tick() {
  if (state.paused || state.over || state.shotMode) return;
  state.timeLeft -= 1;
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    updateHUD();
    loseScene("Time up");
    return;
  }
  updateHUD();
}

function loseScene(reason) {
  state.over = true;
  clearInterval(state.timerId);
  sfx.wrong();
  setMessage(reason + " - this scene is lost. Pick a scene to try again.");
  buildSceneSelect();
  showOverlay("overlay-scene-select");
}

function panelPoint(evt, container) {
  const svg = container.querySelector("svg");
  const rect = svg.getBoundingClientRect();
  return {
    x: (evt.clientX - rect.left) / rect.width * 620,
    y: (evt.clientY - rect.top) / rect.height * 620
  };
}

function tryMark(x, y) {
  if (state.over || state.paused) return;
  let best = null;
  let bestDist = Infinity;
  for (const d of scene().differences) {
    if (state.found.has(d.id)) continue;
    const dist = Math.hypot(d.x - x, d.y - y);
    if (dist <= d.r && dist < bestDist) {
      best = d;
      bestDist = dist;
    }
  }
  if (!best) {
    sfx.wrong();
    state.streak = 0;
    state.strikes += 1;
    state.timeLeft = Math.max(0, state.timeLeft - 5);
    setMessage("Not there - strike " + state.strikes + " of 3, five seconds gone.");
    updateHUD();
    if (state.strikes >= 3) loseScene("Three strikes");
    return;
  }
  state.found.add(best.id);
  state.streak += 1;
  state.bestStreak = Math.max(state.bestStreak, state.streak);
  state.score += 100 + 10 * (state.streak - 1);
  sfx.find();
  setMessage("Found - " + best.label + "!");
  renderPanels();
  updateHUD();
  if (state.found.size === scene().differences.length) completeScene();
}

[el("original-container"), el("spot-container")].forEach((container) => {
  container.addEventListener("click", (evt) => {
    const p = panelPoint(evt, container);
    tryMark(p.x, p.y);
  });
});
function useHint() {
  if (state.over || state.paused || state.hintsLeft <= 0) return;
  const remaining = scene().differences.filter((d) => !state.found.has(d.id));
  if (!remaining.length) return;
  const diff = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft -= 1;
  state.timeLeft = Math.max(0, state.timeLeft - 10);
  state.pulseId = diff.id;
  sfx.hint();
  setMessage("The air shimmers near a difference...");
  renderPanels();
  updateHUD();
  setTimeout(() => {
    state.pulseId = null;
    renderPanels();
  }, 2500);
}
el("hint-btn").addEventListener("click", useHint);

function togglePause(force) {
  const target = typeof force === "boolean" ? force : !state.paused;
  if (state.over) return;
  state.paused = target;
  if (state.paused) showOverlay("overlay-pause");
  else showOverlay(null);
}
el("pause-btn").addEventListener("click", () => togglePause());
el("resume-btn").addEventListener("click", () => togglePause(false));

el("sound-btn").addEventListener("click", () => {
  const muted = sfx.toggle();
  el("sound-btn").textContent = muted ? "Sound: off" : "Sound: on";
});
function starsForScene() {
    if (state.strikes === 0 && state.timeLeft >= 0.3 * state.parTotal) return 3;
    if (state.strikes <= 1) return 2;
    return 1;
}

function completeScene() {
    state.over = true;
    clearInterval(state.timerId);
    const stars = starsForScene();
    state.bestStars[state.sceneIndex] = Math.max(state.bestStars[state.sceneIndex], stars);
    state.unlocked = Math.max(state.unlocked, Math.min(5, state.sceneIndex + 2));
    sfx.win();
    sfx.sceneComplete();
    if (state.sceneIndex === SCENES.length - 1) {
        showCampaignComplete();
        return;
    }
    const box = el("overlay-scene-complete");
    box.innerHTML = "<h2>" + scene().name + " complete</h2>" +
        "<div class=\"stars\">" +
        String.fromCharCode(9733).repeat(stars) +
        String.fromCharCode(9734).repeat(3 - stars) +
        "</div><ul>" +
        scene().differences.map(d => "<li>" + d.label + "</li>").join("") +
        "</ul><p>Score " + state.score + "</p>" +
        "<button class=\"next-btn\">Next scene</button>" +
        "<button class=\"scenes-btn\">All scenes</button>";
    box.querySelector(".next-btn").addEventListener("click", () => startScene(state.sceneIndex + 1));
    box.querySelector(".scenes-btn").addEventListener("click", () => { buildSceneSelect(); showOverlay("overlay-scene-select"); });
    showOverlay("overlay-scene-complete");
}

function showCampaignComplete() {
    const box = el("overlay-campaign-complete");
    const totalStars = state.bestStars.reduce((a, b) => a + b, 0);
    box.innerHTML = "<h2>Expedition complete</h2>" +
        "<p>Total score " + state.score + "</p>" +
        "<p>Stars " + totalStars + " of 15</p>" +
        "<button class=\"again-btn\">Play again</button>";
    box.querySelector(".again-btn").addEventListener("click", () => {
        state.score = 0;
        state.bestStars = [0, 0, 0, 0, 0];
        startScene(0);
    });
    showOverlay("overlay-campaign-complete");
}

function buildSceneSelect() {
    const box = el("overlay-scene-select");
    box.innerHTML = "<h2>Choose a scene</h2>" +
        SCENES.map((s, i) => {
            const locked = i >= state.unlocked && !state.shotMode;
            const stars = String.fromCharCode(9733).repeat(state.bestStars[i]) +
                String.fromCharCode(9734).repeat(3 - state.bestStars[i]);
            return "<button class=\"scene-card\" data-i=\"" + i + "\"" + (locked ? " disabled" : "") +
                "><strong>" + s.name + "</strong><span>" + s.subtitle + "</span><span>" + stars + "</span></button>";
        }).join("");
    box.querySelectorAll(".scene-card").forEach(card => {
        card.addEventListener("click", () => startScene(Number(card.dataset.i)));
    });
}

// Brand wiring
el("brand").addEventListener("click", () => { buildSceneSelect(); showOverlay("overlay-scene-select"); });
// Lens wiring
const spotPanel = el("spot-container");
spotPanel.addEventListener("mousemove", (evt) => {
  if (state.over) return;
  state.lensPos = panelPoint(evt, spotPanel);
  requestAnimationFrame(() => renderPanels());
});
spotPanel.addEventListener("mouseleave", () => {
  state.lensPos = null;
  renderPanels();
});

// Keyboard wiring
document.addEventListener("keydown", (evt) => {
  const k = evt.key;
  if (k === "p" || k === "P") {
    togglePause();
    return;
  }
  if (k === "h" || k === "H") {
    useHint();
    return;
  }
  if (k === "m" || k === "M") {
    el("sound-btn").click();
    return;
  }
  if (k === "r" || k === "R") {
    startScene(state.sceneIndex);
    return;
  }
  if (state.paused || state.over) return;
  const step = evt.shiftKey ? 36 : 12;
  if (k === "ArrowLeft" || k === "ArrowRight" || k === "ArrowUp" || k === "ArrowDown") {
    evt.preventDefault();
    state.crossOn = true;
    if (k === "ArrowLeft") state.crossPos.x -= step;
    if (k === "ArrowRight") state.crossPos.x += step;
    if (k === "ArrowUp") state.crossPos.y -= step;
    if (k === "ArrowDown") state.crossPos.y += step;
    state.crossPos.x = Math.max(0, Math.min(620, state.crossPos.x));
    state.crossPos.y = Math.max(0, Math.min(620, state.crossPos.y));
    renderPanels();
  } else if (k === "Tab") {
    evt.preventDefault();
    const remaining = scene().differences.filter((d) => !state.found.has(d.id));
    if (remaining.length) {
      const idx = remaining.findIndex((d) => d.x === state.crossPos.x && d.y === state.crossPos.y);
      const next = remaining[(idx + 1) % remaining.length];
      state.crossPos = { x: next.x, y: next.y };
      state.crossOn = true;
      renderPanels();
    }
  } else if (k === "Enter" || k === " ") {
    evt.preventDefault();
    tryMark(state.crossPos.x, state.crossPos.y);
  }
});
export function boot() {
  el("start-btn").addEventListener("click", () => { state.score = 0; startScene(0); });
  const shot = readShot();
  if (!shot) { showOverlay("overlay-title"); return; }
  state.shotMode = true;
  startScene(shot.scene);
  for (const id of shot.found) { if (scene().differences.some((d) => d.id === id)) state.found.add(id); }
  state.score = shot.score;
  state.streak = shot.streak;
  state.timeLeft = shot.timeLeft;
  if (shot.hint) state.pulseId = shot.hint;
  if (shot.lens) state.lensPos = { x: 430, y: 300 };
  renderPanels();
  updateHUD();
  if (shot.select) { buildSceneSelect(); showOverlay("overlay-scene-select"); }
  else if (shot.complete) { for (const d of scene().differences) state.found.add(d.id); renderPanels(); updateHUD(); completeScene(); }
}
