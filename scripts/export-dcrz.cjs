// Stream deterministic vector frames to render-dcrz.py. No npm dependencies.
const createScene = require('./dcrz-scene.cjs');
const { once } = require('node:events');
let commands = [], points = [], circle = null;
const round = n => Math.round(n * 100) / 100;
const ctx = {
  globalAlpha: 1, lineWidth: 1, strokeStyle: '', fillStyle: '',
  clearRect() { commands = []; },
  beginPath() { points = []; circle = null; },
  moveTo(x, y) { points.push([round(x), round(y)]); },
  lineTo(x, y) { points.push([round(x), round(y)]); },
  closePath() {},
  arc(x, y, r) { circle = [round(x), round(y), round(r)]; },
  stroke() { if (this.globalAlpha > .007) commands.push(['l', points, this.strokeStyle, round(this.globalAlpha), round(this.lineWidth)]); },
  fill() { if (this.globalAlpha > .007) commands.push([circle ? 'c' : 'p', circle || points, this.fillStyle, round(this.globalAlpha)]); },
  createRadialGradient(x, y, r0, x1, y1, r1) { return { x: round(x), y: round(y), r: round(r1), addColorStop() {} }; },
  fillRect() { if (typeof this.fillStyle === 'object') commands.push(['g', this.fillStyle, round(this.globalAlpha)]); },
};
const render = createScene(ctx, 364, 196, 'dark');
(async () => {
  for (let i = 0; i < 854; i++) {
    render(i / 20);
    if (!process.stdout.write(JSON.stringify(commands) + '\n')) await once(process.stdout, 'drain');
  }
})();
