# TeamA_SheepQ

README.md
→「このリポジトリを触る人のための“使い方説明書”」<br>
設計書
→「このシステムをどう作ったか・どう作るかの“設計図”」

## 起動方法（開発環境）

### 前提

- Docker / Docker Compose がインストールされていること

## 起動手順

### コンテナのビルドと起動

```bash

docker compose up -d --build

```

起動確認

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:3001

## ポート一覧

| サービス | ポート | 説明           |
| -------- | ------ | -------------- |
| web      | 3000   | フロントエンド |
| api      | 3001   | Rails API      |
| db       | 5432   | PostgreSQL     |
