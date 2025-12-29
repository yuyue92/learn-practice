import React, { useState } from 'react';

// 可复用的版本选择器组件
const VersionSelector = ({ 
  value1 = "版本1", 
  value2 = "版本2",
  version1Data = null, // 新增：{ header: ['列1', '列2'], data: [[值1, 值2], ...] }
  version2Data = null, // 新增：{ header: ['列1', '列2'], data: [[值1, 值2], ...] }
  inputPlaceholder = "或输入自定义值",
  onSave 
}) => {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('version1');
  const [customValue, setCustomValue] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = () => {
    let finalValue;
    
    if (selectedOption === 'version1') {
      finalValue = value1;
    } else if (selectedOption === 'version2') {
      finalValue = value2;
    } else {
      finalValue = customValue;
    }
    
    if (onSave) {
      onSave(finalValue);
    }
    
    setIsConfirmed(true); // 新增：标记为已确认
    handleClose();
  };

  const styles = {
    iconButton: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      backgroundColor: '#f44336', // 红色，已确认后会变绿色
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontWeight: 'bold',
      fontFamily: 'serif',
      boxShadow: '0 2px 8px rgba(244, 67, 54, 0.4)',
      transition: 'all 0.2s',
      zIndex: 10,
    },
    iconButtonConfirmed: { // 新增：已确认状态样式
      backgroundColor: '#4caf50',
      boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)',
    },
    iconButtonHover: {
      backgroundColor: '#d32f2f', // 红色悬停
      transform: 'scale(1.1)',
    },
    iconButtonConfirmedHover: { // 新增：绿色悬停
      backgroundColor: '#388e3c',
      transform: 'scale(1.1)',
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    dialog: {
      backgroundColor: 'white',
      borderRadius: '8px',
      width: '90%',
      maxWidth: '600px', // 增加最大宽度以适应表格
      maxHeight: '80vh', // 限制最大高度
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    },
    dialogTitle: {
      padding: '20px 24px',
      borderBottom: '1px solid #e0e0e0',
      margin: 0,
      fontSize: '20px',
      fontWeight: '500',
    },
    dialogContent: {
      padding: '24px',
      overflowY: 'auto', // 新增：内容区可滚动
      flex: 1,
    },
    radioGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    radioOption: {
      display: 'flex',
      alignItems: 'flex-start', // 改为顶部对齐以适应表格
      cursor: 'pointer',
      marginBottom: '12px',
    },
    radio: {
      width: '18px',
      height: '18px',
      marginRight: '10px',
      marginTop: '2px', // 新增：与内容顶部对齐
      cursor: 'pointer',
      flexShrink: 0, // 新增：防止单选框被压缩
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '14px',
      marginTop: '8px',
      marginLeft: '28px',
      boxSizing: 'border-box',
      maxWidth: 'calc(100% - 28px)',
    },
    inputDisabled: {
      backgroundColor: '#f5f5f5',
      cursor: 'not-allowed',
    },
    dialogActions: {
      padding: '16px 24px',
      borderTop: '1px solid #e0e0e0',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
    },
    button: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s',
    },
    cancelButton: {
      backgroundColor: 'transparent',
      color: '#666',
    },
    saveButton: {
      backgroundColor: '#1976d2',
      color: 'white',
    },
    saveButtonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
    // 新增：表格样式
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '13px',
      marginTop: '8px',
    },
    tableHeader: {
      backgroundColor: '#f5f5f5',
      fontWeight: '600',
      textAlign: 'left',
      padding: '6px 8px',
      borderBottom: '2px solid #ddd',
    },
    tableCell: {
      padding: '6px 8px',
      borderBottom: '1px solid #eee',
    },
    tableRow: {
      transition: 'background-color 0.2s',
    },
    versionContent: {
      flex: 1,
    },
  };

  const [isHovered, setIsHovered] = useState(false);

  // 新增：渲染版本内容（字符串或表格）
  const renderVersionContent = (value, versionData) => {
    if (versionData && versionData.header && versionData.data) {
      // 渲染表格
      return (
        <div style={styles.versionContent}>
          <div style={{ marginBottom: '4px', fontWeight: '500' }}>{value}</div>
          <table style={styles.table}>
            <thead>
              <tr>
                {versionData.header.map((header, idx) => (
                  <th key={idx} style={styles.tableHeader}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {versionData.data.map((row, rowIdx) => (
                <tr key={rowIdx} style={styles.tableRow}>
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} style={styles.tableCell}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      // 渲染普通文本
      return <span style={styles.versionContent}>{value}</span>;
    }
  };

  return (
    <>
      {/* 红色圆形信息图标 */}
      <button
        onClick={handleOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          ...styles.iconButton,
          ...(isConfirmed ? styles.iconButtonConfirmed : {}), // 已确认则应用绿色样式
          ...(isHovered ? (isConfirmed ? styles.iconButtonConfirmedHover : styles.iconButtonHover) : {})
        }}
        title={isConfirmed ? "已确认版本" : "选择版本"}
      >
        {isConfirmed ? '✓' : 'i'} {/* 已确认显示打勾，未确认显示i */}
      </button>

      {/* 弹框 */}
      {open && (
        <div style={styles.overlay} onClick={handleClose}>
          <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.dialogTitle}>选择版本</h2>
            
            <div style={styles.dialogContent}>
              <div style={styles.radioGroup}>
                {/* 版本1 */}
                <label style={styles.radioOption}>
                  <input
                    type="radio"
                    name="version"
                    value="version1"
                    checked={selectedOption === 'version1'}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    style={styles.radio}
                  />
                  <span>{value1}</span>
                </label>
                
                {/* 版本2 */}
                <label style={styles.radioOption}>
                  <input
                    type="radio"
                    name="version"
                    value="version2"
                    checked={selectedOption === 'version2'}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    style={styles.radio}
                  />
                  <span>{value2}</span>
                </label>
                
                {/* 自定义输入 */}
                <label style={styles.radioOption}>
                  <input
                    type="radio"
                    name="version"
                    value="custom"
                    checked={selectedOption === 'custom'}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    style={styles.radio}
                  />
                  <span>自定义</span>
                </label>
                
                {/* 输入框 */}
                <input
                  type="text"
                  placeholder={inputPlaceholder}
                  value={customValue}
                  onChange={(e) => {
                    setCustomValue(e.target.value);
                    setSelectedOption('custom');
                  }}
                  disabled={selectedOption !== 'custom'}
                  style={{
                    ...styles.input,
                    ...(selectedOption !== 'custom' ? styles.inputDisabled : {})
                  }}
                />
              </div>
            </div>
            
            <div style={styles.dialogActions}>
              <button
                onClick={handleClose}
                style={{...styles.button, ...styles.cancelButton}}
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={selectedOption === 'custom' && !customValue.trim()}
                style={{
                  ...styles.button,
                  ...styles.saveButton,
                  ...(selectedOption === 'custom' && !customValue.trim() ? styles.saveButtonDisabled : {})
                }}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// 使用示例
const App = () => {
  const [savedValue, setSavedValue] = useState('');

  const handleSave = (value) => {
    setSavedValue(value);
    console.log('保存的值:', value);
  };

  const containerStyle = {
    padding: '32px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  };

  const cardStyle = {
    position: 'relative',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '32px',
    backgroundColor: '#f5f5f5',
  };

  const card2Style = {
    ...cardStyle,
    borderColor: '#1976d2',
    backgroundColor: '#e3f2fd',
  };

  const resultStyle = {
    padding: '16px',
    backgroundColor: '#4caf50',
    color: 'white',
    borderRadius: '4px',
    textAlign: 'center',
    marginBottom: '32px',
  };

  const infoBoxStyle = {
    marginTop: '32px',
    padding: '24px',
    backgroundColor: '#fff3e0',
    borderRadius: '8px',
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '32px' }}>版本选择器组件示例</h1>

      {/* 示例1：卡片容器 - 使用表格数据 */}
      <div style={cardStyle}>
        <VersionSelector
          value1="正式版 v2.1.0"
          value2="测试版 v2.2.0-beta"
          version1Data={{
            header: ['功能', '状态', '发布日期'],
            data: [
              ['用户管理', '✓ 已完成', '2024-01-15'],
              ['权限系统', '✓ 已完成', '2024-01-20'],
              ['API接口', '✓ 已完成', '2024-02-01'],
            ]
          }}
          version2Data={{
            header: ['功能', '状态'],
            data: [
              ['实时通知', '🔧 测试中'],
              ['数据分析', '🔧 测试中'],
              ['导出功能', '⏳ 开发中'],
            ]
          }}
          inputPlaceholder="输入自定义版本号"
          onSave={handleSave}
        />
        <h2 style={{ marginTop: 0, marginBottom: '12px' }}>产品配置面板（表格数据示例）</h2>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          这是一个带有表格数据的版本选择器示例。点击右上角的图标查看详细的功能列表。
        </p>
      </div>

      {/* 示例2：另一个容器 - 使用简单字符串 */}
      <div style={card2Style}>
        <VersionSelector
          value1="标准模式"
          value2="高级模式"
          inputPlaceholder="输入自定义模式名称"
          onSave={handleSave}
        />
        <h2 style={{ marginTop: 0, marginBottom: '12px' }}>系统设置（字符串示例）</h2>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          这是使用简单字符串的示例，没有提供表格数据。
        </p>
      </div>

      {/* 显示保存的值 */}
      {savedValue && (
        <div style={resultStyle}>
          <h2 style={{ margin: 0 }}>当前选中的值：{savedValue}</h2>
        </div>
      )}

      {/* 使用说明 */}
      <div style={infoBoxStyle}>
        <h2 style={{ marginTop: 0 }}>组件使用说明</h2>
        <div style={{ lineHeight: '1.8' }}>
          <p><strong>Props:</strong></p>
          <ul>
            <li><code>value1</code>: 第一个单选项的值（默认："版本1"）</li>
            <li><code>value2</code>: 第二个单选项的值（默认："版本2"）</li>
            <li><code>version1Data</code>: 第一个版本的表格数据（可选）
              <br/>格式: <code>{`{ header: ['列1', '列2'], data: [['值1', '值2'], ...] }`}</code>
            </li>
            <li><code>version2Data</code>: 第二个版本的表格数据（可选）</li>
            <li><code>inputPlaceholder</code>: 输入框的占位符文本</li>
            <li><code>onSave</code>: 保存时的回调函数，接收最终选中的值</li>
          </ul>
          <p><strong>使用方式:</strong></p>
          <p>
            在需要添加提示的容器上设置 <code>position: relative</code>，
            然后在其内部使用 <code>&lt;VersionSelector /&gt;</code> 组件即可。
          </p>
          <p><strong>数据显示规则:</strong></p>
          <ul>
            <li>如果提供了 <code>version1Data/version2Data</code> 且包含 header 和 data，则显示为表格</li>
            <li>否则显示为普通文本</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;