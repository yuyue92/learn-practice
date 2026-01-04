// ============================================
// 文件: components/SearchBar.tsx
// ============================================

import { useState } from "react"

interface SearchBarProps {
    onSearch: (term: string) => void
    placeholder?: string
}

export const SearchBar = ({
    onSearch,
    placeholder = "搜索高亮内容..."
}: SearchBarProps) => {
    const [searchTerm, setSearchTerm] = useState("")

    const handleChange = (value: string) => {
        setSearchTerm(value)
        onSearch(value)
    }

    const handleClear = () => {
        setSearchTerm("")
        onSearch("")
    }

    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>

            <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />

            {searchTerm && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            )}
        </div>
    )
}