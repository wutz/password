import { useEffect, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import {
  DEFAULT_OPTIONS,
  charsetFor,
  entropyBits,
  generatePassword,
  type PasswordOptions,
} from '#/lib/password'
import { LANGUAGES, detectBrowserLanguage, isLanguageCode, translations } from '#/lib/i18n'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  // SSR 与首次客户端渲染都用中文，挂载后再切换到访客语言，避免水合错位
  const [language, setLanguage] = useState('zh')
  const [options, setOptions] = useState<PasswordOptions>(DEFAULT_OPTIONS)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)

  const t = translations[isLanguageCode(language) ? language : 'zh']

  useEffect(() => {
    try {
      const saved = localStorage.getItem('language')
      setLanguage(isLanguageCode(saved) ? saved : detectBrowserLanguage())
    } catch {
      setLanguage(detectBrowserLanguage())
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('language', language)
    } catch {
      // localStorage 可能不可用（隐私模式等）
    }
  }, [language])

  useEffect(() => {
    setPassword(generatePassword(options))
  }, [options])

  const bits = useMemo(() => entropyBits(options), [options])
  const strength = bits < 40 ? 0 : bits < 60 ? 1 : bits < 80 ? 2 : 3
  const strengthLabel = [t.strength.weak, t.strength.fair, t.strength.strong, t.strength.veryStrong][strength]
  const strengthColor = ['bg-red-400', 'bg-amber-400', 'bg-brand-500', 'bg-emerald-500'][strength]

  const update = <K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) => {
    setOptions((prev) => ({ ...prev, [key]: value }))
  }

  const handleCopy = async () => {
    if (!password) return
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 剪贴板权限被拒时静默失败，按钮状态不变
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <section className="rounded-2xl border border-brand-200 bg-brand-50/60 px-5 py-5 sm:px-6">
        {/* 密码展示 */}
        <div className="rounded-xl bg-white px-4 py-4">
          <div
            className="flex min-h-16 items-center justify-center text-center font-mono text-2xl font-bold break-all text-gray-900 sm:text-3xl"
            aria-live="polite"
          >
            {password ||
              (charsetFor(options) ? (
                // 服务端不生成密码（随机数只走客户端），水合前先用等长圆点占位
                <span className="text-gray-300">{'•'.repeat(options.length)}</span>
              ) : (
                <span className="text-sm font-normal text-gray-400">{t.emptyHint}</span>
              ))}
          </div>
          <div className="mt-4 flex justify-center gap-2.5">
            <button
              onClick={handleCopy}
              disabled={!password}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? t.copied : t.copy}
            </button>
            <button
              onClick={() => setPassword(generatePassword(options))}
              disabled={!password}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RefreshIcon />
              {t.regenerate}
            </button>
          </div>
        </div>

        {/* 强度条 */}
        <div className="mt-3 rounded-xl bg-white/70 px-4 py-3">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-medium text-gray-700">{strengthLabel}</span>
            <span className="text-gray-500">{t.entropy.replace('{bits}', String(bits))}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all ${strengthColor}`}
              style={{ width: `${Math.min(100, (bits / 128) * 100)}%` }}
            />
          </div>
        </div>
      </section>

      {/* 生成选项 */}
      <section className="rounded-2xl border border-gray-200 bg-white px-5 py-5 sm:px-6">
        <div className="flex items-baseline justify-between">
          <label htmlFor="length" className="text-sm font-semibold text-gray-900">
            {t.length}
          </label>
          <span className="font-mono text-sm font-bold text-brand-600">{options.length}</span>
        </div>
        <input
          id="length"
          type="range"
          min={4}
          max={64}
          value={options.length}
          onChange={(e) => update('length', Number(e.target.value))}
          className="mt-2 w-full accent-brand-600"
        />
        <div className="mt-0.5 flex justify-between text-[10px] text-gray-400">
          <span>4</span>
          <span>64</span>
        </div>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          <Check
            label={t.uppercase}
            checked={options.includeUppercase}
            onChange={(v) => update('includeUppercase', v)}
          />
          <Check
            label={t.lowercase}
            checked={options.includeLowercase}
            onChange={(v) => update('includeLowercase', v)}
          />
          <Check
            label={t.numbers}
            checked={options.includeNumbers}
            onChange={(v) => update('includeNumbers', v)}
          />
          <Check
            label={t.symbols}
            checked={options.includeSymbols}
            onChange={(v) => update('includeSymbols', v)}
          />
          <div className="sm:col-span-2">
            <Check
              label={t.excludeAmbiguous}
              checked={options.excludeAmbiguous}
              onChange={(v) => update('excludeAmbiguous', v)}
            />
          </div>
        </div>
      </section>

      {/* 语言 */}
      <section className="rounded-2xl border border-gray-200 bg-white px-5 py-4 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(({ code, label }) => {
            const active = code === language
            return (
              <button
                key={code}
                onClick={() => setLanguage(code)}
                className={`rounded-xl border px-3 py-1.5 text-xs transition ${
                  active
                    ? 'border-brand-500 bg-brand-50 font-semibold text-brand-700'
                    : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1 text-sm text-gray-700 select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-brand-600"
      />
      {label}
    </label>
  )
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12a9 9 0 1 1-2.64-6.36L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  )
}
