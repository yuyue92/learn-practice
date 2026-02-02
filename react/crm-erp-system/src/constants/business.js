/**
 * 业务常量配置
 * 定义系统所有业务相关的枚举值和常量
 */

// ==================== 客户相关 ====================

// 客户分类
export const CUSTOMER_CATEGORIES = {
  POTENTIAL: 'potential',    // 潜在客户
  INTENTION: 'intention',    // 意向客户
  DEAL: 'deal',              // 成交客户
  LOST: 'lost',              // 流失客户
};

export const CUSTOMER_CATEGORY_NAMES = {
  [CUSTOMER_CATEGORIES.POTENTIAL]: '潜在客户',
  [CUSTOMER_CATEGORIES.INTENTION]: '意向客户',
  [CUSTOMER_CATEGORIES.DEAL]: '成交客户',
  [CUSTOMER_CATEGORIES.LOST]: '流失客户',
};

export const CUSTOMER_CATEGORY_COLORS = {
  [CUSTOMER_CATEGORIES.POTENTIAL]: 'neutral',
  [CUSTOMER_CATEGORIES.INTENTION]: 'warning',
  [CUSTOMER_CATEGORIES.DEAL]: 'success',
  [CUSTOMER_CATEGORIES.LOST]: 'danger',
};

// 客户来源
export const CUSTOMER_SOURCES = {
  WEBSITE: 'website',        // 官网
  REFERRAL: 'referral',      // 转介绍
  EXHIBITION: 'exhibition',  // 展会
  PHONE: 'phone',            // 电话营销
  ADVERTISEMENT: 'advertisement', // 广告
  OTHER: 'other',            // 其他
};

export const CUSTOMER_SOURCE_NAMES = {
  [CUSTOMER_SOURCES.WEBSITE]: '官网',
  [CUSTOMER_SOURCES.REFERRAL]: '转介绍',
  [CUSTOMER_SOURCES.EXHIBITION]: '展会',
  [CUSTOMER_SOURCES.PHONE]: '电话营销',
  [CUSTOMER_SOURCES.ADVERTISEMENT]: '广告',
  [CUSTOMER_SOURCES.OTHER]: '其他',
};

// 跟进结果
export const FOLLOW_RESULTS = {
  INTERESTED: 'interested',   // 有意向
  CONSIDERING: 'considering', // 考虑中
  REJECTED: 'rejected',       // 已拒绝
  PENDING: 'pending',         // 待跟进
  DEAL: 'deal',               // 已成交
};

export const FOLLOW_RESULT_NAMES = {
  [FOLLOW_RESULTS.INTERESTED]: '有意向',
  [FOLLOW_RESULTS.CONSIDERING]: '考虑中',
  [FOLLOW_RESULTS.REJECTED]: '已拒绝',
  [FOLLOW_RESULTS.PENDING]: '待跟进',
  [FOLLOW_RESULTS.DEAL]: '已成交',
};

export const FOLLOW_RESULT_COLORS = {
  [FOLLOW_RESULTS.INTERESTED]: 'success',
  [FOLLOW_RESULTS.CONSIDERING]: 'warning',
  [FOLLOW_RESULTS.REJECTED]: 'danger',
  [FOLLOW_RESULTS.PENDING]: 'neutral',
  [FOLLOW_RESULTS.DEAL]: 'primary',
};

// ==================== 订单相关 ====================

// 销售订单状态
export const ORDER_STATUS = {
  PENDING_AUDIT: 'pending_audit',    // 待审核
  AUDITED: 'audited',                // 已审核
  PENDING_PAYMENT: 'pending_payment', // 待付款
  PAID: 'paid',                      // 已付款
  SHIPPED: 'shipped',                // 已发货
  COMPLETED: 'completed',            // 已完成
  CANCELLED: 'cancelled',            // 已取消
};

export const ORDER_STATUS_NAMES = {
  [ORDER_STATUS.PENDING_AUDIT]: '待审核',
  [ORDER_STATUS.AUDITED]: '已审核',
  [ORDER_STATUS.PENDING_PAYMENT]: '待付款',
  [ORDER_STATUS.PAID]: '已付款',
  [ORDER_STATUS.SHIPPED]: '已发货',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消',
};

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING_AUDIT]: 'warning',
  [ORDER_STATUS.AUDITED]: 'primary',
  [ORDER_STATUS.PENDING_PAYMENT]: 'warning',
  [ORDER_STATUS.PAID]: 'success',
  [ORDER_STATUS.SHIPPED]: 'primary',
  [ORDER_STATUS.COMPLETED]: 'success',
  [ORDER_STATUS.CANCELLED]: 'danger',
};

// 订单状态流转
export const ORDER_STATUS_FLOW = {
  [ORDER_STATUS.PENDING_AUDIT]: [ORDER_STATUS.AUDITED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.AUDITED]: [ORDER_STATUS.PENDING_PAYMENT, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PENDING_PAYMENT]: [ORDER_STATUS.PAID, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PAID]: [ORDER_STATUS.SHIPPED],
  [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.COMPLETED],
  [ORDER_STATUS.COMPLETED]: [],
  [ORDER_STATUS.CANCELLED]: [],
};

// 付款方式
export const PAYMENT_METHODS = {
  BANK_TRANSFER: 'bank_transfer', // 银行转账
  CASH: 'cash',                   // 现金
  CHECK: 'check',                 // 支票
  CREDIT: 'credit',               // 赊账
  OTHER: 'other',                 // 其他
};

export const PAYMENT_METHOD_NAMES = {
  [PAYMENT_METHODS.BANK_TRANSFER]: '银行转账',
  [PAYMENT_METHODS.CASH]: '现金',
  [PAYMENT_METHODS.CHECK]: '支票',
  [PAYMENT_METHODS.CREDIT]: '赊账',
  [PAYMENT_METHODS.OTHER]: '其他',
};

// ==================== 采购相关 ====================

// 采购订单状态
export const PURCHASE_STATUS = {
  PENDING_AUDIT: 'pending_audit',    // 待审核
  AUDITED: 'audited',                // 已审核
  PENDING_ARRIVAL: 'pending_arrival', // 待到货
  ARRIVED: 'arrived',                // 已到货
  STORED: 'stored',                  // 已入库
  CANCELLED: 'cancelled',            // 已取消
};

export const PURCHASE_STATUS_NAMES = {
  [PURCHASE_STATUS.PENDING_AUDIT]: '待审核',
  [PURCHASE_STATUS.AUDITED]: '已审核',
  [PURCHASE_STATUS.PENDING_ARRIVAL]: '待到货',
  [PURCHASE_STATUS.ARRIVED]: '已到货',
  [PURCHASE_STATUS.STORED]: '已入库',
  [PURCHASE_STATUS.CANCELLED]: '已取消',
};

export const PURCHASE_STATUS_COLORS = {
  [PURCHASE_STATUS.PENDING_AUDIT]: 'warning',
  [PURCHASE_STATUS.AUDITED]: 'primary',
  [PURCHASE_STATUS.PENDING_ARRIVAL]: 'warning',
  [PURCHASE_STATUS.ARRIVED]: 'primary',
  [PURCHASE_STATUS.STORED]: 'success',
  [PURCHASE_STATUS.CANCELLED]: 'danger',
};

// 供应商等级
export const SUPPLIER_LEVELS = {
  A: 'A',  // 优质
  B: 'B',  // 良好
  C: 'C',  // 一般
  D: 'D',  // 待改进
};

export const SUPPLIER_LEVEL_NAMES = {
  [SUPPLIER_LEVELS.A]: '优质供应商',
  [SUPPLIER_LEVELS.B]: '良好供应商',
  [SUPPLIER_LEVELS.C]: '一般供应商',
  [SUPPLIER_LEVELS.D]: '待改进供应商',
};

export const SUPPLIER_LEVEL_COLORS = {
  [SUPPLIER_LEVELS.A]: 'success',
  [SUPPLIER_LEVELS.B]: 'primary',
  [SUPPLIER_LEVELS.C]: 'warning',
  [SUPPLIER_LEVELS.D]: 'danger',
};

// ==================== 库存相关 ====================

// 库存记录类型
export const INVENTORY_TYPE = {
  IN: 'in',           // 入库
  OUT: 'out',         // 出库
  ADJUST: 'adjust',   // 调库
  CHECK: 'check',     // 盘点
};

export const INVENTORY_TYPE_NAMES = {
  [INVENTORY_TYPE.IN]: '入库',
  [INVENTORY_TYPE.OUT]: '出库',
  [INVENTORY_TYPE.ADJUST]: '调库',
  [INVENTORY_TYPE.CHECK]: '盘点',
};

export const INVENTORY_TYPE_COLORS = {
  [INVENTORY_TYPE.IN]: 'success',
  [INVENTORY_TYPE.OUT]: 'danger',
  [INVENTORY_TYPE.ADJUST]: 'warning',
  [INVENTORY_TYPE.CHECK]: 'primary',
};

// 库存状态
export const INVENTORY_STATUS = {
  NORMAL: 'normal',   // 正常
  WARNING: 'warning', // 预警
  EMPTY: 'empty',     // 缺货
};

export const INVENTORY_STATUS_NAMES = {
  [INVENTORY_STATUS.NORMAL]: '正常',
  [INVENTORY_STATUS.WARNING]: '库存预警',
  [INVENTORY_STATUS.EMPTY]: '缺货',
};

export const INVENTORY_STATUS_COLORS = {
  [INVENTORY_STATUS.NORMAL]: 'success',
  [INVENTORY_STATUS.WARNING]: 'warning',
  [INVENTORY_STATUS.EMPTY]: 'danger',
};

// ==================== 产品相关 ====================

// 产品分类
export const PRODUCT_CATEGORIES = {
  ELECTRONICS: 'electronics',     // 电子产品
  MACHINERY: 'machinery',         // 机械设备
  CONSUMABLES: 'consumables',     // 消耗品
  RAW_MATERIALS: 'raw_materials', // 原材料
  ACCESSORIES: 'accessories',     // 配件
  OTHER: 'other',                 // 其他
};

export const PRODUCT_CATEGORY_NAMES = {
  [PRODUCT_CATEGORIES.ELECTRONICS]: '电子产品',
  [PRODUCT_CATEGORIES.MACHINERY]: '机械设备',
  [PRODUCT_CATEGORIES.CONSUMABLES]: '消耗品',
  [PRODUCT_CATEGORIES.RAW_MATERIALS]: '原材料',
  [PRODUCT_CATEGORIES.ACCESSORIES]: '配件',
  [PRODUCT_CATEGORIES.OTHER]: '其他',
};

// 产品状态
export const PRODUCT_STATUS = {
  ACTIVE: 'active',       // 在售
  INACTIVE: 'inactive',   // 停售
  DISCONTINUED: 'discontinued', // 停产
};

export const PRODUCT_STATUS_NAMES = {
  [PRODUCT_STATUS.ACTIVE]: '在售',
  [PRODUCT_STATUS.INACTIVE]: '停售',
  [PRODUCT_STATUS.DISCONTINUED]: '停产',
};

export const PRODUCT_STATUS_COLORS = {
  [PRODUCT_STATUS.ACTIVE]: 'success',
  [PRODUCT_STATUS.INACTIVE]: 'warning',
  [PRODUCT_STATUS.DISCONTINUED]: 'danger',
};

// ==================== 操作日志相关 ====================

// 操作类型
export const LOG_ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  VIEW: 'view',
  EXPORT: 'export',
  IMPORT: 'import',
  LOGIN: 'login',
  LOGOUT: 'logout',
  AUDIT: 'audit',
  OTHER: 'other',
};

export const LOG_ACTION_NAMES = {
  [LOG_ACTIONS.CREATE]: '创建',
  [LOG_ACTIONS.UPDATE]: '修改',
  [LOG_ACTIONS.DELETE]: '删除',
  [LOG_ACTIONS.VIEW]: '查看',
  [LOG_ACTIONS.EXPORT]: '导出',
  [LOG_ACTIONS.IMPORT]: '导入',
  [LOG_ACTIONS.LOGIN]: '登录',
  [LOG_ACTIONS.LOGOUT]: '退出',
  [LOG_ACTIONS.AUDIT]: '审核',
  [LOG_ACTIONS.OTHER]: '其他',
};

// 日志模块
export const LOG_MODULES = {
  USER: 'user',
  CUSTOMER: 'customer',
  SALES: 'sales',
  PRODUCT: 'product',
  INVENTORY: 'inventory',
  PURCHASE: 'purchase',
  SYSTEM: 'system',
};

export const LOG_MODULE_NAMES = {
  [LOG_MODULES.USER]: '用户管理',
  [LOG_MODULES.CUSTOMER]: '客户管理',
  [LOG_MODULES.SALES]: '销售管理',
  [LOG_MODULES.PRODUCT]: '产品管理',
  [LOG_MODULES.INVENTORY]: '库存管理',
  [LOG_MODULES.PURCHASE]: '采购管理',
  [LOG_MODULES.SYSTEM]: '系统管理',
};

// ==================== 通用常量 ====================

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// 时间格式
export const DATE_FORMATS = {
  DATE: 'yyyy-MM-dd',
  DATETIME: 'yyyy-MM-dd HH:mm:ss',
  TIME: 'HH:mm:ss',
  MONTH: 'yyyy-MM',
  YEAR: 'yyyy',
};

// 导出格式
export const EXPORT_FORMATS = {
  EXCEL: 'xlsx',
  CSV: 'csv',
  JSON: 'json',
  PNG: 'png',
};

export default {
  CUSTOMER_CATEGORIES,
  CUSTOMER_CATEGORY_NAMES,
  CUSTOMER_CATEGORY_COLORS,
  CUSTOMER_SOURCES,
  CUSTOMER_SOURCE_NAMES,
  FOLLOW_RESULTS,
  FOLLOW_RESULT_NAMES,
  FOLLOW_RESULT_COLORS,
  ORDER_STATUS,
  ORDER_STATUS_NAMES,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_FLOW,
  PAYMENT_METHODS,
  PAYMENT_METHOD_NAMES,
  PURCHASE_STATUS,
  PURCHASE_STATUS_NAMES,
  PURCHASE_STATUS_COLORS,
  SUPPLIER_LEVELS,
  SUPPLIER_LEVEL_NAMES,
  SUPPLIER_LEVEL_COLORS,
  INVENTORY_TYPE,
  INVENTORY_TYPE_NAMES,
  INVENTORY_TYPE_COLORS,
  INVENTORY_STATUS,
  INVENTORY_STATUS_NAMES,
  INVENTORY_STATUS_COLORS,
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_NAMES,
  PRODUCT_STATUS,
  PRODUCT_STATUS_NAMES,
  PRODUCT_STATUS_COLORS,
  LOG_ACTIONS,
  LOG_ACTION_NAMES,
  LOG_MODULES,
  LOG_MODULE_NAMES,
  PAGINATION,
  DATE_FORMATS,
  EXPORT_FORMATS,
};
