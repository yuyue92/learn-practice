// 新增 GroupHeader 组件
const GroupHeader = ({ pageNo, isCollapsed, onToggle, rowCount }) => {
    return (
        <div className={style.groupHeader}>
            <div className={style.groupHeaderContent}>
                <button
                    className={style.groupToggleBtn}
                    onClick={() => onToggle(pageNo)}
                >
                    {isCollapsed ? '▶' : '▼'}
                </button>
                <span className={style.groupTitle}>
                    Page {pageNo} ({rowCount} rows)
                </span>
            </div>
        </div>
    );
};
