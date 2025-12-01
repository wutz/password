import React from 'react';

const Controls = ({ settings, setSettings, t }) => {
    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 text-gray-800 dark:text-white">
            {/* Length Slider */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <label className="font-medium">{t.length}</label>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{settings.length}</span>
                </div>
                <input
                    type="range"
                    min="4"
                    max="64"
                    value={settings.length}
                    onChange={(e) => handleChange('length', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
                />
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Checkbox
                    label={t.uppercase}
                    checked={settings.includeUppercase}
                    onChange={(e) => handleChange('includeUppercase', e.target.checked)}
                />
                <Checkbox
                    label={t.lowercase}
                    checked={settings.includeLowercase}
                    onChange={(e) => handleChange('includeLowercase', e.target.checked)}
                />
                <Checkbox
                    label={t.numbers}
                    checked={settings.includeNumbers}
                    onChange={(e) => handleChange('includeNumbers', e.target.checked)}
                />
                <Checkbox
                    label={t.symbols}
                    checked={settings.includeSymbols}
                    onChange={(e) => handleChange('includeSymbols', e.target.checked)}
                />
                <div className="md:col-span-2">
                    <Checkbox
                        label={t.excludeAmbiguous}
                        checked={settings.excludeAmbiguous}
                        onChange={(e) => handleChange('excludeAmbiguous', e.target.checked)}
                    />
                </div>
            </div>
        </div>
    );
};

const Checkbox = ({ label, checked, onChange }) => (
    <label className="flex items-center space-x-3 cursor-pointer group">
        <div className="relative">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="sr-only"
            />
            <div className={`w-6 h-6 rounded border-2 transition-colors duration-200 flex items-center justify-center
        ${checked
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-400 dark:border-gray-500 group-hover:border-blue-400'
                }`}
            >
                {checked && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
        </div>
        <span className="select-none">{label}</span>
    </label>
);

export default Controls;
