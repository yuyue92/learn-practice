<template>
  <div class="app-container">
    <TopBar />
    <div class="main-layout">
      <SideMenu />
      <MainContent />
    </div>
  </div>
</template>

<script setup>
import TopBar from './components/TopBar.vue'
import SideMenu from './components/SideMenu.vue'
import MainContent from './components/MainContent.vue'

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>