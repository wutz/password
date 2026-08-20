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

/** 强度四档对应的配色，索引与下面的 strength 一致（语义色来自 DESIGN.md） */
const STRENGTH_STYLES = [
  { pip: 'bg-weak', text: 'text-weak-text' },
  { pip: 'bg-fair', text: 'text-fair-text' },
  { pip: 'bg-good', text: 'text-good-text' },
  { pip: 'bg-best', text: 'text-best-text' },
]

/**
 * 按字符类别上色：抄写长密码时区分 0/O、1/l 之外，
 * 也让这块从"一串等宽字"变成有结构的图形。
 * 数字用 link 蓝,符号用暖琥珀 —— 都是内容的功能色,不参与界面装饰。
 */
function charClass(ch: string): string {
  if (ch >= '0' && ch <= '9') return 'text-link'
  if (ch >= 'a' && ch <= 'z') return 'text-body'
  if (ch >= 'A' && ch <= 'Z') return 'text-ink'
  return 'text-symbol'
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
      {/* 语言选择先于标题出现,避免打断居中的视觉动线 */}
      <div className="flex justify-center">
        <div className="relative">
          <select
            aria-label={t.languageLabel}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="appearance-none rounded-md border border-hairline bg-canvas py-1.5 pr-8 pl-3 text-sm text-body transition focus:border-hairline-strong focus:outline-none"
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

      {/* hero:居中栈 —— 大标题 + 一句副题,别的不加。墨黑 600 + 副向紧字距 */}
      <h1 className="mt-5 text-center text-3xl leading-[1.1] font-semibold tracking-[-0.03em] text-ink sm:text-4xl sm:tracking-[-0.04em]">
        {t.heading}
      </h1>
      <p className="mt-2.5 text-center text-sm leading-relaxed text-body sm:text-base">{t.tagline}</p>

      {/* 密码卡:白卡 + 发丝线 + 堆叠阴影,和下方选项卡同一语法 */}
      <section className="mt-8 rounded-xl border border-hairline bg-canvas px-5 py-8 shadow-card sm:px-8">
        <div className="flex min-h-16 items-center justify-center" aria-live="polite">
          {/*
           * 逐字符上色要拆成一串 span,所以这层不能是 flex:flex 行默认 nowrap,
           * 每个字符会变成独立 flex item 排成一行直接溢出,而 break-all 只管
           * 盒内文本、管不到 flex item 之间。用块级 <p> 承载这些 inline span,
           * 长密码才会正常折行。
           */}
          <p className="text-center font-mono text-2xl font-semibold break-all sm:text-[28px]">
            {password ? (
              password
                .split('')
                .map((ch, i) => (
                  <span key={i} className={charClass(ch)}>
                    {ch}
                  </span>
                ))
            ) : hasCharset ? (
              // 服务端不生成密码(随机数只走客户端),水合前先用等长圆点占位
              <span className="text-mute">{'•'.repeat(options.length)}</span>
            ) : (
              <span className="text-sm font-normal text-mute">{t.emptyHint}</span>
            )}
          </p>
        </div>

        {/* 主操作是墨黑胶囊(ink 是唯一的 conversion 色),次操作是发丝线幽灵版;按压统一 scale(0.95) */}
        <div className="mt-7 flex justify-center gap-3">
          <button
            onClick={handleCopy}
            disabled={!password}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-[22px] py-[11px] text-[15px] leading-none font-medium text-white transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? t.copied : t.copy}
          </button>
          <button
            onClick={() => setPassword(generatePassword(options))}
            disabled={!password}
            className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-canvas px-[22px] py-[11px] text-[15px] leading-none font-medium text-ink transition hover:border-hairline-strong active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RefreshIcon />
            {t.regenerate}
          </button>
        </div>

        {/* 强度:四段 pip 比连续进度条更容易一眼读出档位 */}
        <div className="mx-auto mt-7 max-w-[280px]">
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  hasCharset && i <= strength ? style.pip : 'bg-hairline'
                }`}
              />
            ))}
          </div>
          <div className="mt-2.5 flex items-baseline justify-between text-xs">
            <span className={`font-semibold ${hasCharset ? style.text : 'text-mute'}`}>
              {hasCharset ? strengthLabel : '—'}
            </span>
            <span className="text-mute">{t.entropy.replace('{bits}', String(bits))}</span>
          </div>
        </div>
      </section>

      {/* 选项卡:白卡 + 发丝线 + 堆叠阴影,技术数字走 mono */}
      <section className="mt-4 rounded-xl border border-hairline bg-canvas px-6 py-6 shadow-card">
        <div className="flex items-baseline justify-between">
          <label htmlFor="length" className="text-sm font-semibold text-ink">
            {t.length}
          </label>
          <span className="font-mono text-[15px] font-semibold text-ink">{options.length}</span>
        </div>
        <input
          id="length"
          type="range"
          min={4}
          max={64}
          value={options.length}
          onChange={(e) => update('length', Number(e.target.value))}
          className="mt-3 w-full accent-ink"
        />
        <div className="mt-3 flex gap-2">
          {LENGTH_PRESETS.map((n) => (
            <button
              key={n}
              onClick={() => update('length', n)}
              className={`flex-1 rounded-full border py-1.5 font-mono text-xs transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                options.length === n
                  ? 'border-ink font-semibold text-ink'
                  : 'border-hairline text-body hover:border-hairline-strong'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <hr className="my-6 border-hairline" />

        <p className="text-sm font-semibold text-ink">{t.charsets}</p>
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
      className={`flex w-full items-center gap-2.5 rounded-md border px-4 py-2.5 text-left text-sm transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
        checked
          ? 'border-ink text-ink'
          : 'border-hairline text-body hover:border-hairline-strong'
      }`}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition ${
          checked ? 'border-ink bg-ink text-white' : 'border-hairline-strong'
        }`}
      >
        {checked && <TickIcon />}
      </span>
      <span className="min-w-0 flex-1 font-medium">{label}</span>
      {sample && (
        <span className="shrink-0 rounded-full bg-canvas-soft-2 px-2 py-0.5 font-mono text-[11px] text-mute">
          {sample}
        </span>
      )}
    </button>
  )
}

function ChevronIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-mute"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function TickIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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