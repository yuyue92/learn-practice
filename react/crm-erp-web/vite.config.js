import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // 启用 React 快速刷新
      fastRefresh: true,
    }),
  ],
  
  // 路径别名配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@api': path.resolve(__dirname, './src/api'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@config': path.resolve(__dirname, './src/config'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },

  // 开发服务器配置
  server: {
    port: 5173,
    host: true, // 允许局域网访问
    open: true, // 自动打开浏览器
    cors: true, // 允许跨域
    
    // 代理配置 (开发环境接口代理)
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  // 构建配置
  build: {
    // 输出目录
    outDir: 'dist',
    
    // 静态资源目录
    assetsDir: 'assets',
    
    // 启用/禁用 CSS 代码拆分
    cssCodeSplit: true,
    
    // 构建后是否生成 source map 文件
    sourcemap: false,
    
    // chunk 大小警告的限制 (单位: KB)
    chunkSizeWarningLimit: 1000,
    
    // 自定义底层的 Rollup 打包配置
    rollupOptions: {
      output: {
        // 静态资源分类打包
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          let extType = info[info.length - 1];
          
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
            extType = 'images';
          } else if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            extType = 'fonts';
          }
          
          return `${extType}/[name]-[hash].[ext]`;
        },
        
        // 分包策略
        manualChunks: (id) => {
          // node_modules 依赖分包
          if (id.includes('node_modules')) {
            // React 相关库单独打包
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            
            // 状态管理库单独打包
            if (id.includes('zustand') || id.includes('@tanstack/react-query')) {
              return 'state-vendor';
            }
            
            // 表单相关库单独打包
            if (id.includes('react-hook-form') || id.includes('zod')) {
              return 'form-vendor';
            }
            
            // 图表库单独打包
            if (id.includes('recharts')) {
              return 'chart-vendor';
            }
            
            // 其他第三方库打包到 vendor
            return 'vendor';
          }
        },
      },
    },
    
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        // 生产环境移除 console
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  // 优化配置
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      '@tanstack/react-query',
      'axios',
      'date-fns',
      'lodash-es',
    ],
  },
});
