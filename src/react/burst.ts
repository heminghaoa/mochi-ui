export type BurstType = 'leaf' | 'splash';

export function burst(target: HTMLElement, type: BurstType): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var rect = target.getBoundingClientRect();
  var zone = document.createElement('div');
  zone.className = 'burst-zone';
  zone.setAttribute('aria-hidden', 'true');
  zone.style.left = rect.left + rect.width / 2 + 'px';
  zone.style.top = (type === 'splash' ? rect.top - 2 : rect.top + rect.height / 2) + 'px';
  document.body.appendChild(zone);
  var n = type === 'splash' ? 10 : 7;
  var colors = type === 'splash'
    ? ['#6EC9EA', '#93D8F1', '#BDE8F7']
    : ['#8FD178', '#5FAE52', '#A9DC8E', '#C6E162'];
  var icon = type === 'splash' ? 'drop' : 'leaf';
  for (var i = 0; i < n; i++) {
    var pt = document.createElement('span');
    pt.className = 'burst-pt ' + type;
    var size = Math.round(type === 'splash' ? 7 + Math.random() * 7 : 10 + Math.random() * 9);
    pt.style.color = colors[i % colors.length];
    if (type === 'splash') {
      var side = i % 2 === 0 ? -1 : 1;
      var jitter = (Math.random() - .5) * 16;
      pt.style.left = (side * rect.width * 0.26 + jitter).toFixed(0) + 'px';
      pt.style.setProperty('--dx', (side * (6 + Math.random() * 36)).toFixed(0) + 'px');
      pt.style.setProperty('--h', (-(45 + Math.random() * 75)).toFixed(0) + 'px');
      pt.style.setProperty('--dy', (26 + Math.random() * 22).toFixed(0) + 'px');
    } else {
      pt.style.setProperty('--dx', ((Math.random() - .5) * 130).toFixed(0) + 'px');
      pt.style.setProperty('--dy', (70 + Math.random() * 70).toFixed(0) + 'px');
      pt.style.setProperty('--rot', ((Math.random() - .5) * 540).toFixed(0) + 'deg');
      pt.style.animationDuration = (.9 + Math.random() * .6).toFixed(2) + 's';
    }
    pt.innerHTML = '<svg style="width:' + size + 'px;height:' + size + 'px;display:block" aria-hidden="true"><use href="#pi-' + icon + '"/></svg>';
    if (type === 'splash') {
      var dur = (1 + Math.random() * .4).toFixed(2) + 's';
      var delay = (Math.random() * .1).toFixed(2) + 's';
      pt.style.animation = 'pt-splash-x ' + dur + ' linear ' + delay + ' both';
      (pt.firstChild as HTMLElement).style.animation = 'pt-splash-y ' + dur + ' linear ' + delay + ' both';
    } else {
      pt.style.animationDelay = (Math.random() * .12).toFixed(2) + 's';
    }
    zone.appendChild(pt);
  }
  setTimeout(function () { zone.remove(); }, 2000);
}
