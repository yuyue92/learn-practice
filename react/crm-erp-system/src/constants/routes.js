/**
 * 路由配置常量
 * 定义系统所有路由路径及菜单配置
 */

// 路由路径常量
export const ROUTES = {
  // 认证相关
  LOGIN: '/login',
  FORBIDDEN: '/403',
  NOT_FOUND: '/404',
  
  // 首页
  DASHBOARD: '/',
  
  // 客户管理
  CUSTOMER: '/customer',
  CUSTOMER_LIST: '/customer/list',
  CUSTOMER_DETAIL: '/customer/detail/:id',
  CUSTOMER_CREATE: '/customer/create',
  CUSTOMER_EDIT: '/customer/edit/:id',
  CUSTOMER_FOLLOW: '/customer/follow',
  CUSTOMER_TAGS: '/customer/tags',
  
  // 销售管理
  SALES: '/sales',
  SALES_QUOTE: '/sales/quote',
  SALES_QUOTE_CREATE: '/sales/quote/create',
  SALES_QUOTE_EDIT: '/sales/quote/edit/:id',
  SALES_QUOTE_DETAIL: '/sales/quote/detail/:id',
  SALES_ORDER: '/sales/order',
  SALES_ORDER_CREATE: '/sales/order/create',
  SALES_ORDER_EDIT: '/sales/order/edit/:id',
  SALES_ORDER_DETAIL: '/sales/order/detail/:id',
  SALES_PAYMENT: '/sales/payment',
  SALES_REPORT: '/sales/report',
  
  // 产品管理
  PRODUCT: '/product',
  PRODUCT_LIST: '/product/list',
  PRODUCT_CREATE: '/product/create',
  PRODUCT_EDIT: '/product/edit/:id',
  PRODUCT_DETAIL: '/product/detail/:id',
  PRODUCT_CATEGORY: '/product/category',
  
  // 库存管理
  INVENTORY: '/inventory',
  INVENTORY_LIST: '/inventory/list',
  INVENTORY_IN: '/inventory/in',
  INVENTORY_OUT: '/inventory/out',
  INVENTORY_ADJUST: '/inventory/adjust',
  INVENTORY_CHECK: '/inventory/check',
  INVENTORY_ALERT: '/inventory/alert',
  INVENTORY_LOG: '/inventory/log',
  
  // 采购管理
  PURCHASE: '/purchase',
  PURCHASE_SUPPLIER: '/purchase/supplier',
  PURCHASE_SUPPLIER_CREATE: '/purchase/supplier/create',
  PURCHASE_SUPPLIER_EDIT: '/purchase/supplier/edit/:id',
  PURCHASE_SUPPLIER_DETAIL: '/purchase/supplier/detail/:id',
  PURCHASE_ORDER: '/purchase/order',
  PURCHASE_ORDER_CREATE: '/purchase/order/create',
  PURCHASE_ORDER_EDIT: '/purchase/order/edit/:id',
  PURCHASE_ORDER_DETAIL: '/purchase/order/detail/:id',
  PURCHASE_IN: '/purchase/in',
  PURCHASE_REPORT: '/purchase/report',
  
  // 数据统计
  STATISTICS: '/statistics',
  STATISTICS_DASHBOARD: '/statistics/dashboard',
  STATISTICS_SALES: '/statistics/sales',
  STATISTICS_CUSTOMER: '/statistics/customer',
  STATISTICS_INVENTORY: '/statistics/inventory',
  STATISTICS_PURCHASE: '/statistics/purchase',
  STATISTICS_REPORT: '/statistics/report',
  
  // 系统配置
  SYSTEM: '/system',
  SYSTEM_USER: '/system/user',
  SYSTEM_USER_CREATE: '/system/user/create',
  SYSTEM_USER_EDIT: '/system/user/edit/:id',
  SYSTEM_CONFIG: '/system/config',
  SYSTEM_DEPARTMENT: '/system/department',
  SYSTEM_LOG: '/system/log',
  SYSTEM_TEMPLATE: '/system/template',
  SYSTEM_BACKUP: '/system/backup',
  
  // 个人中心
  PROFILE: '/profile',
  PROFILE_INFO: '/profile/info',
  PROFILE_PASSWORD: '/profile/password',
  PROFILE_LOG: '/profile/log',
};

// 侧边栏菜单配置
export const MENU_CONFIG = [
  {
    key: 'dashboard',
    path: ROUTES.DASHBOARD,
    title: '工作台',
    icon: 'HiOutlineHome',
    permission: 'statistics:dashboard',
  },
  {
    key: 'customer',
    path: ROUTES.CUSTOMER,
    title: '客户管理',
    icon: 'HiOutlineUsers',
    permission: 'customer:view',
    children: [
      { key: 'customer-list', path: ROUTES.CUSTOMER_LIST, title: '客户列表' },
      { key: 'customer-follow', path: ROUTES.CUSTOMER_FOLLOW, title: '跟进管理' },
      { key: 'customer-tags', path: ROUTES.CUSTOMER_TAGS, title: '标签管理' },
    ],
  },
  {
    key: 'sales',
    path: ROUTES.SALES,
    title: '销售管理',
    icon: 'HiOutlineShoppingCart',
    permission: 'sales:view',
    children: [
      { key: 'sales-quote', path: ROUTES.SALES_QUOTE, title: '报价单' },
      { key: 'sales-order', path: ROUTES.SALES_ORDER, title: '销售订单' },
      { key: 'sales-payment', path: ROUTES.SALES_PAYMENT, title: '回款管理' },
      { key: 'sales-report', path: ROUTES.SALES_REPORT, title: '销售报表' },
    ],
  },
  {
    key: 'product',
    path: ROUTES.PRODUCT,
    title: '产品管理',
    icon: 'HiOutlineCube',
    permission: 'product:view',
    children: [
      { key: 'product-list', path: ROUTES.PRODUCT_LIST, title: '产品列表' },
      { key: 'product-category', path: ROUTES.PRODUCT_CATEGORY, title: '分类管理' },
    ],
  },
  {
    key: 'inventory',
    path: ROUTES.INVENTORY,
    title: '库存管理',
    icon: 'HiOutlineClipboardList',
    permission: 'inventory:view',
    children: [
      { key: 'inventory-list', path: ROUTES.INVENTORY_LIST, title: '库存查询' },
      { key: 'inventory-in', path: ROUTES.INVENTORY_IN, title: '入库管理' },
      { key: 'inventory-out', path: ROUTES.INVENTORY_OUT, title: '出库管理' },
      { key: 'inventory-check', path: ROUTES.INVENTORY_CHECK, title: '库存盘点' },
      { key: 'inventory-alert', path: ROUTES.INVENTORY_ALERT, title: '库存预警' },
      { key: 'inventory-log', path: ROUTES.INVENTORY_LOG, title: '出入库记录' },
    ],
  },
  {
    key: 'purchase',
    path: ROUTES.PURCHASE,
    title: '采购管理',
    icon: 'HiOutlineTruck',
    permission: 'purchase:view',
    children: [
      { key: 'purchase-supplier', path: ROUTES.PURCHASE_SUPPLIER, title: '供应商管理' },
      { key: 'purchase-order', path: ROUTES.PURCHASE_ORDER, title: '采购订单' },
      { key: 'purchase-in', path: ROUTES.PURCHASE_IN, title: '采购入库' },
      { key: 'purchase-report', path: ROUTES.PURCHASE_REPORT, title: '采购报表' },
    ],
  },
  {
    key: 'statistics',
    path: ROUTES.STATISTICS,
    title: '数据统计',
    icon: 'HiOutlineChartBar',
    permission: 'statistics:dashboard',
    children: [
      { key: 'statistics-dashboard', path: ROUTES.STATISTICS_DASHBOARD, title: '数据概览' },
      { key: 'statistics-sales', path: ROUTES.STATISTICS_SALES, title: '销售分析' },
      { key: 'statistics-customer', path: ROUTES.STATISTICS_CUSTOMER, title: '客户分析' },
      { key: 'statistics-inventory', path: ROUTES.STATISTICS_INVENTORY, title: '库存分析' },
      { key: 'statistics-purchase', path: ROUTES.STATISTICS_PURCHASE, title: '采购分析' },
      { key: 'statistics-report', path: ROUTES.STATISTICS_REPORT, title: '自定义报表' },
    ],
  },
  {
    key: 'system',
    path: ROUTES.SYSTEM,
    title: '系统管理',
    icon: 'HiOutlineCog',
    permission: 'system:config',
    children: [
      { key: 'system-user', path: ROUTES.SYSTEM_USER, title: '用户管理' },
      { key: 'system-department', path: ROUTES.SYSTEM_DEPARTMENT, title: '部门管理' },
      { key: 'system-config', path: ROUTES.SYSTEM_CONFIG, title: '系统配置' },
      { key: 'system-log', path: ROUTES.SYSTEM_LOG, title: '系统日志' },
      { key: 'system-template', path: ROUTES.SYSTEM_TEMPLATE, title: '模板管理' },
      { key: 'system-backup', path: ROUTES.SYSTEM_BACKUP, title: '数据备份' },
    ],
  },
];

// 面包屑映射配置
export const BREADCRUMB_MAP = {
  [ROUTES.DASHBOARD]: [{ title: '工作台' }],
  [ROUTES.CUSTOMER_LIST]: [{ title: '客户管理', path: ROUTES.CUSTOMER }, { title: '客户列表' }],
  [ROUTES.CUSTOMER_CREATE]: [{ title: '客户管理', path: ROUTES.CUSTOMER }, { title: '新建客户' }],
  [ROUTES.CUSTOMER_FOLLOW]: [{ title: '客户管理', path: ROUTES.CUSTOMER }, { title: '跟进管理' }],
  [ROUTES.CUSTOMER_TAGS]: [{ title: '客户管理', path: ROUTES.CUSTOMER }, { title: '标签管理' }],
  [ROUTES.SALES_QUOTE]: [{ title: '销售管理', path: ROUTES.SALES }, { title: '报价单' }],
  [ROUTES.SALES_ORDER]: [{ title: '销售管理', path: ROUTES.SALES }, { title: '销售订单' }],
  [ROUTES.SALES_PAYMENT]: [{ title: '销售管理', path: ROUTES.SALES }, { title: '回款管理' }],
  [ROUTES.SALES_REPORT]: [{ title: '销售管理', path: ROUTES.SALES }, { title: '销售报表' }],
  [ROUTES.PRODUCT_LIST]: [{ title: '产品管理', path: ROUTES.PRODUCT }, { title: '产品列表' }],
  [ROUTES.PRODUCT_CATEGORY]: [{ title: '产品管理', path: ROUTES.PRODUCT }, { title: '分类管理' }],
  [ROUTES.INVENTORY_LIST]: [{ title: '库存管理', path: ROUTES.INVENTORY }, { title: '库存查询' }],
  [ROUTES.INVENTORY_IN]: [{ title: '库存管理', path: ROUTES.INVENTORY }, { title: '入库管理' }],
  [ROUTES.INVENTORY_OUT]: [{ title: '库存管理', path: ROUTES.INVENTORY }, { title: '出库管理' }],
  [ROUTES.INVENTORY_CHECK]: [{ title: '库存管理', path: ROUTES.INVENTORY }, { title: '库存盘点' }],
  [ROUTES.INVENTORY_ALERT]: [{ title: '库存管理', path: ROUTES.INVENTORY }, { title: '库存预警' }],
  [ROUTES.INVENTORY_LOG]: [{ title: '库存管理', path: ROUTES.INVENTORY }, { title: '出入库记录' }],
  [ROUTES.PURCHASE_SUPPLIER]: [{ title: '采购管理', path: ROUTES.PURCHASE }, { title: '供应商管理' }],
  [ROUTES.PURCHASE_ORDER]: [{ title: '采购管理', path: ROUTES.PURCHASE }, { title: '采购订单' }],
  [ROUTES.PURCHASE_IN]: [{ title: '采购管理', path: ROUTES.PURCHASE }, { title: '采购入库' }],
  [ROUTES.PURCHASE_REPORT]: [{ title: '采购管理', path: ROUTES.PURCHASE }, { title: '采购报表' }],
  [ROUTES.STATISTICS_DASHBOARD]: [{ title: '数据统计', path: ROUTES.STATISTICS }, { title: '数据概览' }],
  [ROUTES.STATISTICS_SALES]: [{ title: '数据统计', path: ROUTES.STATISTICS }, { title: '销售分析' }],
  [ROUTES.STATISTICS_CUSTOMER]: [{ title: '数据统计', path: ROUTES.STATISTICS }, { title: '客户分析' }],
  [ROUTES.STATISTICS_INVENTORY]: [{ title: '数据统计', path: ROUTES.STATISTICS }, { title: '库存分析' }],
  [ROUTES.STATISTICS_PURCHASE]: [{ title: '数据统计', path: ROUTES.STATISTICS }, { title: '采购分析' }],
  [ROUTES.STATISTICS_REPORT]: [{ title: '数据统计', path: ROUTES.STATISTICS }, { title: '自定义报表' }],
  [ROUTES.SYSTEM_USER]: [{ title: '系统管理', path: ROUTES.SYSTEM }, { title: '用户管理' }],
  [ROUTES.SYSTEM_DEPARTMENT]: [{ title: '系统管理', path: ROUTES.SYSTEM }, { title: '部门管理' }],
  [ROUTES.SYSTEM_CONFIG]: [{ title: '系统管理', path: ROUTES.SYSTEM }, { title: '系统配置' }],
  [ROUTES.SYSTEM_LOG]: [{ title: '系统管理', path: ROUTES.SYSTEM }, { title: '系统日志' }],
  [ROUTES.SYSTEM_TEMPLATE]: [{ title: '系统管理', path: ROUTES.SYSTEM }, { title: '模板管理' }],
  [ROUTES.SYSTEM_BACKUP]: [{ title: '系统管理', path: ROUTES.SYSTEM }, { title: '数据备份' }],
  [ROUTES.PROFILE_INFO]: [{ title: '个人中心' }, { title: '基本信息' }],
  [ROUTES.PROFILE_PASSWORD]: [{ title: '个人中心' }, { title: '修改密码' }],
  [ROUTES.PROFILE_LOG]: [{ title: '个人中心' }, { title: '操作日志' }],
};

/**
 * 获取路由对应的面包屑
 * @param {string} pathname - 当前路径
 * @returns {Array}
 */
export const getBreadcrumbs = (pathname) => {
  // 处理动态路由
  const normalizedPath = pathname.replace(/\/\d+/g, '/:id');
  return BREADCRUMB_MAP[normalizedPath] || [{ title: '未知页面' }];
};

export default {
  ROUTES,
  MENU_CONFIG,
  BREADCRUMB_MAP,
  getBreadcrumbs,
};
