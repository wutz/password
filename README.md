# Password — 安全密码生成器

<https://password.wutz.dev/>

在浏览器本地生成高强度随机密码。密码由 Web Crypto 随机生成，全程不出本机、不经过任何服务器。

## 功能

- **安全生成**：`crypto.getRandomValues` 提供密码学安全的随机数。
- **可定制**：长度 4–64；大小写字母、数字、特殊字符自由组合；可排除易混淆字符（i / l / 1 / o / 0 等）。
- **强度参考**：按字符集与长度估算熵位数，分档展示强度。
- **多语言**：中文 / English / 日本語 / Deutsch / Français，偏好保存在本地浏览器。

## 技术栈

与 [kubepath](https://github.com/wutz/kubepath) 同一套：

- React 19 + TanStack Start / Router（SSR）
- Tailwind CSS 4（`@tailwindcss/vite`）
- TypeScript
- `@cloudflare/vite-plugin` + Workers（`wrangler deploy`）

## 开发

```bash
bun install
bun run dev        # http://localhost:3004
bun run typecheck
bun run build
```

## 部署

```bash
bun run deploy     # vite build && wrangler deploy
```

Workers 自定义域名 `password.wutz.dev`，见 `wrangler.toml`。

## License

MIT
