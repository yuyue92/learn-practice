<template>
    <div class="editor">
      <h3>字段编辑器</h3>
      <div v-if="store.selectedField">
        <label>标签:</label>
        <input v-model="store.selectedField.label" @input="onEdit" />
  
        <div v-if="store.selectedField.type === 'select'">
          <label>选项 (用 , 分隔):</label>
          <input :value="store.selectedField.options?.join(',')" @input="onOptionChange" />
        </div>
      </div>
      <div v-else>
        <em>请选择字段</em>
      </div>
    </div>
  </template>
  <script setup>
  import { useFormStore } from '@/stores/formStore'
  
  const store = useFormStore()
  
  const onEdit = () => {
    store.updateSelectedField({})
  }
  
  const onOptionChange = (e) => {
    const value = e.target.value
    const options = value.split(',').map(s => s.trim())
    store.updateSelectedField({ options })
  }
  </script>
  <style scoped>
  .editor {
    padding: 10px;
    background: #f5f5f5;
  }
  input {
    display: block;
    margin-bottom: 10px;
    width: 100%;
    box-sizing: border-box;
  }
  </style>