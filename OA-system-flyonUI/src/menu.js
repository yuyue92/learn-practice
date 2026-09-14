// 侧边栏菜单配置（同时被“系统设置 - 菜单管理”页面引用展示）
// icon 使用行内 SVG 的 key，见 components/MenuIcon.vue

export const menuTree = [
  { title: '工作台', icon: 'dashboard', path: '/dashboard' },
  {
    title: '我的待办',
    icon: 'inbox',
    children: [
      { title: '待我审批', path: '/todo/approval' },
      { title: '待我处理', path: '/todo/handle' },
      { title: '我发起的', path: '/todo/initiated' },
      { title: '抄送我的', path: '/todo/cc' },
    ],
  },
  {
    title: '审批中心',
    icon: 'approval',
    children: [
      { title: '请假申请', path: '/approval/leave' },
      { title: '出差申请', path: '/approval/travel' },
      { title: '加班申请', path: '/approval/overtime' },
      { title: '报销申请', path: '/approval/expense' },
      { title: '用印申请', path: '/approval/seal' },
      { title: '采购申请', path: '/approval/purchase' },
      { title: '审批流程设置', path: '/approval/workflow' },
    ],
  },
  {
    title: '行政办公',
    icon: 'admin',
    children: [
      { title: '通知公告', path: '/admin/notice' },
      { title: '会议管理', path: '/admin/meeting' },
      { title: '会议室预订', path: '/admin/meeting-room' },
      { title: '车辆管理', path: '/admin/vehicle' },
      { title: '固定资产', path: '/admin/asset' },
      { title: '办公用品', path: '/admin/supplies' },
    ],
  },
  {
    title: '人事管理',
    icon: 'hr',
    children: [
      { title: '组织架构', path: '/hr/org' },
      { title: '员工档案', path: '/hr/employee' },
      { title: '考勤管理', path: '/hr/attendance' },
      { title: '招聘管理', path: '/hr/recruitment' },
      { title: '培训管理', path: '/hr/training' },
      { title: '薪资管理', path: '/hr/salary' },
    ],
  },
  {
    title: '财务管理',
    icon: 'finance',
    children: [
      { title: '报销单据', path: '/finance/expense' },
      { title: '发票管理', path: '/finance/invoice' },
      { title: '预算管理', path: '/finance/budget' },
      { title: '合同管理', path: '/finance/contract' },
    ],
  },
  {
    title: '知识库',
    icon: 'knowledge',
    children: [
      { title: '文档中心', path: '/knowledge/docs' },
      { title: '制度规范', path: '/knowledge/policy' },
    ],
  },
  {
    title: '项目管理',
    icon: 'project',
    children: [
      { title: '项目列表', path: '/project/list' },
      { title: '任务看板', path: '/project/kanban' },
    ],
  },
  {
    title: '统计报表',
    icon: 'report',
    children: [
      { title: '审批效率统计', path: '/report/approval' },
      { title: '考勤统计', path: '/report/attendance' },
    ],
  },
  {
    title: '系统设置',
    icon: 'system',
    children: [
      { title: '用户管理', path: '/system/user' },
      { title: '角色权限', path: '/system/role' },
      { title: '菜单管理', path: '/system/menu' },
      { title: '部门管理', path: '/system/dept' },
      { title: '系统日志', path: '/system/log' },
    ],
  },
]

// 扁平化，便于面包屑 / 路由标题查找
export function flattenMenu(tree = menuTree, parent = null, out = []) {
  for (const item of tree) {
    const node = { title: item.title, path: item.path, parentTitle: parent?.title || null }
    if (item.path) out.push(node)
    if (item.children) flattenMenu(item.children, item, out)
  }
  return out
}
