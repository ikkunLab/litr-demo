# **🛠 Litr (Link, Limit & Track) 完全開発仕様書**

**作成日:** 2026年4月22日  
**プロジェクトステータス:** 構想・設計フェーズ

## ---

**1\. プロジェクト概要**

**Litr（リター）**は、匿名性、低コスト、そして高機能を両立させた次世代のURLマネジメントツールです。

* **Li (Limit\&Link):** 「回数」や「時間」による厳格なアクセス制御。  
* **tr (Track):** リアルタイムなクリック解析と動向把握。

「住所バレを完全に防ぎつつ、独自ドメイン js.org でプロフェッショナルな短縮URLを提供する」ことをミッションとしています。

## **2\. 技術スタック詳細**

| コンポーネント | 採用技術 | 選定理由 |
| :---- | :---- | :---- |
| **Domain** | litr.js.org | 短く、技術的な信頼性が高い。完全無料。 |
| **Frontend** | Vanilla JS (ES6+), HTML5, CSS3 | ビルド不要で軽量。GitHub Pagesとの相性が最高。 |
| **Hosting** | GitHub Pages | 完全無料。独自ドメイン(CNAME)対応。サーバーレス。 |
| **Database** | Supabase (PostgreSQL) | APIキーでのクライアント通信が可能。JSとの親和性。 |
| **Logic** | 404 Redirect Engine | GitHub Pagesで動的パスを実現するためのハック。 |

## **3\. データベース（Supabase）詳細設計**

### **テーブル名: links**

以下のカラムを定義し、URLのメタデータを管理します。

* id (uuid, primary key): 自動生成される一意のID。  
* slug (text, unique, not null): 短縮URLの末尾（例: secret-link）。  
* original\_url (text, not null): 転送先の長いURL。  
* li\_limit (integer, nullable): 最大アクセス回数（3回アクセスしたら消える、等）。  
* li\_expiry (timestamptz, nullable): 失効日時（24時間後に消える、等）。  
* tr\_count (integer, default 0): 現在のクリック数。  
* created\_at (timestamptz, default now()): 作成日時。

### **セキュリティ方針 (RLS)**

匿名アクセス（anon）に対して、tr\_count の更新と slug による検索のみを許可するセキュリティポリシーを設定します。

## **4\. 404転生エンジンの動作フロー**

1. **キャッチ:** ユーザーが litr.js.org/abcd にアクセス。GitHub Pagesが404を検知し 404.html を表示。  
2. **抽出:** window.location.pathname から / を除いた abcd を取得。  
3. **照会:** Supabaseに対して select \* from links where slug \= 'abcd' を実行。  
4. **チェックロジック:**  
   * データがない場合 → 「URLが見つかりません」を表示。  
   * li\_expiry が過去の場合 → 「このリンクは期限切れです」を表示。  
   * tr\_count \>= li\_limit の場合 → 「アクセス上限に達しました」を表示。  
5. **更新と転送:** 全てパスした場合、RPC（Remote Procedure Call）で tr\_count を \+1 し、location.replace() で飛ばす。

## **5\. 今後の拡張計画**

* **パスワード保護:** 特定のURLにアクセスする際にパスワードを要求する機能。  
* **ダッシュボード:** 自分が作成したURLのクリック統計をグラフ化する機能。  
* **ワンタイムリンク:** 一度アクセスしたら即座に自己破壊するリンク機能。

---

*This document is prepared for Litr Project Development. License: MIT*