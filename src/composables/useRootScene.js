import * as THREE from 'three'
import { ROOT_SQUAD_LOGO } from '../data/logo'

export function initRootScene() {
'use strict';
var canvas = document.getElementById('gl');
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var renderer = null;
try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' }); } catch (e) { renderer = null; }
if (!renderer || !ROOT_SQUAD_LOGO) { document.body.classList.add('nogl'); return; }

var C = { black: 0x0e1118, green: 0x39ff88, mint: 0xa7f3cf, white: 0xf4f7f5, graphite: 0x242b33, teal: 0x00e5c3 };
var SP = 22;            // vertical distance between stages
var N = 5;              // hero, services, portfolio, team, contact
var GROUND = 55;        // soil line
var TRUNK_TOP = 100;
var CROWN_Y = 124;
var clamp = function (x, a, b) { return Math.min(b, Math.max(a, x)); };
var ss = function (a, b, x) { x = clamp((x - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); };
var lerp = function (a, b, t) { return a + (b - a) * t; };
var rnd = (function () { var s = 7; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })();

renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 760 ? 1.25 : 1.5));
renderer.setClearColor(C.black, 1);
var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(C.black, 0.03);
var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 400);
scene.add(camera);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
var key = new THREE.DirectionalLight(0xffffff, 0.75); key.position.set(4, 8, 8); scene.add(key);
var camLight = new THREE.PointLight(0x9fffd0, 0.7, 30); camLight.position.set(0, 1, 2); camera.add(camLight);

/* ---------- helpers ---------- */
function glowMat(c, i) { return new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i, roughness: 0.4, metalness: 0.15 }); }
function hexPt(r, k) { var a = Math.PI / 2 + k * Math.PI / 3; return [r * Math.cos(a), r * Math.sin(a)]; }
function hexRing(R, w, depth, mat) {
  var sh = new THREE.Shape(), k, p;
  for (k = 0; k < 6; k++) { p = hexPt(R, k); if (k) sh.lineTo(p[0], p[1]); else sh.moveTo(p[0], p[1]); }
  sh.closePath();
  var Ri = R - w / Math.cos(Math.PI / 6), hole = new THREE.Path();
  for (k = 0; k < 6; k++) { p = hexPt(Ri, 5 - k); if (k) hole.lineTo(p[0], p[1]); else hole.moveTo(p[0], p[1]); }
  hole.closePath();
  sh.holes.push(hole);
  var geo = new THREE.ExtrudeGeometry(sh, { depth: depth, bevelEnabled: false });
  geo.translate(0, 0, -depth / 2);
  return new THREE.Mesh(geo, mat);
}
function hexPrism(R, h, mat) { var g = new THREE.CylinderGeometry(R, R, h, 6); g.rotateX(Math.PI / 2); return new THREE.Mesh(g, mat); }
function edgesOf(mesh, color, opacity) {
  return new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: opacity == null ? 1 : opacity }));
}
function leafShape(w, l) {
  var s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(w, l * 0.18, w * 0.95, l * 0.72, 0, l);
  s.bezierCurveTo(-w * 0.95, l * 0.72, -w, l * 0.18, 0, 0);
  return s;
}

/* ---------- the logo, rebuilt in 3D from the traced brand mark ---------- */
function makeLogo(glow) {
  var LG = ROOT_SQUAD_LOGO, g = new THREE.Group();
  var mat = glowMat(C.green, (glow == null ? 0.95 : glow) * 0.5);
  var outer = hexRing(1.03, 0.042, 0.14, mat);
  var inner = hexRing(LG.ratio + 0.022, 0.042, 0.12, mat);
  var plate = hexPrism(0.84, 0.05, new THREE.MeshStandardMaterial({ color: C.graphite, roughness: 0.7, metalness: 0.2, transparent: true, opacity: 0.6 }));
  plate.position.z = -0.12;
  g.add(plate); g.add(outer); g.add(inner);
  var segs = LG.segments.map(function (s) {
    s = s.slice();
    if (s[0][1] > s[s.length - 1][1]) s.reverse();
    return s;
  }).sort(function (a, b) { return a[0][1] - b[0][1]; });
  var br = segs.map(function (s, i) {
    var z0 = (((i * 37) % 7) - 3) * 0.012;
    var pts = s.map(function (p) { return new THREE.Vector3(p[0], p[1], z0); });
    var curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    var geo = new THREE.TubeGeometry(curve, Math.max(12, Math.round(curve.getLength() * 70)), 0.022, 8, false);
    var grp = new THREE.Group(), mesh = new THREE.Mesh(geo, mat), cg = new THREE.SphereGeometry(0.022, 10, 10);
    var a = new THREE.Mesh(cg, mat), b = new THREE.Mesh(cg, mat);
    a.position.copy(pts[0]); b.position.copy(pts[pts.length - 1]);
    grp.add(mesh); grp.add(a); grp.add(b); g.add(grp);
    return { grp: grp, mesh: mesh, geo: geo, count: geo.index.count, capA: a, capB: b };
  });
  function setGrow(p) {
    var n = br.length, e = ss(0, 0.3, p);
    outer.scale.setScalar(0.75 + 0.25 * e); inner.scale.setScalar(0.75 + 0.25 * e);
    outer.visible = inner.visible = plate.visible = p > 0.01;
    br.forEach(function (b, i) {
      var st = (i / n) * 0.5, local = clamp((p - 0.12 - st) / 0.38, 0, 1);
      b.geo.setDrawRange(0, Math.floor(b.count * local / 3) * 3);
      b.mesh.visible = local > 0; b.capA.visible = local > 0; b.capB.visible = local >= 1;
    });
  }
  function setExplode(e) {
    outer.position.z = e * 1.6; inner.position.z = e * 0.8; plate.position.z = -0.12 - e * 1.2;
    br.forEach(function (b, i) { b.grp.position.z = (i / br.length - 0.5) * e * 2.2; });
  }
  setGrow(1);
  return { group: g, setGrow: setGrow, setExplode: setExplode };
}

/* ---------- soft dust ---------- */
var circle = (function () {
  var c = document.createElement('canvas'); c.width = c.height = 64;
  var x = c.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(255,255,255,.4)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
})();
var dustN = window.innerWidth < 760 ? 36 : 72, dpos = new Float32Array(dustN * 3), dcol = new Float32Array(dustN * 3);
var gcol = new THREE.Color(C.green), tcol = new THREE.Color(C.teal), mcol = new THREE.Color(C.mint), tmpc = new THREE.Color();
for (var di = 0; di < dustN; di++) {
  dpos[di * 3] = (Math.random() - 0.5) * 70;
  dpos[di * 3 + 1] = -6 + Math.random() * 205;
  dpos[di * 3 + 2] = (Math.random() - 0.5) * 60;
  var rr = Math.random();
  tmpc.copy(rr < 0.55 ? gcol : rr < 0.8 ? tcol : mcol);
  dcol[di * 3] = tmpc.r; dcol[di * 3 + 1] = tmpc.g; dcol[di * 3 + 2] = tmpc.b;
}
var dgeo = new THREE.BufferGeometry();
dgeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
dgeo.setAttribute('color', new THREE.BufferAttribute(dcol, 3));
var dust = new THREE.Points(dgeo, new THREE.PointsMaterial({ size: 0.2, map: circle, vertexColors: true, transparent: true, opacity: 0.12, depthWrite: false, blending: THREE.AdditiveBlending }));
scene.add(dust);

/* ---------- one faint vertical thread through all stages (the only trace of the tree idea) ---------- */
var MEMBER_COL = [C.green, C.mint, C.white, C.teal];
var STRAND_COL = [0x2fa86a, 0x6fb89f, 0xa9b6b2, 0x23917f];
function strandPoint(k, t) {
  var ang = k * Math.PI / 2 + t * Math.PI * 1.1 + 0.4;
  var r = lerp(7.5, 1.6, t) * (1 + 0.22 * Math.sin(t * 9 + k * 1.7));
  return new THREE.Vector3(Math.cos(ang) * r, t * GROUND, Math.sin(ang) * r);
}
var strandCurves = [], pulses = [];
scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -12, -3), new THREE.Vector3(0, 200, -3)]),
  new THREE.LineBasicMaterial({ color: C.green, transparent: true, opacity: 0.16 })));

/* ---------- portfolio: five floating 3D screens ---------- */
var crown = new THREE.Group(); crown.position.y = SP; scene.add(crown);   // portfolio screens now sit on stage 2
var PROJ = [
  { a: [-4.6, 18.5, -1], tone: [0x39ff88, 0x0e3a28] },
  { a: [1.2, 23.0, -5], tone: [0xa7f3cf, 0x1b3a3a] },
  { a: [7.6, 19.5, -2], tone: [0x00e5c3, 0x0c2f33] },
  { a: [-2.5, 26.0, -8], tone: [0xf4f7f5, 0x2a323b] },
  { a: [5.8, 25.0, -8.5], tone: [0x39ff88, 0x16301f] },
  { a: [-7.2, 22.4, -5.5], tone: [0xa7f3cf, 0x1d3430] }
];
function thumbTexture(i, tone) {
  var c = document.createElement('canvas'); c.width = 512; c.height = 330;
  var x = c.getContext('2d'), a = '#' + ('000000' + tone[0].toString(16)).slice(-6);
  var g = x.createLinearGradient(0, 0, 512, 330); g.addColorStop(0, '#' + ('000000' + tone[1].toString(16)).slice(-6)); g.addColorStop(1, '#0e1118');
  x.fillStyle = g; x.fillRect(0, 0, 512, 330);
  x.fillStyle = 'rgba(255,255,255,.12)'; x.fillRect(0, 0, 512, 34);
  [0, 1, 2].forEach(function (k) { x.beginPath(); x.arc(22 + k * 18, 17, 5, 0, 7); x.fillStyle = k ? 'rgba(255,255,255,.35)' : a; x.fill(); });
  x.strokeStyle = a; x.lineWidth = 3; x.beginPath();
  for (var k = 0; k < 6; k++) { var an = Math.PI / 6 + k * Math.PI / 3, px = 256 + 62 * Math.cos(an), py = 138 + 62 * Math.sin(an); if (k) x.lineTo(px, py); else x.moveTo(px, py); }
  x.closePath(); x.stroke();
  x.fillStyle = 'rgba(255,255,255,.85)'; x.fillRect(176, 222, 160, 10);
  x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(206, 244, 100, 8);
  for (var j = 0; j < 3; j++) { x.fillStyle = 'rgba(255,255,255,.1)'; x.fillRect(40 + j * 150, 270, 130, 36); }
  x.fillStyle = a; x.fillRect(40 + (i % 3) * 150, 270, 130, 4);
  var t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t;
}
var leaves = PROJ.map(function (P, i) {
  var g = new THREE.Group();
  var tex = thumbTexture(i, P.tone);
  var side = new THREE.MeshStandardMaterial({ color: C.graphite, roughness: 0.6 });
  var face = new THREE.MeshStandardMaterial({ color: 0xffffff, map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.55, roughness: 0.5, fog: false });
  var slab = new THREE.Mesh(new THREE.BoxGeometry(4.4, 2.5, 0.14), [side, side, side, side, face, side]);
  var edge = edgesOf(slab, P.tone[0], 0.55);
  g.add(slab); g.add(edge);
  g.position.set(P.a[0], P.a[1] + 2.5, P.a[2]);
  g.rotation.y = -Math.sign(P.a[0] || 1) * 0.28;
  crown.add(g);
  return { g: g, slab: slab, base: g.position.clone(), rz: 0, ry: g.rotation.y, lift: 0, edge: edge, face: face, ph: i * 1.7, thumb: tex };
});

/* project page screenshots (public/projects/*.webp). Screens show the original placeholder at rest;
   while a project is hovered in the list, its pages appear across the screens (starting from its own card).
   To add pages for a project, drop more images in public/projects and list their names here. */
var PROJ_SHOTS = [
  ['sanaa1','sanaa2','sanaa3','sanaa4','sanaa5','sanaa6',],
  ['delyar1','delyar2','delyar3','delyar4','delyar5','delyar6',],
  ['jenna1','jenna2','jenna3','jenna4','jenna5','jenna6',],
  ['hafezi1','hafezi2','hafezi3','hafezi4','hafezi5','hafezi6',],
  ['mon1', 'mon2','mon3','mon4','mon5','mon6',],
  ['manamehr1','manamehr2','manamehr3','manamehr4','manamehr5','manamehr6',]
];
var shotTex = PROJ_SHOTS.map(function (list) { return list.map(function () { return null; }); });
function loadProjectShots() {
  var base = (import.meta.env && import.meta.env.BASE_URL) || '/';
  var loader = new THREE.TextureLoader();
  PROJ_SHOTS.forEach(function (list, pi) {
    list.forEach(function (name, k) {
      loader.load(base + 'projects/' + name + '.webp', function (tex) { tex.anisotropy = 8; tex.encoding = THREE.sRGBEncoding; shotTex[pi][k] = tex; });
    });
  });
}
(function () {
  var workEl = document.getElementById('work');
  if ('IntersectionObserver' in window && workEl) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); loadProjectShots(); }
    }, { rootMargin: '0px 0px 150% 0px' });
    io.observe(workEl);
  } else { setTimeout(loadProjectShots, 2000); }
})();

/* ---------- team: four photo cards, each with a name underneath ----------
   To use real photos, put a picture (data URI or file path) in `photo` and the name in `name`. */
var teamCopy = window.RootSquadCopy || {};
var TEAM = [
  { name: teamCopy.member1 || 'نام عضو اول', role: teamCopy.member1Role || 'تخصص', photo: null },
  { name: teamCopy.member2 || 'نام عضو دوم', role: teamCopy.member2Role || 'تخصص', photo: null },
  { name: teamCopy.member3 || 'نام عضو سوم', role: teamCopy.member3Role || 'تخصص', photo: null },
  { name: teamCopy.member4 || 'نام عضو چهارم', role: teamCopy.member4Role || 'تخصص', photo: null }
];
var TEAM_Y = SP * 3;
var members = [];
function hexHex(r) { return new THREE.CircleGeometry(r, 6, Math.PI / 6, Math.PI * 2); }
function coverTexture(img, size) {
  var c = document.createElement('canvas'); c.width = c.height = size;
  var x = c.getContext('2d'), s = Math.max(size / img.width, size / img.height), w = img.width * s, h = img.height * s;
  x.drawImage(img, (size - w) / 2, (size - h) / 2 * 0.7, w, h);   // crop toward the top so faces stay in frame
  var t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t;
}
function silhouetteTexture(col) {
  var c = document.createElement('canvas'); c.width = c.height = 512;
  var x = c.getContext('2d'), hex = '#' + ('000000' + col.toString(16)).slice(-6);
  var g = x.createLinearGradient(0, 0, 0, 512); g.addColorStop(0, '#42524f'); g.addColorStop(1, '#1d282c');
  x.fillStyle = g; x.fillRect(0, 0, 512, 512);
  x.fillStyle = hex; x.globalAlpha = 0.8;
  x.beginPath(); x.arc(256, 205, 78, 0, 7); x.fill();
  x.beginPath(); x.ellipse(256, 470, 150, 120, 0, Math.PI, 0); x.fill();
  var t = new THREE.CanvasTexture(c); return t;
}
function labelTexture(name, role) {
  var c = document.createElement('canvas'); c.width = 768; c.height = 200;
  var x = c.getContext('2d');
  x.clearRect(0, 0, 768, 200);
  x.textAlign = 'center'; x.direction = 'rtl'; x.textBaseline = 'middle';
  x.fillStyle = '#f4f7f5';
  var size = 70;   // shrink long names until they fit inside the label
  do { x.font = '800 ' + size + 'px "Madani Arabic", Tahoma, "Segoe UI", sans-serif'; size -= 2; } while (size > 30 && x.measureText(name).width > 720);
  x.fillText(name, 384, 82);
  if (role) { x.fillStyle = '#39ff88'; x.font = '400 38px "Madani Arabic", Tahoma, "Segoe UI", sans-serif'; x.fillText(role, 384, 152); }
  var t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t;
}
TEAM.forEach(function (T, i) {
  var col = MEMBER_COL[i], g = new THREE.Group(), R = 1.25;
  var plateGeo = new THREE.CylinderGeometry(R + 0.16, R + 0.16, 0.38, 6); plateGeo.rotateX(Math.PI / 2);   // hexagonal prism = real 3D thickness
  var plate = new THREE.Mesh(plateGeo, new THREE.MeshStandardMaterial({ color: 0x3a524a, roughness: 0.38, metalness: 0.35, emissive: 0x0d2a20, emissiveIntensity: 0.6 }));
  plate.position.z = -0.21; plate.userData.i = i;
  var photoMat = new THREE.MeshBasicMaterial({ map: silhouetteTexture(col), toneMapped: false });
  var photo = new THREE.Mesh(hexHex(R), photoMat);
  var frame = hexRing(R + 0.16, 0.05, 0.04, glowMat(col, 1.0));
  var ring = hexRing(R + 0.3, 0.018, 0.02, new THREE.MeshStandardMaterial({ color: 0x000000, emissive: col, emissiveIntensity: 0.9 }));
  var lblTex = labelTexture(T.name, T.role);
  var label = new THREE.Mesh(new THREE.PlaneGeometry(3.3, 0.86), new THREE.MeshBasicMaterial({ map: lblTex, transparent: true, depthWrite: false, toneMapped: false }));
  label.position.set(0, -R - 0.72, 0.02); label.userData.i = i;
  var inner = new THREE.Group();
  inner.add(plate); inner.add(photo); inner.add(frame); inner.add(ring); inner.add(label);
  g.add(inner);
  g.position.set(0, TEAM_Y, 0);
  scene.add(g);
  var m = { g: g, inner: inner, halo: new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial()), badge: new THREE.Object3D(), ring: ring,
            skin: new THREE.MeshStandardMaterial(), label: label, lift: 0, base: g.position.clone(), a: 0, i: i, photoMat: photoMat, lblTex: lblTex, T: T, plate: plate };
  members.push(m);
  if (T.photo) {
    var img = new Image();
    img.onload = function () { photoMat.map = coverTexture(img, 640); photoMat.needsUpdate = true; };
    img.src = T.photo;
  }
});
var teamScale = 1.3, lastVis = -1;
function layoutTeam(wide) {
  var rtl = document.documentElement.dir !== 'ltr';
  teamScale = wide ? 1.3 : 1.12;
  var xs = wide ? [[-2.7, 1.3], [-1.2, 2.8]] : [[-2.45, 1.15], [-1.15, 2.45]];    // room for the full name labels between columns
  var ys = wide ? [3.65, -2.25] : [-5.2, -10.2];
  var shift = wide ? 0.4 : 0;
  members.forEach(function (m) {
    var row = m.i >> 1, col = m.i & 1, x = xs[row][rtl ? 1 - col : col] + shift;
    m.base.set(x, TEAM_Y + ys[row], 0);
    m.g.rotation.y = (x < shift ? 1 : -1) * 0.1;
  });
}
layoutTeam(window.innerWidth > 760);
function redrawTeamLabels() {
  members.forEach(function (m) {
    var nt = labelTexture(m.T.name, m.T.role); m.lblTex.image = nt.image; m.lblTex.needsUpdate = true;
  });
}
// redraw the name labels once the page font is ready and whenever the language changes
if (document.fonts && document.fonts.ready) document.fonts.ready.then(redrawTeamLabels);
window.addEventListener('rootsquad:language', function (event) {
  var copy = event.detail && event.detail.copy ? event.detail.copy : window.RootSquadCopy || {};
  TEAM.forEach(function (member, i) { member.name = copy['member' + (i + 1)] || member.name; member.role = copy['member' + (i + 1) + 'Role'] || member.role; });
  redrawTeamLabels();
  layoutTeam(window.innerWidth > 760);
});

/* ---------- remaining stage objects ---------- */
var mouse = { x: 0, y: 0, tx: 0, ty: 0 };
var stageY = function (i) { return i * SP; };

// 0 hero: the logo as the seed at the tips of the roots
var hero = makeLogo(0.85); hero.group.scale.setScalar(3); hero.group.position.set(0, stageY(0), 0); scene.add(hero.group);
var heroField = new THREE.Group(), heroFragments = [];
[
  [-5.8, 2.9, -2.8, .44], [-4.1, -2.6, 1.1, .28], [-2.6, 4.6, -5.2, .22],
  [3.1, 3.7, -3.4, .31], [5.2, -2.2, -4.8, .24], [7.1, 1.7, -8.2, .18]
].forEach(function (v, i) {
  var mat = new THREE.MeshBasicMaterial({ color: i % 2 ? C.mint : C.green, transparent: true, opacity: v[3], depthWrite: false });
  var h = hexRing(0.32 + i * 0.055, 0.018, 0.012, mat);
  h.position.set(v[0], v[1], v[2]);
  h.rotation.set(i * .38, i * .27, i * .6);
  heroField.add(h); heroFragments.push({ m: h, by: v[1], phase: i * 1.17 });
});
var heroThreadMat = new THREE.LineBasicMaterial({ color: C.green, transparent: true, opacity: .16 });
var heroThread = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(-6.2, -1.2, -3), new THREE.Vector3(-3.4, .8, -1), new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(3.3, 1.2, -2.5), new THREE.Vector3(7.3, -.2, -7)
]), heroThreadMat);
heroField.add(heroThread); heroField.position.y = stageY(0); scene.add(heroField);
var heroAura = new THREE.PointLight(C.green, 1.15, 24); heroAura.position.set(-1, stageY(0) + 1, 5); scene.add(heroAura);
var heroT0 = performance.now();

// 3 contact: the brand mark returns as a quiet conclusion.
var endLogo = makeLogo(0.72); endLogo.group.scale.setScalar(2.45); endLogo.group.position.set(-4.8, stageY(4) + 1.1, -4.5); scene.add(endLogo.group);

/* services: a hexagon core with nested rings and small prisms orbiting it */
var svc = (function () {
  var g = new THREE.Group(); g.position.set(0.3, stageY(1) + 0.3, -3); scene.add(g);
  var rings = [], sats = [], i;
  for (i = 0; i < 5; i++) {
    var rm = new THREE.MeshBasicMaterial({ color: i % 2 ? C.mint : C.green, transparent: true, opacity: 0.62 - i * 0.07, depthWrite: false });
    var r = hexRing(1.5 + i * 0.8, 0.035 + i * 0.006, 0.04, rm);
    r.userData = { r0: i * 0.26, sp: (i % 2 ? -1 : 1) * (0.08 + i * 0.035) };
    g.add(r); rings.push(r);
  }
  var core = hexPrism(0.95, 0.55, glowMat(C.green, 0.6)); g.add(core);
  var cols = [C.mint, C.teal, C.green, C.white];
  for (i = 0; i < 4; i++) { var s = hexPrism(0.34, 0.22, glowMat(cols[i], 0.75)); g.add(s); sats.push(s); }
  return { g: g, rings: rings, sats: sats, core: core };
})();

/* ---------- interactions from the text panels ---------- */
var hoverMember = -1, hoverLeaf = -1;
function bindList(sel, setter) {
  document.querySelectorAll(sel + ' button').forEach(function (b) {
    var i = +b.dataset.h;
    var on = function () { setter(i); document.querySelectorAll(sel + ' button').forEach(function (x) { x.classList.toggle('on', x === b); }); };
    var off = function () { setter(-1); b.classList.remove('on'); };
    b.addEventListener('mouseenter', on); b.addEventListener('focus', on); b.addEventListener('click', on);
    b.addEventListener('mouseleave', off); b.addEventListener('blur', off);
  });
}
bindList('#teamList', function (i) { hoverMember = i; });
bindList('#projectList', function (i) { hoverLeaf = i; });

/* team hexagons: hover and click straight on the 3D photos -> opens the same detail popup */
var hexRay = new THREE.Raycaster(), hexNdc = new THREE.Vector2(), hexPlates = members.map(function (m) { return m.plate; }).concat(members.map(function (m) { return m.label; })), hexOver = -1;
function pickHex(e) {
  var mobileView = window.innerWidth <= 760;
  if (Math.abs(sCur - 3) > (mobileView ? 0.55 : 0.3) || document.body.classList.contains('modal-open')) return -1;
  if (e.target && e.target.closest && e.target.closest('button, a, input, textarea, label, .lang-switch, .rail, .menu-toggle, .detail-modal')) return -1;
  hexNdc.set(e.clientX / window.innerWidth * 2 - 1, -(e.clientY / window.innerHeight * 2 - 1));
  hexRay.setFromCamera(hexNdc, camera);
  var hit = hexRay.intersectObjects(hexPlates, false);
  return hit.length ? hit[0].object.userData.i : -1;
}
window.addEventListener('pointermove', function (e) {
  var i = pickHex(e);
  if (i === hexOver) return;
  hexOver = i; hoverMember = i;
  var cur = document.getElementById('cur'); if (cur) cur.classList.toggle('big', i >= 0);
  document.body.style.cursor = i >= 0 ? 'pointer' : '';
}, { passive: true });
function openMember(i) {
  var b = document.querySelector('#teamList button[data-h="' + i + '"]'); if (b) b.click();
}
window.addEventListener('click', function (e) {
  if (e.pointerType === 'touch' || e.detail === 0) return;   // touch taps are handled below
  var i = pickHex(e); if (i >= 0) openMember(i);
});
// touch: a short tap without movement opens the member popup (click on a bare canvas area is unreliable on phones)
var tapStart = null;
window.addEventListener('pointerdown', function (e) {
  tapStart = e.pointerType === 'touch' ? { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId } : null;
}, { passive: true });
window.addEventListener('pointercancel', function () { tapStart = null; }, { passive: true });
window.addEventListener('pointerup', function (e) {
  var st = tapStart; tapStart = null;
  if (!st || e.pointerType !== 'touch' || st.id !== e.pointerId) return;
  if (Math.hypot(e.clientX - st.x, e.clientY - st.y) > 12 || performance.now() - st.t > 600) return;
  var i = pickHex(e); if (i < 0) return;
  hoverMember = i; setTimeout(function () { hoverMember = -1; }, 400);
  openMember(i);
}, { passive: true });
window.addEventListener('pointermove', function (e) {
  mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
}, { passive: true });

/* ---------- motion layer: orbits, ripples, drifting hex outlines, wave floor ---------- */
function makeOrbit(y) {
  var g = new THREE.Group(); g.position.set(0, y, 0);
  var rings = [];
  [[3.0, 0.1], [3.7, 0.9], [4.5, 1.7]].forEach(function (cfg, i) {
    var m = new THREE.Mesh(new THREE.TorusGeometry(cfg[0], 0.012, 6, 120), glowMat(i === 1 ? C.mint : C.green, 0.45));
    m.rotation.set(0.9 + i * 0.5, i * 0.7 - 0.4, cfg[1]);
    var bead = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), glowMat(C.white, 0.9));
    m.add(bead);
    g.add(m); rings.push({ m: m, bead: bead, r: cfg[0], sp: 0.35 + i * 0.17, ph: i * 2.1 });
  });
  scene.add(g);
  return { g: g, rings: rings };
}
function makeRipples(y) {
  var g = new THREE.Group(); g.position.set(0, y, -0.4);
  var rs = [];
  for (var i = 0; i < 3; i++) {
    var mat = new THREE.MeshBasicMaterial({ color: C.green, transparent: true, opacity: 0, depthWrite: false });
    var m = hexRing(1.0, 0.018, 0.01, mat);
    g.add(m); rs.push({ m: m, mat: mat, off: i / 3 });
  }
  scene.add(g);
  return { g: g, rs: rs };
}
var orbitHero = makeOrbit(stageY(0)), orbitEnd = makeOrbit(stageY(4));
var ripHero = makeRipples(stageY(0)), ripEnd = makeRipples(stageY(4));

// drifting hexagon outlines at different depths
var shards = [];
(function () {
  var matA = new THREE.MeshBasicMaterial({ color: C.green, transparent: true, opacity: 0.12, depthWrite: false });
  var matB = new THREE.MeshBasicMaterial({ color: C.mint, transparent: true, opacity: 0.08, depthWrite: false });
  for (var i = 0; i < 10; i++) {
    var R = 0.7 + rnd() * 1.7, m = hexRing(R, 0.035 + R * 0.01, 0.02, i % 3 ? matA : matB);
    m.position.set((rnd() - 0.5) * 46, stageY(0) + rnd() * stageY(4), -6 - rnd() * 22);
    m.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
    scene.add(m);
    shards.push({ m: m, rx: (rnd() - 0.5) * 0.5, ry: (rnd() - 0.5) * 0.6, rz: (rnd() - 0.5) * 0.4, by: m.position.y, ph: rnd() * 6, amp: 0.4 + rnd() * 0.8 });
  }
})();

// dotted hexagonal floor that ripples, always a little below the camera
var GRID = 52, GSP = 1.3, HEX_ROW = GSP * Math.sqrt(3) / 2, floorPts = new Float32Array(GRID * GRID * 3);
(function () {
  for (var i = 0, a = 0; a < GRID; a++) for (var b = 0; b < GRID; b++, i += 3) {
    floorPts[i] = (a - GRID / 2) * GSP + (b % 2) * GSP * 0.5;
    floorPts[i + 1] = 0;
    floorPts[i + 2] = (b - GRID / 2) * HEX_ROW;
  }
})();
var floorGeo = new THREE.BufferGeometry();
floorGeo.setAttribute('position', new THREE.BufferAttribute(floorPts, 3));
var floor = new THREE.Points(floorGeo, new THREE.PointsMaterial({ size: 0.1, map: circle, color: C.green, transparent: true, opacity: 0.38, depthWrite: false, blending: THREE.AdditiveBlending }));
floor.frustumCulled = false;
scene.add(floor);

function fxUpdate(sCur, t, dt, camY) {
  // floor wave
  floor.position.set(0, camY - 10, -14);
  var p = floorPts, i = 0, a, b;
  for (a = 0; a < GRID; a++) for (b = 0; b < GRID; b++, i += 3) {
    var x = p[i], z = p[i + 2];
    p[i + 1] = Math.sin(x * 0.28 + t * 1.1) * 0.55 + Math.cos(z * 0.24 - t * 0.9) * 0.55 + Math.sin((x + z) * 0.12 + t * 0.5) * 0.4;
  }
  floorGeo.attributes.position.needsUpdate = true;

  // drifting outlines
  shards.forEach(function (s) {
    s.m.rotation.x += s.rx * dt; s.m.rotation.y += s.ry * dt; s.m.rotation.z += s.rz * dt;
    s.m.position.y = s.by + Math.sin(t * 0.4 + s.ph) * s.amp;
  });

  // orbits and ripples around the first and last logo
  [[orbitHero, ripHero, 0], [orbitEnd, ripEnd, 4]].forEach(function (o) {
    var act = clamp(1 - Math.abs(sCur - o[2]) * 1.1, 0, 1), vis = act > 0.01;
    o[0].g.visible = vis; o[1].g.visible = vis;
    if (!vis) return;
    var e = ss(0, 0.8, act);
    o[0].g.scale.setScalar(0.6 + 0.4 * e);
    o[0].g.rotation.y = t * 0.12; o[0].g.rotation.x = Math.sin(t * 0.3) * 0.12;
    o[0].rings.forEach(function (r) {
      var an = t * r.sp + r.ph;
      r.bead.position.set(Math.cos(an) * r.r, Math.sin(an) * r.r, 0);
    });
    o[1].rs.forEach(function (r) {
      var ph = (t * 0.28 + r.off) % 1;
      r.m.scale.setScalar(2.4 + ph * 6.5);
      r.mat.opacity = (1 - ph) * (1 - ph) * 0.35 * e;
    });
  });
}

/* ---------- camera route through the four-section environment ---------- */
var CAMS = [
  { p: [0, 1, 19], t: [0, 0, 0] },          // 0 hero
  { p: [0, 1.5, 18], t: [0, 0.5, -2] },    // 1 services
  { p: [0, 2, 18], t: [0, 1, -3] },         // 1 portfolio screens
  { p: [0, 1, 17], t: [0, 0, -2] },         // 2 four-member team
  { p: [0, 0, 15], t: [0, 0, -1] }          // 3 contact / closing mark
];
function camAt(s) {
  var i = clamp(Math.floor(s), 0, N - 2), f = clamp(s - i, 0, 1), a = CAMS[i], b = CAMS[i + 1];
  var ef = f * f * (3 - 2 * f), ez = ef;
  if (a.zin === 'fast') ez = 1 - Math.pow(1 - f, 3);
  if (a.zin === 'late') ez = Math.pow(f, 3);
  var y = lerp(stageY(i), stageY(i + 1), ef);
  var p = new THREE.Vector3(lerp(a.p[0], b.p[0], ef), y + lerp(a.p[1], b.p[1], ef), lerp(a.p[2], b.p[2], ez));
  var t = new THREE.Vector3(lerp(a.t[0], b.t[0], ef), y + lerp(a.t[1], b.t[1], ef), lerp(a.t[2], b.t[2], ez));
  return { p: p, t: t, y: y, f: f };
}

/* ---------- per-stage animation ---------- */
function animate(sCur, t) {
  var d = function (i) { return clamp(1 - Math.abs(sCur - i) * 1.1, 0, 1); };

  // hero seed grows once, then breathes
  var g = reduce ? 1 : clamp((performance.now() - heroT0 - 250) / 2800, 0, 1);
  hero.setGrow(ss(0, 1, g));
  var ht = reduce ? 0 : t;
  hero.group.rotation.y = Math.sin(ht * 0.32) * 0.11 + mouse.x * (reduce ? 0 : 0.26);
  hero.group.rotation.x = -mouse.y * (reduce ? 0 : 0.13) + Math.sin(ht * 0.25) * 0.035;
  hero.group.position.y = stageY(0) + Math.sin(ht * 0.62) * 0.1;
  heroFragments.forEach(function (f, i) {
    f.m.rotation.x += reduce ? 0 : 0.0007 * (i + 1);
    f.m.rotation.y += reduce ? 0 : 0.0011 * (i % 2 ? -1 : 1);
    f.m.position.y = f.by + Math.sin(ht * 0.48 + f.phase) * (reduce ? 0 : .18);
  });
  heroField.rotation.y = mouse.x * (reduce ? 0 : .045);
  heroThreadMat.opacity = .12 + (.05 * (reduce ? 0 : (1 + Math.sin(ht * .7))));
  heroAura.intensity = reduce ? .82 : 1.02 + Math.sin(ht * .75) * .12;

  // pulses climb the strands
  pulses.forEach(function (p) { p.m.position.copy(strandCurves[p.k].getPoint((t * 0.045 + p.off) % 1)); });

  // team
  var a3 = d(3);
  members.forEach(function (m) {
    m.lift = lerp(m.lift, hoverMember === m.i ? 1 : 0, 0.12);
    var rise = ss(m.i * 0.09, 0.75 + m.i * 0.05, a3), ph = (t * 0.5 + m.i * 0.25) % 1;
    m.g.position.set(m.base.x + (1 - rise) * (m.i < 2 ? -6 : 6), m.base.y - (1 - rise) * 3.5 + m.lift * 0.35 + Math.sin(t * 1.3 + m.i) * 0.09, m.base.z + m.lift * 0.9);
    m.ring.scale.setScalar(1 + ph * 0.45); m.ring.material.emissiveIntensity = 0.9 * (1 - ph);
    m.inner.rotation.z = Math.sin(t * 1.1 + m.i * 1.7) * 0.025;
    m.g.scale.setScalar((0.6 + 0.4 * rise) * (1 + m.lift * 0.12) * teamScale);
    m.inner.rotation.y = Math.sin(t * 0.6 + m.i * 1.3) * 0.12 - m.lift * 0.15 + mouse.x * 0.1;



  });

  // portfolio screens
  var a5 = d(2), e5 = ss(0, 0.75, a5);
  crown.visible = !(window.innerWidth <= 760 && a5 < 0.04);
  leaves.forEach(function (L, i) {
    L.lift = lerp(L.lift, hoverLeaf === i ? 1 : 0, 0.12);
    var dim = hoverLeaf >= 0 && hoverLeaf !== i ? 0.6 : 1;
    var ei = ss(i * 0.08, 0.8 + i * 0.02, a5), k = 1 - ei;
    L.g.position.set(L.base.x + (i % 2 ? 1 : -1) * k * 16, L.base.y - k * 7 + Math.sin(t * 0.9 + L.ph) * 0.18, L.base.z + L.lift * 2.4 - k * 12);
    L.g.rotation.x = k * -1.3 + Math.cos(t * 0.6 + L.ph) * 0.03;
    L.g.rotation.z = Math.sin(t * 0.7 + L.ph) * 0.02;
    L.g.rotation.y = lerp(L.ry, 0, L.lift) + Math.sin(t * 0.5 + L.ph) * 0.05 + mouse.x * 0.1;
    L.g.scale.setScalar((0.5 + 0.5 * ei) * (1 + L.lift * 0.12));
    // hovered project: its pages fill the screens starting from its own card; the rest keep the placeholder
    var want = L.thumb, showing = false;
    if (hoverLeaf >= 0) {
      var n = (hoverLeaf < shotTex.length ? shotTex[hoverLeaf].length : 0), off = (i - hoverLeaf + leaves.length) % leaves.length;
      if (off < n && shotTex[hoverLeaf][off]) { want = shotTex[hoverLeaf][off]; showing = true; }
    }
    if (L.face.map !== want) { L.face.map = want; L.face.emissiveMap = want; L.face.needsUpdate = true; }
    // page images at full brightness; placeholders step back while a project is hovered
    L.face.emissiveIntensity = showing ? 0.9 : (0.42 + L.lift * 0.6) * (hoverLeaf >= 0 ? 0.45 : 1);
    L.face.color.setHex(showing ? 0x1a1a1a : 0xffffff);
  });
  crown.rotation.y = Math.sin(t * 0.12) * 0.02;

  // services
  var a2 = d(1), e2 = ss(0, 0.8, a2);
  svc.g.visible = a2 > 0.01;
  if (svc.g.visible) {
    svc.g.scale.setScalar((0.55 + 0.45 * e2) * 1.25);
    svc.g.rotation.y = Math.sin(t * 0.3) * 0.28 + mouse.x * 0.3;
    svc.g.rotation.x = -mouse.y * 0.18 + Math.sin(t * 0.22) * 0.06;
    svc.rings.forEach(function (r) { r.rotation.z = r.userData.r0 + t * r.userData.sp; });
    svc.core.rotation.z = t * 0.2; svc.core.rotation.x = Math.sin(t * 0.4) * 0.3;
    svc.sats.forEach(function (sa, i) {
      var an = t * 0.32 + i * Math.PI / 2;
      sa.position.set(Math.cos(an) * 4.2, Math.sin(an) * 2.6, Math.sin(an * 1.3) * 1.6);
      sa.rotation.x = t * 0.6 + i; sa.rotation.y = t * 0.5;
    });
  }

  // contact logo
  endLogo.setGrow(ss(0.2, 0.9, d(4)));
  // team stage: bring the backdrop canvas to full strength so the hexagon photos are crisp, not faded
  var teamVis = Math.max(ss(0, 0.85, d(3)), ss(0, 0.85, d(2))); // also full strength at the portfolio, so the project screens stay vivid
  if (Math.abs(teamVis - lastVis) > 0.004) {
    lastVis = teamVis;
    canvas.style.opacity = (0.62 + 0.38 * teamVis).toFixed(3);
    canvas.style.filter = 'saturate(' + (0.82 + 0.18 * teamVis).toFixed(3) + ') contrast(' + (0.92 + 0.08 * teamVis).toFixed(3) + ')';
  }
  endLogo.group.rotation.y = Math.sin(t * 0.4) * 0.15 + mouse.x * 0.4;
  endLogo.group.rotation.x = -mouse.y * 0.2;
  endLogo.group.position.y = stageY(4) + 1.1 + Math.sin(t * 0.8) * 0.12;
}

/* ---------- scroll, rail, resize ---------- */
var secs = Array.prototype.slice.call(document.querySelectorAll('.stage'));
var railLinks = Array.prototype.slice.call(document.querySelectorAll('.rail a'));
var gauge = document.getElementById('gauge'), gaugeFill = document.getElementById('gaugeFill');
var sTarget = 0, sCur = 0, activeIdx = -1;
function readScroll() {
  if (window.innerWidth <= 760) {
    // phones: sections are taller than the screen, so switch scenes only while a section boundary crosses the middle of the screen
    var vh = window.innerHeight, mid = window.scrollY + vh * 0.5, W = vh * 0.22;
    for (var k = 0; k < N - 1; k++) {
      var bnd = (secs[k].offsetTop + secs[k].offsetHeight + secs[k + 1].offsetTop) / 2;   // middle of the gap between two sections
      if (mid < bnd - W) { sTarget = k; return; }
      if (mid <= bnd + W) { sTarget = k + ss(0, 1, (mid - (bnd - W)) / (2 * W)); return; }
    }
    sTarget = N - 1; return;
  }
  var vc = window.scrollY + window.innerHeight * 0.5, c = secs.map(function (s) { return s.offsetTop + s.offsetHeight / 2; });
  if (vc <= c[0]) { sTarget = 0; return; }
  if (vc >= c[N - 1]) { sTarget = N - 1; return; }
  for (var i = 0; i < N - 1; i++) if (vc >= c[i] && vc < c[i + 1]) { sTarget = i + ss(0.2, 0.8, (vc - c[i]) / (c[i + 1] - c[i])); return; }
}
window.addEventListener('scroll', readScroll, { passive: true });

// The original standalone file did not load the optional post-processing add-ons,
// so its renderer-only path is preserved here.
var composer = null, bloom = null;
function resize() {
  var w = window.innerWidth, h = window.innerHeight, wide = w > 760;
  layoutTeam(wide);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  if (wide) camera.setViewOffset(w, h, w * 0.23, 0, w, h); else camera.setViewOffset(w, h, 0, h * 0.2, w, h);
  camera.zoom = wide ? Math.min(1, w / 1300 + 0.25) : Math.min(0.72, w / 520);
  camera.updateProjectionMatrix();
  var heroScale = w < 430 ? 2.35 : w < 760 ? 2.75 : w < 1100 ? 3.55 : 4.05;
  hero.group.scale.setScalar(heroScale);
  hero.group.position.x = 0;
  heroField.scale.setScalar(wide ? 1.08 : .76);
  heroField.position.x = 0;
  heroAura.position.x = 0;
  if (composer) { composer.setSize(w, h); bloom.setSize(w, h); }
  readScroll();
}
window.addEventListener('resize', resize);
resize();
sCur = sTarget;

var fovKick = 0;
var last = performance.now(), running = true, slowMs = 16, degraded = false;
document.addEventListener('visibilitychange', function () { running = !document.hidden; if (running) { last = performance.now(); loop(); } });
function loop() {
  if (!running) return;
  requestAnimationFrame(loop);
  var now = performance.now(), dt = Math.min(0.05, (now - last) / 1000), t = now / 1000; last = now;
  mouse.x = lerp(mouse.x, mouse.tx, 0.06); mouse.y = lerp(mouse.y, mouse.ty, 0.06);
  var prev = sCur;
  sCur = reduce ? sTarget : lerp(sCur, sTarget, 1 - Math.exp(-dt * 3.2));
  var vel = (sCur - prev) / Math.max(dt, 0.001);

  var idx = Math.round(sCur);
  if (idx !== activeIdx) {
    activeIdx = idx;
    railLinks.forEach(function (a, i) { if (i === idx) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  // height gauge: 0 at the root tips, 100% at the crown
  if (gaugeFill) gaugeFill.style.height = (sCur / (N - 1) * 100).toFixed(1) + '%';
  document.body.dataset.zone = sCur < 3.5 ? 'roots' : sCur < 5.6 ? 'trunk' : 'crown';

  var cm = camAt(sCur), heroBlend = clamp(1 - Math.abs(sCur) * 1.35, 0, 1);
  var vw = window.innerWidth, vh = window.innerHeight, wideView = vw > 760;
  camera.setViewOffset(vw, vh, wideView ? vw * .23 * (1 - heroBlend) : 0, wideView ? 0 : vh * .2 * (1 - heroBlend), vw, vh);
  var swing = Math.sin(cm.f * Math.PI) * 2.6 * (Math.floor(sCur) % 2 ? 1 : -1) * (1 - heroBlend);
  var inside = false;
  camera.position.set(cm.p.x + mouse.x * (inside ? 0.35 : 0.8) + (inside ? 0 : swing), cm.p.y - mouse.y * 0.4, cm.p.z);
  camera.lookAt(cm.t.x + mouse.x * 0.3, cm.t.y, cm.t.z);
  camera.rotation.z += clamp(vel * -0.03, -0.09, 0.09);
  fovKick = lerp(fovKick, clamp(Math.abs(vel) * 5, 0, 9), 0.1);
  camera.fov = 45 + fovKick; camera.updateProjectionMatrix();

  dust.rotation.y = t * 0.01;
  // adaptive quality: if frames stay slow, drop bloom and lower resolution
  slowMs = slowMs * 0.95 + dt * 1000 * 0.05;
  if (slowMs > 34 && !degraded) { degraded = true; composer = null; renderer.setPixelRatio(1); renderer.setSize(window.innerWidth, window.innerHeight, false); dust.visible = false; }
  animate(sCur, reduce ? 0 : t);
  fxUpdate(sCur, reduce ? 0 : t, dt, cm.y);
  if (composer) composer.render(); else renderer.render(scene, camera);
}
loop();
}