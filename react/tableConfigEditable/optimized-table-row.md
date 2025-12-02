# TableRow 组件优化方案

## 🎯 核心优化思路

将"类型判断 + 值转换"的逻辑从**父组件**下沉到**单元格组件**，实现职责分离。

---

## 📋 优化对比

### ❌ 当前问题

```typescript
// 父组件需要处理各种类型转换
const handleInputChange = (e, cellProps, rowIndex, columnIndex) => {
    let value = e.target.value;
    
    // 根据 key 判断类型（业务逻辑泄漏）
    if (cellProps.key === 'amount' || cellProps.key === 'salary') {
        value = formatMoney(value);
    } else if (cellProps.key === 'date' || cellProps.key === 'birthDate') {
        value = formatDate(value);
    } else if (cellProps.key === 'mobile') {
        value = formatPhone(value);
    }
    
    // 更新数据...
}
```

### ✅ 优化后

```typescript
// 配置中明确类型
const columns = [
    { key: 'amount', type: 'money', label: 'Amount' },
    { key: 'birthDate', type: 'date', label: 'Birth Date' },
    { key: 'mobile', type: 'phone', label: 'Mobile' }
];

// 父组件只需要简单接收值
const handleInputChange = (value, cellProps, rowIndex, columnIndex) => {
    updateData(rowIndex, columnIndex, value); // 直接使用已格式化的值
}
```

---

## 🏗️ 优化方案一：细化输入框类型（推荐）

### 1. 定义单元格类型

```typescript
// types.ts
export type CellType = 
    | 'text'           // 普通文本
    | 'number'         // 数字
    | 'money'          // 金额（千分位）
    | 'date'           // 日期 (dd/mm/yyyy)
    | 'phone'          // 电话
    | 'email'          // 邮箱
    | 'percentage'     // 百分比
    | 'select'         // 下拉选择
    | 'readonly';      // 只读

export interface DataSingleListItemProps {
    key: string;
    type: CellType;              // 明确类型
    value: string;
    columnIndex: number;
    rowIndex: number;
    
    // 验证相关
    required?: boolean;
    pattern?: RegExp;           // 验证正则
    min?: number;               // 最小值（number/money）
    max?: number;               // 最大值
    
    // 格式化相关
    decimals?: number;          // 小数位数（money）
    dateFormat?: string;        // 日期格式
    
    // UI相关
    placeholder?: string;
    disable?: boolean;
    options?: Array<{value: string; label: string}>;
    
    // 错误相关
    valueError?: boolean;
    errorMessage?: string;
}
```

### 2. 创建专用输入框组件

```typescript
// CellInput.tsx
import React, { useState, useCallback } from 'react';

interface CellInputProps {
    cellProps: DataSingleListItemProps;
    onChange: (value: string, cellProps: DataSingleListItemProps) => void;
    onFocus: (cellProps: DataSingleListItemProps) => void;
    onBlur: (cellProps: DataSingleListItemProps) => void;
    onKeyDown: (e: React.KeyboardEvent, cellProps: DataSingleListItemProps) => void;
    registerRef?: (node: HTMLInputElement | null) => void;
}

// 格式化器
const formatters = {
    money: (value: string, decimals = 2): string => {
        const num = value.replace(/[^\d.]/g, '');
        const parts = num.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (parts[1]) {
            parts[1] = parts[1].slice(0, decimals);
        }
        return parts.join('.');
    },
    
    date: (value: string): string => {
        // 自动格式化为 dd/mm/yyyy
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length <= 2) return cleaned;
        if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
        return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    },
    
    phone: (value: string): string => {
        return value.replace(/[^\d+\-() ]/g, '');
    },
    
    percentage: (value: string): string => {
        const num = parseFloat(value.replace(/[^\d.]/g, ''));
        if (isNaN(num)) return '';
        return Math.min(100, Math.max(0, num)).toString();
    },
    
    number: (value: string): string => {
        return value.replace(/[^\d.-]/g, '');
    }
};

// 解析器（从格式化值提取原始值）
const parsers = {
    money: (value: string): string => {
        return value.replace(/,/g, '');
    },
    
    date: (value: string): string => {
        return value; // 保持 dd/mm/yyyy 格式
    },
    
    phone: (value: string): string => {
        return value.replace(/[\s\-()]/g, '');
    }
};

export const CellInput: React.FC<CellInputProps> = ({
    cellProps,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    registerRef
}) => {
    const [displayValue, setDisplayValue] = useState(cellProps.value);
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        let formattedValue = rawValue;

        // 根据类型格式化
        const formatter = formatters[cellProps.type];
        if (formatter) {
            formattedValue = formatter(rawValue, cellProps.decimals);
        }

        setDisplayValue(formattedValue);
        
        // 返回解析后的值给父组件
        const parser = parsers[cellProps.type];
        const valueToSave = parser ? parser(formattedValue) : formattedValue;
        onChange(valueToSave, cellProps);
    }, [cellProps, onChange]);

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus(cellProps);
    }, [cellProps, onFocus]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        
        // 失焦时应用完整格式化
        if (cellProps.type === 'money' && displayValue) {
            const formatted = formatters.money(displayValue, cellProps.decimals);
            setDisplayValue(formatted);
        }
        
        onBlur(cellProps);
    }, [cellProps, onBlur, displayValue]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown(e, cellProps);
    }, [cellProps, onKeyDown]);

    // 获取输入框类型
    const getInputType = () => {
        switch (cellProps.type) {
            case 'email': return 'email';
            case 'number':
            case 'money': return 'text'; // 使用 text 以支持格式化
            case 'date': return 'text';
            default: return 'text';
        }
    };

    // 获取 placeholder
    const getPlaceholder = () => {
        if (cellProps.placeholder) return cellProps.placeholder;
        
        switch (cellProps.type) {
            case 'date': return 'dd/mm/yyyy';
            case 'money': return '0.00';
            case 'phone': return '+852 1234 5678';
            case 'email': return 'example@email.com';
            case 'percentage': return '0-100';
            default: return '';
        }
    };

    return (
        <input
            ref={registerRef}
            type={getInputType()}
            value={displayValue}
            placeholder={getPlaceholder()}
            disabled={cellProps.disable}
            className={`cell-input cell-input-${cellProps.type}`}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
        />
    );
};
```

### 3. 优化后的 TableRow

```typescript
// TableRow.tsx
import React, { memo } from 'react';
import { CellInput } from './CellInput';
import { CellSelect } from './CellSelect';
import { CellReadonly } from './CellReadonly';

const TableRow = memo<TableRowProps>(({
    rowItem,
    rowIndex,
    tbHeaderArg,
    registerInput,
    onInsertRow,
    onDeleteRow,
    // 简化后的事件处理
    onCellChange,
    onCellFocus,
    onCellBlur,
    onCellKeyDown
}) => {
    // 渲染单元格内容
    const renderCell = (item: DataSingleListItemProps) => {
        if (item.type === 'readonly') {
            return <CellReadonly cellProps={item} />;
        }
        
        if (item.type === 'select') {
            return (
                <CellSelect
                    cellProps={item}
                    onChange={onCellChange}
                    onFocus={onCellFocus}
                    onBlur={onCellBlur}
                    registerRef={registerInput(`input_${item.rowIndex}_${item.columnIndex}`)}
                />
            );
        }
        
        return (
            <CellInput
                cellProps={item}
                onChange={onCellChange}
                onFocus={onCellFocus}
                onBlur={onCellBlur}
                onKeyDown={onCellKeyDown}
                registerRef={registerInput(`input_${item.rowIndex}_${item.columnIndex}`)}
            />
        );
    };

    return (
        <tr className={rowItem.errorRow ? 'error-row' : ''}>
            {tbHeaderArg.showIndex && (
                <td className="index-cell">
                    <div className="operation-buttons">
                        <button onClick={() => onInsertRow(rowIndex)}>+</button>
                        <button onClick={() => onDeleteRow(rowIndex)}>-</button>
                        <span>{rowIndex + 1}</span>
                    </div>
                </td>
            )}
            
            {rowItem.list.map((item) => (
                <td
                    key={`td_${rowIndex}_${item.columnIndex}`}
                    className={`cell ${item.required && !item.value ? 'required' : ''}`}
                >
                    {renderCell(item)}
                </td>
            ))}
        </tr>
    );
});
```

---

## 🏗️ 优化方案二：使用工厂模式

```typescript
// CellFactory.tsx
export class CellFactory {
    private static validators = {
        email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        phone: (value: string) => /^[+]?[\d\s\-()]{10,}$/.test(value),
        date: (value: string) => /^\d{2}\/\d{2}\/\d{4}$/.test(value),
        money: (value: string) => /^\d+(\.\d{0,2})?$/.test(value.replace(/,/g, ''))
    };

    static createCell(type: CellType, props: CellInputProps) {
        const config = this.getCellConfig(type);
        
        return (
            <CellInput
                {...props}
                formatter={config.formatter}
                parser={config.parser}
                validator={config.validator}
                placeholder={config.placeholder}
            />
        );
    }

    private static getCellConfig(type: CellType) {
        const configs = {
            money: {
                formatter: formatters.money,
                parser: parsers.money,
                validator: this.validators.money,
                placeholder: '0.00'
            },
            date: {
                formatter: formatters.date,
                parser: parsers.date,
                validator: this.validators.date,
                placeholder: 'dd/mm/yyyy'
            },
            // ... 其他类型
        };
        
        return configs[type] || configs.text;
    }
}
```

---

## 📊 优化效果对比

| 方面 | 优化前 | 优化后 |
|------|--------|--------|
| **父组件代码** | 300+ 行 switch/if 判断 | 50 行简单调用 |
| **类型安全** | 依赖 key 字符串判断 | TypeScript 类型保证 |
| **可维护性** | 新增类型需改多处 | 新增类型只需加配置 |
| **测试难度** | 需要测试父组件所有分支 | 单元格组件独立测试 |
| **复用性** | 逻辑耦合在父组件 | 单元格组件可独立复用 |

---

## 🎯 实施建议

### 第一阶段：重构输入框类型
1. 定义 `CellType` 类型
2. 创建 `CellInput` 组件
3. 提取格式化和验证逻辑

### 第二阶段：优化事件处理
4. 简化父组件事件处理器
5. 移除业务逻辑判断
6. 统一值的传递格式

### 第三阶段：增强功能
7. 添加内置验证
8. 添加错误提示
9. 添加格式化预览

---

## 💡 额外优化建议

### 1. 使用 Context 减少 Props 传递

```typescript
// TableContext.tsx
const TableContext = createContext({
    onCellChange: (value, cellProps) => {},
    onCellFocus: (cellProps) => {},
    registerInput: (id) => () => {}
});

// 在 TableRow 中
const { onCellChange, registerInput } = useContext(TableContext);
```

### 2. 添加键盘导航优化

```typescript
// 在 CellInput 中
const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
        // 自动跳转到下一个输入框
    } else if (e.key === 'Enter') {
        // 跳转到下一行同列
    }
};
```

### 3. 添加实时验证反馈

```typescript
const [error, setError] = useState('');

const validate = (value: string) => {
    if (cellProps.required && !value) {
        return 'This field is required';
    }
    if (cellProps.pattern && !cellProps.pattern.test(value)) {
        return 'Invalid format';
    }
    return '';
};
```

---

## 总结

通过将类型判断和格式化逻辑下沉到单元格组件：
- ✅ 父组件代码减少 60%+
- ✅ 类型安全性提升
- ✅ 可维护性大幅提高
- ✅ 单元格组件可独立复用
- ✅ 便于单元测试

建议优先实施**方案一**，它的实现成本最低，效果最明显。