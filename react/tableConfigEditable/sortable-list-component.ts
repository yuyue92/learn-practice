import React, { useState, useMemo } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { ArrowUpward, ArrowDownward, UnfoldMore } from '@mui/icons-material';
import { Empty } from '@/components/common';

interface ColumnConfig {
    key: string;
    label: string;
    width?: number | string;
    render?: (value: any, row: any) => React.ReactNode;
    sortable?: boolean; // 是否可排序
    sortType?: 'string' | 'number' | 'date'; // 排序类型
    customSort?: (a: any, b: any) => number; // 自定义排序函数
}

interface ListWithHeaderProps {
    columns: ColumnConfig[];
    data: any[];
    height?: number | string;
    showHeader?: boolean;
    onRowClick?: (row: any, index: number) => void;
    showIndex?: boolean;
    indexColumnWidth?: number | string;
    indexColumnLabel?: string;
    defaultSortKey?: string; // 默认排序字段
    defaultSortOrder?: 'asc' | 'desc'; // 默认排序方向
}

type SortOrder = 'asc' | 'desc' | null;

const ListWithHeader: React.FC<ListWithHeaderProps> = ({
    columns,
    data,
    height = 400,
    showHeader = true,
    onRowClick,
    showIndex = false,
    indexColumnWidth = 60,
    indexColumnLabel = 'No.',
    defaultSortKey,
    defaultSortOrder = 'asc'
}) => {
    const [sortKey, setSortKey] = useState<string | null>(defaultSortKey || null);
    const [sortOrder, setSortOrder] = useState<SortOrder>(defaultSortKey ? defaultSortOrder : null);

    // 所有列配置，包括索引列
    const allColumns = showIndex 
        ? [
            {
                key: '_index',
                label: indexColumnLabel,
                width: indexColumnWidth,
                sortable: false
            },
            ...columns
        ]
        : columns;

    // 排序逻辑
    const sortedData = useMemo(() => {
        if (!sortKey || !sortOrder) return data;

        const column = columns.find(col => col.key === sortKey);
        if (!column) return data;

        return [...data].sort((a, b) => {
            // 使用自定义排序函数
            if (column.customSort) {
                return sortOrder === 'asc' 
                    ? column.customSort(a, b)
                    : column.customSort(b, a);
            }

            const aVal = a[sortKey];
            const bVal = b[sortKey];

            // 处理空值
            if (aVal == null && bVal == null) return 0;
            if (aVal == null) return 1;
            if (bVal == null) return -1;

            // 根据类型排序
            let result = 0;
            switch (column.sortType) {
                case 'number':
                    result = Number(aVal) - Number(bVal);
                    break;
                case 'date':
                    result = new Date(aVal).getTime() - new Date(bVal).getTime();
                    break;
                case 'string':
                default:
                    result = String(aVal).localeCompare(String(bVal));
                    break;
            }

            return sortOrder === 'asc' ? result : -result;
        });
    }, [data, sortKey, sortOrder, columns]);

    // 处理排序点击
    const handleSort = (columnKey: string) => {
        const column = allColumns.find(col => col.key === columnKey);
        if (!column?.sortable) return;

        if (sortKey === columnKey) {
            // 同一列：asc -> desc -> null
            if (sortOrder === 'asc') {
                setSortOrder('desc');
            } else if (sortOrder === 'desc') {
                setSortOrder(null);
                setSortKey(null);
            }
        } else {
            // 新列：设置为 asc
            setSortKey(columnKey);
            setSortOrder('asc');
        }
    };

    // 获取排序图标
    const getSortIcon = (columnKey: string) => {
        if (sortKey !== columnKey) {
            return <UnfoldMore sx={{ fontSize: 16, opacity: 0.3 }} />;
        }
        if (sortOrder === 'asc') {
            return <ArrowUpward sx={{ fontSize: 16 }} />;
        }
        return <ArrowDownward sx={{ fontSize: 16 }} />;
    };

    return (
        <Box
            sx={{
                height,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden'
            }}
        >
            {/* 表头 */}
            {showHeader && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        py: 1,
                        px: 2,
                        backgroundColor: 'action.selected',
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    {allColumns.map((column, colIndex) => (
                        <Box
                            key={column.key}
                            onClick={() => handleSort(column.key)}
                            sx={{
                                width: column.width || 'auto',
                                flex: column.width ? 'none' : 1,
                                minWidth: 0,
                                display: 'flex',
                                alignItems: 'center',
                                ml: colIndex > 0 ? 2 : 0,
                                cursor: column.sortable ? 'pointer' : 'default',
                                '&:hover': column.sortable ? {
                                    '& .sort-icon': {
                                        opacity: 1
                                    }
                                } : {}
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1,
                                    textAlign: 'left'
                                }}
                            >
                                {column.label}
                            </Typography>
                            {column.sortable && (
                                <Box
                                    className="sort-icon"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        ml: 0.5,
                                        opacity: sortKey === column.key ? 1 : 0.3,
                                        transition: 'opacity 0.2s'
                                    }}
                                >
                                    {getSortIcon(column.key)}
                                </Box>
                            )}
                        </Box>
                    ))}
                </Box>
            )}

            {/* 列表内容 */}
            <Box sx={{ overflow: 'auto', height: showHeader ? 'calc(100% - 45px)' : '100%' }}>
                {sortedData.length === 0 ? (
                    <Empty wrapClassName="emptyWrap"/>
                ) : (
                    sortedData.map((row, index) => (
                        <Box
                            key={row.id || index}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                py: 1,
                                px: 2,
                                borderBottom: index < sortedData.length - 1 ? '1px solid' : 'none',
                                borderColor: 'divider',
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                    cursor: onRowClick ? 'pointer' : 'default'
                                }
                            }}
                            onClick={() => onRowClick && onRowClick(row, index)}
                        >
                            {allColumns.map((column, colIndex) => (
                                <Box
                                    key={column.key}
                                    sx={{
                                        width: column.width || 'auto',
                                        flex: column.width ? 'none' : 1,
                                        minWidth: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        ml: colIndex > 0 ? 2 : 0
                                    }}
                                >
                                    <Tooltip 
                                        title={
                                            column.key === '_index' 
                                                ? index + 1
                                                : column.render 
                                                    ? column.render(row[column.key], row)
                                                    : row[column.key]
                                        } 
                                        arrow 
                                        placement='top-start'
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                width: '100%',
                                                textAlign: 'left'
                                            }}
                                        >
                                            {column.key === '_index'
                                                ? index + 1
                                                : column.render
                                                    ? column.render(row[column.key], row)
                                                    : row[column.key]
                                            }
                                        </Typography>
                                    </Tooltip>
                                </Box>
                            ))}
                        </Box>
                    ))
                )}
            </Box>
        </Box>
    );
};

export default ListWithHeader;

// ============= 使用示例 =============

/*
const columns = [
    {
        label: 'EE Account Number',
        key: 'memAcctCode',
        width: 200,
        sortable: true,
        sortType: 'string' as const
    },
    {
        label: 'EE Name',
        key: 'firstName',
        sortable: true,
        sortType: 'string' as const
    },
    {
        label: 'Error',
        key: 'errCount',
        width: 140,
        sortable: true,
        sortType: 'number' as const
    },
    {
        label: 'RI',
        key: 'ddeRi',
        width: 140,
        sortable: true,
        sortType: 'number' as const,
        render: (amount: number) => toThousandSeparator(amount)
    },
    {
        label: 'Date',
        key: 'contrPeriodStartDate',
        width: 250,
        sortable: true,
        sortType: 'date' as const
    },
    {
        label: 'Custom Sort',
        key: 'customField',
        sortable: true,
        customSort: (a, b) => {
            // 自定义排序逻辑
            return a.customField.length - b.customField.length;
        }
    }
];

<LightweightList 
    height={240} 
    showIndex={true} 
    columns={columns} 
    data={filteredMemInfo} 
    onRowClick={(row, idx) => handleTableRowClick(row)}
    defaultSortKey="errCount"  // 默认按错误数排序
    defaultSortOrder="desc"     // 降序
/>
*/