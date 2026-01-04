// ============================================
// 文件: options.tsx (使用组件的版本)
// ============================================

import { useState, useMemo } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import type { Highlight, ColorKey } from "./types/highlight"
import { COLORS } from "./types/highlight"
import { HighlightList } from "./components/HighlightList"
import { SearchBar } from "./components/SearchBar"
import { StatCard } from "./components/StatCard"
import { EmptyState } from "./components/EmptyState"
import "./style.css"

function OptionsPage() {
    const [highlights, setHighlights] = useStorage<Highlight[]>("highlights", [])
    const [searchTerm, setSearchTerm] = useState("")
    const [filterColor, setFilterColor] = useState<ColorKey | "all">("all")
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "page">("newest")

    // 筛选和排序
    const filteredHighlights = useMemo(() => {
        let result = [...highlights]

        // 搜索筛选
        if (searchTerm) {
            result = result.filter(h =>
                h.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                h.pageTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                h.url.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // 颜色筛选
        if (filterColor !== "all") {
            result = result.filter(h => h.color === filterColor)
        }

        // 排序
        result.sort((a, b) => {
            if (sortBy === "newest") {
                return b.timestamp - a.timestamp
            } else if (sortBy === "oldest") {
                return a.timestamp - b.timestamp
            } else {
                return a.pageTitle.localeCompare(b.pageTitle)
            }
        })

        return result
    }, [highlights, searchTerm, filterColor, sortBy])

    // 按 URL 分组
    const groupedByUrl = useMemo(() => {
        const grouped: Record<string, Highlight[]> = {}
        filteredHighlights.forEach(h => {
            if (!grouped[h.url]) {
                grouped[h.url] = []
            }
            grouped[h.url].push(h)
        })
        return grouped
    }, [filteredHighlights])

    // 统计数据
    const stats = useMemo(() => {
        const colorCounts = highlights.reduce((acc, h) => {
            acc[h.color] = (acc[h.color] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        return {
            total: highlights.length,
            pages: new Set(highlights.map(h => h.url)).size,
            mostUsedColor: Object.entries(colorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "yellow",
            thisWeek: highlights.filter(h =>
                Date.now() - h.timestamp < 7 * 24 * 60 * 60 * 1000
            ).length
        }
    }, [highlights])

    const deleteHighlight = (id: string) => {
        if (confirm("确定要删除这条高亮吗？")) {
            setHighlights(highlights.filter(h => h.id !== id))
        }
    }

    const deleteAllHighlights = () => {
        if (confirm(`确定要删除所有 ${highlights.length} 条高亮吗？此操作无法撤销！`)) {
            setHighlights([])
        }
    }

    const exportHighlights = () => {
        const dataStr = JSON.stringify(highlights, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `highlights-${new Date().toISOString().split('T')[0]}.json`
        link.click()
        URL.revokeObjectURL(url)
    }

    const exportAsMarkdown = () => {
        const markdown = Object.entries(groupedByUrl)
            .map(([url, items]) => {
                const title = items[0].pageTitle
                const itemsList = items
                    .map(h => `- **${h.color}**: ${h.text}`)
                    .join('\n')
                return `## ${title}\n\n${url}\n\n${itemsList}\n`
            })
            .join('\n---\n\n')

        const blob = new Blob([`# 我的网页高亮\n\n${markdown}`], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `highlights-${new Date().toISOString().split('T')[0]}.md`
        link.click()
        URL.revokeObjectURL(url)
    }

    const jumpToHighlight = (highlight: Highlight) => {
        chrome.tabs.create({ url: highlight.url })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 顶部栏 */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <span>🖍️</span>
                                <span>我的高亮</span>
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                管理你的所有网页高亮内容
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={exportAsMarkdown}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                                导出 Markdown
                            </button>
                            <button
                                onClick={exportHighlights}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                                导出 JSON
                            </button>
                            {highlights.length > 0 && (
                                <button
                                    onClick={deleteAllHighlights}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                                    清空所有
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* 统计卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <StatCard icon="📝" label="总高亮数" value={stats.total} color="bg-indigo-500" />
                    <StatCard icon="📄" label="页面数" value={stats.pages} color="bg-purple-500" />
                    <StatCard icon="📅" label="本周新增" value={stats.thisWeek} color="bg-green-500" />
                    <StatCard
                        icon="🎨"
                        label="最常用颜色"
                        value={stats.mostUsedColor}
                        color="bg-pink-500"
                    />
                </div>

                {/* 搜索和筛选 */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* 搜索框 */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                搜索高亮内容
                            </label>
                            <SearchBar
                                onSearch={setSearchTerm}
                                placeholder="搜索文本、标题或 URL..."
                            />
                        </div>

                        {/* 颜色筛选 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                按颜色筛选
                            </label>
                            <select
                                value={filterColor}
                                onChange={(e) => setFilterColor(e.target.value as ColorKey | "all")}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm">
                                <option value="all">全部颜色</option>
                                {(Object.keys(COLORS) as ColorKey[]).map(color => (
                                    <option key={color} value={color}>{color}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 排序选项 */}
                    <div className="mt-4 flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">排序:</label>
                        <div className="flex gap-2">
                            {[
                                { value: 'newest', label: '最新' },
                                { value: 'oldest', label: '最旧' },
                                { value: 'page', label: '按页面' }
                            ].map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => setSortBy(option.value as typeof sortBy)}
                                    className={`px-3 py-1 rounded text-sm transition-colors ${sortBy === option.value
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}>
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 高亮列表 */}
                {filteredHighlights.length === 0 ? (
                    <EmptyState
                        icon={highlights.length === 0 ? "📝" : "🔍"}
                        title={highlights.length === 0 ? "还没有任何高亮" : "没有找到匹配的高亮"}
                        description={
                            highlights.length === 0
                                ? "开始在网页上高亮文本，它们会自动保存在这里"
                                : "尝试调整搜索条件或筛选器"
                        }
                    />
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedByUrl).map(([url, items]) => (
                            <div key={url} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
                                    <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-1">
                                        <span>📄</span>
                                        <span>{items[0].pageTitle}</span>
                                        <span className="text-sm text-gray-500">({items.length})</span>
                                    </h3>
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-indigo-600 hover:underline truncate block">
                                        {url}
                                    </a>
                                </div>
                                <div className="p-6">
                                    <HighlightList
                                        highlights={items}
                                        onDelete={deleteHighlight}
                                        onJumpTo={jumpToHighlight}
                                        maxHeight="max-h-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default OptionsPage