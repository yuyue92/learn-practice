// 在组件顶部添加状态
const [collapsedGroups, setCollapsedGroups] = useState(new Set());

// 添加数据分组函数
const groupDataByPageNo = (data) => {
    const groups = {};
    data.forEach(row => {
        const pageNo = row[0]?.pageNo || 1; // 假设每行第一个元素包含pageNo
        if (!groups[pageNo]) {
            groups[pageNo] = [];
        }
        groups[pageNo].push(row);
    });
    return groups;
};

// 添加折叠/展开切换函数
const toggleGroup = (pageNo) => {
    setCollapsedGroups(prev => {
        const newSet = new Set(prev);
        if (newSet.has(pageNo)) {
            newSet.delete(pageNo);
        } else {
            newSet.add(pageNo);
        }
        return newSet;
    });
};

// 在组件中使用
const groupedData = useMemo(() => groupDataByPageNo(dataList), [dataList]);
