/**
 * 应用配置
 * 统一管理环境变量与全局配置
 */

// 环境变量配置
export const config = {
  // 应用信息
  app: {
    title: import.meta.env.VITE_APP_TITLE || '企业级CRM/ERP管理系统',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  
  // API配置
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT, 10) || 30000,
  },
  
  // 安全配置
  security: {
    tokenKey: 'crm_erp_token',
    tokenSecretKey: import.meta.env.VITE_TOKEN_SECRET_KEY || 'default-secret-key',
    tokenExpireHours: parseInt(import.meta.env.VITE_TOKEN_EXPIRE_HOURS, 10) || 24,
  },
  
  // 功能开关
  features: {
    enableDevTools: import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true',
    enableMock: import.meta.env.VITE_ENABLE_MOCK === 'true',
  },
  
  // 日志配置
  log: {
    level: import.meta.env.VITE_LOG_LEVEL || 'info',
  },
  
  // 分页配置
  pagination: {
    defaultPageSize: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE, 10) || 20,
    pageSizeOptions: [10, 20, 50, 100],
  },
  
  // 上传配置
  upload: {
    maxSize: parseInt(import.meta.env.VITE_MAX_UPLOAD_SIZE, 10) || 10, // MB
    supportedImageTypes: (import.meta.env.VITE_SUPPORTED_IMAGE_TYPES || 'jpg,jpeg,png,gif,webp').split(','),
  },
  
  // 主题配置
  theme: {
    defaultMode: 'light', // light | dark
    storageKey: 'crm_erp_theme',
  },
  
  // 侧边栏配置
  sidebar: {
    width: 260,
    collapsedWidth: 64,
    storageKey: 'crm_erp_sidebar_collapsed',
  },
  
  // 存储键名
  storage: {
    userKey: 'crm_erp_user',
    settingsKey: 'crm_erp_settings',
    formDraftPrefix: 'crm_erp_draft_',
    recentSearchKey: 'crm_erp_recent_search',
  },
  
  // 默认头像
  defaultAvatar: '/assets/images/default-avatar.png',
  
  // 空数据占位图
  emptyImage: '/assets/images/empty.png',
};

/**
 * 获取配置项
 * @param {string} path - 配置路径，如 'api.baseUrl'
 * @param {any} defaultValue - 默认值
 * @returns {any}
 */
export const getConfig = (path, defaultValue = undefined) => {
  const keys = path.split('.');
  let result = config;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return defaultValue;
    }
  }
  
  return result ?? defaultValue;
};

export default config;
