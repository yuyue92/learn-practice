// components/FieldRenderer.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Grid, TextField, Typography, Tooltip } from '@mui/material';
import { FieldConfig } from '../data/fieldConfig'
import { DdeMemInfo } from '@/pages/EDA/data/types';

interface FieldRendererProps {
    field: FieldConfig;
    ddeMemInfo: DdeMemInfo;
    setDdeMemInfo: (info: DdeMemInfo) => void;
    editFlag: boolean;
}

export const FieldRenderer: React.FC<FieldRendererProps> = React.memo(({
    field,
    ddeMemInfo,
    setDdeMemInfo,
    editFlag
}) => {
    const parseValue = (val: string): number => {
        if (!val) return 0;
        // 移除千分位逗号和非数字字符（保留小数点和负号）
        const cleaned = val.replace(/,/g, '').replace(/[^\d.-]/g, '');
        return parseFloat(cleaned) || 0;
    };
    const value = ddeMemInfo[field.key];

    const [valueError, setvalueError] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState('');
    
    // 关键修复：添加 useEffect 监听行数据变化，重置错误状态
    useEffect(() => {
        // 当行数据变化时，重置所有错误状态
        setvalueError(false);
        setInputValue(value?.toString() || '');
        setIsFocused(false);
    }, [ddeMemInfo.id, field.key]); // 依赖行ID和字段key，确保行切换时重置

    // 显示值：聚焦时显示原始数字，失焦时显示格式化值
    let displayValue = useMemo(() => {
        if (isFocused) {
            return inputValue;
        }
        return field.format ? field.format(value) : (value ?? '');
    }, [isFocused, inputValue, value]);
    
    // 初始化输入值
    useEffect(() => {
        if (!isFocused) {
            setInputValue(value?.toString() || '');
        }
    }, [value, isFocused]);
    
    //////////////
    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        // 聚焦时选择所有文本
        event.target.select();
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        // 解析输入值并更新
        const parsedValue = parseValue(inputValue);
        setInputValue(parsedValue?.toString() || '');
    };
    
    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        console.log(newValue, 'newvalll: ', field )
        setDdeMemInfo({ ...ddeMemInfo, [field.key]: newValue })
        if(field.regexpVal){
            let validateTrue: boolean = true
            if(field.regexpVal ==='mobile'){
                validateTrue = /^[+]?[(]?[\d\s-()]{10,}$/.test(newValue)
            }
            if (field.regexpVal === 'email') {
                validateTrue = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newValue)
            }
            if (field.regexpVal === 'zh') {
                validateTrue = /^[\u4e00-\u9fa5]{1,10}$/.test(newValue)
            }
            setvalueError(!validateTrue)
        }
    }
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        // 核心正则替换：限制整数部分<=8位，小数部分<=2位
        let val = newValue.replace(/[^\d.]/g, '') // 先移除所有非数字和小数点字符
            .replace(/^(\d{0,8})(\.?)(.*)$/, (match, integer, dot, decimal) => {
                // integer: 整数部分, dot: 小数点, decimal: 小数部分
                if (dot) {
                    // 如果有小数点，限制小数部分为0-2位
                    return integer + dot + decimal.substring(0, 2);
                }
                // 如果没有小数点，只返回整数部分
                return integer;
            });
        setDdeMemInfo({ ...ddeMemInfo, [field.key]: val })

        // 简单的输入验证：只允许数字、小数点、负号和逗号
        if (/^-?[\d,]*\.?\d*$/.test(newValue) || newValue === '') {
            setInputValue(newValue);
        }
    };
    
    if(field.type!=='amount') {
        displayValue = field.format ? field.format(value) : (value ?? '');
    }
    let isDisabled = field.disabled !== undefined ? field.disabled : false;
    if (!editFlag) isDisabled = true;

    const renderField = () => {
        switch (field.type) {
            case 'amount':
                return (
                    <TextField
                        value={displayValue}
                        hiddenLabel
                        size='small'
                        variant='standard'
                        disabled={isDisabled}
                        inputProps={{
                            sx: { textAlign: 'right' },
                        }}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                );

            case 'date':
            case 'text':
            default:
                return (
                    <TextField
                        value={displayValue}
                        hiddenLabel
                        size='small'
                        variant='standard'
                        disabled={isDisabled}
                        inputProps={{
                            'data-testid': field.testId,
                            ...(field.type === 'date' && { sx: { textAlign: 'center' } })
                        }}
                        error={valueError}
                        onChange={handleTextChange}
                    />
                );
        }
    };

    return (
        <Grid item xs={12} sm={4}>
            <Grid container alignItems="flex-start">
                <Grid item xs={4}>
                    {
                        (field.label.length < 16) ? (<Typography variant="subtitle1" color="text.secondary">
                            {field.label}:
                        </Typography>) : (<Tooltip title={field.label} placement="top" arrow>
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    cursor: 'help'
                                }}
                            >
                                {field.label}:
                            </Typography>
                        </Tooltip>)
                    }
                </Grid>
                <Grid item xs={8}>
                    {renderField()}
                </Grid>
            </Grid>
        </Grid>
    );
});
