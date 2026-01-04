// ============================================
// 文件: popup.tsx (使用组件的版本)
// ============================================

import { useEffect, useState } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { sendToContentScript } from "@plasmohq/messaging"
import type { Highlight, ColorKey } from "./types/highlight"
import { ColorPicker } from "./components/ColorPicker"
import { HighlightList } from "./components/HighlightList"
import "./style.css"

function IndexPopup() {
  const [highlights, setHighlights] = useStorage<Highlight[]>("highlights", [])
  const [currentColor, setCurrentColor] = useStorage<ColorKey>("current-color", "yellow")
  const [isHighlighting, setIsHighlighting] = useStorage("is-highlighting", false)
  const [currentUrl, setCurrentUrl] = useState("")

  useEffect(() => {
    // 获取当前标签页 URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url)
      }
    })
  }, [])

  const toggleHighlightMode = async () => {
    const newState = !isHighlighting
    setIsHighlighting(newState)

    // 通知 content script
    try {
      await sendToContentScript({
        name: "toggle-highlight",
        body: { enabled: newState, color: currentColor }
      })
    } catch (error) {
      console.error("无法发送消息到 content script:", error)
    }
  }

  const clearHighlights = async () => {
    if (confirm("确定要清除当前页面的所有高亮吗？")) {
      const newHighlights = highlights.filter(h => h.url !== currentUrl)
      setHighlights(newHighlights)

      try {
        await sendToContentScript({
          name: "clear-highlights"
        })
      } catch (error) {
        console.error("清除高亮失败:", error)
      }
    }
  }

  const deleteHighlight = (id: string) => {
    setHighlights(highlights.filter(h => h.id !== id))
  }

  const handleColorChange = async (color: ColorKey) => {
    setCurrentColor(color)

    // 如果高亮模式已启用，更新 content script 的颜色
    if (isHighlighting) {
      try {
        await sendToContentScript({
          name: "update-color",
          body: { color }
        })
      } catch (error) {
        console.error("更新颜色失败:", error)
      }
    }
  }

  const pageHighlights = highlights.filter(h => h.url === currentUrl)

  return (
    <div className="w-96 bg-white">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span>🖍️</span>
          <span>智能高亮工具</span>
        </h1>
        <p className="text-sm text-indigo-100 mt-1">
          选择颜色，然后选中文本进行高亮
        </p>
      </div>

      {/* 颜色选择器组件 */}
      <ColorPicker
        selectedColor={currentColor}
        onColorChange={handleColorChange}
      />

      {/* 控制按钮 */}
      <div className="p-4 space-y-2 border-b">
        <button
          onClick={toggleHighlightMode}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${isHighlighting
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-md'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}>
          {isHighlighting ? (
            <span className="flex items-center justify-center gap-2">
              <span>✓</span>
              <span>高亮模式已启用</span>
            </span>
          ) : (
            '启用高亮模式'
          )}
        </button>

        {pageHighlights.length > 0 && (
          <button
            onClick={clearHighlights}
            className="w-full py-2 px-4 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-medium transition-all">
            清除当前页面高亮 ({pageHighlights.length})
          </button>
        )}
      </div>

      {/* 高亮列表 */}
      <div className="border-t bg-gray-50">
        <div className="p-4">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center justify-between">
            <span>当前页面高亮</span>
            <span className="text-sm text-gray-500">{pageHighlights.length} 条</span>
          </h3>

          <HighlightList
            highlights={pageHighlights}
            onDelete={deleteHighlight}
            maxHeight="max-h-80"
          />
        </div>
      </div>

      {/* 统计信息 */}
      <div className="bg-gray-50 border-t p-4 text-center">
        <div className="flex items-center justify-around text-sm">
          <div>
            <div className="text-2xl font-bold text-indigo-600">{highlights.length}</div>
            <div className="text-gray-600">总高亮</div>
          </div>
          <div className="h-10 w-px bg-gray-300"></div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{pageHighlights.length}</div>
            <div className="text-gray-600">当前页</div>
          </div>
          <div className="h-10 w-px bg-gray-300"></div>
          <div>
            <div className="text-2xl font-bold text-pink-600">
              {new Set(highlights.map(h => h.url)).size}
            </div>
            <div className="text-gray-600">页面数</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup