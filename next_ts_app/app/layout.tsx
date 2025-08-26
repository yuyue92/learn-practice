import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'


export const metadata: Metadata = {
    title: 'Next.js TS Tailwind Admin',
    description: 'Topbar + Sidebar + Content layout'
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <div className="container-shell">
                    {/* Sidebar */}
                    <Sidebar />
                    {/* Main area */}
                    <div className="flex min-w-0 flex-1 flex-col">
                        <Topbar />
                        <main className="min-h-0 flex-1 overflow-y-auto bg-gray-50 p-4">
                            <div className="mx-auto max-w-6xl">{children}</div>
                        </main>
                    </div>
                </div>
            </body>
        </html>
    )
}