# TeamA ひつじの挑戦状 -SheepQ-

ひつじのクイズアプリ 🐏<br>
（フロント：Next.js / バックエンド：Rails API / 認証：JWT）

<br>

## 開発環境セットアップ

### 前提

- Docker / Docker Compose が利用できること
- Node.js（フロント用）
- 使用ポート
  - フロントエンド: http://localhost:3000
  - バックエンドAPI: http://localhost:3001

<br>

## 起動方法（開発環境）

### 1. API / DB を Docker で起動

```bash
docker compose build --no-cache
docker compose up -d
```

### 2. データベース初期化（初回のみ）

```bash
docker compose exec api bin/rails db:create
docker compose exec api bin/rails db:migrate
```

### 3. フロントエンドをローカルで起動

```bash
cd apps/web
npm install
npm run dev
```

### アクセス先

- フロントエンド<br>
  http://localhost:3000

- 管理画面<br>
  http://localhost:3000/admin

- バックエンドAPI<br>
  http://localhost:3001

### ログイン方法

- TOPページ（/）右上の「ログイン」ボタンを押すと、
  モーダル形式でログイン画面が表示されます。

- 管理画面（/admin）へのアクセスには 管理者権限のあるユーザーでのログインが必要です。

<br>

## 認証（JWT）について

本プロジェクトでは JWT（JSON Web Token）認証を使用しています。

### JWT_SECRET の設定（必須）

JWT_SECRET は自動生成されるものではなく、各環境で自分で設定する必要があります。

ローカルでは、以下のコマンドで生成した値を使用してください。

```bash
docker compose exec api bin/rails secret
```

生成されたランダム文字列を、プロジェクト直下の .env に設定します。

### .env の例（プロジェクト直下）

```bash
JWT_SECRET=ここに生成した長い文字列
JWT_EXP_HOURS=24
```

- .env は git管理しません（.gitignore に含める）
- JWT_EXP_HOURS はトークンの有効期限（時間単位、デフォルト24時間）

<br>

## 開発フロー

本プロジェクトでは、コード品質を保つために
テスト / Lint / CI（自動チェック） を導入しています。

<br>

### フロントエンド（web）

#### テスト実行（watchモード）

```bash
npm run test
```

- ファイル変更を監視して自動で再実行されます
- 開発中のローカル確認用

#### カバレッジ付きテスト（CI向け）

```bash
npm run test:cov
```

- カバレッジレポートを出力
- GitHub Actions などの自動テスト用

#### ESLint（静的解析）

```bash
npm run lint
```

- フロントエンドのコードスタイル・バグ検出
- PR前の実行を推奨しています

<br>

### バックエンド（API）Lint：RuboCop

本プロジェクトでは Ruby のコード規約チェックに RuboCop を使用します。

#### ルールチェック（自動修正なし）

```bash
docker compose exec api bundle exec rubocop
```

#### 自動修正（安全な範囲のみ）

```bash
docker compose exec api bundle exec rubocop -A
```

<br>

## CI（GitHub Actions）

Pull Request および main ブランチへの push 時に、
GitHub Actions で RuboCop を自動実行します。

- 設定ファイル<br>
  .github/workflows/rubocop.yml

- コード規約に違反している場合、PRはマージできません。

### 推奨フロー（PR前チェック）

```bash
# フロントエンド
npm run test
npm run lint

# バックエンド
docker compose exec api bundle exec rubocop
```

<br>

## APIテスト（RSpec）

Rails API では、RSpec の request spec を用いて
エンドポイントの動作確認を行います。

### 全テスト実行

```bash
docker compose exec api bundle exec rspec
```

### 特定のテストのみ実行

```bash
docker compose exec api bundle exec rspec spec/requests/auth_login_spec.rb
```

### トラブルシューティング

#### ログインで500エラーになる場合

以下を確認してください。

```bash
docker compose exec api env | grep JWT
```

JWT_SECRET が表示されない場合：

1. .env がプロジェクト直下に存在するか
2. docker-compose.yml に env_file: - .env があるか
3. 反映のためにコンテナを作り直す：

```bash
docker compose down
docker compose up -d --build
```

<br>

## ドキュメント

- [設計書](docs/design.md)
