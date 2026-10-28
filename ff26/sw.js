// FF14ファンフェス マイプラン（当日ナビのアプリ版）のオフライン対応。画面とJSは「ネット優先・だめなら保存済み」、画像は「保存済み優先」
var CACHE = 'ff26-v13';
var FILES = [
  './',
  'index.html',
  'app.css',
  'app.js',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'icon-180.png',
  '../ff26navi.js',
  '../img/ff26/map_aeon.jpg',
  '../img/ff26/map_messe_entire.jpg',
  '../img/ff26/map_messe_hall1-3.jpg',
  '../img/ff26/map_messe_hall4-6.jpg',
  '../img/ff26/map_messe_hall7.jpg',
  '../img/ff26/map_route_base.jpg',
  '../img/ff26/map_toyosuna.jpg',
  '../img/ff26/spot_animate_cafe.jpg',
  '../img/ff26/spot_chocobo_race_vr.jpg',
  '../img/ff26/spot_dancing_green.jpg',
  '../img/ff26/spot_eddas_bag.jpg',
  '../img/ff26/spot_eorzea_cafe.jpg',
  '../img/ff26/spot_eorzea_quiz.jpg',
  '../img/ff26/spot_fanfest_lottery.jpg',
  '../img/ff26/spot_fat_chocobo.jpg',
  '../img/ff26/spot_ff_tcg.jpg',
  '../img/ff26/spot_food_truck.jpg',
  '../img/ff26/spot_fragrance.jpg',
  '../img/ff26/spot_instax.jpg',
  '../img/ff26/spot_mahjong.jpg',
  '../img/ff26/spot_meet_and_greet.jpg',
  '../img/ff26/spot_moogle_catcher.jpg',
  '../img/ff26/spot_nice_head.jpg',
  '../img/ff26/spot_npc_directory.jpg',
  '../img/ff26/spot_popcorn_bucket.jpg',
  '../img/ff26/spot_outrunner.jpg',
  '../img/ff26/spot_popup_store.jpg',
  '../img/ff26/spot_real_mystery.jpg',
  '../img/ff26/spot_shipping.jpg',
  '../img/ff26/spot_store.jpg',
  '../img/ff26/spot_treasure_hunt.jpg',
  '../img/ff26/spot_workshop.jpg',
  '../img/ff26/spot_yokero.jpg',
  '../img/ff26/stage_ccrc.jpg',
  '../img/ff26/stage_ccrc_final.jpg',
  '../img/ff26/stage_dev_panel.jpg',
  '../img/ff26/stage_glamour.jpg',
  '../img/ff26/stage_keynote.jpg',
  '../img/ff26/stage_live_qa.jpg',
  '../img/ff26/stage_naokis_room.jpg',
  '../img/ff26/stage_piano.jpg',
  '../img/ff26/stage_primals.jpg',
  '../img/ff26/stage_time_attack.jpg'
];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  var isImg = /\/img\/ff26\/|\.png$/.test(req.url);
  if (isImg) {
    e.respondWith(caches.match(req, { ignoreSearch: true }).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); return res;
      });
    }));
    return;
  }
  e.respondWith(fetch(req).then(function (res) {
    var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); return res;
  }).catch(function () { return caches.match(req, { ignoreSearch: true }); }));
});
