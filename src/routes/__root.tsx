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
      <body className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/85 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3">
            <Link to="/" className="flex shrink-0 items-center gap-2">
              <img src="/logo.svg" alt="" width={28} height={28} className="h-7 w-7 shrink-0" />
              <span className="text-base font-bold tracking-tight">Password</span>
              <span className="hidden text-xs text-gray-400 sm:inline">安全密码生成器</span>
            </Link>
            <nav className="-mr-1 flex items-center gap-0.5 overflow-x-auto text-sm [scrollbar-width:none] sm:gap-1 [&::-webkit-scrollbar]:hidden">
              <Link
                to="/"
                activeOptions={{ exact: true }}
                activeProps={{ className: 'bg-gray-100 text-gray-900' }}
                className="shrink-0 rounded-lg px-2.5 py-1.5 text-gray-600 transition hover:bg-gray-100 sm:px-3"
              >
                生成器
              </Link>
              <a
                href="https://wutz.dev/"
                target="_blank"
                rel="noreferrer"
                className="shrink-0 rounded-lg px-2.5 py-1.5 text-gray-600 transition hover:bg-gray-100 sm:px-3"
              >
                wutz.dev ↗
              </a>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
          <Outlet />
        </main>

        <footer className="mt-12 border-t border-gray-200 bg-white sm:mt-16">
          <div className="mx-auto max-w-6xl px-3 py-6 text-xs text-gray-400 sm:px-4">
            <p>
              Password · 安全密码生成器。密码由浏览器内的 Web Crypto
              随机生成，全程不出本机、不经过任何服务器。
            </p>
            <p className="mt-1">语言偏好保存在本地浏览器，换设备不同步。</p>
          </div>
        </footer>

        <Scripts />
      </body>
    </html>
  )
}
