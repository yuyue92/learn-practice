**一个能直接用、体验顺滑的“表单设计器 v1”（React + Tailwind v3），三段式：设计器 UI → Schema(JSON) → 渲染引擎。**

场景测试json：
- 1) OA：请假/加班申请（OA）
  2) CRM：线索收集/客户跟进（CRM）
  3) 问卷：满意度调查（问卷）
  4) 后台：系统配置/权限申请（后台）

### App.tsx入口文件

// 👇 只改这里就能切权限：superadmin/admin/hr/sales/investigator/user/ops

const rolePermission: RolePermission = "user";

目标：先把「拖拽搭建 + 属性编辑 + 预览渲染 + 导入导出 Schema」做扎实，后续再加条件联动/版本/低代码等。

已实现功能清单（自检项）
- ✅ 组件库（左侧）：点击快速添加字段（输入/数字/选择/结构等）
- ✅ 画布（中间）：字段列表展示 + 拖拽排序（dnd-kit）+ 选中高亮 + 删除
- ✅ 属性面板（右侧）：
   - 表单级：标题/描述
   - 字段级：name/label/helpText/required/disabled/placeholder/colSpan
   - select/radio：options 增删改
   - section/divider：有专属属性编辑
      - ✅ 预览模式：同一份 Schema 直接走渲染引擎 FormRenderer
      - ✅ 导入/导出 Schema JSON：顶栏一键打开 JSON 面板，可直接粘贴导入
      - ✅ Schema 校验：标题空、name 重复、options 为空、colSpan 越界等会提示

**项目结构**
```
src/
  app/
    App.tsx
  designer/
    FormDesigner.tsx
    components/
      ComponentPalette.tsx
      Canvas.tsx
      FieldCard.tsx
      PropertyEditor.tsx
      TopBar.tsx
  renderer/
    FormRenderer.tsx
    fieldRenderers.tsx
  schema/
    types.ts
    defaults.ts
    validators.ts
  state/
    designerReducer.ts
    designerContext.tsx
  utils/
    id.ts
    deepClone.ts
    classnames.ts
  index.css
  main.tsx
```

**创建项目**

```
# 使用 Vite 创建 React + TypeScript 项目
npm create vite@latest form-designer -- --template react-ts
# 安装tailwind v3版本
npm install -D tailwindcss@3.4.1 postcss autoprefixer
# 创建配置文件
npx tailwindcss init -p
```
