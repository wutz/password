import React from 'react';
import { Globe } from 'lucide-react';

const LanguageToggle = ({ language, setLanguage, t }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'zh', label: '中文' },
        { code: 'ja', label: '日本語' },
        { code: 'de', label: 'Deutsch' },
        { code: 'fr', label: 'Français' },
    ];

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative z-[100]" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200/50 dark:bg-gray-800/50 hover:bg-gray-300/50 dark:hover:bg-gray-700/50 transition-colors backdrop-blur-sm text-gray-700 dark:text-gray-200"
            >
                <Globe size={18} />
                <span className="uppercase text-sm font-medium">{language}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-32 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-[9999] animate-in fade-in zoom-in-95 duration-200">
                    {languages.map(({ code, label }) => (
                        <button
                            key={code}
                            onClick={() => {
                                setLanguage(code);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${language === code
                                ? 'text-blue-600 dark:text-blue-400 font-medium'
                                : 'text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageToggle;
