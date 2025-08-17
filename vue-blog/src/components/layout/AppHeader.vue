<template>
  <header class="app-header">
    <button class="toggle_btn" @click="toggleSidebar">
      <Expand/>
      <!-- <i class="icon-menu"></i> -->
    </button>
    <h3 class="title_wrapper">{{ title }}</h3>
    <span>角色:{{authStore.crole}}</span>
    <div class="userinfo-wrapper" v-if="authStore.isAuthenticated">
      <Avatar/>
      <span>欢迎, {{ authStore.currentUser?.username }}</span>
      <span>密码等级: {{ appStore.passwordLevel }}</span>
      <button @click="handleLogout">退出登录</button>

    </div>
  </header>
</template>
  
<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '../../stores/app'
import { useAuthStore } from '../../stores/authStore'
import router from '../../router'
import { Expand,  Avatar } from '@element-plus/icons-vue'
const route = useRoute()
const appStore = useAppStore()
const authStore = useAuthStore();
const title = computed(() => route.meta.title as string)

const toggleSidebar = () => {
  appStore.toggleSidebar()
}
const handleLogout = ()=>{
  //退出登录，并将密码等级重置0
  authStore.logout();
  appStore.setPassword(0);
  router.push('/login');
}
</script>
  
<style scoped>
.app-header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: #2c3e50;
  color: white;
}
.app-header .toggle_btn {
  padding: 0;
}
.app-header .toggle_btn svg{
  width: 40px;
  height: 20px;
}
.title_wrapper {
  margin-left: 22px;
}
.userinfo-wrapper {
  position: fixed;
  right: 22px;
}
.userinfo-wrapper svg{
  width: 22px;
}
.userinfo-wrapper span {
  display: inline-block;
  margin: 20px;
}
</style>