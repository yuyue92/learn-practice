/**
 * 权限配置文件
 * 定义系统中的角色和权限映射关系
 */

import { ROLE_CODE, PERMISSION_MODULE, PERMISSION_ACTION } from './constants';

// ==================== 角色权限配置 ====================
/**
 * 权限配置说明:
 * - 每个模块下定义该模块支持的操作权限
 * - 每个操作权限定义允许执行该操作的角色列表
 * - 权限检查时会验证当前用户角色是否在允许列表中
 */
export const PERMISSIONS = {
  // 客户管理权限
  [PERMISSION_MODULE.CUSTOMER]: {
    [PERMISSION_ACTION.VIEW]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.SALES_MANAGER,
      ROLE_CODE.SALES,
    ],
    [PERMISSION_ACTION.CREATE]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.SALES_MANAGER,
      ROLE_CODE.SALES,
    ],
    [PERMISSION_ACTION.EDIT]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.SALES_MANAGER,
      ROLE_CODE.SALES,
    ],
    [PERMISSION_ACTION.DELETE]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.SALES_MANAGER,
    ],
    [PERMISSION_ACTION.EXPORT]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.SALES_MANAGER,
      ROLE_CODE.SALES,
    ],
    [PERMISSION_ACTION.IMPORT]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.SALES_MANAGER,
    ],
  },

  // 销售管理权限
  [PERMISSION_MODULE.SALES]: {
    [PERMISSION_ACTION.VIEW]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.SALES_MANAGER,
      ROLE_CODE.SALES,
      ROLE_CODE.FINANCE,
    ],
    [PERMISSION_ACTION.CREATE]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.SALES_MANAGER,
      ROLE_CODE.SALES,
    ],
    [PERMISSION_ACTION.EDIT]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.SALES_MANAGER,
      ROLE_CODE.SALES,
    ],
    [PERMISSION_ACTION.DELETE]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.SALES_MANAGER,
    ],
    [PERMISSION_ACTION.APPROVE]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.SALES_MANAGER,
    ],
    [PERMISSION_ACTION.EXPORT]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.SALES_MANAGER,
      ROLE_CODE.SALES,
      ROLE_CODE.FINANCE,
    ],
  },

  // 产品库存权限
  [PERMISSION_MODULE.PRODUCT]: {
    [PERMISSION_ACTION.VIEW]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.SALES_MANAGER,
      ROLE_CODE.SALES,
      ROLE_CODE.WAREHOUSE,
      ROLE_CODE.PURCHASE,
    ],
    [PERMISSION_ACTION.CREATE]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.WAREHOUSE,
      ROLE_CODE.PURCHASE,
    ],
    [PERMISSION_ACTION.EDIT]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.WAREHOUSE,
      ROLE_CODE.PURCHASE,
    ],
    [PERMISSION_ACTION.DELETE]: [
      ROLE_CODE.ADMIN,
    ],
    [PERMISSION_ACTION.EXPORT]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.WAREHOUSE,
      ROLE_CODE.PURCHASE,
    ],
    [PERMISSION_ACTION.IMPORT]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.WAREHOUSE,
    ],
  },

  // 采购管理权限
  [PERMISSION_MODULE.PURCHASE]: {
    [PERMISSION_ACTION.VIEW]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.PURCHASE,
      ROLE_CODE.WAREHOUSE,
      ROLE_CODE.FINANCE,
    ],
    [PERMISSION_ACTION.CREATE]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.PURCHASE,
    ],
    [PERMISSION_ACTION.EDIT]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.PURCHASE,
    ],
    [PERMISSION_ACTION.DELETE]: [
      ROLE_CODE.ADMIN,
    ],
    [PERMISSION_ACTION.APPROVE]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.PURCHASE,
    ],
    [PERMISSION_ACTION.EXPORT]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.PURCHASE,
      ROLE_CODE.FINANCE,
    ],
  },

  // 数据统计权限
  [PERMISSION_MODULE.REPORT]: {
    [PERMISSION_ACTION.VIEW]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.SALES_MANAGER,
      ROLE_CODE.SALES,
      ROLE_CODE.WAREHOUSE,
      ROLE_CODE.PURCHASE,
      ROLE_CODE.FINANCE,
    ],
    [PERMISSION_ACTION.EXPORT]: [
      ROLE_CODE.ADMIN,
      ROLE_CODE.SALES_MANAGER,
      ROLE_CODE.FINANCE,
    ],
  },

  // 系统配置权限 (仅管理员)
  [PERMISSION_MODULE.SYSTEM]: {
    [PERMISSION_ACTION.VIEW]: [
      ROLE_CODE.ADMIN,
    ],
    [PERMISSION_ACTION.CREATE]: [
      ROLE_CODE.ADMIN,
    ],
    [PERMISSION_ACTION.EDIT]: [
      ROLE_CODE.ADMIN,
    ],
    [PERMISSION_ACTION.DELETE]: [
      ROLE_CODE.ADMIN,
    ],
    [PERMISSION_ACTION.EXPORT]: [
      ROLE_CODE.ADMIN,
    ],
    [PERMISSION_ACTION.IMPORT]: [
      ROLE_CODE.ADMIN,
    ],
  },
};

// ==================== 路由权限配置 ====================
/**
 * 路由权限配置
 * 定义每个路由允许访问的角色列表
 */
export const ROUTE_PERMISSIONS = {
  // 首页仪表盘 - 所有登录用户
  '/app/dashboard': [
    ROLE_CODE.ADMIN,
    ROLE_CODE.SALES_MANAGER,
    ROLE_CODE.SALES,
    ROLE_CODE.WAREHOUSE,
    ROLE_CODE.PURCHASE,
    ROLE_CODE.FINANCE,
    ROLE_CODE.EMPLOYEE,
  ],

  // 客户管理
  '/app/customer': [
    ROLE_CODE.ADMIN,
    ROLE_CODE.SALES_MANAGER,
    ROLE_CODE.SALES,
  ],
  '/app/customer/*': [
    ROLE_CODE.ADMIN,
    ROLE_CODE.SALES_MANAGER,
    ROLE_CODE.SALES,
  ],

  // 销售管理
  '/app/sales': [
    ROLE_CODE.ADMIN,
    ROLE_CODE.SALES_MANAGER,
    ROLE_CODE.SALES,
    ROLE_CODE.FINANCE,
  ],
  '/app/sales/*': [
    ROLE_CODE.ADMIN,
    ROLE_CODE.SALES_MANAGER,
    ROLE_CODE.SALES,
    ROLE_CODE.FINANCE,
  ],

  // 产品库存
  '/app/product': [
    ROLE_CODE.ADMIN,
    ROLE_CODE.SALES_MANAGER,
    ROLE_CODE.SALES,
    ROLE_CODE.WAREHOUSE,
    ROLE_CODE.PURCHASE,
  ],
  '/app/product/*': [
    ROLE_CODE.ADMIN,
    ROLE_CODE.SALES_MANAGER,
    ROLE_CODE.SALES,
    ROLE_CODE.WAREHOUSE,
    ROLE_CODE.PURCHASE,
  ],

  // 采购管理
  '/app/purchase': [
    ROLE_CODE.ADMIN,
    ROLE_CODE.PURCHASE,
    ROLE_CODE.WAREHOUSE,
    ROLE_CODE.FINANCE,
  ],
  '/app/purchase/*': [
    ROLE_CODE.ADMIN,
    ROLE_CODE.PURCHASE,
    ROLE_CODE.WAREHOUSE,
    ROLE_CODE.FINANCE,
  ],

  // 数据统计
  '/app/report': [
    ROLE_CODE.ADMIN,
    ROLE_CODE.SALES_MANAGER,
    ROLE_CODE.SALES,
    ROLE_CODE.WAREHOUSE,
    ROLE_CODE.PURCHASE,
    ROLE_CODE.FINANCE,
  ],
  '/app/report/*': [
    ROLE_CODE.ADMIN,
    ROLE_CODE.SALES_MANAGER,
    ROLE_CODE.SALES,
    ROLE_CODE.WAREHOUSE,
    ROLE_CODE.PURCHASE,
    ROLE_CODE.FINANCE,
  ],

  // 系统配置 - 仅管理员
  '/app/system': [
    ROLE_CODE.ADMIN,
  ],
  '/app/system/*': [
    ROLE_CODE.ADMIN,
  ],

  // 个人中心 - 所有登录用户
  '/app/profile': [
    ROLE_CODE.ADMIN,
    ROLE_CODE.SALES_MANAGER,
    ROLE_CODE.SALES,
    ROLE_CODE.WAREHOUSE,
    ROLE_CODE.PURCHASE,
    ROLE_CODE.FINANCE,
    ROLE_CODE.EMPLOYEE,
  ],
  '/app/profile/*': [
    ROLE_CODE.ADMIN,
    ROLE_CODE.SALES_MANAGER,
    ROLE_CODE.SALES,
    ROLE_CODE.WAREHOUSE,
    ROLE_CODE.PURCHASE,
    ROLE_CODE.FINANCE,
    ROLE_CODE.EMPLOYEE,
  ],
};

// ==================== 数据权限配置 ====================
/**
 * 数据级权限配置
 * 定义不同角色可以查看的数据范围
 */
export const DATA_PERMISSIONS = {
  // 客户数据权限
  customer: {
    // 超级管理员和销售总监可查看所有客户
    [ROLE_CODE.ADMIN]: 'all',
    [ROLE_CODE.SALES_MANAGER]: 'all',
    // 销售员工仅可查看自己负责的客户
    [ROLE_CODE.SALES]: 'own',
  },

  // 销售订单数据权限
  order: {
    // 超级管理员、销售总监、财务可查看所有订单
    [ROLE_CODE.ADMIN]: 'all',
    [ROLE_CODE.SALES_MANAGER]: 'all',
    [ROLE_CODE.FINANCE]: 'all',
    // 销售员工仅可查看自己的订单
    [ROLE_CODE.SALES]: 'own',
  },

  // 采购订单数据权限
  purchase: {
    // 超级管理员、财务可查看所有采购订单
    [ROLE_CODE.ADMIN]: 'all',
    [ROLE_CODE.FINANCE]: 'all',
    // 采购专员、库管员可查看所有采购订单
    [ROLE_CODE.PURCHASE]: 'all',
    [ROLE_CODE.WAREHOUSE]: 'all',
  },
};

// ==================== 权限检查函数 ====================

/**
 * 检查用户是否有指定模块的指定操作权限
 * @param {string} userRole - 用户角色编码
 * @param {string} module - 模块名称
 * @param {string} action - 操作名称
 * @returns {boolean} 是否有权限
 */
export function hasPermission(userRole, module, action) {
  if (!userRole || !module || !action) {
    return false;
  }

  const modulePermissions = PERMISSIONS[module];
  if (!modulePermissions) {
    return false;
  }

  const actionPermissions = modulePermissions[action];
  if (!actionPermissions) {
    return false;
  }

  return actionPermissions.includes(userRole);
}

/**
 * 检查用户是否可以访问指定路由
 * @param {string} userRole - 用户角色编码
 * @param {string} path - 路由路径
 * @returns {boolean} 是否可以访问
 */
export function hasRoutePermission(userRole, path) {
  if (!userRole || !path) {
    return false;
  }

  // 查找匹配的路由配置
  const matchedRoute = Object.keys(ROUTE_PERMISSIONS).find(routePath => {
    if (routePath.endsWith('/*')) {
      const basePath = routePath.slice(0, -2);
      return path.startsWith(basePath);
    }
    return routePath === path;
  });

  if (!matchedRoute) {
    // 如果没有配置权限，默认拒绝访问
    return false;
  }

  const allowedRoles = ROUTE_PERMISSIONS[matchedRoute];
  return allowedRoles.includes(userRole);
}

/**
 * 检查用户的数据访问权限
 * @param {string} userRole - 用户角色编码
 * @param {string} dataType - 数据类型 (customer/order/purchase)
 * @returns {string} 数据权限范围 ('all' | 'own' | null)
 */
export function getDataPermission(userRole, dataType) {
  if (!userRole || !dataType) {
    return null;
  }

  const dataPermission = DATA_PERMISSIONS[dataType];
  if (!dataPermission) {
    return null;
  }

  return dataPermission[userRole] || null;
}

/**
 * 批量检查用户权限
 * @param {string} userRole - 用户角色编码
 * @param {Array} checks - 权限检查列表 [{module, action}]
 * @returns {boolean} 是否全部通过
 */
export function hasAllPermissions(userRole, checks) {
  if (!Array.isArray(checks) || checks.length === 0) {
    return false;
  }

  return checks.every(check =>
    hasPermission(userRole, check.module, check.action)
  );
}

/**
 * 检查用户是否有至少一个权限
 * @param {string} userRole - 用户角色编码
 * @param {Array} checks - 权限检查列表 [{module, action}]
 * @returns {boolean} 是否至少有一个权限
 */
export function hasAnyPermission(userRole, checks) {
  if (!Array.isArray(checks) || checks.length === 0) {
    return false;
  }

  return checks.some(check =>
    hasPermission(userRole, check.module, check.action)
  );
}
