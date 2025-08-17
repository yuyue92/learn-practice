<template>
  <div class="app-container">
    <AppHeader />
    <div class="app-wrapper">
      <AppSidebar />
      <AppMain />
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppHeader from './components/layout/AppHeader.vue'
import AppSidebar from './components/layout/AppSidebar.vue'
import AppMain from './components/layout/AppMain.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>