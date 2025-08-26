import Link from 'next/link'
import { menuItems } from '@/lib/menu'

export default function HomePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome 👋</h1>
            <p className="text-gray-600">
                This is a minimal Next.js + TypeScript + Tailwind admin layout with a fixed top bar and a left sidebar.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {menuItems.map(item => (
                    <Link key={item.href} href={item.href} className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow">
                        <div className="text-sm font-medium text-gray-500">Go to</div>
                        <div className="text-lg font-semibold">{item.label}</div>
                    </Link>
                ))}
            </div>
        </div>
    )
}