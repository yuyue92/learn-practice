// ============================================================================
// 文件: EnterTables.tsx (优化后的主组件)
// ============================================================================

import React, { 
    useEffect, 
    useRef, 
    useState, 
    forwardRef, 
    useImperativeHandle, 
    useCallback, 
    useMemo 
} from 'react';
import { produce } from 'immer';
import style from './EnterTables.module.css';
import _ from 'lodash';
import { getMemberInfo } from "@/api/cde/index";
import { 
    TbHeaderProps, 
    DataSingleProps, 
    DataFooterProps, 
    DataSingleListItemProps, 
    MemberInfo 
} from '../data/types';
import { theFunDateFormat, theFunMoneyFormat } from '../util';
import TableRow from './TableRow'; // 新增：独立的行组件

interface ChildProps {
    tbHeaderArg: TbHeaderProps;
    dataSingleArg: DataSingleProps;
    dataFooterArg: DataFooterProps;
    defaultMap: Map<string, string>;
    employerCode: string;
    payrollGrpShort: string;
    onParentMsg: (txt: string, arg: "error" | "success" | "info" | "warning" | undefined) => void;
}

export interface ChildHandleTable {
    getRecoredMemberData: () => {
        recordData: Array<DataSingleProps>;
        expendData: Array<MemberInfo>;
        extData: number[][];
    };
    getSharedTotalValue: () => number;
    setInitDataList: (memList: any, state: string) => void;
    setVersionInfor: (arg: Array<Array<number>>) => void;
}

const EnterTables = forwardRef<ChildHandleTable, ChildProps>(({
    tbHeaderArg,
    dataSingleArg,
    dataFooterArg,
    defaultMap,
    employerCode,
    payrollGrpShort,
    onParentMsg
}, ref) => {

    // ==================== State 和 Ref ====================
    const sharedTotalValue = useRef<number>(0);
    const checkMemberArray = useRef<Array<MemberInfo>>([]);
    const versionCheckedInfor = useRef<number[][]>([]);
    const stateUseRef = useRef<string>("");
    const inputMapRef = useRef<Map<string, HTMLInputElement | HTMLSelectElement>>(new Map());
    const keydownValueRef = useRef('');
    const requestIdRef = useRef(0); // 新增：处理异步竞态

    const [dataList, setDataList] = useState<Array<DataSingleProps>>([]);
    const [changeRowCount, setChangeRowCount] = useState<number>(0);
    const [footerState, setFooterState] = useState<DataFooterProps>(() => _.cloneDeep(dataFooterArg));

    // ==================== 计算属性（使用 useMemo 优化）====================
    const columnCount = useMemo(() => {
        return (dataSingleArg.list.length - 1) + (tbHeaderArg.showIndex ? 1 : 0);
    }, [dataSingleArg, tbHeaderArg.showIndex]);

    const totalArray = useMemo(() => {
        return dataSingleArg.list
            .map((item, index) => item.fun === "Total" ? index : -1)
            .filter(i => i !== -1);
    }, [dataSingleArg]);

    const totalIndex = useMemo(() => {
        return dataSingleArg.list.findIndex(item => item.key === "Total");
    }, [dataSingleArg]);

    // ==================== 工具函数 ====================
    const parseMoneyValue = useCallback((val: string): number => {
        if (!val) return 0;
        return parseFloat(val.replace(/,/g, '') || '0');
    }, []);

    const formatMoneyValue = useCallback((val: number | string): string => {
        return theFunMoneyFormat(val.toString());
    }, []);

    // ==================== 注册/注销输入框引用（优化内存管理）====================
    const registerInput = useCallback((id: string) => 
        (node: HTMLInputElement | HTMLSelectElement | null) => {
            if (node) {
                inputMapRef.current.set(id, node);
            } else {
                inputMapRef.current.delete(id);
            }
        }, []
    );

    // 清理指定行的所有输入框引用
    const cleanupRowRefs = useCallback((rowIndex: number) => {
        for (let c = 0; c < columnCount; c++) {
            inputMapRef.current.delete(`input_${rowIndex}_${c}`);
        }
    }, [columnCount]);

    // 重新映射行索引（删除行后）
    const remapRowRefs = useCallback((deletedRowIndex: number, totalRows: number) => {
        const newMap = new Map<string, HTMLInputElement | HTMLSelectElement>();
        
        inputMapRef.current.forEach((value, key) => {
            const match = key.match(/input_(\d+)_(\d+)/);
            if (match) {
                const row = parseInt(match[1]);
                const col = match[2];
                
                if (row < deletedRowIndex) {
                    // 保持原有映射
                    newMap.set(key, value);
                } else if (row > deletedRowIndex) {
                    // 行索引减1
                    newMap.set(`input_${row - 1}_${col}`, value);
                }
                // row === deletedRowIndex 的不添加（已删除）
            }
        });
        
        inputMapRef.current = newMap;
    }, []);

    // ==================== 焦点管理 ====================
    const focusInput = useCallback((rowIndex: number, columnIndex: number) => {
        const adjustedColumnIndex = columnIndex + (tbHeaderArg.showIndex ? 1 : 0);
        const inputDom = inputMapRef.current.get(`input_${rowIndex}_${adjustedColumnIndex}`);
        if (inputDom) {
            inputDom.focus();
        }
    }, [tbHeaderArg.showIndex]);

    // ==================== 计算逻辑（优化后）====================
    const calculateTotals = useCallback((
        dataList: Array<DataSingleProps>,
        totalArray: number[],
        currentRow?: number,
        currentCol?: number,
        currentValue?: string
    ) => {
        const getValue = (row: number, col: number): number => {
            if (row === currentRow && col === currentCol && currentValue !== undefined) {
                return parseMoneyValue(currentValue);
            }
            return parseMoneyValue(dataList[row]?.list[col]?.value || '0');
        };

        // 计算每行总计
        const rowTotals = dataList.map((row, rowIdx) => {
            return totalArray.reduce((sum, colIdx) => {
                return sum + getValue(rowIdx, colIdx);
            }, 0);
        });

        // 计算每列总计
        const colTotals = totalArray.map(colIdx => {
            return dataList.reduce((sum, row, rowIdx) => {
                return sum + getValue(rowIdx, colIdx);
            }, 0);
        });

        // 计算总和
        const grandTotal = colTotals.reduce((a, b) => a + b, 0);

        return { rowTotals, colTotals, grandTotal };
    }, [parseMoneyValue]);

    // ==================== 更新计算结果 ====================
    const updateCalculations = useCallback((
        rowIndex: number,
        columnIndex: number,
        currentVal: string
    ) => {
        if (rowIndex === -1 || columnIndex === -1) return;

        const { rowTotals, colTotals, grandTotal } = calculateTotals(
            dataList,
            totalArray,
            rowIndex,
            columnIndex,
            currentVal
        );

        const formattedCurrentVal = currentVal ? formatMoneyValue(currentVal) : '';

        setDataList(prev => produce(prev, draft => {
            // 更新当前单元格
            draft[rowIndex].list[columnIndex].value = formattedCurrentVal;
            
            // 更新行总计
            if (totalIndex !== -1) {
                draft[rowIndex].list[totalIndex].value = formatMoneyValue(rowTotals[rowIndex]);
            }
        }));

        // 更新页脚
        sharedTotalValue.current = grandTotal;
        setFooterState(prev => produce(prev, draft => {
            if (!draft || draft.list.length === 0) return;
            
            const footerRow = draft.list[0];
            
            // 更新列总计
            totalArray.forEach((colIdx, idx) => {
                const footerCell = footerRow.list[idx + 1];
                if (footerCell) {
                    footerCell.value = formatMoneyValue(colTotals[idx]);
                }
            });
            
            // 更新总和
            const sumCell = footerRow.list[totalArray.length + 1];
            if (sumCell) {
                sumCell.value = formatMoneyValue(grandTotal);
            }
        }));
    }, [dataList, totalArray, totalIndex, calculateTotals, formatMoneyValue]);

    // ==================== 行操作（使用 useCallback）====================
    const handleInsertZeroRow = useCallback(() => {
        setDataList(prev => produce(prev, draft => {
            const singleRow = _.cloneDeep(dataSingleArg);
            singleRow.id = new Date().getTime().toString();
            singleRow.list.forEach((item: DataSingleListItemProps, cindex: number) => {
                item.rowIndex = 0;
                item.columnIndex = cindex;
            });
            singleRow.list[4].value = defaultMap.get("contrPeriodStartDate") ?? '';
            singleRow.list[5].value = defaultMap.get("contrPeriodEndDate") ?? '';
            
            draft.splice(0, 0, singleRow);
            
            // 重新索引
            draft.forEach((row, idx) => {
                row.list.forEach((cell, cidx) => {
                    cell.rowIndex = idx;
                    cell.columnIndex = cidx;
                });
            });
        }));
    }, [dataSingleArg, defaultMap]);

    const handleInsertRow = useCallback((rowIndex: number) => {
        setDataList(prev => produce(prev, draft => {
            const insertIndex = rowIndex + 1;
            const singleRow = _.cloneDeep(dataSingleArg);
            singleRow.id = new Date().getTime().toString();
            singleRow.list.forEach((item: DataSingleListItemProps, cindex: number) => {
                item.rowIndex = insertIndex;
                item.columnIndex = cindex;
            });
            singleRow.list[4].value = defaultMap.get("contrPeriodStartDate") ?? '';
            singleRow.list[5].value = defaultMap.get("contrPeriodEndDate") ?? '';
            
            draft.splice(insertIndex, 0, singleRow);
            
            // 重新索引
            draft.forEach((row, idx) => {
                row.list.forEach((cell, cidx) => {
                    cell.rowIndex = idx;
                    cell.columnIndex = cidx;
                });
            });
        }));
    }, [dataSingleArg, defaultMap]);

    const handleDeleteRow = useCallback((rowIndex: number) => {
        if (dataList.length <= 1) {
            onParentMsg('Cannot delete the last row', 'warning');
            return;
        }

        const isConfirmed = confirm('Are you sure you want to delete this row? This action cannot be undone!');
        if (!isConfirmed) return;

        const rowId = dataList[rowIndex].id;
        
        // 1. 清理该行的输入框引用
        cleanupRowRefs(rowIndex);
        
        // 2. 删除行数据
        setDataList(prev => produce(prev, draft => {
            draft.splice(rowIndex, 1);
            
            // 重新索引
            draft.forEach((row, idx) => {
                row.list.forEach((cell, cidx) => {
                    cell.rowIndex = idx;
                    cell.columnIndex = cidx;
                });
            });
        }));
        
        // 3. 重新映射剩余行的引用
        remapRowRefs(rowIndex, dataList.length - 1);
        
        // 4. 清理成员数组
        const memberIndex = checkMemberArray.current.findIndex(m => m.id === rowId);
        if (memberIndex !== -1) {
            checkMemberArray.current.splice(memberIndex, 1);
        }
        
        // 5. 更新版本检查信息
        versionCheckedInfor.current.splice(rowIndex, 1);
        versionCheckedInfor.current.push(Array(42).fill(0));
    }, [dataList, cleanupRowRefs, remapRowRefs, onParentMsg]);

    const appendRow = useCallback((rowIndex: number) => {
        if (rowIndex === dataList.length - 1) {
            setDataList(prev => produce(prev, draft => {
                const singleRow = _.cloneDeep(dataSingleArg);
                const len = draft.length;
                singleRow.id = new Date().getTime().toString();
                singleRow.list.forEach((item: DataSingleListItemProps, cindex: number) => {
                    item.rowIndex = len;
                    item.columnIndex = cindex;
                });
                singleRow.list[4].value = defaultMap.get("contrPeriodStartDate") ?? '';
                singleRow.list[5].value = defaultMap.get("contrPeriodEndDate") ?? '';
                draft.push(singleRow);
            }));
            setChangeRowCount(prev => prev + 1);
        } else {
            focusInput(rowIndex + 1, 0);
        }
    }, [dataList.length, dataSingleArg, defaultMap, focusInput]);

    // ==================== 输入处理（使用 useCallback）====================
    const handleInputChange = useCallback((
        event: React.ChangeEvent<HTMLInputElement>,
        cellProps: DataSingleListItemProps,
        rowIndex: number,
        columnIndex: number
    ) => {
        let val = event.target.value;
        
        // 金额字段验证
        const moneyFields = [
            'ddeRi', 'ddeBasicSalary', 'ddeErmc', 'ddeEemc',
            'ddeErvc1', 'ddeErvc2', 'ddeErvc3', 'ddeErvc4',
            'ddeErvc5', 'ddeErvc6', 'ddeErvc7',
            'ddeEevc1', 'ddeEevc2', 'ddeSurch'
        ];
        
        if (moneyFields.includes(cellProps.key)) {
            val = val.replace(/[^\d.]/g, '')
                .replace(/^(\d{0,8})(\.?)(.*)$/, (match, integer, dot, decimal) => {
                    if (dot) {
                        return integer + dot + decimal.substring(0, 2);
                    }
                    return integer;
                });
        }
        
        setDataList(prev => produce(prev, draft => {
            draft[rowIndex].list[columnIndex].value = val;
        }));
    }, []);

    const handleSelectChange = useCallback((
        event: React.ChangeEvent<HTMLSelectElement>,
        cellProps: DataSingleListItemProps,
        rowIndex: number,
        columnIndex: number
    ) => {
        const value = event.target.value;
        
        setDataList(prev => produce(prev, draft => {
            draft[rowIndex].list[columnIndex].value = value;
        }));
        
        if (cellProps.key === "termLspSp") {
            if (checkMemberArray.current[rowIndex]?.memAcctUuid) {
                appendRow(rowIndex);
            } else {
                focusInput(rowIndex, columnIndex);
            }
        } else {
            focusInput(rowIndex, columnIndex);
        }
    }, [appendRow, focusInput]);

    const handleInputFocus = useCallback((
        event: React.FocusEvent<HTMLInputElement>,
        cellProps: DataSingleListItemProps,
        rowIndex: number,
        columnIndex: number
    ) => {
        let val = event.target.value;
        
        if (cellProps.key === "idNo") {
            keydownValueRef.current = val.trim();
        }
        
        // 去除格式化
        if (cellProps.format === "date" && val.includes("/")) {
            val = val.replaceAll("/", "");
            setDataList(prev => produce(prev, draft => {
                draft[rowIndex].list[columnIndex].value = val;
            }));
        } else if (cellProps.format === "money" && val.includes(",")) {
            val = val.replaceAll(",", "");
            setDataList(prev => produce(prev, draft => {
                draft[rowIndex].list[columnIndex].value = val;
            }));
        }
        
        // 填充默认日期
        if (["contrPeriodStartDate", "contrPeriodEndDate"].includes(cellProps.key) && !val) {
            setDataList(prev => produce(prev, draft => {
                draft[rowIndex].list[columnIndex].value = defaultMap.get(cellProps.key) as string;
            }));
        }
        
        // 版本错误处理
        if (cellProps.versionError) {
            setDataList(prev => produce(prev, draft => {
                draft[rowIndex].list[columnIndex].showList = true;
            }));
            versionCheckedInfor.current[rowIndex][columnIndex] = 1;
        }
    }, [defaultMap]);

    const handleInputBlur = useCallback(async (
        event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
        cellProps: DataSingleListItemProps,
        rowIndex: number,
        columnIndex: number
    ) => {
        const val = event.target.value.trim();
        
        // 格式化处理
        if (cellProps.format === "date" && val) {
            setDataList(prev => produce(prev, draft => {
                draft[rowIndex].list[columnIndex].value = theFunDateFormat(val);
            }));
        } else if (cellProps.format === "money" && val) {
            setDataList(prev => produce(prev, draft => {
                draft[rowIndex].list[columnIndex].value = formatMoneyValue(val);
            }));
        } else if (cellProps.format === "Y/N" && val) {
            const newVal = val.toUpperCase() === "Y" ? "Y" : "N";
            setDataList(prev => produce(prev, draft => {
                draft[rowIndex].list[columnIndex].value = newVal;
                if (cellProps.key === 'newMemberFlag') {
                    draft[rowIndex].list.forEach(item => {
                        if ('disable' in item) item.disable = false;
                    });
                }
            }));
        } else if (cellProps.format === 'regexpVal' && val) {
            let validateTrue = true;
            if (cellProps.key === 'mobile') {
                validateTrue = /^[+]?[(]?[\d\s-()]{10,}$/.test(val);
            } else if (cellProps.key === 'email') {
                validateTrue = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val);
            } else if (cellProps.key === 'firstnameZhhk' || cellProps.key === 'lastnameZhhk') {
                validateTrue = /^[\u4e00-\u9fa5]{1,10}$/.test(val);
            }
            setDataList(prev => produce(prev, draft => {
                draft[rowIndex].list[columnIndex].valueError = !validateTrue;
            }));
        }
        
        // ID 号处理（异步请求，带竞态处理）
        if (cellProps.key === "idNo" && keydownValueRef.current !== val) {
            const currentRequestId = ++requestIdRef.current;
            const rowId = dataList[rowIndex].id;
            
            try {
                const postData = [{
                    line: rowIndex,
                    isNew: dataList[rowIndex].list[0].value,
                    memAcctOrHkID: val
                }];
                
                const rest = await getMemberInfo<Array<MemberInfo>>(
                    employerCode,
                    payrollGrpShort,
                    postData
                );
                
                // 检查是否是最新请求
                if (currentRequestId !== requestIdRef.current) {
                    console.log('Request outdated, skipping update');
                    return;
                }
                
                const itemRow = rest.length > 0 ? rest[0] : {
                    avIdTypeCode: '',
                    firstName: '',
                    firstnameZhhk: '',
                    hkID: val,
                    lastName: '',
                    lastnameZhhk: '',
                    line: 0,
                    memAcctOrHkID: '',
                    memAcctCode: '',
                    memAcctUuid: '',
                };
                
                if (itemRow.avIdTypeCode === "PASSPORT") {
                    onParentMsg('Tips: This is PASSPORT, not HKID', 'error');
                }
                
                setDataList(prev => produce(prev, draft => {
                    draft[rowIndex].list.forEach(item => {
                        if (item.key === 'newMemberFlag') item.value = itemRow.memAcctUuid ? 'N' : 'Y';
                        if (item.key === 'idNo') item.value = itemRow.hkID ?? '';
                        if (item.key === 'firstName' && itemRow.firstName) item.value = itemRow.firstName;
                        if (item.key === 'lastName' && itemRow.lastName) item.value = itemRow.lastName;
                        if (item.key === 'firstnameZhhk') item.value = itemRow.firstnameZhhk ?? '';
                        if (item.key === 'lastnameZhhk') item.value = itemRow.lastnameZhhk ?? '';
                        if (item.key === 'mobileCountryCode') item.required = !itemRow.memAcctUuid;
                        
                        if (stateUseRef.current === 'SUPERVISOR') {
                            if ('disable' in item) item.disable = false;
                        } else {
                            if ('disable' in item) item.disable = !!itemRow.memAcctUuid;
                            if (item.key === 'newMemberFlag') item.disable = false;
                        }
                    });
                }));
                
                focusInput(rowIndex, columnIndex);
                
                // 更新成员数组
                const existingIndex = checkMemberArray.current.findIndex(m => m.id === rowId);
                if (existingIndex === -1) {
                    checkMemberArray.current.push({ ...itemRow, id: rowId, line: rowIndex });
                } else {
                    checkMemberArray.current[existingIndex] = { ...itemRow, id: rowId, line: rowIndex };
                }
                
            } catch (error) {
                console.error('Failed to fetch member info:', error);
                onParentMsg('Failed to fetch member information', 'error');
            }
            
            keydownValueRef.current = '';
        }
        
        // 版本错误处理
        if (cellProps.versionError) {
            setTimeout(() => {
                setDataList(prev => produce(prev, draft => {
                    draft[rowIndex].list[columnIndex].showList = false;
                }));
            }, 250);
        }
        
        // 触发计算
        if (cellProps.fun === 'Total') {
            updateCalculations(rowIndex, columnIndex, val);
        }
    }, [
        dataList,
        employerCode,
        payrollGrpShort,
        formatMoneyValue,
        focusInput,
        onParentMsg,
        updateCalculations
    ]);

    const handleInputKeydown = useCallback((
        event: React.KeyboardEvent<HTMLInputElement>,
        cellProps: DataSingleListItemProps,
        rowIndex: number,
        columnIndex: number
    ) => {
        if (event.key === "Enter") {
            if (columnIndex === dataSingleArg.list.length - 1) {
                appendRow(rowIndex);
            } else if (cellProps.key === "idNo") {
                event.currentTarget.blur();
            } else {
                focusInput(rowIndex, cellProps.key === "ddeSurch" ? columnIndex + 1 : columnIndex);
            }
        }
    }, [dataSingleArg.list.length, appendRow, focusInput]);

    const handleVersionClick = useCallback((
        event: React.MouseEvent<HTMLLIElement>,
        cellProps: DataSingleListItemProps
    ) => {
        const value = event.currentTarget.innerText;
        const { rowIndex, columnIndex } = cellProps;
        
        setDataList(prev => produce(prev, draft => {
            draft[rowIndex].list[columnIndex].value = value;
            draft[rowIndex].list[columnIndex].showList = false;
        }));
    }, []);

    // ==================== Effects ====================
    useEffect(() => {
        setFooterState(_.cloneDeep(dataFooterArg));
    }, [dataFooterArg]);

    useEffect(() => {
        const matrix: number[][] = Array.from({ length: 100 }, () => Array(42).fill(0));
        versionCheckedInfor.current = matrix;
        checkMemberArray.current.length = 0;
        
        const singleRow = _.cloneDeep(dataSingleArg);
        singleRow.id = new Date().getTime().toString();
        singleRow.list.forEach((item: DataSingleListItemProps, cindex: number) => {
            item.rowIndex = 0;
            item.columnIndex = cindex;
        });
        
        setDataList(prev => produce(prev, draft => {
            if (prev.length === 0) {
                draft.push(singleRow);
            } else {
                draft.splice(0, 1, singleRow);
            }
        }));
    }, [dataSingleArg]);

    useEffect(() => {
        if (dataList.length > 0) {
            setDataList(prev => produce(prev, draft => {
                draft[0].list[4].value = defaultMap.get("contrPeriodStartDate") ?? '';
                draft[0].list[5].value = defaultMap.get("contrPeriodEndDate") ?? '';
            }));
        }
    }, [defaultMap, dataList.length]);

    useEffect(() => {
        const inputDom = inputMapRef.current.get(`input_${dataList.length - 1}_0`);
        if (inputDom) {
            inputDom.focus();
        }
    }, [changeRowCount, dataList.length]);

    // ==================== Imperative Handle ====================
    useImperativeHandle(ref, () => ({
        getRecoredMemberData: () => ({
            recordData: dataList,
            expendData: checkMemberArray.current,
            extData: versionCheckedInfor.current
        }),
        getSharedTotalValue: () => sharedTotalValue.current,
        setInitDataList: (memList: any, state: string) => {
            stateUseRef.current = state;
            if (memList && memList.length > 0) {
                setChangeRowCount(prev => prev + 1);
                
                const bottomIdxObj = dataSingleArg.list
                    .filter(v => v.bottomIndex)
                    .reduce((acc, item) => {
                        acc[item.key] = item.bottomIndex;
                        return acc;
                    }, {} as Record<string, any>);
                
                const bottomIdxMap: Record<string, number> = {};
                let itemIndex = 1;
                for (const key in bottomIdxObj) {
                    bottomIdxMap[key] = itemIndex++;
                }
                
                setDataList(prev => produce(prev, draft => {
                    draft.length = 0;
                    const footerTemp = _.cloneDeep(dataFooterArg.list[0]?.list ?? []);
                    footerTemp.forEach(v => { v.value = '0'; });
                    
                    for (const itemRow of memList) {
                        const singleRow = _.cloneDeep(dataSingleArg);
                        const len = draft.length;
                        let lineTotal = 0;
                        
                        singleRow.list.forEach((item: DataSingleListItemProps, cindex: number) => {
                            if (stateUseRef.current === 'SUPERVISOR') {
                                if ('disable' in item) item.disable = false;
                                if (item.key === 'mobileCountryCode') item.required = true;
                            } else {
                                if ('disable' in item) item.disable = !!itemRow.memAcctUuid;
                                if (item.key === 'newMemberFlag') item.disable = false;
                                if (item.key === 'mobileCountryCode') item.required = !itemRow.memAcctUuid;
                            }
                            
                            item.rowIndex = len;
                            item.columnIndex = cindex;
                            const _val: number = itemRow[item.key];
                            
                            if (item.key in bottomIdxMap && _val) {
                                lineTotal += _val;
                                const _bottomIndex = bottomIdxMap[item.key];
                                if (footerTemp[_bottomIndex]) {
                                    const oldval = Number(footerTemp[_bottomIndex].value || 0);
                                    footerTemp[_bottomIndex].value = String(oldval + _val);
                                }
                            }
                            
                            item.value = String(_val ?? '');
                            if (item.format === 'money') {
                                item.value = theFunMoneyFormat(_val ?? '');
                            }
                        });
                        
                        singleRow.id = itemRow.id;
                        const totalItem = singleRow.list.find(v => v.key === 'Total');
                        if (totalItem) {
                            totalItem.value = theFunMoneyFormat(String(lineTotal));
                        }
                        
                        if (itemRow.versionInfor) {
                            for (const [_key, _val] of Object.entries(itemRow.versionInfor)) {
                                const cell = singleRow.list.find(item => item.key === _key);
                                if (cell) {
                                    cell.versionError = true;
                                    cell.versionList = [
                                        { id: '0', txt: _val[0] },
                                        { id: '1', txt: _val[1] }
                                    ];
                                }
                            }
                        }
                        
                        draft.push(singleRow);
                    }
                    
                    for (let rowIndex = 0; rowIndex < draft.length; rowIndex++) {
                        draft[rowIndex].list.forEach((item, cindex) => {
                            item.rowIndex = rowIndex;
                            item.columnIndex = cindex;
                        });
                    }
                    
                    const footerTotal = footerTemp.slice(0, -1).reduce(
                        (sum, item) => sum + (Number(item.value) || 0), 0
                    );
                    sharedTotalValue.current = footerTotal;
                    
                    if (footerTemp.length > 0) {
                        footerTemp[footerTemp.length - 1].value = String(footerTotal);
                    }
                    
                    footerTemp.forEach(v => {
                        v.value = theFunMoneyFormat(v.value);
                    });
                    
                    setFooterState(prev => produce(prev, draft => {
                        if (!draft || draft.list.length === 0) return;
                        draft.list[0].list = footerTemp;
                    }));
                }));
                
                memList.forEach((element: any) => {
                    checkMemberArray.current.push({
                        id: element.id,
                        avIdTypeCode: element.idType,
                        firstName: element.firstName,
                        firstnameZhhk: element.firstnameZhhk,
                        hkID: element.idNo,
                        lastName: element.lastName,
                        lastnameZhhk: element.lastnameZhhk,
                        line: element.line,
                        memAcctOrHkID: element.idNo,
                        memAcctCode: element.memAcctCode,
                        memAcctUuid: element.memAcctUuid,
                    });
                });
            }
        },
        setVersionInfor: (arg) => {
            versionCheckedInfor.current = _.cloneDeep(arg);
        }
    }));

    // ==================== Render ====================
    return (
        <div className={style.tbContainer}>
            <table style={tbHeaderArg?.tbStyle}>
                {tbHeaderArg?.showTitle && (
                    <caption style={tbHeaderArg.titleStyle}>
                        {tbHeaderArg.title}
                    </caption>
                )}
                
                <thead>
                    {tbHeaderArg?.theadList?.map((rowItem, rowIndex) => (
                        <tr key={rowItem.id}>
                            {tbHeaderArg.showIndex && rowIndex === 0 && (
                                <th
                                    key={rowItem.id + '_index'}
                                    className={style.selfTh}
                                    style={{ width: 40 }}
                                    rowSpan={tbHeaderArg.showRowSpan}
                                >
                                    <div className={style.operation_btn_wrapper}>
                                        <button
                                            className={`${style.operation_btn} ${style.header_add_btn}`}
                                            onClick={handleInsertZeroRow}
                                        >
                                            +
                                        </button>
                                        <span>{tbHeaderArg.titleIndex}</span>
                                    </div>
                                </th>
                            )}
                            {rowItem.rowList.map((colItem) => (
                                <th
                                    key={colItem.id}
                                    className={style.selfTh}
                                    rowSpan={colItem.rowSpan}
                                    colSpan={colItem.colSpan}
                                >
                                    {colItem.title}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                
                <tbody>
                    {dataList.map((rowItem, rowIndex) => (
                        <TableRow
                            key={rowItem.id}
                            rowItem={rowItem}
                            rowIndex={rowIndex}
                            tbHeaderArg={tbHeaderArg}
                            versionCheckedInfor={versionCheckedInfor.current}
                            registerInput={registerInput}
                            onInsertRow={handleInsertRow}
                            onDeleteRow={handleDeleteRow}
                            onInputChange={handleInputChange}
                            onSelectChange={handleSelectChange}
                            onInputFocus={handleInputFocus}
                            onInputBlur={handleInputBlur}
                            onInputKeydown={handleInputKeydown}
                            onVersionClick={handleVersionClick}
                        />
                    ))}
                </tbody>
                
                <tfoot>
                    {footerState.list?.map((trItem) => (
                        <tr key={trItem.id}>
                            {trItem.list.map((tdItem) => (
                                <td
                                    key={tdItem.id}
                                    rowSpan={tdItem.rowSpan}
                                    colSpan={tdItem.colSpan}
                                    className={`${style.selfTd} ${
                                        tdItem.title.length > 0
                                            ? style.selfFooterTitle
                                            : style.selfInputReadOnly
                                    }`}
                                >
                                    {tdItem.title.length > 0 ? tdItem.title : tdItem.value}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tfoot>
            </table>
        </div>
    );
});

export default EnterTables;


// ============================================================================
// 文件: TableRow.tsx (新增的独立行组件)
// ============================================================================

import React, { memo } from 'react';
import style from './EnterTables.module.css';
import { TbHeaderProps, DataSingleProps, DataSingleListItemProps } from '../data/types';

interface TableRowProps {
    rowItem: DataSingleProps;
    rowIndex: number;
    tbHeaderArg: TbHeaderProps;
    versionCheckedInfor: number[][];
    registerInput: (id: string) => (node: HTMLInputElement | HTMLSelectElement | null) => void;
    onInsertRow: (rowIndex: number) => void;
    onDeleteRow: (rowIndex: number) => void;
    onInputChange: (
        event: React.ChangeEvent<HTMLInputElement>,
        cellProps: DataSingleListItemProps,
        rowIndex: number,
        columnIndex: number
    ) => void;
    onSelectChange: (
        event: React.ChangeEvent<HTMLSelectElement>,
        cellProps: DataSingleListItemProps,
        rowIndex: number,
        columnIndex: number
    ) => void;
    onInputFocus: (
        event: React.FocusEvent<HTMLInputElement>,
        cellProps: DataSingleListItemProps,
        rowIndex: number,
        columnIndex: number
    ) => void;
    onInputBlur: (
        event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
        cellProps: DataSingleListItemProps,
        rowIndex: number,
        columnIndex: number
    ) => void;
    onInputKeydown: (
        event: React.KeyboardEvent<HTMLInputElement>,
        cellProps: DataSingleListItemProps,
        rowIndex: number,
        columnIndex: number
    ) => void;
    onVersionClick: (
        event: React.MouseEvent<HTMLLIElement>,
        cellProps: DataSingleListItemProps
    ) => void;
}

const TableRow = memo<TableRowProps>(({
    rowItem,
    rowIndex,
    tbHeaderArg,
    versionCheckedInfor,
    registerInput,
    onInsertRow,
    onDeleteRow,
    onInputChange,
    onSelectChange,
    onInputFocus,
    onInputBlur,
    onInputKeydown,
    onVersionClick
}) => {
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
                    {item.readOnly ? (
                        <span className={item.format === 'money' ? style.selfCellMoney : ''}>
                            {item.value}
                        </span>
                    ) : (
                        <div
                            className={`${style.selfInputContainer} ${
                                versionCheckedInfor[item.rowIndex]?.[item.columnIndex] === 1
                                    ? style.selfInputCheckSign
                                    : ''
                            }`}
                        >
                            {item.type === 'select' ? (
                                <select
                                    ref={registerInput(`input_${item.rowIndex}_${item.columnIndex}`)}
                                    data-testid={`${item.key}-${rowIndex}`}
                                    name={item.key}
                                    value={item.value}
                                    disabled={item.disable}
                                    className={style.selfSelect}
                                    onChange={(e) => onSelectChange(e, item, item.rowIndex, item.columnIndex)}
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
                            ) : (
                                <input
                                    ref={registerInput(`input_${item.rowIndex}_${item.columnIndex}`)}
                                    autoComplete="off"
                                    data-testid={`${item.key}-${rowIndex}`}
                                    name={item.key}
                                    value={item.value}
                                    placeholder={item.placeholder}
                                    disabled={item.disable}
                                    className={`${style.selfInput} ${
                                        item.format === 'money' ? style.selfInputMoney : ''
                                    } ${
                                        item.versionError || item.valueError
                                            ? style.selfInputVersionError
                                            : ''
                                    }`}
                                    onFocus={(e) => onInputFocus(e, item, item.rowIndex, item.columnIndex)}
                                    onKeyDown={(e) => onInputKeydown(e, item, item.rowIndex, item.columnIndex)}
                                    onChange={(e) => onInputChange(e, item, item.rowIndex, item.columnIndex)}
                                    onBlur={(e) => onInputBlur(e, item, item.rowIndex, item.columnIndex)}
                                />
                            )}
                            
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
                    )}
                </td>
            ))}
        </tr>
    );
}, (prevProps, nextProps) => {
    // 自定义比较函数：只有当前行数据变化时才重渲染
    return (
        prevProps.rowItem === nextProps.rowItem &&
        prevProps.rowIndex === nextProps.rowIndex &&
        prevProps.versionCheckedInfor === nextProps.versionCheckedInfor
    );
});

TableRow.displayName = 'TableRow';

export default TableRow;