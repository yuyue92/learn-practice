<!-- FieldEditor.vue -->
<template>
    <div class="field-editor">
      <h3>⚙ 字段配置</h3>
      <div
        v-for="(field, index) in schema"
        :key="field.id"
        class="field-block"
      >
        <label>字段 {{ index + 1 }}</label>
        <div class="field-group">
          <span class="field-label">字段类型：</span>
          <span>{{ field.type }}</span>
        </div>
        <div class="field-group">
          <label class="field-label">标题：</label>
          <input v-model="field.label" class="input" />
        </div>
        <div class="field-group" v-if="field.type === 'input'">
          <label class="field-label">占位符：</label>
          <input v-model="field.placeholder" class="input" />
        </div>
        <div class="field-group" v-if="field.type === 'textarea'">
          <label class="field-label">占位符：</label>
          <input v-model="field.placeholder" class="input" />
        </div>
        <div class="field-group" v-if="field.type === 'select'">
          <label class="field-label">选项（逗号分隔）：</label>
          <input
            :value="(field.options || []).join(',')"
            @input="onOptionsChange($event, field)"
            class="input"
            />

        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    schema: Array,
  })
  
  function onOptionsChange(e, field) {
    field.options = e.target.value.split(',').map((s) => s.trim())
  }
  </script>
  
  <style scoped>
  .field-editor {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
  }
  .field-block {
    padding: 8px; margin: 3px;
    border: 1px solid #eee;
  }
  .field-group {
    display: flex;
    margin-bottom: 5px;
    line-height: 24px;
  }
  .field-group .field-label {
    display: inline-block;
    /* width: 110px; */
  }
  .input {
    flex: 1;
    /* min-width: 180px; */
    padding: 4px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  </style>
  