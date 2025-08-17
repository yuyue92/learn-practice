<template>
    <div class="lowcode-editor">
      <!-- 顶部区域 -->
      <h2 class="header">🧩 低代码表单编辑器</h2>
  
      <!-- 主体区域 -->
      <div class="editor-main">
        <!-- 左：字段组件 -->
        <FieldPalette class="editor-panel" />
  
        <!-- 中：表单画布 -->
        <DesignerCanvas
          class="editor-canvas"
          :schema="schema"
          v-model:selected="selected"
          @update:schema="setSchema"
          @select="select"
        />
  
        <!-- 右：字段配置 -->
        <FieldEditor
          class="editor-panel"
          :schema="schema"
          :selected="selected"
          @update:schema="setSchema"
        />
      </div>
  
      <!-- 下方：工具栏 + 表单渲染预览 -->
      <div class="editor-footer">
        <div class="toolbar">
          <button class="btn" @click="download">导出 JSON</button>
          <label class="btn">
            导入 JSON
            <input type="file" accept="application/json" @change="importSchema" hidden />
          </label>
        </div>
  
        <!-- 动态渲染表单 -->
        <FormRenderer :schema="schema" v-model="formData" />

      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import FieldPalette from './renderform/FieldPalette.vue'
  import DesignerCanvas from './renderform/DesignerCanvas.vue'
  import FieldEditor from './renderform/FieldEditor.vue'
  import FormRenderer from './renderform/FormRenderer.vue'
  
  function downloadJSON(data, filename = 'form-schema.json') {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const formData = ref({})

  const schema = ref([])
  const selected = ref(null)
  
  function setSchema(newSchema) {
    schema.value = newSchema
  }
  function select(id) {
    selected.value = id
  }

  function download() {
  downloadJSON({
    schema: schema.value,
    data: formData.value
  })
}

  function importSchema(event) {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
        try {
        const result = JSON.parse(reader.result)
        schema.value = result.schema || []
        formData.value = result.data || {}
        } catch (e) {
        alert('导入失败：文件格式错误')
        }
    }
    reader.readAsText(file)
  }

  </script>
  
  <style scoped>
  .lowcode-editor {
    font-family: 'Arial', sans-serif;
    padding: 5px;
  }
  
  .header {
    margin-bottom: 16px;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }
  
  .editor-main {
    display: flex;
    gap: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 10px;
    background: #fdfdfd;
  }
  
  /* 左右栏宽度固定 */
  .editor-panel {
    width: 360px;
  }
  
  /* 中间画布区域自适应 */
  .editor-canvas {
    flex: 1;
    min-height: 300px;
    border: 1px dashed #ccc;
    padding: 10px;
    background: #fff;
  }
  
  .editor-footer {
    margin-top: 24px;
  }
  
  /* 导入导出按钮区域 */
  .toolbar {
    margin-bottom: 12px;
  }
  .btn {
    display: inline-block;
    padding: 6px 12px;
    margin-right: 10px;
    background: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }
  .btn:hover {
    background: #66b1ff;
  }
  </style>
  