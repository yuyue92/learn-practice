<template>
    <div class="canvas" @dragover.prevent @drop="onDrop">
      <h3>画布区域</h3>
      <div
        v-for="(field, index) in schema"
        :key="field.id"
        class="canvas-item"
        :class="{ active: selected === field.id }"
        @click="selectField(field.id)"
      >
        {{ field.label }}: {{ field.type }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { nanoid } from 'nanoid'
  
  const props = defineProps(['schema', 'selected'])
  const emit = defineEmits(['update:schema', 'select'])
  
  function onDrop(event) {
    const field = JSON.parse(event.dataTransfer.getData('field'))
    const newField = {
      ...field,
      id: nanoid(),
      label: field.label,
      field: `field_${Date.now()}`,
      props: { placeholder: '' },
    }
    emit('update:schema', [...props.schema, newField])
  }
  
  function selectField(id) {
    emit('select', id)
  }
  </script>
  
  <style>
  .canvas { padding: 10px; border: 1px dashed #aaa; min-height: 300px; }
  .canvas-item { margin: 6px 0; padding: 4px; border: 1px solid #ddd; cursor: pointer; }
  .active { background: #def; }
  </style>
  