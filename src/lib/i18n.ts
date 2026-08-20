export type LanguageCode = 'en' | 'zh' | 'ja' | 'de' | 'fr'

export const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
]

type Strength = 'weak' | 'fair' | 'strong' | 'veryStrong'

interface Strings {
  heading: string
  tagline: string
  languageLabel: string
  copy: string
  copied: string
  regenerate: string
  length: string
  charsets: string
  uppercase: string
  lowercase: string
  numbers: string
  symbols: string
  excludeAmbiguous: string
  emptyHint: string
  entropy: string
  strength: Record<Strength, string>
}

export const translations: Record<LanguageCode, Strings> = {
  zh: {
    heading: '密码生成器',
    tagline: '在本机浏览器内生成，不经过任何服务器',
    languageLabel: '界面语言',
    copy: '复制',
    copied: '已复制',
    regenerate: '重新生成',
    length: '长度',
    charsets: '包含字符',
    uppercase: '大写字母',
    lowercase: '小写字母',
    numbers: '数字',
    symbols: '特殊字符',
    excludeAmbiguous: '排除易混淆字符 (i, l, 1, o, 0)',
    emptyHint: '至少勾选一种字符集',
    entropy: '约 {bits} 位熵',
    strength: { weak: '弱', fair: '中', strong: '强', veryStrong: '极强' },
  },
  en: {
    heading: 'Password generator',
    tagline: 'Generated inside your browser — never sent to a server',
    languageLabel: 'Interface language',
    copy: 'Copy',
    copied: 'Copied',
    regenerate: 'Regenerate',
    length: 'Length',
    charsets: 'Include characters',
    uppercase: 'Uppercase',
    lowercase: 'Lowercase',
    numbers: 'Numbers',
    symbols: 'Symbols',
    excludeAmbiguous: 'Exclude ambiguous characters (i, l, 1, o, 0)',
    emptyHint: 'Select at least one character set',
    entropy: '≈ {bits} bits of entropy',
    strength: { weak: 'Weak', fair: 'Fair', strong: 'Strong', veryStrong: 'Very strong' },
  },
  ja: {
    heading: 'パスワード生成',
    tagline: 'ブラウザー内で生成され、サーバーには送信されません',
    languageLabel: '表示言語',
    copy: 'コピー',
    copied: 'コピーしました',
    regenerate: '再生成',
    length: '長さ',
    charsets: '使用する文字',
    uppercase: '大文字',
    lowercase: '小文字',
    numbers: '数字',
    symbols: '記号',
    excludeAmbiguous: '紛らわしい文字を除外 (i, l, 1, o, 0)',
    emptyHint: '少なくとも 1 種類の文字セットを選択してください',
    entropy: '約 {bits} ビットのエントロピー',
    strength: { weak: '弱い', fair: '普通', strong: '強い', veryStrong: '非常に強い' },
  },
  de: {
    heading: 'Passwort-Generator',
    tagline: 'Wird im Browser erzeugt und nie an einen Server gesendet',
    languageLabel: 'Anzeigesprache',
    copy: 'Kopieren',
    copied: 'Kopiert',
    regenerate: 'Neu generieren',
    length: 'Länge',
    charsets: 'Enthaltene Zeichen',
    uppercase: 'Großbuchstaben',
    lowercase: 'Kleinbuchstaben',
    numbers: 'Ziffern',
    symbols: 'Sonderzeichen',
    excludeAmbiguous: 'Mehrdeutige Zeichen ausschließen (i, l, 1, o, 0)',
    emptyHint: 'Mindestens einen Zeichensatz auswählen',
    entropy: '≈ {bits} Bit Entropie',
    strength: { weak: 'Schwach', fair: 'Mittel', strong: 'Stark', veryStrong: 'Sehr stark' },
  },
  fr: {
    heading: 'Générateur de mots de passe',
    tagline: 'Généré dans votre navigateur, jamais envoyé à un serveur',
    languageLabel: 'Langue de l’interface',
    copy: 'Copier',
    copied: 'Copié',
    regenerate: 'Régénérer',
    length: 'Longueur',
    charsets: 'Caractères inclus',
    uppercase: 'Majuscules',
    lowercase: 'Minuscules',
    numbers: 'Chiffres',
    symbols: 'Symboles',
    excludeAmbiguous: 'Exclure les caractères ambigus (i, l, 1, o, 0)',
    emptyHint: 'Sélectionnez au moins un jeu de caractères',
    entropy: '≈ {bits} bits d’entropie',
    strength: { weak: 'Faible', fair: 'Moyen', strong: 'Fort', veryStrong: 'Très fort' },
  },
}

export function isLanguageCode(value: string | null): value is LanguageCode {
  return value !== null && value in translations
}

/** 浏览器语言 → 支持的语言代码，都不命中则回落中文 */
export function detectBrowserLanguage(): LanguageCode {
  const supported = LANGUAGES.map((entry) => entry.code)
  const candidates = typeof navigator !== 'undefined' ? navigator.languages ?? [navigator.language] : []
  for (const lang of candidates) {
    const code = lang.split('-')[0]!.toLowerCase()
    if ((supported as string[]).includes(code)) return code as LanguageCode
  }
  return 'zh'
}
