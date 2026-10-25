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
    if (b === 'PARK' || b === 'AEON') return '幕張メッセから歩道橋で移動' + (b === 'AEON' ? '。メッセ中央ロータリー（1番乗り場）からイオンモール行きのシャトルバスもあり' : '');
    return '歩道橋で幕張メッセへ' + (a === 'AEON' ? '。イオンモールからメッセ行きのシャトルバスもあり' : '');
  }

  // 所要時間の初期値（分）。待ち時間は含まない
  var STAY = {
    'グッズ売り場': 60, 'アルカディアくじ': 20, 'チョコボレースVR': 30, 'リアルトレジャーハント': 20, 'YOKERO': 30,
    'ナイスヘッド・ガーデン': 20, 'ダンシング・グリーン': 20, 'チェキ撮影・プリント': 15, 'オードパルファム テスター': 15,
    'トートバッグ作り': 45, 'ナインズ・キャッチャー': 20, 'スペースインベーダー': 20, 'エオルゼア検定': 20, 'NPC名鑑 体験': 30,
    'FFトレカ体験': 45, 'ドマ式麻雀 修練場': 30, 'エッダの鞄': 60, '出張エオルゼアカフェ': 60, 'アニメイトカフェ出張版': 60,
    'POP UP STORE': 30, 'リアル謎解き': 60, 'ヤマト運輸 宅配': 15, '昼食（キッチンカー）': 45, 'でぶチョコボ フォトスポット': 15
  };
  var EXTRA = [
    ['昼食（キッチンカー）', '豊砂公園', '11:00', '20:00', '11:00', '20:00', 0, '11時以降で計算'],
    ['でぶチョコボ フォトスポット', 'イオンモール 38', '10:00', '21:00', '10:00', '21:00', 0, '']
  ];
  var LUNCH = '昼食（キッチンカー）';
  var FLEX = SPOTS.concat(EXTRA);
  var CHOICES = [15, 20, 30, 45, 60, 90, 120];
  var STARTS = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  // 選んだ内容はこのスマホに保存
  var PKEY = 'eg-ff26-plan';
  var pst = {};
  try { pst = JSON.parse(localStorage.getItem(PKEY) || '{}') || {}; } catch (e) { pst = {}; }
  pst.day = pst.day || 1; pst.start = pst.start || '10:00'; pst.pick = pst.pick || {}; pst.stay = pst.stay || {};
  function psave() { try { localStorage.setItem(PKEY, JSON.stringify(pst)); } catch (e) {} }
  function pk(d, kind, name) { return d + ':' + kind + ':' + name; }
  function hoursOf(s, d) {
    var last = toMin(d === 1 ? s[3] : s[5]) - s[6];
    var sp = SPECIAL_LAST[s[0]] && SPECIAL_LAST[s[0]][d];
    return { open: toMin(d === 1 ? s[2] : s[4]), last: sp ? toMin(sp) : last };
  }

  // 予定を組む：ステージは時間固定。それ以外は、次のステージまでに移動込みで終わるものを、すぐ始められる順（同じなら受付終了が早い順）に入れる
  function simulate(d) {
    var fixed = STAGE[d].filter(function (s) { return pst.pick[pk(d, 's', s[2])]; })
      .map(function (s) { return { name: s[2], area: 'H46', a: toMin(s[0]), b: toMin(s[1]) }; });
    var todo = FLEX.filter(function (s) { return pst.pick[pk(d, 'f', s[0])]; })
      .map(function (s) { var h = hoursOf(s, d); return { name: s[0], place: s[1], area: areaOf(s[1]), open: h.open, last: h.last, stay: pst.stay[s[0]] || STAY[s[0]] || 30 }; });
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
        if (begin > x.last) return;
        if (nf && begin + x.stay + walk(x.area, nf.area) > nf.a) return;
        var key = begin * 2000 + x.last;
        if (x.name === LUNCH && begin <= 14 * 60) key = -1; // 昼食は14時までに入れられるなら優先
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
      moveTo(nf.area);
      if (t < nf.a) out.push({ kind: 'free', a: t, b: nf.a });
      out.push({ kind: 'stage', a: nf.a, b: nf.b, name: nf.name, late: t > nf.a ? t - nf.a : 0 });
      t = Math.max(t, nf.b); fi++;
    }
    return { rows: out, left: todo };
  }

  function chk(k, label) { return '<input type="checkbox" data-k="' + esc(k) + '"' + (pst.pick[k] ? ' checked' : '') + ' aria-label="' + esc(label) + '">'; }

  function prender() {
    var d = pst.day;
    var h = '<p class="nv-day">日にち：<button data-pday="1" aria-pressed="' + (d === 1) + '">10/31（1日目）</button>／' +
      '<button data-pday="2" aria-pressed="' + (d === 2) + '">11/1（2日目）</button><br>' +
      '会場に着く時刻：<select data-start>' + STARTS.map(function (v) {
        var vv = pad(toMin(v) / 60 | 0) + ':' + pad(toMin(v) % 60);
        return '<option value="' + vv + '"' + (vv === pst.start ? ' selected' : '') + '>' + v + '</option>';
      }).join('') + '</select></p>';

    h += '<p><strong>1. 行きたいものにチェック</strong></p><table class="eg-num"><thead><tr><th>選ぶ</th><th>内容・所要時間の目安</th></tr></thead><tbody>';
    STAGE[d].forEach(function (s) {
      h += '<tr><td>' + chk(pk(d, 's', s[2]), s[2]) + '</td><td>' + esc(s[2]) + '<span class="nv-s">ステージ ' + s[0] + '〜' + s[1] + '</span></td></tr>';
    });
    FLEX.forEach(function (s) {
      var hr = hoursOf(s, d), st = pst.stay[s[0]] || STAY[s[0]] || 30;
      h += '<tr><td>' + chk(pk(d, 'f', s[0]), s[0]) + '</td><td>' + esc(s[0]) +
        '<span class="nv-s">' + esc(s[1]) + '／最終受付 ' + hm(hr.last) + '<br>所要 <select data-stay="' + esc(s[0]) + '">' +
        CHOICES.map(function (c) { return '<option value="' + c + '"' + (c === st ? ' selected' : '') + '>' + c + '分</option>'; }).join('') + '</select></span></td></tr>';
    });
    h += '</tbody></table>';

    var r = simulate(d);
    h += '<p id="nv-plan-result"><strong>2. 回る順番と移動</strong></p>';
    if (!r.rows.length && !r.left.length) {
      h += '<p>上の表で行きたいものを選ぶと、ここに順番と移動のしかたが出ます。</p>';
    } else {
      h += '<table class="eg-num"><thead><tr><th>時間</th><th>予定</th></tr></thead><tbody>';
      r.rows.forEach(function (x) {
        var tm = hm(x.a) + '<br>〜' + hm(x.b);
        if (x.kind === 'move') h += '<tr class="nv-mv"><td>' + tm + '</td><td>移動：' + AREA_NAME[x.from] + ' → ' + AREA_NAME[x.to] + '（徒歩約' + (x.b - x.a) + '分）<span class="nv-s">' + routeText(x.from, x.to) + '</span></td></tr>';
        else if (x.kind === 'wait') h += '<tr class="nv-mv"><td>' + tm + '</td><td>開くまで待つ</td></tr>';
        else if (x.kind === 'free') h += '<tr class="nv-mv"><td>' + tm + '</td><td>空き時間<span class="nv-s">ステージの列に早めに並ぶ・休憩など</span></td></tr>';
        else if (x.kind === 'stage') h += '<tr><td>' + tm + '</td><td><strong>' + esc(x.name) + '</strong><span class="nv-s">4-6ホール ステージ</span>' + (x.late ? '<span class="nv-s nv-now">開始に約' + x.late + '分遅れます</span>' : '') + '</td></tr>';
        else h += '<tr><td>' + tm + '</td><td><strong>' + esc(x.name) + '</strong><span class="nv-s">' + esc(x.place) + '</span></td></tr>';
      });
      h += '</tbody></table>';
      if (r.left.length) h += '<p>入りきらなかったもの：' + r.left.map(function (x) { return esc(x.name) + '（最終受付 ' + hm(x.last) + '）'; }).join('、') +
        '<br>会場に着く時刻を早めるか、ほかの所要時間を短くすると入ることがあります。</p>';
    }
    h += '<p class="nv-s">所要時間に待ち列の時間は入っていません。混みそうな所は長めに選んでください。移動時間は地図上の距離から計算した目安で、混雑時はもっとかかります。予約が必要な体験は予約時間を優先してください。昼食は11時以降、キッチンカーは公式に営業時間の案内がないためカフェと同じ20:00までとして計算しています。</p>';
    proot.innerHTML = h;
  }

  proot.addEventListener('change', function (e) {
    var el = e.target;
    if (el.hasAttribute('data-k')) { if (el.checked) pst.pick[el.getAttribute('data-k')] = 1; else delete pst.pick[el.getAttribute('data-k')]; }
    else if (el.hasAttribute('data-stay')) pst.stay[el.getAttribute('data-stay')] = +el.value;
    else if (el.hasAttribute('data-start')) pst.start = el.value;
    else return;
    psave();
    var y = window.scrollY; prender(); window.scrollTo(0, y);
  });
  proot.addEventListener('click', function (e) {
    var b = e.target.closest('[data-pday]');
    if (!b) return;
    pst.day = +b.getAttribute('data-pday'); psave(); prender();
  });
  css.textContent += [
    '#eg-ff26-plan{margin:12px 0 24px}',
    '#eg-ff26-plan .nv-day{margin:0 0 8px;font-size:14px;line-height:2}',
    '#eg-ff26-plan .nv-day button{font:inherit;background:none;border:0;padding:0 2px;color:#2563a6;text-decoration:underline;cursor:pointer}',
    '#eg-ff26-plan .nv-day button[aria-pressed="true"]{color:inherit;text-decoration:none;font-weight:700;cursor:default}',
    '#eg-ff26-plan .nv-s{display:block;font-size:13px;color:#666}',
    '#eg-ff26-plan .nv-now{color:#c0392b;font-weight:700}',
    '#eg-ff26-plan tr.nv-mv td{color:#666}',
    '#eg-ff26-plan input[type=checkbox]{width:22px;height:22px;margin:0}',
    '#eg-ff26-plan select{font:inherit;font-size:13px;padding:2px 4px}'
  ].join('');
  prender();
})();
