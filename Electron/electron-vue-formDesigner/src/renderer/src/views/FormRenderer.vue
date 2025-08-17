<template>
    <div class="form-renderer">
      <h3>📋 表单预览</h3>
      <div v-for="field in schema" :key="field.id" class="form-item">
        <label>{{ field.label }}: </label>
        <input
          v-if="field.type === 'input'"
          v-model="formData[field.id]"
          class="input"
        />
        <textarea
          v-if="field.type === 'textarea'"
          v-model="formData[field.id]"
          class="input"
        />
        <select
          v-else-if="field.type === 'select'"
          v-model="formData[field.id]"
          class="input"
        >
          <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  const props = defineProps(['schema', 'modelValue'])
  const emit = defineEmits(['update:modelValue'])
  
  const formData = computed({
    get: () => props.modelValue || {},
    set: (val) => emit('update:modelValue', val)
  })
  </script>
  
  <style scoped>
  .form-renderer {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 12px;
  }
  .form-item {
    margin-bottom: 10px;
    display: flex;
  }
  .form-item>label {
    display: inline-block;
    min-width: 100px;
    text-align: right;
    padding-right: 5px;
    line-height: 28px;
  }
  .input {
    flex: 1;
    /* width: 100%; */
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  </style>
  