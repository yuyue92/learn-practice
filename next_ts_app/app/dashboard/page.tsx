"use client"
import { useState } from "react"

export default function DashboardPage() {
    const [posts, setposts] = useState([]);
    async function getPosts() {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts', { cache: 'no-store' })
        return res.json()
    }
    const handleClickGET = async() => {
        const result = await getPosts()
        setposts(result)
        console.log('resss: ', result )
    }
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

            <div className="border p-2">
                <h1 className="border-b-2">Latest Posts
                    <button onClick={ handleClickGET } className="bg-blue-600 text-white p-2 m-2 rounded">getData</button>
                </h1>
                <ul>
                    {posts.slice(0, 10).map((p: any) => (
                        <li key={p.id}>{p.title}</li>
                    ))}
                </ul>
            </div>

        </section>
    )
}