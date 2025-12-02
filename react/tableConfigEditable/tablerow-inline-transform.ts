// ============================================================================
// 文件: valueTransformers.ts - 值转换工具（独立文件）
// ============================================================================

export type CellType = 
    | 'text'
    | 'number'
    | 'money'
    | 'date'
    | 'phone'
    | 'email'
    | 'percentage'
    | 'select'
    | 'readonly';

interface TransformConfig {
    // 显示值转换（用户输入时实时格式化）
    toDisplay: (value: string, decimals?: number) => string;
    // 存储值转换（保存到数据时）
    toStorage: (displayValue: string) => string;
    // 焦点时转换（方便编辑）
    onFocus?: (displayValue: string) => string;
    // 失焦时转换（完整格式化）
    onBlur?: (displayValue: string, decimals?: number) => string;
    // 验证
    validate?: (value: string) => boolean;
    // 默认 placeholder
    placeholder?: string;
}

// 值转换配置映射
export const valueTransformers: Record<CellType, TransformConfig> = {
    text: {
        toDisplay: (v) => v,
        toStorage: (v) => v
    },
    
    number: {
        toDisplay: (v) => v.replace(/[^\d.-]/g, ''),
        toStorage: (v) => v,
        validate: (v) => /^-?\d+(\.\d+)?$/.test(v) || v === '',
        placeholder: '0'
    },
    
    money: {
        toDisplay: (v, decimals = 2) => {
            const cleaned = v.replace(/[^\d.]/g, '');
            const parts = cleaned.split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            if (parts[1]) parts[1] = parts[1].slice(0, decimals);
            return parts.join('.');
        },
        toStorage: (v) => v.replace(/,/g, ''),
        onFocus: (v) => v.replace(/,/g, ''), // 移除千分位方便编辑
        onBlur: (v, decimals = 2) => {
            const cleaned = v.replace(/[^\d.]/g, '');
            if (!cleaned) return '';
            const parts = cleaned.split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            if (parts[1]) parts[1] = parts[1].slice(0, decimals);
            return parts.join('.');
        },
        validate: (v) => /^\d+(\.\d{0,2})?$/.test(v.replace(/,/g, '')) || v === '',
        placeholder: '0.00'
    },
    
    date: {
        toDisplay: (v) => {
            const cleaned = v.replace(/\D/g, '');
            if (cleaned.length === 0) return '';
            if (cleaned.length <= 2) return cleaned;
            if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
            return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
        },
        toStorage: (v) => v,
        validate: (v) => /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/.test(v) || v === '',
        placeholder: 'dd/mm/yyyy'
    },
    
    phone: {
        toDisplay: (v) => v.replace(/[^\d+\-() ]/g, ''),
        toStorage: (v) => v.replace(/[\s\-()]/g, ''),
        validate: (v) => /^[+]?[(]?[\d\s\-()]{10,}$/.test(v) || v === '',
        placeholder: '+852 1234 5678'
    },
    
    email: {
        toDisplay: (v) => v.toLowerCase().trim(),
        toStorage: (v) => v,
        validate: (v) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) || v === '',
        placeholder: 'example@email.com'
    },
    
    percentage: {
        toDisplay: (v) => {
            const cleaned = v.replace(/[^\d.]/g, '');
            const num = parseFloat(cleaned);
            if (isNaN(num)) return '';
            return Math.min(100, Math.max(0, num)).toString();
        },
        toStorage: (v) => v,
        validate: (v) => {
            const num = parseFloat(v);
            return (!isNaN(num) && num >= 0 && num <= 100) || v === '';
        },
        placeholder: '0-100'
    },
    
    select: {
        toDisplay: (v) => v,
        toStorage: (v) => v
    },
    
    readonly: {
        toDisplay: (v) => v,
        toStorage: (v) => v
    }
};

// 获取转换器
export const getTransformer = (type: CellType): TransformConfig => {
    return valueTransformers[type] || valueTransformers.text;
};

// ============================================================================
// 文件: TableRow.tsx - 优化后（不拆分小组件）
// ============================================================================

import React, { memo, useState, useCallback, useRef } from 'react';
import style from './EnterTables.module.css';
import { TbHeaderProps, DataSingleProps, DataSingleListItemProps } from '../data/types';
import { getTransformer } from './valueTransformers';

interface TableRowProps {
    rowItem: DataSingleProps;
    rowIndex: number;
    tbHeaderArg: TbHeaderProps;
    versionCheckedInfor: number[][];
    registerInput: (id: string) => (node: HTMLInputElement | HTMLSelectElement | null) => void;
    onInsertRow: (rowIndex: number) => void;
    onDeleteRow: (rowIndex: number) => void;
    // 简化后的事件 - 直接传递转换后的值
    onValueChange: (value: string, cellProps: DataSingleListItemProps) => void;
    onCellFocus: (cellProps: DataSingleListItemProps) => void;
    onCellBlur: (cellProps: DataSingleListItemProps) => void;
    onCellKeydown: (event: React.KeyboardEvent, cellProps: DataSingleListItemProps) => void;
    onVersionClick: (event: React.MouseEvent<HTMLLIElement>, cellProps: DataSingleListItemProps) => void;
}

const TableRow = memo<TableRowProps>(({
    rowItem,
    rowIndex,
    tbHeaderArg,
    versionCheckedInfor,
    registerInput,
    onInsertRow,
    onDeleteRow,
    onValueChange,
    onCellFocus,
    onCellBlur,
    onCellKeydown,
    onVersionClick
}) => {
    // 存储每个单元格的显示值（用于格式化）
    const [displayValues, setDisplayValues] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};
        rowItem.list.forEach(item => {
            const key = `${item.rowIndex}_${item.columnIndex}`;
            initial[key] = item.value || '';
        });
        return initial;
    });

    // 记录当前聚焦的单元格
    const focusedCellRef = useRef<string | null>(null);

    // ========== 输入框事件处理 ==========
    
    const handleInputChange = useCallback((
        event: React.ChangeEvent<HTMLInputElement>,
        cellProps: DataSingleListItemProps
    ) => {
        const rawValue = event.target.value;
        const cellKey = `${cellProps.rowIndex}_${cellProps.columnIndex}`;
        const transformer = getTransformer(cellProps.type as any);

        // 1. 应用显示格式化
        const displayValue = transformer.toDisplay(rawValue, cellProps.decimals);
        
        // 2. 更新显示值
        setDisplayValues(prev => ({
            ...prev,
            [cellKey]: displayValue
        }));

        // 3. 转换为存储值并通知父组件
        const storageValue = transformer.toStorage(displayValue);
        onValueChange(storageValue, cellProps);
    }, [onValueChange]);

    const handleInputFocus = useCallback((
        event: React.FocusEvent<HTMLInputElement>,
        cellProps: DataSingleListItemProps
    ) => {
        const cellKey = `${cellProps.rowIndex}_${cellProps.columnIndex}`;
        focusedCellRef.current = cellKey;
        
        const transformer = getTransformer(cellProps.type as any);
        
        // 聚焦时的特殊处理（如金额去掉千分位）
        if (transformer.onFocus) {
            const currentDisplay = displayValues[cellKey] || cellProps.value;
            const focusValue = transformer.onFocus(currentDisplay);
            
            setDisplayValues(prev => ({
                ...prev,
                [cellKey]: focusValue
            }));
        }
        
        onCellFocus(cellProps);
    }, [displayValues, onCellFocus]);

    const handleInputBlur = useCallback((
        event: React.FocusEvent<HTMLInputElement>,
        cellProps: DataSingleListItemProps
    ) => {
        const cellKey = `${cellProps.rowIndex}_${cellProps.columnIndex}`;
        focusedCellRef.current = null;
        
        const transformer = getTransformer(cellProps.type as any);
        const currentDisplay = displayValues[cellKey] || '';
        
        // 失焦时的完整格式化
        if (transformer.onBlur && currentDisplay) {
            const blurValue = transformer.onBlur(currentDisplay, cellProps.decimals);
            
            setDisplayValues(prev => ({
                ...prev,
                [cellKey]: blurValue
            }));
            
            // 同时更新存储值
            const storageValue = transformer.toStorage(blurValue);
            onValueChange(storageValue, cellProps);
        }
        
        onCellBlur(cellProps);
    }, [displayValues, onValueChange, onCellBlur]);

    const handleInputKeydown = useCallback((
        event: React.KeyboardEvent<HTMLInputElement>,
        cellProps: DataSingleListItemProps
    ) => {
        onCellKeydown(event, cellProps);
    }, [onCellKeydown]);

    // ========== 下拉框事件处理 ==========
    
    const handleSelectChange = useCallback((
        event: React.ChangeEvent<HTMLSelectElement>,
        cellProps: DataSingleListItemProps
    ) => {
        const value = event.target.value;
        onValueChange(value, cellProps);
    }, [onValueChange]);

    const handleSelectFocus = useCallback((
        cellProps: DataSingleListItemProps
    ) => {
        onCellFocus(cellProps);
    }, [onCellFocus]);

    const handleSelectBlur = useCallback((
        cellProps: DataSingleListItemProps
    ) => {
        onCellBlur(cellProps);
    }, [onCellBlur]);

    // ========== 渲染单元格 ==========
    
    const renderCellContent = (item: DataSingleListItemProps) => {
        const cellKey = `${item.rowIndex}_${item.columnIndex}`;
        const isFocused = focusedCellRef.current === cellKey;
        const displayValue = displayValues[cellKey] ?? item.value ?? '';
        
        // 只读单元格
        if (item.readOnly || item.type === 'readonly') {
            const transformer = getTransformer(item.type as any);
            const formattedValue = transformer.toDisplay(item.value || '', item.decimals);
            
            return (
                <span className={item.type === 'money' ? style.selfCellMoney : ''}>
                    {formattedValue}
                </span>
            );
        }

        // 下拉选择
        if (item.type === 'select') {
            return (
                <select
                    ref={registerInput(`input_${item.rowIndex}_${item.columnIndex}`)}
                    data-testid={`${item.key}-${rowIndex}`}
                    name={item.key}
                    value={item.value}
                    disabled={item.disable}
                    className={style.selfSelect}
                    onChange={(e) => handleSelectChange(e, item)}
                    onFocus={() => handleSelectFocus(item)}
                    onBlur={() => handleSelectBlur(item)}
                >
                    <option value="" disabled>
                        select
                    </option>
                    {item.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            );
        }

        // 输入框（各种类型统一处理）
        const transformer = getTransformer(item.type as any);
        const placeholder = item.placeholder || transformer.placeholder || '';

        return (
            <div
                className={`${style.selfInputContainer} ${
                    versionCheckedInfor[item.rowIndex]?.[item.columnIndex] === 1
                        ? style.selfInputCheckSign
                        : ''
                }`}
            >
                <input
                    ref={registerInput(`input_${item.rowIndex}_${item.columnIndex}`)}
                    autoComplete="off"
                    data-testid={`${item.key}-${rowIndex}`}
                    name={item.key}
                    type="text"
                    value={displayValue}
                    placeholder={placeholder}
                    disabled={item.disable}
                    className={`${style.selfInput} ${
                        item.type === 'money' ? style.selfInputMoney : ''
                    } ${
                        item.versionError || item.valueError
                            ? style.selfInputVersionError
                            : ''
                    }`}
                    onChange={(e) => handleInputChange(e, item)}
                    onFocus={(e) => handleInputFocus(e, item)}
                    onBlur={(e) => handleInputBlur(e, item)}
                    onKeyDown={(e) => handleInputKeydown(e, item)}
                />
                
                {/* 版本错误提示列表 */}
                {item.versionError && item.showList && (
                    <ul className={style.selfUL}>
                        {item.versionList?.map((versionItem) => (
                            <li
                                key={versionItem.id}
                                onClick={(e) => onVersionClick(e, item)}
                            >
                                {versionItem.txt}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    return (
        <tr className={rowItem.errorRow ? style.selfRowError : ''}>
            {tbHeaderArg.showIndex && (
                <td className={style.selfTd}>
                    <div className={style.operation_btn_wrapper}>
                        <button
                            className={style.operation_btn}
                            onClick={() => onInsertRow(rowIndex)}
                        >
                            +
                        </button>
                        <button
                            className={style.operation_btn}
                            onClick={() => onDeleteRow(rowIndex)}
                        >
                            -
                        </button>
                        <span>{rowIndex + 1}</span>
                    </div>
                </td>
            )}
            
            {rowItem.list.map((item) => (
                <td
                    key={`td_${rowIndex}_${item.columnIndex}`}
                    className={`${style.selfTd} ${
                        item.required && !item.value && item.type !== 'select'
                            ? style.selfInputRequire
                            : ''
                    }`}
                >
                    {renderCellContent(item)}
                </td>
            ))}
        </tr>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.rowItem === nextProps.rowItem &&
        prevProps.rowIndex === nextProps.rowIndex &&
        prevProps.versionCheckedInfor === nextProps.versionCheckedInfor
    );
});

TableRow.displayName = 'TableRow';

export default TableRow;

// ============================================================================
// 父组件使用示例 - 极简版
// ============================================================================

const ParentComponent = () => {
    const [tableData, setTableData] = useState<DataSingleProps[]>([]);

    // ✅ 现在只需要一个简单的值变化处理函数
    const handleValueChange = useCallback((
        value: string,
        cellProps: DataSingleListItemProps
    ) => {
        // 直接使用已经转换好的值
        setTableData(prevData => {
            const newData = [...prevData];
            const cell = newData[cellProps.rowIndex].list[cellProps.columnIndex];
            cell.value = value;
            return newData;
        });
    }, []);

    const handleCellFocus = useCallback((cellProps: DataSingleListItemProps) => {
        // 聚焦逻辑
    }, []);

    const handleCellBlur = useCallback((cellProps: DataSingleListItemProps) => {
        // 失焦逻辑（可选的验证等）
    }, []);

    const handleCellKeydown = useCallback((
        e: React.KeyboardEvent,
        cellProps: DataSingleListItemProps
    ) => {
        // 键盘导航
    }, []);

    return (
        <table>
            <tbody>
                {tableData.map((rowItem, rowIndex) => (
                    <TableRow
                        key={rowIndex}
                        rowItem={rowItem}
                        rowIndex={rowIndex}
                        tbHeaderArg={tbHeaderConfig}
                        versionCheckedInfor={versionCheckedInfor}
                        registerInput={registerInput}
                        onInsertRow={handleInsertRow}
                        onDeleteRow={handleDeleteRow}
                        onValueChange={handleValueChange}  // ✅ 统一的值变化处理
                        onCellFocus={handleCellFocus}
                        onCellBlur={handleCellBlur}
                        onCellKeydown={handleCellKeydown}
                        onVersionClick={handleVersionClick}
                    />
                ))}
            </tbody>
        </table>
    );
};

// ============================================================================
// 列配置示例
// ============================================================================

const columns = [
    { key: 'memAcctCode', type: 'text', label: 'Account' },
    { key: 'firstName', type: 'text', label: 'First Name' },
    { key: 'birthDate', type: 'date', label: 'Birth Date' },
    { key: 'mobile', type: 'phone', label: 'Mobile' },
    { key: 'email', type: 'email', label: 'Email' },
    { key: 'ddeErmc', type: 'money', label: 'ERMC', decimals: 2 },
    { key: 'ddeEemc', type: 'money', label: 'EEMC', decimals: 2 },
    { key: 'memberClass', type: 'select', label: 'Class', options: [...] }
];