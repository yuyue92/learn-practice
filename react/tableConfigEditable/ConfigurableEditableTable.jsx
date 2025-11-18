import React, { useState, useRef, useEffect } from 'react';
import { tableColumns, tableConfig, initialData } from './tableConfig';
import './ConfigurableEditableTable.css';

const ConfigurableEditableTable = () => {
    const [data, setData] = useState(initialData);
    const [nextId, setNextId] = useState(4);
    const tableRef = useRef(null);

    // 添加新行
    const addRow = (index = null) => {
        const newRow = {
            id: nextId,
            ...tableConfig.defaultRowData
        };

        if (index !== null) {
            // 在指定位置插入新行
            const newData = [...data];
            newData.splice(index + 1, 0, newRow);
            setData(newData);
        } else {
            // 在末尾添加新行
            setData([...data, newRow]);
        }

        setNextId(nextId + 1);
        return newRow.id;
    };

    // 删除行
    const deleteRow = (id) => {
        if (data.length <= 1) {
            alert('至少保留一行数据');
            return;
        }
        setData(data.filter(row => row.id !== id));
    };

    // 更新单元格数据
    const updateCell = (id, field, value) => {
        setData(data.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        ));
    };

    // 聚焦到指定单元格
    const focusCell = (rowIndex, colIndex) => {
        setTimeout(() => {
            const cell = tableRef.current?.querySelector(
                `[data-row="${rowIndex}"][data-col="${colIndex}"]`
            );
            if (cell) cell.focus();
        }, 10);
    };

    // 处理键盘导航
    const handleKeyDown = (e, rowIndex, colIndex) => {
        if (!tableConfig.enableKeyboardNav) return;

        // Tab或Enter键处理
        if (e.key === 'Tab' || e.key === 'Enter') {
            e.preventDefault();

            // 计算下一个单元格位置
            let nextRowIndex = rowIndex;
            let nextColIndex = colIndex + 1;

            // 如果当前是最后一列
            if (nextColIndex >= tableColumns.length) {
                nextRowIndex += 1;
                nextColIndex = 0;

                // 如果当前是最后一行，添加新行
                if (nextRowIndex >= data.length && tableConfig.autoAddRow) {
                    const newRowId = addRow();
                    // 等待新行渲染完成后聚焦
                    setTimeout(() => {
                        const newRowIndex = data.length;
                        focusCell(newRowIndex, 0);
                    }, 50);
                    return;
                }
            }

            focusCell(nextRowIndex, nextColIndex);
        }
        // 方向键导航
        else if (e.key === 'ArrowUp' && rowIndex > 0) {
            e.preventDefault();
            focusCell(rowIndex - 1, colIndex);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            // 如果是最后一行，添加新行
            if (rowIndex === data.length - 1 && tableConfig.autoAddRow) {
                const newRowId = addRow();
                setTimeout(() => {
                    focusCell(rowIndex + 1, colIndex);
                }, 50);
            } else if (rowIndex < data.length - 1) {
                focusCell(rowIndex + 1, colIndex);
            }
        } else if (e.key === 'ArrowLeft' && colIndex > 0) {
            e.preventDefault();
            focusCell(rowIndex, colIndex - 1);
        } else if (e.key === 'ArrowRight' && colIndex < tableColumns.length - 1) {
            e.preventDefault();
            focusCell(rowIndex, colIndex + 1);
        }
    };

    // 根据列配置渲染表头
    const renderTableHeader = () => (
        <div className="table-row header">
            {tableConfig.fixedActions && (
                <div className="table-cell fixed action-cell">操作</div>
            )}
            {tableColumns.map((column, index) => (
                <div
                    key={column.key}
                    className="table-cell"
                    style={{ width: column.width }}
                >
                    {column.label}
                    {column.required && <span className="required-mark">*</span>}
                </div>
            ))}
        </div>
    );

    // 根据列配置渲染表格行
    const renderTableRows = () => (
        data.map((row, rowIndex) => (
            <div className="table-row" key={row.id}>
                {/* 固定操作栏 */}
                {tableConfig.fixedActions && (
                    <div className="table-cell fixed action-cell">
                        <button
                            className="action-btn add-btn"
                            onClick={() => {
                                const newRowId = addRow(rowIndex);
                                // 聚焦到新行的第一个单元格
                                setTimeout(() => {
                                    focusCell(rowIndex + 1, 0);
                                }, 50);
                            }}
                            title="在下方插入行"
                        >
                            +
                        </button>
                        <button
                            className="action-btn delete-btn"
                            onClick={() => deleteRow(row.id)}
                            title="删除行"
                        >
                            -
                        </button>
                    </div>
                )}

                {/* 动态渲染列 */}
                {tableColumns.map((column, colIndex) => (
                    <div
                        key={column.key}
                        className="table-cell"
                        style={{ width: column.width }}
                    >
                        {renderInput(column, row, rowIndex, colIndex)}
                    </div>
                ))}
            </div>
        ))
    );

    // 根据列类型渲染输入组件
    const renderInput = (column, row, rowIndex, colIndex) => {
        const commonProps = {
            value: row[column.key],
            onChange: (value) => updateCell(row.id, column.key, value),
            onKeyDown: (e) => handleKeyDown(e, rowIndex, colIndex),
            rowIndex,
            colIndex,
            placeholder: column.placeholder,
            required: column.required,
            validate: column.validate,
            errorMessage: column.errorMessage
        };

        switch (column.type) {
            case 'amount':
                return <AmountInput {...commonProps} />;
            case 'date':
                return <DateInput {...commonProps} />;
            case 'phone':
                return <PhoneInput {...commonProps} />;
            case 'email':
                return <EmailInput {...commonProps} />;
            case 'text':
            default:
                return <TextInput {...commonProps} />;
        }
    };

    return (
        <div className="editable-table-container">
            <div className="table-header">
                <h2>配置化可编辑表格</h2>
                <div className="header-actions">
                    <button className="add-row-btn" onClick={() => addRow()}>
                        + 添加行
                    </button>
                    <div className="keyboard-hint">
                        <span>使用 Tab / Enter 键在单元格间导航</span>
                    </div>
                </div>
            </div>

            <div className="table-wrapper" ref={tableRef}>
                <div className="table">
                    {renderTableHeader()}
                    {renderTableRows()}
                </div>
            </div>

            <div className="table-footer">
                <div className="row-count">共 {data.length} 行数据</div>
                <div className="navigation-tip">
                    提示: 使用方向键、Tab键或Enter键在表格中导航，到达行尾时自动创建新行
                </div>
            </div>
        </div>
    );
};

// 文本输入组件
const TextInput = ({ value, onChange, onKeyDown, rowIndex, colIndex, placeholder, required }) => {
    return (
        <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            data-row={rowIndex}
            data-col={colIndex}
            placeholder={placeholder}
            className={required && !value ? 'required-field' : ''}
        />
    );
};

// 金额输入组件
const AmountInput = ({ value, onChange, onKeyDown, rowIndex, colIndex, placeholder }) => {
    const [displayValue, setDisplayValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (!isFocused) {
            setDisplayValue(formatAmount(value));
        }
    }, [value, isFocused]);

    const formatAmount = (val) => {
        if (!val && val !== 0) return '';
        const num = parseFloat(val.toString().replace(/,/g, ''));
        return isNaN(num) ? '' : num.toLocaleString('en-US');
    };

    const handleFocus = () => {
        setIsFocused(true);
        setDisplayValue(value ? value.toString().replace(/,/g, '') : '');
    };

    const handleBlur = () => {
        setIsFocused(false);
        const numValue = displayValue ? parseFloat(displayValue.replace(/,/g, '')) : 0;
        if (!isNaN(numValue)) {
            onChange(numValue);
            setDisplayValue(formatAmount(numValue));
        } else {
            setDisplayValue(formatAmount(value));
        }
    };

    const handleChange = (e) => {
        const inputValue = e.target.value.replace(/[^0-9.]/g, '');
        setDisplayValue(inputValue);
    };

    return (
        <input
            type="text"
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            data-row={rowIndex}
            data-col={colIndex}
            placeholder={placeholder}
        />
    );
};

// 日期输入组件
const DateInput = ({ value, onChange, onKeyDown, rowIndex, colIndex }) => {
    return (
        <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            data-row={rowIndex}
            data-col={colIndex}
        />
    );
};

// 电话输入组件
const PhoneInput = ({ value, onChange, onKeyDown, rowIndex, colIndex, placeholder, validate, errorMessage }) => {
    const [isValid, setIsValid] = useState(true);

    const handleChange = (e) => {
        const inputValue = e.target.value.replace(/[^0-9]/g, '');
        onChange(inputValue);
        setIsValid(validate ? validate(inputValue) : true);
    };

    const handleBlur = () => {
        setIsValid(validate ? validate(value) : true);
    };

    return (
        <div className={`input-wrapper ${!isValid ? 'invalid' : ''}`}>
            <input
                type="text"
                value={value || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={onKeyDown}
                data-row={rowIndex}
                data-col={colIndex}
                placeholder={placeholder}
                maxLength={11}
            />
            {!isValid && <span className="error-icon" title={errorMessage}>!</span>}
        </div>
    );
};

// 邮箱输入组件
const EmailInput = ({ value, onChange, onKeyDown, rowIndex, colIndex, placeholder, validate, errorMessage }) => {
    const [isValid, setIsValid] = useState(true);

    const handleChange = (e) => {
        const inputValue = e.target.value;
        onChange(inputValue);
        setIsValid(validate ? validate(inputValue) : true);
    };

    const handleBlur = () => {
        setIsValid(validate ? validate(value) : true);
    };

    return (
        <div className={`input-wrapper ${!isValid ? 'invalid' : ''}`}>
            <input
                type="text"
                value={value || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={onKeyDown}
                data-row={rowIndex}
                data-col={colIndex}
                placeholder={placeholder}
            />
            {!isValid && <span className="error-icon" title={errorMessage}>!</span>}
        </div>
    );
};

export default ConfigurableEditableTable;