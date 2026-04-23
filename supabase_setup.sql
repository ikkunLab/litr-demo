-- 1. リンク管理用テーブルの作成
CREATE TABLE IF NOT EXISTS public.links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    li_limit INTEGER, -- NULLの場合は無制限
    li_expiry TIMESTAMPTZ, -- NULLの場合は期限なし
    tr_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 行単位セキュリティ (RLS) を有効化
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- 3. 誰でも（匿名アクセス）スラグによる検索ができるようにする
CREATE POLICY "Allow public select by slug" ON public.links
    FOR SELECT
    USING (true);

-- 4. 誰でも（匿名アクセス）リンクを作成できるようにする
CREATE POLICY "Allow public insert" ON public.links
    FOR INSERT
    WITH CHECK (true);

-- 5. クリック数を安全に増やすための関数 (RPC)
CREATE OR REPLACE FUNCTION increment_link_count(target_slug TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.links
    SET tr_count = tr_count + 1
    WHERE slug = target_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
