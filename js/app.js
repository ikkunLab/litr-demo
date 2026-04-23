document.addEventListener('DOMContentLoaded', () => {
    // グローバルな supabase オブジェクトと名前が衝突しないように名前を変更
    const supabaseClient = supabase.createClient(window.CONFIG.SUPABASE_URL, window.CONFIG.SUPABASE_ANON_KEY);
    
    const form = document.getElementById('link-form');
    const resultDiv = document.getElementById('result');
    const shortUrlOutput = document.getElementById('short-url-output');
    const copyBtn = document.getElementById('copy-btn');
    const errorMessage = document.getElementById('error-message');
    const submitBtn = document.getElementById('submit-btn');
    const toast = document.getElementById('toast');

    // --- テーマ管理 ---
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

    // --- 言語管理 ---
    const langToggle = document.getElementById('lang-toggle');
    langToggle.innerText = window.i18nManager.lang === 'ja' ? 'EN' : 'JP';
    
    langToggle.addEventListener('click', () => {
        const newLang = window.i18nManager.lang === 'ja' ? 'en' : 'ja';
        window.i18nManager.setLanguage(newLang);
        langToggle.innerText = newLang === 'ja' ? 'EN' : 'JP';
    });

    // --- トースト通知 ---
    const showToast = (message) => {
        toast.innerText = message;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    };

    // --- リンク作成 ---
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
                        li_expiry: expiry ? new Date(expiry).toISOString() : null
                    }
                ])
                .select();

            if (error) {
                if (error.code === '23505') {
                    throw new Error(window.i18nManager.t('error_duplicate'));
                }
                throw new Error(window.i18nManager.t('error_generic'));
            }

            // 現在のページのURL（末尾のスラッシュを除いたもの）を取得して、スラグを繋げる
            const baseUrl = window.location.href.split('?')[0].split('#')[0].replace(/\/index\.html$/, '').replace(/\/$/, '');
            const shortUrl = `${baseUrl}/${slug}`;
            shortUrlOutput.value = shortUrl;
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

    // --- コピー機能 ---
    copyBtn.addEventListener('click', () => {
        shortUrlOutput.select();
        document.execCommand('copy');
        showToast(window.i18nManager.t('copied'));
    });
});
