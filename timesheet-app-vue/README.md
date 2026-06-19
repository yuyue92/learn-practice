工程目录结构


```
timesheet-vue/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.js              # 应用入口 + Vue Router 配置
    ├── App.vue              # 根组件（仅 <RouterView />）
    ├── styles/
    │   └── global.css       # 完整 CSS（与 React 版本一致）
    ├── data/
    │   └── mockData.js      # 所有静态数据（完全不变）
    ├── components/
    │   ├── AppShell.vue     # 顶栏 + 侧边导航（用 <slot> 替代 children）
    │   ├── PageHead.vue     # 页面标题（用具名 slot #actions 替代 props.actions）
    │   ├── EntriesTable.vue # 工时条目表格（复用组件）
    │   └── TreeNode.vue     # 递归组织树节点（独立抽取为单文件组件）
    └── pages/
        ├── SignIn.vue
        ├── Timesheet.vue
        ├── AddEntry.vue
        ├── Submit.vue
        ├── Approvals.vue
        ├── ApprovalDetail.vue
        ├── Report.vue
        └── Organisation.vue
```
