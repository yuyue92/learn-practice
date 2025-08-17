<template>
    <div class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </template>
  
  <style scoped>
  .main-content {
    flex: 1;
    padding: 5px;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #f5f5f5;
  }

  /* 路由过渡动画 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}
  </style>