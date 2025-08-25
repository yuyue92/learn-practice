import { useState } from 'react'

export default function UserForm({ user = {}, onSave }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    age: user?.age || "",
    email: user?.email || "",
    userInfo: user?.userInfo || { ulist1: [], umap1: {} }
  });


  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form) }}>
      <label className="block mb-2">
        Name:
        <input className="border w-full p-2 rounded" name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label className="block mb-2">
        Age:
        <input className="border w-full p-2 rounded" name="age" value={form.age} onChange={handleChange} />
      </label>
      <label className="block mb-2">
        Email:
        <input className="border w-full p-2 rounded" name="email" value={form.email} onChange={handleChange} />
      </label>

      {/* 简单展示 userInfo */}
      <div className="bg-gray-100 p-2 rounded mt-3">
        <h4 className="font-semibold mb-2">UserInfo</h4>
        <textarea
          className="border w-full p-2 rounded"
          value={JSON.stringify(form.userInfo)}
          onChange={(e) => setForm({ ...form, userInfo: JSON.parse(e.target.value || '{}') })}
        />
      </div>

      <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Save</button>
    </form>
  )
}
