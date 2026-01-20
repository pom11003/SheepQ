# ひつじの挑戦状🐑 – Sheep Q – 設計書

## 1. PRD・要件定義

### 1.1 目的

- 羊をテーマにしたクイズゲームを通して、認証・CRUD・API連携・テストまで一通り実装することを目的とする。

### 1.2 想定ユーザー

- 一般ユーザー：クイズに挑戦し、スコアを保存・ランキングを見る。
- 管理者：admin権限でクイズを作成・編集・削除する。

### 1.3 ユースケース

- 一般ユーザー
  - ログインする
  - クイズに挑戦する
  - 結果を見る
  - スコアを保存する
  - ランキングを見る

- 管理者
  - ログインする
  - クイズを登録する
  - クイズを編集・削除する

### 1.4 スコープ

- 実装する機能
  - 認証・認可
  - クイズ出題
  - スコア保存・ランキング表示
  - 管理画面でのクイズCRUD

- 実装しない機能
  - SNS連携
  - 複数カテゴリ・難易度管理（今回は省略）

### 1.5 成功条件

- 3日以内に以下が動作する
  - 認証付きでクイズに挑戦できる。
  - スコアがDBに保存されランキングに反映される。
  - 管理者がクイズをCRUDできる。

## 2. 技術選定

### 2.1 全体構成

- モノレポ構成（フロントエンド・バックエンド分離）
- コンテナ環境で起動可能

### 2.2 フロントエンド

- フレームワーク：Next.js
- 言語：TypeScript
- 主な役割：画面表示、API通信、状態管理

### 2.3 バックエンド

- 言語：Ruby
- フレームワーク：Ruby on Rails（APIモード）
- 認証方式：JWT

### 2.4 データベース

- 使用DB：PostgreSQL
- ORM：ActiveRecord　？

### 2.5 開発環境構成（Docker Compose）

本システムは Docker Compose により、web / api / db の3コンテナ構成とする。

- web コンテナ（Next.js）：ホストへ 3000 番ポートを公開する
- api コンテナ（Rails API）：ホストへ 3001 番ポートを公開する
- db コンテナ（RDBMS）：api コンテナから接続される

> 備考：db のポートは開発都合でホストへ公開する場合があるが、基本方針としてはコンテナ間ネットワークで閉じる。

### 2.6 通信設計（ローカル開発）

- フロントエンド（Next.js）は `http://localhost:3000` で起動する
- バックエンドAPI（Rails）は `http://localhost:3001` で起動する
- フロントエンドからAPIへは HTTP 通信により `http://localhost:3001` を参照する

#### 2.6.1 CORS

- 許可する Origin：`http://localhost:3000`
- 許可するメソッド：GET / POST / PUT / DELETE
- 認証：Authorization ヘッダ（Bearer JWT）を利用するため、必要なヘッダを許可する

### 2.7 コンテナ

- docker-compose により以下を起動
  - web（Next.js）
  - api（Rails）
  - db（PostgreSQL）

## 3. 画面設計

### 3.1 画面一覧

| 画面名     | パス           | 権限  | 内容                             |
| ---------- | -------------- | ----- | -------------------------------- |
| TOP        | /              | 全員  | タイトル・スタート・ログイン導線 |
| クイズ     | /quiz          | user  | 問題表示・選択肢                 |
| 結果       | /result        | user  | 正解数・スコア表示               |
| ランキング | /ranking       | user  | 上位スコア一覧                   |
| 管理画面   | /admin/quizzes | admin | クイズCRUD                       |

### 3.2 画面遷移

- `/` → `/quiz` → `/result` → `/ranking`
- 管理者のみ `/admin/quizzes` に遷移可能

### 3.3 権限による表示制御

- adminのみ管理画面リンクを表示
- 未ログイン時はログイン画面へリダイレクト

## 4. DB設計

### 4.1 テーブル一覧

### users

ログインユーザー（一般/管理者もここで管理）

- id(PK)
- name
- email
- role（"user" / "admin"）
- created_at, updated_at

### quizzes（問題）

問題本体（管理画面でCRUDする中心）

- id(PK)
- image_url
- question（問題文）
- explanation（解説）
- is_published（公開/下書き）
- created_at, updated_at

### choices（選択肢）

　4択想定。正解フラグはここ

- id(PK)
- quiz_id（FK: quizzes.id）
- text（選択肢の文）
- is_correct（正解ならtrue）
- sort_order（表示順）
- created_at, updated_at

### quiz_attempts（1回のプレイ）

「1回挑戦した」という箱（結果画面・ランキングの核）

- id (PK)
- user_id（FK: users.id）
- total_questions
- correct_count
- started_at
- finished_at
- created_at

### 5 answers（回答ログ）

挑戦中に各問題へどう答えたか

- id (PK)
- attempt_id（FK: quiz_attempts.id）
- quiz_id（FK: quizzes.id）
- choice_id（FK choices.id）
- is_correct（採点結果を保存しておくとラク）
- answered_at

---

#### クイズ出題（quizzes + choices）

#### 結果表示（quiz_attempts + answers）

#### ランキング表示（quiz_attempts を user ごとに集計）

---

### 4.2 テーブル定義（例）

#### 🐑 users（ユーザー）

| カラム名   | 型       | 制約         | 説明       |
| ---------- | -------- | ------------ | ---------- |
| id         | string   | PK           | ユーザーID |
| name       | string   | nullable     | 表示名     |
| email      | string   | unique       | メール     |
| role       | enum     | default:user | user/admin |
| created_at | datetime | default now  | 作成       |
| updated_at | datetime | auto update  | 更新       |

#### quizzes（問題）

| カラム名      | 型       | 制約                  | 説明              |
| ------------- | -------- | --------------------- | ----------------- |
| id            | string   | PK                    | クイズID          |
| question      | text     | not null              | 問題文            |
| image_url     | text     | nullable              | 画像URL（なしOK） |
| explanation   | text     | nullable              | 解説              |
| is_published  | boolean  | default false         | 公開/下書き       |
| created_by_id | string   | FK users.id, nullable | 作成者            |
| created_at    | datetime | default now           | 作成              |
| updated_at    | datetime | auto update           | 更新              |

#### scores

| カラム名      | 型       | 制約     | 説明       |
| ------------- | -------- | -------- | ---------- |
| id            | bigint   | PK       | スコアID   |
| user_id       | bigint   | FK       | ユーザーID |
| score         | integer  | not null | 点数       |
| correct_count | integer  | not null | 正解数     |
| created_at    | datetime |          | 作成日時   |

#### choices（選択肢）

| カラム名   | 型       | 制約                        | 説明       |
| ---------- | -------- | --------------------------- | ---------- |
| id         | string   | PK                          | 選択肢ID   |
| quiz_id    | string   | FK quizzes.id               | クイズID   |
| text       | text     | not null                    | 選択肢     |
| is_correct | boolean  | default false               | 正解フラグ |
| sort_order | int      | unique(quiz_id, sort_order) | 1〜4       |
| created_at | datetime | default now                 | 作成       |
| updated_at | datetime | auto update                 | 更新       |

#### quiz_attempts（1回のプレイ）

| カラム名        | 型       | 制約                  | 説明                 |
| --------------- | -------- | --------------------- | -------------------- |
| id              | string   | PK                    | 挑戦ID               |
| user_id         | string   | FK users.id, nullable | ログインなしならnull |
| total_questions | int      | not null              | 出題数               |
| correct_count   | int      | not null              | 正解数               |
| started_at      | datetime | default now           | 開始                 |
| finished_at     | datetime | nullable              | 終了                 |
| created_at      | datetime | default now           | 作成                 |

#### answers（回答ログ）

| カラム名    | 型       | 制約                | 説明                 |
| ----------- | -------- | ------------------- | -------------------- |
| id          | string   | PK                  | 回答ID               |
| attempt_id  | string   | FK quiz_attempts.id | 挑戦ID               |
| quiz_id     | string   | FK quizzes.id       | 問題ID               |
| choice_id   | string   | FK choices.id       | 選んだ選択肢         |
| is_correct  | boolean  | not null            | その時の正誤（固定） |
| answered_at | datetime | default now         | 回答時刻             |

#### →UNIQUE(attempt_id, quiz_id) ＝ 同じ問題に2回回答できない

---

## 5. API設計

### 5.1 認証

| メソッド | パス         | 内容                |
| -------- | ------------ | ------------------- |
| POST     | /auth/signup | ユーザー登録        |
| POST     | /auth/login  | ログイン（JWT発行） |

### 5.2 クイズ

| メソッド | パス     | 権限 | 内容             |
| -------- | -------- | ---- | ---------------- |
| GET      | /quizzes | user | 出題用クイズ取得 |

### 5.3 スコア

| メソッド | パス    | 権限 | 内容           |
| -------- | ------- | ---- | -------------- |
| POST     | /scores | user | スコア保存     |
| GET      | /scores | user | ランキング取得 |

### 5.4 管理者クイズCRUD

| メソッド | パス               | 内容     |
| -------- | ------------------ | -------- |
| GET      | /admin/quizzes     | 一覧取得 |
| POST     | /admin/quizzes     | 新規作成 |
| PUT      | /admin/quizzes/:id | 更新     |
| DELETE   | /admin/quizzes/:id | 削除     |

### 5.5 認証ヘッダ

- `Authorization: Bearer <JWT>` ？

## 6. テスト設計

### 6.1 単体テスト

- Rails Model / Service
  - 認証処理
  - 権限チェック
  - スコア保存

### 6.2 統合テストシナリオ（例）

1. ユーザー登録 → ログイン
2. クイズ取得 → 回答 → 結果保存
3. ランキング表示
4. 管理者ログイン → クイズ作成 → 出題に反映

### 6.3 E2E（可能なら）

- Playwrightで「ログイン→クイズ→結果→ランキング」1本

## 7. セキュリティ・非機能要件

- XSS対策：危険なHTML描画を行わない、入力値を制限
- SQL Injection対策：ActiveRecordとStrong Parametersを利用
- 認証トークン管理：JWTをAuthorizationヘッダで送信
- ログ方針：production環境ではdebugログを出さない

## 8. 運用・起動方法

### 8.0 ポート一覧

| コンテナ | サービス   | コンテナ内ポート | ホスト公開ポート | 備考                    |
| -------- | ---------- | ---------------- | ---------------- | ----------------------- |
| web      | Next.js    | 3000             | 3000             | ブラウザからアクセス    |
| api      | Rails API  | 3001             | 3001             | フロントからHTTP通信    |
| db       | PostgreSQL | 5432             | （非公開）       | apiコンテナからのみ接続 |

### 8.1 起動手順

```bash
docker-compose up
```

### 8.2 環境変数

- DATABASE_URL
- JWT_SECRET

### 8.3 初期管理者

- seedで admin ユーザーを1名作成

## 9. 補足

- 本設計書は3日間の開発を想定した最小構成とする。
- 余裕があれば難易度・カテゴリ・回答履歴の拡張を行う。
