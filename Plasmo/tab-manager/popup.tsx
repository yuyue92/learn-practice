// ============================================
// 4. Popup 主界面
// ============================================
// 文件: popup.tsx

import { useEffect, useState } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import type { TabGroup, SavedTab, TabSession } from "./types/tab"
import { GROUP_COLORS } from "./types/tab"
import {
  getAllTabs,
  getCurrentWindowTabs,
  closeTabs,
  groupTabsByDomain,
  saveDuplicateTabs
} from "./utils/tabUtils"
import { saveTabGroup, getTabGroups, deleteTabGroup, getSessions } from "./utils/storage"
import "./style.css"

function TabManagerPopup() {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([])
  const [groups, setGroups] = useStorage<TabGroup[]>("tab-groups", [])
  const [sessions, setSessions] = useState<TabSession[]>([])
  const [activeView, setActiveView] = useState<'tabs' | 'groups' | 'sessions'>('tabs')
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTabs, setSelectedTabs] = useState<Set<number>>(new Set())
  const [stats, setStats] = useState({ total: 0, windows: 0, duplicates: 0 })

  useEffect(() => {
    loadTabs()
    loadSessions()
    calculateStats()
  }, [])

  const loadTabs = async () => {
    const currentTabs = await getCurrentWindowTabs()
    setTabs(currentTabs)
  }

  const loadSessions = async () => {
    const savedSessions = await getSessions()
    setSessions(savedSessions)
  }

  const calculateStats = async () => {
    const allTabs = await getAllTabs()
    const windows = await chrome.windows.getAll()
    const duplicates = saveDuplicateTabs(allTabs)

    setStats({
      total: allTabs.length,
      windows: windows.length,
      duplicates: duplicates.length
    })
  }

  const closeSelectedTabs = async () => {
    const tabIds = Array.from(selectedTabs)
    await closeTabs(tabIds)
    setSelectedTabs(new Set())
    loadTabs()
    calculateStats()
  }

  const closeDuplicateTabs = () => {
    chrome.runtime.sendMessage({ action: 'closeDuplicates' }, (response) => {
      if (response.closed > 0) {
        alert(`已关闭 ${response.closed} 个重复标签页`)
        loadTabs()
        calculateStats()
      } else {
        alert('没有发现重复的标签页')
      }
    })
  }

  const saveCurrentSession = async () => {
    const name = prompt('请输入会话名称:')
    if (!name) return

    const allTabs = await getAllTabs()
    const session: TabSession = {
      id: Date.now().toString(),
      name,
      tabs: allTabs.map(tab => ({
        url: tab.url || '',
        title: tab.title || '',
        favIconUrl: tab.favIconUrl,
        savedAt: Date.now()
      })),
      timestamp: Date.now()
    }

    await saveSession(session)
    loadSessions()
    alert('会话已保存！')
  }

  const createGroupFromSelected = async () => {
    if (selectedTabs.size === 0) {
      alert('请先选择要分组的标签页')
      return
    }

    const name = prompt('请输入分组名称:')
    if (!name) return

    const selectedTabData = tabs.filter(tab => tab.id && selectedTabs.has(tab.id))
    const group: TabGroup = {
      id: Date.now().toString(),
      name,
      color: GROUP_COLORS[Math.floor(Math.random() * GROUP_COLORS.length)].color,
      tabs: selectedTabData.map(tab => ({
        url: tab.url || '',
        title: tab.title || '',
        favIconUrl: tab.favIconUrl,
        savedAt: Date.now()
      })),
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    await saveTabGroup(group)
    setGroups([...groups, group])
    setSelectedTabs(new Set())
    alert('分组已创建！')
  }

  const openGroup = async (group: TabGroup) => {
    for (const tab of group.tabs) {
      await chrome.tabs.create({ url: tab.url, active: false })
    }
    alert(`已打开 ${group.tabs.length} 个标签页`)
  }

  const restoreSession = async (session: TabSession) => {
    if (confirm(`确定要恢复这个会话吗？将打开 ${session.tabs.length} 个标签页`)) {
      for (const tab of session.tabs) {
        await chrome.tabs.create({ url: tab.url, active: false })
      }
    }
  }

  const filteredTabs = tabs.filter(tab =>
    tab.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tab.url?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleTabSelection = (tabId: number) => {
    const newSelected = new Set(selectedTabs)
    if (newSelected.has(tabId)) {
      newSelected.delete(tabId)
    } else {
      newSelected.add(tabId)
    }
    setSelectedTabs(newSelected)
  }

  return (
    <div className="w-[600px] h-[700px] bg-white flex flex-col">
      {/* 顶部栏 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span>📑</span>
          <span>智能标签页管理器</span>
        </h1>

        {/* 统计信息 */}
        <div className="flex gap-4 mt-3 text-sm">
          <div className="bg-white/20 rounded px-3 py-1">
            <span className="opacity-80">总计:</span>
            <span className="font-bold ml-1">{stats.total}</span>
          </div>
          <div className="bg-white/20 rounded px-3 py-1">
            <span className="opacity-80">窗口:</span>
            <span className="font-bold ml-1">{stats.windows}</span>
          </div>
          <div className="bg-white/20 rounded px-3 py-1">
            <span className="opacity-80">重复:</span>
            <span className="font-bold ml-1">{stats.duplicates}</span>
          </div>
        </div>
      </div>

      {/* 导航标签 */}
      <div className="flex border-b bg-gray-50">
        {(['tabs', 'groups', 'sessions'] as const).map(view => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`flex-1 py-3 font-medium transition-colors ${activeView === view
              ? 'bg-white text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
              }`}>
            {view === 'tabs' && '当前标签'}
            {view === 'groups' && `分组 (${groups.length})`}
            {view === 'sessions' && `会话 (${sessions.length})`}
          </button>
        ))}
      </div>

      {/* 搜索栏 */}
      {activeView === 'tabs' && (
        <div className="p-3 border-b bg-white">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索标签页..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      )}

      {/* 主内容区域 */}
      <div className="flex-1 overflow-y-auto">
        {activeView === 'tabs' && (
          <div>
            {filteredTabs.map(tab => (
              <div
                key={tab.id}
                className={`flex items-center gap-3 p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors ${selectedTabs.has(tab.id!) ? 'bg-blue-50' : ''
                  }`}
                onClick={() => tab.id && toggleTabSelection(tab.id)}>
                <input
                  type="checkbox"
                  checked={selectedTabs.has(tab.id!)}
                  onChange={() => { }}
                  className="w-4 h-4"
                />
                <img
                  src={tab.favIconUrl || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>'}
                  alt=""
                  className="w-4 h-4"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">
                    {tab.title}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {tab.url}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    chrome.tabs.update(tab.id!, { active: true })
                  }}
                  className="text-blue-600 hover:text-blue-800 text-xs">
                  激活
                </button>
              </div>
            ))}
          </div>
        )}

        {activeView === 'groups' && (
          <div className="p-3 space-y-3">
            {groups.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>暂无分组</p>
                <p className="text-sm mt-2">选择标签页后创建分组</p>
              </div>
            ) : (
              groups.map(group => (
                <div key={group.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: group.color }}
                      />
                      <h3 className="font-semibold text-gray-800">{group.name}</h3>
                      <span className="text-xs text-gray-500">({group.tabs.length})</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openGroup(group)}
                        className="text-sm text-blue-600 hover:text-blue-800">
                        打开
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('确定要删除这个分组吗？')) {
                            await deleteTabGroup(group.id)
                            setGroups(groups.filter(g => g.id !== group.id))
                          }
                        }}
                        className="text-sm text-red-600 hover:text-red-800">
                        删除
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {group.tabs.slice(0, 3).map((tab, i) => (
                      <div key={i} className="text-xs text-gray-600 truncate">
                        • {tab.title}
                      </div>
                    ))}
                    {group.tabs.length > 3 && (
                      <div className="text-xs text-gray-400">
                        还有 {group.tabs.length - 3} 个标签...
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeView === 'sessions' && (
          <div className="p-3 space-y-3">
            {sessions.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>暂无会话</p>
                <p className="text-sm mt-2">点击下方按钮保存当前会话</p>
              </div>
            ) : (
              sessions.map(session => (
                <div key={session.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{session.name}</h3>
                    <button
                      onClick={() => restoreSession(session)}
                      className="text-sm text-blue-600 hover:text-blue-800">
                      恢复
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {new Date(session.timestamp).toLocaleString('zh-CN')} • {session.tabs.length} 个标签
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    {session.tabs.slice(0, 2).map((tab, i) => (
                      <div key={i} className="truncate">• {tab.title}</div>
                    ))}
                    {session.tabs.length > 2 && (
                      <div className="text-gray-400">还有 {session.tabs.length - 2} 个...</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="border-t bg-white p-3 space-y-2">
        {activeView === 'tabs' && (
          <>
            <div className="flex gap-2">
              <button
                onClick={createGroupFromSelected}
                disabled={selectedTabs.size === 0}
                className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium">
                创建分组 ({selectedTabs.size})
              </button>
              <button
                onClick={closeSelectedTabs}
                disabled={selectedTabs.size === 0}
                className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium">
                关闭选中
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={closeDuplicateTabs}
                className="flex-1 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm">
                关闭重复
              </button>
              <button
                onClick={saveCurrentSession}
                className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
                保存会话
              </button>
            </div>
          </>
        )}

        {activeView === 'groups' && (
          <button
            onClick={() => setActiveView('tabs')}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
            返回标签页
          </button>
        )}

        {activeView === 'sessions' && (
          <button
            onClick={saveCurrentSession}
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
            保存当前会话
          </button>
        )}
      </div>
    </div>
  )
}

export default TabManagerPopup