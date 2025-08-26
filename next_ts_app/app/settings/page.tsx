'use client'
import { useState } from 'react'


export default function SettingsPage() {
    const [name, setName] = useState('Project X')
    const [enabled, setEnabled] = useState(true)


    return (
        <section className="space-y-4">
            <h2 className="text-xl font-semibold">Settings</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    alert(`Saved: name=${name}, enabled=${enabled}`)
                }}
                className="space-y-4"
            >
                <div className="rounded-2xl border bg-white p-4 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700">Project name</label>
                    <input
                        className="mt-2 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name"
                    />
                </div>
                <div className="rounded-2xl border bg-white p-4 shadow-sm">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
                        Enable feature
                    </label>
                </div>
                <button className="rounded-xl bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700">Save</button>
            </form>
        </section>
    )
}