// shots.js
// Parses a shot URL parameter to restore a deterministic game state.
// Expected format: sceneIndex:foundIds:timeLeft:score:streak:extra
// where foundIds is comma‑separated list or "-" for none.
// extra tokens: hint=<diffId>, lens, complete, select

export function readShot() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (!shot) return null;
  const [sceneStr, foundStr, timeStr, scoreStr, streakStr, extraStr = ''] = shot.split(':');
  const scene = parseInt(sceneStr, 10) || 0;
  const found = foundStr === '-' || !foundStr ? [] : foundStr.split(',').filter(Boolean);
  const timeLeft = parseInt(timeStr, 10) || 0;
  const score = parseInt(scoreStr, 10) || 0;
  const streak = parseInt(streakStr, 10) || 0;
  const extraTokens = extraStr ? extraStr.split(',') : [];
  let hint = null, lens = false, complete = false, select = false;
  extraTokens.forEach(tok => {
    if (tok.startsWith('hint=')) hint = tok.slice(5);
    else if (tok === 'lens') lens = true;
    else if (tok === 'complete') complete = true;
    else if (tok === 'select') select = true;
  });
  return { scene, found, timeLeft, score, streak, hint, lens, complete, select };
}

/*
Canonical screenshot states used by the capture step (documentation only):
  1. cover – scene 0, three found, 97 s left, score 340, streak 3
  2. observatory – mid‑game with a hint pulse
  3. reef – lens active
  4. alpine – complete overlay shown
*/
