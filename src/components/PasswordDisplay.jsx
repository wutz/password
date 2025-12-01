import React, { useState } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';

const PasswordDisplay = ({ password, onRegenerate, t }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!password) return;
        try {
            await navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-lg border border-white/20">
            <div className="relative group">
                <div className="text-3xl md:text-4xl font-mono font-bold text-center break-all text-gray-800 dark:text-white min-h-[3rem] flex items-center justify-center">
                    {password || "..."}
                </div>
            </div>

            <div className="flex justify-center gap-4 mt-6">
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/80 hover:bg-blue-600/80 text-white transition-all duration-200 backdrop-blur-sm shadow-md active:scale-95"
                    title={t.copy}
                >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                    <span>{copied ? t.copied : t.copy}</span>
                </button>

                <button
                    onClick={onRegenerate}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-500/80 hover:bg-gray-600/80 text-white transition-all duration-200 backdrop-blur-sm shadow-md active:scale-95"
                    title={t.regenerate}
                >
                    <RefreshCw size={20} />
                    <span>{t.regenerate}</span>
                </button>
            </div>
        </div>
    );
};

export default PasswordDisplay;
