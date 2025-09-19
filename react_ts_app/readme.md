一套可直接运行的前端项目模板（Vite + React + TypeScript + MUI + express.js），包含：顶部状态栏、左侧可折叠菜单 + 路由切换、右侧内容区、示例列表页和详情页、mock 数据与简单的“增删改查”交互（前端模拟）;后端服务：server.js + db.js，基础的用户表的增删查改；并添加图片文件上传功能，。下面是项目结构、必要文件以及运行说明。`npm run dev`一键启动前端和后端服务


项目结构：
```
my-vite-mui-app/
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ db.js
├─ server.js
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
│  │   |─ ProductDetail.tsx
|  |   |─ UsersPage.tsx
│  └─ mocks/
│      └─ data.ts
└─ README.md
```

新增功能：React Flow 数据流编辑器（轻量实现 + 表格联动），在dataflow1组件。
