# simple-diary

## 概要

**simple-diary** は、React Native（Expo）で作られたシンプルな日記アプリです。カレンダーから日付を選び、その日の出来事や思いを自由に記録できます。日記はローカルストレージに保存され、編集・削除も可能です。

## 主な機能

- カレンダーから日付を選択し、その日に日記を記録
- 過去の日記の閲覧・編集・削除
- 日記のローカル保存（AsyncStorage使用）
- シンプルで直感的なUI
- Expo Routerによる画面遷移

## 画面構成

- **カレンダー画面**: 日付ごとの日記一覧表示、日記の追加・編集・削除
- **日記作成画面**: 新規日記の作成、既存日記の編集

## セットアップ手順

1. リポジトリをクローン
   ```sh
   git clone <このリポジトリのURL>
   cd simple_diary_ai
   ```
2. 依存パッケージのインストール
   ```sh
   npm install
   # または
   yarn install
   ```
3. Expoでアプリを起動
   ```sh
   npm run dev
   # または
   yarn dev
   ```

## ビルド・デプロイ

EAS（Expo Application Services）を利用したビルドに対応しています。

- 開発用ビルド
  ```sh
  eas build --profile development --platform all
  ```
- プロダクションビルド
  ```sh
  eas build --profile production --platform all
  ```

## 依存パッケージ（主要）

- expo
- react
- react-native
- expo-router
- react-native-calendars
- @react-native-async-storage/async-storage
- lucide-react-native

詳細は `package.json` を参照してください。

## ディレクトリ構成

```
simple_diary_ai/
  ├── app/                # 画面・ルーティング
  │   ├── (tabs)/        # タブ画面（カレンダー・日記作成）
  │   ├── _layout.tsx    # ルートレイアウト
  │   └── +not-found.tsx # NotFound画面
  ├── assets/            # 画像・アイコン
  ├── hooks/             # カスタムフック
  ├── types/             # 型定義
  ├── utils/             # ユーティリティ
  ├── package.json
  ├── app.json           # Expoアプリ設定
  ├── eas.json           # EASビルド設定
  └── tsconfig.json      # TypeScript設定
```

## ライセンス

このプロジェクトのライセンスはMITです。

---

> アイコン画像やスクリーンショットは `assets/images/` フォルダに格納されています。 