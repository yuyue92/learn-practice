# 企业级 CRM/ERP Web 前端（React 18 + Tailwind v3）

> 内网部署友好：Vite 打包静态资源 + Nginx 反代 /api  
> 本项目已内置 mock 数据（localStorage），启动即可体验权限/鉴权/核心页面结构。

## 1. 环境要求
- Node.js 18+
- pnpm（推荐）/ npm / yarn
- 现代浏览器（Chrome/Edge/Firefox 最新版）

## 2. 本地启动
```bash
pnpm i
pnpm dev
```

访问：`http://localhost:5173`

演示账号：`admin / director / sales1 / warehouse / purchase / finance`（密码任意非空）

## 3. 打包与预览
```bash
pnpm build
pnpm preview
```

## 4. 内网部署（Nginx）
1) 打包生成静态资源：
```bash
pnpm build
# 输出目录：dist/
```

2) Nginx 示例配置（反代后端 /api）：
```nginx
server {
  listen 80;
  server_name  your.intranet.host;

  root /data/www/crm-erp-web/dist;
  index index.html;

  # SPA 路由：所有前端路由回退到 index.html
  location / {
    try_files $uri $uri/ /index.html;
  }

  # 反向代理后端 RESTful API（内网服务）
  location /api/ {
    proxy_pass http://backend-internal:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }

  # 静态资源缓存
  location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff2)$ {
    expires 30d;
    add_header Cache-Control "public";
  }
}
```

> 注意：本项目默认 `VITE_API_BASE_URL=/api`（见 `.env.example`）。

## 5. 目录结构（核心）
- `src/pages/*`：业务模块页面（客户/销售/库存/采购/财务/报表/个人中心/系统管理）
- `src/components/*`：公共组件（表格/分页/弹窗/按钮/Toast/布局/全局搜索）
- `src/stores/*`：Zustand 全局状态（auth、ui）+ React Query client
- `src/api/*`：接口封装（当前为 mockDb，可无缝替换为 axios 请求）
- `src/permissions/*`：角色/路由/功能权限配置

## 6. 对接后端建议
- 将 `src/api/*` 中的 mock 实现替换为 `src/api/http.js`（axios）请求
- 保持 API 文件“按模块拆分”，避免业务页面直接写请求
- 后端返回中携带 role、权限点（feature flags）即可实现更细粒度授权
