// Supabase 接続設定
const SUPABASE_URL = 'https://bipbrthmaocdizyhuafz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpcGJydGhtYW9jZGl6eWh1YWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NjUzNDYsImV4cCI6MjA5MjQ0MTM0Nn0.B9fk9cJ9EknnYAQxjaZgxVj6-MTBPfDJ0-Ah2re_nxA';

// グローバルに参照できるようにエクスポート（モジュールを使わない簡単な構成にするため）
window.CONFIG = {
    SUPABASE_URL,
    SUPABASE_ANON_KEY
};
