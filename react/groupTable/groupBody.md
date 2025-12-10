{/* Body - 修改后的版本 */}
<div className={style.gridBody}>
    {Object.entries(groupedData)
        .sort(([a], [b]) => Number(a) - Number(b)) // 按pageNo排序
        .map(([pageNo, rows]) => {
            const isCollapsed = collapsedGroups.has(Number(pageNo));
            const startRowIndex = Object.entries(groupedData)
                .filter(([pn]) => Number(pn) < Number(pageNo))
                .reduce((sum, [, r]) => sum + r.length, 0);
            
            return (
                <React.Fragment key={`group-${pageNo}`}>
                    {/* 分组头 */}
                    <GroupHeader
                        pageNo={pageNo}
                        isCollapsed={isCollapsed}
                        onToggle={toggleGroup}
                        rowCount={rows.length}
                    />
                    
                    {/* 分组内容 - 根据折叠状态显示 */}
                    {!isCollapsed && rows.map((rowItem, indexInGroup) => {
                        const actualRowIndex = startRowIndex + indexInGroup;
                        return (
                            <TableRow
                                key={rowItem[0].uuid}
                                rowItem={rowItem}
                                rowIndex={actualRowIndex}
                                tbHeaderArg={tbHeaderArg}
                                versionCheckedInfor={versionCheckedInfor.current}
                                registerInput={registerInput}
                                onInsertRow={handleInsertRow}
                                onDeleteRow={handleDeleteRow}
                                onInputChange={handleInputChange}
                                onSelectFocus={handleSelectFocus}
                                onSelectChange={handleSelectChange}
                                onSelectClick={handleSelectClick}
                                onSelectMouseDown={handleSelectMouseDown}
                                onInputFocus={handleInputFocus}
                                onInputBlur={handleInputBlur}
                                onInputKeydown={handleInputKeydown}
                                onVersionClick={handleVersionClick}
                            />
                        );
                    })}
                </React.Fragment>
            );
        })}
</div>
