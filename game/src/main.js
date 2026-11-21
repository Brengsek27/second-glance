// SECOND GLANCE - entry point
import { boot } from "./engine.js";
if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", boot); } else { boot(); }
// Design notes: main.js only boots the engine. All game state lives in
// engine.js; scenes.js holds the five scenes and their differences;
// render.js builds the SVG strings; shots.js parses ?shot= states.
