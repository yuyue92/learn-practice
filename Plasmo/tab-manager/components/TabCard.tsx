// ============================================
// 文件: components/TabCard.tsx
// ============================================

import { useState } from "react"

interface TabCardProps {
    tab: chrome.tabs.Tab
    selected: boolean
    onSelect: () => void
    onClose?: () => void
    onActivate?: () => void
}

export const TabCard = ({ tab, selected, onSelect, onClose, onActivate }: TabCardProps) => {
    const [imageError, setImageError] = useState(false)

    const getFallbackIcon = () => {
        return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="gray"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>'
    }

    return (
        <div
            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${selected
                    ? 'tab-selected border-indigo-500 bg-indigo-50'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
            onClick={onSelect}>

            {/* 复选框 */}
            <input
                type="checkbox"
                checked={selected}
                onChange={() => { }}
                className="w-4 h-4 cursor-pointer"
            />

            {/* 图标 */}
            <img
                src={imageError ? getFallbackIcon() : (tab.favIconUrl || getFallbackIcon())}
                alt=""
                className="w-5 h-5 flex-shrink-0"
                onError={() => setImageError(true)}
            />

            {/* 标签信息 */}
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">
                    {tab.title || 'Untitled'}
                </div>
                <div className="text-xs text-gray-500 truncate">
                    {tab.url}
                </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-1">
                {onActivate && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onActivate()
                        }}
                        className="px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-100 rounded transition-colors"
                        title="激活标签">
                        激活
                    </button>
                )}
                {onClose && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onClose()
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="关闭标签">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    )
}