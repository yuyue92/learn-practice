'use client'

import { cn } from '@/lib/utils'

interface ListItem {
  id: string
  title: string
  description?: string
  extra?: React.ReactNode
  avatar?: React.ReactNode
  actions?: React.ReactNode
}

interface ListProps {
  items: ListItem[]
  loading?: boolean
  className?: string
  onItemClick?: (item: ListItem) => void
  divided?: boolean
}

export function List({
  items,
  loading = false,
  className,
  onItemClick,
  divided = true
}: ListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        暂无数据
      </div>
    )
  }

  return (
    <div className={cn("bg-white rounded-lg border border-gray-200", className)}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "px-6 py-4 hover:bg-gray-50",
            divided && index !== items.length - 1 && "border-b border-gray-200",
            onItemClick && "cursor-pointer"
          )}
          onClick={() => onItemClick?.(item)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              {item.avatar && (
                <div className="flex-shrink-0">
                  {item.avatar}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-gray-500 truncate">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {item.extra && (
                <div className="text-sm text-gray-500">
                  {item.extra}
                </div>
              )}
              
              {item.actions && (
                <div className="flex items-center space-x-2">
                  {item.actions}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface CardListProps {
  items: ListItem[]
  loading?: boolean
  className?: string
  onItemClick?: (item: ListItem) => void
  columns?: number
}

export function CardList({
  items,
  loading = false,
  className,
  onItemClick,
  columns = 3
}: CardListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        暂无数据
      </div>
    )
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  }

  return (
    <div className={cn(
      "grid gap-4",
      gridCols[columns as keyof typeof gridCols] || 'grid-cols-3',
      className
    )}>
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow",
            onItemClick && "cursor-pointer"
          )}
          onClick={() => onItemClick?.(item)}
        >
          {item.avatar && (
            <div className="mb-3">
              {item.avatar}
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">
              {item.title}
            </h3>
            
            {item.description && (
              <p className="text-sm text-gray-500 line-clamp-2">
                {item.description}
              </p>
            )}
            
            {item.extra && (
              <div className="text-sm text-gray-500">
                {item.extra}
              </div>
            )}
            
            {item.actions && (
              <div className="pt-2 border-t border-gray-100">
                {item.actions}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}