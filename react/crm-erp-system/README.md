# 企业级CRM/ERP Web前端应用系统

基于 React 18 + Tailwind CSS v3 构建的企业级客户关系管理与企业资源规划前端系统。

## 🚀 技术栈

- **核心框架**: React 18.x (函数组件 + Hooks)
- **样式框架**: Tailwind CSS v3 (JIT模式)
- **路由管理**: React Router v6
- **状态管理**: Zustand + React Query
- **表单处理**: React Hook Form + Zod
- **数据可视化**: Recharts
- **构建工具**: Vite 5.x
- **HTTP请求**: Axios

## 📁 项目结构

```
src/
├── api/                # API接口封装
├── assets/             # 静态资源
├── components/         # 组件目录
│   ├── common/         # 通用组件（Button, Input, Table等）
│   ├── layout/         # 布局组件（Sidebar, Header等）
│   ├── form/           # 表单组件
│   └── chart/          # 图表组件
├── config/             # 应用配置
├── constants/          # 常量定义
│   ├── permissions.js  # 角色权限配置
│   ├── business.js     # 业务常量
│   └── routes.js       # 路由配置
├── hooks/              # 自定义Hooks
├── pages/              # 页面组件
│   ├── auth/           # 认证相关页面
│   ├── dashboard/      # 工作台
│   ├── customer/       # 客户管理
│   ├── sales/          # 销售管理
│   ├── product/        # 产品管理
│   ├── inventory/      # 库存管理
│   ├── purchase/       # 采购管理
│   ├── statistics/     # 数据统计
│   └── system/         # 系统管理
├── stores/             # 状态管理
├── utils/              # 工具函数
├── App.jsx             # 应用入口
├── main.jsx            # 渲染入口
└── index.css           # 全局样式
```

## 🔧 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0 / pnpm >= 8.0.0 / yarn >= 1.22.0

## 📦 快速开始

### 1. 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 2. 启动开发服务器

```bash
pnpm dev
# 或
npm run dev
```

访问 http://localhost:3000

### 3. 构建生产版本

```bash
pnpm build
# 或
npm run build
```

## 🔐 测试账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 超级管理员 | admin | admin123 |
| 销售总监 | sales_director | 123456 |
| 销售员工 | sales | 123456 |
| 库管员 | warehouse | 123456 |
| 采购专员 | purchaser | 123456 |
| 财务 | finance | 123456 |
| 普通员工 | employee | 123456 |

## 🌐 企业内网部署

### Nginx配置示例

```nginx
server {
    listen 80;
    server_name crm.company.internal;
    root /var/www/crm-erp/dist;
    index index.html;

    # 静态资源缓存
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API反向代理
    location /api {
        proxy_pass http://backend-server:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Gzip压缩
    gzip on;
    gzip_types text/plain application/javascript text/css application/json;
    gzip_min_length 1000;
}
```

### 部署步骤

1. 执行构建：`pnpm build`
2. 将 `dist/` 目录内容上传到服务器
3. 配置Nginx并重启服务
4. 确保后端API服务正常运行

## 📋 功能模块

### ✅ 已实现

- [x] 用户登录/退出
- [x] 角色权限管理
- [x] 主题切换（亮色/暗黑）
- [x] 响应式侧边栏
- [x] 工作台数据概览
- [x] 销售趋势图表
- [x] 客户分布图表

### 🚧 待开发

- [ ] 客户管理完整功能
- [ ] 销售订单管理
- [ ] 产品库存管理
- [ ] 采购流程管理
- [ ] 数据报表导出
- [ ] 系统配置管理

## 🎨 主题配置

编辑 `tailwind.config.js` 自定义企业主题色：

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#3b82f6',  // 主色调
        600: '#2563eb',
        // ...
      }
    }
  }
}
```

## 📝 开发规范

- 使用 ESLint + Prettier 进行代码规范检查
- 组件使用 PascalCase 命名
- 函数/变量使用 camelCase 命名
- 常量使用 UPPER_CASE 命名
- 文件/目录使用 kebab-case 命名

## 🐛 常见问题

### 依赖安装失败

```bash
# 清除缓存后重试
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 端口被占用

修改 `vite.config.js` 中的 `server.port` 配置。

### 构建内存不足

```bash
export NODE_OPTIONS="--max_old_space_size=4096"
pnpm build
```

## 📄 许可证

本项目仅供企业内部使用，禁止商业分发。

---

© 2024 Enterprise CRM/ERP System
