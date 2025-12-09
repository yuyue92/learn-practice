import React, { useState, useCallback, memo } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, GripVertical } from 'lucide-react';

// 初始数据结构示例
const initialData = [
  {
    groupId: 'g1',
    groupName: '电子产品类',
    isExpanded: true,
    rows: [
      { id: 'r1', product: '笔记本电脑', quantity: 10, price: 5999, amount: 59990 },
      { id: 'r2', product: '鼠标', quantity: 50, price: 99, amount: 4950 },
    ]
  },
  {
    groupId: 'g2',
    groupName: '办公用品类',
    isExpanded: true,
    rows: [
      { id: 'r3', product: '打印纸', quantity: 100, price: 25, amount: 2500 },
      { id: 'r4', product: '签字笔', quantity: 200, price: 3, amount: 600 },
      { id: 'r5', product: '文件夹', quantity: 80, price: 5, amount: 400 },
    ]
  },
  {
    groupId: 'g3',
    groupName: '家具类',
    isExpanded: false,
    rows: [
      { id: 'r6', product: '办公椅', quantity: 20, price: 899, amount: 17980 },
    ]
  }
];

// 表格列配置
const COLUMNS = [
  { key: 'product', label: '产品名称', width: '30%' },
  { key: 'quantity', label: '数量', width: '20%', type: 'number' },
  { key: 'price', label: '单价', width: '20%', type: 'number' },
  { key: 'amount', label: '金额', width: '20%', type: 'number' },
];

// 主组件
function GroupedTableDemo() {
  const [groups, setGroups] = useState(initialData);

  // 切换分组展开/收缩
  const toggleGroup = useCallback((groupId) => {
    setGroups(prev => prev.map(group => 
      group.groupId === groupId 
        ? { ...group, isExpanded: !group.isExpanded }
        : group
    ));
  }, []);

  // 更新单元格数据
  const updateCell = useCallback((groupId, rowId, key, value) => {
    setGroups(prev => prev.map(group => {
      if (group.groupId !== groupId) return group;
      
      return {
        ...group,
        rows: group.rows.map(row => {
          if (row.id !== rowId) return row;
          
          const updatedRow = { ...row, [key]: value };
          
          // 自动计算金额
          if (key === 'quantity' || key === 'price') {
            updatedRow.amount = (updatedRow.quantity || 0) * (updatedRow.price || 0);
          }
          
          return updatedRow;
        })
      };
    }));
  }, []);

  // 添加新行
  const addRow = useCallback((groupId) => {
    setGroups(prev => prev.map(group => {
      if (group.groupId !== groupId) return group;
      
      const newRow = {
        id: `r${Date.now()}`,
        product: '',
        quantity: 0,
        price: 0,
        amount: 0,
      };
      
      return {
        ...group,
        rows: [...group.rows, newRow]
      };
    }));
  }, []);

  // 删除行
  const deleteRow = useCallback((groupId, rowId) => {
    setGroups(prev => prev.map(group => {
      if (group.groupId !== groupId) return group;
      
      return {
        ...group,
        rows: group.rows.filter(row => row.id !== rowId)
      };
    }));
  }, []);

  // 添加新分组
  const addGroup = useCallback(() => {
    const newGroup = {
      groupId: `g${Date.now()}`,
      groupName: `新分组${groups.length + 1}`,
      isExpanded: true,
      rows: [{
        id: `r${Date.now()}`,
        product: '',
        quantity: 0,
        price: 0,
        amount: 0,
      }]
    };
    setGroups(prev => [...prev, newGroup]);
  }, [groups.length]);

  // 删除分组
  const deleteGroup = useCallback((groupId) => {
    setGroups(prev => prev.filter(group => group.groupId !== groupId));
  }, []);

  // 计算分组汇总
  const getGroupTotal = useCallback((rows) => {
    return rows.reduce((sum, row) => sum + (row.amount || 0), 0);
  }, []);

  // 计算总计
  const grandTotal = groups.reduce((sum, group) => 
    sum + getGroupTotal(group.rows), 0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          {/* 头部 */}
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">采购明细表</h1>
              <p className="text-sm text-gray-500 mt-1">支持分组展开/收缩、增删行</p>
            </div>
            <button
              onClick={addGroup}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              添加分组
            </button>
          </div>

          {/* 表格容器 */}
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* 表头 */}
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="w-12 px-4 py-3"></th>
                  {COLUMNS.map(col => (
                    <th 
                      key={col.key}
                      style={{ width: col.width }}
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="w-24 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    操作
                  </th>
                </tr>
              </thead>

              {/* 表体 */}
              <tbody>
                {groups.map((group, groupIndex) => (
                  <GroupSection
                    key={group.groupId}
                    group={group}
                    groupIndex={groupIndex}
                    onToggle={toggleGroup}
                    onUpdateCell={updateCell}
                    onAddRow={addRow}
                    onDeleteRow={deleteRow}
                    onDeleteGroup={deleteGroup}
                    getGroupTotal={getGroupTotal}
                  />
                ))}
              </tbody>

              {/* 总计行 */}
              <tfoot className="bg-blue-50 border-t-2 border-blue-200">
                <tr>
                  <td className="px-4 py-4"></td>
                  <td colSpan={COLUMNS.length - 1} className="px-4 py-4 text-right font-bold text-gray-900">
                    总计：
                  </td>
                  <td className="px-4 py-4 font-bold text-blue-600 text-lg">
                    ¥{grandTotal.toLocaleString()}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// 分组区域组件
const GroupSection = memo(({ 
  group, 
  groupIndex,
  onToggle, 
  onUpdateCell, 
  onAddRow, 
  onDeleteRow,
  onDeleteGroup,
  getGroupTotal 
}) => {
  const groupTotal = getGroupTotal(group.rows);

  return (
    <>
      {/* 分组头部 */}
      <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-y border-gray-200">
        <td colSpan={COLUMNS.length + 2} className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggle(group.groupId)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {group.isExpanded ? (
                  <ChevronDown size={20} className="text-gray-600" />
                ) : (
                  <ChevronRight size={20} className="text-gray-600" />
                )}
              </button>
              <GripVertical size={18} className="text-gray-400" />
              <span className="font-semibold text-gray-900">
                {group.groupName}
              </span>
              <span className="text-sm text-gray-500">
                ({group.rows.length} 项)
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                小计: <span className="text-blue-600 font-bold">¥{groupTotal.toLocaleString()}</span>
              </span>
              <button
                onClick={() => onAddRow(group.groupId)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                <Plus size={14} />
                添加行
              </button>
              <button
                onClick={() => onDeleteGroup(group.groupId)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                title="删除分组"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </td>
      </tr>

      {/* 分组内容（可展开/收缩） */}
      {group.isExpanded && group.rows.map((row, rowIndex) => (
        <TableRow
          key={row.id}
          row={row}
          groupId={group.groupId}
          rowIndex={rowIndex}
          onUpdateCell={onUpdateCell}
          onDeleteRow={onDeleteRow}
        />
      ))}
    </>
  );
});

// 表格行组件
const TableRow = memo(({ row, groupId, rowIndex, onUpdateCell, onDeleteRow }) => {
  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="px-4 py-2 text-center text-gray-400 text-sm">
        {rowIndex + 1}
      </td>
      {COLUMNS.map(col => (
        <td key={col.key} className="px-4 py-2">
          <input
            type={col.type === 'number' ? 'number' : 'text'}
            value={row[col.key]}
            onChange={(e) => {
              const value = col.type === 'number' 
                ? parseFloat(e.target.value) || 0
                : e.target.value;
              onUpdateCell(groupId, row.id, col.key, value);
            }}
            className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            readOnly={col.key === 'amount'}
          />
        </td>
      ))}
      <td className="px-4 py-2 text-center">
        <button
          onClick={() => onDeleteRow(groupId, row.id)}
          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
          title="删除行"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
});

export default GroupedTableDemo;