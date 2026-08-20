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

/** 长度快捷档：从"网站够用"到"长期密钥"的几个常见取值 */
const LENGTH_PRESETS = [12, 16, 24, 32]

type CharsetKey = 'includeUppercase' | 'includeLowercase' | 'includeNumbers' | 'includeSymbols'
type CharsetLabel = 'uppercase' | 'lowercase' | 'numbers' | 'symbols'

/** sample 是字符本身，跨语言相同，所以不进 i18n */
const CHARSETS: { key: CharsetKey; label: CharsetLabel; sample: string }[] = [
  { key: 'includeUppercase', label: 'uppercase', sample: 'A-Z' },
  { key: 'includeLowercase', label: 'lowercase', sample: 'a-z' },
  { key: 'includeNumbers', label: 'numbers', sample: '0-9' },
  { key: 'includeSymbols', label: 'symbols', sample: '!@#' },
]

/** 强度四档对应的配色，索引与下面的 strength 一致 */
const STRENGTH_STYLES = [
  { pip: 'bg-rose-500', text: 'text-rose-600' },
  { pip: 'bg-amber-500', text: 'text-amber-600' },
  { pip: 'bg-brand-500', text: 'text-brand-600' },
  { pip: 'bg-emerald-500', text: 'text-emerald-600' },
]

/**
 * 按字符类别上色：抄写长密码时区分 0/O、1/l 之外，
 * 也让这块从"一串等宽字"变成有结构的图形。
 * 取值按深色面板校准，浅色版的 gray-900 / brand-600 在这上面不可读。
 */
function charClass(ch: string): string {
  if (ch >= '0' && ch <= '9') return 'text-sky-300'
  if (ch >= 'a' && ch <= 'z') return 'text-gray-400'
  if (ch >= 'A' && ch <= 'Z') return 'text-gray-100'
  return 'text-violet-300'
}

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

  // 复制提示两秒后自愈；卸载时清掉定时器，别在没挂载的组件上 setState
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const bits = useMemo(() => entropyBits(options), [options])
  const hasCharset = charsetFor(options) !== ''
  const strength = bits < 40 ? 0 : bits < 60 ? 1 : bits < 80 ? 2 : 3
  const strengthLabel = [t.strength.weak, t.strength.fair, t.strength.strong, t.strength.veryStrong][
    strength
  ]
  const style = STRENGTH_STYLES[strength]!

  const update = <K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) => {
    setOptions((prev) => ({ ...prev, [key]: value }))
  }

  const handleCopy = async () => {
    if (!password) return
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
    } catch {
      // 剪贴板权限被拒时静默失败，按钮状态不变
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{t.heading}</h1>
          <p className="mt-1 text-sm text-gray-500">{t.tagline}</p>
        </div>
        <div className="relative shrink-0">
          <select
            aria-label={t.languageLabel}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="appearance-none rounded-xl border border-gray-200 bg-white py-1.5 pr-8 pl-3 text-xs font-medium text-gray-700 transition hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:outline-none"
          >
            {LANGUAGES.map(({ code, label }) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
          <ChevronIcon />
        </div>
      </div>

      {/* 密码卡：外层品牌色托底，内层白卡承载密码本身 */}
      <section className="mt-5 rounded-3xl border border-brand-200 bg-brand-50/50 p-1.5 shadow-sm">
        <div className="rounded-2xl bg-slate-900 px-4 py-5 sm:px-6">
          <div className="flex min-h-16 items-center justify-center" aria-live="polite">
            {/*
             * 逐字符上色要拆成一串 span，所以这层不能是 flex：flex 行默认 nowrap，
             * 每个字符会变成独立 flex item 排成一行直接溢出，而 break-all 只管
             * 盒内文本、管不到 flex item 之间。用块级 <p> 承载这些 inline span，
             * 长密码才会正常折行。
             */}
            <p className="text-center font-mono text-2xl font-bold break-all sm:text-3xl">
              {password ? (
                password
                  .split('')
                  .map((ch, i) => (
                    <span key={i} className={charClass(ch)}>
                      {ch}
                    </span>
                  ))
              ) : hasCharset ? (
                // 服务端不生成密码（随机数只走客户端），水合前先用等长圆点占位
                <span className="text-gray-600">{'•'.repeat(options.length)}</span>
              ) : (
                <span className="text-sm font-normal text-gray-400">{t.emptyHint}</span>
              )}
            </p>
          </div>

          <div className="mt-5 flex justify-center gap-2.5">
            <button
              onClick={handleCopy}
              disabled={!password}
              // 深色面板上 hover 要往亮走，往暗走会像被禁用
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? t.copied : t.copy}
            </button>
            <button
              onClick={() => setPassword(generatePassword(options))}
              disabled={!password}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RefreshIcon />
              {t.regenerate}
            </button>
          </div>
        </div>

        {/* 强度：四段 pip 比连续进度条更容易一眼读出档位 */}
        <div className="px-4 pt-2.5 pb-2 sm:px-5">
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  hasCharset && i <= strength ? style.pip : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="mt-2 flex items-baseline justify-between text-xs">
            <span className={`font-semibold ${hasCharset ? style.text : 'text-gray-400'}`}>
              {hasCharset ? strengthLabel : '—'}
            </span>
            <span className="text-gray-400">{t.entropy.replace('{bits}', String(bits))}</span>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-3xl border border-gray-200 bg-white px-5 py-5 shadow-sm sm:px-6">
        <div className="flex items-baseline justify-between">
          <label htmlFor="length" className="text-sm font-semibold text-gray-900">
            {t.length}
          </label>
          <span className="font-mono text-base font-bold text-brand-600">{options.length}</span>
        </div>
        <input
          id="length"
          type="range"
          min={4}
          max={64}
          value={options.length}
          onChange={(e) => update('length', Number(e.target.value))}
          className="mt-2.5 w-full accent-brand-600"
        />
        <div className="mt-2.5 flex gap-1.5">
          {LENGTH_PRESETS.map((n) => (
            <button
              key={n}
              onClick={() => update('length', n)}
              className={`flex-1 rounded-lg border py-1.5 font-mono text-xs transition ${
                options.length === n
                  ? 'border-brand-500 bg-brand-50 font-bold text-brand-700'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <hr className="my-5 border-gray-100" />

        <p className="text-sm font-semibold text-gray-900">{t.charsets}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {CHARSETS.map(({ key, label, sample }) => (
            <Toggle
              key={key}
              label={t[label]}
              sample={sample}
              checked={options[key]}
              onChange={(v) => update(key, v)}
            />
          ))}
        </div>
        <div className="mt-2">
          <Toggle
            label={t.excludeAmbiguous}
            checked={options.excludeAmbiguous}
            onChange={(v) => update('excludeAmbiguous', v)}
          />
        </div>
      </section>
    </div>
  )
}

function Toggle({
  label,
  sample,
  checked,
  onChange,
}: {
  label: string
  sample?: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:outline-none ${
        checked
          ? 'border-brand-500 bg-brand-50/70 text-gray-900'
          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition ${
          checked ? 'border-brand-600 bg-brand-600 text-white' : 'border-gray-300 bg-white'
        }`}
      >
        {checked && <TickIcon />}
      </span>
      <span className="min-w-0 flex-1 font-medium">{label}</span>
      {sample && (
        <span className="shrink-0 rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-500">
          {sample}
        </span>
      )}
    </button>
  )
}

function ChevronIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-gray-400"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function TickIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
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
