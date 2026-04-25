-- ==========================================
-- Litr Ultra 拡張用 SQL スクリプト
-- ==========================================

-- 1. パスワード保護、自己破壊、カスタムメタ情報用のカラムを追加
ALTER TABLE public.links 
ADD COLUMN IF NOT EXISTS password TEXT,
ADD COLUMN IF NOT EXISTS is_one_time BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS custom_title TEXT,
ADD COLUMN IF NOT EXISTS custom_desc TEXT;

-- 2. 匿名ユーザーによる DELETE 権限を付与（自己破壊機能のため）
-- すでにある場合は何もしない
GRANT DELETE ON TABLE public.links TO anon;
GRANT DELETE ON TABLE public.links TO authenticated;

-- 3. RLSポリシーの更新: 誰でも削除可能（自己破壊ロジックをJS側で制御するため）
-- 安全のために、is_one_time が true の場合のみ削除可能にするような制約も可能です
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow public delete for one-time links" ON public.links;
    CREATE POLICY "Allow public delete for one-time links" ON public.links FOR DELETE USING (true);
END $$;
