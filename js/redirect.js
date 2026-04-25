document.addEventListener('DOMContentLoaded', async () => {
    const supabaseClient = supabase.createClient(window.CONFIG.SUPABASE_URL, window.CONFIG.SUPABASE_ANON_KEY);
    const statusMessage = document.getElementById('status-message');
    const errorAction = document.getElementById('error-action');
    const container = document.querySelector('.container');

    const pathParts = window.location.pathname.split('/').filter(p => p !== "" && p !== "index.html" && p !== "404.html");
    const slug = pathParts.length > 0 ? pathParts.pop() : null;

    if (!slug || slug === 'litr-demo' || slug === 'litr') {
        window.location.replace('./');
        return;
    }

    try {
        const { data: link, error } = await supabaseClient
            .from('links')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error || !link) throw new Error(window.i18nManager.t('not_found'));

        // 有効期限と回数制限のチェック
        if (link.li_expiry && new Date(link.li_expiry) < new Date()) throw new Error(window.i18nManager.t('expired'));
        if (link.li_limit && link.tr_count >= link.li_limit) throw new Error(window.i18nManager.t('limit_reached'));

        // カスタムメタ情報の反映 (擬似OGP)
        if (link.custom_title) document.title = link.custom_title;
        if (link.custom_desc) {
            let meta = document.querySelector('meta[name="description"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = "description";
                document.head.appendChild(meta);
            }
            meta.content = link.custom_desc;
        }

        // パスワード保護のチェック
        if (link.password) {
            showPasswordForm(link);
        } else {
            proceedToRedirect(link);
        }

    } catch (err) {
        statusMessage.innerHTML = `<p style="color: #ef4444; font-weight: 600;">${err.message}</p>`;
        errorAction.style.display = 'block';
    }

    // --- パスワードフォームの表示 ---
    function showPasswordForm(link) {
        statusMessage.innerHTML = `
            <h2 data-i18n="enter_password_title" style="margin-bottom:1rem;">${window.i18nManager.t('enter_password_title')}</h2>
            <p data-i18n="enter_password_desc" style="font-size:0.9rem; opacity:0.7; margin-bottom:1.5rem;">${window.i18nManager.t('enter_password_desc')}</p>
            <div class="form-group">
                <input type="password" id="unlock-password" data-i18n="password_placeholder" placeholder="${window.i18nManager.t('password_placeholder')}">
            </div>
            <button id="unlock-btn" class="primary-btn" style="margin-top:1rem;">${window.i18nManager.t('unlock_btn')}</button>
        `;

        document.getElementById('unlock-btn').onclick = () => {
            const inputPass = document.getElementById('unlock-password').value;
            if (inputPass === link.password) {
                proceedToRedirect(link);
            } else {
                alert(window.i18nManager.t('invalid_password'));
            }
        };
    }

    // --- 転送処理（自己破壊ロジック込み） ---
    async function proceedToRedirect(link) {
        statusMessage.innerHTML = `<p>${window.i18nManager.t('transferring')}</p>`;
        
        // カウントアップ
        await supabaseClient.rpc('increment_link_count', { target_slug: link.slug });

        // 自己破壊モードなら削除
        if (link.is_one_time) {
            await supabaseClient.from('links').delete().eq('id', link.id);
        }

        window.location.replace(link.original_url);
    }
});
