/* 在 CSS 文件末尾添加以下样式 */

/* 分组头容器 */
.groupHeader {
    display: grid;
    grid-template-columns: 
        60px      /* No. 序号列对齐 */
        repeat(auto-fit, minmax(80px, 1fr));
    background-color: #f5f5f5;
    border: solid 1px #555;
    border-top: none;
    min-height: 32px;
}

/* 第一个分组头需要顶部边框 */
.gridBody > :first-child.groupHeader {
    border-top: solid 1px #555;
}

/* 分组头内容 */
.groupHeaderContent {
    grid-column: 1 / -1; /* 占满整行 */
    display: flex;
    align-items: center;
    padding: 6px 12px;
    gap: 8px;
}

/* 折叠/展开按钮 */
.groupToggleBtn {
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    border: 1px solid #999;
    background-color: #fff;
    cursor: pointer;
    border-radius: 3px;
    padding: 0;
    transition: all 0.2s;
    color: #555;
}

.groupToggleBtn:hover {
    background-color: #e8e8e8;
    border-color: #666;
}

.groupToggleBtn:active {
    transform: scale(0.95);
}

/* 分组标题 */
.groupTitle {
    font-size: 13px;
    font-weight: 600;
    color: #333;
    user-select: none;
}

/* 折叠状态下隐藏后续内容的过渡效果 */
.groupHeader + .gridRow {
    border-top: solid 1px #555;
}
