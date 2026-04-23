document.addEventListener('DOMContentLoaded', async () => {
    // グローバルな supabase オブジェクトと名前が衝突しないように名前を変更
    const supabaseClient = supabase.createClient(window.CONFIG.SUPABASE_URL, window.CONFIG.SUPABASE_ANON_KEY);
    const statusMessage = document.getElementById('status-message');
    const errorAction = document.getElementById('error-action');

    const slug = window.location.pathname.split('/').filter(p => p !== "").pop();

    if (!slug || slug === 'index.html' || slug === '404.html') {
        window.location.replace('/');
        return;
    }

    try {
        const { data: link, error } = await supabaseClient
            .from('links')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error || !link) {
            throw new Error(window.i18nManager.t('not_found'));
        }

        if (link.li_expiry && new Date(link.li_expiry) < new Date()) {
            throw new Error(window.i18nManager.t('expired'));
        }

        if (link.li_limit && link.tr_count >= link.li_limit) {
            throw new Error(window.i18nManager.t('limit_reached'));
        }

        statusMessage.innerHTML = `<p>${window.i18nManager.t('transferring')}</p>`;
        
        await supabaseClient.rpc('increment_link_count', { target_slug: slug });

        window.location.replace(link.original_url);

    } catch (err) {
        statusMessage.innerHTML = `<p style="color: #ef4444; font-weight: 600;">${err.message}</p>`;
        errorAction.style.display = 'block';
    }
});
