export default function UsersPage() {
    const rows = [
        { id: 1, name: 'Alice', role: 'Admin' },
        { id: 2, name: 'Bob', role: 'Editor' },
        { id: 3, name: 'Cara', role: 'Viewer' }
    ]
    return (
        <section>
            <h2 className="mb-4 text-xl font-semibold">Users</h2>
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                <table className="min-w-full table-fixed">
                    <thead>
                        <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-600">
                            <th className="p-3">ID</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.id} className="border-t">
                                <td className="p-3">{r.id}</td>
                                <td className="p-3">{r.name}</td>
                                <td className="p-3">{r.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}