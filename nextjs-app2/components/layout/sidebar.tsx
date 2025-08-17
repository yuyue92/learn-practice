'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Users, 
  Settings, 
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MenuItem } from '@/types'

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    title: '仪表盘',
    icon: Home,
    path: '/dashboard',
  },
  {
    id: 'users',
    title: '用户管理',
    icon: Users,
    path: '/users',
    permissions: ['users:read']
  },
  {
    id: 'analytics',
    title: '数据分析',
    icon: BarChart3,
    path: '/analytics',
  },
  {
    id: 'settings',
    title: '系统设置',
    icon: Settings,
    path: '/settings',
    permissions: ['settings:update']
  }
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside className={cn(
      "fixed left-0 top-16 bottom-0 bg-gray-900 text-white transition-all duration-300 z-40",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path
              
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-gray-800 text-white" 
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    collapsed && "justify-center"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="ml-3">{item.title}</span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
        
        <div className="border-t border-gray-700 p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </aside>
  )
}