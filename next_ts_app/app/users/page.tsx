"use client"
import { useUserInfoStore } from "store/useStore1";
export default function UsersPage() {
    const { userList, addOnUser, deleteUser } = useUserInfoStore();

    const handleAddUser = () => {
        addOnUser()
    }
    return (
        <section>
            <h2 className="mb-4 text-xl font-semibold">
                <span>User-list: {userList.length}</span>
                <button onClick={handleAddUser} className="bg-blue-600 text-white p-2 m-2 rounded">AddUser</button>
            </h2>
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                <table className="min-w-full table-fixed">
                    <thead>
                        <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-600">
                            <th className="p-3">ID</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map((r) => (
                            <tr key={r.id} className="border-t">
                                <td className="p-3">{r.id}</td>
                                <td className="p-3">{r.name}</td>
                                <td className="p-3">{r.role}</td>
                                <td className="p-3"><button onClick={() => deleteUser(r.id)} className="bg-blue-600 text-white p-1 m-1 rounded">delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}