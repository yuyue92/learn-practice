'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { menuItems } from '@/lib/menu'


export function Sidebar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(true)


    useEffect(() => {
        const handler = () => setOpen((v) => !v)
        document.addEventListener('sidebar:toggle', handler)
        return () => document.removeEventListener('sidebar:toggle', handler)
    }, [])


    return (
        <aside
            className={
                'border-r bg-white transition-all duration-200 ' +
                (open ? 'w-60' : 'w-0 lg:w-16')
            }
        >
            <div className={(open ? 'block' : 'hidden lg:block') + ' h-14 border-b p-3'}>
                <div className="flex h-full items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">N</div>
                    <div className="text-lg font-semibold">{open ? 'Next Admin' : ''}</div>
                </div>
            </div>
            <nav className={(open ? 'block' : 'hidden lg:block') + ' space-y-1 p-2'}>
                {menuItems.map((item) => {
                    const active = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={
                                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium ' +
                                (active
                                    ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200'
                                    : 'text-gray-700 hover:bg-gray-100')
                            }
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span className="truncate">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}