// ============================================
// 文件: components/TabGroup.tsx
// ============================================

import type { TabGroup as TabGroupType } from "~types/tab"
import { GROUP_COLORS } from "~types/tab"

interface TabGroupCardProps {
    group: TabGroupType
    onOpen: () => void
    onDelete: () => void
    onEdit?: () => void
}

export const TabGroupCard = ({ group, onOpen, onDelete, onEdit }: TabGroupCardProps) => {
    const colorConfig = GROUP_COLORS.find(c => c.color === group.color) || GROUP_COLORS[0]

    return (
        <div
            className="bg-white border rounded-lg p-4 hover:shadow-md transition-all"
            style={{ borderLeftWidth: '4px', borderLeftColor: colorConfig.color }}>

            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1">
                    <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: colorConfig.color }}
                    />
                    <h3 className="font-semibold text-gray-800 truncate">{group.name}</h3>
                    <span className="text-xs text-gray-500 flex-shrink-0">({group.tabs.length})</span>
                </div>

                <div className="flex gap-2">
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="text-sm text-gray-600 hover:text-indigo-600"
                            title="编辑">
                            ✏️
                        </button>
                    )}
                    <button
                        onClick={onOpen}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                        打开
                    </button>
                    <button
                        onClick={onDelete}
                        className="text-sm text-red-600 hover:text-red-800 font-medium">
                        删除
                    </button>
                </div>
            </div>

            <div className="space-y-1">
                {group.tabs.slice(0, 3).map((tab, i) => (
                    <div key={i} className="text-xs text-gray-600 truncate flex items-center gap-1">
                        <span className="text-gray-400">•</span>
                        <span className="truncate">{tab.title}</span>
                    </div>
                ))}
                {group.tabs.length > 3 && (
                    <div className="text-xs text-gray-400">
                        还有 {group.tabs.length - 3} 个标签...
                    </div>
                )}
            </div>

            <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                创建于 {new Date(group.createdAt).toLocaleString('zh-CN')}
            </div>
        </div>
    )
}