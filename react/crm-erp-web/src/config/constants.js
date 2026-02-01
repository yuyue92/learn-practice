/**
 * 全局常量配置文件
 * 用于定义系统中使用的所有常量
 */

// ==================== 分页配置 ====================
export const PAGINATION = {
  PAGE_SIZE: Number(import.meta.env.VITE_PAGE_SIZE) || 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  DEFAULT_PAGE: 1,
};

// ==================== 日期格式 ====================
export const DATE_FORMAT = {
  DATE: 'yyyy-MM-dd',
  DATETIME: 'yyyy-MM-dd HH:mm:ss',
  TIME: 'HH:mm:ss',
  MONTH: 'yyyy-MM',
  YEAR: 'yyyy',
  DATE_CN: 'yyyy年MM月dd日',
  DATETIME_CN: 'yyyy年MM月dd日 HH:mm:ss',
};

// ==================== 客户类型 ====================
export const CUSTOMER_TYPE = {
  POTENTIAL: { value: 'potential', label: '潜在客户', color: 'neutral' },
  INTENT: { value: 'intent', label: '意向客户', color: 'primary' },
  DEAL: { value: 'deal', label: '成交客户', color: 'success' },
  LOST: { value: 'lost', label: '流失客户', color: 'danger' },
};

export const CUSTOMER_TYPE_OPTIONS = Object.values(CUSTOMER_TYPE);

// ==================== 客户等级 ====================
export const CUSTOMER_LEVEL = {
  A: { value: 'A', label: 'A级客户', color: 'danger' },
  B: { value: 'B', label: 'B级客户', color: 'warning' },
  C: { value: 'C', label: 'C级客户', color: 'primary' },
  D: { value: 'D', label: 'D级客户', color: 'neutral' },
};

export const CUSTOMER_LEVEL_OPTIONS = Object.values(CUSTOMER_LEVEL);

// ==================== 跟进方式 ====================
export const FOLLOW_UP_TYPE = {
  PHONE: { value: 'phone', label: '电话' },
  VISIT: { value: 'visit', label: '拜访' },
  EMAIL: { value: 'email', label: '邮件' },
  WECHAT: { value: 'wechat', label: '微信' },
  OTHER: { value: 'other', label: '其他' },
};

export const FOLLOW_UP_TYPE_OPTIONS = Object.values(FOLLOW_UP_TYPE);

// ==================== 跟进结果 ====================
export const FOLLOW_UP_RESULT = {
  SUCCESS: { value: 'success', label: '成功', color: 'success' },
  FAILED: { value: 'failed', label: '失败', color: 'danger' },
  PENDING: { value: 'pending', label: '待定', color: 'warning' },
};

export const FOLLOW_UP_RESULT_OPTIONS = Object.values(FOLLOW_UP_RESULT);

// ==================== 报价单状态 ====================
export const QUOTATION_STATUS = {
  DRAFT: { value: 'draft', label: '草稿', color: 'neutral' },
  SENT: { value: 'sent', label: '已发送', color: 'primary' },
  ACCEPTED: { value: 'accepted', label: '已接受', color: 'success' },
  REJECTED: { value: 'rejected', label: '已拒绝', color: 'danger' },
  EXPIRED: { value: 'expired', label: '已过期', color: 'neutral' },
};

export const QUOTATION_STATUS_OPTIONS = Object.values(QUOTATION_STATUS);

// ==================== 订单状态 ====================
export const ORDER_STATUS = {
  PENDING: { value: 'pending', label: '待审核', color: 'warning' },
  APPROVED: { value: 'approved', label: '已审核', color: 'primary' },
  PAYING: { value: 'paying', label: '待付款', color: 'warning' },
  PAID: { value: 'paid', label: '已付款', color: 'success' },
  SHIPPING: { value: 'shipping', label: '已发货', color: 'primary' },
  COMPLETED: { value: 'completed', label: '已完成', color: 'success' },
  CANCELLED: { value: 'cancelled', label: '已取消', color: 'danger' },
};

export const ORDER_STATUS_OPTIONS = Object.values(ORDER_STATUS);

// ==================== 付款方式 ====================
export const PAYMENT_METHOD = {
  CASH: { value: 'cash', label: '现金' },
  TRANSFER: { value: 'transfer', label: '转账' },
  CHECK: { value: 'check', label: '支票' },
  OTHER: { value: 'other', label: '其他' },
};

export const PAYMENT_METHOD_OPTIONS = Object.values(PAYMENT_METHOD);

// ==================== 产品状态 ====================
export const PRODUCT_STATUS = {
  ACTIVE: { value: 'active', label: '在售', color: 'success' },
  INACTIVE: { value: 'inactive', label: '停售', color: 'neutral' },
};

export const PRODUCT_STATUS_OPTIONS = Object.values(PRODUCT_STATUS);

// ==================== 库存类型 ====================
export const STOCK_TYPE = {
  IN: { value: 'in', label: '入库', color: 'success' },
  OUT: { value: 'out', label: '出库', color: 'danger' },
  ADJUST: { value: 'adjust', label: '调整', color: 'warning' },
};

export const STOCK_TYPE_OPTIONS = Object.values(STOCK_TYPE);

// ==================== 库存关联类型 ====================
export const STOCK_RELATED_TYPE = {
  PURCHASE: { value: 'purchase', label: '采购入库' },
  SALES: { value: 'sales', label: '销售出库' },
  MANUAL: { value: 'manual', label: '手动调整' },
  STOCKTAKING: { value: 'stocktaking', label: '盘点调整' },
};

export const STOCK_RELATED_TYPE_OPTIONS = Object.values(STOCK_RELATED_TYPE);

// ==================== 库存盘点状态 ====================
export const STOCKTAKING_STATUS = {
  DRAFT: { value: 'draft', label: '草稿', color: 'neutral' },
  PROCESSING: { value: 'processing', label: '盘点中', color: 'primary' },
  COMPLETED: { value: 'completed', label: '已完成', color: 'success' },
};

export const STOCKTAKING_STATUS_OPTIONS = Object.values(STOCKTAKING_STATUS);

// ==================== 供应商等级 ====================
export const SUPPLIER_LEVEL = {
  A: { value: 'A', label: 'A级供应商', color: 'danger' },
  B: { value: 'B', label: 'B级供应商', color: 'warning' },
  C: { value: 'C', label: 'C级供应商', color: 'primary' },
  D: { value: 'D', label: 'D级供应商', color: 'neutral' },
};

export const SUPPLIER_LEVEL_OPTIONS = Object.values(SUPPLIER_LEVEL);

// ==================== 采购订单状态 ====================
export const PURCHASE_STATUS = {
  DRAFT: { value: 'draft', label: '草稿', color: 'neutral' },
  APPROVED: { value: 'approved', label: '已审核', color: 'primary' },
  RECEIVING: { value: 'receiving', label: '待到货', color: 'warning' },
  RECEIVED: { value: 'received', label: '已到货', color: 'primary' },
  STORED: { value: 'stored', label: '已入库', color: 'success' },
  CANCELLED: { value: 'cancelled', label: '已取消', color: 'danger' },
};

export const PURCHASE_STATUS_OPTIONS = Object.values(PURCHASE_STATUS);

// ==================== 账号状态 ====================
export const ACCOUNT_STATUS = {
  ACTIVE: { value: 'active', label: '启用', color: 'success' },
  INACTIVE: { value: 'inactive', label: '禁用', color: 'danger' },
};

export const ACCOUNT_STATUS_OPTIONS = Object.values(ACCOUNT_STATUS);

// ==================== 角色编码 ====================
export const ROLE_CODE = {
  ADMIN: 'admin',
  SALES_MANAGER: 'sales_manager',
  SALES: 'sales',
  WAREHOUSE: 'warehouse',
  PURCHASE: 'purchase',
  FINANCE: 'finance',
  EMPLOYEE: 'employee',
};

// ==================== 角色名称 ====================
export const ROLE_NAME = {
  [ROLE_CODE.ADMIN]: '超级管理员',
  [ROLE_CODE.SALES_MANAGER]: '销售总监',
  [ROLE_CODE.SALES]: '销售员工',
  [ROLE_CODE.WAREHOUSE]: '库管员',
  [ROLE_CODE.PURCHASE]: '采购专员',
  [ROLE_CODE.FINANCE]: '财务',
  [ROLE_CODE.EMPLOYEE]: '普通员工',
};

// ==================== 权限模块 ====================
export const PERMISSION_MODULE = {
  CUSTOMER: 'customer',
  SALES: 'sales',
  PRODUCT: 'product',
  PURCHASE: 'purchase',
  REPORT: 'report',
  SYSTEM: 'system',
};

// ==================== 权限操作 ====================
export const PERMISSION_ACTION = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  EXPORT: 'export',
  IMPORT: 'import',
  APPROVE: 'approve',
};

// ==================== 文件上传配置 ====================
export const UPLOAD = {
  MAX_SIZE: Number(import.meta.env.VITE_UPLOAD_MAX_SIZE) * 1024 * 1024 || 10485760, // 10MB
  ACCEPT_IMAGE: {
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/gif': ['.gif'],
    'image/webp': ['.webp'],
  },
  ACCEPT_DOCUMENT: {
    'application/pdf': ['.pdf'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'text/csv': ['.csv'],
  },
};

// ==================== 性别 ====================
export const GENDER = {
  MALE: { value: 'male', label: '男' },
  FEMALE: { value: 'female', label: '女' },
  OTHER: { value: 'other', label: '其他' },
};

export const GENDER_OPTIONS = Object.values(GENDER);

// ==================== 主题模式 ====================
export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
};

// ==================== 语言 ====================
export const LANGUAGE = {
  ZH_CN: 'zh-CN',
  EN_US: 'en-US',
};

// ==================== 导出文件类型 ====================
export const EXPORT_TYPE = {
  EXCEL: 'excel',
  CSV: 'csv',
  PDF: 'pdf',
  PNG: 'png',
};

// ==================== 操作日志类型 ====================
export const LOG_TYPE = {
  LOGIN: { value: 'login', label: '登录' },
  LOGOUT: { value: 'logout', label: '退出' },
  CREATE: { value: 'create', label: '新增' },
  EDIT: { value: 'edit', label: '编辑' },
  DELETE: { value: 'delete', label: '删除' },
  EXPORT: { value: 'export', label: '导出' },
  IMPORT: { value: 'import', label: '导入' },
  APPROVE: { value: 'approve', label: '审核' },
};

export const LOG_TYPE_OPTIONS = Object.values(LOG_TYPE);

// ==================== API 响应状态码 ====================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// ==================== 通知类型 ====================
export const NOTIFICATION_TYPE = {
  FOLLOW_UP: { value: 'follow_up', label: '跟进提醒' },
  ORDER: { value: 'order', label: '订单提醒' },
  STOCK: { value: 'stock', label: '库存预警' },
  PAYMENT: { value: 'payment', label: '回款提醒' },
  SYSTEM: { value: 'system', label: '系统通知' },
};

export const NOTIFICATION_TYPE_OPTIONS = Object.values(NOTIFICATION_TYPE);

// ==================== 时间范围快捷选项 ====================
export const DATE_RANGE_SHORTCUTS = [
  { label: '今天', value: 'today' },
  { label: '昨天', value: 'yesterday' },
  { label: '最近7天', value: 'last7days' },
  { label: '最近30天', value: 'last30days' },
  { label: '本月', value: 'thisMonth' },
  { label: '上月', value: 'lastMonth' },
  { label: '本季度', value: 'thisQuarter' },
  { label: '本年', value: 'thisYear' },
];

// ==================== 统计图表类型 ====================
export const CHART_TYPE = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  AREA: 'area',
  SCATTER: 'scatter',
};

// ==================== 默认值 ====================
export const DEFAULTS = {
  AVATAR: '/src/assets/images/avatar-default.png',
  IMAGE: '/src/assets/images/empty.png',
  PAGE_TITLE: '企业级 CRM/ERP 系统',
};
