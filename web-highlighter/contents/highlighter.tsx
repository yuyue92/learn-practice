// 文件: contents/highlighter.tsx

import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import type { Highlight, ColorKey } from "~types/highlight"
import { COLORS } from "~types/highlight"
import cssText from "data-text:~style.css"

export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"],
    // css: ["font.css"]
}

export const getStyle = () => {
    const style = document.createElement("style")
    style.textContent = cssText
    return style
}

const HighlighterContent = () => {
    const [highlights, setHighlights] = useStorage<Highlight[]>("highlights", [])
    const [isHighlighting, setIsHighlighting] = useStorage("is-highlighting", false)
    const [currentColor, setCurrentColor] = useStorage<ColorKey>("current-color", "yellow")
    const [tooltip, setTooltip] = useState<{ x: number, y: number, text: string } | null>(null)

    // 应用已保存的高亮
    useEffect(() => {
        const currentUrl = window.location.href
        const pageHighlights = highlights.filter(h => h.url === currentUrl)

        pageHighlights.forEach(highlight => {
            applyHighlight(highlight)
        })
    }, [highlights])

    // 监听文本选择
    useEffect(() => {
        if (!isHighlighting) return

        const handleMouseUp = () => {
            const selection = window.getSelection()
            if (!selection || selection.isCollapsed) return

            const selectedText = selection.toString().trim()
            if (selectedText.length < 2) return

            // 创建高亮
            createHighlight(selection, selectedText)
        }

        document.addEventListener('mouseup', handleMouseUp)
        return () => document.removeEventListener('mouseup', handleMouseUp)
    }, [isHighlighting, currentColor])

    const createHighlight = (selection: Selection, text: string) => {
        const range = selection.getRangeAt(0)

        // 创建高亮元素
        const span = document.createElement('span')
        span.className = 'highlight-marker'
        span.style.setProperty('--highlight-color', COLORS[currentColor])
        span.dataset.highlightId = Date.now().toString()

        try {
            range.surroundContents(span)

            // 保存高亮数据
            const highlight: Highlight = {
                id: span.dataset.highlightId!,
                text,
                color: currentColor,
                url: window.location.href,
                pageTitle: document.title,
                timestamp: Date.now(),
                range: {
                    startContainer: getNodePath(range.startContainer),
                    startOffset: range.startOffset,
                    endContainer: getNodePath(range.endContainer),
                    endOffset: range.endOffset
                }
            }

            setHighlights([...highlights, highlight])

            // 添加点击事件
            span.addEventListener('click', (e) => {
                e.stopPropagation()
                showTooltip(e.clientX, e.clientY, text)
            })

            // 清除选择
            selection.removeAllRanges()
        } catch (error) {
            console.error('高亮失败:', error)
        }
    }

    const applyHighlight = (highlight: Highlight) => {
        // 查找是否已经应用
        const existing = document.querySelector(`[data-highlight-id="${highlight.id}"]`)
        if (existing) return

        // 这里简化处理，实际项目中需要更精确的范围恢复
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null
        )

        let node
        while (node = walker.nextNode()) {
            const text = node.textContent || ''
            const index = text.indexOf(highlight.text)

            if (index !== -1) {
                const range = document.createRange()
                range.setStart(node, index)
                range.setEnd(node, index + highlight.text.length)

                const span = document.createElement('span')
                span.className = 'highlight-marker'
                span.style.setProperty('--highlight-color', COLORS[highlight.color as ColorKey])
                span.dataset.highlightId = highlight.id

                try {
                    range.surroundContents(span)

                    span.addEventListener('click', (e) => {
                        e.stopPropagation()
                        showTooltip(e.clientX, e.clientY, highlight.text)
                    })

                    break
                } catch (error) {
                    console.error('应用高亮失败:', error)
                }
            }
        }
    }

    const showTooltip = (x: number, y: number, text: string) => {
        setTooltip({ x, y, text })
        setTimeout(() => setTooltip(null), 3000)
    }

    const getNodePath = (node: Node): string => {
        const path: number[] = []
        let current: Node | null = node

        while (current && current !== document.body) {
            const parent = current.parentNode
            if (parent) {
                const index = Array.from(parent.childNodes).indexOf(current as ChildNode)
                path.unshift(index)
            }
            current = parent
        }

        return path.join('.')
    }

    return (
        <>
            {tooltip && (
                <div
                    className="highlight-tooltip fixed bg-black text-white px-3 py-2 rounded shadow-lg text-sm z-[10000]"
                    style={{ left: tooltip.x, top: tooltip.y - 40 }}>
                    {tooltip.text.slice(0, 50)}...
                </div>
            )}
        </>
    )
}

export default HighlighterContent