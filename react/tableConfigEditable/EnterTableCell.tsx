// EnterTableCell.tsx
import React from 'react';
import style from './EnterTables.module.css';
import { DataSingleListItemProps } from '../data/types';

type EnterTableCellProps = {
  rowId: string | number;
  rowIndex: number;
  columnIndex: number;
  cell: DataSingleListItemProps;
  regeditInput: (
    id: string,
  ) => (el: HTMLInputElement | HTMLSelectElement | null) => void;
  onFocus: (
    e: React.FocusEvent<HTMLInputElement>,
    cell: DataSingleListItemProps,
    rowIndex: number,
    columnIndex: number,
  ) => void;
  onBlur: (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
    cell: DataSingleListItemProps,
    rowIndex: number,
    columnIndex: number,
  ) => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    cell: DataSingleListItemProps,
    rowIndex: number,
    columnIndex: number,
  ) => void;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    cell: DataSingleListItemProps,
    rowIndex: number,
    columnIndex: number,
  ) => void;
  onSelectChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    cell: DataSingleListItemProps,
    rowIndex: number,
    columnIndex: number,
  ) => void;
  onVersionClick: (
    e: React.MouseEvent,
    cell: DataSingleListItemProps,
  ) => void;
};

const EnterTableCell: React.FC<EnterTableCellProps> = ({
  rowId,
  rowIndex,
  columnIndex,
  cell,
  regeditInput,
  onFocus,
  onBlur,
  onChange,
  onKeyDown,
  onSelectChange,
  onVersionClick,
}) => {
  const inputKey = `tr_${rowId}_td_${columnIndex}_input_${columnIndex}`;
  const ulKey = `tr_${rowId}_td_${columnIndex}_ul_${columnIndex}`;

  const tdClassName = `${style.selfTd} ${
    cell.required && !cell.value && cell.type !== 'select'
      ? style.selfInputRequire
      : ''
  }`;

  if (cell.readOnly) {
    return (
      <td className={tdClassName}>
        <span
          className={cell.format === 'money' ? style.selfCellMoney : ''}
        >
          {cell.value}
        </span>
      </td>
    );
  }

  return (
    <td className={tdClassName}>
      <div className={style.selfInputContainer}>
        {cell.type === 'select' ? (
          <select
            ref={regeditInput(`input_${cell.rowIndex}_${cell.columnIndex}`)}
            key={inputKey}
            data-testid={`${cell.key}-${rowIndex}`}
            name={cell.key}
            value={cell.value}
            disabled={cell.disable}
            className={style.selfSelect}
            onChange={(e) => onSelectChange(e, cell, rowIndex, columnIndex)}
            onBlur={(e) => onBlur(e, cell, rowIndex, columnIndex)}
          >
            <option value="" disabled>
              select
            </option>
            {cell.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            ref={regeditInput(`input_${cell.rowIndex}_${cell.columnIndex}`)}
            autoComplete="off"
            key={inputKey}
            data-testid={`${cell.key}-${rowIndex}`}
            name={cell.key}
            value={cell.value}
            placeholder={cell.placeholder}
            disabled={cell.disable}
            className={`${style.selfInput} ${
              cell.format === 'money' ? style.selfInputMoney : ''
            } ${
              cell.readOnly ? style.selfInputReadOnly : ''
            } ${
              cell.versionError || cell.valueError
                ? style.selfInputVersionError
                : ''
            }`}
            onFocus={(e) => onFocus(e, cell, rowIndex, columnIndex)}
            onKeyDown={(e) => onKeyDown(e, cell, rowIndex, columnIndex)}
            onChange={(e) => onChange(e, cell, rowIndex, columnIndex)}
            onBlur={(e) => onBlur(e, cell, rowIndex, columnIndex)}
          />
        )}

        {cell.versionError && cell.showList && cell.versionList && (
          <ul key={ulKey} className={style.selfUL}>
            {cell.versionList.map((versionItem) => (
              <li
                key={`${columnIndex}_li_${versionItem.id}`}
                onClick={(e) => onVersionClick(e, cell)}
              >
                {versionItem.txt}
              </li>
            ))}
          </ul>
        )}
      </div>
    </td>
  );
};

export default EnterTableCell;
