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
