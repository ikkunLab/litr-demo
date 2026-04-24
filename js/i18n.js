const i18n = {
    ja: {
        title: "Litr",
        subtitle: "匿名・高機能・短縮URLマネージャー",
        url_label: "転送先URL",
        url_placeholder: "https://example.com",
        slug_label: "カスタムスラグ (任意)",
        slug_placeholder: "my-secret-link",
        limit_label: "アクセス上限回数 (任意)",
        limit_placeholder: "例: 5",
        expiry_label: "有効期限 (任意)",
        submit_btn: "短縮URLを作成",
        creating_btn: "作成中...",
        success_title: "作成完了！",
        admin_link_label: "管理用URL (このURLは秘密にしてね)",
        copy_btn: "コピー",
        copied: "コピーしました！",
        delete_btn: "リンクを削除",
        delete_confirm: "本当にこのリンクを削除しますか？",
        stats_title: "リンク統計",
        clicks: "クリック数",
        limit: "上限",
        expiry: "期限",
        save_btn: "設定を保存",
        error_duplicate: "そのスラグは既に使われています。",
        error_generic: "エラーが発生しました。",
        checking_link: "リンクを確認しています...",
        transferring: "転送しています...",
        not_found: "リンクが見つかりません。",
        expired: "このリンクは有効期限が切れています。",
        limit_reached: "このリンクはアクセス上限に達しました。",
        back_to_top: "← トップに戻る"
    },
    en: {
        title: "Litr",
        subtitle: "Anonymous & Powerful URL Manager",
        url_label: "Destination URL",
        url_placeholder: "https://example.com",
        slug_label: "Custom Slug (Optional)",
        slug_placeholder: "my-secret-link",
        limit_label: "Access Limit (Optional)",
        limit_placeholder: "e.g. 5",
        expiry_label: "Expiry Date (Optional)",
        submit_btn: "Create Short URL",
        creating_btn: "Creating...",
        success_title: "Created Successfully!",
        admin_link_label: "Admin URL (Keep this secret!)",
        copy_btn: "Copy",
        copied: "Copied!",
        delete_btn: "Delete Link",
        delete_confirm: "Are you sure you want to delete this link?",
        stats_title: "Link Statistics",
        clicks: "Clicks",
        limit: "Limit",
        expiry: "Expiry",
        save_btn: "Save Settings",
        error_duplicate: "This slug is already taken.",
        error_generic: "An error occurred.",
        checking_link: "Checking link...",
        transferring: "Transferring...",
        not_found: "Link not found.",
        expired: "This link has expired.",
        limit_reached: "Access limit reached.",
        back_to_top: "← Back to Home"
    }
};

class I18nManager {
    constructor() {
        this.lang = localStorage.getItem('litr_lang') || 
                    (navigator.language.startsWith('ja') ? 'ja' : 'en');
        document.documentElement.lang = this.lang;
    }

    setLanguage(lang) {
        this.lang = lang;
        localStorage.setItem('litr_lang', lang);
        document.documentElement.lang = lang;
        this.updateUI();
    }

    t(key) {
        return i18n[this.lang][key] || key;
    }

    updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (el.tagName === 'INPUT') {
                el.placeholder = this.t(key);
            } else {
                el.innerText = this.t(key);
            }
        });
    }
}

window.i18nManager = new I18nManager();
window.addEventListener('DOMContentLoaded', () => window.i18nManager.updateUI());
