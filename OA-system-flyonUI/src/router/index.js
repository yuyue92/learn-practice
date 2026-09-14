import { createRouter, createWebHashHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import GenericListPage from '../views/GenericListPage.vue'

const routes = [
  { path: '/login', name: 'login', component: () => import('../views/Login.vue'), meta: { title: '登录' } },
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'dashboard', component: () => import('../views/Dashboard.vue'), meta: { title: '工作台' } },

      // 我的待办（共用同一个组件，按路由区分 tab）
      { path: 'todo/approval', component: () => import('../views/todo/TodoCenter.vue'), meta: { title: '待我审批', tab: 'approval' } },
      { path: 'todo/handle', component: () => import('../views/todo/TodoCenter.vue'), meta: { title: '待我处理', tab: 'handle' } },
      { path: 'todo/initiated', component: () => import('../views/todo/TodoCenter.vue'), meta: { title: '我发起的', tab: 'initiated' } },
      { path: 'todo/cc', component: () => import('../views/todo/TodoCenter.vue'), meta: { title: '抄送我的', tab: 'cc' } },

      // 审批中心
      { path: 'approval/leave', component: () => import('../views/approval/Leave.vue'), meta: { title: '请假申请' } },
      { path: 'approval/travel', component: GenericListPage, meta: { title: '出差申请', dataKey: 'travel' } },
      { path: 'approval/overtime', component: GenericListPage, meta: { title: '加班申请', dataKey: 'overtime' } },
      { path: 'approval/expense', component: GenericListPage, meta: { title: '报销申请', dataKey: 'expenseApproval' } },
      { path: 'approval/seal', component: GenericListPage, meta: { title: '用印申请', dataKey: 'seal' } },
      { path: 'approval/purchase', component: GenericListPage, meta: { title: '采购申请', dataKey: 'purchase' } },
      { path: 'approval/workflow', component: GenericListPage, meta: { title: '审批流程设置', dataKey: 'workflow' } },

      // 行政办公
      { path: 'admin/notice', component: () => import('../views/admin/Notice.vue'), meta: { title: '通知公告' } },
      { path: 'admin/meeting', component: GenericListPage, meta: { title: '会议管理', dataKey: 'meeting' } },
      { path: 'admin/meeting-room', component: () => import('../views/admin/MeetingRoom.vue'), meta: { title: '会议室预订' } },
      { path: 'admin/vehicle', component: GenericListPage, meta: { title: '车辆管理', dataKey: 'vehicle' } },
      { path: 'admin/asset', component: GenericListPage, meta: { title: '固定资产', dataKey: 'asset' } },
      { path: 'admin/supplies', component: GenericListPage, meta: { title: '办公用品', dataKey: 'supplies' } },

      // 人事管理
      { path: 'hr/org', component: () => import('../views/hr/Org.vue'), meta: { title: '组织架构' } },
      { path: 'hr/employee', component: () => import('../views/hr/Employee.vue'), meta: { title: '员工档案' } },
      { path: 'hr/attendance', component: () => import('../views/hr/Attendance.vue'), meta: { title: '考勤管理' } },
      { path: 'hr/recruitment', component: GenericListPage, meta: { title: '招聘管理', dataKey: 'recruitment' } },
      { path: 'hr/training', component: GenericListPage, meta: { title: '培训管理', dataKey: 'training' } },
      { path: 'hr/salary', component: GenericListPage, meta: { title: '薪资管理', dataKey: 'salary' } },

      // 财务管理
      { path: 'finance/expense', component: GenericListPage, meta: { title: '报销单据', dataKey: 'financeExpense' } },
      { path: 'finance/invoice', component: GenericListPage, meta: { title: '发票管理', dataKey: 'invoice' } },
      { path: 'finance/budget', component: GenericListPage, meta: { title: '预算管理', dataKey: 'budget' } },
      { path: 'finance/contract', component: GenericListPage, meta: { title: '合同管理', dataKey: 'contract' } },

      // 知识库
      { path: 'knowledge/docs', component: GenericListPage, meta: { title: '文档中心', dataKey: 'docs' } },
      { path: 'knowledge/policy', component: GenericListPage, meta: { title: '制度规范', dataKey: 'policy' } },

      // 项目管理
      { path: 'project/list', component: GenericListPage, meta: { title: '项目列表', dataKey: 'projectList' } },
      { path: 'project/kanban', component: () => import('../views/project/Kanban.vue'), meta: { title: '任务看板' } },

      // 统计报表
      { path: 'report/approval', component: () => import('../views/report/ApprovalReport.vue'), meta: { title: '审批效率统计' } },
      { path: 'report/attendance', component: GenericListPage, meta: { title: '考勤统计', dataKey: 'reportAttendance' } },

      // 系统设置
      { path: 'system/user', component: () => import('../views/system/UserMgmt.vue'), meta: { title: '用户管理' } },
      { path: 'system/role', component: () => import('../views/system/RoleMgmt.vue'), meta: { title: '角色权限' } },
      { path: 'system/menu', component: () => import('../views/system/MenuMgmt.vue'), meta: { title: '菜单管理' } },
      { path: 'system/dept', component: GenericListPage, meta: { title: '部门管理', dataKey: 'dept' } },
      { path: 'system/log', component: GenericListPage, meta: { title: '系统日志', dataKey: 'log' } },

      // 个人中心
      { path: 'profile/info', component: () => import('../views/profile/ProfileInfo.vue'), meta: { title: '个人信息' } },
      { path: 'profile/message', component: GenericListPage, meta: { title: '消息通知', dataKey: 'profileMessage' } },
      { path: 'profile/password', component: () => import('../views/profile/ChangePassword.vue'), meta: { title: '修改密码' } },
    ],
  },
  { path: '/:pathMatch(.*)*', component: () => import('../views/NotFound.vue'), meta: { title: '页面未找到' } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
