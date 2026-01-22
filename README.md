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
