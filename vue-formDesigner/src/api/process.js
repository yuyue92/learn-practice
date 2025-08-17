import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(response => {
  if (response.data.code !== 200) {
    return Promise.reject(response.data)
  }
  return response.data
}, error => {
  return Promise.reject(error)
})

export default {
  // 用户相关
  login(data) {
    return request.post('/login', data)
  },
  logout() {
    return request.post('/logout')
  },
  getCurrentUser() {
    return request.get('/currentUser')
  },
  
  // 基础数据
  getDepartments() {
    return request.get('/departments')
  },
  getMaterials() {
    return request.get('/materials')
  },
  
  // 流程相关
  getProcessDefinition(key) {
    return request.get(`/process/definition/${key}`)
  },
  saveProcessDefinition(data) {
    return request.post('/process/definition', data)
  },
  deployProcessDefinition(data) {
    return request.post('/process/deployment', data)
  },
  getTask(taskId) {
    return request.get(`/process/task/${taskId}`)
  },
  completeTask(taskId, data) {
    return request.post(`/process/task/${taskId}/complete`, data)
  },
  getMyTasks(params) {
    return request.get('/process/tasks', { params })
  },
  
  // 领用申请
  submitRequisition(data) {
    return request.post('/material/requisition', data)
  }
}