import { useEffect, useState } from 'react'
import { fetchUsers, createUser, updateUser, deleteUser } from '../api'
import Modal from '../components/Modal'
import UserForm from '../components/UserForm'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    const data = await fetchUsers()
    setUsers(data)
  }

  async function handleSave(user) {
    const payload = {...user, age: parseFloat(user.age)}
    if (editingUser) {
      await updateUser(editingUser.id, payload)
    } else {
      await createUser(payload)
    }
    setShowModal(false)
    setEditingUser(null)
    loadUsers()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mb-4" onClick={() => setShowModal(true)}>
        + Add User
      </button>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="hover:bg-gray-100">
              <td className="p-2 border">{u.id}</td>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded mr-2" onClick={() => { setEditingUser(u); setShowModal(true) }}>Edit</button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded" onClick={() => deleteUser(u.id).then(loadUsers)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <Modal title={editingUser ? 'Edit User' : 'Add User'} onClose={() => { setShowModal(false); setEditingUser(null) }}>
          <UserForm user={editingUser} onSave={handleSave} />
        </Modal>
      )}
    </div>
  )
}
