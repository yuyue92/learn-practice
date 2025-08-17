export interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'user' | 'editor'
    avatar?: string
    createdAt: Date
  }
  
  export interface Permission {
    resource: string
    action: 'create' | 'read' | 'update' | 'delete'
  }
  
  export interface AuthUser {
    id: string
    name: string
    email: string
    role: string
    permissions: Permission[]
  }
  
  export interface MenuItem {
    id: string
    title: string
    icon: React.ComponentType<any>
    path: string
    permissions?: string[]
  }