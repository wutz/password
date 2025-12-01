import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

const ThemeToggle = ({ theme, setTheme, t }) => {
    const themes = [
        { id: 'light', icon: Sun },
        { id: 'dark', icon: Moon },
        { id: 'system', icon: Monitor },
    ];

    return (
        <div className="flex bg-gray-200/50 dark:bg-gray-800/50 rounded-lg p-1 backdrop-blur-sm">
            {themes.map(({ id, icon: Icon }) => (
                <button
                    key={id}
                    onClick={() => setTheme(id)}
                    className={`p-2 rounded-md transition-all duration-200 ${theme === id
                            ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                    title={id}
                >
                    <Icon size={18} />
                </button>
            ))}
        </div>
    );
};

export default ThemeToggle;
