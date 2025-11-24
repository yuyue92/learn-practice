// EnterTables.tsx
import React, {
  forwardRef,
  useImperativeHandle,
} from 'react';
import style from './EnterTables.module.css';
import {
  TbHeaderProps,
  DataSingleProps,
  DataFooterProps,
} from '../data/types';
import EnterTableCell from './EnterTableCell';
import {
  useEnterTable,
  EnterTableImperative,
  EnterTableProps,
} from './useEnterTable';

interface ChildProps extends EnterTableProps {}

export interface ChildHandleTable extends EnterTableImperative {}

const EnterTables = forwardRef<ChildHandleTable, ChildProps>(
  (
    {
      tbHeaderArg,
      dataSingleArg,
      dataFooterArg,
      defaultMap,
      employerCode,
      payrollGrpShort,
      onParentMsg,
    },
    ref,
  ) => {
    // ✅ 把所有状态 & 事件从 hook 里取出来
    const {
      dataList,
      footerState,
      columnCount,
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
      getRecoredMemberData,
      getSharedTotalValue,
      setInitDataList,
      setVersionInfor,
    } = useEnterTable({
      tbHeaderArg,
      dataSingleArg,
      dataFooterArg,
      defaultMap,
      employerCode,
      payrollGrpShort,
      onParentMsg,
    });

    // ✅ ref 能力：由 hook 提供实现，这里只是转发
    useImperativeHandle(ref, () => ({
      getRecoredMemberData,
      getSharedTotalValue,
      setInitDataList,
      setVersionInfor,
    }));

    return (
      <div className={style.tbContainer}>
        <table style={tbHeaderArg?.tbStyle}>
          {tbHeaderArg?.showTitle && (
            <caption style={tbHeaderArg.titleStyle}>
              {tbHeaderArg.title}
            </caption>
          )}
          {/* ======== thead 部分保持原样（只删掉逻辑） ======== */}
          <thead>
            {tbHeaderArg?.theadList &&
              tbHeaderArg.theadList.map((rowItem, rowIndex) => (
                <tr key={rowItem.id}>
                  {tbHeaderArg.showIndex && rowIndex === 0 && (
                    <th
                      className={style.selfTh}
                      style={{ width: 40 }}
                      rowSpan={tbHeaderArg.showRowSpan}
                    >
                      <div className={style.operation_btn_wrapper}>
                        <button
                          className={style.header_add_btn}
                          onClick={handleInsertZeroRow}
                        >
                          +
                        </button>
                        <span>{tbHeaderArg.titleIndex}</span>
                      </div>
                    </th>
                  )}
                  {rowItem.list.map((item) => (
                    <th
                      key={`${rowItem.id}_${item.id}`}
                      className={style.selfTh}
                    >
                      {item.title}
                    </th>
                  ))}
                </tr>
              ))}
          </thead>

          {/* ======== tbody：用 EnterTableCell 渲染每一个单元格 ======== */}
          <tbody>
            {dataList.map((rowItem, rowIndex) => (
              <tr
                key={`tr_${rowItem.id}`}
                className={rowItem.errorRow ? style.selfRowError : ''}
              >
                {tbHeaderArg.showIndex && (
                  <td
                    key={`tr_${rowItem.id}_td_index`}
                    className={style.selfTd}
                  >
                    <div className={style.operation_btn_wrapper}>
                      <button
                        className={style.operation_btn}
                        data-row={rowIndex}
                        onClick={handleInsertRow}
                      >
                        +
                      </button>
                      <button
                        className={style.operation_btn}
                        data-row={rowIndex}
                        onClick={handleDeleteRow}
                      >
                        -
                      </button>
                      <span>{rowIndex + 1}</span>
                    </div>
                  </td>
                )}

                {rowItem.list.map((cell, colIndex) => (
                  <EnterTableCell
                    key={`tr_${rowItem.id}_td_${colIndex}`}
                    rowId={rowItem.id}
                    rowIndex={rowIndex}
                    columnIndex={colIndex}
                    cell={cell}
                    regeditInput={regeditInput}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeydown}
                    onSelectChange={handleSelectChange}
                    onVersionClick={handleClickFun}
                  />
                ))}
              </tr>
            ))}
          </tbody>

          {/* ======== tfoot：沿用你原来的 footerState 渲染 ======== */}
          <tfoot>
            {footerState.list.map((row, rowIndex) => (
              <tr key={`footer_${rowIndex}`}>
                {tbHeaderArg.showIndex && (
                  <td className={style.selfTd}>
                    <span className={style.selfFooterTitle}>
                      {row.footerTitle}
                    </span>
                  </td>
                )}
                {row.list.map((cell, colIndex) => (
                  <td
                    key={`footer_${rowIndex}_${colIndex}`}
                    className={style.selfTd}
                  >
                    <span
                      className={
                        cell.format === 'money'
                          ? style.selfCellMoney
                          : ''
                      }
                    >
                      {cell.value}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    );
  },
);

export default EnterTables;
