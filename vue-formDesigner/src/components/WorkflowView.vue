<template>
    <div class="workflow-view">
      <div class="view-switcher">
        <button 
          v-for="view in views" 
          :key="view.id"
          @click="currentView = view.id"
          :class="{ active: currentView === view.id }"
        >
          {{ view.label }}
        </button>
      </div>
      
      <div class="view-content">
        <!-- 流程设计 -->
        <div v-if="currentView === 'design'" class="design-view">
          <ProcessDesigner 
            v-model:xml="processXml" 
            v-if="showDesigner"
          />
          <div class="actions">
            <button @click="saveProcess">保存流程</button>
            <button @click="deployProcess">部署流程</button>
          </div>
        </div>
        
        <!-- 申请表单 -->
        <div v-if="currentView === 'apply'">
          <ApplicationForm @submitted="handleSubmitted" />
        </div>
        
        <!-- 任务列表 -->
        <div v-if="currentView === 'tasks'">
          <TaskList 
            :userId="currentUserId"
            @task-selected="handleTaskSelected"
          />
        </div>
        
        <!-- 任务处理 -->
        <div v-if="currentView === 'approval'">
          <ApprovalTask 
            :taskId="currentTaskId"
            @back="currentView = 'tasks'"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onActivated } from 'vue'
  import { mockAPI } from '../utils/mockdata'
  import ProcessDesigner from './ProcessDesigner.vue'
  import ApplicationForm from './ApplicationForm.vue'
  import ApprovalTask from './ApprovalTask.vue'
  import TaskList from './TaskList.vue'
import { useAppStore } from '../store/useCommonStore'
import { ElLoading, ElMessage } from 'element-plus'
  
  export default {
    components: {
      ProcessDesigner,
      ApplicationForm,
      ApprovalTask,
      TaskList
    },
    setup() {
      const app1store = useAppStore();
      const views = [
        { id: 'design', label: '流程设计' },
        { id: 'apply', label: '提交申请' },
        { id: 'tasks', label: '我的任务' }
      ]
      const currentView = ref('apply')
      const currentTaskId = ref(null)
      const currentUserId = ref(app1store.crole) // 模拟当前用户ID（2是审批人）
      const processXml = ref(null)
      const showDesigner = ref(false)
  
      onMounted(async () => {
        if(!app1store.crole) {
          ElMessage({
            type: 'info', message: '未登录! 请先登录再操作', duration:3000
          })
        }
        const definition = await mockAPI.getProcessDefinition()
        if (definition?.xml) {
          processXml.value = definition.xml
          showDesigner.value = true
        }
      })

      const handleSubmitted = (taskId) => {
        currentTaskId.value = taskId
        currentView.value = 'tasks'
      }
  
      const handleTaskSelected = (taskId) => {
        currentTaskId.value = taskId
        currentView.value = 'approval'
      }
  
      const saveProcess = async () => {
        await mockAPI.saveProcessDefinition(processXml.value)
        alert('流程保存成功')
      }
  
      const deployProcess = async () => {
        await mockAPI.saveProcessDefinition(processXml.value)
        alert('流程部署成功')
      }
  
      return {
        views,
        currentView,
        currentTaskId,
        currentUserId,
        processXml,
        showDesigner,
        handleSubmitted,
        handleTaskSelected,
        saveProcess,
        deployProcess
      }
    }
  }
  </script>
  
  <style scoped>
  .workflow-view {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  .view-switcher {
    display: flex;
    margin-bottom: 20px;
    border-bottom: 1px solid #ddd;
  }
  .view-switcher button {
    padding: 8px 15px;
    margin-right: 5px;
    background: #f5f5f5;
    border: none;
    border-radius: 4px 4px 0 0;
    cursor: pointer;
  }
  .view-switcher button.active {
    background: #409eff;
    color: white;
  }
  .actions {
    margin-top: 10px;
  }
  .actions button {
    padding: 8px 15px;
    margin-right: 10px;
    background: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>