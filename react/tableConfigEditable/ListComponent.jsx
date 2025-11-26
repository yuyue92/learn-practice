import React from 'react'

export type RowSize = 'small' | 'medium' | 'large'

export interface ColumnConfig<T> {
  /**
   * 对应数据中的字段名，或自定义 key
   * 如 dataIndex: 'name'
   */
  key: keyof T | string
  /** 列头展示文本 */
  title: string
  /** 列宽，可以是 number(px) 或百分比/其他单位 */
  width?: number | string
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /**
   * 单元格自定义渲染函数
   * @param value 当前字段值
   * @param record 当前整行数据
   * @param rowIndex 行索引
   */
  render?: (value: any, record: T, rowIndex: number) => React.ReactNode
}

export interface ListTableProps<T> {
  /** 列配置 */
  columns: ColumnConfig<T>[]
  /** 数据源 */
  data: T[]
  /**
   * 行 key，用于 React key
   *  - 可传字段名：'id'
   *  - 可传函数：(record, index) => string
   */
  rowKey: keyof T | ((record: T, index: number) => string | number)
  /** 是否显示索引列（第 1 列：1,2,3…） */
  showIndex?: boolean
  /** 索引列表头标题 */
  indexTitle?: string
  /** 行点击事件 */
  onRowClick?: (record: T, index: number) => void
  /** 行高尺寸 */
  size?: RowSize
  /** 额外 className */
  className?: string
  /** 额外 style */
  style?: React.CSSProperties
  /** 是否开启 hover 高亮 */
  hoverable?: boolean
  /** 无数据时展示文案/节点 */
  emptyText?: React.ReactNode
}

/**
 * 通用列表组件：带可选索引列 + 列配置 + 行点击
 */
export function ListTable<T extends Record<string, any>>(
  props: ListTableProps<T>
) {
  const {
    columns,
    data,
    rowKey,
    showIndex = false,
    indexTitle = '#',
    onRowClick,
    size = 'medium',
    className,
    style,
    hoverable = true,
    emptyText = 'No data',
  } = props

  const getRowKey = (record: T, index: number): React.Key => {
    if (typeof rowKey === 'function') {
      return rowKey(record, index)
    }
    return (record[rowKey] as React.Key) ?? index
  }

  const getRowHeight = (size: RowSize): number => {
    switch (size) {
      case 'small':
        return 32
      case 'large':
        return 56
      case 'medium':
      default:
        return 44
    }
  }

  const rowHeight = getRowHeight(size)

  const handleRowClick = (record: T, index: number) => {
    if (onRowClick) {
      onRowClick(record, index)
    }
  }

  const renderCellContent = (
    col: ColumnConfig<T>,
    record: T,
    rowIndex: number
  ) => {
    const { key, render } = col
    const value =
      typeof key === 'string' && key in record ? (record as any)[key] : undefined

    if (render) {
      return render(value, record, rowIndex)
    }
    return value as React.ReactNode
  }

  const wrapClassName = [
    'list-table-wrapper',
    hoverable ? 'list-table-hoverable' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapClassName} style={style}>
      <table className="list-table">
        <thead>
          <tr>
            {showIndex && (
              <th className="list-table-th list-table-th-index">{indexTitle}</th>
            )}
            {columns.map(col => {
              const widthStyle: React.CSSProperties = {}
              if (col.width !== undefined) {
                widthStyle.width =
                  typeof col.width === 'number' ? `${col.width}px` : col.width
              }
              return (
                <th
                  key={String(col.key)}
                  className="list-table-th"
                  style={{
                    textAlign: col.align ?? 'left',
                    ...widthStyle,
                  }}
                >
                  {col.title}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr className="list-table-row-empty">
              <td
                className="list-table-empty-cell"
                colSpan={columns.length + (showIndex ? 1 : 0)}
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((record, rowIndex) => (
              <tr
                key={getRowKey(record, rowIndex)}
                className="list-table-row"
                style={{ height: rowHeight }}
                onClick={() => handleRowClick(record, rowIndex)}
              >
                {showIndex && (
                  <td className="list-table-td list-table-td-index">
                    {rowIndex + 1}
                  </td>
                )}
                {columns.map(col => {
                  const widthStyle: React.CSSProperties = {}
                  if (col.width !== undefined) {
                    widthStyle.width =
                      typeof col.width === 'number'
                        ? `${col.width}px`
                        : col.width
                  }
                  return (
                    <td
                      key={String(col.key)}
                      className="list-table-td"
                      style={{
                        textAlign: col.align ?? 'left',
                        ...widthStyle,
                      }}
                    >
                      {renderCellContent(col, record, rowIndex)}
                    </td>
                  )
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 简单内置样式，你可以替换成自己项目的 CSS */}
      <style jsx>{`
        .list-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .list-table {
          width: 100%;
          border-collapse: collapse;
          border-spacing: 0;
          font-size: 14px;
        }

        .list-table-th,
        .list-table-td {
          padding: 0 12px;
          border-bottom: 1px solid #eee;
          white-space: nowrap;
        }

        .list-table-th {
          font-weight: 600;
          background-color: #fafafa;
          height: 40px;
        }

        .list-table-th-index,
        .list-table-td-index {
          width: 56px;
          text-align: center;
        }

        .list-table-row {
          cursor: pointer;
        }

        .list-table-hoverable .list-table-row:hover {
          background-color: #f5f7fa;
        }

        .list-table-row-empty .list-table-empty-cell {
          text-align: center;
          padding: 16px 0;
          color: #999;
        }
      `}</style>
    </div>
  )
}
