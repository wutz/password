import { HeadContent, Link, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { title: 'Password — 安全密码生成器' },
      {
        name: 'description',
        content:
          '在浏览器本地生成高强度随机密码：自定义长度与大小写字母、数字、特殊字符组合，可排除易混淆字符，支持中 / 英 / 日 / 德 / 法多语言。',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' },
    ],
  }),
  component: RootLayout,
})

function RootLayout() {
  return (
    <html lang="zh-CN">
      <head>
        <HeadContent />
      </head>
      {/* flex 列 + main flex-1:内容不足一屏时把页脚压到视口底部 */}
      <body className="flex min-h-screen flex-col bg-parchment font-sans text-gray-900 antialiased">
        {/* 全局导航:纯黑 44px,全站唯一出现纯黑的地方 */}
        <header className="sticky top-0 z-20 bg-gray-900">
          <div className="mx-auto flex h-11 max-w-6xl items-center justify-between gap-2 px-4">
            <Link to="/" className="flex shrink-0 items-center gap-2">
              <img src="/logo.svg" alt="" width={18} height={18} className="h-[18px] w-[18px]" />
              <span className="text-xs font-semibold tracking-tight text-white">Password</span>
            </Link>
            <a
              href="https://wutz.dev/"
              target="_blank"
              rel="noreferrer"
              className="rounded-sm px-1.5 py-1 text-xs text-white/80 transition hover:text-white"
            >
              wutz.dev ↗
            </a>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-14 sm:py-20">
          <Outlet />
        </main>

        {/* 页脚:回到米白画布,只以发丝线与正文分界 */}
        <footer className="border-t border-gray-200">
          <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-gray-500">
            <p>
              Password · 安全密码生成器。密码由浏览器内的 Web Crypto
              随机生成,全程不出本机、不经过任何服务器。
            </p>
            <p className="mt-1">语言偏好保存在本地浏览器,换设备不同步。</p>
          </div>
        </footer>

        <Scripts />
      </body>
    </html>
  )
}
