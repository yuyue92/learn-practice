**Next.js 学习路线图**
1. 前置基础（打牢地基）
- HTML / CSS / JavaScript 基础：
   - 语义化 HTML、CSS Flex/Grid 布局、响应式设计；
   - ES6+ 特性（解构、Promise、async/await、模块化）
 
- React 基础：
   - 函数组件 & Hooks（useState/useEffect/useContext/useRef）；
   - 组件通信、props、状态管理；
   - React Router（理解路由的基本概念，Next.js 有内置的路由系统）；
   - React 性能优化（memo、useMemo、useCallback）

2. Next.js 入门核心
- 了解 Next.js 的特点：SSR（服务端渲染）、SSG（静态生成）、ISR（增量静态生成）：
- 项目基础：
   - 创建项目：npx create-next-app@latest；
   - 文件结构约定（app 目录 vs pages 目录）；
   - 内置路由（基于文件系统）；
   - 页面 & 布局（layout.tsx、page.tsx）；
 
- 渲染模式：
   - SSR（Server-Side Rendering）；
   - SSG（Static Site Generation）；
   - ISR（Incremental Static Regeneration）；
   - CSR（Client-Side Rendering）；
 
- 数据获取：
   - getStaticProps / getServerSideProps（pages 目录）；
   - fetch / React Server Components（app 目录）；
   - 静态资源 & 图片优化（next/image）；
 
- 样式：
   - 内置支持 CSS / Sass；
   - CSS Modules；
   - Tailwind CSS（推荐）；
   - styled-components / emotion；

3. 进阶功能
- API 路由：在 pages/api 或 app/api 中创建 API、与前端交互（fetch / axios）；
- 中间件：middleware.ts 用于鉴权、重定向、日志等；
- 路由进阶：
   - 动态路由（[id].tsx）；
   - Catch-all 路由（[...slug].tsx）；
   - 路由组 & 并行/嵌套路由（app 目录）；
 
- 状态管理：
   - 内置 Context；
   - Redux Toolkit / Zustand / Jotai；
   - React Query / SWR（数据缓存）；
 
- 认证与安全：
   - NextAuth.js（用户登录认证）；
   - JWT 鉴权；
   - CSRF / CORS 防护；





