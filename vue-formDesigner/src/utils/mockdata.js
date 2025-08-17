import { ref, useId } from 'vue'

// 模拟数据
const users = ref([
  { id: 1, name: '申请人', role: 'applicant' },
  { id: 2, name: '审批人', role: 'approver' }
])

const materials = ref([
  { id: 1, name: '物料A', spec: '型号1', unit: '个' },
  { id: 2, name: '物料B', spec: '型号2', unit: 'kg' }
])

const applications = ref([])
const tasks = ref([])
const processDefinition = ref(null)

// 模拟API
export const mockAPI = {
  // 获取物料列表
  getMaterials() {
    return Promise.resolve(materials.value)
  },
  
  // 提交申请
  submitApplication(data) {
    const app = {
      id: Date.now(),
      ...data,
      status: 'pending',
      createBy: data.userId,
      createTime: new Date().toISOString()
    }
    applications.value.push(app)
    console.log({data})
    // 创建审批任务
    const task = {
      id: Date.now(),
      appId: app.id,
      type: 'approval',
      assignee: data.approvalRole, // 分配给审批人
      status: 'pending',
      remark: data.remark,
      createBy: data.userId,
      createTime: new Date().toISOString()
    }
    tasks.value.push(task)
    
    return Promise.resolve(task)
  },
  
  // 获取我的任务
  getMyTasks(userId) {
    console.log(userId ,'getlist: ', tasks.value )
    return Promise.resolve(tasks.value.filter(t => t.assignee === userId))
  },
  
  // 获取任务详情
  getTaskDetail(taskId) {
    const task = tasks.value.find(t => t.id == taskId)
    if (!task) return Promise.reject('Task not found')
    
    const app = applications.value.find(a => a.id == task.appId)
    return Promise.resolve({
      ...task,
      app,
      applicant: users.value.find(u => u.id === app.userId)?.name || 'Unknown'
    })
  },
  
  // 处理审批
  processTask(taskId, action) {
    const task = tasks.value.find(t => t.id == taskId)
    if (!task) return Promise.reject('Task not found')
    
    task.status = action
    const app = applications.value.find(a => a.id == task.appId)
    if (app) app.status = action
    
    // 简单流程引擎逻辑
    if (action === 'approved') {
      // 审批通过后创建后续任务（示例）
      const nextTask = {
        id: Date.now(),
        appId: app.id,
        type: 'complete',
        assignee: 1, // 返回给申请人
        status: 'pending',
        createTime: new Date().toISOString()
      }
      tasks.value.push(nextTask)
    }
    
    return Promise.resolve(true)
  },
  
  // 流程定义相关
  getProcessDefinition() {
    return Promise.resolve(processDefinition.value)
  },
  
  saveProcessDefinition(xml) {
    processDefinition.value = { xml }
    return Promise.resolve(true)
  }
}