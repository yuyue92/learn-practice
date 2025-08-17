<template>
  <div class="app">
    <div class="left">
      <FieldPalette />
    </div>
    <div class="center">
      <CanvasArea />
      <PreviewArea />
    </div>
    <div class="right">
      <FieldEditor />
    </div>
  </div>
</template>
<script setup>
import FieldPalette from './FieldPalette.vue'
import CanvasArea from './CanvasArea.vue'
import PreviewArea from './FormPreview.vue'
import FieldEditor from './FieldEditor.vue'
</script>
<style scoped>
.app {
  display: flex;
  height: 100vh;
}
.left, .right {
  width: 20%;
  overflow-y: auto;
  border-right: 1px solid #ddd;
  padding: 10px;
}
.center {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}
</style>