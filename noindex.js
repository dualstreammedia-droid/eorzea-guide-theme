// noindex対象記事リスト（エオルゼア攻略ガイド）
// 管理: company/projects/noindex_candidates.md と同期。追加・解除はこのファイルを編集してgit push
// 仕組み: はてなブログは記事単位のnoindex公式機能がないため、対象パスのみ<head>にrobotsメタを動的挿入する
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
