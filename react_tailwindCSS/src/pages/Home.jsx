export default function Home() {
    return (
        <div className="max-w-6xl mx-auto space-y-4">
            <h1 className="text-2xl font-semibold">Home</h1>
            <p className="text-gray-600">
                这里是首页示例。上方菜单可切换到「TableList」页面。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border bg-white p-4">区块 A</div>
                <div className="rounded-lg border bg-white p-4">区块 B</div>
            </div>
            {/* 制造一点高度，方便看出主区域滚动条 */}
            <div className="h-96 rounded-lg border bg-white p-4">更多内容…</div>
        </div>
    )
}