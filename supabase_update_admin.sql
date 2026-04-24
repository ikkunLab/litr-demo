-- linksテーブルに admin_key カラムを追加
ALTER TABLE public.links ADD COLUMN IF NOT EXISTS admin_key TEXT;

-- admin_keyを知っている人だけが削除できるようにRLSを更新
DROP POLICY IF EXISTS "Allow delete with admin_key" ON public.links;
CREATE POLICY "Allow delete with admin_key" ON public.links
    FOR DELETE
    USING (admin_key IS NOT NULL AND (current_setting('request.headers')::json->>'x-admin-key') = admin_key);

-- admin_keyを知っている人だけが更新（制限の変更など）できるようにRLSを更新
DROP POLICY IF EXISTS "Allow update with admin_key" ON public.links;
CREATE POLICY "Allow update with admin_key" ON public.links
    FOR UPDATE
    USING (admin_key IS NOT NULL AND (current_setting('request.headers')::json->>'x-admin-key') = admin_key);
