# TeamA_SheepQ

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

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:3001

### 認証（JWT）

JWT_SECは自動発行されるものではなく自分で作る
root@d949afe1dda3:/app# bin/rails secretの値とした

- JWT_SECRET は各環境で設定
  JWT_EXP_HOURS=24
- ローカルでは認証担当の api を利用
- フロントは token を Authorization ヘッダに付与する
  まとめ（判断基準）
  状況 JWT_SECRET
  認証担当だけが api を起動 あなた1人でOK
  全員が api を起動 各自で作る
  本番 1つを厳重管理

## 開発

本プロジェクトでは、コード品質を保つために  
**テスト / Lint / CI（自動チェック）** を導入しています。

<br>

### フロントエンド（web）開発用コマンド

#### テスト実行（watch モード）

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
- PR 前の実行を推奨

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

#### CI（GitHub Actions）

Pull Request および main ブランチへの push 時に、
GitHub Actions で RuboCop を自動実行します。

- 設定ファイル： .github/workflows/rubocop.yml
- コード規約に違反している場合、PR はマージできません

##### 推奨フロー

PR 作成前に、以下の実行を推奨します。

```bash
# フロントエンド
npm run test
npm run lint


# バックエンド
docker compose exec api bundle exec rubocop
```

## API テスト（RSpec）

本プロジェクトの Rails API では、RSpec の request spec を用いて
エンドポイントの動作確認を行います。

### 実行方法

```sh
docker compose exec api bundle exec rspec
```

特定のテストだけ実行したい場合：
docker compose exec api bundle exec rspec spec/requests/auth_login_spec.rb
