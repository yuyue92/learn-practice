next.js + typescript + tailwindCSS

运行：`npm install`

**页面与功能**
- 顶部 Topbar（含搜索框、状态、头像占位）
- 左侧 Sidebar（可在移动端通过按钮折叠/展开；当前路由高亮）
- 右侧内容区（/、/dashboard、/users、/settings 示例页）
- Tailwind 已配置完成（无 npx tailwind，用 tailwind.config.ts + postcss.config.cjs + app/globals.css）
- TypeScript 严格模式、路径别名（@/components/*, @/lib/*）

**常见拓展点（按需修改）**
- 主题色：在 tailwind.config.ts 的 colors.brand 自定义品牌色。
- 菜单：在 components/Sidebar.tsx 的 links 数组增删菜单项即可。
- 页面：在 app/ 目录新增文件夹 + page.tsx 即可添加新路由。
- 布局：全局布局在 app/layout.tsx，若需要二级布局可在对应路由目录再加 layout.tsx。
