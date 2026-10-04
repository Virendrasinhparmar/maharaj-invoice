/* Shared Navratri artwork for order.html and leads.html (drawn in code, no image files) */
window.FESTIVE = {
  NAVRANG: ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#00acc1', '#1e88e5', '#8e24aa', '#d81b60', '#c2185b', '#ff7043'],
  /** Marigold toran with hanging strands, mango leaves and bells — for <svg viewBox="0 0 400 70"> */
  garland(prefix = 'g') {
  // Marigold garland (toran) with hanging strands, mango leaves and bells
  const curve = (x) => 5 + 20 * (1 - Math.pow((x - 200) / 200, 2));
  let g = `<defs>
    <radialGradient id="mg" cx="35%" cy="35%" r="70%"><stop offset="0" stop-color="#ffe082"/><stop offset=".55" stop-color="#ffa000"/><stop offset="1" stop-color="#e65100"/></radialGradient>
    <radialGradient id="mg2" cx="35%" cy="35%" r="70%"><stop offset="0" stop-color="#fff59d"/><stop offset=".6" stop-color="#fbc02d"/><stop offset="1" stop-color="#f57f17"/></radialGradient>
    <linearGradient id="bellg" x1="0" x2="1"><stop offset="0" stop-color="#b8860b"/><stop offset=".5" stop-color="#ffe08a"/><stop offset="1" stop-color="#b8860b"/></linearGradient></defs>`;
  g += `<path d="M0 5 Q200 45 400 5" stroke="#7a4a00" stroke-width="1.2" fill="none"/>`;
  for (let i = 0, x = 4; x <= 400; x += 11, i++) {
    const y = curve(x);
    if (i % 5 === 2) {
      const len = i % 10 === 2 ? 30 : 20;
      g += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + len}" stroke="#7a4a00" stroke-width="1"/>`;
      g += `<circle cx="${x}" cy="${y + len * .45}" r="4.5" fill="url(#mg2)"/><circle cx="${x}" cy="${y + len * .8}" r="4" fill="url(#mg)"/>`;
      if (i % 10 === 2) g += `<g class="bell" style="animation-delay:${(-i * 0.13).toFixed(2)}s"><path d="M${x - 5} ${y + len + 10} Q${x - 5} ${y + len + 1} ${x} ${y + len + 1} Q${x + 5} ${y + len + 1} ${x + 5} ${y + len + 10} Z" fill="url(#bellg)"/><circle cx="${x}" cy="${y + len + 11}" r="1.6" fill="#7a4a00"/></g>`;
      else g += `<ellipse cx="${x + 4}" cy="${y + len + 3}" rx="3" ry="7" transform="rotate(-25 ${x + 4} ${y + len + 3})" fill="#2e7d32"/><ellipse cx="${x - 4}" cy="${y + len + 3}" rx="3" ry="7" transform="rotate(25 ${x - 4} ${y + len + 3})" fill="#388e3c"/>`;
    }
    g += `<circle cx="${x}" cy="${y}" r="6.2" fill="url(#${i % 2 ? 'mg' : 'mg2'})"/><circle cx="${x}" cy="${y}" r="2.2" fill="#e65100" opacity=".55"/>`;
  }
  return g.replace(/\b(mg2?|bellg)\b/g, prefix + '-$1');

  },
  /* each garland gets its own gradient ids so two garlands on a page never clash */
  /** Mandala rings — for <svg viewBox="-220 -220 440 440">; defines #mandala-g for <use> */
  mandala() {
  // Mandala: rings of petals and dots
  let m = '<g id="mandala-g" fill="none" stroke="#ffc93c" stroke-width="1.3" stroke-opacity=".55">';
  [[34, 8, 26], [62, 12, 30], [94, 16, 34], [128, 20, 36], [164, 28, 38], [200, 36, 30]].forEach(([r, n, h], k) => {
    const w = h * 0.42;
    for (let i = 0; i < n; i++) m += `<path transform="rotate(${(360 / n) * i + (k % 2 ? 180 / n : 0)})" d="M0 ${-r + h} q ${w} ${-h / 2} 0 ${-h} q ${-w} ${h / 2} 0 ${h}"/>`;
    m += `<circle r="${r - h - 3}" stroke-dasharray="2 5"/>`;
    for (let i = 0; i < n; i++) { const a = ((360 / n) * i + 90 / n) * Math.PI / 180; m += `<circle cx="${(Math.sin(a) * (r + 4)).toFixed(1)}" cy="${(-Math.cos(a) * (r + 4)).toFixed(1)}" r="1.6" fill="#ffc93c" stroke="none" opacity=".7"/>`; }
  });
  return m + '</g>';

  },
};
