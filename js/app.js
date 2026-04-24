document.addEventListener('DOMContentLoaded', async () => {
    const supabaseClient = supabase.createClient(window.CONFIG.SUPABASE_URL, window.CONFIG.SUPABASE_ANON_KEY);
    
    const form = document.getElementById('link-form');
    const adminPanel = document.getElementById('admin-panel');
    const resultDiv = document.getElementById('result');
    const shortUrlOutput = document.getElementById('short-url-output');
    const adminUrlOutput = document.getElementById('admin-url-output');
    const copyBtn = document.getElementById('copy-btn');
    const copyAdminBtn = document.getElementById('copy-admin-btn');
    const errorMessage = document.getElementById('error-message');
    const submitBtn = document.getElementById('submit-btn');
    const toast = document.getElementById('toast');

    // --- URLパラメータから管理モードを判定 ---
    const urlParams = new URLSearchParams(window.location.search);
    const adminSlug = urlParams.get('admin');
    const adminKey = urlParams.get('key');

    if (adminSlug && adminKey) {
        initAdminMode(adminSlug, adminKey);
    }

    // --- テーマ・言語管理 (省略せずに維持) ---
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('litr_theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme);
    themeToggle.innerText = currentTheme === 'dark' ? '☀️' : '🌙';
    themeToggle.addEventListener('click', () => {
        const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('litr_theme', newTheme);
        themeToggle.innerText = newTheme === 'dark' ? '☀️' : '🌙';
    });

    const langToggle = document.getElementById('lang-toggle');
    langToggle.innerText = window.i18nManager.lang === 'ja' ? 'EN' : 'JP';
    langToggle.addEventListener('click', () => {
        const newLang = window.i18nManager.lang === 'ja' ? 'en' : 'ja';
        window.i18nManager.setLanguage(newLang);
        langToggle.innerText = newLang === 'ja' ? 'EN' : 'JP';
    });

    const showToast = (message) => {
        toast.innerText = message;
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 3000);
    };

    // --- リンク作成ロジック ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.style.display = 'none';
        resultDiv.style.display = 'none';
        submitBtn.disabled = true;
        submitBtn.innerText = window.i18nManager.t('creating_btn');

        const originalUrl = document.getElementById('url').value;
        let slug = document.getElementById('slug').value.trim();
        const limit = document.getElementById('limit').value;
        const expiry = document.getElementById('expiry').value;
        
        // 管理用キーを生成 (32文字のランダム文字列)
        const newAdminKey = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, '0')).join('');

        if (!slug) {
            slug = Math.random().toString(36).substring(2, 8);
        }

        try {
            const { data, error } = await supabaseClient
                .from('links')
                .insert([
                    {
                        original_url: originalUrl,
                        slug: slug,
                        li_limit: limit ? parseInt(limit) : null,
                        li_expiry: expiry ? new Date(expiry).toISOString() : null,
                        admin_key: newAdminKey
                    }
                ])
                .select();

            if (error) {
                if (error.code === '23505') throw new Error(window.i18nManager.t('error_duplicate'));
                throw new Error(error.message || window.i18nManager.t('error_generic'));
            }

            const baseUrl = window.location.href.split('?')[0].split('#')[0].replace(/\/index\.html$/, '').replace(/\/$/, '');
            const shortUrl = `${baseUrl}/${slug}`;
            const adminUrl = `${baseUrl}/?admin=${slug}&key=${newAdminKey}`;

            shortUrlOutput.value = shortUrl;
            adminUrlOutput.value = adminUrl;
            resultDiv.style.display = 'block';
            form.reset();
            showToast(window.i18nManager.t('success_title'));

        } catch (err) {
            errorMessage.innerText = err.message;
            errorMessage.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = window.i18nManager.t('submit_btn');
        }
    });

    // --- 管理モードの初期化 ---
    async function initAdminMode(slug, key) {
        form.style.display = 'none';
        adminPanel.style.display = 'block';

        try {
            const { data: link, error } = await supabaseClient
                .from('links')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error || !link) throw new Error(window.i18nManager.t('not_found'));

            // 統計の表示
            document.getElementById('stat-clicks').innerText = link.tr_count;
            document.getElementById('stat-limit').innerText = link.li_limit || '--';
            document.getElementById('edit-limit').value = link.li_limit || '';
            if (link.li_expiry) {
                document.getElementById('edit-expiry').value = new Date(link.li_expiry).toISOString().slice(0, 16);
            }

            // 保存ボタンの動作
            document.getElementById('save-settings-btn').onclick = async () => {
                const newLimit = document.getElementById('edit-limit').value;
                const newExpiry = document.getElementById('edit-expiry').value;

                const { error: updateError } = await supabaseClient
                    .from('links')
                    .update({
                        li_limit: newLimit ? parseInt(newLimit) : null,
                        li_expiry: newExpiry ? new Date(newExpiry).toISOString() : null
                    })
                    .eq('slug', slug)
                    .match({ admin_key: key }); // 簡易的なチェック (本来はヘッダーでやるのが理想)

                if (updateError) alert(updateError.message);
                else showToast(window.i18nManager.t('copied')); // 成功トースト
            };

            // 削除ボタンの動作
            document.getElementById('delete-link-btn').onclick = async () => {
                if (!confirm(window.i18nManager.t('delete_confirm'))) return;

                const { error: deleteError } = await supabaseClient
                    .from('links')
                    .delete()
                    .eq('slug', slug)
                    .match({ admin_key: key });

                if (deleteError) alert(deleteError.message);
                else window.location.replace('./');
            };

        } catch (err) {
            alert(err.message);
            window.location.replace('./');
        }
    }

    // --- コピー機能 ---
    copyBtn.onclick = () => { shortUrlOutput.select(); document.execCommand('copy'); showToast(window.i18nManager.t('copied')); };
    copyAdminBtn.onclick = () => { adminUrlOutput.select(); document.execCommand('copy'); showToast(window.i18nManager.t('copied')); };
});
