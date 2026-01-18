// 文件: utils/storage.ts

import { Storage } from "@plasmohq/storage"
import type { TabGroup, TabSession } from "~types/tab"

const storage = new Storage()

export const saveTabGroup = async (group: TabGroup): Promise<void> => {
    const groups = await getTabGroups()
    const existingIndex = groups.findIndex(g => g.id === group.id)

    if (existingIndex >= 0) {
        groups[existingIndex] = group
    } else {
        groups.push(group)
    }

    await storage.set("tab-groups", groups)
}

export const getTabGroups = async (): Promise<TabGroup[]> => {
    return await storage.get("tab-groups") || []
}

export const deleteTabGroup = async (groupId: string): Promise<void> => {
    const groups = await getTabGroups()
    const filtered = groups.filter(g => g.id !== groupId)
    await storage.set("tab-groups", filtered)
}

export const saveSession = async (session: TabSession): Promise<void> => {
    const sessions = await getSessions()
    sessions.unshift(session)
    // 只保留最近20个会话
    await storage.set("tab-sessions", sessions.slice(0, 20))
}

export const getSessions = async (): Promise<TabSession[]> => {
    return await storage.get("tab-sessions") || []
}