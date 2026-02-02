/**
 * 常量模块统一导出
 */
export * from './permissions';
export * from './business';
export * from './routes';

// 默认导出
import permissions from './permissions';
import business from './business';
import routes from './routes';

export default {
  ...permissions,
  ...business,
  ...routes,
};
