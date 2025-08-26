'use client'
import { useState } from 'react'


export function Topbar() {
    const [search, setSearch] = useState('')
    return (
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-white px-4">
            <button
                className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
                onClick={() => document.dispatchEvent(new CustomEvent('sidebar:toggle'))}
                aria-label="Toggle sidebar"
            >
                ☰
            </button>
            <div className="font-semibold">Admin</div>
            <div className="mx-2 h-6 w-px bg-gray-200" />
            <input
                className="min-w-0 flex-1 rounded-lg border bg-gray-50 px-3 py-1.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="ml-auto flex items-center gap-3">
                <div className="hidden text-sm text-gray-500 sm:block">Status: OK</div>
                <div className="h-8 w-8 select-none rounded-full bg-brand-600 text-center text-white">U</div>
            </div>
        </header>
    )
}