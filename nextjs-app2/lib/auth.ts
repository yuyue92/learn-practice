import { AuthUser, Permission } from '@/types'

// 模拟当前用户数据
export const getCurrentUser = (): AuthUser => {
  return {
    id: '1',
    name: '管理员',
    email: 'admin@example.com',
    role: 'admin',
    permissions: [
      { resource: 'users', action: 'create' },
      { resource: 'users', action: 'read' },
      { resource: 'users', action: 'update' },
      { resource: 'users', action: 'delete' },
      { resource: 'dashboard', action: 'read' },
      { resource: 'settings', action: 'update' },
    ]
  }
}

export const hasPermission = (
  user: AuthUser,
  resource: string,
  action: string
): boolean => {
  return user.permissions.some(
    permission => 
      permission.resource === resource && 
      permission.action === action
  )
}