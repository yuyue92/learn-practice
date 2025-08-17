<template>
    <div class="application-form">
      <h3>物料申请</h3>
      <div class="form-item">
        <label>申请人：</label>
        <input type="text" v-model="form.userId" disabled>
      </div>
      <div class="form-item">
        <label>审批人：</label>
        <select v-model="form.approvalRole">
          <option v-for="m in roleList" :key="m" :value="m">{{ m }}</option>
        </select>
      </div>
      <div class="form-item">
        <label>物料：</label>
        <select v-model="form.materialId">
          <option v-for="m in materials" :key="m.id" :value="m.id">
            {{ m.name }} ({{ m.spec }}) - {{ m.unit }}
          </option>
        </select>
      </div>
      <div class="form-item">
        <label>数量：</label>
        <input type="number" v-model.number="form.quantity" min="1">
      </div>
      <div class="form-item">
        <label>说明：</label>
        <textarea v-model="form.remark" rows="3"></textarea>
      </div>
      <button @click="submit">提交申请</button>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import { mockAPI } from '../utils/mockdata'
import { useAppStore } from '../store/useCommonStore';
  
  export default {
    emits: ['submitted'],
    setup(props, { emit }) {
      const app1store = useAppStore();
      const roleList = ref(['guest', 'operator', 'admin', 'superAdmin'])
      const materials = ref([])
      const form = ref({
        materialId: null,
        quantity: 1,
        remark: '',
        userId: app1store.crole,
        approvalRole: 'admin'
      })
  
      onMounted(async () => {
        materials.value = await mockAPI.getMaterials()
        form.value.materialId = materials.value[0]?.id || null
      })
  
      const submit = async () => {
        console.log('submittt: ', form.value )
        const task = await mockAPI.submitApplication(form.value)
        emit('submitted', task.id)
      }
  
      return { materials, form, roleList, submit }
    }
  }
  </script>
  
  <style scoped>
  .application-form {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  .form-item {
    margin-bottom: 15px;
  }
  label {
    display: inline-block;
    width: 80px;
    vertical-align: top;
  }
  select, input, textarea {
    width: 300px;
    padding: 5px;
  }
  button {
    padding: 8px 15px;
    background: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>