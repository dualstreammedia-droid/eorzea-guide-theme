// FF14ファンフェス マイプラン（当日ナビのアプリ版）：下のタブで画面を切り替える。ホーム画面に追加すると全画面で開き、電波が弱くても前に開いた内容で動く
(function () {
  var KEY = 'eg-ff26-tab';
  var tabs = document.querySelectorAll('[data-tab]');
  var panes = document.querySelectorAll('[data-pane]');
  function show(name) {
    panes.forEach(function (p) { p.hidden = p.getAttribute('data-pane') !== name; });
    tabs.forEach(function (t) { t.setAttribute('aria-current', t.getAttribute('data-tab') === name ? 'page' : 'false'); });
    try { localStorage.setItem(KEY, name); } catch (e) {}
    window.scrollTo(0, 0);
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { show(t.getAttribute('data-tab')); }); });
  var first = 'now';
  try { first = localStorage.getItem(KEY) || 'now'; } catch (e) {}
  if (/ff26=/.test(location.hash)) first = 'plan'; // 送られてきた予定を開いたときは、予定のタブから
  show(first);

  // ホーム画面への追加のしかた（全画面で開いているときは出さない）
  var standalone = window.navigator.standalone || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  var dismissed = false;
  try { dismissed = localStorage.getItem('eg-ff26-install') === '1'; } catch (e) {}
  var box = document.getElementById('ap-install');
  if (!standalone && !dismissed && box) {
    var ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
    box.innerHTML = '<p><strong>ホーム画面に追加すると、アプリのように使えます</strong><br>' +
      (ios ? 'Safariの下の共有ボタン（□に↑）→「ホーム画面に追加」' : 'ブラウザのメニュー（︙）→「ホーム画面に追加」または「アプリをインストール」') +
      '。一度開いておくと、会場で電波が弱くても使えます。</p><p><button type="button" data-close>とじる</button></p>';
    box.hidden = false;
    box.querySelector('[data-close]').addEventListener('click', function () {
      box.hidden = true;
      try { localStorage.setItem('eg-ff26-install', '1'); } catch (e) {}
    });
  }

  // お知らせ（基調講演の速報記事など）。news.json を書きかえると、開いている人にも1分以内に出る
  var news = document.getElementById('ap-news');
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function loadNews() {
    if (!news || !window.fetch) return;
    fetch('news.json', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (o) {
      var now = Date.now();
      var hit = (o.items || []).filter(function (x) { return Date.parse(x.from) <= now && now < Date.parse(x.to); });
      news.innerHTML = hit.map(function (x) {
        return '<p>' + (x.url ? '<a href="' + esc(x.url) + '"><strong>' + esc(x.text) + '</strong></a>' : esc(x.text)) + '</p>';
      }).join('');
      news.hidden = !hit.length;
    }).catch(function () {});
  }
  loadNews();
  setInterval(loadNews, 60000);

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(function () {});
})();
