// / ============================================
// 2. 工具函数
// ============================================
// 文件: utils/tabUtils.ts

import type { SavedTab, TabGroup } from "~types/tab"

export const getAllTabs = async (): Promise<chrome.tabs.Tab[]> => {
    return await chrome.tabs.query({})
}

export const getCurrentWindowTabs = async (): Promise<chrome.tabs.Tab[]> => {
    return await chrome.tabs.query({ currentWindow: true })
}

export const getTabsByUrl = async (urlPattern: string): Promise<chrome.tabs.Tab[]> => {
    const allTabs = await getAllTabs()
    return allTabs.filter(tab => tab.url?.includes(urlPattern))
}

export const closeTabs = async (tabIds: number[]): Promise<void> => {
    await chrome.tabs.remove(tabIds)
}

export const duplicateTab = async (tabId: number): Promise<chrome.tabs.Tab> => {
    return await chrome.tabs.duplicate(tabId)
}

export const groupTabsByDomain = (tabs: chrome.tabs.Tab[]): Map<string, chrome.tabs.Tab[]> => {
    const grouped = new Map<string, chrome.tabs.Tab[]>()

    tabs.forEach(tab => {
        if (!tab.url) return

        try {
            const domain = new URL(tab.url).hostname
            if (!grouped.has(domain)) {
                grouped.set(domain, [])
            }
            grouped.get(domain)!.push(tab)
        } catch (e) {
            console.error('Invalid URL:', tab.url)
        }
    })

    return grouped
}

export const openTabsFromGroup = async (group: TabGroup): Promise<void> => {
    for (const tab of group.tabs) {
        await chrome.tabs.create({ url: tab.url, active: false })
    }
}

export const saveDuplicateTabs = (tabs: chrome.tabs.Tab[]): chrome.tabs.Tab[] => {
    const seen = new Set<string>()
    const duplicates: chrome.tabs.Tab[] = []

    tabs.forEach(tab => {
        if (tab.url && seen.has(tab.url)) {
            duplicates.push(tab)
        } else if (tab.url) {
            seen.add(tab.url)
        }
    })

    return duplicates
}