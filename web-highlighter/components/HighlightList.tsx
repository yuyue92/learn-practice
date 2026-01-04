// ============================================
// 文件: components/HighlightList.tsx
// ============================================

import { useState } from "react"
import type { Highlight, ColorKey } from "~types/highlight"
import { COLORS } from "~types/highlight"

interface HighlightListProps {
    highlights: Highlight[]
    onDelete?: (id: string) => void
    onJumpTo?: (highlight: Highlight) => void
    showUrl?: boolean
    maxHeight?: string
}

export const HighlightList = ({
    highlights,
    onDelete,
    onJumpTo,
    showUrl = false,
    maxHeight = "max-h-64"
}: HighlightListProps) => {
    const [expandedId, setExpandedId] = useState<string | null>(null)

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

        if (diffInHours < 24) {
            return date.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
            })
        }
        return date.toLocaleDateString('zh-CN', {
            month: 'short',
            day: 'numeric'
        })
    }

    const truncateText = (text: string, maxLength: number = 100) => {
        if (text.length <= maxLength) return text
        return text.slice(0, maxLength) + '...'
    }

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id)
    }

    if (highlights.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">📝</div>
                <p className="text-lg font-medium">暂无高亮内容</p>
                <p className="text-sm mt-2">选择文本后开始高亮吧</p>
            </div>
        )
    }

    return (
        <div className={`space-y-2 overflow-y-auto ${maxHeight}`}>
            {highlights.map(highlight => {
                const isExpanded = expandedId === highlight.id
                const displayText = isExpanded
                    ? highlight.text
                    : truncateText(highlight.text)

                return (
                    <div
                        key={highlight.id}
                        className="bg-white border rounded-lg p-3 hover:shadow-md transition-all cursor-pointer group"
                        style={{
                            borderLeftColor: COLORS[highlight.color as ColorKey],
                            borderLeftWidth: '4px'
                        }}>

                        {/* 高亮文本 */}
                        <div
                            onClick={() => toggleExpand(highlight.id)}
                            className="mb-2">
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {displayText}
                            </p>
                            {highlight.text.length > 100 && (
                                <button className="text-xs text-indigo-600 hover:text-indigo-800 mt-1">
                                    {isExpanded ? '收起' : '展开全文'}
                                </button>
                            )}
                        </div>

                        {/* 元信息 */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                                {/* 颜色标签 */}
                                <div className="flex items-center gap-1">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: COLORS[highlight.color as ColorKey] }}
                                    />
                                    <span className="capitalize">{highlight.color}</span>
                                </div>

                                {/* 时间 */}
                                <span>•</span>
                                <span>{formatDate(highlight.timestamp)}</span>
                            </div>

                            {/* 操作按钮 */}
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {onJumpTo && (
                                    <button
                                        onClick={() => onJumpTo(highlight)}
                                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                                        title="跳转到高亮位置">
                                        跳转
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={() => onDelete(highlight.id)}
                                        className="text-red-600 hover:text-red-800 font-medium"
                                        title="删除高亮">
                                        删除
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* URL 信息（可选） */}
                        {showUrl && (
                            <div className="mt-2 pt-2 border-t">
                                <div className="text-xs text-gray-600">
                                    <div className="font-medium mb-1">{highlight.pageTitle}</div>
                                    <a
                                        href={highlight.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:underline truncate block"
                                        onClick={(e) => e.stopPropagation()}>
                                        {highlight.url}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}