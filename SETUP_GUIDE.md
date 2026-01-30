# 実装手順（完全版）

## STEP 0｜全体像を頭に入れる（1分）

```
GitHub Pages（index.html）
   ↓ POST
Google Apps Script（Web API）
   ↓
Google Drive（写真）
Google スプレッドシート（一覧）
```

---

## STEP 1｜GitHub リポジトリを作る（5分）

1. GitHub → New repository
2. Repository name
   👉 **event-photo-map**
3. Public
4. Create repository

---

## STEP 2｜index.html を置く（5分）

1. リポジトリ直下に `index.html` を作成
2. 先ほど出力した **index.html の全文**を貼り付け
3. まだこの時点では

   ```js
   const GAS_URL = "ここにGASのURL";
   ```

   はそのままでOK
4. Commit

---

## STEP 3｜GitHub Pages を有効化（3分）

1. Repository → **Settings**
2. 左メニュー **Pages**
3. Source

   * Branch：`main`
   * Folder：`/ (root)`
4. Save

👉 数十秒後に URL が出る

```
https://ユーザー名.github.io/event-photo-map/
```

※ まだ動かなくてOK

---

## STEP 4｜Google スプレッドシートを作る（5分）

1. Google Drive → 新規 → スプレッドシート
2. シート名：`data`
3. 1行目に列名を入れる

| A  | B  | C  | D  | E     | F    |
| -- | -- | -- | -- | ----- | ---- |
| 日時 | 緯度 | 経度 | タグ | 写真URL | コメント |

4. **スプレッドシートID**を控える
   （URLの `/d/XXXX/`）

---

## STEP 5｜Google Drive フォルダを作る（3分）

1. Google Drive → 新規フォルダ

   * 例：`event-photo-map`
2. 右クリック → 共有

   * 「リンクを知っている人が閲覧可」
3. **フォルダID**を控える
   （URLの `/folders/XXXX`）

---

## STEP 6｜Google Apps Script を作る（10分）

1. スプレッドシートを開く
2. **拡張機能 → Apps Script**
3. 中身をすべて削除
4. `Code.gs` のコードを貼る
5. 以下を自分のIDに変更

```js
SpreadsheetApp.openById("スプレッドシートID")
DriveApp.getFolderById("フォルダID")
```

6. 保存

---

## STEP 7｜GAS を Web API として公開（超重要・5分）

1. 右上 **デプロイ → 新しいデプロイ**
2. 種類：**ウェブアプリ**
3. 実行ユーザー：**自分**
4. アクセスできるユーザー：**全員**
5. デプロイ
6. 表示された **URLをコピー**

👉 これが「サーバURL」

---

## STEP 8｜index.html に GAS URL を設定（2分）

1. GitHub の `index.html` を編集
2. ここを書き換える

```js
const GAS_URL = "ここにGASのURL";
```

3. Commit

---

## STEP 9｜実機テスト（必須・10分）

### スマホで確認

1. Safari（iPhone）または Chrome
2. GitHub Pages の URL を開く
3. 位置情報 → 許可
4. 写真を1枚選択
5. タグ選択
6. 送信

### 成功条件

* Google Drive に写真が増える
* スプレッドシートに1行追加される
* 写真URLが開ける

---

## STEP 10｜イベント用仕上げ（5分）

* URL を **QRコード化**
* 「位置情報を許可してください」と一言添える
* 会場で1回テスト

---

# トラブルが起きたら（即チェック）

| 症状        | 原因          |
| --------- | ----------- |
| 位置情報が取れない | HTTPSじゃない   |
| 送信失敗      | GASの公開設定    |
| 写真が開けない   | Drive共有設定   |
| 何も起きない    | GAS_URL 未設定 |

---

# 所要時間まとめ

| 作業      | 時間        |
| ------- | --------- |
| GitHub  | 15分       |
| Google側 | 20分       |
| テスト     | 10分       |
| **合計**  | **45分前後** |

---

## これで完成 🎉

この手順どおりやれば
**イベント現場で安定して使える構成**になります。

次にやれること（必要なら）👇

* 管理者用「投稿一覧マップ」
* タグごとに色分け
* 画像サイズ自動縮小
* 当日配布用1枚マニュアル

ここまで来てるので、もう「ほぼ完成」です 👍
