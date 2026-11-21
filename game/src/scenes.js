/**
 * Scene registry for SECOND GLANCE spot‑the‑difference game.
 * Provides scene definitions and drawing functions.
 */

import { defs, cloud, star, lantern, moon, house, pineTree, groundShadow, highlight } from "./art.js";

/** Helper to conditionally render changed vs original element */
function variant(mut, id, original, changed) {
  return mut.has(id) ? changed : original;
}

/** Scene 1 – Lantern Night Market */
function drawMarket(mut) {
  const prefix = "market"; // unique defs prefix
  // Added `sea` gradient to satisfy `defs` expectations.
  const palette = {
    sky: ["#1a2a5e", "#3b4c8c"],
    sea: ["#001122", "#223344"],
    ground: ["#5d513c", "#7a6e5b"],
    glow: ["#ffdf70", "#ffb347"]
  };
  const defsBlock = defs(prefix, palette);
  // Sky gradient background
  const sky = `<rect x="0" y="0" width="620" height="620" fill="url(#${prefix}-sky)"/>`;
  // Moon (original crescent, changed full moon)
  const moonOrig = moon(520, 95, 40, "#fdfd96");
  const moonChanged = `<circle cx="520" cy="95" r="40" fill="#fdfd96"/>`;
  const moonSvg = variant(mut, "m4", moonOrig, moonChanged);
  // Stars
  const stars = [];
  const starPositions = [
    [460, 80], [465, 70], [480, 90], [500, 60], [530, 85]
  ];
  for (const [x, y] of starPositions) {
    const id = (x === 465 && y === 70) ? "m8" : null; // missing star
    const starSvg = id ? variant(mut, id, star(x, y, 12), "") : star(x, y, 12);
    stars.push(starSvg);
  }
  // Lanterns
  const lanternOrig = lantern(310, 120, 1, "#c0392b"); // crimson
  const lanternChanged = lantern(310, 120, 1, "#f1c40f"); // gold
  const lanternSvg = variant(mut, "m2", lanternOrig, lanternChanged);
  // Awning stripes (left stall)
  const awningOrig = `<rect x="100" y="250" width="200" height="80" fill="url(#${prefix}-ground)"/>` +
    `<rect x="100" y="250" width="100" height="80" fill="red"/>` +
    `<rect x="200" y="250" width="100" height="80" fill="#f3ead2"/>`;
  const awningChanged = `<rect x="100" y="250" width="200" height="80" fill="url(#${prefix}-ground)"/>` +
    `<rect x="100" y="250" width="200" height="80" fill="teal"/>`;
  const awningSvg = variant(mut, "m1", awningOrig, awningChanged);
  // Cat (present or missing)
  const catOrig = `<path d="M120,215 c-10,-10 -20,0 -10,10 z" fill="black"/>`;
  const catMissing = "";
  const catSvg = variant(mut, "m3", catOrig, catMissing);
  // Vendor hat (conical vs round)
  const hatOrig = `<polygon points="430,330 440,320 420,320" fill="#8b4513"/>`;
  const hatChanged = `<circle cx="430" cy="330" r="15" fill="#8b4513"/>`;
  const hatSvg = variant(mut, "m5", hatOrig, hatChanged);
  // Steam curls (three vs two)
  const steamOrig = `<path d="M455,265 q5,-10 10,0" stroke="white"/>` +
    `<path d="M465,265 q5,-10 10,0" stroke="white"/>` +
    `<path d="M475,265 q5,-10 10,0" stroke="white"/>`;
  const steamChanged = `<path d="M455,265 q5,-10 10,0" stroke="white"/>` +
    `<path d="M465,265 q5,-10 10,0" stroke="white"/>`;
  const steamSvg = variant(mut, "m6", steamOrig, steamChanged);
  // Bunting flag (teal vs pink)
  const flagOrig = `<polygon points="330,205 340,200 340,210" fill="teal"/>`;
  const flagChanged = `<polygon points="330,205 340,200 340,210" fill="pink"/>`;
  const flagSvg = variant(mut, "m7", flagOrig, flagChanged);
  // Assemble scene
  return `
    ${defsBlock}
    ${sky}
    ${moonSvg}
    ${stars.join('')}
    ${lanternSvg}
    ${awningSvg}
    ${catSvg}
    ${hatSvg}
    ${steamSvg}
    ${flagSvg}
    ${groundShadow(310,580,300,20)}
    ${highlight(310,580,320,25,0.1)}
  `;
}

/** Scene 1 differences */
const marketDiffs = [
  { id: "m1", x: 150, y: 300, r: 70, label: "the awning that changed colour" },
  { id: "m2", x: 310, y: 120, r: 34, label: "the lantern that turned gold" },
  { id: "m3", x: 120, y: 215, r: 30, label: "the missing roof cat" },
  { id: "m4", x: 520, y: 95, r: 40, label: "the moon that waned" },
  { id: "m5", x: 430, y: 330, r: 30, label: "the vendor's new hat" },
  { id: "m6", x: 455, y: 265, r: 26, label: "the vanished steam curl" },
  { id: "m7", x: 330, y: 205, r: 20, label: "the flag that blushed" },
  { id: "m8", x: 465, y: 70, r: 16, label: "the star that went out" }
];

function drawObservatory(mut) {
  const prefix = "observatory"; // unique defs prefix
  const palette = {
    sky: ["#2b1a5e", "#4c3b8c"],
    ground: ["#4a3c2d", "#6b5e4c"],
    glow: ["#ffdf70", "#ffb347"]
  };
  const defsBlock = defs(prefix, palette);
  // Sky gradient
  const sky = `<rect x="0" y="0" width="620" height="620" fill="url(#${prefix}-sky)"/>`;
  // Stars (14)
  const starPositions = [
    [100,80],[150,60],[200,90],[250,70],[300,100],[350,50],[400,85],[450,65],[500,95],[540,55],[580,80],[120,150],[180,130],[240,160]
  ];
  const stars = starPositions.map(p=>star(...p,8)).join('');
  // Milky Way band (faint dots)
  const milkyWay = [];
  for(let x=0;x<620;x+=20){milkyWay.push(`<circle cx="${x}" cy="${300 + (Math.sin(x/50)*30)}" r="2" fill="#bbbbff"/>`);} 
  const milkyWaySvg = milkyWay.join('');
  // Moon (full)
  const moonSvg = moon(520,95,40,"#fdfd96");
  // Observatory base (stone)
  const base = `<rect x="250" y="300" width="200" height="100" fill="#777777"/>`;
  // Dome (arched)
  const dome = `<path d="M250,300 A100,100 0 0 1 450,300 L450,250 A100,100 0 0 0 250,250 Z" fill="#dddddd"/>`;
  // Dome slit
  const slit = `<rect x="345" y="250" width="10" height="50" fill="#444444"/>`;
  // Door
  const door = `<rect x="340" y="340" width="20" height="60" fill="#555555"/>`;
  // Two lit windows (one variant o3)
  const windowOrig = `<rect x="260" y="340" width="20" height="30" fill="#222222"/>`;
  const windowLit = `<rect x="260" y="340" width="20" height="30" fill="#ffeb3b"/>`;
  const windowSvg = variant(mut, "o3", windowOrig, windowLit);
  // Telescope (variant o1)
  const scopeOrig = `<line x1="430" y1="250" x2="460" y2="280" stroke="#888888" stroke-width="4"/>
                     <circle cx="440" cy="260" r="46" stroke="#888888" fill="none"/>`;
  const scopeChanged = `<line x1="430" y1="250" x2="470" y2="260" stroke="#888888" stroke-width="4"/>
                       <circle cx="440" cy="260" r="46" stroke="#888888" fill="none"/>`;
  const scopeSvg = variant(mut, "o1", scopeOrig, scopeChanged);
  // Smaller side telescope (static)
  const sideScope = `<line x1="300" y1="350" x2="320" y2="370" stroke="#777777" stroke-width="3"/>
                     <circle cx="310" cy="360" r="30" stroke="#777777" fill="none"/>`;
  // Clock tower (hands variant o2)
  const clockFace = `<circle cx="330" cy="150" r="30" fill="#333333"/>`;
  const handsOrig = `<line x1="330" y1="150" x2="330" y2="120" stroke="white" stroke-width="2"/>
                    <line x1="330" y1="150" x2="350" y2="150" stroke="white" stroke-width="2"/>`;
  const handsChanged = `<line x1="330" y1="150" x2="330" y2="120" stroke="white" stroke-width="2"/>
                       <line x1="330" y1="150" x2="350" y2="150" stroke="white" stroke-width="2" transform="rotate(45 330 150)"/>`;
  const clockHandsSvg = variant(mut, "o2", handsOrig, handsChanged);
  // Astronomer figure (hat colour variant o4)
  const astroBody = `<circle cx="180" cy="430" r="20" fill="#ffcc99"/>`;
  const hatOrig = `<polygon points="170,410 190,410 180,390" fill="#8b0000"/>`;
  const hatChanged = `<polygon points="170,410 190,410 180,390" fill="#ff0000"/>`;
  const astroHatSvg = variant(mut, "o4", hatOrig, hatChanged);
  const astronomer = astroBody + astroHatSvg;
  // Star chart board (variant o5)
  const chartOrig = `<rect x="120" y="300" width="60" height="60" fill="#222222"/>
                    <path d="M130 320 L150 340 M140 330 L160 350" stroke="#ffffff" stroke-width="2"/>`;
  const chartChanged = `<rect x="120" y="300" width="60" height="60" fill="#222222"/>`;
  const chartSvg = variant(mut, "o5", chartOrig, chartChanged);
  // Weather vane (variant o6)
  const vaneOrig = `<line x1="330" y1="84" x2="330" y2="44" stroke="#555555" stroke-width="3"/>
                    <polygon points="330,44 320,54 340,54" fill="#555555"/>`;
  const vaneChanged = `<line x1="330" y1="84" x2="330" y2="44" stroke="#555555" stroke-width="3" transform="rotate(180 330 84)"/>
                      <polygon points="330,44 320,54 340,54" fill="#555555" transform="rotate(180 330 44)"/>`;
  const vaneSvg = variant(mut, "o6", vaneOrig, vaneChanged);
  // Comet (variant o7)
  const cometOrig = `<circle cx="520" cy="90" r="6" fill="#ffaaaa"/>
                    <path d="M520,90 L560,70" stroke="#ffaaaa" stroke-width="2"/>`;
  const cometChanged = `<circle cx="520" cy="90" r="6" fill="#ffaaaa"/>
                      <path d="M520,90 L540,80" stroke="#ffaaaa" stroke-width="2"/>`;
  const cometSvg = variant(mut, "o7", cometOrig, cometChanged);
  // Fence cat (variant o8)
  const catOrig = `<path d="M90,470 c-5,-5 -10,0 -5,5 z" fill="#000000"/>`;
  const catMissing = "";
  const catSvg = variant(mut, "o8", catOrig, catMissing);
  // Path with lanterns
  const path = `<path d="M200,500 Q300,450 400,500" stroke="#555555" fill="none"/>`;
  const lantern1 = lantern(250,480,1,"#c0392b");
  const lantern2 = lantern(350,480,1,"#c0392b");
  // Pine trees
  const trees = pineTree(100,400) + pineTree(520,420);
  // Ground shadow & highlight
  const shadow = groundShadow(310,580,300,20);
  const high = highlight(310,580,320,25,0.1);
  // Assemble
  return `
    ${defsBlock}
    ${sky}
    ${stars}
    ${milkyWaySvg}
    ${moonSvg}
    ${base}
    ${dome}
    ${slit}
    ${door}
    ${windowSvg}
    ${scopeSvg}
    ${sideScope}
    ${clockFace}
    ${clockHandsSvg}
    ${astronomer}
    ${chartSvg}
    ${vaneSvg}
    ${cometSvg}
    ${catSvg}
    ${path}
    ${lantern1}
    ${lantern2}
    ${trees}
    ${shadow}
    ${high}
  `;
}


const observatoryDiffs = [
  { id: "o1", x: 430, y: 250, r: 46, label: "the telescope's tilt" },
  { id: "o2", x: 330, y: 150, r: 30, label: "the clock that lost an hour" },
  { id: "o3", x: 255, y: 330, r: 24, label: "the window that went dark" },
  { id: "o4", x: 180, y: 430, r: 26, label: "the astronomer's crimson hat" },
  { id: "o5", x: 120, y: 300, r: 34, label: "the chart's missing constellation" },
  { id: "o6", x: 330, y: 84, r: 22, label: "the vane that turned" },
  { id: "o7", x: 520, y: 90, r: 34, label: "the comet's shortened tail" },
  { id: "o8", x: 90, y: 470, r: 26, label: "the cat that slipped away" }
];


function drawReef(mut) {
  const prefix = "reef";
  const palette = {
    water: ["#004466", "#006688"],
    coral: ["#ff7f50", "#ff4500", "#ff1493"],
    sand: ["#c2b280", "#d2b48c"]
  };
  const defsBlock = defs(prefix, palette);
  // Background water gradient
  const water = `<rect x="0" y="0" width="620" height="620" fill="url(#${prefix}-water)"/>`;
  // Light rays from surface
  const rays = [];
  for(let i=0;i<6;i++){
    const y = 0;
    const x1 = 310 - i*20;
    const x2 = 310 + i*20;
    rays.push(`<line x1="${x1}" y1="${y}" x2="${x2}" y2="400" stroke="rgba(255,255,200,0.3)" stroke-width="4"/>`);
  }
  const raysSvg = rays.join('');
  // Porthole brass ring with rivets
  const ring = `<circle cx="310" cy="310" r="260" fill="none" stroke="#b8860b" stroke-width="20"/>`;
  const rivets = [];
  for(let a=0;a<12;a++){
    const ang = (Math.PI*2/12)*a;
    const cx = 310 + 250*Math.cos(ang);
    const cy = 310 + 250*Math.sin(ang);
    rivets.push(`<circle cx="${cx}" cy="${cy}" r="8" fill="#8b6914"/>`);
  }
  const rivetsSvg = rivets.join('');
  // Coral garden (multiple corals)
  const corals = [];
  const coralPositions = [
    [200,400],[250,440],[300,380],[350,420],[400,380],[450,440]
  ];
  coralPositions.forEach(([cx,cy],i)=>{
    const color = palette.coral[i%palette.coral.length];
    corals.push(`<path d="M${cx},${cy} q20,-30 40,0 q20,30 0,60 q-20,30 -40,0 q-20,-30 0,-60" fill="${color}"/>`);
  });
  const coralsSvg = corals.join('');
  // Sea grass
  const grass = [];
  for(let i=0;i<8;i++){
    const x = 150 + i*40;
    grass.push(`<path d="M${x},520 q5,-30 10,0 q5,30 0,60" fill="#2e8b57"/>`);
  }
  const grassSvg = grass.join('');
  // Rock arch
  const arch = `<path d="M120,500 a120,60 0 0 1 380,0" fill="#555555"/>`;
  // Wrecked rowboat
  const boat = `<path d="M300,520 l-30,-15 l60,0 z" fill="#8b4513"/>`;
  // Differences using variant
  const turtleOrig = `<circle cx="300" cy="180" r="52" fill="#7f7f7f"/>`;
  const turtleChanged = `<circle cx="300" cy="180" r="52" fill="#7f7f7f" stroke="black" stroke-width="4"/>`;
  const turtle = variant(mut, "r1", turtleOrig, turtleChanged);
  const fishOrig = `<ellipse cx="430" cy="320" rx="30" ry="15" fill="#ffa500"/>`;
  const fishChanged = `<ellipse cx="430" cy="320" rx="30" ry="15" fill="#ffa500" opacity="0.5"/>`;
  const clownfish = variant(mut, "r2", fishOrig, fishChanged);
  const starfishOrig = `<polygon points="140,470 150,450 160,470 180,470 165,485 170,505 150,495 130,505 135,485" fill="#ff0000"/>`;
  const starfishChanged = `<polygon points="140,470 150,450 160,470 180,470 165,485 170,505 150,495 130,505 135,485" fill="#ee82ee"/>`;
  const starfish = variant(mut, "r3", starfishOrig, starfishChanged);
  const seahorseOrig = `<path d="M505,430 q10,-20 20,0 q-10,20 -20,0" fill="#8b4513"/>`;
  const seahorseChanged = ``; // missing
  const seahorse = variant(mut, "r4", seahorseOrig, seahorseChanged);
  const octopusOrig = `<circle cx="190" cy="300" r="44" fill="#800080"/>`;
  const octopusChanged = `<g><circle cx="190" cy="300" r="44" fill="#800080"/>`+
    `<line x1="190" y1="300" x2="250" y2="260" stroke="#800080" stroke-width="8"/>` +
    `<line x1="190" y1="300" x2="250" y2="340" stroke="#800080" stroke-width="8"/>` +
    `</g>`;
  const octopus = variant(mut, "r5", octopusOrig, octopusChanged);
  const fishSchoolOrig = `<circle cx="350" cy="110" r="40" fill="#ffd76a"/>`;
  const fishSchoolChanged = `<circle cx="350" cy="110" r="40" fill="#ffd76a" opacity="0.6"/>`;
  const fishSchool = variant(mut, "r6", fishSchoolOrig, fishSchoolChanged);
  const chestOrig = `<rect x="450" y="520" width="40" height="30" fill="#b5651d"/>`;
  const chestChanged = `<rect x="450" y="520" width="40" height="30" fill="#b5651d"/><rect x="460" y="525" width="20" height="20" fill="#ffd700"/>`;
  const chest = variant(mut, "r7", chestOrig, chestChanged);
  const pearlOrig = `<circle cx="110" cy="540" r="30" fill="#f0f8ff"/>`;
  const pearlChanged = ``; // missing
  const pearl = variant(mut, "r8", pearlOrig, pearlChanged);
  // Assemble
  return `
    ${defsBlock}
    ${water}
    ${raysSvg}
    ${ring}
    ${rivetsSvg}
    ${coralsSvg}
    ${grassSvg}
    ${arch}
    ${boat}
    ${turtle}
    ${clownfish}
    ${starfish}
    ${seahorse}
    ${octopus}
    ${fishSchool}
    ${chest}
    ${pearl}
    ${groundShadow(310,580,300,20)}
    ${highlight(310,580,320,25,0.1)}
  `;
}

const reefDiffs = [
  { id: "r1", x: 300, y: 180, r: 52, label: "the turtle's spotted shell" },
  { id: "r2", x: 430, y: 320, r: 30, label: "the clownfish's missing stripe" },
  { id: "r3", x: 140, y: 470, r: 30, label: "the starfish that turned violet" },
  { id: "r4", x: 505, y: 430, r: 28, label: "the seahorse that swam off" },
  { id: "r5", x: 190, y: 300, r: 44, label: "the octopus's two new arms" },
  { id: "r6", x: 350, y: 110, r: 40, label: "the two fish that left the school" },
  { id: "r7", x: 450, y: 520, r: 40, label: "the chest that clicked shut" },
  { id: "r8", x: 110, y: 540, r: 30, label: "the pearl that vanished" }
];
function drawAlpine(mut) {
  const prefix = 'alpine';
  const palette = {
    sky: '#7a5a9c',
    dusk: '#d19a66',
    snow: '#ffffff',
    mountain: '#555555',
    sun: '#ffd27f',
    star: '#fafad2',
    light: '#ffdab9',
    dark: '#2c1e1e'
  };
  const defsBlock = defs(prefix, palette);
  return `
    ${defsBlock}
    <svg viewBox="0 0 620 620" xmlns="http://www.w3.org/2000/svg">
      <!-- Sky gradient -->
      <rect width="620" height="620" fill="url(#${prefix}-sky)" />
      ${cloud(mut, `${prefix}-cloud1`, 120, 80, 100, 60)}
      ${cloud(mut, `${prefix}-cloud2`, 320, 60, 120, 70)}
      ${star(mut, `${prefix}-star1`, 500, 90, 2)}
      ${star(mut, `${prefix}-star2`, 540, 110, 2)}
      ${star(mut, `${prefix}-star3`, 580, 80, 2)}
      ${moon(mut, `${prefix}-moon`, 500, 130, 40, 'full')}
      <!-- Mountains -->
      <g id="${prefix}-mountains">
        <polygon points="0,500 150,300 300,500" fill="url(#${prefix}-mountain)" />
        <polygon points="150,500 300,250 450,500" fill="url(#${prefix}-mountain)" />
        <polygon points="300,500 450,280 620,500" fill="url(#${prefix}-mountain)" />
        <!-- Snow caps -->
        <polygon points="80,340 150,300 220,340" fill="url(#${prefix}-snow)" />
        <polygon points="230,310 300,250 370,310" fill="url(#${prefix}-snow)" />
        <polygon points="380,320 450,280 520,320" fill="url(#${prefix}-snow)" />
      </g>
      <!-- Cable car line -->
      <line x1="100" y1="250" x2="520" y2="150" stroke="${palette.dark}" stroke-width="3" />
      <!-- Gondolas -->
      ${variant(mut, 'a1',
        `<g id="${prefix}-gondola1" transform="translate(400,130)">
          <rect width="80" height="40" fill="crimson" />
          <text x="40" y="25" fill="white" font-size="12" text-anchor="middle">A</text>
        </g>`,
        `<g id="${prefix}-gondola1" transform="translate(400,130)">
          <rect width="80" height="40" fill="teal" />
          <text x="40" y="25" fill="white" font-size="12" text-anchor="middle">A</text>
        </g>`)}
      <!-- Chalet houses -->
      ${variant(mut, 'a2',
        `<g id="${prefix}-chalet1" transform="translate(150,300)">
          <rect width="100" height="80" fill="#8b4513" />
          <polygon points="0,0 50,-40 100,0" fill="#a0522d" />
          <rect x="20" y="20" width="20" height="30" fill="yellow" />
          <path d="M30 20 q5 -10 10 0" stroke="${palette.dark}" fill="none" />
        </g>`,
        `<g id="${prefix}-chalet1" transform="translate(150,300)">
          <rect width="100" height="80" fill="#8b4513" />
          <polygon points="0,0 50,-40 100,0" fill="#a0522d" />
          <rect x="20" y="20" width="20" height="30" fill="yellow" />
          <!-- smoke missing -->
        </g>`)}
      ${variant(mut, 'a3',
        `<g id="${prefix}-chalet2" transform="translate(250,390)">
          <rect width="80" height="70" fill="#8b4513" />
          <polygon points="0,0 40,-30 80,0" fill="#a0522d" />
          <rect x="15" y="15" width="15" height="25" fill="yellow" />
        </g>`,
        `<g id="${prefix}-chalet2" transform="translate(250,390)">
          <rect width="80" height="70" fill="#8b4513" />
          <polygon points="0,0 40,-30 80,0" fill="#a0522d" />
          <rect x="15" y="15" width="15" height="25" fill="black" />
        </g>`)}
      <!-- Church -->
      ${variant(mut, 'a4',
        `<g id="${prefix}-church" transform="translate(330,240)">
          <rect width="60" height="80" fill="#c0c0c0" />
          <polygon points="0,0 30,-40 60,0" fill="#d3d3d3" />
          <circle cx="30" cy="50" r="5" fill="black" />
          <rect x="20" y="30" width="20" height="20" fill="gold" />
        </g>`,
        `<g id="${prefix}-church" transform="translate(330,240)">
          <rect width="60" height="80" fill="#c0c0c0" />
          <polygon points="0,0 30,-40 60,0" fill="#d3d3d3" />
          <circle cx="30" cy="50" r="5" fill="black" />
          <!-- bell missing -->
        </g>`)}
      <!-- Pine forest -->
      ${pineTree(mut, `${prefix}-pine1`, 80, 460, 1.2)}
      ${pineTree(mut, `${prefix}-pine2`, 120, 470, 1.0)}
      ${pineTree(mut, `${prefix}-pine3`, 160, 455, 1.3)}
      ${pineTree(mut, `${prefix}-pine4`, 200, 465, 0.9)}
      ${pineTree(mut, `${prefix}-pine5`, 240, 460, 1.1)}
      ${pineTree(mut, `${prefix}-pine6`, 280, 470, 1.2)}
      ${pineTree(mut, `${prefix}-pine7`, 320, 455, 1.0)}
      ${pineTree(mut, `${prefix}-pine8`, 360, 465, 1.3)}
      ${pineTree(mut, `${prefix}-pine9`, 400, 460, 1.1)}
      ${pineTree(mut, `${prefix}-pine10`, 440, 470, 1.2)}
      <!-- Frozen lake -->
      <ellipse cx="300" cy="520" rx="120" ry="40" fill="url(#${prefix}-ice)" />
      ${variant(mut, 'a5',
        `<g id="${prefix}-skater" transform="translate(300,520)">
          <circle cx="0" cy="0" r="20" fill="#ffdab9" />
          <path d="M-10 -5 l20 0" stroke="crimson" stroke-width="3" />
        </g>`,
        `<g id="${prefix}-skater" transform="translate(300,520)">
          <circle cx="0" cy="0" r="20" fill="#ffdab9" />
          <path d="M-10 -5 l20 0" stroke="gold" stroke-width="3" />
        </g>`)}
      <!-- Wood pile and sled -->
      ${variant(mut, 'a6',
        `<g id="${prefix}-sled" transform="translate(500,470)">
          <rect width="60" height="20" fill="#8b4513" />
          <line x1="0" y1="20" x2="60" y2="20" stroke="${palette.dark}" stroke-width="2" />
        </g>`,
        `<g id="${prefix}-sled" transform="translate(500,470)">
          <!-- sled missing -->
        </g>`)}
      <!-- Festoon lights -->
      ${variant(mut, 'a7',
        `<g id="${prefix}-lights" transform="translate(210,330)">
          <circle cx="0" cy="0" r="5" fill="amber" />
          <circle cx="20" cy="0" r="5" fill="amber" />
          <circle cx="40" cy="0" r="5" fill="amber" />
        </g>`,
        `<g id="${prefix}-lights" transform="translate(210,330)">
          <circle cx="0" cy="0" r="5" fill="amber" />
          <circle cx="20" cy="0" r="5" fill="pink" />
          <circle cx="40" cy="0" r="5" fill="amber" />
        </g>`)}
      <!-- Falling snow -->
      ${[...Array(30)].map((_,i)=>`<circle cx="${Math.random()*620}" cy="${Math.random()*620}" r="1" fill="white" />`).join('\n')}
      <!-- Snowman -->
      ${variant(mut, 'a8',
        `<g id="${prefix}-snowman" transform="translate(90,520)">
          <circle cx="0" cy="-20" r="12" fill="white" />
          <circle cx="0" cy="0" r="10" fill="white" />
          <circle cx="0" cy="20" r="8" fill="white" />
          <polygon points="-4,-20 0,-30 4,-20" fill="orange" />
        </g>`,
        `<g id="${prefix}-snowman" transform="translate(90,520)">
          <circle cx="0" cy="-20" r="12" fill="white" />
          <circle cx="0" cy="0" r="10" fill="white" />
          <circle cx="0" cy="20" r="8" fill="white" />
          <!-- nose missing -->
        </g>`)}
      ${groundShadow(mut, `${prefix}-shadow`, 0, 600, 620, 20)}
      ${highlight(mut, `${prefix}-highlight`, 0, 0, 620, 620)}
    </svg>
  `;
}
export { drawAlpine };

const alpineDiffs = [
  { id: 'a1', x: 400, y: 130, r: 40, label: 'Gondola crimson/teal' },
  { id: 'a2', x: 150, y: 300, r: 30, label: 'Chimney smoke missing' },
  { id: 'a3', x: 250, y: 390, r: 22, label: 'Window lit/dark' },
  { id: 'a4', x: 330, y: 240, r: 24, label: 'Bell present/missing' },
  { id: 'a5', x: 300, y: 520, r: 30, label: 'Skater scarf crimson/gold' },
  { id: 'a6', x: 500, y: 470, r: 32, label: 'Sled present/missing' },
  { id: 'a7', x: 210, y: 330, r: 18, label: 'Light bulb amber/pink' },
  { id: 'a8', x: 90, y: 520, r: 28, label: 'Snowman nose present/missing' }
];
export { alpineDiffs };


function drawOrbital(mut) {
  const prefix = "orbital";
  const palette = {
    sky: ["#001d3d", "#003366"],
    earth: ["#2b65ec", "#1e90ff"],
    glass: ["#aaddff", "#88ccee"]
  };
  const defsBlock = defs(prefix, palette);
  // Starfield background
  const stars = [];
  for(let i=0;i<30;i++){
    const x = Math.random()*620|0;
    const y = Math.random()*200|0;
    const sz = Math.random()*2+1;
    stars.push(`<circle cx="${x}" cy="${y}" r="${sz}" fill="white"/>`);
  }
  const starfield = stars.join('');
  // Earth with clouds
  const earth = `<circle cx="310" cy="150" r="80" fill="${palette.earth[0]}"/>`;
  const clouds = [];
  for(let i=0;i<12;i++){
    const angle = Math.random()*Math.PI*2;
    const r = 80;
    const cx = 310 + Math.cos(angle)*r*0.6;
    const cy = 150 + Math.sin(angle)*r*0.6;
    const sz = Math.random()*10+5;
    clouds.push(`<circle cx="${cx}" cy="${cy}" r="${sz}" fill="${palette.earth[1]}" opacity="0.4"/>`);
  }
  const earthClouds = clouds.join('');
  // Dome glass
  const dome = `<path d="M120,280 A190,190 0 0 1 500,280" fill="none" stroke="${palette.glass[0]}" stroke-width="4"/>`;
  const glass = `<path d="M120,280 A190,190 0 0 1 500,280" fill="${palette.glass[1]}" opacity="0.2"/>`;
  // Plant beds and differences using variant
  const plantBed = `<rect x="150" y="300" width="320" height="80" fill="#4b8b3b"/>`;
  const tomatoesOrig = `<circle cx="150" cy="380" r="34" fill="red"/>`;
  const tomatoesChanged = `<circle cx="150" cy="380" r="34" fill="green"/>`;
  const tomatoes = variant(mut, "g1", tomatoesOrig, tomatoesChanged);
  const robotOrig = `<rect x="460" y="320" width="40" height="20" fill="#888"/>`;
  const robotChanged = `<rect x="460" y="320" width="40" height="20" fill="#888"/>` + `<line x1="470" y1="320" x2="470" y2="260" stroke="orange" stroke-width="4"/>`;
  const robot = variant(mut, "g2", robotOrig, robotChanged);
  const lampOrig = `<circle cx="310" cy="120" r="30" fill="#555"/>`;
  const lampChanged = `<circle cx="310" cy="120" r="30" fill="orange"/>`;
  const lamp = variant(mut, "g3", lampOrig, lampChanged);
  const butterflyOrig = `<path d="M240,210 q10,-10 20,0 q-10,10 -20,0" fill="purple"/>`;
  const butterfly = variant(mut, "g4", butterflyOrig, "");
  const canOrig = `<ellipse cx="520" cy="180" rx="28" ry="18" fill="#ccc"/>`;
  const can = variant(mut, "g5", canOrig, "");
  const trayOrig = `<rect x="330" y="480" width="80" height="30" fill="#222"/>`;
  const trayChanged = `<rect x="330" y="480" width="80" height="30" fill="#222"/>` + `<circle cx="360" cy="495" r="5" fill="green"/>` + `<circle cx="380" cy="495" r="5" fill="green"/>` + `<circle cx="400" cy="495" r="5" fill="green"/>`;
  const tray = variant(mut, "g6", trayOrig, trayChanged);
  const tabletOrig = `<rect x="420" y="450" width="40" height="30" fill="#ddd"/>`;
  const tabletChanged = `<rect x="420" y="450" width="40" height="30" fill="#ddd"/>` + `<rect x="425" y="455" width="30" height="20" fill="teal"/>`;
  const tablet = variant(mut, "g7", tabletOrig, tabletChanged);
  const moonOrig = `<circle cx="90" cy="110" r="30" fill="white"/>`;
  const moonChanged = ``;
  const moon = variant(mut, "g8", moonOrig, moonChanged);
  // Assemble
  return `
    ${defsBlock}
    ${starfield}
    ${earth}${earthClouds}
    ${dome}${glass}
    ${plantBed}
    ${tomatoes}
    ${robot}
    ${lamp}
    ${butterfly}
    ${can}
    ${tray}
    ${tablet}
    ${moon}
    ${groundShadow(310,580,300,20)}
    ${highlight(310,580,320,25,0.1)}
  `;
}


const orbitalDiffs = [
  { id: "g1", x: 150, y: 380, r: 34, label: "the tomatoes that ripened" },
  { id: "g2", x: 470, y: 320, r: 36, label: "the robot's lowered arm" },
  { id: "g3", x: 310, y: 120, r: 30, label: "the lamp that went dark" },
  { id: "g4", x: 240, y: 210, r: 24, label: "the butterfly that drifted off" },
  { id: "g5", x: 520, y: 180, r: 28, label: "the can that floated away" },
  { id: "g6", x: 330, y: 480, r: 36, label: "the seedling that never sprouted" },
  { id: "g7", x: 420, y: 450, r: 24, label: "the tablet's amber alert" },
  { id: "g8", x: 90, y: 110, r: 30, label: "the moon that slipped from view" }
];


export const SCENES = [
  {
    id: "market",
    name: "Lantern Night Market",
    subtitle: "Scene 1 · the old town bazaar",
    par: 150,
    draw: drawMarket,
    differences: marketDiffs
  },
  {
    id: "observatory",
    name: "Clockwork Observatory",
    subtitle: "Scene 2 · the hilltop dome",
    par: 135,
    draw: drawObservatory,
    differences: observatoryDiffs
  },{
        id: "reef",
        name: "Coral Reef Window",
        subtitle: "Scene 3 · beneath the pier",
        par: 150,
        draw: drawReef,
        differences: reefDiffs
      },
      { id: "alpine", name: "Alpine Cable-Car Village", subtitle: "Scene 4 · dusk in the high valley", par: 140, draw: drawAlpine, differences: alpineDiffs },
  {
    id: "orbital",
    name: "Orbital Greenhouse",
    subtitle: "Scene 5 · the station garden",
    par: 130,
    draw: drawOrbital,
    differences: orbitalDiffs
  }
];

export const DIFF_TOTAL = SCENES.reduce((sum, s) => sum + s.differences.length, 0);

/* Set dressing decor */
const DECOR = {
  market: `<rect x="0" y="528" width="620" height="92" fill="#4b2e2e"/><!-- bottom stall -->
    <rect x="50" y="540" width="30" height="70" fill="#5c3a3a"/><!-- jar -->
    <rect x="120" y="540" width="30" height="70" fill="#5c3a3a"/><!-- jar -->
    <circle cx="65" cy="580" r="15" fill="#c99" stroke="#8a5"/><!-- lantern -->
    <circle cx="135" cy="580" r="15" fill="#c99" stroke="#8a5"/><!-- lantern -->
    <rect x="6" y="452" width="80" height="76" fill="#3a2b2b"/><!-- crates -->
    <rect x="540" y="458" width="74" height="70" fill="#3a2b2b"/><!-- barrels -->
    <rect x="8" y="150" width="50" height="82" fill="#2a1d1d" stroke="#cfa500"/><!-- sign -->
    <polygon points="30,150 40,140 20,140" fill="#ffd700"/><!-- star -->
    <path d="M10,8 C120,44 250,44 250,44" stroke="#aaa" fill="none"/><!-- string left -->
    <circle cx="50" cy="48" r="5" fill="#ffcc66"/><!-- lantern -->
    <circle cx="100" cy="48" r="5" fill="#ffcc66"/><!-- lantern -->
    <path d="M386,10 C420,20 460,30 486,40" stroke="#aaa" fill="none"/><!-- string right -->
    <circle cx="410" cy="30" r="5" fill="#ffcc66"/><!-- lantern -->
    <circle cx="440" cy="35" r="5" fill="#ffcc66"/><!-- lantern -->
    <circle cx="470" cy="38" r="5" fill="#ffcc66"/><!-- lantern -->
  `,
  reef: `<circle cx="58" cy="200" r="5" fill="#fff" opacity="0.5"/><!-- bubble col left 1 -->
    <circle cx="62" cy="250" r="6" fill="#fff" opacity="0.5"/><!-- bubble col left 2 -->
    <circle cx="66" cy="300" r="4" fill="#fff" opacity="0.5"/><!-- bubble col left 3 -->
    <circle cx="540" cy="150" r="5" fill="#fff" opacity="0.5"/><!-- bubble col right 1 -->
    <circle cx="544" cy="200" r="6" fill="#fff" opacity="0.5"/><!-- bubble col right 2 -->
    <circle cx="548" cy="250" r="4" fill="#fff" opacity="0.5"/><!-- bubble col right 3 -->
    <path d="M10,500 C20,520 30,540 40,560" stroke="#006644" fill="none"/><!-- seaweed left -->
    <path d="M30,500 C40,520 50,540 60,560" stroke="#006644" fill="none"/><!-- seaweed left -->
    <path d="M600,500 C610,520 620,540 630,560" stroke="#006644" fill="none"/><!-- seaweed right -->
    <ellipse cx="150" cy="50" rx="20" ry="8" fill="#ffd700" opacity="0.8"/><!-- fish 1 -->
    <ellipse cx="190" cy="60" rx="20" ry="8" fill="#ffd700" opacity="0.8"/><!-- fish 2 -->
    <ellipse cx="230" cy="70" rx="20" ry="8" fill="#ffd700" opacity="0.8"/><!-- fish 3 -->
    <ellipse cx="270" cy="80" rx="20" ry="8" fill="#ffd700" opacity="0.8"/><!-- fish 4 -->
  `,
  orbital: `<rect x="0" y="548" width="620" height="72" fill="#2b3a2b"/><!-- plant bed -->
    <ellipse cx="50" cy="580" rx="20" ry="10" fill="#4caf50"/><!-- leaf -->
    <ellipse cx="80" cy="585" rx="20" ry="10" fill="#4caf50"/><!-- leaf -->
    <ellipse cx="110" cy="580" rx="20" ry="10" fill="#4caf50"/><!-- leaf -->
    <ellipse cx="475" cy="580" rx="20" ry="10" fill="#4caf50"/><!-- leaf -->
    <ellipse cx="505" cy="585" rx="20" ry="10" fill="#4caf50"/><!-- leaf -->
    <ellipse cx="535" cy="580" rx="20" ry="10" fill="#4caf50"/><!-- leaf -->
    <path d="M40,0 C45,20 55,30 60,64" stroke="#2e8b57" fill="none"/><!-- vine left -->
    <path d="M120,0 C125,20 135,30 140,64" stroke="#2e8b57" fill="none"/><!-- vine left2 -->
    <path d="M520,0 C525,20 535,30 540,64" stroke="#2e8b57" fill="none"/><!-- vine right -->
    <path d="M585,0 C590,20 600,30 605,64" stroke="#2e8b57" fill="none"/><!-- vine right2 -->
    <rect x="548" y="492" width="66" height="56" fill="#654321"/><!-- tools crate -->
    <circle cx="50" cy="290" r="8" fill="#bbdefb" opacity="0.6"/><!-- droplet 1 -->
    <circle cx="60" cy="310" r="8" fill="#bbdefb" opacity="0.6"/><!-- droplet 2 -->
    <circle cx="70" cy="330" r="8" fill="#bbdefb" opacity="0.6"/><!-- droplet 3 -->
    <circle cx="55" cy="310" r="8" fill="#bbdefb" opacity="0.6"/><!-- droplet 4 -->
    <circle cx="65" cy="330" r="8" fill="#bbdefb" opacity="0.6"/><!-- droplet 5 -->
  `
};
for (const s of SCENES) {
  if (DECOR[s.id]) {
    const orig = s.draw;
    s.draw = (mut) => orig(mut) + DECOR[s.id];
  }
}
// Alpine painter, part 1: sky, mountains, cable cars (raw SVG).
const ALPINE_A = (mut) => `
<defs>
<linearGradient id="alpine-sky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#26355e"/><stop offset="55%" stop-color="#7a5a9c"/><stop offset="100%" stop-color="#d19a66"/></linearGradient>
<linearGradient id="alpine-snow" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#d7e5f5"/></linearGradient>
<radialGradient id="alpine-sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffd27f"/><stop offset="100%" stop-color="#ff9a5c" stop-opacity="0"/></radialGradient>
</defs>
<rect x="0" y="0" width="620" height="620" fill="url(#alpine-sky)"/>
<circle cx="92" cy="92" r="95" fill="url(#alpine-sun)"/><circle cx="92" cy="92" r="34" fill="#ffd27f"/>
<polygon points="300,49 303,60 300,71 297,60" fill="#ffe9a8"/>
<polygon points="430,33 433,44 430,55 427,44" fill="#ffe9a8"/>
<polygon points="560,139 563,150 560,161 557,150" fill="#ffe9a8"/>
<polygon points="200,109 203,120 200,131 197,120" fill="#ffe9a8"/>
<polygon points="520,219 523,230 520,241 517,230" fill="#ffe9a8"/>
<ellipse cx="180" cy="84" rx="30" ry="20" fill="#e8b48f"/>
<ellipse cx="200" cy="84" rx="30" ry="20" fill="#e8b48f"/>
<ellipse cx="220" cy="84" rx="30" ry="20" fill="#e8b48f"/>
<ellipse cx="470" cy="70" rx="30" ry="20" fill="#d99e77"/>
<ellipse cx="490" cy="70" rx="30" ry="20" fill="#d99e77"/>
<ellipse cx="510" cy="70" rx="30" ry="20" fill="#d99e77"/>
<polygon points="0,500 150,300 300,500" fill="#3d4a6b"/><polygon points="150,500 300,250 450,500" fill="#46536f"/><polygon points="300,500 450,280 620,500" fill="#39466a"/>
<polygon points="134,328 150,300 166,328 157,320 150,328 143,320" fill="#ffffff"/><polygon points="284,278 300,250 316,278 307,270 300,278 293,270" fill="#ffffff"/><polygon points="434,308 450,280 466,308 457,300 450,308 443,300" fill="#ffffff"/>
<rect x="0" y="428" width="620" height="192" fill="url(#alpine-snow)"/>
<line x1="0" y1="58" x2="620" y2="196" stroke="#1d2438" stroke-width="3"/><line x1="0" y1="68" x2="620" y2="206" stroke="#1d2438" stroke-width="3"/>
<line x1="400" y1="140" x2="400" y2="118" stroke="#1d2438"/>
<rect x="372" y="118" width="56" height="34" rx="8" fill="${mut.has('a1') ? '#1f8a70' : '#c0392b'}"/>
<rect x="380" y="126" width="40" height="10" fill="#ffe9a8" opacity="0.85"/>
<line x1="120" y1="92" x2="120" y2="70" stroke="#1d2438"/>
<rect x="96" y="80" width="48" height="30" rx="7" fill="#7a5a7c"/>
`;
// Alpine painter, part 2: chalet, church, lamp, window house.
const ALPINE_B = (mut) => {
  const smoke = mut.has('a2') ? '' : '<ellipse cx="170" cy="246" rx="10" ry="7" fill="#e8e2da" opacity="0.8"/><ellipse cx="178" cy="228" rx="13" ry="9" fill="#e8e2da" opacity="0.65"/><ellipse cx="188" cy="208" rx="16" ry="11" fill="#e8e2da" opacity="0.5"/>';
  const bell = mut.has('a4') ? '' : '<circle cx="330" cy="240" r="13" fill="#e6b93d"/><circle cx="330" cy="250" r="3" fill="#8a6a1d"/>';
  const bulb = mut.has('a7') ? '#ff8fb3' : '#ffb347';
  const win = mut.has('a3') ? '#232c44' : '#ffd76a';
  return `<rect x="104" y="300" width="92" height="62" fill="#8a5a33"/><polygon points="96,300 204,300 150,262" fill="#5d3a22"/><rect x="164" y="258" width="12" height="26" fill="#6e4525"/><rect x="140" y="326" width="18" height="36" fill="#4a2e1a"/>${smoke}<rect x="314" y="176" width="32" height="124" fill="#7a6a8f"/><polygon points="306,176 354,176 330,138" fill="#4a3a5e"/><rect x="324" y="268" width="12" height="22" rx="6" fill="#2c3550"/>${bell}<line x1="210" y1="330" x2="210" y2="374" stroke="#22293d" stroke-width="4"/><circle cx="210" cy="330" r="22" fill="url(#alpine-sun)"/><circle cx="210" cy="330" r="10" fill="${bulb}"/><rect x="214" y="372" width="72" height="74" fill="#7a4a2e"/><polygon points="206,372 294,372 250,338" fill="#5d3a22"/><rect x="240" y="380" width="20" height="20" fill="${win}"/><rect x="258" y="408" width="16" height="38" fill="#4a2e1a"/><ellipse cx="250" cy="452" rx="190" ry="16" fill="#000000" opacity="0.15"/><ellipse cx="450" cy="470" rx="140" ry="14" fill="#000000" opacity="0.15"/>`;
};
export { ALPINE_B };
// Alpine painter, part 3: ice, skater, sled, snowman, dressing.
const ALPINE_C = (mut) => {
  const scarf = mut.has('a5') ? '#e6b93d' : '#c0392b';
  const sled = mut.has('a6') ? '' : '<line x1="462" y1="486" x2="538" y2="486" stroke="#6e4525" stroke-width="3"/><line x1="462" y1="492" x2="538" y2="492" stroke="#6e4525" stroke-width="3"/><rect x="470" y="472" width="16" height="6" fill="#8a5a33"/><rect x="492" y="472" width="16" height="6" fill="#8a5a33"/><rect x="514" y="472" width="16" height="6" fill="#8a5a33"/><line x1="538" y1="478" x2="566" y2="462" stroke="#8a5a33" stroke-width="2"/>';
  const nose = mut.has('a8') ? '' : '<polygon points="99,507 112,510 99,512" fill="#e67e22"/>';
  return `<ellipse cx="300" cy="548" rx="140" ry="26" fill="#bcd8ee"/><ellipse cx="300" cy="542" rx="90" ry="12" fill="#ffffff" opacity="0.35"/><circle cx="300" cy="498" r="7" fill="#f2c79b"/><polygon points="292,508 308,508 314,534 286,534" fill="#33548a"/><line x1="296" y1="534" x2="288" y2="548" stroke="#26355e" stroke-width="4"/><line x1="304" y1="534" x2="314" y2="546" stroke="#26355e" stroke-width="4"/><rect x="292" y="505" width="18" height="7" fill="${scarf}"/>${sled}<circle cx="90" cy="556" r="19" fill="#ffffff" stroke="#c9d6e8"/><circle cx="90" cy="528" r="14" fill="#ffffff" stroke="#c9d6e8"/><circle cx="90" cy="507" r="9" fill="#ffffff" stroke="#c9d6e8"/><circle cx="87" cy="505" r="1.6" fill="#22293d"/><circle cx="93" cy="505" r="1.6" fill="#22293d"/>${nose}<line x1="78" y1="526" x2="58" y2="514" stroke="#6e4525" stroke-width="3"/><line x1="102" y1="526" x2="120" y2="516" stroke="#6e4525" stroke-width="3"/><polygon points="30,428 52,382 74,428" fill="#2e6b4f"/><polygon points="544,404 566,358 588,404" fill="#2e6b4f"/><polygon points="434,352 452,318 470,352" fill="#2e6b4f"/><circle cx="250" cy="452" r="14" fill="url(#alpine-sun)"/><rect x="244" y="443" width="12" height="18" rx="4" fill="#ffb347" stroke="#8a5a1d"/><circle cx="392" cy="448" r="14" fill="url(#alpine-sun)"/><rect x="386" y="439" width="12" height="18" rx="4" fill="#ffb347" stroke="#8a5a1d"/><circle cx="150" cy="150" r="2.5" fill="#ffffff" opacity="0.75"/><circle cx="260" cy="90" r="2" fill="#ffffff" opacity="0.75"/><circle cx="480" cy="180" r="2.5" fill="#ffffff" opacity="0.75"/><circle cx="70" cy="240" r="2" fill="#ffffff" opacity="0.75"/><circle cx="560" cy="300" r="2.5" fill="#ffffff" opacity="0.75"/><circle cx="350" cy="420" r="2" fill="#ffffff" opacity="0.75"/>`;
};
function drawAlpineFixed(mut) { return ALPINE_A(mut) + ALPINE_B(mut) + ALPINE_C(mut); }
const alpineSceneRef = SCENES.find((s) => s.id === "alpine");
if (alpineSceneRef) alpineSceneRef.draw = drawAlpineFixed;
// Market mid-ground set dressing: stalls, lanterns, crowd silhouettes.
// Market mid-ground set dressing: stalls, lanterns, crowd silhouettes.
const MARKET2 = `<path d="M20,250 Q310,282 600,250" stroke="#0e1430" stroke-width="2" fill="none"/><circle cx="70" cy="277" r="16" fill="#ffd76a" opacity="0.25"/><line x1="70" y1="256" x2="70" y2="266" stroke="#0e1430" stroke-width="2"/><rect x="62" y="266" width="16" height="22" rx="5" fill="#ffb347"/><circle cx="170" cy="283" r="16" fill="#ffd76a" opacity="0.25"/><line x1="170" y1="262" x2="170" y2="272" stroke="#0e1430" stroke-width="2"/><rect x="162" y="272" width="16" height="22" rx="5" fill="#e2543e"/><circle cx="280" cy="286" r="16" fill="#ffd76a" opacity="0.25"/><line x1="280" y1="265" x2="280" y2="275" stroke="#0e1430" stroke-width="2"/><rect x="272" y="275" width="16" height="22" rx="5" fill="#ffb347"/><circle cx="395" cy="284" r="16" fill="#ffd76a" opacity="0.25"/><line x1="395" y1="263" x2="395" y2="273" stroke="#0e1430" stroke-width="2"/><rect x="387" y="273" width="16" height="22" rx="5" fill="#e2543e"/><circle cx="505" cy="280" r="16" fill="#ffd76a" opacity="0.25"/><line x1="505" y1="259" x2="505" y2="269" stroke="#0e1430" stroke-width="2"/><rect x="497" y="269" width="16" height="22" rx="5" fill="#ffb347"/><rect x="48" y="396" width="6" height="56" fill="#4a2e1a"/><rect x="172" y="396" width="6" height="56" fill="#4a2e1a"/><rect x="40" y="372" width="50" height="24" fill="#b6502e"/><rect x="90" y="372" width="50" height="24" fill="#f3ead2"/><rect x="140" y="372" width="50" height="24" fill="#1f8a70"/><rect x="36" y="440" width="160" height="14" fill="#6e4525"/><circle cx="70" cy="432" r="5" fill="#ffb347"/><circle cx="110" cy="430" r="5" fill="#e2543e"/><circle cx="150" cy="432" r="5" fill="#1f8a70"/><rect x="258" y="412" width="6" height="56" fill="#4a2e1a"/><rect x="386" y="412" width="6" height="56" fill="#4a2e1a"/><rect x="250" y="388" width="50" height="24" fill="#1f8a70"/><rect x="300" y="388" width="50" height="24" fill="#b6502e"/><rect x="350" y="388" width="50" height="24" fill="#f3ead2"/><rect x="246" y="456" width="160" height="14" fill="#6e4525"/><circle cx="280" cy="448" r="5" fill="#ffb347"/><circle cx="320" cy="446" r="5" fill="#e2543e"/><circle cx="360" cy="448" r="5" fill="#1f8a70"/><rect x="460" y="396" width="6" height="56" fill="#4a2e1a"/><rect x="578" y="396" width="6" height="56" fill="#4a2e1a"/><rect x="452" y="372" width="47" height="24" fill="#f3ead2"/><rect x="499" y="372" width="47" height="24" fill="#b6502e"/><rect x="546" y="372" width="46" height="24" fill="#1f8a70"/><rect x="448" y="440" width="148" height="14" fill="#6e4525"/><circle cx="485" cy="432" r="5" fill="#ffb347"/><circle cx="525" cy="430" r="5" fill="#e2543e"/><circle cx="560" cy="432" r="5" fill="#1f8a70"/><circle cx="150" cy="470" r="8" fill="#141c38"/><rect x="141" y="478" width="18" height="30" rx="7" fill="#141c38"/><circle cx="330" cy="484" r="8" fill="#141c38"/><rect x="321" y="492" width="18" height="30" rx="7" fill="#141c38"/><circle cx="486" cy="474" r="8" fill="#141c38"/><rect x="477" y="482" width="18" height="30" rx="7" fill="#141c38"/><ellipse cx="120" cy="446" rx="11" ry="7" fill="#0e1430"/><circle cx="131" cy="440" r="5" fill="#0e1430"/><ellipse cx="520" cy="446" rx="11" ry="7" fill="#0e1430"/><circle cx="531" cy="440" r="5" fill="#0e1430"/>`;
const marketSceneRef = SCENES.find((s) => s.id === 'market');
if (marketSceneRef) { const prevDraw = marketSceneRef.draw; marketSceneRef.draw = (mut) => prevDraw(mut) + MARKET2; }
