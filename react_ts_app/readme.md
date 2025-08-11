一套可直接运行的前端项目模板（Vite + React + TypeScript + MUI），包含：顶部状态栏、左侧可折叠菜单 + 路由切换、右侧内容区、示例列表页和详情页、mock 数据与简单的“增删改查”交互（前端模拟）。下面是项目结构、必要文件以及运行说明。


项目结构：
```
my-vite-mui-app/
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ routes.tsx
│  ├─ theme.ts
│  ├─ components/
│  │   ├─ TopBar.tsx
│  │   ├─ SideNav.tsx
│  │   └─ Layout.tsx
│  ├─ pages/
│  │   ├─ Dashboard.tsx
│  │   ├─ UsersList.tsx
│  │   ├─ UserDetail.tsx
│  │   ├─ ProductsList.tsx
│  │   └─ ProductDetail.tsx
│  └─ mocks/
│      └─ data.ts
└─ README.md
```
