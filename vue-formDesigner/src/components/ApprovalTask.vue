<template>
    <div class="approval-task">
      <h3>审批任务</h3>
      <div v-if="task">
        <div class="task-info">
          <p>申请人：{{ task.applicant }}</p>
          <p>物料：{{ getMaterialName(task.app.materialId) }}</p>
          <p>数量：{{ task.app.quantity }}</p>
          <p>说明：{{ task.app.remark }}</p>
          <p>状态：{{ getStatusText(task.status) }}</p>
        </div>
        
        <div v-if="task.status === 'pending'" class="action-buttons">
          <button @click="approve('approved')">同意</button>
          <button @click="approve('rejected')">拒绝</button>
        </div>
        
        <div v-else class="result-message">
          <p>已{{ task.status === 'approved' ? '同意' : '拒绝' }}该申请</p>
          <button @click="$emit('back')">返回</button>
        </div>
      </div>
      <div v-else>
        <p>加载中...</p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
import { mockAPI } from '../utils/mockdata'
  
  export default {
    props: ['taskId'],
    emits: ['back'],
    setup(props) {
      const task = ref(null)
      const materials = ref([])
  
      onMounted(async () => {
        materials.value = await mockAPI.getMaterials()
        task.value = await mockAPI.getTaskDetail(props.taskId)
      })
  
      const approve = async (action) => {
        await mockAPI.processTask(props.taskId, action)
        task.value = await mockAPI.getTaskDetail(props.taskId)
      }
  
      const getMaterialName = (id) => {
        const material = materials.value.find(m => m.id === id)
        return material ? `${material.name} (${material.spec})` : '未知物料'
      }
  
      const getStatusText = (status) => {
        const map = {
          pending: '待审批',
          approved: '已同意',
          rejected: '已拒绝'
        }
        return map[status] || status
      }
  
      return { task, approve, getMaterialName, getStatusText }
    }
  }
  </script>
  
  <style scoped>
  .approval-task {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  .task-info p {
    margin: 10px 0;
  }
  button {
    padding: 8px 15px;
    margin-right: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:first-child {
    background: #67c23a;
    color: white;
  }
  button:last-child {
    background: #f56c6c;
    color: white;
  }
  </style>