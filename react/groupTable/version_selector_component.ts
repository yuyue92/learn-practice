import { forwardRef, useImperativeHandle, useState } from 'react';

interface VersionSelectorRef {
    setConfirmed: (confirmed: boolean) => void;
}

interface VersionSelectorProps {
    value1?: string;
    value2?: string;
    version1Data?: { header: string[]; data: string[][] } | null;
    version2Data?: { header: string[]; data: string[][] } | null;
    inputPlaceholder?: string;
    onSave?: (value: string) => void;
}

// 可复用的版本选择器组件
export const VersionSelector = forwardRef<VersionSelectorRef, VersionSelectorProps>(({
    value1 = "",
    value2 = "",
    version1Data = null, // { header: ['列1', '列2'], data: [[值1, 值2], ...] }
    version2Data = null, // { header: ['列1', '列2'], data: [[值1, 值2], ...] }
    inputPlaceholder = "Input Value",
    onSave
}, ref) => {
    const [open, setOpen] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [selectedOption, setSelectedOption] = useState('version1');
    const [customValue, setCustomValue] = useState('');
    const [isHovered, setIsHovered] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSave = () => {
        let finalValue: string | null = null;
        if (selectedOption === 'version1') {
            finalValue = value1;
        } else if (selectedOption === 'version2') {
            finalValue = value2;
        } else {
            finalValue = customValue;
        }
        if (!finalValue && finalValue !== '0') {
            finalValue = selectedOption;
        }

        if (onSave) {
            onSave(finalValue);
        }
        setIsConfirmed(true);
        handleClose();
    };

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
        setConfirmed: (confirmed: boolean) => {
            setIsConfirmed(confirmed);
        }
    }));

    const styles = {
        iconButton: {
            position: 'absolute' as const,
            top: '1px',
            right: '1px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: isConfirmed ? '#4caf50' : '#f44336',
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
            position: 'fixed' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
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
            maxWidth: '600px',
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
            flexDirection: 'column' as const,
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
            marginTop: '-4px',
            cursor: 'pointer',
        },
        customradio: {
            width: '24px',
            height: '24px',
            marginRight: '10px',
            marginTop: '-4px',
            cursor: 'pointer',
        },
        input: {
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            marginTop: '1px',
            marginLeft: '8px',
            boxSizing: 'border-box' as const,
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
            borderCollapse: 'collapse' as const,
            fontSize: '13px',
            marginTop: '8px',
            lineHeight: '1.5',
        },
        tableHeader: {
            backgroundColor: '#f5f5f5',
            fontWeight: '600',
            textAlign: 'left' as const,
            height: '26px',
            padding: '1px 3px',
            borderBottom: '2px solid #ddd',
        },
        tableCell: {
            padding: '1px 2px',
            lineHeight: '1.5',
            borderBottom: '1px solid #eee',
        },
        tableRow: {
            height: '26px',
            transition: 'background-color 0.2s',
        },
        versionContent: {
            flex: 1,
            textAlign: 'left' as const,
            paddingLeft: '11px',
        },
    };

    // 渲染版本内容（字符串或表格）
    const renderVersionContent = (
        value: string, 
        versionData: { header: string[]; data: string[][] } | null
    ) => {
        if (versionData && versionData.header && versionData.data) {
            // 渲染表格
            return (
                <div style={styles.versionContent}>
                    <div style={{ marginBottom: '4px', fontWeight: '500' }}>{value}</div>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                {versionData.header.map((header, index) => (
                                    <th key={`${header}-${index}`} style={styles.tableHeader}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {versionData.data.map((row, rowIndex) => (
                                <tr key={`row-${rowIndex}`} style={styles.tableRow}>
                                    {row.map((cell, cellIndex) => (
                                        <td key={`cell-${rowIndex}-${cellIndex}`} style={styles.tableCell}>{cell}</td>
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
                    ...(isHovered ? styles.iconButtonHover : {})
                }}
                title="Select Version"
            >
                i
            </button>

            {/* 弹框 */}
            {open && (
                <div style={styles.overlay} onClick={handleClose}>
                    <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
                        <h2 style={styles.dialogTitle}>Select Version</h2>

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
                                    <span>Version One: </span>
                                    {renderVersionContent(value1, version1Data)}
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
                                    <span>Version Two: </span>
                                    {renderVersionContent(value2, version2Data)}
                                </label>

                                {!version1Data && !version2Data &&
                                    <label style={styles.radioOption}>
                                        <input
                                            type="radio"
                                            name="version"
                                            value="custom"
                                            checked={selectedOption === 'custom'}
                                            onChange={(e) => setSelectedOption(e.target.value)}
                                            style={styles.customradio}
                                        />
                                        <span>Custom:</span>
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
                                    </label>
                                }

                            </div>
                        </div>

                        <div style={styles.dialogActions}>
                            <button
                                onClick={handleClose}
                                style={{ ...styles.button, ...styles.cancelButton }}
                            >Cancel</button>
                            <button
                                onClick={handleSave}
                                disabled={selectedOption === 'custom' && !customValue.trim()}
                                style={{
                                    ...styles.button,
                                    ...styles.saveButton,
                                    ...(selectedOption === 'custom' && !customValue.trim() ? styles.saveButtonDisabled : {})
                                }}
                            >Save</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
});