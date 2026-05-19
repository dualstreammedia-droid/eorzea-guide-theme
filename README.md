# eorzea-guide-theme

エオルゼア攻略ガイド ( https://www.eorzea-guide.com ) のカスタムCSS。

## 使い方

はてなブログ管理画面 → デザイン → カスタマイズ → デザインCSS に以下を貼り付け：

```css
/* <system section="theme" selected="8599973812270629022"> */
@import url("https://usercss.blog.st-hatena.com/-/theme/8599973812270629022.css?version=6f6ac2e2c5b886ff583d590873c39b20d98c225a");
/* </system> */
@import url('https://dualstreammedia-droid.github.io/eorzea-guide-theme/main.css');
```

これで以降の CSS 修正は `main.css` を git push するだけで反映される。

## 構成

- `main.css` — 本体CSS（はてなテーマ import は管理画面側に残し、ここには含めない）
- 反映遅延：GitHub Pages CDN キャッシュにより最大10分程度

## ライセンス

サイト運営目的の私的利用。CSSの参考・流用は自由。
