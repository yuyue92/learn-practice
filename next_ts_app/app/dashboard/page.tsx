export default function DashboardPage() {
    return (
        <section className="space-y-4">
            <h2 className="text-xl font-semibold">Dashboard</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border bg-white p-4 shadow-sm">
                    <div className="text-sm text-gray-500">Stats</div>
                    <div className="mt-2 text-3xl font-bold">1,234</div>
                </div>
                <div className="rounded-2xl border bg-white p-4 shadow-sm">
                    <div className="text-sm text-gray-500">Active Users</div>
                    <div className="mt-2 text-3xl font-bold">98</div>
                </div>
            </div>
        </section>
    )
}