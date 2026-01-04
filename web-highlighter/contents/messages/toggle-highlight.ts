// 文件: contents/messages/toggle-highlight.ts

import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const { enabled, color } = req.body

    if (enabled) {
        document.body.style.cursor = 'text'
        console.log(`高亮模式已启用，当前颜色: ${color}`)
    } else {
        document.body.style.cursor = 'default'
        console.log('高亮模式已禁用')
    }

    res.send({ success: true })
}

export default handler