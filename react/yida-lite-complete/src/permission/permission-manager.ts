/**
 * Permission System - 权限系统
 * Phase 3 Week 9: 表级权限实现
 * 
 * 权限模型：
 * - 角色：admin / user
 * - 表单级权限：view / edit / delete / export
 * - 字段级权限：预留（暂不实现）
 */

// ============ 角色类型 ============
export type Role = 'admin' | 'user' | 'guest';

// ============ 操作类型 ============
export type Operation = 
  | 'form:view'      // 查看表单
  | 'form:edit'      // 编辑表单设计
  | 'form:delete'    // 删除表单
  | 'record:create'  // 创建记录
  | 'record:view'    // 查看记录
  | 'record:edit'    // 编辑记录
  | 'record:delete'  // 删除记录
  | 'record:export'  // 导出记录
  | 'record:import'  // 导入记录
  | 'rule:manage'    // 管理规则
  | 'schema:view';   // 查看 Schema

// ============ 权限配置 ============
export interface PermissionConfig {
  formId: string;
  permissions: RolePermission[];
}

// ============ 角色权限 ============
export interface RolePermission {
  role: Role;
  operations: Operation[];
}

// ============ 用户信息 ============
export interface User {
  userId: string;
  username: string;
  role: Role;
  email?: string;
  createdAt: Date;
}

// ============ 权限检查结果 ============
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
}

// ============ 默认角色权限 ============
const DEFAULT_ROLE_PERMISSIONS: Record<Role, Operation[]> = {
  admin: [
    'form:view', 'form:edit', 'form:delete',
    'record:create', 'record:view', 'record:edit', 'record:delete',
    'record:export', 'record:import',
    'rule:manage', 'schema:view',
  ],
  user: [
    'form:view',
    'record:create', 'record:view', 'record:edit',
    'record:export',
  ],
  guest: [
    'form:view',
    'record:view',
  ],
};

// ============ 权限管理器 ============
export class PermissionManager {
  private permissions: Map<string, PermissionConfig> = new Map();
  private users: Map<string, User> = new Map();
  private currentUser: User | null = null;

  // ============ 用户管理 ============
  
  /**
   * 注册用户
   */
  registerUser(user: Omit<User, 'createdAt'>): User {
    const newUser: User = {
      ...user,
      createdAt: new Date(),
    };
    this.users.set(user.userId, newUser);
    return newUser;
  }

  /**
   * 设置当前用户
   */
  setCurrentUser(userId: string): void {
    this.currentUser = this.users.get(userId) || null;
  }

  /**
   * 获取当前用户
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * 获取用户
   */
  getUser(userId: string): User | null {
    return this.users.get(userId) || null;
  }

  /**
   * 更新用户角色
   */
  updateUserRole(userId: string, role: Role): void {
    const user = this.users.get(userId);
    if (user) {
      user.role = role;
      this.users.set(userId, user);
    }
  }

  // ============ 权限配置 ============

  /**
   * 设置表单权限配置
   */
  setFormPermissions(formId: string, permissions: RolePermission[]): void {
    this.permissions.set(formId, { formId, permissions });
  }

  /**
   * 获取表单权限配置
   */
  getFormPermissions(formId: string): PermissionConfig | null {
    return this.permissions.get(formId) || null;
  }

  /**
   * 使用默认权限初始化表单
   */
  initFormWithDefaultPermissions(formId: string): void {
    const permissions: RolePermission[] = Object.entries(DEFAULT_ROLE_PERMISSIONS).map(
      ([role, operations]) => ({
        role: role as Role,
        operations,
      })
    );
    this.setFormPermissions(formId, permissions);
  }

  // ============ 权限检查 ============

  /**
   * 检查当前用户是否有权限
   */
  check(formId: string, operation: Operation): PermissionCheckResult {
    if (!this.currentUser) {
      return { allowed: false, reason: '未登录' };
    }

    return this.checkUserPermission(this.currentUser.userId, formId, operation);
  }

  /**
   * 检查指定用户是否有权限
   */
  checkUserPermission(
    userId: string,
    formId: string,
    operation: Operation
  ): PermissionCheckResult {
    const user = this.users.get(userId);
    if (!user) {
      return { allowed: false, reason: '用户不存在' };
    }

    // 获取表单权限配置
    const config = this.permissions.get(formId);
    
    // 如果没有配置，使用默认权限
    const roleOperations = config
      ? config.permissions.find(p => p.role === user.role)?.operations
      : DEFAULT_ROLE_PERMISSIONS[user.role];

    if (!roleOperations) {
      return { allowed: false, reason: '角色无权限配置' };
    }

    const allowed = roleOperations.includes(operation);
    return {
      allowed,
      reason: allowed ? undefined : `角色 ${user.role} 无 ${operation} 权限`,
    };
  }

  /**
   * 检查多个操作权限
   */
  checkAll(formId: string, operations: Operation[]): PermissionCheckResult {
    for (const op of operations) {
      const result = this.check(formId, op);
      if (!result.allowed) {
        return result;
      }
    }
    return { allowed: true };
  }

  /**
   * 检查任一操作权限
   */
  checkAny(formId: string, operations: Operation[]): PermissionCheckResult {
    for (const op of operations) {
      const result = this.check(formId, op);
      if (result.allowed) {
        return result;
      }
    }
    return { allowed: false, reason: '无任何所需权限' };
  }

  // ============ 权限过滤 ============

  /**
   * 获取用户可执行的操作列表
   */
  getAllowedOperations(formId: string): Operation[] {
    if (!this.currentUser) return [];

    const config = this.permissions.get(formId);
    const roleOperations = config
      ? config.permissions.find(p => p.role === this.currentUser!.role)?.operations
      : DEFAULT_ROLE_PERMISSIONS[this.currentUser.role];

    return roleOperations || [];
  }

  /**
   * 过滤记录（基于权限）
   */
  filterRecordsByPermission<T extends { createdBy: string }>(
    records: T[],
    formId: string
  ): T[] {
    if (!this.currentUser) return [];

    // Admin 可以看所有
    if (this.currentUser.role === 'admin') {
      return records;
    }

    // User 只能看自己创建的（如果没有 record:view 权限）
    const canViewAll = this.check(formId, 'record:view').allowed;
    if (canViewAll) {
      return records;
    }

    // 只返回自己创建的记录
    return records.filter(r => r.createdBy === this.currentUser!.userId);
  }

  // ============ 工具方法 ============

  /**
   * 获取角色显示名称
   */
  static getRoleDisplayName(role: Role): string {
    const names: Record<Role, string> = {
      admin: '管理员',
      user: '普通用户',
      guest: '访客',
    };
    return names[role];
  }

  /**
   * 获取操作显示名称
   */
  static getOperationDisplayName(operation: Operation): string {
    const names: Record<Operation, string> = {
      'form:view': '查看表单',
      'form:edit': '编辑表单',
      'form:delete': '删除表单',
      'record:create': '创建记录',
      'record:view': '查看记录',
      'record:edit': '编辑记录',
      'record:delete': '删除记录',
      'record:export': '导出记录',
      'record:import': '导入记录',
      'rule:manage': '管理规则',
      'schema:view': '查看Schema',
    };
    return names[operation];
  }

  /**
   * 清空所有数据（用于测试）
   */
  clear(): void {
    this.permissions.clear();
    this.users.clear();
    this.currentUser = null;
  }
}

// ============ 权限装饰器（用于方法级权限控制）============
export function requirePermission(operation: Operation) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const permissionManager = (this as any).permissionManager as PermissionManager;
      const formId = args[0]; // 假设第一个参数是 formId

      if (permissionManager) {
        const result = permissionManager.check(formId, operation);
        if (!result.allowed) {
          throw new Error(`权限不足: ${result.reason}`);
        }
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

// ============ 导出单例 ============
export const permissionManager = new PermissionManager();

// ============ 权限常量 ============
export const ROLES: Role[] = ['admin', 'user', 'guest'];

export const OPERATIONS: Operation[] = [
  'form:view', 'form:edit', 'form:delete',
  'record:create', 'record:view', 'record:edit', 'record:delete',
  'record:export', 'record:import',
  'rule:manage', 'schema:view',
];

export const OPERATION_GROUPS = {
  form: ['form:view', 'form:edit', 'form:delete'] as Operation[],
  record: ['record:create', 'record:view', 'record:edit', 'record:delete', 'record:export', 'record:import'] as Operation[],
  advanced: ['rule:manage', 'schema:view'] as Operation[],
};
