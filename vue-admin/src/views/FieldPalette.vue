<template>
    <div class="palette">
      <h3>组件库</h3>
      <div
        v-for="item in fields"
        :key="item.type"
        class="palette-item"
        @click="add(item)"
      >
        {{ item.label }}
      </div>
    </div>
  </template>
  <script setup>
  import { useFormStore } from '@/stores/formStore'
  
  const store = useFormStore()
  
  const fields = [
    { type: 'input', label: '文本框' },
    { type: 'select', label: '下拉框', options: ['选项1', '选项2'] },
    { type: 'checkbox', label: '勾选框' },
    { type: 'switch', label: '开关' }
  ]
  
  const add = (field) => {
    store.addField(JSON.parse(JSON.stringify(field)))
  }
  </script>
  <style scoped>
  .palette {
    padding: 10px;
    background: #f9f9f9;
  }
  .palette-item {
    padding: 6px;
    margin: 4px 0;
    background: #fff;
    border: 1px solid #ddd;
    cursor: pointer;
  }
  </style>