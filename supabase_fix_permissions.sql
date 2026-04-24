-- ==========================================
-- Litr 権限復旧用 SQL スクリプト
-- ==========================================

-- 1. 匿名ユーザー(anon)とログインユーザーに、テーブルの操作権限を付与
-- これをやらないと "permission denied for table links" が出ます
GRANT ALL ON TABLE public.links TO anon;
GRANT ALL ON TABLE public.links TO authenticated;
GRANT ALL ON TABLE public.links TO postgres;
GRANT ALL ON TABLE public.links TO service_role;

-- 2. スキーマ全体の利用権限を念のため再付与
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 3. 行単位セキュリティ (RLS) のポリシーを確実に設定
-- すでにある場合はエラーにならないようにチェックしながら作成します

-- 読み取りポリシー: 誰でもスラグで検索可能
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow public select by slug" ON public.links;
    CREATE POLICY "Allow public select by slug" ON public.links FOR SELECT USING (true);
END $$;

-- 書き込みポリシー: 誰でも新しいリンクを作成可能
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow public insert" ON public.links;
    CREATE POLICY "Allow public insert" ON public.links FOR INSERT WITH CHECK (true);
END $$;

-- 更新ポリシー: 誰でもクリック数を増やせるように設定
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow public update" ON public.links;
    CREATE POLICY "Allow public update" ON public.links FOR UPDATE USING (true);
END $$;

-- 4. シーケンスの権限付与（ID生成エラー防止）
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- これで完了！
-- SQL Editorで実行して「Success」が出ればOKです。
