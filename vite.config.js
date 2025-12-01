import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        // 启用代码分割
        rollupOptions: {
            output: {
                manualChunks: {
                    // 将 React 相关库单独打包
                    'react-vendor': ['react', 'react-dom'],
                    // 将 lucide-react 单独打包（图标库较大）
                    'lucide-icons': ['lucide-react'],
                },
            },
        },
        // 启用压缩
        minify: 'esbuild',
        // 启用 CSS 代码分割
        cssCodeSplit: true,
        // 优化 chunk 大小警告阈值
        chunkSizeWarningLimit: 1000,
    },
    // 优化依赖预构建
    optimizeDeps: {
        include: ['react', 'react-dom'],
    },
})
