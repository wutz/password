import React, { useState, useEffect } from 'react';
import { ShieldCheck, Github } from 'lucide-react';
import PasswordDisplay from './components/PasswordDisplay';
import Controls from './components/Controls';
import ThemeToggle from './components/ThemeToggle';
import LanguageToggle from './components/LanguageToggle';
import { generatePassword } from './utils/passwordGenerator';
import { translations } from './utils/i18n';

// 检测浏览器语言并返回支持的语言代码
function detectBrowserLanguage() {
    const supportedLanguages = ['en', 'zh', 'ja', 'de', 'fr'];

    // 优先从 localStorage 读取用户保存的语言偏好
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
        return savedLanguage;
    }

    // 获取浏览器语言设置
    const browserLang = navigator.language || navigator.userLanguage || 'en';

    // 提取语言代码（例如 'zh-CN' -> 'zh'）
    const langCode = browserLang.split('-')[0].toLowerCase();

    // 如果浏览器语言在支持列表中，返回它
    if (supportedLanguages.includes(langCode)) {
        return langCode;
    }

    // 检查 navigator.languages 数组（浏览器偏好语言列表）
    if (navigator.languages) {
        for (const lang of navigator.languages) {
            const code = lang.split('-')[0].toLowerCase();
            if (supportedLanguages.includes(code)) {
                return code;
            }
        }
    }

    // 默认返回英语
    return 'en';
}

function App() {
    const [password, setPassword] = useState('');
    const [settings, setSettings] = useState({
        length: 16,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false,
        excludeAmbiguous: true,
    });
    const [theme, setTheme] = useState('system');
    const [language, setLanguage] = useState(() => detectBrowserLanguage());

    const t = translations[language];

    // Generate password when settings change
    useEffect(() => {
        const newPassword = generatePassword(settings.length, settings);
        setPassword(newPassword);
    }, [settings]);

    // Handle Theme Change
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    }, [theme]);

    // 保存语言偏好到 localStorage
    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const handleRegenerate = () => {
        const newPassword = generatePassword(settings.length, settings);
        setPassword(newPassword);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-300 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/30 blur-[100px] animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/30 blur-[100px] animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-pink-400/30 blur-[100px] animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative w-full max-w-md z-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
                            <ShieldCheck className="text-white" size={28} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
                            {t.title}
                        </h1>
                    </div>
                </div>

                {/* Main Card */}
                <div className="space-y-6">
                    <PasswordDisplay
                        password={password}
                        onRegenerate={handleRegenerate}
                        t={t}
                    />

                    <Controls
                        settings={settings}
                        setSettings={setSettings}
                        t={t}
                    />
                </div>

                {/* Footer Controls */}
                <div className="flex justify-between items-center mt-8 px-2">
                    <LanguageToggle
                        language={language}
                        setLanguage={setLanguage}
                        t={t}
                    />
                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/wutz/password"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label="GitHub Repository"
                        >
                            <Github size={18} />
                            <span className="hidden sm:inline">GitHub</span>
                        </a>
                        <ThemeToggle
                            theme={theme}
                            setTheme={setTheme}
                            t={t}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
