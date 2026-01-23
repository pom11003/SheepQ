# 設計書 – ひつじの挑戦状 – SheepQ –

本ドキュメントは、ひつじのクイズアプリ（ひつじの挑戦状 – SheepQ –）の
システム構成・設計方針・主要な仕様をまとめた設計書です。

<br>

## 1. PRD・要件定義

### 1.1 目的

- 羊をテーマとしたクイズゲームを題材に、認証・CRUD・API連携・テスト・CIまで一連のWebアプリ開発を実践する。
- チーム開発における役割分担・設計・運用の経験を得る。

### 1.2 想定ユーザー

- 一般ユーザー
  - クイズに挑戦し、結果を確認する。

- 管理者
  - 管理画面からクイズを作成・編集・削除する。

### 1.3 ユースケース

- 一般ユーザー
  - ログインする
  - クイズに挑戦する
  - 結果を見る

- 管理者
  - ログインする
  - クイズを登録する
  - クイズを編集・削除する

### 1.4 スコープ

#### 実装する機能

- JWTによる認証・認可
- クイズ出題（4択）
- 回答後の正誤表示・解説表示
- 管理画面でのクイズCRUD

#### 実装しない機能（今回の対象外）

- スコア保存
- ランキング機能
- 難易度管理

### 1.5 成功条件

- 3日以内に以下が動作すること
  - JWT認証付きでクイズに挑戦できる
  - 管理者がクイズをCRUDできる
  - セキュリティ対策への考慮(XSS, SQL injection)
  - テストの実装

<br>

## 2. 技術選定・全体構成

### 2.1 全体構成

- モノレポ構成とし、フロントエンドとバックエンドを論理的に分離する。
- バックエンドおよびデータベースは Docker Compose 上で起動し、
  フロントエンドはローカル環境で起動する構成とする。

```
[ Browser ]
     |
     v
[ Next.js (web:3000) ]  --->  [ Rails API (api:3001) ]  --->  [ PostgreSQL (db) ]
```

### 2.2 技術スタック

| 分類           | 技術                       |
| -------------- | -------------------------- |
| フロントエンド | Next.js / TypeScript       |
| バックエンド   | Ruby on Rails（APIモード） |
| 認証           | JWT（JSON Web Token）      |
| DB             | PostgreSQL                 |
| 開発環境       | Docker                     |
| CI             | GitHub Actions（RuboCop）  |

### 2.3 フロントエンド

- フレームワーク：Next.js
- 言語：TypeScript
- 主な役割
  - 画面描画
  - API通信
  - JWTの保持と送信

### 2.4 バックエンド

- フレームワーク：Ruby on Rails（APIモード）
- 主な役割
  - 認証処理（JWT発行・検証）
  - クイズ・選択肢のCRUD
  - 権限チェック（admin判定）

### 2.5 開発環境構成（Docker Compose）

本システムの開発環境では、バックエンドおよびデータベースをDocker Compose 上で起動し、
フロントエンドはローカル環境で起動する構成とする。

- api コンテナ（Rails API）：ホストへ 3001 番ポートを公開する
- db コンテナ（PostgreSQL）：api コンテナから接続される

> 備考：db のポートは開発都合でホストへ公開する場合があるが、基本方針としてはコンテナ間ネットワークで閉じる。

<br>

## 3. 画面設計

### 3.1 画面一覧

| 画面名     | パス      | 権限  | 内容                   |
| ---------- | --------- | ----- | ---------------------- |
| TOP        | `/`       | 全員  | スタート・ログイン導線 |
| クイズ     | `/quiz`   | user  | 問題表示・選択肢       |
| 結果       | `/result` | user  | 正誤・スコア表示       |
| 管理画面   | `/admin`  | admin | 管理トップ             |
| クイズ管理 | `/admin`  | admin | クイズCRUD             |

### 3.2 画面遷移

```
/
 └─ ログインモーダル
        └─ 認証成功
              └─ /quiz → /result

/admin（管理者のみ）
 └─ /admin
```

### 3.3 表示制御・ガード

- 未ログイン時はログインモーダルを表示

<br>

## 4. 認証・認可設計（JWT）

### 4.1 認証フロー

1. フロントから `/auth/login` に email / password を送信
2. APIで認証
3. 認証成功時、JWTを発行
4. フロントは JWT を保存
5. 以降のAPIリクエストで
   `Authorization: Bearer <JWT>` を付与

### 4.2 権限管理

- users テーブルの `role` カラムで権限を管理
  - `user`
  - `admin`

- Rails側で `before_action` により管理者チェックを行う

### 4.3 環境変数

- `JWT_SECRET`：JWT署名鍵（必須）
- `JWT_EXP_HOURS`：有効期限（デフォルト24時間）

<br>

## 5. DB設計（現状のテーブル構成）

本章は、Railsコンソールで確認した **現在のテーブル定義** を反映する。

### 5.1 テーブル一覧

```
users
quizzes
choices
quiz_attempts
answers
```

### 5.2 ER（リレーション概要）

- users 1 — N quiz_attempts
- quizzes 1 — N choices
- quiz_attempts 1 — N answers
- answers は quizzes / choices を参照（どの問題にどう答えたかを保持）

---

### 5.3 users

| カラム名        | 型（sql_type） |  null | 説明                                      |
| --------------- | -------------- | ----: | ----------------------------------------- |
| id              | INTEGER        | false | ユーザーID                                |
| name            | varchar        |  true | 表示名                                    |
| email           | varchar        | false | メールアドレス                            |
| role            | varchar        | false | user / admin                              |
| password_digest | varchar        |  true | パスワードハッシュ（has_secure_password） |
| created_at      | datetime(6)    | false | 作成日時                                  |
| updated_at      | datetime(6)    | false | 更新日時                                  |

---

### 5.4 quizzes

| カラム名      | 型（sql_type） |  null | 説明                           |
| ------------- | -------------- | ----: | ------------------------------ |
| id            | INTEGER        | false | クイズID                       |
| image_url     | varchar        |  true | 画像URL（任意）                |
| image_credit  | varchar        |  true | 画像クレジット（任意）         |
| question      | TEXT           | false | 問題文                         |
| explanation   | TEXT           |  true | 解説（任意）                   |
| is_published  | boolean        | false | 公開フラグ                     |
| correct_index | INTEGER        |  true | 正解のインデックス（0〜3想定） |
| code          | INTEGER        |  true | クイズ分類コード等（運用用）   |
| created_at    | datetime(6)    | false | 作成日時                       |
| updated_at    | datetime(6)    | false | 更新日時                       |

---

### 5.5 quiz_attempts

| カラム名        | 型（sql_type） |  null | 説明             |
| --------------- | -------------- | ----: | ---------------- |
| id              | INTEGER        | false | 挑戦ID           |
| user_id         | INTEGER        | false | ユーザーID       |
| total_questions | INTEGER        | false | 出題数           |
| correct_count   | INTEGER        | false | 正解数           |
| started_at      | datetime(6)    |  true | 開始時刻（任意） |
| finished_at     | datetime(6)    |  true | 終了時刻（任意） |
| created_at      | datetime(6)    | false | 作成日時         |
| updated_at      | datetime(6)    | false | 更新日時         |

---

### 5.6 answers

| カラム名        | 型（sql_type） |  null | 説明           |
| --------------- | -------------- | ----: | -------------- |
| id              | INTEGER        | false | 回答ID         |
| quiz_attempt_id | INTEGER        | false | 挑戦ID（FK）   |
| quiz_id         | INTEGER        | false | クイズID（FK） |
| choice_id       | INTEGER        | false | 選択肢ID（FK） |
| is_correct      | boolean        | false | 正誤           |
| answered_at     | datetime(6)    | false | 回答時刻       |
| created_at      | datetime(6)    | false | 作成日時       |
| updated_at      | datetime(6)    | false | 更新日時       |

---

### 5.7 choices

| カラム名   | 型（sql_type） |  null | 説明           |
| ---------- | -------------- | ----: | -------------- |
| id         | INTEGER        | false | 選択肢ID       |
| quiz_id    | INTEGER        | false | クイズID（FK） |
| text       | varchar        | false | 選択肢テキスト |
| is_correct | boolean        | false | 正解フラグ     |
| sort_order | INTEGER        | false | 表示順（1〜4） |
| created_at | datetime(6)    | false | 作成日時       |
| updated_at | datetime(6)    | false | 更新日時       |

<br>

## 6. API設計（実装反映）

### 6.1 認証

| メソッド | パス          | 内容              |
| -------- | ------------- | ----------------- |
| POST     | `/auth/login` | ログイン・JWT発行 |

---

### 6.2 出題用

| メソッド | パス       | 権限 | 内容             |
| -------- | ---------- | ---- | ---------------- |
| GET      | `/quizzes` | user | 出題用クイズ取得 |

---

### 6.3 管理者クイズCRUD

`Quiz.includes(:choices)` でクイズと選択肢をまとめて返す。

| メソッド | パス                 | 権限  | 内容                                      |
| -------- | -------------------- | ----- | ----------------------------------------- |
| GET      | `/admin/quizzes`     | admin | 一覧取得（choices含む）                   |
| POST     | `/admin/quizzes`     | admin | 新規作成（choices必須）                   |
| PATCH    | `/admin/quizzes/:id` | admin | 更新（本体のみ／choices含む更新の両対応） |
| DELETE   | `/admin/quizzes/:id` | admin | 削除                                      |

#### POST /admin/quizzes（作成）仕様

- choices は **4つ固定**
- is_correct は **ちょうど1つ**
- API側で `correct_index`（0.1.2.3）を算出し、choices の `is_correct` を整合させる

リクエスト（例）

```json
{
  "question": "この羊の品種は？",
  "explanation": "...",
  "image_url": "...",
  "image_credit": "...",
  "is_published": true,
  "choices": [
    { "text": "A", "is_correct": true, "sort_order": 1 },
    { "text": "B", "is_correct": false, "sort_order": 2 },
    { "text": "C", "is_correct": false, "sort_order": 3 },
    { "text": "D", "is_correct": false, "sort_order": 4 }
  ]
}
```

レスポンスは `data` に `quiz + choices` を返す。

#### PATCH /admin/quizzes/:id（更新）仕様

- choices を送ってきた場合のみ、**choices更新として扱う**
  - choices は **4つ固定**
  - is_correct は **ちょうど1つ**
- choices更新時は、 **一旦全削除→全再作成** で入れ替える
- choices を送らない場合は、公開フラグ切替など **クイズ本体のみ更新**に対応

---

### 6.4 認証ヘッダ

```
Authorization: Bearer <JWT>
```

<br>

## 7. テスト・CI設計

### 7.1 フロントエンド（web）

- テスト：Vitest
- 静的解析：ESLint
- カバレッジ：`vitest --coverage`
- 対象：`.ts` / `.tsx`

### 7.2 バックエンド（api）

- テスト：RSpec
- Lint：RuboCop
- 対象：`.rb`

### 7.3 CI

- GitHub Actions で RuboCop を自動実行
- Pull Request / main push で走り、規約違反がある場合はマージ不可

<br>

## 8. 運用・起動

### 8.1 ポート一覧

| サービス | ホストポート | 備考       |
| -------- | ------------ | ---------- |
| web      | 3000         | Next.js    |
| api      | 3001         | Rails API  |
| db       | 5432         | PostgreSQL |

### 8.2 起動手順（概要）

1. `docker compose up -d --build`
2. `docker compose exec api rails db:migrate`
3. `npm run dev`

<br>

## 9. 補足・今後の拡張

- 管理画面
  - クイズ一覧で画像の表示
  - クイズ作成で画像のプレビュー表示
- 回答履歴の可視化
  - ランキング機能の実装

<br>

以上
