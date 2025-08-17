<template>
    <div class="palette">
      <h3>字段组件(可拖拽到画布区域)</h3>
      <div
        v-for="item in fieldTypes"
        :key="item.type"
        class="draggable-item"
        draggable="true"
        @dragstart="onDragStart(item)"
      >
        {{ item.label }}
      </div>
    </div>
  </template>
  
  <script setup>
  const emit = defineEmits(['drag'])
  
  const fieldTypes = [
    { type: 'input', label: '文本输入' },
    { type: 'select', label: '下拉框', options: ['a', 'b']},
    { type: 'textarea', label: '多行文本' },
  ]
  
  function onDragStart(item) {
    event.dataTransfer.setData('field', JSON.stringify(item))
  }
  </script>
  
  <style>
  .palette { padding: 10px; border-right: 1px solid #ccc; }
  .draggable-item { padding: 6px; margin: 4px 0; background: #eee; cursor: grab; }
  .palette {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  background: #fafafa;
}
  </style>
  