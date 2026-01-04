// 文件: contents/messages/clear-highlights.ts

import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    // 移除所有高亮标记
    const highlights = document.querySelectorAll('.highlight-marker')
    highlights.forEach(highlight => {
        const parent = highlight.parentNode
        if (parent) {
            // 将高亮文本恢复为普通文本
            const textNode = document.createTextNode(highlight.textContent || '')
            parent.replaceChild(textNode, highlight)
        }
    })

    res.send({ success: true })
}

export default handler