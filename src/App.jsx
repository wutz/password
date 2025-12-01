import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import PasswordDisplay from './components/PasswordDisplay';
import Controls from './components/Controls';
import ThemeToggle from './components/ThemeToggle';
import LanguageToggle from './components/LanguageToggle';
import { generatePassword } from './utils/passwordGenerator';
import { translations } from './utils/i18n';

function App() {
    const [password, setPassword] = useState('');
    const [settings, setSettings] = useState({
        length: 16,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false,
        excludeAmbiguous: false,
    });
    const [theme, setTheme] = useState('system');
    const [language, setLanguage] = useState('en');

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
                    <ThemeToggle
                        theme={theme}
                        setTheme={setTheme}
                        t={t}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
