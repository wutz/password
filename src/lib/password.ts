export interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeAmbiguous: boolean
}

export const DEFAULT_OPTIONS: PasswordOptions = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: false,
  excludeAmbiguous: true,
}

/** 生成时排除的易混淆字符：肉眼难以区分的字母与数字 */
const AMBIGUOUS = new Set('il1o0ILO'.split(''))

export function charsetFor(options: PasswordOptions): string {
  let charset = ''
  if (options.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (options.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
  if (options.includeNumbers) charset += '0123456789'
  if (options.includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-='

  if (options.excludeAmbiguous) {
    charset = charset
      .split('')
      .filter((ch) => !AMBIGUOUS.has(ch))
      .join('')
  }
  return charset
}

/** 用 Web Crypto 生成随机密码；字符集为空（全部选项关掉）时返回空串 */
export function generatePassword(options: PasswordOptions): string {
  const charset = charsetFor(options)
  if (charset === '') return ''

  const random = new Uint32Array(options.length)
  crypto.getRandomValues(random)

  let password = ''
  for (let i = 0; i < options.length; i++) {
    password += charset[random[i]! % charset.length]
  }
  return password
}

/** 熵位数 = 长度 × log2(字符集大小)，粗略但足够给强度分层 */
export function entropyBits(options: PasswordOptions): number {
  const size = charsetFor(options).length
  if (size === 0) return 0
  return Math.round(options.length * Math.log2(size))
}
