const i18n = {
    ja: {
        title: "Litr",
        subtitle: "匿名・高機能・短縮URLマネージャー",
        url_label: "転送先URL",
        url_placeholder: "https://example.com",
        slug_label: "カスタムスラグ (任意)",
        slug_placeholder: "my-secret-link",
        limit_label: "アクセス上限",
        limit_placeholder: "例: 5",
        expiry_label: "有効期限",
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
        back_to_top: "← トップに戻る",
        
        // --- Litr Ultra ---
        advanced_options: "高度な設定 (Ultra)",
        password_label: "パスワード保護 (任意)",
        password_placeholder: "秘密の合言葉",
        self_destruct_label: "自己破壊モード (1回アクセスで消滅)",
        og_title_label: "SNSプレビュー用タイトル",
        og_desc_label: "SNSプレビュー用説明文",
        qr_title: "QRコード",
        enter_password_title: "パスワードが必要です",
        enter_password_desc: "このリンクは保護されています。パスワードを入力してください。",
        unlock_btn: "解除して転送",
        invalid_password: "パスワードが正しくありません。"
    },
    en: {
        title: "Litr",
        subtitle: "Anonymous & Powerful URL Manager",
        url_label: "Destination URL",
        url_placeholder: "https://example.com",
        slug_label: "Custom Slug (Optional)",
        slug_placeholder: "my-secret-link",
        limit_label: "Access Limit",
        limit_placeholder: "e.g. 5",
        expiry_label: "Expiry Date",
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
        back_to_top: "← Back to Home",

        // --- Litr Ultra ---
        advanced_options: "Advanced Options (Ultra)",
        password_label: "Password Protection (Optional)",
        password_placeholder: "Secret Password",
        self_destruct_label: "Self-Destruct Mode (Burn after reading)",
        og_title_label: "Custom SNS Title",
        og_desc_label: "Custom SNS Description",
        qr_title: "QR Code",
        enter_password_title: "Password Protected",
        enter_password_desc: "This link is protected. Please enter the password.",
        unlock_btn: "Unlock & Redirect",
        invalid_password: "Invalid password."
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
