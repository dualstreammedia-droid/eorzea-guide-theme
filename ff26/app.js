// 当日ナビのアプリ版：下のタブで画面を切り替える。ホーム画面に追加すると全画面で開き、電波が弱くても前に開いた内容で動く
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

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(function () {});
})();
