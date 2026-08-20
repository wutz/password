import { HeadContent, Link, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'

const DESCRIPTION =
  '在浏览器本地生成高强度随机密码：自定义长度（4–64）与大小写字母、数字、特殊字符组合，可排除易混淆字符，支持中 / 英 / 日 / 德 / 法五种界面语言。随机数来自 Web Crypto，全程不出本机。'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { title: 'Password — 安全密码生成器' },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: 'Password — 安全密码生成器' },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://password.wutz.dev/' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' },
      { rel: 'canonical', href: 'https://password.wutz.dev/' },
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
      <body className="flex min-h-screen flex-col bg-canvas-soft font-sans text-ink antialiased">
        {/* 全局导航:磨砂白 64px + 发丝线,滚动时透出底下的近白画布(DESIGN.md nav-bar) */}
        <header className="sticky top-0 z-20 border-b border-hairline bg-canvas/80 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
            <Link to="/" className="flex min-w-0 items-center gap-2.5">
              <img src="/logo.svg" alt="" width={28} height={28} className="h-7 w-7 shrink-0" />
              <span className="text-sm font-semibold tracking-tight text-ink">Password</span>
            </Link>
            <a
              href="https://wutz.dev/"
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-md px-2.5 py-1.5 text-sm text-body transition hover:bg-canvas-soft-2 hover:text-ink"
            >
              wutz.dev ↗
            </a>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-14 sm:py-20">
          <Outlet />
        </main>

        {/* 页脚:白底 + 发丝线与正文分界,回到近白画布之上的更亮一层(DESIGN.md footer) */}
        <footer className="border-t border-hairline bg-canvas">
          <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-mute sm:px-6">
            <p>
              Password · 安全密码生成器。密码由浏览器内的 Web Crypto
              随机生成,全程不出本机、不经过任何服务器。
            </p>
            <p className="mt-1">
              语言偏好保存在本地浏览器,换设备不同步。源码在{' '}
              <a
                href="https://github.com/wutz/password"
                target="_blank"
                rel="noreferrer"
                className="text-body underline underline-offset-2 transition hover:text-link"
              >
                GitHub
              </a>
              。
            </p>
          </div>
        </footer>

        <Scripts />
      </body>
    </html>
  )
}