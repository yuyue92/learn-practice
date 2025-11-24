// useEnterTable.ts
import { useCallback, useMemo, useRef, useState } from 'react';
import { produce } from 'immer';
import _ from 'lodash';
import style from './EnterTables.module.css'; // 如果不需要样式，可以删掉
import { getMemberInfo } from '@/api/cde/index';
import {
  TbHeaderProps,
  DataSingleProps,
  DataFooterProps,
  DataSingleListItemProps,
  MemberInfo,
} from '../data/types';
import { theFunDateFormat, theFunMoneyFormat } from '../util';

export interface EnterTableProps {
  tbHeaderArg: TbHeaderProps;
  dataSingleArg: DataSingleProps;
  dataFooterArg: DataFooterProps;
  defaultMap: Map<string, string>;
  employerCode: string;
  payrollGrpShort: string;
  onParentMsg: (
    txt: string,
    arg: 'error' | 'success' | 'info' | 'warning' | undefined,
  ) => void;
}

/**
 * 用来给 DataCollection / 父组件使用的 ref 能力
 */
export interface EnterTableImperative {
  getRecoredMemberData: () => {
    recordData: Array<DataSingleProps>;
    expendData: Array<MemberInfo>;
    extData: number[][];
  };
  getSharedTotalValue: () => number;
  setInitDataList: (memList: any, state: string) => void;
  setVersionInfor: (arg: Array<Array<number>>) => void;
}

/**
 * EnterTables 的内部状态 & 事件全部收敛到这个 hook
 */
export const useEnterTable = ({
  tbHeaderArg,
  dataSingleArg,
  dataFooterArg,
  defaultMap,
  employerCode,
  payrollGrpShort,
  onParentMsg,
}: EnterTableProps) => {
  /** ========= 原来组件里的 useRef / useState 全部搬到这里 ========= */

  const sharedTotalValue = useRef<number>(0);

  const totalArray = useRef<Array<number>>([]);
  const totalIndex = useRef<number>(0);

  const columnCount = useMemo(() => {
    return (
      dataSingleArg.list.length - 1 + (tbHeaderArg.showIndex ? 1 : 0)
    );
  }, [dataSingleArg, tbHeaderArg.showIndex]);

  const checkMemberArray = useRef<Array<MemberInfo>>([]);
  const lastDOIndex = useRef<number>(-1);
  const versionCheckedInfor = useRef<number[][]>([]);
  const [dataList, setDataList] = useState<Array<DataSingleProps>>([]);
  const stateUseRef = useRef<string>('');
  const inputMapRef =
    useRef<Map<string, HTMLInputElement | HTMLSelectElement>>(
      new Map(),
    );
  const [changeRowCount, setChangeRowCount] = useState<number>(0);
  const currentValFun = useRef<string>('');
  const rowIndexFun = useRef<number>(-1);
  const columnIndexFun = useRef<number>(-1);
  const [funCount, setFunCount] = useState<number>(0);
  const keydownValueRef = useRef('');
  const [footerState, setFooterState] = useState<DataFooterProps>(() =>
    _.cloneDeep(dataFooterArg),
  );

  /** ========= 这里开始，把你原来 EnterTables 里面的函数一点点剪过来 ========= */

  /** 1. 版本矩阵 setVersionInfor（原来在 useImperativeHandle 里） */
  const setVersionInfor = useCallback((arg: Array<Array<number>>) => {
    versionCheckedInfor.current = _.cloneDeep(arg);
  }, []);

  /** 2. currentFunWithOutFormat / 合计逻辑（原样搬进来） */
  const currentFunWithOutFormat = useCallback(
    (_currentVal: string, rowIndex: number, columnIndex: number): void => {
      // 👉 这里把原来 EnterTables 里的 currentFunWithOutFormat 函数体整体剪切过来
      // 例如：
      //
      // if (rowIndex !== -1 && columnIndex !== -1) {
      //   let _currentTxt = '';
      //   ...
      //   setFooterState(...);
      //   sharedTotalValue.current = ...;
      // }
    },
    [],
  );

  /** 3. setInitDataList（原来在 useImperativeHandle 里面） */
  const setInitDataList = useCallback(
    (memList: any, state: string): void => {
      stateUseRef.current = state;
      if (memList && memList.length > 0) {
        setChangeRowCount((prev) => prev + 1);

        // 👉 把原来 useImperativeHandle.setInitDataList 里的逻辑整体剪到这里
        // 例如：
        // const bottomIdxObj = dataSingleArg.list.filter(v => v.bottomIndex > -1)...
        // setDataList(produce(...))
        // setFooterState(...)

        // 注意：原来里面有一大段 `setDataList(produce(...))` 和 footer 累加逻辑，
        // 直接原封不动粘进来即可。
      } else {
        // 原来没有数据时的处理逻辑，也一起搬
        // setDataList([ ...一行空行... ])
        // setFooterState(_.cloneDeep(dataFooterArg));
      }
    },
    [dataFooterArg, dataSingleArg],
  );

  /** 4. 输入事件：focus / change / blur / keydown / selectChange / 版本点击 **/

  const regeditInput = useCallback(
    (id: string) =>
      (el: HTMLInputElement | HTMLSelectElement | null) => {
        if (el) {
          inputMapRef.current.set(id, el);
        } else {
          inputMapRef.current.delete(id);
        }
      },
    [],
  );

  const handleClickFun = useCallback(
    (event: React.MouseEvent, cell: DataSingleListItemProps) => {
      // 👉 原来版本 ul > li 点击的逻辑，整体剪过来
    },
    [],
  );

  const handleInputFocus = useCallback(
    (
      event: React.FocusEvent<HTMLInputElement>,
      cell: DataSingleListItemProps,
      rowIndex: number,
      columnIndex: number,
    ) => {
      // 👉 原来的 handleInputFocus 逻辑剪过来
    },
    [],
  );

  const handleSelectChange = useCallback(
    (
      event: React.ChangeEvent<HTMLSelectElement>,
      cell: DataSingleListItemProps,
      rowIndex: number,
      columnIndex: number,
    ) => {
      // 👉 原来的 handleSelectChange 逻辑剪过来
    },
    [],
  );

  const handleInputChange = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      cell: DataSingleListItemProps,
      rowIndex: number,
      columnIndex: number,
    ) => {
      // 👉 原来的 handleInputChange 逻辑剪过来
    },
    [],
  );

  const handleInsertZeroRow = useCallback(() => {
    // 👉 原来的 handleInsertZeroRow 逻辑剪过来（在表头 + 按钮上）
  }, []);

  const handleInsertRow = useCallback((event: any) => {
    // 👉 原来的 handleInsertRow 逻辑剪过来
  }, []);

  const handleDeleteRow = useCallback((event: any) => {
    // 👉 原来的 handleDeleteRow 逻辑剪过来
  }, []);

  const handleInputKeydown = useCallback(
    (
      event: React.KeyboardEvent<HTMLInputElement>,
      cell: DataSingleListItemProps,
      rowIndex: number,
      columnIndex: number,
    ) => {
      // 👉 原来的 handleInputKeydown 逻辑剪过来
    },
    [],
  );

  const handleInputBlur = useCallback(
    async (
      event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
      cell: DataSingleListItemProps,
      rowIndex: number,
      columnIndex: number,
    ) => {
      // 👉 原来的 handleInputBlur 逻辑剪过来
      //    包括 getMemberInfo / checkMemberArray / versionCheckedInfor 等
    },
    [],
  );

  /** ========= 提供给外部 ref 使用的 4 个方法 ========= */

  const getRecoredMemberData = useCallback(() => {
    return {
      recordData: dataList,
      expendData: checkMemberArray.current,
      extData: versionCheckedInfor.current,
    };
  }, [dataList]);

  const getSharedTotalValue = useCallback(() => {
    return sharedTotalValue.current;
  }, []);

  /** ========= 导出给 EnterTables 组件用的数据 & 事件 ========= */

  return {
    // 状态
    dataList,
    footerState,
    columnCount,

    // 输入 / 操作事件
    regeditInput,
    handleClickFun,
    handleInputFocus,
    handleSelectChange,
    handleInputChange,
    handleInsertZeroRow,
    handleInsertRow,
    handleDeleteRow,
    handleInputKeydown,
    handleInputBlur,

    // 给 ref 用的
    getRecoredMemberData,
    getSharedTotalValue,
    setInitDataList,
    setVersionInfor,
  };
};
