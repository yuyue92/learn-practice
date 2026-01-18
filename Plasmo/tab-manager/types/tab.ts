// ============================================
// 1. 类型定义
// ============================================
// 文件: types/tab.ts

export interface SavedTab {
    id?: number
    url: string
    title: string
    favIconUrl?: string
    groupId?: string
    savedAt: number
}

export interface TabGroup {
    id: string
    name: string
    color: string
    tabs: SavedTab[]
    createdAt: number
    updatedAt: number
}

export interface TabSession {
    id: string
    name: string
    tabs: SavedTab[]
    timestamp: number
    windowId?: number
}

export const GROUP_COLORS = [
    { name: 'blue', color: '#3B82F6' },
    { name: 'green', color: '#10B981' },
    { name: 'red', color: '#EF4444' },
    { name: 'purple', color: '#8B5CF6' },
    { name: 'orange', color: '#F59E0B' },
    { name: 'pink', color: '#EC4899' },
] as const