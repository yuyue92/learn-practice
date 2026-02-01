# 企业级 CRM/ERP Web 前端应用 - 架构设计文档

## 1. 项目整体架构图

### 1.1 技术架构分层

```
┌─────────────────────────────────────────────────────────────┐
│                        视图层 (View Layer)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  页面组件     │  │  业务组件     │  │  公共组件     │      │
│  │  (Pages)     │  │ (Business)   │  │  (Common)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      状态管理层 (State Layer)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  全局状态     │  │  服务端状态   │  │  组件状态     │      │
│  │  (Zustand)   │  │(React Query) │  │ (useState)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      业务逻辑层 (Logic Layer)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  自定义Hooks  │  │  工具函数     │  │  表单验证     │      │
│  │  (Hooks)     │  │  (Utils)     │  │  (Zod)       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      数据访问层 (Data Layer)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  API 封装     │  │  HTTP 请求    │  │  数据缓存     │      │
│  │  (API)       │  │  (Axios)     │  │(LocalStorage)│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 React 组件树结构

```
App
├── LoginPage (登录页)
├── Layout (主框架布局)
│   ├── Header (顶部导航栏)
│   │   ├── Logo
│   │   ├── GlobalSearch (全局搜索)
│   │   ├── Notifications (通知中心)
│   │   └── UserMenu (用户菜单)
│   ├── Sidebar (侧边栏导航)
│   │   ├── NavMenu (导航菜单)
│   │   └── CollapseButton
│   ├── Breadcrumb (面包屑导航)
│   └── MainContent (主内容区)
│       ├── Dashboard (仪表盘)
│       ├── CustomerModule (客户管理模块)
│       │   ├── CustomerList
│       │   ├── CustomerDetail
│       │   ├── CustomerForm
│       │   └── FollowUpList
│       ├── SalesModule (销售管理模块)
│       │   ├── QuotationList
│       │   ├── OrderList
│       │   ├── PaymentList
│       │   └── PerformanceStats
│       ├── ProductModule (产品库存模块)
│       │   ├── ProductList
│       │   ├── InventoryList
│       │   ├── StockWarning
│       │   └── StockTaking
│       ├── PurchaseModule (采购管理模块)
│       │   ├── SupplierList
│       │   ├── PurchaseOrderList
│       │   └── PurchaseStats
│       ├── ReportModule (数据统计模块)
│       │   ├── Dashboard
│       │   ├── Charts
│       │   └── CustomReport
│       ├── SystemModule (系统配置模块)
│       │   ├── UserManagement
│       │   ├── RoleManagement
│       │   ├── DepartmentManagement
│       │   └── SystemLogs
│       └── ProfileModule (个人中心)
│           ├── BasicInfo
│           ├── ChangePassword
│           └── Preferences
└── ErrorBoundary (错误边界)
```

### 1.3 路由结构设计

```javascript
Routes
├── / (重定向到 /login 或 /dashboard)
├── /login (登录页 - 公开路由)
├── /403 (无权限页面)
├── /404 (页面不存在)
└── /app (受保护路由 - 需登录)
    ├── /dashboard (首页仪表盘)
    ├── /customer (客户管理)
    │   ├── /list (客户列表)
    │   ├── /detail/:id (客户详情)
    │   ├── /create (新建客户)
    │   ├── /edit/:id (编辑客户)
    │   └── /followup (跟进管理)
    ├── /sales (销售管理)
    │   ├── /quotation (报价单)
    │   ├── /order (销售订单)
    │   ├── /payment (回款管理)
    │   └── /performance (业绩统计)
    ├── /product (产品库存)
    │   ├── /list (产品列表)
    │   ├── /inventory (库存管理)
    │   ├── /warning (库存预警)
    │   └── /stocktaking (库存盘点)
    ├── /purchase (采购管理)
    │   ├── /supplier (供应商管理)
    │   ├── /order (采购订单)
    │   └── /stats (采购统计)
    ├── /report (数据统计)
    │   ├── /dashboard (数据仪表盘)
    │   ├── /sales (销售报表)
    │   ├── /inventory (库存报表)
    │   └── /custom (自定义报表)
    ├── /system (系统配置 - 仅管理员)
    │   ├── /users (用户管理)
    │   ├── /roles (角色权限)
    │   ├── /departments (部门管理)
    │   └── /logs (系统日志)
    └── /profile (个人中心)
        ├── /info (基本信息)
        ├── /password (修改密码)
        └── /preferences (偏好设置)
```

### 1.4 状态管理流程

```
用户操作
    ↓
组件事件处理
    ↓
┌────────────────────────────────────────┐
│  状态判断                               │
│  ├─ 全局状态? → Zustand Store         │
│  ├─ 服务端数据? → React Query          │
│  └─ 组件状态? → useState/useReducer    │
└────────────────────────────────────────┘
    ↓
需要请求后端?
    ↓
API 调用 (Axios)
    ↓
请求拦截器 (添加Token、请求ID)
    ↓
后端服务
    ↓
响应拦截器 (错误处理、Token刷新)
    ↓
React Query 缓存更新
    ↓
组件重新渲染
    ↓
UI 更新 + 用户反馈
```

### 1.5 权限鉴权流程

```
用户访问路由
    ↓
路由守卫检查
    ↓
┌─────────────────────────────────┐
│  检查登录态                      │
│  ├─ 未登录? → 跳转登录页         │
│  └─ 已登录? → 继续                │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  路由级权限检查                  │
│  ├─ 无权限? → 403页面            │
│  └─ 有权限? → 渲染页面           │
└─────────────────────────────────┘
    ↓
组件内渲染
    ↓
┌─────────────────────────────────┐
│  功能级权限检查                  │
│  ├─ 按钮/操作权限               │
│  └─ 隐藏/禁用无权限功能          │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  数据级权限过滤                  │
│  └─ 仅显示用户有权查看的数据     │
└─────────────────────────────────┘
```

### 1.6 接口交互流程

```
前端组件
    ↓
调用 API 函数 (api/modules/*.js)
    ↓
HTTP 请求工具 (utils/request.js)
    ↓
Axios 实例
    ↓
请求拦截器
├─ 添加 Authorization Token
├─ 添加请求时间戳
├─ 添加请求 ID
└─ Content-Type 设置
    ↓
发送到后端服务
    ↓
接收响应
    ↓
响应拦截器
├─ 状态码检查 (200/401/403/500)
├─ Token 过期处理
├─ 错误统一提示
└─ 数据格式化
    ↓
返回数据到组件
    ↓
React Query 缓存
    ↓
组件状态更新
    ↓
UI 重新渲染
```

## 2. 核心数据结构设计

### 2.1 用户相关数据结构

```typescript
// 用户信息
interface User {
  id: string;                    // 用户ID
  username: string;              // 用户名
  realName: string;              // 真实姓名
  email: string;                 // 邮箱
  phone: string;                 // 手机号
  avatar: string;                // 头像URL
  roleId: string;                // 角色ID
  roleName: string;              // 角色名称
  departmentId: string;          // 部门ID
  departmentName: string;        // 部门名称
  status: 'active' | 'inactive'; // 账号状态
  createdAt: string;             // 创建时间
  updatedAt: string;             // 更新时间
  lastLoginAt: string;           // 最后登录时间
}

// 角色信息
interface Role {
  id: string;                    // 角色ID
  name: string;                  // 角色名称
  code: string;                  // 角色编码 (admin/sales_manager/sales/warehouse/purchase/finance/employee)
  description: string;           // 角色描述
  permissions: Permission[];     // 权限列表
  createdAt: string;
  updatedAt: string;
}

// 权限信息
interface Permission {
  id: string;                    // 权限ID
  name: string;                  // 权限名称
  code: string;                  // 权限编码 (customer:view/customer:create/customer:edit/customer:delete)
  module: string;                // 所属模块 (customer/sales/product/purchase/system)
  type: 'route' | 'function' | 'data'; // 权限类型
}
```

### 2.2 客户相关数据结构

```typescript
// 客户信息
interface Customer {
  id: string;                    // 客户ID
  name: string;                  // 客户名称
  code: string;                  // 客户编号
  type: 'potential' | 'intent' | 'deal' | 'lost'; // 客户类型
  industry: string;              // 所属行业
  level: 'A' | 'B' | 'C' | 'D';  // 客户等级
  source: string;                // 客户来源
  tags: string[];                // 客户标签
  contact: {
    person: string;              // 联系人
    phone: string;               // 联系电话
    email: string;               // 联系邮箱
    wechat: string;              // 微信号
    address: string;             // 联系地址
  };
  salesPersonId: string;         // 负责销售ID
  salesPersonName: string;       // 负责销售姓名
  followUpCount: number;         // 跟进次数
  lastFollowUpAt: string;        // 最后跟进时间
  nextFollowUpAt: string;        // 下次跟进时间
  totalOrderAmount: number;      // 累计订单金额
  totalOrderCount: number;       // 累计订单数
  remark: string;                // 备注
  createdAt: string;
  updatedAt: string;
}

// 跟进记录
interface FollowUpRecord {
  id: string;                    // 跟进ID
  customerId: string;            // 客户ID
  customerName: string;          // 客户名称
  salesPersonId: string;         // 跟进人ID
  salesPersonName: string;       // 跟进人姓名
  type: 'phone' | 'visit' | 'email' | 'wechat' | 'other'; // 跟进方式
  content: string;               // 跟进内容
  result: 'success' | 'failed' | 'pending'; // 跟进结果
  nextFollowUpAt: string;        // 下次跟进时间
  reminder: boolean;             // 是否提醒
  createdAt: string;
}
```

### 2.3 销售相关数据结构

```typescript
// 报价单
interface Quotation {
  id: string;                    // 报价单ID
  code: string;                  // 报价单编号
  customerId: string;            // 客户ID
  customerName: string;          // 客户名称
  salesPersonId: string;         // 销售ID
  salesPersonName: string;       // 销售姓名
  products: QuotationProduct[];  // 产品列表
  totalAmount: number;           // 总金额
  discountRate: number;          // 折扣率
  discountAmount: number;        // 折扣金额
  finalAmount: number;           // 最终金额
  validUntil: string;            // 有效期至
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'; // 状态
  remark: string;                // 备注
  createdAt: string;
  updatedAt: string;
}

// 报价单产品
interface QuotationProduct {
  productId: string;             // 产品ID
  productName: string;           // 产品名称
  productCode: string;           // 产品编号
  specification: string;         // 规格
  unit: string;                  // 单位
  quantity: number;              // 数量
  price: number;                 // 单价
  discountRate: number;          // 折扣率
  amount: number;                // 金额
}

// 销售订单
interface SalesOrder {
  id: string;                    // 订单ID
  code: string;                  // 订单编号
  customerId: string;            // 客户ID
  customerName: string;          // 客户名称
  salesPersonId: string;         // 销售ID
  salesPersonName: string;       // 销售姓名
  quotationId?: string;          // 关联报价单ID
  products: OrderProduct[];      // 产品列表
  totalAmount: number;           // 总金额
  paidAmount: number;            // 已付金额
  unpaidAmount: number;          // 未付金额
  status: 'pending' | 'approved' | 'paying' | 'paid' | 'shipping' | 'completed' | 'cancelled'; // 订单状态
  approvedBy?: string;           // 审核人
  approvedAt?: string;           // 审核时间
  deliveryAddress: string;       // 送货地址
  deliveryDate?: string;         // 送货日期
  remark: string;                // 备注
  createdAt: string;
  updatedAt: string;
}

// 订单产品
interface OrderProduct {
  productId: string;             // 产品ID
  productName: string;           // 产品名称
  productCode: string;           // 产品编号
  specification: string;         // 规格
  unit: string;                  // 单位
  quantity: number;              // 数量
  price: number;                 // 单价
  amount: number;                // 金额
}

// 回款记录
interface Payment {
  id: string;                    // 回款ID
  orderId: string;               // 订单ID
  orderCode: string;             // 订单编号
  customerId: string;            // 客户ID
  customerName: string;          // 客户名称
  amount: number;                // 回款金额
  paymentMethod: 'cash' | 'transfer' | 'check' | 'other'; // 付款方式
  paymentDate: string;           // 回款日期
  receiptNo: string;             // 收据编号
  remark: string;                // 备注
  createdBy: string;             // 创建人
  createdAt: string;
}
```

### 2.4 产品库存数据结构

```typescript
// 产品信息
interface Product {
  id: string;                    // 产品ID
  name: string;                  // 产品名称
  code: string;                  // 产品编号
  category: string;              // 产品分类
  specification: string;         // 规格
  unit: string;                  // 单位
  price: number;                 // 售价
  costPrice: number;             // 成本价
  stock: number;                 // 库存数量
  minStock: number;              // 最低库存
  maxStock: number;              // 最高库存
  warningStock: number;          // 预警库存
  images: string[];              // 产品图片
  tags: string[];                // 产品标签
  status: 'active' | 'inactive'; // 状态
  remark: string;                // 备注
  createdAt: string;
  updatedAt: string;
}

// 库存记录
interface StockRecord {
  id: string;                    // 记录ID
  productId: string;             // 产品ID
  productName: string;           // 产品名称
  productCode: string;           // 产品编号
  type: 'in' | 'out' | 'adjust'; // 类型 (入库/出库/调整)
  quantity: number;              // 数量
  beforeStock: number;           // 操作前库存
  afterStock: number;            // 操作后库存
  relatedType: 'purchase' | 'sales' | 'manual' | 'stocktaking'; // 关联类型
  relatedId?: string;            // 关联单据ID
  operatorId: string;            // 操作人ID
  operatorName: string;          // 操作人姓名
  remark: string;                // 备注
  createdAt: string;
}

// 库存盘点
interface StockTaking {
  id: string;                    // 盘点ID
  code: string;                  // 盘点单号
  status: 'draft' | 'processing' | 'completed'; // 状态
  items: StockTakingItem[];      // 盘点明细
  operatorId: string;            // 盘点人ID
  operatorName: string;          // 盘点人姓名
  remark: string;                // 备注
  createdAt: string;
  completedAt?: string;          // 完成时间
}

// 盘点明细
interface StockTakingItem {
  productId: string;             // 产品ID
  productName: string;           // 产品名称
  productCode: string;           // 产品编号
  bookStock: number;             // 账面库存
  actualStock: number;           // 实际库存
  difference: number;            // 盘点差异
  remark: string;                // 备注
}
```

### 2.5 采购相关数据结构

```typescript
// 供应商信息
interface Supplier {
  id: string;                    // 供应商ID
  name: string;                  // 供应商名称
  code: string;                  // 供应商编号
  category: string;              // 供应商分类
  level: 'A' | 'B' | 'C' | 'D';  // 供应商等级
  contact: {
    person: string;              // 联系人
    phone: string;               // 联系电话
    email: string;               // 联系邮箱
    address: string;             // 联系地址
  };
  tags: string[];                // 标签
  totalPurchaseAmount: number;   // 累计采购金额
  totalPurchaseCount: number;    // 累计采购次数
  remark: string;                // 备注
  status: 'active' | 'inactive'; // 状态
  createdAt: string;
  updatedAt: string;
}

// 采购订单
interface PurchaseOrder {
  id: string;                    // 采购订单ID
  code: string;                  // 采购单号
  supplierId: string;            // 供应商ID
  supplierName: string;          // 供应商名称
  purchaserId: string;           // 采购员ID
  purchaserName: string;         // 采购员姓名
  products: PurchaseProduct[];   // 产品列表
  totalAmount: number;           // 总金额
  status: 'draft' | 'approved' | 'receiving' | 'received' | 'stored' | 'cancelled'; // 状态
  approvedBy?: string;           // 审核人
  approvedAt?: string;           // 审核时间
  expectedDate: string;          // 预计到货日期
  actualDate?: string;           // 实际到货日期
  remark: string;                // 备注
  createdAt: string;
  updatedAt: string;
}

// 采购产品
interface PurchaseProduct {
  productId: string;             // 产品ID
  productName: string;           // 产品名称
  productCode: string;           // 产品编号
  specification: string;         // 规格
  unit: string;                  // 单位
  quantity: number;              // 数量
  receivedQuantity: number;      // 已收货数量
  price: number;                 // 单价
  amount: number;                // 金额
}
```

## 3. 业务流程说明

### 3.1 客户跟进流程

```
1. 创建客户
   ↓
2. 分配销售人员
   ↓
3. 销售人员添加跟进记录
   ├─ 选择跟进方式 (电话/拜访/邮件/微信)
   ├─ 填写跟进内容
   ├─ 记录跟进结果
   └─ 设置下次跟进时间 + 提醒
   ↓
4. 系统生成跟进提醒
   ├─ 首页展示待跟进客户
   └─ 到期前推送通知
   ↓
5. 持续跟进直到成交/流失
   ├─ 成交: 客户类型改为"成交客户"
   └─ 流失: 客户类型改为"流失客户"
```

### 3.2 订单创建与状态流转流程

```
1. 创建报价单
   ├─ 选择客户
   ├─ 添加产品 (多个)
   ├─ 设置价格/折扣
   └─ 设置有效期
   ↓
2. 发送报价单给客户
   (状态: draft → sent)
   ↓
3. 客户确认
   ├─ 接受: accepted
   └─ 拒绝: rejected
   ↓
4. 报价单转销售订单
   (一键复用报价单数据)
   ↓
5. 销售订单审核流程
   ├─ 待审核 (pending)
   ├─ 审核通过 (approved)
   └─ 审核拒绝 (返回修改)
   ↓
6. 订单付款流程
   ├─ 待付款 (paying)
   ├─ 添加回款记录
   ├─ 回款金额累计
   └─ 全款到账 (paid)
   ↓
7. 订单发货流程
   ├─ 出库操作 (库存减少)
   ├─ 填写物流信息
   └─ 状态更新为已发货 (shipping)
   ↓
8. 订单完成
   (completed)
```

### 3.3 采购入库流程

```
1. 创建采购订单
   ├─ 选择供应商
   ├─ 添加采购产品
   ├─ 填写数量/单价
   └─ 设置预计到货日期
   ↓
2. 采购订单审核
   ├─ 待审核 (draft)
   ├─ 审核通过 (approved)
   └─ 审核拒绝 (返回修改)
   ↓
3. 等待到货
   (receiving)
   ↓
4. 供应商送货
   ├─ 库管员确认收货
   ├─ 核对数量/质量
   └─ 记录实际到货数量
   (received)
   ↓
5. 批量入库操作
   ├─ 选择采购订单
   ├─ 确认入库产品
   ├─ 填写入库数量
   ├─ 生成入库记录
   └─ 更新产品库存
   (stored)
   ↓
6. 采购完成
   (订单状态更新为已入库)
```

### 3.4 库存预警流程

```
1. 系统定时检查库存
   (每小时/每天)
   ↓
2. 对比产品库存与预警阈值
   ├─ 库存 <= 预警值
   └─ 触发预警
   ↓
3. 生成预警记录
   ├─ 记录预警时间
   ├─ 记录产品信息
   └─ 记录当前库存
   ↓
4. 首页展示预警列表
   ├─ 醒目标识
   └─ 按紧急程度排序
   ↓
5. 库管员/采购员处理
   ├─ 查看预警详情
   ├─ 创建采购订单
   └─ 标记预警已处理
   ↓
6. 采购入库后
   ├─ 库存恢复正常
   └─ 预警自动解除
```

## 4. 项目目录结构

```
crm-erp-web/
├── public/                          # 静态资源目录
│   ├── favicon.ico                  # 网站图标
│   └── logo.png                     # 系统 Logo
├── src/                             # 源代码目录
│   ├── api/                         # API 接口封装
│   │   ├── modules/                 # 按模块拆分接口
│   │   │   ├── auth.js              # 认证相关接口
│   │   │   ├── customer.js          # 客户管理接口
│   │   │   ├── sales.js             # 销售管理接口
│   │   │   ├── product.js           # 产品库存接口
│   │   │   ├── purchase.js          # 采购管理接口
│   │   │   ├── report.js            # 数据统计接口
│   │   │   ├── system.js            # 系统配置接口
│   │   │   └── user.js              # 用户管理接口
│   │   └── index.js                 # API 统一导出
│   ├── assets/                      # 资源文件
│   │   ├── images/                  # 图片资源
│   │   │   ├── avatar-default.png   # 默认头像
│   │   │   ├── empty.png            # 空状态图片
│   │   │   └── logo.png             # Logo
│   │   └── icons/                   # 图标资源 (SVG)
│   ├── components/                  # 组件目录
│   │   ├── common/                  # 公共组件
│   │   │   ├── Button/              # 按钮组件
│   │   │   │   ├── index.jsx
│   │   │   │   └── styles.js
│   │   │   ├── Input/               # 输入框组件
│   │   │   ├── Select/              # 下拉选择组件
│   │   │   ├── DatePicker/          # 日期选择组件
│   │   │   ├── Table/               # 表格组件
│   │   │   │   ├── index.jsx        # 主组件
│   │   │   │   ├── Pagination.jsx   # 分页组件
│   │   │   │   └── hooks.js         # 表格相关 hooks
│   │   │   ├── Modal/               # 弹窗组件
│   │   │   ├── Confirm/             # 确认对话框
│   │   │   ├── Toast/               # 提示消息组件
│   │   │   ├── Loading/             # 加载组件
│   │   │   ├── Empty/               # 空状态组件
│   │   │   ├── Card/                # 卡片组件
│   │   │   ├── Tabs/                # 标签页组件
│   │   │   └── Upload/              # 文件上传组件
│   │   ├── business/                # 业务组件
│   │   │   ├── CustomerSelector/    # 客户选择器
│   │   │   ├── ProductSelector/     # 产品选择器
│   │   │   ├── UserSelector/        # 用户选择器
│   │   │   ├── DepartmentSelector/  # 部门选择器
│   │   │   ├── StatusTag/           # 状态标签
│   │   │   └── Charts/              # 图表组件
│   │   │       ├── LineChart.jsx    # 折线图
│   │   │       ├── BarChart.jsx     # 柱状图
│   │   │       └── PieChart.jsx     # 饼图
│   │   └── layout/                  # 布局组件
│   │       ├── Header/              # 顶部导航
│   │       │   ├── index.jsx
│   │       │   ├── GlobalSearch.jsx # 全局搜索
│   │       │   ├── Notifications.jsx # 通知中心
│   │       │   └── UserMenu.jsx     # 用户菜单
│   │       ├── Sidebar/             # 侧边栏导航
│   │       │   ├── index.jsx
│   │       │   └── NavMenu.jsx      # 导航菜单
│   │       ├── Breadcrumb/          # 面包屑导航
│   │       ├── MainLayout/          # 主布局
│   │       └── AuthLayout/          # 认证布局 (登录页)
│   ├── config/                      # 配置文件
│   │   ├── constants.js             # 常量配置
│   │   ├── routes.js                # 路由配置
│   │   ├── permissions.js           # 权限配置
│   │   ├── theme.js                 # 主题配置
│   │   └── env.js                   # 环境变量
│   ├── hooks/                       # 自定义 Hooks
│   │   ├── useAuth.js               # 认证相关
│   │   ├── usePermission.js         # 权限相关
│   │   ├── useTable.js              # 表格相关
│   │   ├── useForm.js               # 表单相关
│   │   ├── useRequest.js            # 请求相关
│   │   ├── useDebounce.js           # 防抖
│   │   ├── useThrottle.js           # 节流
│   │   └── useLocalStorage.js       # 本地存储
│   ├── pages/                       # 页面组件
│   │   ├── auth/                    # 认证相关页面
│   │   │   ├── Login.jsx            # 登录页
│   │   │   └── Unauthorized.jsx     # 403 无权限页
│   │   ├── dashboard/               # 仪表盘
│   │   │   └── index.jsx
│   │   ├── customer/                # 客户管理
│   │   │   ├── List.jsx             # 客户列表
│   │   │   ├── Detail.jsx           # 客户详情
│   │   │   ├── Form.jsx             # 客户表单
│   │   │   └── FollowUp.jsx         # 跟进管理
│   │   ├── sales/                   # 销售管理
│   │   │   ├── Quotation.jsx        # 报价单
│   │   │   ├── Order.jsx            # 销售订单
│   │   │   ├── Payment.jsx          # 回款管理
│   │   │   └── Performance.jsx      # 业绩统计
│   │   ├── product/                 # 产品库存
│   │   │   ├── List.jsx             # 产品列表
│   │   │   ├── Inventory.jsx        # 库存管理
│   │   │   ├── Warning.jsx          # 库存预警
│   │   │   └── StockTaking.jsx      # 库存盘点
│   │   ├── purchase/                # 采购管理
│   │   │   ├── Supplier.jsx         # 供应商管理
│   │   │   ├── Order.jsx            # 采购订单
│   │   │   └── Stats.jsx            # 采购统计
│   │   ├── report/                  # 数据统计
│   │   │   ├── Dashboard.jsx        # 数据仪表盘
│   │   │   └── CustomReport.jsx     # 自定义报表
│   │   ├── system/                  # 系统配置
│   │   │   ├── Users.jsx            # 用户管理
│   │   │   ├── Roles.jsx            # 角色权限
│   │   │   ├── Departments.jsx      # 部门管理
│   │   │   └── Logs.jsx             # 系统日志
│   │   ├── profile/                 # 个人中心
│   │   │   ├── BasicInfo.jsx        # 基本信息
│   │   │   ├── ChangePassword.jsx   # 修改密码
│   │   │   └── Preferences.jsx      # 偏好设置
│   │   └── error/                   # 错误页面
│   │       ├── NotFound.jsx         # 404 页面
│   │       └── ServerError.jsx      # 500 页面
│   ├── stores/                      # 状态管理
│   │   ├── useAuthStore.js          # 用户认证状态
│   │   ├── useThemeStore.js         # 主题状态
│   │   ├── useAppStore.js           # 应用全局状态
│   │   └── index.js                 # Store 统一导出
│   ├── styles/                      # 样式文件
│   │   ├── index.css                # 全局样式 + Tailwind 引入
│   │   ├── variables.css            # CSS 变量
│   │   └── utilities.css            # 工具类样式
│   ├── utils/                       # 工具函数
│   │   ├── request.js               # HTTP 请求封装
│   │   ├── auth.js                  # 认证工具 (Token 处理)
│   │   ├── storage.js               # 本地存储工具
│   │   ├── date.js                  # 日期处理工具
│   │   ├── export.js                # 数据导出工具
│   │   ├── validate.js              # 表单验证工具
│   │   ├── format.js                # 数据格式化工具
│   │   ├── crypto.js                # 加密工具
│   │   └── index.js                 # 工具函数统一导出
│   ├── App.jsx                      # 应用根组件
│   ├── main.jsx                     # 应用入口文件
│   └── router.jsx                   # 路由配置文件
├── .env.development                 # 开发环境变量
├── .env.production                  # 生产环境变量
├── .env.example                     # 环境变量示例
├── .eslintrc.cjs                    # ESLint 配置
├── .gitignore                       # Git 忽略文件
├── index.html                       # HTML 模板
├── package.json                     # 项目依赖配置
├── postcss.config.js                # PostCSS 配置
├── tailwind.config.js               # Tailwind CSS 配置
├── vite.config.js                   # Vite 配置
└── README.md                        # 项目说明文档
```

## 5. 全局配置与常量说明

### 5.1 主题配置 (tailwind.config.js)

```javascript
// 企业级主题色配置
const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',  // 主色调
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  // ... 其他颜色配置
}
```

### 5.2 角色权限配置 (config/permissions.js)

```javascript
// 角色编码
const ROLES = {
  ADMIN: 'admin',                    // 超级管理员
  SALES_MANAGER: 'sales_manager',    // 销售总监
  SALES: 'sales',                    // 销售员工
  WAREHOUSE: 'warehouse',            // 库管员
  PURCHASE: 'purchase',              // 采购专员
  FINANCE: 'finance',                // 财务
  EMPLOYEE: 'employee',              // 普通员工
}

// 权限配置
const PERMISSIONS = {
  customer: {
    view: ['admin', 'sales_manager', 'sales'],
    create: ['admin', 'sales_manager', 'sales'],
    edit: ['admin', 'sales_manager', 'sales'],
    delete: ['admin', 'sales_manager'],
  },
  // ... 其他权限配置
}
```

### 5.3 接口地址配置 (.env)

```bash
# 开发环境
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=企业级 CRM/ERP 系统

# 生产环境
VITE_API_BASE_URL=http://192.168.1.100:8080/api
VITE_APP_TITLE=企业级 CRM/ERP 系统
```

### 5.4 表单默认配置 (config/constants.js)

```javascript
// 分页配置
export const PAGINATION = {
  PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
}

// 日期格式
export const DATE_FORMAT = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm:ss',
}

// 客户类型
export const CUSTOMER_TYPE = {
  POTENTIAL: { value: 'potential', label: '潜在客户', color: 'gray' },
  INTENT: { value: 'intent', label: '意向客户', color: 'blue' },
  DEAL: { value: 'deal', label: '成交客户', color: 'green' },
  LOST: { value: 'lost', label: '流失客户', color: 'red' },
}

// 订单状态
export const ORDER_STATUS = {
  PENDING: { value: 'pending', label: '待审核', color: 'yellow' },
  APPROVED: { value: 'approved', label: '已审核', color: 'blue' },
  PAYING: { value: 'paying', label: '待付款', color: 'orange' },
  PAID: { value: 'paid', label: '已付款', color: 'green' },
  SHIPPING: { value: 'shipping', label: '已发货', color: 'purple' },
  COMPLETED: { value: 'completed', label: '已完成', color: 'green' },
  CANCELLED: { value: 'cancelled', label: '已取消', color: 'red' },
}
```

---

**设计文档说明**：
1. 本架构设计文档完整定义了项目的技术架构、数据结构、业务流程、目录结构和配置常量
2. 所有数据结构均采用 TypeScript 风格的接口定义，方便后续类型安全开发
3. 业务流程清晰描述了各核心模块的操作步骤和状态流转
4. 目录结构按功能模块划分，清晰合理，支持团队协作开发
5. 全局配置抽离为独立文件，支持环境区分和快速修改

下一步将基于此架构设计文档，输出完整的项目代码实现。
