/**
 * 角色权限常量配置
 * 定义系统所有角色及其权限映射
 */

// 角色枚举
export const ROLES = {
  SUPER_ADMIN: 'super_admin',      // 超级管理员
  SALES_DIRECTOR: 'sales_director', // 销售总监
  SALES_STAFF: 'sales_staff',      // 销售员工
  WAREHOUSE: 'warehouse',           // 库管员
  PURCHASER: 'purchaser',          // 采购专员
  FINANCE: 'finance',              // 财务
  EMPLOYEE: 'employee',            // 普通员工
};

// 角色中文名称映射
export const ROLE_NAMES = {
  [ROLES.SUPER_ADMIN]: '超级管理员',
  [ROLES.SALES_DIRECTOR]: '销售总监',
  [ROLES.SALES_STAFF]: '销售员工',
  [ROLES.WAREHOUSE]: '库管员',
  [ROLES.PURCHASER]: '采购专员',
  [ROLES.FINANCE]: '财务',
  [ROLES.EMPLOYEE]: '普通员工',
};

// 角色颜色标识
export const ROLE_COLORS = {
  [ROLES.SUPER_ADMIN]: 'danger',
  [ROLES.SALES_DIRECTOR]: 'primary',
  [ROLES.SALES_STAFF]: 'primary',
  [ROLES.WAREHOUSE]: 'success',
  [ROLES.PURCHASER]: 'warning',
  [ROLES.FINANCE]: 'secondary',
  [ROLES.EMPLOYEE]: 'neutral',
};

// 功能权限枚举
export const PERMISSIONS = {
  // 用户管理
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_EDIT: 'user:edit',
  USER_DELETE: 'user:delete',
  USER_IMPORT: 'user:import',
  USER_EXPORT: 'user:export',
  
  // 客户管理
  CUSTOMER_VIEW: 'customer:view',
  CUSTOMER_VIEW_ALL: 'customer:view_all',  // 查看所有客户（vs仅自己负责的）
  CUSTOMER_CREATE: 'customer:create',
  CUSTOMER_EDIT: 'customer:edit',
  CUSTOMER_DELETE: 'customer:delete',
  CUSTOMER_IMPORT: 'customer:import',
  CUSTOMER_EXPORT: 'customer:export',
  CUSTOMER_FOLLOW: 'customer:follow',      // 添加跟进记录
  
  // 销售管理
  SALES_VIEW: 'sales:view',
  SALES_VIEW_ALL: 'sales:view_all',
  SALES_QUOTE_CREATE: 'sales:quote_create',
  SALES_QUOTE_EDIT: 'sales:quote_edit',
  SALES_QUOTE_DELETE: 'sales:quote_delete',
  SALES_ORDER_CREATE: 'sales:order_create',
  SALES_ORDER_EDIT: 'sales:order_edit',
  SALES_ORDER_DELETE: 'sales:order_delete',
  SALES_ORDER_AUDIT: 'sales:order_audit',   // 订单审核
  SALES_PAYMENT_CREATE: 'sales:payment_create',
  SALES_PAYMENT_VIEW: 'sales:payment_view',
  SALES_REPORT: 'sales:report',
  
  // 产品管理
  PRODUCT_VIEW: 'product:view',
  PRODUCT_CREATE: 'product:create',
  PRODUCT_EDIT: 'product:edit',
  PRODUCT_DELETE: 'product:delete',
  PRODUCT_IMPORT: 'product:import',
  PRODUCT_EXPORT: 'product:export',
  
  // 库存管理
  INVENTORY_VIEW: 'inventory:view',
  INVENTORY_IN: 'inventory:in',           // 入库
  INVENTORY_OUT: 'inventory:out',         // 出库
  INVENTORY_ADJUST: 'inventory:adjust',   // 调库
  INVENTORY_CHECK: 'inventory:check',     // 盘点
  INVENTORY_ALERT: 'inventory:alert',     // 预警管理
  INVENTORY_EXPORT: 'inventory:export',
  
  // 采购管理
  PURCHASE_VIEW: 'purchase:view',
  PURCHASE_SUPPLIER_MANAGE: 'purchase:supplier_manage',
  PURCHASE_ORDER_CREATE: 'purchase:order_create',
  PURCHASE_ORDER_EDIT: 'purchase:order_edit',
  PURCHASE_ORDER_DELETE: 'purchase:order_delete',
  PURCHASE_ORDER_AUDIT: 'purchase:order_audit',
  PURCHASE_IN: 'purchase:in',              // 采购入库
  PURCHASE_REPORT: 'purchase:report',
  
  // 数据统计
  STATISTICS_DASHBOARD: 'statistics:dashboard',
  STATISTICS_SALES: 'statistics:sales',
  STATISTICS_CUSTOMER: 'statistics:customer',
  STATISTICS_INVENTORY: 'statistics:inventory',
  STATISTICS_PURCHASE: 'statistics:purchase',
  STATISTICS_EXPORT: 'statistics:export',
  
  // 系统配置
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_DEPARTMENT: 'system:department',
  SYSTEM_LOG: 'system:log',
  SYSTEM_TEMPLATE: 'system:template',
  SYSTEM_BACKUP: 'system:backup',
};

// 角色权限映射
export const ROLE_PERMISSIONS = {
  // 超级管理员 - 拥有所有权限
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  
  // 销售总监 - 查看所有销售数据、管理销售团队
  [ROLES.SALES_DIRECTOR]: [
    PERMISSIONS.CUSTOMER_VIEW,
    PERMISSIONS.CUSTOMER_VIEW_ALL,
    PERMISSIONS.CUSTOMER_CREATE,
    PERMISSIONS.CUSTOMER_EDIT,
    PERMISSIONS.CUSTOMER_DELETE,
    PERMISSIONS.CUSTOMER_IMPORT,
    PERMISSIONS.CUSTOMER_EXPORT,
    PERMISSIONS.CUSTOMER_FOLLOW,
    PERMISSIONS.SALES_VIEW,
    PERMISSIONS.SALES_VIEW_ALL,
    PERMISSIONS.SALES_QUOTE_CREATE,
    PERMISSIONS.SALES_QUOTE_EDIT,
    PERMISSIONS.SALES_QUOTE_DELETE,
    PERMISSIONS.SALES_ORDER_CREATE,
    PERMISSIONS.SALES_ORDER_EDIT,
    PERMISSIONS.SALES_ORDER_DELETE,
    PERMISSIONS.SALES_ORDER_AUDIT,
    PERMISSIONS.SALES_PAYMENT_CREATE,
    PERMISSIONS.SALES_PAYMENT_VIEW,
    PERMISSIONS.SALES_REPORT,
    PERMISSIONS.PRODUCT_VIEW,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.STATISTICS_DASHBOARD,
    PERMISSIONS.STATISTICS_SALES,
    PERMISSIONS.STATISTICS_CUSTOMER,
    PERMISSIONS.STATISTICS_EXPORT,
  ],
  
  // 销售员工 - 管理自己的客户和订单
  [ROLES.SALES_STAFF]: [
    PERMISSIONS.CUSTOMER_VIEW,
    PERMISSIONS.CUSTOMER_CREATE,
    PERMISSIONS.CUSTOMER_EDIT,
    PERMISSIONS.CUSTOMER_FOLLOW,
    PERMISSIONS.CUSTOMER_EXPORT,
    PERMISSIONS.SALES_VIEW,
    PERMISSIONS.SALES_QUOTE_CREATE,
    PERMISSIONS.SALES_QUOTE_EDIT,
    PERMISSIONS.SALES_ORDER_CREATE,
    PERMISSIONS.SALES_ORDER_EDIT,
    PERMISSIONS.SALES_PAYMENT_CREATE,
    PERMISSIONS.SALES_PAYMENT_VIEW,
    PERMISSIONS.PRODUCT_VIEW,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.STATISTICS_DASHBOARD,
  ],
  
  // 库管员 - 管理库存
  [ROLES.WAREHOUSE]: [
    PERMISSIONS.PRODUCT_VIEW,
    PERMISSIONS.PRODUCT_CREATE,
    PERMISSIONS.PRODUCT_EDIT,
    PERMISSIONS.PRODUCT_IMPORT,
    PERMISSIONS.PRODUCT_EXPORT,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_IN,
    PERMISSIONS.INVENTORY_OUT,
    PERMISSIONS.INVENTORY_ADJUST,
    PERMISSIONS.INVENTORY_CHECK,
    PERMISSIONS.INVENTORY_ALERT,
    PERMISSIONS.INVENTORY_EXPORT,
    PERMISSIONS.STATISTICS_DASHBOARD,
    PERMISSIONS.STATISTICS_INVENTORY,
  ],
  
  // 采购专员 - 管理采购
  [ROLES.PURCHASER]: [
    PERMISSIONS.PRODUCT_VIEW,
    PERMISSIONS.PURCHASE_VIEW,
    PERMISSIONS.PURCHASE_SUPPLIER_MANAGE,
    PERMISSIONS.PURCHASE_ORDER_CREATE,
    PERMISSIONS.PURCHASE_ORDER_EDIT,
    PERMISSIONS.PURCHASE_IN,
    PERMISSIONS.PURCHASE_REPORT,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_IN,
    PERMISSIONS.STATISTICS_DASHBOARD,
    PERMISSIONS.STATISTICS_PURCHASE,
  ],
  
  // 财务 - 查看财务相关数据
  [ROLES.FINANCE]: [
    PERMISSIONS.CUSTOMER_VIEW,
    PERMISSIONS.SALES_VIEW,
    PERMISSIONS.SALES_VIEW_ALL,
    PERMISSIONS.SALES_PAYMENT_VIEW,
    PERMISSIONS.SALES_REPORT,
    PERMISSIONS.PURCHASE_VIEW,
    PERMISSIONS.PURCHASE_REPORT,
    PERMISSIONS.STATISTICS_DASHBOARD,
    PERMISSIONS.STATISTICS_SALES,
    PERMISSIONS.STATISTICS_PURCHASE,
    PERMISSIONS.STATISTICS_EXPORT,
  ],
  
  // 普通员工 - 基础查看权限
  [ROLES.EMPLOYEE]: [
    PERMISSIONS.CUSTOMER_VIEW,
    PERMISSIONS.PRODUCT_VIEW,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.STATISTICS_DASHBOARD,
  ],
};

// 菜单权限映射（用于控制菜单显示）
export const MENU_PERMISSIONS = {
  dashboard: [PERMISSIONS.STATISTICS_DASHBOARD],
  customer: [PERMISSIONS.CUSTOMER_VIEW],
  sales: [PERMISSIONS.SALES_VIEW],
  product: [PERMISSIONS.PRODUCT_VIEW],
  inventory: [PERMISSIONS.INVENTORY_VIEW],
  purchase: [PERMISSIONS.PURCHASE_VIEW],
  statistics: [PERMISSIONS.STATISTICS_DASHBOARD],
  system: [PERMISSIONS.SYSTEM_CONFIG],
};

/**
 * 检查用户是否拥有指定权限
 * @param {string} role - 用户角色
 * @param {string|string[]} permission - 权限或权限数组
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
  const rolePermissions = ROLE_PERMISSIONS[role] || [];
  
  if (Array.isArray(permission)) {
    return permission.some(p => rolePermissions.includes(p));
  }
  
  return rolePermissions.includes(permission);
};

/**
 * 检查用户是否可以访问指定菜单
 * @param {string} role - 用户角色
 * @param {string} menuKey - 菜单key
 * @returns {boolean}
 */
export const canAccessMenu = (role, menuKey) => {
  const requiredPermissions = MENU_PERMISSIONS[menuKey];
  if (!requiredPermissions) return true;
  
  return hasPermission(role, requiredPermissions);
};

export default {
  ROLES,
  ROLE_NAMES,
  ROLE_COLORS,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  MENU_PERMISSIONS,
  hasPermission,
  canAccessMenu,
};
