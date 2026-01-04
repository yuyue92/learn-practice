// ============================================
// 文件: components/StatCard.tsx
// ============================================

interface StatCardProps {
    icon: string
    label: string
    value: number | string
    color?: string
}

export const StatCard = ({
    icon,
    label,
    value,
    color = "bg-blue-500"
}: StatCardProps) => {
    return (
        <div className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
                <div className={`${color} text-white w-10 h-10 rounded-lg flex items-center justify-center text-xl`}>
                    {icon}
                </div>
                <div>
                    <div className="text-2xl font-bold text-gray-800">{value}</div>
                    <div className="text-sm text-gray-600">{label}</div>
                </div>
            </div>
        </div>
    )
}