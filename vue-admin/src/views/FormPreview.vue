<template>
    <div class="preview">
      <h3>表单预览</h3>
      <div v-for="field in store.formFields" :key="field.id">
        <label>{{ field.label }}</label>
        <input v-if="field.type === 'input'" type="text" />
        <select v-else-if="field.type === 'select'">
          <option v-for="opt in field.options" :key="opt">{{ opt }}</option>
        </select>
        <input v-else-if="field.type === 'checkbox'" type="checkbox" />
        <input v-else-if="field.type === 'switch'" type="checkbox" />
      </div>
    </div>
  </template>
  <script setup>
  import { useFormStore } from '@/stores/formStore'
  
  const store = useFormStore()
  </script>
  <style scoped>
  .preview {
    padding: 10px;
    background: #fff;
  }
  label {
    display: block;
    margin-top: 10px;
  }
  </style>