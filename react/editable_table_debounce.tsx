import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Trash2, Plus, Save } from 'lucide-react';

// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 子组件：可编辑表格
function EditableTable({ groupData, onDataChange }) {
  // 分页状态（子组件内部管理）
  const [currentPageNo, setCurrentPageNo] = useState(1);
  
  // 当前页的本地编辑数据
  const [localData, setLocalData] = useState([]);
  
  // 标记数据是否有变化（用于UI提示）
  const [hasChanges, setHasChanges] = useState(false);

  // 计算总页数
  const totalPages = useMemo(() => {
    return Object.keys(groupData).length;
  }, [groupData]);

  // 防抖的数据更新函数（300ms延迟）
  const debouncedUpdate = useMemo(
    () => debounce((pageNo, data) => {
      console.log(`[防抖触发] 同步页面 ${pageNo} 数据到父组件`);
      onDataChange(pageNo, data);
      setHasChanges(false);
    }, 300),
    [onDataChange]
  );

  // 清理防抖函数
  useEffect(() => {
    return () => {
      debouncedUpdate.cancel?.();
    };
  }, [debouncedUpdate]);

  // 监听页码变化和父组件数据变化，同步到本地
  useEffect(() => {
    const pageKey = `pageNo${currentPageNo}`;
    const pageData = groupData[pageKey] || [];
    
    console.log(`[页面切换] 加载页面 ${currentPageNo} 数据:`, pageData);
    setLocalData(pageData);
    setHasChanges(false);
  }, [currentPageNo, groupData]);

  // 编辑单元格
  const handleEdit = useCallback((rowIndex, field, value) => {
    const newData = localData.map((row, idx) => 
      idx === rowIndex ? { ...row, [field]: value } : row
    );
    
    setLocalData(newData);
    setHasChanges(true);
    
    // 触发防抖更新
    const pageKey = `pageNo${currentPageNo}`;
    debouncedUpdate(pageKey, newData);
  }, [localData, currentPageNo, debouncedUpdate]);

  // 删除行
  const handleDelete = useCallback((rowIndex) => {
    const newData = localData.filter((_, idx) => idx !== rowIndex);
    
    setLocalData(newData);
    setHasChanges(true);
    
    const pageKey = `pageNo${currentPageNo}`;
    debouncedUpdate(pageKey, newData);
  }, [localData, currentPageNo, debouncedUpdate]);

  // 新增行
  const handleAdd = useCallback(() => {
    const newRow = {
      id: Date.now(),
      name: '',
      value: '',
      description: ''
    };
    const newData = [...localData, newRow];
    
    setLocalData(newData);
    setHasChanges(true);
    
    const pageKey = `pageNo${currentPageNo}`;
    debouncedUpdate(pageKey, newData);
  }, [localData, currentPageNo, debouncedUpdate]);

  // 立即保存当前页（跳过防抖）
  const handleImmediateSave = useCallback(() => {
    const pageKey = `pageNo${currentPageNo}`;
    console.log(`[立即保存] 同步页面 ${currentPageNo} 数据`);
    onDataChange(pageKey, localData);
    setHasChanges(false);
  }, [currentPageNo, localData, onDataChange]);

  // 页码切换
  const handlePageChange = useCallback((newPageNo) => {
    if (newPageNo < 1 || newPageNo > totalPages) return;
    
    // 切换页面前立即保存当前页（避免防抖丢失数据）
    if (hasChanges) {
      const pageKey = `pageNo${currentPageNo}`;
      console.log(`[切换前保存] 立即同步页面 ${currentPageNo} 数据`);
      onDataChange(pageKey, localData);
    }
    
    setCurrentPageNo(newPageNo);
  }, [totalPages, hasChanges, currentPageNo, localData, onDataChange]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          可编辑表格 - 页面 {currentPageNo}
          {hasChanges && (
            <span className="ml-2 text-sm text-orange-500">(未保存)</span>
          )}
        </h2>
        <button
          onClick={handleImmediateSave}
          disabled={!hasChanges}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save size={16} />
          立即保存
        </button>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">名称</th>
              <th className="border border-gray-300 px-4 py-2">数值</th>
              <th className="border border-gray-300 px-4 py-2">描述</th>
              <th className="border border-gray-300 px-4 py-2 w-24">操作</th>
            </tr>
          </thead>
          <tbody>
            {localData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-400">
                  暂无数据，点击下方"新增行"按钮添加
                </td>
              </tr>
            ) : (
              localData.map((row, idx) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-gray-600">
                    {row.id}
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) => handleEdit(idx, 'name', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
                      placeholder="输入名称"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <input
                      type="text"
                      value={row.value}
                      onChange={(e) => handleEdit(idx, 'value', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
                      placeholder="输入数值"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <input
                      type="text"
                      value={row.description}
                      onChange={(e) => handleEdit(idx, 'description', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
                      placeholder="输入描述"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    <button
                      onClick={() => handleDelete(idx)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                      title="删除"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 新增按钮 */}
      <button
        onClick={handleAdd}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
      >
        <Plus size={16} />
        新增行
      </button>

      {/* 分页控制 */}
      <div className="flex justify-center items-center gap-4 mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() => handlePageChange(currentPageNo - 1)}
          disabled={currentPageNo === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          上一页
        </button>
        
        <span className="text-gray-700 font-medium">
          第 {currentPageNo} / {totalPages} 页
        </span>
        
        <button
          onClick={() => handlePageChange(currentPageNo + 1)}
          disabled={currentPageNo === totalPages}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          下一页
        </button>
      </div>
    </div>
  );
}

// 父组件 Demo
export default function App() {
  // 父组件维护所有页面数据
  const [groupData, setGroupData] = useState({
    pageNo1: [
      { id: 1, name: '商品A', value: '100', description: '第一页数据1' },
      { id: 2, name: '商品B', value: '200', description: '第一页数据2' }
    ],
    pageNo2: [
      { id: 3, name: '商品C', value: '300', description: '第二页数据1' },
      { id: 4, name: '商品D', value: '400', description: '第二页数据2' }
    ],
    pageNo3: [
      { id: 5, name: '商品E', value: '500', description: '第三页数据1' }
    ]
  });

  const [saveLog, setSaveLog] = useState([]);

  // 接收子组件的数据更新
  const handleDataChange = useCallback((pageKey, newData) => {
    console.log(`[父组件收到] ${pageKey} 数据更新:`, newData);
    
    setGroupData(prev => ({
      ...prev,
      [pageKey]: newData
    }));

    // 记录更新日志
    setSaveLog(prev => [
      ...prev,
      { 
        time: new Date().toLocaleTimeString(), 
        page: pageKey, 
        count: newData.length 
      }
    ].slice(-10)); // 只保留最近10条
  }, []);

  // 模拟保存到后端
  const handleSaveToBackend = async () => {
    console.log('[保存到后端] 所有数据:', groupData);
    alert('数据已保存到后端（查看控制台）');
    
    // 实际项目中：
    // await fetch('/api/save', {
    //   method: 'POST',
    //   body: JSON.stringify(groupData)
    // });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 子组件 */}
        <EditableTable 
          groupData={groupData}
          onDataChange={handleDataChange}
        />

        {/* 父组件控制区 */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">父组件控制面板</h3>
          
          <button
            onClick={handleSaveToBackend}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium"
          >
            保存所有数据到后端
          </button>

          {/* 更新日志 */}
          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 mb-2">数据更新日志：</h4>
            <div className="bg-gray-50 p-4 rounded max-h-48 overflow-y-auto">
              {saveLog.length === 0 ? (
                <p className="text-gray-400 text-sm">暂无更新记录</p>
              ) : (
                <ul className="space-y-1 text-sm text-gray-600">
                  {saveLog.map((log, idx) => (
                    <li key={idx}>
                      [{log.time}] {log.page} 更新 - 共 {log.count} 条数据
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* 当前数据预览 */}
          <details className="mt-4">
            <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
              查看当前所有数据（JSON）
            </summary>
            <pre className="mt-2 p-4 bg-gray-800 text-green-400 rounded text-xs overflow-x-auto">
              {JSON.stringify(groupData, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}