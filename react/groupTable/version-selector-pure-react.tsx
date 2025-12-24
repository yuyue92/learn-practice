import React, { useState } from 'react';

// 可复用的版本选择器组件
const VersionSelector = ({ 
  value1 = "版本1", 
  value2 = "版本2", 
  inputPlaceholder = "或输入自定义值",
  onSave 
}) => {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('version1');
  const [customValue, setCustomValue] = useState('');

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
      backgroundColor: '#f44336',
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
    iconButtonHover: {
      backgroundColor: '#d32f2f',
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
      maxWidth: '500px',
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
    },
    radioGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    radioOption: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    },
    radio: {
      width: '18px',
      height: '18px',
      marginRight: '10px',
      cursor: 'pointer',
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
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* 红色圆形信息图标 */}
      <button
        onClick={handleOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          ...styles.iconButton,
          ...(isHovered ? styles.iconButtonHover : {})
        }}
        title="选择版本"
      >
        i
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

      {/* 示例1：卡片容器 */}
      <div style={cardStyle}>
        <VersionSelector
          value1="正式版 v2.1.0"
          value2="测试版 v2.2.0-beta"
          inputPlaceholder="输入自定义版本号"
          onSave={handleSave}
        />
        <h2 style={{ marginTop: 0, marginBottom: '12px' }}>产品配置面板</h2>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          这是一个带有版本选择器的容器示例。点击右上角的红色图标来选择版本。
        </p>
      </div>

      {/* 示例2：另一个容器 */}
      <div style={card2Style}>
        <VersionSelector
          value1="标准模式"
          value2="高级模式"
          inputPlaceholder="输入自定义模式名称"
          onSave={handleSave}
        />
        <h2 style={{ marginTop: 0, marginBottom: '12px' }}>系统设置</h2>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          这是另一个使用相同组件的示例，配置了不同的选项值。
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
            <li><code>inputPlaceholder</code>: 输入框的占位符文本</li>
            <li><code>onSave</code>: 保存时的回调函数，接收最终选中的值</li>
          </ul>
          <p><strong>使用方式:</strong></p>
          <p>
            在需要添加提示的容器上设置 <code>position: relative</code>，
            然后在其内部使用 <code>&lt;VersionSelector /&gt;</code> 组件即可。
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;