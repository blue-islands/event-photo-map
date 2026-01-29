# イベント写真投稿アプリ

## 概要
スマートフォンから現在地・写真・タグを送信し、
Google Drive に写真保存、
Google スプレッドシートに一覧を記録するイベント用Webアプリ。

## 構成
- フロント：GitHub Pages（index.html）
- 地図：Leaflet
- サーバ：Google Apps Script
- 保存先：Google Drive / Google スプレッドシート

## 事前準備
1. Google スプレッドシート作成
   - シート名：data
   - 列：日時 / 緯度 / 経度 / タグ / 写真URL / コメント

2. Google Drive フォルダ作成
   - 共有：リンクを知っている人が閲覧可

3. Apps Script に gas/Code.gs を貼り付け
   - シートID / フォルダID を設定
   - Webアプリとしてデプロイ（全員アクセス可）

4. index.html の GAS_URL を修正

## デプロイ
- GitHub Pages を有効化
- HTTPS URL を QRコード化して配布

## 注意
- 位置情報は HTTPS 必須
- iPhone は Safari 推奨
- イベント前に必ず実機テスト
