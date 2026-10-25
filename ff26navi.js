// ファンフェス2026東京 当日ナビ
// 記事内の <div id="eg-ff26-navi"></div> に描画する。noindex.js の (5) から読み込まれる。
// データは 2026-10-26 時点の公式サイト（ステージ・フロア情報）と QOくんの商品一覧。
(function () {
  var root = document.getElementById('eg-ff26-navi');
  if (!root || root.getAttribute('data-ready')) return;
  root.setAttribute('data-ready', '1');

  // ---------------- データ ----------------
  var DAYS = { 1: '2026-10-31', 2: '2026-11-01' };

  var STAGE = {
    1: [
      ['11:00', '13:00', '基調講演'],
      ['15:00', '16:30', 'CC大会 セミファイナル'],
      ['16:30', '17:00', '吉田Pの一問一答タイムアタック'],
      ['17:00', '18:30', 'CC大会 ファイナル'],
      ['19:30', '20:30', 'ピアノコンサート']
    ],
    2: [
      ['10:30', '12:00', '開発パネル（サウンド）'],
      ['12:30', '13:30', 'LIVE Q&A'],
      ['13:50', '15:00', 'ミラプリコレクション'],
      ['15:30', '17:30', '直樹の部屋'],
      ['19:00', '20:30', 'THE PRIMALS ライブ']
    ]
  };

  // [名前, 場所, DAY1開始, DAY1終了, DAY2開始, DAY2終了, 最終受付は終了の何分前か, メモ]
  var SPOTS = [
    ['グッズ売り場', '屋外展示場 35', '9:00', '21:00', '9:00', '20:30', 30, '14,000円以上でアートボード'],
    ['アルカディアくじ', '屋外展示場 36', '9:00', '21:00', '9:00', '20:30', 30, '1回1,760円'],
    ['チョコボレースVR', '1-3ホール A1', '9:00', '21:00', '9:00', '20:30', 30, '1,100円・現金不可'],
    ['リアルトレジャーハント', '1-3ホール A2', '9:00', '21:00', '9:00', '20:30', 30, 'カプセルトイ400〜600円'],
    ['YOKERO', '1-3ホール B5', '9:00', '21:00', '9:00', '20:30', 30, ''],
    ['ナイスヘッド・ガーデン', '1-3ホール B6', '9:00', '21:00', '9:00', '20:30', 30, 'アラグの操作盤もここ'],
    ['ダンシング・グリーン', '1-3ホール C8', '9:00', '21:00', '9:00', '20:30', 30, ''],
    ['チェキ撮影・プリント', '1-3ホール C10', '9:00', '21:00', '9:00', '20:30', 30, 'なくなり次第終了'],
    ['オードパルファム テスター', '1-3ホール D11', '9:00', '21:00', '9:00', '20:30', 30, ''],
    ['トートバッグ作り', '1-3ホール D12', '9:00', '21:00', '9:00', '20:30', 30, '4,400円・遅い時間は品切れあり'],
    ['ナインズ・キャッチャー', '1-3ホール D14', '9:00', '21:00', '9:00', '20:30', 30, '2,500円・現金不可'],
    ['スペースインベーダー', '7ホール E20', '9:00', '21:00', '9:00', '20:30', 30, ''],
    ['エオルゼア検定', '7ホール E21', '9:00', '21:00', '9:00', '20:30', 30, ''],
    ['NPC名鑑 体験', '7ホール E22', '10:00', '21:00', '10:00', '20:30', 30, '約30分'],
    ['FFトレカ体験', '7ホール E23', '11:00', '20:15', '11:00', '20:15', 0, '約45分'],
    ['ドマ式麻雀 修練場', '7ホール E24', '9:00', '21:00', '9:00', '20:30', 30, ''],
    ['エッダの鞄', '7ホール E25', '9:00', '21:00', '9:00', '20:30', 15, '2日目の最終受付は18:30'],
    ['出張エオルゼアカフェ', '豊砂公園 1', '10:00', '20:00', '10:00', '20:00', 0, 'メニューごとにキャラスタンド'],
    ['アニメイトカフェ出張版', '豊砂公園 2', '10:00', '20:00', '10:00', '20:00', 0, 'コースター全10種'],
    ['POP UP STORE', 'イオンモール 37', '10:00', '21:00', '10:00', '21:00', 0, '5,000円以上でポストカード'],
    ['リアル謎解き', 'イオンモール 39', '10:00', '21:00', '10:00', '21:00', 0, '約60分・11/3まで'],
    ['ヤマト運輸 宅配', '2F中央モール 34', '10:00', '19:00', '10:00', '19:00', 0, '荷物を送れる']
  ];
  // エッダの鞄は2日目だけ最終受付が早い
  var SPECIAL_LAST = { 'エッダの鞄': { 2: '18:30' } };

  // [名前, 価格, 分類]
  var GOODS = [
    ['マフラータオル', 2500, 'ライブ'],
    ['スティックライト＜モーグリ＞', 4950, 'ライブ'],
    ['ぬいぐるみ＜カリュクス＞', 8250, '雑貨'],
    ['ぬいぐるみ＜黄金のアルパカ＞', 5280, '雑貨'],
    ['セニョールウソウソ・パック', 6930, '雑貨'],
    ['オルゴール', 2750, '雑貨'],
    ['フェイクレザーチャーム', 1320, '雑貨'],
    ['クリアキーホルダー＜ファダニエル＞', 1650, '雑貨'],
    ['クリアキーホルダー＜エリディブス＞', 1650, '雑貨'],
    ['付箋セット', 1100, '雑貨'],
    ['NPC名鑑（カードゲーム）', 4950, '雑貨'],
    ['ネオンライト＜モーグリ＞', 6600, '雑貨'],
    ['ネオンパラソル', 4950, '雑貨'],
    ['エメトセルクのイヤリング（1会計1点）', 27500, '雑貨'],
    ['オードパルファム（各ジョブ）', 3960, '雑貨'],
    ['ミニチュアフィギュア Vol.3（1個）', 1650, 'ランダム'],
    ['ミニチュアフィギュア Vol.3（6個BOX）', 9900, 'ランダム'],
    ['ミニパペット Vol.3（1個）', 1650, 'ランダム'],
    ['ミニパペット Vol.3（6個BOX）', 9900, 'ランダム'],
    ['ラバーマグネット Vol.3（1個）', 1100, 'ランダム'],
    ['ラバーマグネット Vol.3（6個BOX）', 6600, 'ランダム'],
    ['ガラスプレート Vol.1（1個）', 1650, 'ランダム'],
    ['ガラスプレート Vol.1（8個BOX）', 13200, 'ランダム'],
    ['Tシャツ＜ストレイバロー＞', 5500, 'アパレル'],
    ['ボンバージャケット', 29700, 'アパレル'],
    ['スウェット（黒／グレー）', 16500, 'アパレル'],
    ['ネオンTシャツ', 7700, 'アパレル'],
    ['大判ストール', 6600, 'アパレル'],
    ['公式パンフレット', 2500, '本・CD'],
    ['カレンダーセット2027', 4950, '本・CD'],
    ['ポストカードブック Vol.II', 1650, '本・CD'],
    ['エオルゼア観光案内', 1980, '本・CD'],
    ['ピアノコレクション', 3300, '本・CD'],
    ['Pulse Vol.3', 3960, '本・CD'],
    ['GGグミ', 1900, '食品'],
    ['でぶチョコボカレー', 1080, '食品'],
    ['ショッパー大', 50, 'その他'],
    ['ショッパー特大', 200, 'その他']
  ];
  var ARTBOARD = 14000;

  var ITEMS = [
    ['スマホ（アプリにログイン済み）', true],
    ['ワンタイムパスワードの認証アプリ', true],
    ['本人確認書類', true],
    ['クレジットカードかスマホ決済', true],
    ['現金（くじ・グッズ・キッチンカー用）', true],
    ['モバイルバッテリー', false],
    ['エコバッグ（ショッパーは有料）', false],
    ['羽織るもの（夜の屋外は冷える）', false],
    ['ペンライト・マフラータオル（ライブ用）', false],
    ['QOくんのQRコードのスクショ', false]
  ];

  var MAPS = [
    ['会場全体', 'map_messe_entire.jpg'],
    ['1-3ホール', 'map_messe_hall1-3.jpg'],
    ['4-6ホール（ステージ）', 'map_messe_hall4-6.jpg'],
    ['7ホール', 'map_messe_hall7.jpg'],
    ['豊砂公園（フード）', 'map_toyosuna.jpg'],
    ['イオンモール', 'map_aeon.jpg']
  ];
  var MAP_BASE = 'https://dualstreammedia-droid.github.io/eorzea-guide-theme/img/ff26/';

  // ---------------- 保存（このスマホだけ） ----------------
  var KEY = 'eg-ff26-navi';
  var store = {};
  try { store = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { store = {}; }
  store.cart = store.cart || {};
  store.items = store.items || {};
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }

  // ---------------- 時刻（端末の時差に関係なく日本時間で計算） ----------------
  function jstNow() {
    var d = new Date(Date.now() + 9 * 3600 * 1000);
    return {
      date: d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()),
      min: d.getUTCHours() * 60 + d.getUTCMinutes(),
      text: pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes())
    };
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function toMin(s) { var p = s.split(':'); return +p[0] * 60 + +p[1]; }
  function yen(n) { return n.toLocaleString('ja-JP') + '円'; }
  function dur(m) { return m >= 60 ? Math.floor(m / 60) + '時間' + (m % 60 ? (m % 60) + '分' : '') : m + '分'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // ---------------- スタイル ----------------
  var css = document.createElement('style');
  css.textContent = [
    '#eg-ff26-navi{--n:#1a2f4e;--g:#b8860b;--gs:#f6ecd2;--l:#e2dccd;--m:#6b6f7c;--ok:#2f7a57;--warn:#b5651d;--off:#9a9a9a;font-size:15px;line-height:1.6;margin:16px 0 28px}',
    '#eg-ff26-navi *{box-sizing:border-box}',
    '#eg-ff26-navi .nv-tabs{display:flex;gap:6px;position:sticky;top:0;z-index:3;background:#fff;padding:8px 0;border-bottom:2px solid var(--n)}',
    '#eg-ff26-navi .nv-tab{flex:1;font:inherit;font-weight:700;font-size:14px;padding:9px 4px;border:1px solid var(--l);border-radius:8px 8px 0 0;background:#f7f5ef;color:var(--n);cursor:pointer}',
    '#eg-ff26-navi .nv-tab[aria-selected="true"]{background:var(--n);color:#fff;border-color:var(--n)}',
    '#eg-ff26-navi .nv-panel{padding-top:14px}',
    '#eg-ff26-navi .nv-head{display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap;margin:4px 0 10px}',
    '#eg-ff26-navi .nv-clock{font-size:26px;font-weight:700;color:var(--n);font-variant-numeric:tabular-nums}',
    '#eg-ff26-navi .nv-day{display:flex;gap:6px}',
    '#eg-ff26-navi .nv-day button{font:inherit;font-size:13px;padding:5px 12px;border-radius:999px;border:1px solid var(--l);background:#fff;color:var(--n);cursor:pointer}',
    '#eg-ff26-navi .nv-day button[aria-pressed="true"]{background:var(--gs);border-color:var(--g);font-weight:700}',
    '#eg-ff26-navi .nv-note{font-size:13px;color:var(--m);margin:0 0 10px}',
    '#eg-ff26-navi .nv-sec{font-weight:700;color:var(--n);font-size:16px;margin:18px 0 8px;padding-left:8px;border-left:4px solid var(--g)}',
    '#eg-ff26-navi .nv-card{border:1px solid var(--l);border-radius:10px;padding:10px 12px;margin-bottom:8px;background:#fff}',
    '#eg-ff26-navi .nv-row{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}',
    '#eg-ff26-navi .nv-name{font-weight:700;color:#222}',
    '#eg-ff26-navi .nv-sub{font-size:12.5px;color:var(--m)}',
    '#eg-ff26-navi .nv-pill{flex:none;font-size:12px;font-weight:700;padding:2px 8px;border-radius:999px;white-space:nowrap;border:1px solid currentColor}',
    '#eg-ff26-navi .st-ok{color:var(--ok)}#eg-ff26-navi .st-warn{color:var(--warn)}#eg-ff26-navi .st-off{color:var(--off)}#eg-ff26-navi .st-now{color:#fff;background:#c0392b;border-color:#c0392b}#eg-ff26-navi .st-next{color:var(--n)}',
    '#eg-ff26-navi .nv-card.off{opacity:.55}',
    '#eg-ff26-navi .nv-maps{display:grid;grid-template-columns:1fr 1fr;gap:6px}',
    '#eg-ff26-navi .nv-maps a{display:block;text-align:center;padding:9px 4px;border:1px solid var(--l);border-radius:8px;color:var(--n);font-weight:700;font-size:13px;text-decoration:none;background:#f7f5ef}',
    '#eg-ff26-navi .nv-sum{position:sticky;top:52px;z-index:2;background:var(--n);color:#fff;border-radius:10px;padding:10px 14px;margin-bottom:10px}',
    '#eg-ff26-navi .nv-sum b{font-size:22px;font-variant-numeric:tabular-nums}',
    '#eg-ff26-navi .nv-bar{height:7px;border-radius:4px;background:rgba(255,255,255,.25);margin:6px 0 4px;overflow:hidden}',
    '#eg-ff26-navi .nv-bar i{display:block;height:100%;background:#e8c35a;width:0}',
    '#eg-ff26-navi .nv-g{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 0;border-bottom:1px solid var(--l)}',
    '#eg-ff26-navi .nv-g .nv-sub{font-variant-numeric:tabular-nums}',
    '#eg-ff26-navi .nv-q{display:flex;align-items:center;gap:6px;flex:none}',
    '#eg-ff26-navi .nv-q button{width:34px;height:34px;border-radius:8px;border:1px solid var(--l);background:#fff;font-size:18px;font-weight:700;color:var(--n);cursor:pointer;line-height:1}',
    '#eg-ff26-navi .nv-q span{min-width:1.6em;text-align:center;font-weight:700;font-variant-numeric:tabular-nums}',
    '#eg-ff26-navi .nv-g.has{background:var(--gs)}',
    '#eg-ff26-navi .nv-btn{font:inherit;font-size:13px;padding:7px 14px;border-radius:8px;border:1px solid var(--l);background:#fff;color:var(--n);cursor:pointer}',
    '#eg-ff26-navi label.nv-chk{display:flex;align-items:center;gap:10px;padding:10px 4px;border-bottom:1px solid var(--l);cursor:pointer}',
    '#eg-ff26-navi label.nv-chk input{width:22px;height:22px;accent-color:var(--ok);flex:none}',
    '#eg-ff26-navi label.nv-chk.done span{text-decoration:line-through;color:var(--off)}',
    '#eg-ff26-navi .nv-tag{display:inline-block;font-size:11px;font-weight:700;color:#c0392b;margin-left:6px}',
    '#eg-ff26-navi button:focus-visible,#eg-ff26-navi a:focus-visible{outline:2px solid var(--g);outline-offset:2px}'
  ].join('');
  document.head.appendChild(css);

  // ---------------- 骨組み ----------------
  var TABS = [['now', 'いま'], ['goods', 'グッズ計算'], ['items', '持ち物']];
  var current = store.tab || 'now';
  root.innerHTML =
    '<div class="nv-tabs" role="tablist">' +
    TABS.map(function (t) { return '<button class="nv-tab" role="tab" data-tab="' + t[0] + '">' + t[1] + '</button>'; }).join('') +
    '</div><div class="nv-panel" id="nv-panel"></div>';
  var panel = root.querySelector('#nv-panel');
  root.querySelector('.nv-tabs').addEventListener('click', function (e) {
    var b = e.target.closest('[data-tab]');
    if (!b) return;
    current = b.getAttribute('data-tab'); store.tab = current; save(); render();
  });

  // 表示する日：当日はその日、それ以外は選んだ日（初期はDAY1）
  var viewDay = null;
  function today() {
    var n = jstNow();
    if (n.date === DAYS[1]) return 1;
    if (n.date === DAYS[2]) return 2;
    return 0;
  }

  // ---------------- 「いま」タブ ----------------
  function renderNow() {
    var n = jstNow();
    var t = today();
    var day = viewDay || t || 1;
    var live = t === day;
    var before = n.date < DAYS[1];
    var h = '<div class="nv-head"><div class="nv-clock">' + n.text + '<span class="nv-sub">（日本時間）</span></div>' +
      '<div class="nv-day"><button data-day="1" aria-pressed="' + (day === 1) + '">10/31 DAY1</button>' +
      '<button data-day="2" aria-pressed="' + (day === 2) + '">11/1 DAY2</button></div></div>';
    if (!live) {
      h += '<p class="nv-note">' + (before ? 'まだ開催前です。' : 'この日は表示中の日付ではありません。') +
        '当日（10/31・11/1）に開くと、いまの時刻に合わせて「上演中」「あと何分で受付終了」などが表示されます。今は' + (day === 1 ? 'DAY1' : 'DAY2') + 'の予定を表示しています。</p>';
    }

    // ステージ
    h += '<div class="nv-sec">ステージ（4-6ホール）</div>';
    var nextFound = false;
    STAGE[day].forEach(function (s) {
      var a = toMin(s[0]), b = toMin(s[1]), st, cls = '', pill = '';
      if (live && n.min >= a && n.min < b) { st = 'now'; pill = '<span class="nv-pill st-now">上演中 残り' + dur(b - n.min) + '</span>'; }
      else if (live && n.min >= b) { st = 'off'; cls = ' off'; pill = '<span class="nv-pill st-off">終了</span>'; }
      else if (live && !nextFound) { nextFound = true; pill = '<span class="nv-pill st-next">あと' + dur(a - n.min) + '</span>'; }
      else { pill = ''; }
      h += '<div class="nv-card' + cls + '"><div class="nv-row"><div><div class="nv-name">' + esc(s[2]) + '</div>' +
        '<div class="nv-sub">' + s[0] + '〜' + s[1] + '</div></div>' + pill + '</div></div>';
    });

    // アクティビティ・お店
    h += '<div class="nv-sec">アクティビティ・お店</div>';
    if (live) h += '<p class="nv-note">受付終了が近い順に並べています。</p>';
    var rows = SPOTS.map(function (s) {
      var open = toMin(day === 1 ? s[2] : s[4]);
      var close = toMin(day === 1 ? s[3] : s[5]);
      var last = close - s[6];
      var sp = SPECIAL_LAST[s[0]] && SPECIAL_LAST[s[0]][day];
      if (sp) last = toMin(sp);
      var state, sort;
      if (!live) { state = 'plan'; sort = 0; }
      else if (n.min < open) { state = 'before'; sort = 2000 + open; }
      else if (n.min >= last) { state = 'closed'; sort = 9000; }
      else { state = (last - n.min <= 60) ? 'soon' : 'open'; sort = last - n.min; }
      return { s: s, open: open, close: close, last: last, state: state, sort: sort };
    });
    if (live) rows.sort(function (x, y) { return x.sort - y.sort; });
    rows.forEach(function (r) {
      var s = r.s, pill = '', cls = '';
      var hours = (day === 1 ? s[2] + '〜' + s[3] : s[4] + '〜' + s[5]);
      var lastTxt = r.last !== r.close ? '（最終受付 ' + Math.floor(r.last / 60) + ':' + pad(r.last % 60) + '）' : '';
      if (r.state === 'open') pill = '<span class="nv-pill st-ok">受付中 あと' + dur(r.last - n.min) + '</span>';
      else if (r.state === 'soon') pill = '<span class="nv-pill st-warn">まもなく終了 ' + dur(r.last - n.min) + '</span>';
      else if (r.state === 'before') pill = '<span class="nv-pill st-next">' + dur(r.open - n.min) + '後に開始</span>';
      else if (r.state === 'closed') { pill = '<span class="nv-pill st-off">受付終了</span>'; cls = ' off'; }
      h += '<div class="nv-card' + cls + '"><div class="nv-row"><div><div class="nv-name">' + esc(s[0]) + '</div>' +
        '<div class="nv-sub">' + esc(s[1]) + '／' + hours + lastTxt + (s[7] ? '<br>' + esc(s[7]) : '') + '</div></div>' + pill + '</div></div>';
    });

    // マップ
    h += '<div class="nv-sec">マップ（タップで拡大）</div><div class="nv-maps">' +
      MAPS.map(function (m) { return '<a href="' + MAP_BASE + m[1] + '" target="_blank" rel="noopener">' + m[0] + '</a>'; }).join('') + '</div>';
    h += '<p class="nv-note" style="margin-top:10px">時間は公式サイトの案内（10月26日時点）です。当日の変更は会場の掲示を優先してください。</p>';
    panel.innerHTML = h;
    panel.querySelector('.nv-day').addEventListener('click', function (e) {
      var b = e.target.closest('[data-day]');
      if (!b) return;
      viewDay = +b.getAttribute('data-day'); renderNow();
    });
  }

  // ---------------- 「グッズ計算」タブ ----------------
  function cartTotal() {
    var sum = 0, cnt = 0;
    GOODS.forEach(function (g, i) { var q = store.cart[i] || 0; sum += q * g[1]; cnt += q; });
    return { sum: sum, cnt: cnt };
  }
  function sumHtml() {
    var t = cartTotal();
    var rest = ARTBOARD - t.sum;
    var pct = Math.min(100, t.sum / ARTBOARD * 100);
    return '<div>合計 <b>' + yen(t.sum) + '</b>（' + t.cnt + '点）</div>' +
      '<div class="nv-bar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="nv-sub" style="color:#f3e6c0">' + (rest > 0 ? 'アートボード特典（14,000円以上）まで あと' + yen(rest) : 'アートボード特典（14,000円以上）の条件クリア') + '</div>';
  }
  function renderGoods() {
    var h = '<div class="nv-sum" id="nv-sum">' + sumHtml() + '</div>' +
      '<p class="nv-note">欲しいものの数を入れると合計が出ます。入れた内容はこのスマホに保存されます。注文は会場でQOくんのQRコードを見せて行います。</p>';
    var cat = '';
    GOODS.forEach(function (g, i) {
      if (g[2] !== cat) { cat = g[2]; h += '<div class="nv-sec">' + esc(cat) + '</div>'; }
      var q = store.cart[i] || 0;
      h += '<div class="nv-g' + (q ? ' has' : '') + '" data-i="' + i + '"><div><div class="nv-name">' + esc(g[0]) + '</div><div class="nv-sub">' + yen(g[1]) + '</div></div>' +
        '<div class="nv-q"><button data-d="-1" aria-label="' + esc(g[0]) + 'を減らす">−</button><span>' + q + '</span><button data-d="1" aria-label="' + esc(g[0]) + 'を増やす">＋</button></div></div>';
    });
    h += '<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap"><button class="nv-btn" id="nv-clear">全部0に戻す</button>' +
      '<a class="nv-btn" href="https://qo-kun.com/fanfest-finalfantasy14" target="_blank" rel="noopener" style="text-decoration:none">QOくんを開く</a></div>' +
      '<p class="nv-note" style="margin-top:10px">価格は税込（QOくんの商品一覧、10月26日時点）。食品は軽減税率の対象です。</p>';
    panel.innerHTML = h;
    panel.addEventListener('click', onGoodsClick);
  }
  function onGoodsClick(e) {
    if (current !== 'goods') return;
    if (e.target.id === 'nv-clear') { store.cart = {}; save(); panel.removeEventListener('click', onGoodsClick); renderGoods(); return; }
    var b = e.target.closest('button[data-d]');
    if (!b) return;
    var row = b.closest('.nv-g'), i = +row.getAttribute('data-i');
    var q = Math.max(0, Math.min(99, (store.cart[i] || 0) + +b.getAttribute('data-d')));
    if (q) store.cart[i] = q; else delete store.cart[i];
    save();
    row.querySelector('span').textContent = q;
    row.classList.toggle('has', q > 0);
    panel.querySelector('#nv-sum').innerHTML = sumHtml();
  }

  // ---------------- 「持ち物」タブ ----------------
  function renderItems() {
    var h = '<p class="nv-note">チェックはこのスマホに保存されます。</p>';
    ITEMS.forEach(function (it, i) {
      var on = !!store.items[i];
      h += '<label class="nv-chk' + (on ? ' done' : '') + '"><input type="checkbox" data-i="' + i + '"' + (on ? ' checked' : '') + '><span>' + esc(it[0]) + (it[1] ? '<span class="nv-tag">必須</span>' : '') + '</span></label>';
    });
    panel.innerHTML = h;
    panel.querySelectorAll('input[type=checkbox]').forEach(function (c) {
      c.addEventListener('change', function () {
        var i = c.getAttribute('data-i');
        if (c.checked) store.items[i] = 1; else delete store.items[i];
        save();
        c.closest('label').classList.toggle('done', c.checked);
      });
    });
  }

  function render() {
    root.querySelectorAll('.nv-tab').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-tab') === current); });
    panel.removeEventListener('click', onGoodsClick);
    if (current === 'goods') renderGoods();
    else if (current === 'items') renderItems();
    else renderNow();
  }
  render();
  // 「いま」タブは1分ごとに更新
  setInterval(function () { if (current === 'now') renderNow(); }, 60000);
})();
