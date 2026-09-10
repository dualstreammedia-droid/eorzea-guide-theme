// エオルゼア攻略ガイド サイト共通スクリプト
// はてなブログのヘッダHTMLから読み込まれる唯一のJS。中身は2つ。
//   (1) noindex制御  … 対象記事のheadにrobotsメタを挿入
//   (2) AdSense広告枠 … 記事下（＋任意で目次直後）に手動配置の広告ユニットを挿入
// 編集したら git push するだけで全記事に反映される（GitHub Pages配信）。

/* ============================================================
   (1) noindex制御
   管理: company/projects/noindex_candidates.md と同期
   仕組み: はてなブログは記事単位のnoindex公式機能がないため、
           対象パスのみ<head>にrobotsメタを動的挿入する
   ============================================================ */
(function () {
  var NOINDEX_PATHS = [
    "/entry/2026/04/25/153057"  /* 011 */,
    "/entry/2026/04/25/213050"  /* 013 */,
    "/entry/2026/04/25/213055"  /* 014 */,
    "/entry/2026/04/25/231906"  /* 015 */,
    "/entry/2026/04/26/150658"  /* 016 */,
    "/entry/2026/04/28/074002"  /* 028 */,
    "/entry/2026/05/03/144510"  /* 042 */,
    "/entry/2026/05/05/144625"  /* 058 */,
    "/entry/2026/05/05/173826"  /* 063 */,
    "/entry/2026/05/05/174113"  /* 064 */,
    "/entry/2026/05/05/183652"  /* 065 */,
    "/entry/2026/05/05/234947"  /* 067 */,
    "/entry/2026/05/06/005523"  /* 071 */,
    "/entry/2026/05/09/080523"  /* 072 */,
    "/entry/2026/05/09/103357"  /* 073 */,
    "/entry/2026/05/11/221330"  /* 075 */
  ];
  if (NOINDEX_PATHS.indexOf(location.pathname) !== -1) {
    var m = document.createElement('meta');
    m.name = 'robots';
    m.content = 'noindex';
    document.head.appendChild(m);
  }
})();

/* ============================================================
   (2) AdSense広告枠
   方針: company/strategy/adsense_placement_policy.md
     - 自動広告は使わない（AdSense管理画面でオフにすること）
     - フェーズ1 = 記事本文の直後に1枠だけ
     - フェーズ2 = 目次直後（SLOT_MID に slot ID を入れると有効化）
   設定方法: AdSenseで「ディスプレイ広告」ユニットを作成し、
             発行された data-ad-slot の数字を下記に貼るだけ。
             空文字のあいだは何も挿入されない（安全）。
   ============================================================ */
(function () {
  var CLIENT   = 'ca-pub-5780763794800838';
  var SLOT_END = '';   // 記事下（フェーズ1）… ここに data-ad-slot の数字を入れる
  var SLOT_MID = '';   // 目次直後（フェーズ2）… フェーズ1の数値確認後に設定する

  if (!document.body || document.body.className.indexOf('page-entry') === -1) return;

  function makeUnit(slot) {
    var box = document.createElement('div');
    box.className = 'eg-ad';
    box.style.cssText = 'margin:28px 0;text-align:center;clear:both';

    var label = document.createElement('div');
    label.textContent = 'スポンサーリンク';
    label.style.cssText = 'font-size:0.72em;color:#999;letter-spacing:.04em;margin-bottom:4px;text-align:left';
    box.appendChild(label);

    var ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.cssText = 'display:block';
    ins.setAttribute('data-ad-client', CLIENT);
    ins.setAttribute('data-ad-slot', slot);
    ins.setAttribute('data-ad-format', 'auto');
    ins.setAttribute('data-full-width-responsive', 'true');
    box.appendChild(ins);
    return box;
  }

  function push() {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  }

  var content = document.querySelector('.entry-content');
  if (!content) return;

  // --- 記事下（本文の直後・関連記事より前） ---
  if (SLOT_END) {
    content.parentNode.insertBefore(makeUnit(SLOT_END), content.nextSibling);
    push();
  }

  // --- 目次直後（最初のh2の直前）---
  // ポリシー上、ファーストビューには置かない。目次が無い記事ではスキップする。
  if (SLOT_MID) {
    // 目次は class 無しの <details>。その直後にある h2#toc-1 が最初の見出し。
    var anchor = content.querySelector('h2#toc-1') || content.querySelector('h2');
    if (anchor) {
      content.insertBefore(makeUnit(SLOT_MID), anchor);
      push();
    }
  }
})();
