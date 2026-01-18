// ============================================
// 3. Background Script
// ============================================
// 文件: background.ts

import { saveSession } from "./utils/storage"
import type { TabSession } from "./types/tab"

// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        console.log('标签页加载完成:', tab.title)
    }
})

// 监听标签页关闭
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    console.log('标签页已关闭:', tabId)
})

// 自动保存会话（每5分钟）
setInterval(async () => {
    const tabs = await chrome.tabs.query({})
    const session: TabSession = {
        id: Date.now().toString(),
        name: `自动保存 ${new Date().toLocaleString('zh-CN')}`,
        tabs: tabs.map(tab => ({
            url: tab.url || '',
            title: tab.title || '',
            favIconUrl: tab.favIconUrl,
            savedAt: Date.now()
        })),
        timestamp: Date.now()
    }

    await saveSession(session)
}, 5 * 60 * 1000)

// 监听来自 popup 的命令
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'closeAllTabs') {
        chrome.tabs.query({}, (tabs) => {
            const tabIds = tabs.map(tab => tab.id).filter(id => id !== undefined) as number[]
            chrome.tabs.remove(tabIds)
            sendResponse({ success: true })
        })
        return true
    }

    if (request.action === 'closeDuplicates') {
        chrome.tabs.query({}, (tabs) => {
            const seen = new Set<string>()
            const duplicates: number[] = []

            tabs.forEach(tab => {
                if (tab.url && seen.has(tab.url) && tab.id) {
                    duplicates.push(tab.id)
                } else if (tab.url) {
                    seen.add(tab.url)
                }
            })

            if (duplicates.length > 0) {
                chrome.tabs.remove(duplicates)
            }

            sendResponse({ closed: duplicates.length })
        })
        return true
    }
})

// 快捷键命令
chrome.commands.onCommand.addListener((command) => {
    if (command === 'save-session') {
        chrome.tabs.query({}, async (tabs) => {
            const session: TabSession = {
                id: Date.now().toString(),
                name: `快捷键保存 ${new Date().toLocaleString('zh-CN')}`,
                tabs: tabs.map(tab => ({
                    url: tab.url || '',
                    title: tab.title || '',
                    favIconUrl: tab.favIconUrl,
                    savedAt: Date.now()
                })),
                timestamp: Date.now()
            }

            await saveSession(session)

            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'assets/icon.png',
                title: '会话已保存',
                message: `已保存 ${tabs.length} 个标签页`
            })
        })
    }
})