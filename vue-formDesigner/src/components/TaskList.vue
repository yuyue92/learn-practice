<template>
    <div class="task-list">
      <h3>我的任务</h3>
      <div v-if="tasks.length">
        <div v-for="task in tasks" :key="task.id" class="task-item">
          <p>申请ID: {{ task.appId }}</p>
          <p>申请人: {{ task.createBy }}</p>
          <p>描述: {{ task.remark }}</p>
          <p class="approval_p">审批人: {{ task.assignee }}</p>
          <p>类型: {{ task.type === 'approval' ? '审批' : '处理' }}</p>
          <p>状态: <span :class="['status_txt', getStatusColor(task.status)]">{{ getStatusText(task.status) }}</span></p>
          <p>创建时间: {{ formatDate(task.createTime) }}</p>
          <button 
            v-if="task.status === 'pending'"
            @click="handleTask(task.id)"
          >
            处理
          </button>
        </div>
      </div>
      <div v-else>
        <p>暂无任务</p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import { mockAPI } from '../utils/mockdata'
  
  export default {
    props: ['userId'],
    emits: ['task-selected'],
    setup(props, { emit }) {
      const tasks = ref([])
  
      onMounted(async () => {
        console.log('tasklist: ', props.userId )
        tasks.value = await mockAPI.getMyTasks(props.userId)
      })
  
      const handleTask = (taskId) => {
        emit('task-selected', taskId)
      }
  
      const getStatusText = (status) => {
        const map = {
          pending: '待处理',
          approved: '已同意',
          rejected: '已拒绝'
        }
        return map[status] || status
      }
      const getStatusColor = (status) => {
        const map = {
          pending: 'blue',
          approved: 'green',
          rejected: 'red'
        }
        return map[status] || status
      }
  
      const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString()
      }
  
      return { tasks, handleTask, getStatusText,getStatusColor, formatDate }
    }
  }
  </script>
  
  <style scoped>
  .task-list {
    max-width: 800px;
    margin: 0 auto;
  }
  .task-item {
    padding: 15px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  .task-item .approval_p {
    text-decoration: underline;
  }
  .task-item .status_txt.green{
    color: green;
  }
  .task-item .status_txt.blue{
    color: blue;
  }
  .task-item .status_txt.red{
    color: red;
  }
  button {
    padding: 5px 10px;
    background: #409eff;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
  </style>