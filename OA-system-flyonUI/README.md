# 云枢 OA · Vue 3 + FlyonUI 企业协同办公系统骨架

一个基于 **Vue 3 + Vite + Vue Router + Tailwind CSS v4 + FlyonUI** 搭建的 OA 系统前端骨架，
内置详细的多级菜单（10 大模块、40+ 页面）与可直接查看效果的演示页面，用于快速启动一个企业内部办公系统项目。

## 技术栈

- **Vue 3**（`<script setup>` 组合式 API）
- **Vite 7**
- **Vue Router 4**（Hash 模式，纯前端静态部署友好）
- **Tailwind CSS v4** + **FlyonUI 2.4.1**（通过官方支持的 `@tailwindcss/vite` 插件 + `@plugin "flyonui"` 方式接入，
  而非不受官方支持的 CDN 方式，保证组件样式与交互完全可用）

## 快速开始

> 需要 Node.js 18.19+ / 20+（Vite 7 与 Tailwind v4 的最低要求）。

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（默认 http://localhost:5173）
npm run dev
```

打开浏览器访问终端提示的地址即可看到登录页 → 点击"登录"按钮进入工作台（演示环境未做真实鉴权）。

### 生产构建

```bash
npm run build      # 产物输出到 dist/
npm run preview    # 本地静态服务器预览构建产物，默认 http://localhost:4173
```

> ⚠️ **不要直接双击 `dist/index.html` 用浏览器打开**。现代浏览器出于安全策略，
> 会阻止以 `file://` 协议直接加载 ES Module 脚本（CORS 限制），必须通过 `npm run preview`
> 或任意静态服务器（如 `npx serve dist`）访问，否则页面会是空白。

## 目录结构

```
src/
├─ layouts/
│  └─ MainLayout.vue      # 主布局：侧边栏 + 顶部导航 + 内容区
├─ components/
│  ├─ SidebarMenu.vue      # 两级可折叠侧边栏菜单
│  └─ MenuIcon.vue         # 菜单图标集合（内联 SVG）
├─ views/                  # 所有页面，按模块分目录
│  ├─ Dashboard.vue        # 工作台
│  ├─ Login.vue            # 登录页
│  ├─ NotFound.vue         # 404
│  ├─ GenericListPage.vue  # 通用列表页（供多数"列表类"菜单复用）
│  ├─ todo/                # 我的待办
│  ├─ approval/            # 审批中心
│  ├─ admin/               # 行政办公
│  ├─ hr/                  # 人事管理
│  ├─ project/             # 项目管理
│  ├─ report/              # 统计报表
│  ├─ system/              # 系统设置
│  └─ profile/             # 个人中心
├─ mock/genericData.js     # 通用列表页的模拟数据
├─ menu.js                 # 菜单配置（侧边栏与"菜单管理"页共用同一份数据）
├─ router/index.js         # 路由表
└─ style.css               # 全局样式 + FlyonUI 引入 + 主题色变量
```

## 菜单 / 页面清单

| 模块 | 子页面 |
| --- | --- |
| 工作台 | 数据总览、快捷入口、待办与公告预览、简易图表 |
| 我的待办 | 待我审批 / 待我处理 / 我发起的 / 抄送我的（同一组件按 Tab 切换） |
| 审批中心 | 请假申请（含完整表单+审批时间线+历史记录）、出差 / 加班 / 报销 / 用印 / 采购申请、审批流程设置 |
| 行政办公 | 通知公告（列表+详情）、会议管理、**会议室预订**（可视化时段网格）、车辆管理、固定资产、办公用品 |
| 人事管理 | **组织架构**（可视化树形图）、**员工档案**（卡片式列表）、**考勤管理**（日历+团队汇总）、招聘 / 培训 / 薪资管理 |
| 财务管理 | 报销单据、发票管理、预算管理、合同管理 |
| 知识库 | 文档中心、制度规范 |
| 项目管理 | 项目列表、**任务看板**（看板风格 UI） |
| 统计报表 | **审批效率统计**（趋势图+排行榜）、考勤统计 |
| 系统设置 | **用户管理**、**角色权限**（权限矩阵勾选）、**菜单管理**（读取真实菜单配置渲染）、部门管理、系统日志 |
| 个人中心 | 个人信息、消息通知、修改密码 |

标粗页面为专门设计的定制页面，其余列表类页面统一使用 `GenericListPage.vue` 组件驱动，
数据来自 `src/mock/genericData.js`，可直接在该文件中增删字段或替换为真实接口数据。

## 主题与深色模式

- 顶部导航右侧的开关可一键切换亮 / 暗主题（基于 FlyonUI 的 `theme-controller` 机制）。
- 主题色 token 定义在 `src/style.css` 的 `:root` / `[data-theme="dark"]` 中，可直接修改 `--color-primary` 等变量自定义品牌色。

## 接入真实后端

当前所有数据均为前端模拟数据（`src/mock/`），便于查看页面效果。接入真实系统时建议：

1. 新增 `src/api/` 目录，封装 axios / fetch 请求；
2. 将各页面中的本地数组替换为接口返回数据；
3. 在 `router/index.js` 中按需添加路由守卫做登录态校验与权限控制。

## 关于 FlyonUI 的接入方式

FlyonUI 官方**不提供 CDN 使用方式**（其组件样式依赖构建时按需生成）。本项目严格按照官方推荐的
构建方式接入：`@tailwindcss/vite` 插件 + `src/style.css` 中的 `@plugin "flyonui"` 指令，
Tailwind v4 会在构建时扫描所有 `.vue` 文件实际用到的类名并生成对应样式，因此可以放心增删页面中的 FlyonUI 类名。
