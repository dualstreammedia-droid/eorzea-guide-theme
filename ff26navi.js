// FF14ファンフェス マイプラン（ファンフェス2026東京 当日ナビ）
// 記事内の <div id="eg-ff26-navi"></div> に描画する。noindex.js の (5) から読み込まれる。
// データは 2026-10-28 時点の公式サイト（ステージ・フロア情報）。
(function () {
  var navi = document.getElementById('eg-ff26-navi');
  if (!navi || navi.getAttribute('data-ready')) return;
  navi.setAttribute('data-ready', '1');
  // root は1分ごとに描き直す部分。マップ・バス・公式リンクは extra に1回だけ描く（拡大やピンが消えないように）
  var root = document.createElement('div'), extra = document.createElement('div');
  navi.appendChild(root); (document.getElementById('eg-ff26-extra') || navi).appendChild(extra); // アプリ版ではマップを別のタブに出す

  // ---------------- データ ----------------
  var DAYS = { 1: '2026-10-31', 2: '2026-11-01' };

  // [開始, 終了, 内容, 写真（img/ff26/stage_*.jpg・公式サイトの画像）]
  var STAGE = {
    1: [
      ['11:00', '13:00', '基調講演', 'keynote'],
      ['15:00', '16:30', 'CC大会 セミファイナル', 'ccrc'],
      ['16:30', '17:00', '吉田Pの一問一答タイムアタック', 'time_attack'],
      ['17:00', '18:30', 'CC大会 ファイナル', 'ccrc_final'],
      ['19:30', '20:30', 'ピアノコンサート', 'piano']
    ],
    2: [
      ['10:30', '12:00', '開発パネル（サウンド）', 'dev_panel'],
      ['12:30', '13:30', 'LIVE Q&A', 'live_qa'],
      ['13:50', '15:00', 'ミラプリコレクション', 'glamour'],
      ['15:30', '17:30', '直樹の部屋', 'naokis_room'],
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
    ['ポップコーン・ドリンク販売', '1-3ホール 15', '10:00', '20:00', '10:00', '20:00', 0, 'ポップコーン770円・バケツ付きセット5,500円'],
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
  // クイックフォトセッション（4-6ホール 17・事前予約した人だけ）。[開始, 出演, 回]。開始から30分以内に集合
  var MEET_PLACE = '4-6ホール 17', MEET_STAY = 30;
  var MEET = {
    1: [['14:00', 'THE PRIMALS', 1], ['16:15', 'THE PRIMALS', 2]],
    2: [['12:00', 'Keiko', 1], ['13:00', '祖堅正慶＆マイケル・クリストファー・コージ・フォックス', 1], ['14:00', 'Keiko', 2],
      ['15:00', '祖堅正慶＆マイケル・クリストファー・コージ・フォックス', 2], ['16:00', 'Keiko', 3]]
  };
  function meetName(m) { return 'フォトセッション ' + m[1] + ' ' + String.fromCharCode(0x245f + m[2]); }
  // 豊砂公園のキッチンカー（公式・2026-10-28）。[番号, 店名, 売っているもの]
  var TRUCKS = [
    [3, 'BBQ Freely', '骨付き肉BBQ＆ホットドッグ'], [4, 'ローストチキンコオロギ', '国産ハーブ鶏のローストチキン'], [5, 'M cafe', 'カレーなどのカフェメニュー'],
    [6, 'わがしとべっか', 'わらび餅入りドリンク、創作和スイーツ'], [7, 'puelto pua', '山形いも煮、オムライス、ポテト'], [8, 'Gabu!!', 'ポテトフライ'],
    [9, 'ASLAN KEBAB', 'ケバブ、ロングポテト'], [10, '福篭', '京風たこ焼き'], [11, '笑う門には福来る', 'ご飯もの、サンド、ドリンク'],
    [12, 'R.Harbor', 'ブラジリアンチュロス'], [13, '焼肉八そら', '和牛焼肉丼'], [14, 'j-j-KITCHEN', '本格ケバブ'], [15, 'CUCCO', 'プルドチキン料理'],
    [16, '百合店', '軽食'], [17, 'ciaobella rosso', 'ピザコーン'], [18, 'Tacos Guild 駒沢', '沖縄タコス'], [19, 'Kero', '体が温まる料理'],
    [20, '堂の浦 鳴門本店', '鳴門鯛の塩らぁ麺'], [21, 'la kasseria', '本格ケバブ'], [22, 'kitchencar iroha', 'ホットドッグ、塩タン串など'],
    [23, 'BEER TRUCK LIQUID TANK', 'クラフトビールなどのドリンク、おつまみ、ご飯もの'], [24, 'フードトラック祠', '猟師が作るタコスやドリンク']
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

  // アクティビティ・お店の写真（img/ff26/spot_*.jpg・公式サイトの画像）
  var PHOTO = {
    'グッズ売り場': 'store', 'アルカディアくじ': 'fanfest_lottery', 'チョコボレースVR': 'chocobo_race_vr', 'リアルトレジャーハント': 'treasure_hunt',
    'YOKERO': 'yokero', 'ナイスヘッド・ガーデン': 'nice_head', 'ダンシング・グリーン': 'dancing_green', 'チェキ撮影・プリント': 'instax',
    'オードパルファム テスター': 'fragrance', 'トートバッグ作り': 'workshop', 'ナインズ・キャッチャー': 'moogle_catcher', 'スペースインベーダー': 'outrunner',
    'エオルゼア検定': 'eorzea_quiz', 'NPC名鑑 体験': 'npc_directory', 'FFトレカ体験': 'ff_tcg', 'ドマ式麻雀 修練場': 'mahjong', 'エッダの鞄': 'eddas_bag',
    '出張エオルゼアカフェ': 'eorzea_cafe', 'アニメイトカフェ出張版': 'animate_cafe', 'POP UP STORE': 'popup_store', 'リアル謎解き': 'real_mystery',
    'ヤマト運輸 宅配': 'shipping', 'キッチンカー': 'food_truck', 'でぶチョコボ フォトスポット': 'fat_chocobo',
    'クイックフォトセッション': 'meet_and_greet', 'ポップコーン・ドリンク販売': 'popcorn_bucket'
  };
  [1, 2].forEach(function (d) { MEET[d].forEach(function (m) { PHOTO[meetName(m)] = 'meet_and_greet'; }); });
  // 小さい写真＋文字を横に並べる
  function withThumb(name, inner) {
    var src = PHOTO[name] ? 'spot_' + PHOTO[name] : (STAGE_PHOTO[name] ? 'stage_' + STAGE_PHOTO[name] : '');
    if (!src) return inner;
    return '<div class="nv-it"><img class="nv-th" src="' + MAP_BASE + src + '.jpg" alt="' + esc(name) + '（© SQUARE ENIX）" loading="lazy" width="320" height="180"><div>' + inner + '</div></div>';
  }
  var STAGE_PHOTO = {};
  [1, 2].forEach(function (d) { STAGE[d].forEach(function (s) { if (s[3]) STAGE_PHOTO[s[2]] = s[3]; }); });
  var DAY_LABEL = { 1: '10/31（土）1日目', 2: '11/1（日）2日目' };
  var DAY_DATE = { 1: '10/31（土）', 2: '11/1（日）' };
  var DAY_COLOR = { 1: '#1a2f4e', 2: '#7a2e1f' };
  // 日にちの切り替え（ナビとシミュレーションで共通）。下の帯に、いま表示している日を大きく出す
  function daySwitch(day, attr, bar) {
    return '<div class="nv-dsw" role="group" aria-label="日にち">' + [1, 2].map(function (d) {
      return '<button type="button" ' + attr + '="' + d + '" aria-pressed="' + (day === d) + '" style="--c:' + DAY_COLOR[d] + '">' +
        '<span class="nv-dd">' + DAY_DATE[d] + '</span>' + (d === 1 ? '1日目' : '2日目') +
        '<span class="nv-dn">' + (day === d ? '表示中' : 'タップで切り替え') + '</span></button>';
    }).join('') + '</div><div class="nv-dbar" style="background:' + DAY_COLOR[day] + ';color:#fff!important;margin:0 0 12px!important">' + bar + '</div>';
  }

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
    '.nv-bus{margin:6px 0 10px;border:1px solid #e3dccb;border-radius:6px;background:#fff}',
    '.nv-bus>summary{cursor:pointer;padding:10px 12px;font-weight:700;line-height:1.5}',
    '.nv-bus>summary .nv-s{display:block;font-weight:400}',
    '.nv-bus[open]>summary{border-bottom:1px solid #e3dccb}',
    '.nv-bus>table,.nv-bus>p{margin:8px 10px!important;width:calc(100% - 20px)!important}',
    '#eg-ff26-navi img.nv-ph{display:block;width:100%;max-width:280px;height:auto;aspect-ratio:16/9;border-radius:4px;margin:2px 0 6px}',
    '#eg-ff26-navi tr.nv-off img.nv-ph{opacity:.5}',
    '.nv-dsw{display:flex;gap:8px;margin:8px 0 0}',
    '.nv-dsw button{flex:1;font:inherit;font-size:14px;line-height:1.4;padding:8px 4px;border:2px solid #bbb;border-bottom:0;border-radius:6px 6px 0 0;background:#f2f2f2;color:#444;cursor:pointer}',
    '.nv-dsw button span{color:inherit!important}',
    '.nv-dsw .nv-dd{display:block;font-size:18px;font-weight:700}',
    '.nv-dsw .nv-dn{display:block;font-size:12px;text-decoration:underline}',
    '.nv-dsw button[aria-pressed="true"]{background:var(--c);border-color:var(--c);color:#fff;cursor:default}',
    '.nv-dsw button[aria-pressed="true"] .nv-dn{text-decoration:none}',
    '.nv-dbar,.nv-dbar *{color:#fff!important}',
    '.nv-dbar{margin:0 0 12px;padding:8px 10px;font-weight:700;font-size:15px;border-radius:0 0 6px 6px}',
    '.nv-it{display:flex;gap:8px;align-items:flex-start}',
    '.nv-it>div{min-width:0}',
    'img.nv-th{flex:none;width:80px;height:45px;object-fit:cover;border-radius:3px;margin:2px 0 0}',
    'tr.nv-off img.nv-th{opacity:.5}',
    '#eg-ff26-navi .nv-s{display:block;font-size:13px;color:#666}',
    '#eg-ff26-navi .nv-now{color:#c0392b;font-weight:700}',
    '#eg-ff26-navi .nv-soon{color:#b5651d;font-weight:700}',
    '#eg-ff26-navi tr.nv-off td{color:#aaa}',
    '#eg-ff26-navi tr.nv-off .nv-s{color:#bbb}',
    '#eg-ff26-navi .nv-dt{margin:12px 0 0;font-weight:700}',
    '.nv-mtab{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0}',
    '.nv-mtab button,.nv-zm button{font:inherit;font-size:14px;padding:6px 10px;border:1px solid #9b8a5e;border-radius:4px;background:#fff;color:#333;cursor:pointer}',
    '.nv-mtab button[aria-pressed="true"]{background:#1a2f4e;border-color:#1a2f4e;color:#fff}',
    '.nv-zm{margin:6px 0}.nv-zm button{min-width:44px;margin:0 6px 0 0}',
    '.nv-mbox{overflow:auto;-webkit-overflow-scrolling:touch;border:1px solid #d8cfb8;max-height:70vh}',
    '.nv-min{position:relative}.nv-min img{display:block;width:100%;height:auto;margin:0;cursor:crosshair}',
    '.nv-pin{position:absolute;transform:translate(-50%,calc(-100% + 8px));pointer-events:none;text-align:center;line-height:1.2}',
    '.nv-pin b{display:block;background:#c0392b;color:#fff;font-size:13px;padding:3px 8px;border-radius:12px;white-space:nowrap}',
    '.nv-pin:after{content:"";display:block;width:12px;height:12px;margin:3px auto 0;border-radius:50%;background:#c0392b;border:2px solid #fff;box-shadow:0 0 0 1px #c0392b}',
    '.nv-pin .nv-pt{display:none}'
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
    var h = daySwitch(day, 'data-day', DAY_LABEL[day] + (live ? '　いま ' + n.text : 'の予定'));
    h += live ? '<p>' + n.text + ' 時点の状況です（1分ごとに更新）。</p>'
      : '<p>当日に開くと、いまの時刻に合わせて「上演中」「受付終了まであと何分」が出ます。</p>';

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

    // クイックフォトセッション
    h += '<p><strong>クイックフォトセッション（4-6ホール 17）</strong><br><span class="nv-s">事前予約した人だけ参加できます。開始時刻から30分以内に集合してください。</span></p>' +
      '<table class="eg-num"><thead><tr><th>開始</th><th>出演</th></tr></thead><tbody>';
    var meetNext = false;
    MEET[day].forEach(function (m) {
      var a = toMin(m[0]), st = '', cls = '';
      if (live && n.min >= a && n.min < a + 30) st = '<span class="nv-s nv-now">集合受付中（あと' + dur(a + 30 - n.min) + '）</span>';
      else if (live && n.min >= a + 30) { st = '<span class="nv-s">集合終了</span>'; cls = ' class="nv-off"'; }
      else if (live && !meetNext) { meetNext = true; st = '<span class="nv-s">あと' + dur(a - n.min) + 'で開始</span>'; }
      h += '<tr' + cls + '><td>' + m[0] + '</td><td>' + withThumb('クイックフォトセッション', esc(m[1]) + ' ' + String.fromCharCode(0x245f + m[2]) + st) + '</td></tr>';
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
      h += '<tr' + cls + '><td>' + hm(r.last) + '</td><td>' + withThumb(s[0], esc(s[0]) + st +
        '<span class="nv-s">' + esc(s[1]) + (s[7] ? '／' + esc(s[7]) : '') + '</span>') + '</td></tr>';
    });
    h += '</tbody></table>';

    // キッチンカー一覧（折りたたみ）
    var tOpen = live && n.min >= 600 && n.min < 1200;
    h += '<p><strong>キッチンカー（豊砂公園）</strong><br><span class="nv-s">10:00〜20:00' + (live ? (tOpen ? '　あと' + dur(1200 - n.min) + 'で終了' : n.min < 600 ? '　10:00から' : '　営業終了') : '') + '。決済方法はお店ごとに違うので、現地で確認してください。</span></p>' +
      '<details class="nv-bus" data-bus="truck"' + (busOpen.truck ? ' open' : '') + '><summary>' + TRUCKS.length + '台の一覧<span class="nv-s">お店と売っているものを見る</span></summary>' +
      '<table class="eg-num"><thead><tr><th>番号</th><th>お店・売っているもの</th></tr></thead><tbody>' +
      TRUCKS.map(function (t) { return '<tr><td>' + t[0] + '</td><td>' + esc(t[1]) + '<span class="nv-s">' + esc(t[2]) + '</span></td></tr>'; }).join('') +
      '</tbody></table></details>';

    h += busHtml(live, n.min);
    root.innerHTML = h;
  }

  // ---------------- 会場間シャトルバス（公式サイトの時刻表・2026-10-27確認） ----------------
  // [見出し, 乗り場→行き先, 時刻, 注意]。クロス・ウェーブ幕張の便はコスプレ更衣室・クロークの利用者だけ乗れる
  var BUS = [
    ['会場間（幕張メッセ ⇔ イオンモール・豊砂公園）', [
      ['幕張メッセ 中央ロータリー（1番乗り場）発 → イオンモール幕張新都心', { 10: [35, 55], 11: [15, 35, 55], 12: [15, 35, 55], 13: [15, 35, 55], 14: [15, 35, 55], 15: [15, 35, 55], 16: [15, 35, 55], 17: [15, 35, 55], 18: [15, 35, 55] }, ''],
      ['イオンモール幕張新都心 グランドモール前 発 → 幕張メッセ', { 10: [50], 11: [10, 30, 50], 12: [10, 30, 50], 13: [10, 30, 50], 14: [10, 30, 50], 15: [10, 30, 50], 16: [10, 30, 50], 17: [10, 30, 50], 18: [10, 30, 50], 19: [10] }, '']
    ], 'キッチンカーやカフェのある豊砂公園は、イオンモールのすぐ隣です。このバスでイオンモールまで行けば、豊砂公園にも歩いて行けます。歩道橋を歩いても行けます（メッセ1-3ホール側からイオンモールまで徒歩約10〜15分）。'],
    ['コスプレ更衣室・クロークを使う人だけ（幕張メッセ ⇔ クロス・ウェーブ幕張）', [
      ['幕張メッセ 中央ロータリー（1番乗り場）発 → クロス・ウェーブ幕張', { 8: [50], 9: [5, 20, 35, 50], 10: [5, 20], 20: [30, 45], 21: [0, 15, 30] }, ''],
      ['クロス・ウェーブ幕張 発 → 幕張メッセ', { 8: [30, 45], 9: [0, 15, 30, 45], 10: [0, 15, 30], 20: [40, 55], 21: [10] }, '11/1（日）の9:45・10:00・10:15の便は、ミラプリコレクションに出る人が優先です。']
    ], '更衣室・クロークを予約した人だけが乗れる便です。朝と夜だけ走ります。']
  ];
  var busOpen = {};
  function busHtml(live, now) {
    var h = '<p><strong>シャトルバス</strong><br>バスは本数と定員に限りがあります。</p>';
    BUS.forEach(function (g, gi) {
      h += '<p class="nv-dt"><strong>' + g[0] + '</strong><br><span class="nv-s">' + g[2] + '</span></p>';
      g[1].forEach(function (b, bi) {
        var next = null, k = gi + '-' + bi;
        Object.keys(b[1]).forEach(function (hr) { b[1][hr].forEach(function (mi) { var t = hr * 60 + mi; if (live && t >= now && next === null) next = t; }); });
        // 時刻表は折りたたむ（1分ごとに描き直しても、開いたものは開いたまま）
        h += '<details class="nv-bus" data-bus="' + k + '"' + (busOpen[k] ? ' open' : '') + '><summary>' + b[0] + (next !== null ? '<span class="nv-s nv-now">次は ' + hm(next) + '（' + (next > now ? 'あと' + dur(next - now) : 'まもなく発車') + '）</span>' : '') + '<span class="nv-s">時刻表を見る</span></summary>' +
          '<table class="eg-num"><thead><tr><th>時</th><th>分</th></tr></thead><tbody>' +
          Object.keys(b[1]).map(function (hr) { return '<tr><td>' + hr + '時</td><td>' + b[1][hr].map(pad).join('、') + '</td></tr>'; }).join('') + '</tbody></table>' +
          (b[2] ? '<p class="nv-s">' + b[2] + '</p>' : '') + '</details>';
      });
    });
    return h + '<p class="nv-s">両日とも同じ時刻です。時刻表は変わることがあるので、<a href="https://fanfest.finalfantasyxiv.com/2026/jp/about/" target="_blank" rel="noopener">公式の運行案内</a>も確認してください。</p>';
  }

  // ---------------- ホールのマップ（切り替え・拡大・「今ここ」のピン） ----------------
  var ZOOMS = [1, 1.5, 2, 3];
  var nst = { map: 1, zoom: 0, pin: null };
  try { nst.pin = JSON.parse(localStorage.getItem('eg-ff26-pin') || 'null'); } catch (e) {}
  var OFFICIAL = [
    ['会場マップ', 'maps/'], ['ステージ・タイムテーブル', 'stages/'], ['アクティビティ・フロア', 'floors/'],
    ['アクティビティ事前予約', 'floors/activity-reservation/'], ['お知らせ', 'news/'], ['アクセス・シャトルバス', 'about/']
  ];
  function renderExtra() {
    var pin = nst.pin && nst.pin.m === nst.map ? nst.pin : null;
    var h = '<p><strong>ホールのマップ</strong><br>マップをタップすると「今ここ」の印を置けます。待ち合わせのときに、スクショして送るのにも使えます。</p>' +
      '<div class="nv-mtab">' + MAPS.map(function (m, i) { return '<button type="button" data-map="' + i + '" aria-pressed="' + (i === nst.map) + '">' + m[0] + '</button>'; }).join('') + '</div>' +
      '<p class="nv-zm"><button type="button" data-zoom="-1" aria-label="縮小">−</button><button type="button" data-zoom="1" aria-label="拡大">＋</button>' +
      (pin ? '<button type="button" data-unpin>印を消す</button>' : '') + '</p>' +
      '<div class="nv-mbox"><div class="nv-min" style="width:' + ZOOMS[nst.zoom] * 100 + '%"><img src="' + MAP_BASE + MAPS[nst.map][1] + '" alt="' + MAPS[nst.map][0] + 'のマップ（© SQUARE ENIX）" data-pinmap>' +
      (pin ? '<span class="nv-pin" style="left:' + pin.x + '%;top:' + pin.y + '%"><b>今ここ</b><span class="nv-pt">' + esc(pin.t) + '</span></span>' : '') + '</div></div>' +
      '<p class="nv-s">マップは公式サイトのもの（© SQUARE ENIX）。印はこのスマホにだけ保存され、ほかの人には見えません。</p>' +
      '<p><strong>公式サイト</strong><br>' + OFFICIAL.map(function (o) { return '<a href="https://fanfest.finalfantasyxiv.com/2026/jp/' + o[1] + '" target="_blank" rel="noopener">' + o[0] + '</a>'; }).join('／') + '</p>';
    extra.innerHTML = h;
  }
  extra.addEventListener('click', function (e) {
    var b = e.target.closest('[data-map],[data-zoom],[data-unpin]');
    if (b && b.hasAttribute('data-map')) { nst.map = +b.getAttribute('data-map'); nst.zoom = 0; }
    else if (b && b.hasAttribute('data-zoom')) nst.zoom = Math.max(0, Math.min(ZOOMS.length - 1, nst.zoom + +b.getAttribute('data-zoom')));
    else if (b) { nst.pin = null; try { localStorage.removeItem('eg-ff26-pin'); } catch (x) {} }
    else if (e.target.hasAttribute('data-pinmap')) {
      var r = e.target.getBoundingClientRect(), n = jstNow();
      nst.pin = { m: nst.map, x: +((e.clientX - r.left) / r.width * 100).toFixed(1), y: +((e.clientY - r.top) / r.height * 100).toFixed(1), t: n.text + ' に置いた印' };
      try { localStorage.setItem('eg-ff26-pin', JSON.stringify(nst.pin)); } catch (x) {}
    } else return;
    var box = extra.querySelector('.nv-mbox'), sx = box ? box.scrollLeft : 0;
    renderExtra();
    extra.querySelector('.nv-mbox').scrollLeft = sx;
  });
  root.addEventListener('toggle', function (e) { var k = e.target.getAttribute && e.target.getAttribute('data-bus'); if (k) busOpen[k] = e.target.open; }, true);
  var onDay = null; // シミュレーション側の日にちも合わせる
  root.addEventListener('click', function (e) {
    var b = e.target.closest('[data-day]');
    if (!b) return;
    viewDay = +b.getAttribute('data-day'); render();
    if (onDay) onDay(viewDay);
  });
  render();
  renderExtra();
  setInterval(render, 60000);

  // ================= 回る順番のシミュレーション =================
  // 記事内の <div id="eg-ff26-plan"></div> に描画する。
  var proot = document.getElementById('eg-ff26-plan');
  if (!proot) return;

  // 場所 → エリア
  function areaOf(place) {
    if (place.indexOf('屋外') === 0) return 'OUT';
    if (place.indexOf('1-3') === 0) return 'H13';
    if (place.indexOf('4-6') === 0) return 'H46';
    if (place.indexOf('7ホール') === 0) return 'H7';
    if (place.indexOf('2F') === 0) return 'MALL';
    if (place.indexOf('豊砂') === 0) return 'PARK';
    if (place.indexOf('イオン') === 0) return 'AEON';
    return 'H13';
  }
  var AREA_NAME = { H13: '1-3ホール', H46: '4-6ホール（ステージ）', H7: '7ホール', OUT: '屋外展示場', MALL: '2F中央モール', PARK: '豊砂公園', AEON: 'イオンモール' };
  // 徒歩の目安（分）。地図上の歩行ルートの距離から計算し、人の多さを見込んで少し長めにしている
  var WALK = {
    'H13-H46': 4, 'H13-H7': 7, 'H46-H7': 4, 'H13-OUT': 3, 'H46-OUT': 6, 'H7-OUT': 9,
    'H13-MALL': 2, 'H46-MALL': 3, 'H7-MALL': 6, 'MALL-OUT': 3,
    'H13-PARK': 10, 'OUT-PARK': 10, 'MALL-PARK': 11, 'H46-PARK': 13, 'H7-PARK': 16,
    'H13-AEON': 15, 'OUT-AEON': 15, 'MALL-AEON': 16, 'H46-AEON': 18, 'H7-AEON': 21, 'AEON-PARK': 5
  };
  function walk(a, b) { return a === b ? 0 : (WALK[a + '-' + b] || WALK[b + '-' + a] || 10); }
  function inMesse(a) { return a !== 'PARK' && a !== 'AEON'; }
  function routeText(a, b) {
    if (inMesse(a) && inMesse(b)) return '2F中央モールを通って移動';
    if ((a === 'PARK' && b === 'AEON') || (a === 'AEON' && b === 'PARK')) return '豊砂公園のすぐ北がイオンモール。グランドスクエア入口から入るとグランドコート（38・39）が近い';
    if (b === 'PARK' || b === 'AEON') return '幕張メッセから歩道橋で移動' + (b === 'AEON' ? '。メッセ中央ロータリー（1番乗り場）からイオンモール行きのシャトルバスもあり' : '。イオンモール行きのシャトルバスで行って、隣の豊砂公園へ歩くこともできる');
    return '歩道橋で幕張メッセへ' + (a === 'AEON' ? '。イオンモールからメッセ行きのシャトルバスもあり' : '。隣のイオンモール（グランドモール前）からメッセ行きのシャトルバスもあり');
  }

  // 所要時間の初期値（分）。待ち時間は含まない
  var STAY = {
    'グッズ売り場': 60, 'アルカディアくじ': 20, 'チョコボレースVR': 30, 'リアルトレジャーハント': 20, 'YOKERO': 30,
    'ナイスヘッド・ガーデン': 20, 'ダンシング・グリーン': 20, 'チェキ撮影・プリント': 15, 'オードパルファム テスター': 15,
    'トートバッグ作り': 45, 'ナインズ・キャッチャー': 20, 'スペースインベーダー': 20, 'エオルゼア検定': 20, 'NPC名鑑 体験': 30,
    'FFトレカ体験': 45, 'ドマ式麻雀 修練場': 30, 'エッダの鞄': 60, '出張エオルゼアカフェ': 60, 'アニメイトカフェ出張版': 60,
    'POP UP STORE': 30, 'リアル謎解き': 60, 'ポップコーン・ドリンク販売': 15, 'ヤマト運輸 宅配': 15, 'キッチンカー': 45, 'でぶチョコボ フォトスポット': 15
  };
  var EXTRA = [
    ['キッチンカー', '豊砂公園', '10:00', '20:00', '10:00', '20:00', 0, '22台。お店は「いま」のキッチンカー一覧に'],
    ['でぶチョコボ フォトスポット', 'イオンモール 38', '10:00', '21:00', '10:00', '21:00', 0, '']
  ];
  var OLD_TRUCK = '昼食（キッチンカー）'; // v22までの名前。保存済みの選択を引き継ぐ
  var FLEX = SPOTS.concat(EXTRA);
  var CHOICES = [15, 20, 30, 45, 60, 90, 120];
  // 着く・帰る時刻は10分きざみで選べる
  function steps(a, b) { var o = []; for (var m = toMin(a); m <= toMin(b); m += 10) o.push(hm(m)); return o; }
  var STARTS = steps('9:00', '20:30');
  var ENDS = steps('9:30', '21:00');

  // 選んだ内容はこのスマホに保存
  var PKEY = 'eg-ff26-plan';
  var pst = {};
  try { pst = JSON.parse(localStorage.getItem(PKEY) || '{}') || {}; } catch (e) { pst = {}; }
  pst.day = today() || pst.day || 1; pst.start = pst.start || '10:00'; pst.end = pst.end || '21:00'; pst.pick = pst.pick || {}; pst.stay = pst.stay || {}; pst.at = pst.at || {}; pst.memo = pst.memo || {}; pst.rsv = pst.rsv || {};
  function renameTruck(o) {
    [o.pick, o.at, o.memo, o.rsv].forEach(function (t) {
      Object.keys(t).forEach(function (k) { if (k.indexOf(OLD_TRUCK) >= 0) { t[k.replace(OLD_TRUCK, 'キッチンカー')] = t[k]; delete t[k]; } });
    });
    if (o.stay && o.stay[OLD_TRUCK]) { o.stay['キッチンカー'] = o.stay[OLD_TRUCK]; delete o.stay[OLD_TRUCK]; }
  }
  renameTruck(pst);
  // 予定をURLにして送る（#ff26=...）。受け取った人は、その日の選択を読み込める
  function planCode(d) {
    var o = { v: 1, d: d, s: pst.start, e: pst.end, p: [], st: {}, at: {}, m: {}, r: [] };
    Object.keys(pst.pick).forEach(function (k) {
      if (k.indexOf(d + ':') !== 0) return;
      var name = k.split(':').slice(2).join(':');
      o.p.push(k.slice(2));
      if (pst.stay[name]) o.st[name] = pst.stay[name];
      if (pst.at[k]) o.at[k.slice(2)] = pst.at[k];
      if (pst.memo[k]) o.m[k.slice(2)] = pst.memo[k];
      if (pst.rsv[k]) o.r.push(k.slice(2));
    });
    try { return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/=+$/, ''); } catch (e) { return ''; }
  }
  function readShared() {
    var m = location.hash.match(/ff26=([A-Za-z0-9+\/]+)/);
    if (!m) return null;
    try { var o = JSON.parse(decodeURIComponent(escape(atob(m[1])))); return o && o.v === 1 && (o.d === 1 || o.d === 2) && o.p ? o : null; } catch (e) { return null; }
  }
  function loadShared(o) {
    var d = o.d, pre = d + ':';
    [pst.pick, pst.at, pst.memo, pst.rsv].forEach(function (t) { Object.keys(t).forEach(function (k) { if (k.indexOf(pre) === 0) delete t[k]; }); });
    o.p.forEach(function (k) { pst.pick[pre + k] = 1; });
    Object.keys(o.st || {}).forEach(function (n) { pst.stay[n] = +o.st[n]; });
    Object.keys(o.at || {}).forEach(function (k) { pst.at[pre + k] = o.at[k]; });
    Object.keys(o.m || {}).forEach(function (k) { pst.memo[pre + k] = String(o.m[k]).slice(0, 40); });
    (o.r || []).forEach(function (k) { pst.rsv[pre + k] = 1; });
    pst.day = d; pst.start = o.s || pst.start; pst.end = o.e || pst.end;
    renameTruck(pst);
  }
  var shared = readShared();
  function psave() { try { localStorage.setItem(PKEY, JSON.stringify(pst)); } catch (e) {} }
  function pk(d, kind, name) { return d + ':' + kind + ':' + name; }
  function hoursOf(s, d) {
    var last = toMin(d === 1 ? s[3] : s[5]) - s[6];
    var sp = SPECIAL_LAST[s[0]] && SPECIAL_LAST[s[0]][d];
    return { open: toMin(d === 1 ? s[2] : s[4]), last: sp ? toMin(sp) : last };
  }

  // 予定を組む：ステージと、行く時間を決めたものは時間固定。それ以外は、次の固定の予定までに移動込みで終わるものを、すぐ始められる順（同じなら受付終了が早い順）に入れる
  function simulate(d) {
    var endT = toMin(pst.end), late = [];
    var fixed = STAGE[d].filter(function (s) { return pst.pick[pk(d, 's', s[2])]; })
      .map(function (s) { return { kind: 'stage', name: s[2], area: 'H46', a: toMin(s[0]), b: toMin(s[1]), last: toMin(s[0]) }; });
    MEET[d].forEach(function (m) {
      var name = meetName(m);
      if (!pst.pick[pk(d, 'm', name)]) return;
      var a = toMin(m[0]);
      fixed.push({ kind: 'do', meet: true, name: name, place: MEET_PLACE, area: 'H46', a: a, b: a + MEET_STAY, at: a, stay: MEET_STAY });
    });
    var todo = [];
    FLEX.filter(function (s) { return pst.pick[pk(d, 'f', s[0])]; }).forEach(function (s) {
      var h = hoursOf(s, d), at = pst.at[pk(d, 'f', s[0])];
      var x = { name: s[0], place: s[1], area: areaOf(s[1]), open: h.open, last: h.last, stay: pst.stay[s[0]] || STAY[s[0]] || 30 };
      if (at) { x.kind = 'do'; x.a = toMin(at); x.b = x.a + x.stay; fixed.push(x); } else todo.push(x);
    });
    fixed = fixed.sort(function (p, q) { return p.a - q.a; })
      .filter(function (x) { if (x.a < endT) return true; late.push(x); return false; });
    var t = toMin(pst.start), here = null, out = [], fi = 0;
    function moveTo(area) {
      if (here && here !== area) { var w = walk(here, area); out.push({ kind: 'move', a: t, b: t + w, from: here, to: area }); t += w; }
      here = area;
    }
    while (todo.length || fi < fixed.length) {
      var nf = fixed[fi];
      var best = null, bestKey = 0;
      todo.forEach(function (x) {
        var begin = Math.max(t + (here ? walk(here, x.area) : 0), x.open);
        if (begin > x.last || begin + x.stay > endT) return;
        if (nf && begin + x.stay + walk(x.area, nf.area) > nf.a) return;
        var key = begin * 2000 + x.last;
        if (!best || key < bestKey) { best = x; bestKey = key; }
      });
      if (best) {
        moveTo(best.area);
        if (t < best.open) { out.push({ kind: 'wait', a: t, b: best.open }); t = best.open; }
        out.push({ kind: 'do', a: t, b: t + best.stay, name: best.name, place: best.place });
        t += best.stay;
        todo.splice(todo.indexOf(best), 1);
        continue;
      }
      if (!nf) break;
      var w0 = here && here !== nf.area ? walk(here, nf.area) : 0;
      if (t + w0 < nf.a) { out.push({ kind: 'free', a: t, b: nf.a - w0 }); t = nf.a - w0; } // 空き時間はいまの場所で過ごし、間に合うように移動する
      moveTo(nf.area);
      var lt = t > nf.a ? t - nf.a : 0;
      if (nf.kind === 'stage') {
        out.push({ kind: 'stage', a: nf.a, b: Math.min(nf.b, endT), name: nf.name, late: lt, cut: nf.b > endT });
        t = Math.max(t, nf.b);
      } else { // 行く時間を決めたもの。前の予定が押したら、その分あとにずれる
        var a = Math.max(t, nf.a);
        out.push({ kind: 'do', meet: nf.meet, a: a, b: Math.min(a + nf.stay, endT), name: nf.name, place: nf.place, at: nf.a, late: lt, cut: a + nf.stay > endT });
        t = a + nf.stay;
      }
      fi++;
    }
    return { rows: out, left: late.concat(todo) };
  }

  // ---------- ルートマップ（公式の会場全体マップに、豊砂公園・イオンモールを右に足して線を引く） ----------
  var XY = { H7: [330, 270], H46: [540, 270], H13: [876, 270], MALL: [876, 384], OUT: [948, 528], PARK: [1445, 470], AEON: [1445, 205] };
  var CORR = 390; // 2F中央モールの通路の高さ
  var RANGES = [['すべて', 0, 1440], ['〜12時', 0, 720], ['12〜15時', 720, 900], ['15〜18時', 900, 1080], ['18時〜', 1080, 1440]];
  function circled(n) { return n <= 20 ? String.fromCharCode(0x245f + n) : '(' + n + ')'; }
  function legPath(a, b) {
    var A = XY[a], B = XY[b];
    if (inMesse(a) && inMesse(b)) return [A, [A[0], CORR], [B[0], CORR], B];
    if (!inMesse(a) && !inMesse(b)) return [A, B];
    var out = [[1030, CORR], [1260, 470], XY.PARK];
    var p;
    if (inMesse(a)) { p = [A, [A[0], CORR]].concat(out); if (b === 'AEON') p.push(B); }
    else { p = [B, [B[0], CORR]].concat(out); if (a === 'AEON') p.push(A); p.reverse(); }
    return p;
  }
  function mapModel(rows, ri) {
    var rg = RANGES[ri];
    var stops = rows.filter(function (x) { return (x.kind === 'do' || x.kind === 'stage') && x.b > rg[1] && x.a < rg[2]; })
      .map(function (x) { return { no: x.no, area: x.kind === 'stage' ? 'H46' : areaOf(x.place) }; });
    var legs = [], dots = [], used = {};
    for (var i = 1; i < stops.length; i++) {
      if (stops[i - 1].area !== stops[i].area) legs.push(legPath(stops[i - 1].area, stops[i].area));
    }
    stops.forEach(function (st) {
      var k = used[st.area] = (used[st.area] || 0) + 1;
      dots.push({ no: st.no,
        x: XY[st.area][0] + (k - 1) % 4 * 58 - (st.area === 'PARK' || st.area === 'AEON' ? 87 : 0),
        y: XY[st.area][1] + Math.floor((k - 1) / 4) * 58 });
    });
    return { legs: legs, dots: dots };
  }
  function routeMap(rows) {
    var mm = mapModel(rows, pst.range || 0);
    var g = '<svg viewBox="0 0 1650 675" class="nv-map" role="img" aria-label="回る順番のルートマップ">' +
      '<image href="' + MAP_BASE + 'map_route_base.jpg" x="0" y="0" width="1200" height="675"/>' +
      '<rect x="1200" y="0" width="450" height="675" fill="#efe6cc"/>' +
      '<rect x="1270" y="80" width="350" height="190" rx="10" fill="#f8f2e0" stroke="#9b8a5e" stroke-width="3"/>' +
      '<text x="1445" y="130" text-anchor="middle" font-size="34" font-weight="700" fill="#5b4a2a">イオンモール</text>' +
      '<rect x="1270" y="370" width="350" height="200" rx="10" fill="#e3ecd0" stroke="#7d9460" stroke-width="3"/>' +
      '<text x="1445" y="540" text-anchor="middle" font-size="34" font-weight="700" fill="#3d5228">豊砂公園（フード）</text>' +
      '<path d="M1030 ' + CORR + ' L1260 470" stroke="#9b8a5e" stroke-width="4" stroke-dasharray="10 8" fill="none"/>' +
      '<text x="1090" y="480" font-size="24" fill="#5b4a2a">歩道橋</text>';
    mm.legs.forEach(function (lg) {
      g += '<polyline points="' + lg.map(function (q) { return q[0] + ',' + q[1]; }).join(' ') + '" fill="none" stroke="#c0392b" stroke-width="8" stroke-linejoin="round" stroke-linecap="round" opacity=".85"/>';
    });
    mm.dots.forEach(function (st) {
      g += '<circle cx="' + st.x + '" cy="' + st.y + '" r="26" fill="#c0392b" stroke="#fff" stroke-width="4"/>' +
        '<text x="' + st.x + '" y="' + (st.y + 10) + '" text-anchor="middle" font-size="28" font-weight="700" fill="#fff">' + st.no + '</text>';
    });
    g += '</svg>';
    return '<p class="nv-rg">マップに出す時間帯：<select data-range>' + RANGES.map(function (r, i) {
      return '<option value="' + i + '"' + (i === (pst.range || 0) ? ' selected' : '') + '>' + r[0] + '</option>';
    }).join('') + '</select></p>' + g + '<p class="nv-s">番号は下の表の順番です。マップは公式の会場マップ（© SQUARE ENIX）の右側に、豊砂公園とイオンモールを足したものです（距離の縮尺は実際と違います）。</p>';
  }

  // ---------- 1枚の画像にまとめる（マップ＋回る順番）。X・LINE などで共有できるようにする ----------
  var PAGE_URL = 'https://www.eorzea-guide.com/entry/2026/10/26/020356';
  var FONT = '"Hiragino Sans","Hiragino Kaku Gothic ProN","Noto Sans JP","Yu Gothic",Meiryo,sans-serif';
  function loadImg(src) {
    return new Promise(function (ok) {
      var im = new Image();
      im.crossOrigin = 'anonymous';
      im.onload = function () { ok(im); };
      im.onerror = function () { ok(null); };
      im.src = src + '?c=1'; // ページ内の画像と別に、CORS つきで読み込む
    });
  }
  function thumbSrc(name) {
    return PHOTO[name] ? MAP_BASE + 'spot_' + PHOTO[name] + '.jpg' : (STAGE_PHOTO[name] ? MAP_BASE + 'stage_' + STAGE_PHOTO[name] + '.jpg' : '');
  }
  function wrapText(ctx, text, maxW) {
    var lines = [], cur = '';
    for (var i = 0; i < text.length; i++) {
      if (ctx.measureText(cur + text[i]).width > maxW && cur) { lines.push(cur); cur = ''; }
      cur += text[i];
    }
    if (cur) lines.push(cur);
    return lines;
  }
  function drawMap(ctx, im, mm, x0, y0, sc) {
    ctx.save();
    ctx.translate(x0, y0); ctx.scale(sc, sc);
    if (im) ctx.drawImage(im, 0, 0, 1200, 675);
    else { ctx.fillStyle = '#ddd'; ctx.fillRect(0, 0, 1200, 675); }
    ctx.fillStyle = '#efe6cc'; ctx.fillRect(1200, 0, 450, 675);
    ctx.lineWidth = 3;
    ctx.fillStyle = '#f8f2e0'; ctx.strokeStyle = '#9b8a5e'; ctx.fillRect(1270, 80, 350, 190); ctx.strokeRect(1270, 80, 350, 190);
    ctx.fillStyle = '#e3ecd0'; ctx.strokeStyle = '#7d9460'; ctx.fillRect(1270, 370, 350, 200); ctx.strokeRect(1270, 370, 350, 200);
    ctx.textAlign = 'center'; ctx.font = '700 34px ' + FONT;
    ctx.fillStyle = '#5b4a2a'; ctx.fillText('イオンモール', 1445, 130);
    ctx.fillStyle = '#3d5228'; ctx.fillText('豊砂公園（フード）', 1445, 540);
    ctx.setLineDash([10, 8]); ctx.strokeStyle = '#9b8a5e'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(1030, CORR); ctx.lineTo(1260, 470); ctx.stroke(); ctx.setLineDash([]);
    ctx.textAlign = 'left'; ctx.font = '24px ' + FONT; ctx.fillStyle = '#5b4a2a'; ctx.fillText('歩道橋', 1090, 480);
    ctx.strokeStyle = 'rgba(192,57,43,.85)'; ctx.lineWidth = 8; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    mm.legs.forEach(function (lg) {
      ctx.beginPath(); lg.forEach(function (q, i) { if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }); ctx.stroke();
    });
    ctx.textAlign = 'center'; ctx.font = '700 28px ' + FONT;
    mm.dots.forEach(function (st) {
      ctx.beginPath(); ctx.arc(st.x, st.y, 26, 0, Math.PI * 2);
      ctx.fillStyle = '#c0392b'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#fff'; ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.fillText(String(st.no), st.x, st.y + 10);
    });
    ctx.restore();
  }
  function numDot(ctx, x, y, n) {
    ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI * 2); ctx.fillStyle = '#c0392b'; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = '700 22px ' + FONT; ctx.fillText(String(n), x, y + 8); ctx.textAlign = 'left';
  }
  function planCanvas(d, r) {
    var no = 0;
    r.rows.forEach(function (x) { if (x.kind === 'do' || x.kind === 'stage') x.no = ++no; });
    var main = r.rows.filter(function (x) { return x.kind !== 'wait'; });
    var srcs = main.filter(function (x) { return x.no; }).map(function (x) { return thumbSrc(x.name); });
    return Promise.all([loadImg(MAP_BASE + 'map_route_base.jpg')].concat(srcs.map(function (s) { return s ? loadImg(s) : Promise.resolve(null); })))
      .then(function (ims) {
        var W = 1080, P = 40, mapH = Math.round(675 * W / 1650);
        var cv = document.createElement('canvas'), ctx = cv.getContext('2d');
        ctx.font = '24px ' + FONT;
        var leftLines = r.left.length ? wrapText(ctx, '入りきらなかったもの：' + r.left.map(function (x) { return x.name; }).join('、'), W - P * 2) : [];
        var H = 170 + mapH + 30;
        main.forEach(function (x) { H += x.no ? 96 : 44; });
        H += leftLines.length * 34 + 150;
        cv.width = W; cv.height = H;
        ctx.fillStyle = '#fbf8f1'; ctx.fillRect(0, 0, W, H);
        // 見出し
        ctx.fillStyle = DAY_COLOR[d]; ctx.fillRect(0, 0, W, 150);
        ctx.fillStyle = '#fff'; ctx.textAlign = 'left';
        ctx.font = '26px ' + FONT; ctx.fillText('FF14 ファンフェス2026東京', P, 50);
        ctx.font = '700 46px ' + FONT; ctx.fillText(DAY_LABEL[d] + '　回る順番', P, 104);
        ctx.font = '24px ' + FONT; ctx.fillText('会場にいる時間 ' + hm(toMin(pst.start)) + '〜' + hm(toMin(pst.end)), P, 138);
        // マップ
        drawMap(ctx, ims[0], mapModel(r.rows, 0), 0, 150, W / 1650);
        var y = 150 + mapH + 30, ti = 1;
        // 順番
        main.forEach(function (x) {
          if (!x.no) {
            ctx.fillStyle = '#777'; ctx.font = '22px ' + FONT;
            var t = x.kind === 'move' ? '↓ 移動 徒歩約' + (x.b - x.a) + '分（' + AREA_NAME[x.from] + ' → ' + AREA_NAME[x.to] + '）'
              : '↓ 空き時間 ' + hm(x.a) + '〜' + hm(x.b);
            ctx.fillText(t, P + 52, y + 28); y += 44; return;
          }
          var im = ims[ti++];
          numDot(ctx, P + 20, y + 40, x.no);
          if (im) ctx.drawImage(im, P + 52, y + 8, 128, 72);
          var tx = P + 52 + (im ? 144 : 0);
          ctx.fillStyle = '#333'; ctx.font = '700 24px ' + FONT;
          var memo = pst.memo[rowKey(d, x)];
          ctx.fillText(hm(x.a) + '〜' + hm(x.b) + '　' + placeLabel(x) + (rowRsv(d, x) ? '（予約）' : '') + (memo ? '　' + memo : ''), tx, y + 36);
          ctx.fillStyle = '#111'; ctx.font = '700 30px ' + FONT;
          ctx.fillText(wrapText(ctx, x.name, W - tx - P)[0], tx, y + 76);
          y += 96;
        });
        ctx.fillStyle = '#c0392b'; ctx.font = '24px ' + FONT;
        leftLines.forEach(function (l) { ctx.fillText(l, P, y + 26); y += 34; });
        // 出典
        y += 20;
        ctx.fillStyle = '#ddd5c2'; ctx.fillRect(P, y, W - P * 2, 2);
        ctx.fillStyle = '#555'; ctx.font = '22px ' + FONT;
        ctx.fillText('エオルゼア攻略ガイド「FF14ファンフェス マイプラン」で作成', P, y + 40);
        ctx.fillText(PAGE_URL.replace('https://', ''), P, y + 74);
        ctx.fillStyle = '#888'; ctx.font = '20px ' + FONT;
        ctx.fillText('画像・マップ © SQUARE ENIX　移動・所要時間は目安で、待ち時間は含みません', P, y + 106);
        return cv;
      });
  }
  // ---------- エリアごとの詳しいマップ（公式のホールマップに、回る番号を重ねる） ----------
  // 座標は公式マップ画像（2400×1350）上のブース番号の位置
  var DETAIL = {
    H13: { file: 'map_messe_hall1-3.jpg', name: '1-3ホール', pos: { 1: [728, 419], 2: [869, 397], 3: [1024, 396], 4: [941, 569], 5: [1234, 400], 6: [1459, 546], 7: [1626, 425], 8: [763, 890], 9: [950, 791], 10: [1097, 922], 11: [1272, 914], 12: [1369, 914], 13: [1477, 899], 14: [1609, 908], 15: [1352, 758] } },
    H46: { file: 'map_messe_hall4-6.jpg', name: '4-6ホール（ステージ）', pos: { stage: [1198, 930, 120], 17: [986, 552] } },
    H7: { file: 'map_messe_hall7.jpg', name: '7ホール', pos: { 20: [1114, 390], 21: [1176, 542], 22: [1331, 497], 23: [1330, 593], 24: [1123, 625], 25: [1091, 961] } },
    MESSE2F: { file: 'map_messe_entire.jpg', name: '2F中央モール・屋外展示場', pos: { 34: [1752, 768], 35: [1783, 995], 36: [1783, 1082] } },
    PARK: { file: 'map_toyosuna.jpg', name: '豊砂公園', pos: { 1: [1480, 931], 2: [1711, 532], truck: [1458, 656, 190] } },
    AEON: { file: 'map_aeon.jpg', name: 'イオンモール', pos: { 37: [608, 452], 38: [972, 456], 39: [1086, 457] } }
  };
  var DETAIL_ORDER = ['H13', 'H46', 'H7', 'MESSE2F', 'PARK', 'AEON'];
  var CROP_Y = 180, CROP_H = 1032; // 上の題字を除いた部分
  function detailOf(x) {
    if (x.kind === 'stage') return { key: 'H46', p: 'stage' };
    var a = areaOf(x.place), m = x.place.match(/(\d+)$/);
    var key = a === 'OUT' || a === 'MALL' ? 'MESSE2F' : a;
    return { key: key, p: m ? +m[1] : (key === 'PARK' ? 'truck' : null) };
  }
  // 何番ホールに向かうか。1-3ホールはブースの位置（公式マップ上のx座標）で分け、ステージは5ホール
  function hallNo(x) {
    if (x.kind === 'stage') return 5;
    var a = areaOf(x.place), m = x.place.match(/(\d+)$/);
    if (a === 'H7') return 7;
    if (a === 'H46') return 6; // 17（クイックフォトセッション）は6ホール
    if (a !== 'H13' || !m || !DETAIL.H13.pos[+m[1]]) return 0;
    var px = DETAIL.H13.pos[+m[1]][0];
    return px < 1000 ? 3 : px < 1390 ? 2 : 1;
  }
  // 表に出す場所（ホールの番号つき）
  function placeLabel(x) {
    if (x.kind === 'stage') return '5ホール ステージ（4-6ホール）';
    var n = hallNo(x);
    if (n === 6) return '6ホール ' + x.place.replace(/^4-6ホール\s*/, '') + '（4-6ホール）';
    return n && n !== 7 ? n + 'ホール ' + x.place.replace(/^1-3ホール\s*/, '') + '（1-3ホール）' : x.place;
  }
  // 行くエリアごとに、番号と位置をまとめる
  function detailModel(rows) {
    var by = {};
    rows.forEach(function (x) {
      if (!x.no) return;
      var o = detailOf(x), D = DETAIL[o.key], xy = D && D.pos[o.p];
      if (!xy) return;
      (by[o.key] = by[o.key] || []).push({ no: x.no, x: xy[0], y: xy[1], r: xy[2] || 46, row: x });
    });
    return DETAIL_ORDER.filter(function (k) { return by[k]; }).map(function (k) {
      var marks = by[k], seen = {};
      marks.forEach(function (m) { var s = m.x + ',' + m.y; m.k = seen[s] = (seen[s] || 0) + 1; }); // 同じ場所に2回行くときは横にずらす
      return { key: k, d: DETAIL[k], marks: marks };
    });
  }
  function markXY(m) { var o = m.r * .7 + 24; return [m.x + o + (m.k - 1) * 84, m.y - o]; }
  function detailMaps(rows) {
    var list = detailModel(rows);
    if (!list.length) return '';
    return '<p><strong>エリアごとの詳しいマップ</strong><br>赤い丸の番号が、上の表の順番です（マップは公式サイトのもの・© SQUARE ENIX）。</p>' + list.map(function (a) {
      var g = '<p class="nv-dt">' + a.d.name + '　' + a.marks.map(function (m) { return circled(m.no); }).join('') + '</p>' +
        '<a href="' + MAP_BASE + a.d.file + '" target="_blank" rel="noopener"><svg viewBox="0 ' + CROP_Y + ' 2400 ' + CROP_H + '" class="nv-map" role="img" aria-label="' + a.d.name + 'のマップ">' +
        '<image href="' + MAP_BASE + a.d.file + '" x="0" y="0" width="2400" height="1350"/>';
      a.marks.forEach(function (m) {
        var c = markXY(m);
        g += '<circle cx="' + m.x + '" cy="' + m.y + '" r="' + m.r + '" fill="none" stroke="#c0392b" stroke-width="10"/>' +
          '<line x1="' + (m.x + m.r * .7) + '" y1="' + (m.y - m.r * .7) + '" x2="' + c[0] + '" y2="' + c[1] + '" stroke="#c0392b" stroke-width="8"/>' +
          '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="40" fill="#c0392b" stroke="#fff" stroke-width="6"/>' +
          '<text x="' + c[0] + '" y="' + (c[1] + 16) + '" text-anchor="middle" font-size="46" font-weight="700" fill="#fff">' + m.no + '</text>';
      });
      return g + '</svg></a>';
    }).join('');
  }
  function detailCanvas(d, a) {
    return loadImg(MAP_BASE + a.d.file).then(function (im) {
      var W = 1080, P = 40, sc = W / 2400, mapH = Math.round(CROP_H * sc);
      var cv = document.createElement('canvas'), ctx = cv.getContext('2d');
      var H = 110 + mapH + 20 + a.marks.length * 52 + 70;
      cv.width = W; cv.height = H;
      ctx.fillStyle = '#fbf8f1'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = DAY_COLOR[d]; ctx.fillRect(0, 0, W, 110);
      ctx.fillStyle = '#fff'; ctx.textAlign = 'left';
      ctx.font = '24px ' + FONT; ctx.fillText('FF14 ファンフェス2026東京　' + DAY_LABEL[d], P, 42);
      ctx.font = '700 40px ' + FONT; ctx.fillText(a.d.name + 'の詳しいマップ', P, 92);
      ctx.save(); ctx.translate(0, 110); ctx.scale(sc, sc); ctx.translate(0, -CROP_Y);
      ctx.beginPath(); ctx.rect(0, CROP_Y, 2400, CROP_H); ctx.clip();
      if (im) ctx.drawImage(im, 0, 0, 2400, 1350);
      a.marks.forEach(function (m) {
        var c = markXY(m);
        ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 10;
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2); ctx.stroke();
        ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(m.x + m.r * .7, m.y - m.r * .7); ctx.lineTo(c[0], c[1]); ctx.stroke();
        ctx.beginPath(); ctx.arc(c[0], c[1], 40, 0, Math.PI * 2); ctx.fillStyle = '#c0392b'; ctx.fill();
        ctx.lineWidth = 6; ctx.strokeStyle = '#fff'; ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = '700 46px ' + FONT; ctx.fillText(String(m.no), c[0], c[1] + 16);
      });
      ctx.restore();
      var y = 110 + mapH + 20;
      a.marks.forEach(function (m) {
        var x = m.row;
        numDot(ctx, P + 20, y + 22, m.no);
        ctx.fillStyle = '#111'; ctx.font = '700 26px ' + FONT;
        ctx.fillText(hm(x.a) + '〜' + hm(x.b) + '　' + x.name + (x.place ? '（' + x.place + '）' : ''), P + 54, y + 32);
        y += 52;
      });
      ctx.fillStyle = '#888'; ctx.font = '20px ' + FONT;
      ctx.fillText('マップ © SQUARE ENIX　エオルゼア攻略ガイド ' + PAGE_URL.replace('https://', ''), P, y + 40);
      return cv;
    });
  }
  function toBlob(cv) {
    return new Promise(function (ok, ng) { try { cv.toBlob(function (b) { if (b) ok(b); else ng(); }, 'image/png'); } catch (e) { ng(e); } });
  }
  function makeImage() {
    var box = document.getElementById('nv-share');
    var d = pst.day, r = simulate(d);
    box.innerHTML = '<p class="nv-s">画像を作っています…</p>';
    function fail() { box.innerHTML = '<p class="nv-s nv-now">画像を作れませんでした。時間をおいてもう一度お試しください。</p>'; }
    planCanvas(d, r).then(function (cv0) {
      var areas = detailModel(r.rows);
      return Promise.all([cv0].concat(areas.map(function (a) { return detailCanvas(d, a); }))).then(function (cvs) {
        return Promise.all(cvs.map(toBlob)).then(function (blobs) {
          var tag = d === 1 ? '1031' : '1101';
          var names = ['回る順番'].concat(areas.map(function (a) { return a.d.name; }));
          var items = blobs.map(function (b, i) {
            var fname = 'ff14_fanfest2026_' + tag + '_' + (i ? areas[i - 1].key.toLowerCase() : 'plan') + '.png', f = null;
            try { f = new File([b], fname, { type: 'image/png' }); } catch (e) {}
            return { url: URL.createObjectURL(b), fname: fname, file: f, name: names[i] };
          });
          var files = items.map(function (x) { return x.file; }).filter(Boolean);
          var canShare = files.length === items.length && navigator.canShare && navigator.canShare({ files: files });
          var text = 'ファンフェス2026東京 ' + DAY_DATE[d] + 'の回る順番を作りました #FF14';
          var h = '<p>' + items.length + '枚の画像ができました。</p>';
          if (canShare) h += '<p><button type="button" class="nv-btn nv-pri" data-share>' + items.length + '枚まとめて送る・保存する</button></p>';
          items.forEach(function (x, i) {
            h += '<p class="nv-dt">' + (i + 1) + '枚目：' + esc(x.name) + '</p><img src="' + x.url + '" alt="' + esc(DAY_LABEL[d] + ' ' + x.name) + '">' +
              '<a class="nv-btn" href="' + x.url + '" download="' + x.fname + '">この画像を保存</a>';
          });
          h += '<p><a class="nv-btn" href="https://x.com/intent/post?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(PAGE_URL) + '" target="_blank" rel="noopener">Xにポスト</a>' +
            '<a class="nv-btn" href="https://line.me/R/share?text=' + encodeURIComponent(text + '\n' + PAGE_URL) + '" target="_blank" rel="noopener">LINEで送る</a></p>' +
            '<p class="nv-s">' + (canShare ? '「まとめて送る・保存する」を押すと、XやLINEなどのアプリを選んで画像をそのまま送れます（Xは4枚まで）。' : '') +
            '「Xにポスト」「LINEで送る」はこのページのリンクを送ります。画像も付けるときは、先に画像を保存してから添付してください。スマホでは、画像を長押ししても保存できます。</p>';
          box.innerHTML = h;
          var sb = box.querySelector('[data-share]');
          if (sb) sb.addEventListener('click', function () {
            navigator.share({ files: files, text: text + '\n' + PAGE_URL }).catch(function () {});
          });
        });
      });
    }).catch(fail);
  }


  function rowKey(d, x) { return pk(d, x.kind === 'stage' ? 's' : x.meet ? 'm' : 'f', x.name); }
  function rowRsv(d, x) { return !!x.meet || !!pst.rsv[rowKey(d, x)]; }
  function memoOf(d, x) { var m = pst.memo[rowKey(d, x)]; return m ? '<span class="nv-s">メモ：' + esc(m) + '</span>' : ''; }
  // 時間の流れ（左にステージ、右に自分の予定。1分＝1.5px）
  function timeline(d, rows) {
    var PX = 1.5, t0 = Math.floor(toMin(pst.start) / 60) * 60, t1 = Math.ceil(toMin(pst.end) / 60) * 60;
    function y(m) { return Math.round((m - t0) * PX); }
    var h = '<div class="nv-tl" style="height:' + (y(t1) + 2) + 'px">';
    for (var m = t0; m <= t1; m += 60) h += '<span class="nv-tl-h" style="top:' + y(m) + 'px">' + (m / 60) + ':00</span>';
    STAGE[d].forEach(function (s) {
      var a = Math.max(toMin(s[0]), t0), b = Math.min(toMin(s[1]), t1);
      if (b <= a) return;
      h += '<div class="nv-tl-b nv-tl-st' + (pst.pick[pk(d, 's', s[2])] ? ' nv-on' : '') + '" style="top:' + y(a) + 'px;height:' + (y(b) - y(a)) + 'px"><b>' + s[0] + '</b> ' + esc(s[2]) + '</div>';
    });
    rows.forEach(function (x) {
      var hgt = y(x.b) - y(x.a), cls = x.kind === 'move' ? 'nv-tl-mv' : x.kind === 'free' || x.kind === 'wait' ? 'nv-tl-fr' : 'nv-tl-do';
      if (hgt < 4) return;
      var txt = x.kind === 'move' ? (hgt >= 14 ? '移動 ' + (x.b - x.a) + '分' : '') : x.kind === 'free' ? '空き ' + dur(x.b - x.a) : x.kind === 'wait' ? '開くまで待つ' :
        '<b>' + hm(x.a) + ' ' + circled(x.no) + '</b> ' + esc(x.name) + (rowRsv(d, x) ? '（予約）' : '') + (pst.memo[rowKey(d, x)] ? '<br>' + esc(pst.memo[rowKey(d, x)]) : '');
      h += '<div class="nv-tl-b ' + cls + '" style="top:' + y(x.a) + 'px;height:' + hgt + 'px">' + txt + '</div>';
    });
    return h + '</div><p class="nv-s">左がステージ（色が濃いものが見に行くもの）、右が自分の予定です。</p>';
  }
  function makeUrl() {
    var box = document.getElementById('nv-url'), c = planCode(pst.day);
    if (!c) { box.innerHTML = '<p class="nv-s nv-now">URLを作れませんでした。</p>'; return; }
    var url = PAGE_URL + '#ff26=' + c, text = 'ファンフェス2026東京 ' + DAY_DATE[pst.day] + 'の予定です';
    box.innerHTML = '<p><input type="text" readonly class="nv-urlin" value="' + esc(url) + '"></p><p>' +
      (navigator.share ? '<button type="button" class="nv-btn nv-pri" data-urlshare>LINEなどで送る</button>' : '') +
      '<button type="button" class="nv-btn" data-urlcopy>URLをコピー</button></p><p class="nv-s" id="nv-urlmsg"></p>';
    var sb = box.querySelector('[data-urlshare]');
    if (sb) sb.addEventListener('click', function () { navigator.share({ text: text, url: url }).catch(function () {}); });
    box.querySelector('[data-urlcopy]').addEventListener('click', function () {
      var inp = box.querySelector('input'), msg = document.getElementById('nv-urlmsg');
      function ok() { msg.textContent = 'コピーしました。'; }
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(ok, function () { inp.select(); });
      else { inp.select(); try { document.execCommand('copy'); ok(); } catch (e) {} }
    });
  }
  function chk(k, label) { return '<input type="checkbox" data-k="' + esc(k) + '"' + (pst.pick[k] ? ' checked' : '') + ' aria-label="' + esc(label) + '">'; }

  function prender() {
    var d = pst.day;
    function opts(list, cur, lastLabel) {
      return list.map(function (v, i) {
        var vv = pad(toMin(v) / 60 | 0) + ':' + pad(toMin(v) % 60);
        return '<option value="' + vv + '"' + (vv === cur ? ' selected' : '') + '>' + v + (lastLabel && i === list.length - 1 ? lastLabel : '') + '</option>';
      }).join('');
    }
    var h = '';
    if (shared) h += '<div class="nv-shared"><p><strong>送られてきた予定があります（' + DAY_LABEL[shared.d] + '）</strong><br>開くと、このスマホの' + DAY_DATE[shared.d] + 'の選択は、送られてきた予定に置きかわります。</p>' +
      '<p><button type="button" class="nv-btn nv-pri" data-shared="1">この予定を開く</button><button type="button" class="nv-btn" data-shared="0">自分の予定のままにする</button></p></div>';
    h += daySwitch(d, 'data-pday', DAY_LABEL[d] + 'のプラン') +
      '<p class="nv-tm"><strong>会場にいる時間</strong><br><select data-start>' + opts(STARTS, pst.start) + '</select> に着く<br>' +
      '<select data-end>' + opts(ENDS, pst.end, '（最後まで）') + '</select> に帰る</p>';
    if (toMin(pst.end) <= toMin(pst.start)) h += '<p class="nv-s nv-now">帰る時刻を、着く時刻より後にしてください。</p>';

    h += '<p><strong>1. 行きたいものにチェック</strong><br>行く時間を決めたいもの（予約の時間など）は「行く時間」を選んでください。「おまかせ」のものは、空いている時間に入れます。</p><table class="eg-num"><thead><tr><th>選ぶ</th><th>内容・所要時間の目安</th></tr></thead><tbody>';
    // チェックを入れたものだけ、メモ（と予約）の欄を出す
    function extraInputs(k, canRsv) {
      if (!pst.pick[k]) return '';
      return '<span class="nv-s nv-memo">メモ <input type="text" data-memo="' + esc(k) + '" value="' + esc(pst.memo[k] || '') + '" maxlength="40" placeholder="例：集合場所・だれと行くか"></span>' +
        (canRsv ? '<label class="nv-s"><input type="checkbox" data-rsv="' + esc(k) + '"' + (pst.rsv[k] ? ' checked' : '') + '> 予約が当たった（行く時間に予約の時刻を入れてください）</label>' : '');
    }
    STAGE[d].forEach(function (s) {
      var k = pk(d, 's', s[2]);
      h += '<tr><td>' + chk(k, s[2]) + '</td><td>' + withThumb(s[2], esc(s[2]) + '<span class="nv-s">ステージ ' + s[0] + '〜' + s[1] + '</span>' + extraInputs(k, false)) + '</td></tr>';
    });
    MEET[d].forEach(function (m) {
      var name = meetName(m), k = pk(d, 'm', name);
      h += '<tr><td>' + chk(k, name) + '</td><td>' + withThumb(name, esc(name) + '<span class="nv-s">' + MEET_PLACE + '／' + m[0] + '開始・予約した人だけ<br>開始から30分以内に集合（予定は30分で計算）</span>' + extraInputs(k, false)) + '</td></tr>';
    });
    FLEX.forEach(function (s) {
      var hr = hoursOf(s, d), st = pst.stay[s[0]] || STAY[s[0]] || 30, k = pk(d, 'f', s[0]), at = pst.at[k] || '';
      var ats = '<option value="">おまかせ</option>';
      for (var m = Math.ceil(hr.open / 10) * 10; m <= hr.last; m += 10) {
        var v = pad(m / 60 | 0) + ':' + pad(m % 60);
        ats += '<option value="' + v + '"' + (v === at ? ' selected' : '') + '>' + hm(m) + '</option>';
      }
      h += '<tr><td>' + chk(k, s[0]) + '</td><td>' + withThumb(s[0], esc(s[0]) +
        '<span class="nv-s">' + esc(s[1]) + '／最終受付 ' + hm(hr.last) + '<br>所要 <select data-stay="' + esc(s[0]) + '">' +
        CHOICES.map(function (c) { return '<option value="' + c + '"' + (c === st ? ' selected' : '') + '>' + c + '分</option>'; }).join('') + '</select>' +
        '<br>行く時間 <select data-at="' + esc(k) + '">' + ats + '</select></span>' + extraInputs(k, true)) + '</td></tr>';
    });
    h += '</tbody></table>';

    var r = simulate(d);
    h += '<p id="nv-plan-result"><strong>2. 回る順番と移動</strong></p>';
    if (!r.rows.length && !r.left.length) {
      h += '<p>上の表で行きたいものを選ぶと、ここに順番と移動のしかたが出ます。</p>';
    } else {
      var no = 0;
      r.rows.forEach(function (x) { if (x.kind === 'do' || x.kind === 'stage') x.no = ++no; });
      h += routeMap(r.rows) + detailMaps(r.rows);
      h += '<p class="nv-vw">見かた：<button type="button" data-view="table" aria-pressed="' + (pst.view !== 'time') + '">順番の表</button><button type="button" data-view="time" aria-pressed="' + (pst.view === 'time') + '">時間の流れ</button></p>';
      if (pst.view === 'time') h += timeline(d, r.rows);
      else h += '<table class="eg-num"><thead><tr><th>時間</th><th>予定</th></tr></thead><tbody>';
      if (pst.view !== 'time') r.rows.forEach(function (x, i) {
        var tm = hm(x.a) + '<br>〜' + hm(x.b);
        var nx = x.kind === 'move' ? r.rows.slice(i + 1).filter(function (y) { return y.kind === 'do' || y.kind === 'stage'; })[0] : null, hn = nx ? hallNo(nx) : 0;
        if (x.kind === 'move') h += '<tr class="nv-mv"><td>' + tm + '</td><td>移動：' + AREA_NAME[x.from] + ' → ' + AREA_NAME[x.to] + '（徒歩約' + (x.b - x.a) + '分）' + (hn ? '<br><strong>' + hn + 'ホールへ向かう</strong>' : '') + '<span class="nv-s">' + routeText(x.from, x.to) + '</span></td></tr>';
        else if (x.kind === 'wait') h += '<tr class="nv-mv"><td>' + tm + '</td><td>開くまで待つ</td></tr>';
        else if (x.kind === 'free') h += '<tr class="nv-mv"><td>' + tm + '</td><td>空き時間<span class="nv-s">次の列に早めに並ぶ・休憩など</span></td></tr>';
        else if (x.kind === 'stage') h += '<tr><td>' + tm + '</td><td>' + withThumb(x.name, '<strong>' + circled(x.no) + ' ' + esc(x.name) + '</strong><span class="nv-s">' + placeLabel(x) + '</span>' + memoOf(d, x) + (x.late ? '<span class="nv-s nv-now">開始に約' + x.late + '分遅れます</span>' : '') + (x.cut ? '<span class="nv-s nv-now">帰る時刻のため途中まで</span>' : '')) + '</td></tr>';
        else h += '<tr><td>' + tm + '</td><td>' + withThumb(x.name, '<strong>' + circled(x.no) + ' ' + esc(x.name) + '</strong><span class="nv-s">' + esc(placeLabel(x)) + (x.at != null ? '／' + hm(x.at) + (rowRsv(d, x) ? '（予約）' : 'に行く予定') : '') + '</span>' + memoOf(d, x) + (x.late ? '<span class="nv-s nv-now">前の予定のため約' + x.late + '分遅れます</span>' : '') + (x.cut ? '<span class="nv-s nv-now">帰る時刻のため途中まで</span>' : '')) + '</td></tr>';
      });
      if (pst.view !== 'time') h += '</tbody></table>';
      if (r.left.length) h += '<p>入りきらなかったもの：' + r.left.map(function (x) { return esc(x.name) + (x.area === 'H46' && !x.place ? '（' + hm(x.a) + '開始）' : x.kind === 'do' ? '（' + hm(x.a) + 'に行く予定）' : '（最終受付 ' + hm(x.last) + '）'); }).join('、') +
        '<br>会場にいる時間を長くするか、ほかの所要時間を短くすると入ることがあります。</p>';
      h += '<p id="nv-share-h"><strong>3. 画像にして共有する</strong><br>全体のマップと回る順番の画像に、行くエリアごとの詳しいマップの画像が付きます。XやLINEで友だちに送ったり、当日の待ち受けにしたりできます。</p>' +
        '<p><button type="button" class="nv-btn" data-mkimg>画像を作る</button></p><div id="nv-share"></div>' +
        '<p><strong>4. 予定をURLで送る</strong><br>同行する人にURLを送ると、相手のスマホで同じ予定（メモも）を開けます。相手が直したあと、送り返してもらうこともできます。</p>' +
        '<p><button type="button" class="nv-btn" data-url>予定のURLを作る</button></p><div id="nv-url"></div>';
    }
    h += '<p class="nv-s">所要時間に待ち列の時間は入っていません。混みそうな所は長めに選んでください。移動時間は地図上の距離から計算した目安で、混雑時はもっとかかります。予約が必要な体験は予約時間を優先してください。キッチンカーは10:00〜20:00の営業（公式）です。食べたい時間があれば「行く時間」を選んでください。</p>';
    proot.innerHTML = h;
  }

  // メモは打つたびに保存する（欄の外をタップする前にアプリを閉じても残るように）。描き直しは change のときだけ
  proot.addEventListener('input', function (e) {
    var el = e.target;
    if (!el.hasAttribute('data-memo')) return;
    var mk = el.getAttribute('data-memo');
    if (el.value.trim()) pst.memo[mk] = el.value.trim().slice(0, 40); else delete pst.memo[mk];
    psave();
  });
  proot.addEventListener('change', function (e) {
    var el = e.target;
    if (el.hasAttribute('data-k')) { if (el.checked) pst.pick[el.getAttribute('data-k')] = 1; else delete pst.pick[el.getAttribute('data-k')]; }
    else if (el.hasAttribute('data-stay')) pst.stay[el.getAttribute('data-stay')] = +el.value;
    else if (el.hasAttribute('data-at')) {
      var ak = el.getAttribute('data-at');
      if (el.value) { pst.at[ak] = el.value; pst.pick[ak] = 1; } else delete pst.at[ak];
    }
    else if (el.hasAttribute('data-memo')) { var mk = el.getAttribute('data-memo'); if (el.value.trim()) pst.memo[mk] = el.value.trim().slice(0, 40); else delete pst.memo[mk]; }
    else if (el.hasAttribute('data-rsv')) { if (el.checked) pst.rsv[el.getAttribute('data-rsv')] = 1; else delete pst.rsv[el.getAttribute('data-rsv')]; }
    else if (el.hasAttribute('data-start')) pst.start = el.value;
    else if (el.hasAttribute('data-end')) pst.end = el.value;
    else if (el.hasAttribute('data-range')) pst.range = +el.value;
    else return;
    psave();
    var y = window.scrollY; prender(); window.scrollTo(0, y);
  });
  proot.addEventListener('click', function (e) {
    if (e.target.closest('[data-mkimg]')) { makeImage(); return; }
    if (e.target.closest('[data-url]')) { makeUrl(); return; }
    var vw = e.target.closest('[data-view]');
    if (vw) { pst.view = vw.getAttribute('data-view'); psave(); var yy = window.scrollY; prender(); window.scrollTo(0, yy); return; }
    var sh = e.target.closest('[data-shared]');
    if (sh) {
      if (sh.getAttribute('data-shared') === '1') loadShared(shared);
      shared = null; psave();
      try { history.replaceState(null, '', location.pathname + location.search); } catch (x) {}
      prender(); viewDay = pst.day; render(); return;
    }
    var b = e.target.closest('[data-pday]');
    if (!b) return;
    pst.day = +b.getAttribute('data-pday'); psave(); prender();
    viewDay = pst.day; render();
  });
  onDay = function (d) { pst.day = d; psave(); prender(); };
  css.textContent += [
    '#eg-ff26-plan{margin:12px 0 24px}',
    '#eg-ff26-plan svg.nv-map{display:block;width:100%;height:auto;border:1px solid #d8cfb8;margin:4px 0}',
    '#eg-ff26-plan .nv-rg{margin:0 0 4px;font-size:14px}',
    '#eg-ff26-plan .nv-dt{margin:12px 0 0;font-weight:700}',
    '#eg-ff26-plan .nv-s{display:block;font-size:13px;color:#666}',
    '#eg-ff26-plan .nv-now{color:#c0392b;font-weight:700}',
    '#eg-ff26-plan tr.nv-mv td{color:#666}',
    '#eg-ff26-plan input[type=checkbox]{width:22px;height:22px;margin:0}',
    '#eg-ff26-plan select{font:inherit;font-size:13px;padding:2px 4px}',
    '#eg-ff26-plan .nv-tm select{font-size:16px;padding:4px 6px}',
    '#eg-ff26-plan .nv-btn{font:inherit;font-size:15px;font-weight:700;padding:10px 16px;border:2px solid #1a2f4e;border-radius:6px;background:#fff;color:#1a2f4e;cursor:pointer;margin:0 6px 6px 0}',
    '#eg-ff26-plan .nv-btn.nv-pri{background:#1a2f4e;color:#fff}',
    '#eg-ff26-plan .nv-memo input{font:inherit;font-size:14px;width:100%;max-width:280px;padding:4px 6px;margin:2px 0;box-sizing:border-box}',
    '#eg-ff26-plan label.nv-s{margin:2px 0}',
    '#eg-ff26-plan label.nv-s input{width:18px;height:18px;vertical-align:-3px}',
    '#eg-ff26-plan .nv-shared{border:2px solid #c0392b;border-radius:6px;padding:4px 12px;margin:0 0 12px;background:#fff8f6}',
    '#eg-ff26-plan .nv-vw button{font:inherit;font-size:14px;padding:6px 10px;margin:0 6px 0 0;border:1px solid #1a2f4e;border-radius:4px;background:#fff;color:#1a2f4e;cursor:pointer}',
    '#eg-ff26-plan .nv-vw button[aria-pressed="true"]{background:#1a2f4e;color:#fff}',
    '#eg-ff26-plan .nv-tl{position:relative;margin:8px 0;border-top:1px solid #ddd}',
    '#eg-ff26-plan .nv-tl-h{position:absolute;left:0;width:100%;border-top:1px solid #e3dccb;font-size:12px;color:#888;line-height:1;padding-top:2px}',
    '#eg-ff26-plan .nv-tl-b{position:absolute;box-sizing:border-box;overflow:hidden;font-size:12px;line-height:1.35;padding:2px 5px;border-radius:4px}',
    '#eg-ff26-plan .nv-tl-st{left:40px;width:calc(38% - 40px);background:#f1efe9;color:#999;border:1px dashed #ccc}',
    '#eg-ff26-plan .nv-tl-st.nv-on{background:#e6e9f0;color:#1a2f4e;border:1px solid #1a2f4e}',
    '#eg-ff26-plan .nv-tl-do,#eg-ff26-plan .nv-tl-mv,#eg-ff26-plan .nv-tl-fr{left:calc(38% + 4px);right:0}',
    '#eg-ff26-plan .nv-tl-do{background:#fbecd9;border:1px solid #d9a55b;color:#333}',
    '#eg-ff26-plan .nv-tl-mv{background:#e8f1e1;color:#3d5228;border:1px solid #9bb784}',
    '#eg-ff26-plan .nv-tl-fr{background:#f7f7f4;color:#999;border:1px dashed #d5d5cc}',
    '#eg-ff26-plan .nv-urlin{font:inherit;font-size:13px;width:100%;padding:6px;box-sizing:border-box}',
    '#eg-ff26-plan #nv-share img{display:block;width:100%;max-width:540px;height:auto;border:1px solid #ccc;margin:6px 0}'
  ].join('');
  prender();
})();
