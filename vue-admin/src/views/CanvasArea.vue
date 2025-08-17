<template>
    <div class="canvas" ref="canvas">
      <h3>表单画布</h3>
      <div
        v-for="(field, index) in store.formFields"
        :key="field.id"
        class="field-item"
        :data-id="field.id"
        :class="{ selected: index === store.selectedIndex }"
        @click="selectField(index)"
      >
        {{ field.label }} ({{ field.type }})
      </div>
    </div>
  </template>
  <script setup>
  import { onMounted, ref, nextTick } from 'vue'
  import interact from 'interactjs'
  import { useFormStore } from '@/stores/formStore'
  
  const store = useFormStore()
  const canvas = ref(null)
  
  const selectField = (index) => {
    store.setSelectedIndex(index)
  }
  
  onMounted(() => {
    nextTick(() => {
      interact('.canvas').dropzone({
        accept: '.field-item',
        overlap: 0.5
      })
  
      interact('.field-item').draggable({
        inertia: true,
        autoScroll: true,
        listeners: {
          move(event) {
            const target = event.target
            target.style.transform = `translate(${event.dx}px, ${event.dy}px)`
          },
          end(event) {
            event.target.style.transform = ''
  
            const draggedId = event.target.dataset.id
            const draggedIndex = store.formFields.findIndex(f => f.id == draggedId)
  
            const dropIndex = Array.from(canvas.value.children).indexOf(event.target)
  
            if (draggedIndex >= 0 && dropIndex >= 0 && draggedIndex !== dropIndex) {
              const newList = [...store.formFields]
              const [moved] = newList.splice(draggedIndex, 1)
              newList.splice(dropIndex, 0, moved)
              store.formFields = newList
  
              const newIndex = newList.findIndex(f => f.id === moved.id)
              store.setSelectedIndex(newIndex)
            }
          }
        }
      })
    })
  })
  </script>
  <style scoped>
  .canvas {
    min-height: 200px;
    border: 1px dashed #ccc;
    padding: 10px;
    user-select: none;
  }
  .field-item {
    padding: 8px;
    margin: 5px 0;
    background: #f4f4f4;
    border: 1px solid #ddd;
    cursor: move;
  }
  .field-item.selected {
    background: #e6f7ff;
    border-color: #409eff;
  }
  </style>