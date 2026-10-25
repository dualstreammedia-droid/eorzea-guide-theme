# マスターCSSから main.css を更新してgit push まで一気に実行
# 使い方: .\update_from_master.ps1 "コミットメッセージ"

$src = 'C:\Users\PC_User\company\OWNER_WORK\05_デザイン適用\00_貼替用_全部入りCSS.css'
$dst = Join-Path $PSScriptRoot 'main.css'

if (-not (Test-Path $src)) {
    Write-Error "マスターCSSが見つからない: $src"
    exit 1
}

# はてなテーマimport（3行）を除外してコピー
$content = Get-Content -Raw $src -Encoding UTF8
$pattern = '(?s)/\* <system section="theme"[^*]*\*/\s*@import url\("https://usercss\.blog\.st-hatena\.com[^"]+"\);\s*/\* </system> \*/\s*'
$cleaned = $content -replace $pattern, ''
[System.IO.File]::WriteAllText($dst, $cleaned, (New-Object System.Text.UTF8Encoding $false))
Write-Host "main.css 更新: $((Get-Item $dst).Length) bytes" -ForegroundColor Green

# git push
Set-Location $PSScriptRoot
$env:Path = "C:\Program Files\GitHub CLI;" + $env:Path

$msg = if ($args[0]) { $args[0] } else { "Update theme $(Get-Date -Format 'yyyy-MM-dd HH:mm')" }

git add main.css
$status = git status --porcelain main.css
if (-not $status) {
    Write-Host "差分なし。pushスキップ。" -ForegroundColor Yellow
    exit 0
}

git commit -m $msg
git push
Write-Host ""
Write-Host "完了。GitHub Pages CDN反映まで最大10分。" -ForegroundColor Green
Write-Host "確認: https://dualstreammedia-droid.github.io/eorzea-guide-theme/main.css" -ForegroundColor Cyan
