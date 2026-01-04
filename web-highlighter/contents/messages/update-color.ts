// 文件: contents/messages/update-color.ts

import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const { color } = req.body

    // 更新当前选择的颜色
    console.log(`颜色已更新为: ${color}`)

    // 这里可以添加更多逻辑，比如更新 UI 提示等

    res.send({ success: true, color })
}

export default handler