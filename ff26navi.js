// ファンフェス2026東京 当日ナビ
// 記事内の <div id="eg-ff26-navi"></div> に描画する。noindex.js の (5) から読み込まれる。
// データは 2026-10-26 時点の公式サイト（ステージ・フロア情報）。
(function () {
  var root = document.getElementById('eg-ff26-navi');
  if (!root || root.getAttribute('data-ready')) return;
  root.setAttribute('data-ready', '1');

  // ---------------- データ ----------------
  var DAYS = { 1: '2026-10-31', 2: '2026-11-01' };

  // [開始, 終了, 内容, 写真（img/ff26/stage_*.jpg・公式サイトの画像）]
  var STAGE = {
    1: [
      ['11:00', '13:00', '基調講演', 'keynote'],
      ['15:00', '16:30', 'CC大会 セミファイナル', 'ccrc'],
      ['16:30', '17:00', '吉田Pの一問一答タイムアタック'],
      ['17:00', '18:30', 'CC大会 ファイナル', 'ccrc'],
      ['19:30', '20:30', 'ピアノコンサート', 'piano']
    ],
    2: [
      ['10:30', '12:00', '開発パネル（サウンド）'],
      ['12:30', '13:30', 'LIVE Q&A'],
      ['13:50', '15:00', 'ミラプリコレクション', 'glamour'],
      ['15:30', '17:30', '直樹の部屋'],
      ['19:00', '20:30', 'THE PRIMALS ライブ', 'primals']
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

  var MAPS = [
    ['会場全体', 'map_messe_entire.jpg'],
    ['1-3ホール', 'map_messe_hall1-3.jpg'],
    ['4-6ホール（ステージ）', 'map_messe_hall4-6.jpg'],
    ['7ホール', 'map_messe_hall7.jpg'],
    ['豊砂公園（フード）', 'map_toyosuna.jpg'],
    ['イオンモール', 'map_aeon.jpg']
  ];
  var MAP_BASE = 'https://dualstreammedia-droid.github.io/eorzea-guide-theme/img/ff26/';

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
  function dur(m) { return m >= 60 ? Math.floor(m / 60) + '時間' + (m % 60 ? (m % 60) + '分' : '') : m + '分'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // ---------------- スタイル（表は記事の表と同じ見た目を使う） ----------------
  var css = document.createElement('style');
  css.textContent = [
    '#eg-ff26-navi{margin:12px 0 24px}',
    '#eg-ff26-navi img.nv-ph{display:block;width:100%;max-width:280px;height:auto;aspect-ratio:16/9;border-radius:4px;margin:2px 0 6px}',
    '#eg-ff26-navi tr.nv-off img.nv-ph{opacity:.5}',
    '#eg-ff26-navi .nv-day{margin:0 0 8px;font-size:14px}',
    '#eg-ff26-navi .nv-day button{font:inherit;background:none;border:0;padding:0 2px;color:#2563a6;text-decoration:underline;cursor:pointer}',
    '#eg-ff26-navi .nv-day button[aria-pressed="true"]{color:inherit;text-decoration:none;font-weight:700;cursor:default}',
    '#eg-ff26-navi .nv-s{display:block;font-size:13px;color:#666}',
    '#eg-ff26-navi .nv-now{color:#c0392b;font-weight:700}',
    '#eg-ff26-navi .nv-soon{color:#b5651d;font-weight:700}',
    '#eg-ff26-navi tr.nv-off td{color:#aaa}',
    '#eg-ff26-navi tr.nv-off .nv-s{color:#bbb}'
  ].join('');
  document.head.appendChild(css);

  var viewDay = null;
  function today() {
    var n = jstNow();
    if (n.date === DAYS[1]) return 1;
    if (n.date === DAYS[2]) return 2;
    return 0;
  }
  function hm(m) { return Math.floor(m / 60) + ':' + pad(m % 60); }

  function render() {
    var n = jstNow();
    var t = today();
    var day = viewDay || t || 1;
    var live = t === day;
    var h = '<p class="nv-day">表示する日：<button data-day="1" aria-pressed="' + (day === 1) + '">10/31（1日目）</button>／' +
      '<button data-day="2" aria-pressed="' + (day === 2) + '">11/1（2日目）</button></p>';
    h += live ? '<p>' + n.text + ' 時点の状況です（1分ごとに更新）。</p>'
      : '<p>当日に開くと、いまの時刻に合わせて「上演中」「受付終了まであと何分」が出ます。今は' + (day === 1 ? '1日目' : '2日目') + 'の予定を表示しています。</p>';

    // ステージ
    h += '<p><strong>ステージ（4-6ホール）</strong></p><table class="eg-num"><thead><tr><th>時間</th><th>内容</th></tr></thead><tbody>';
    var nextFound = false;
    STAGE[day].forEach(function (s) {
      var a = toMin(s[0]), b = toMin(s[1]), st = '', cls = '';
      if (live && n.min >= a && n.min < b) st = '<span class="nv-s nv-now">上演中（残り' + dur(b - n.min) + '）</span>';
      else if (live && n.min >= b) { st = '<span class="nv-s">終了</span>'; cls = ' class="nv-off"'; }
      else if (live && !nextFound) { nextFound = true; st = '<span class="nv-s">あと' + dur(a - n.min) + 'で開始</span>'; }
      h += '<tr' + cls + '><td>' + s[0] + '<br>〜' + s[1] + '</td><td>' + (s[3] ? '<img class="nv-ph" src="' + MAP_BASE + 'stage_' + s[3] + '.jpg" alt="' + esc(s[2]) + 'のイメージ（© SQUARE ENIX）" loading="lazy" width="640" height="360">' : '') + esc(s[2]) + st + '</td></tr>';
    });
    h += '</tbody></table>';

    // アクティビティ・お店
    h += '<p><strong>アクティビティ・お店の受付時間</strong>' + (live ? '<br>受付終了が近い順です。' : '') + '</p>' +
      '<table class="eg-num"><thead><tr><th>最終受付</th><th>場所</th></tr></thead><tbody>';
    var rows = SPOTS.map(function (s) {
      var open = toMin(day === 1 ? s[2] : s[4]);
      var close = toMin(day === 1 ? s[3] : s[5]);
      var last = close - s[6];
      var sp = SPECIAL_LAST[s[0]] && SPECIAL_LAST[s[0]][day];
      if (sp) last = toMin(sp);
      var sort = 0;
      if (live) sort = n.min < open ? 2000 + open : (n.min >= last ? 9000 : last - n.min);
      return { s: s, open: open, last: last, sort: sort };
    });
    if (live) rows.sort(function (x, y) { return x.sort - y.sort; });
    rows.forEach(function (r) {
      var s = r.s, st = '', cls = '';
      if (live) {
        if (n.min < r.open) st = '<span class="nv-s">' + hm(r.open) + 'から</span>';
        else if (n.min >= r.last) { st = '<span class="nv-s">受付終了</span>'; cls = ' class="nv-off"'; }
        else if (r.last - n.min <= 60) st = '<span class="nv-s nv-soon">あと' + dur(r.last - n.min) + '</span>';
        else st = '<span class="nv-s">あと' + dur(r.last - n.min) + '</span>';
      }
      h += '<tr' + cls + '><td>' + hm(r.last) + '</td><td>' + esc(s[0]) + st +
        '<span class="nv-s">' + esc(s[1]) + (s[7] ? '／' + esc(s[7]) : '') + '</span></td></tr>';
    });
    h += '</tbody></table>';

    // マップ
    h += '<p><strong>マップ</strong>（タップで大きな画像が開きます）<br>' +
      MAPS.map(function (m) { return '<a href="' + MAP_BASE + m[1] + '" target="_blank" rel="noopener">' + m[0] + '</a>'; }).join('／') + '</p>';
    root.innerHTML = h;
  }
  root.addEventListener('click', function (e) {
    var b = e.target.closest('[data-day]');
    if (!b) return;
    viewDay = +b.getAttribute('data-day'); render();
  });
  render();
  setInterval(render, 60000);
})();
