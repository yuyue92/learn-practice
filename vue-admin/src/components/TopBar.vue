<template>
    <div class="top-bar">
      <div class="left">
        <h1>{{ app1store.cmenuName }}</h1>
      </div>
      <div class="right" v-if="app1store.isAuthenticated">
        <span class="user-info">welcome, {{ app1store.crole }}</span>
        <button class="logout-btn" @click="handleLogout">退出</button>
      </div>
    </div>
  </template>
  
<script setup>
    import { useAppStore } from '@/stores/useCommonStore';
    import router from '../router';
    import { setPermissions } from '../utils/permission';
    const app1store = useAppStore();
    //---退出登录
    const handleLogout = () => {
        app1store.logOut();
        // 退出登录后跳转登录界面
        router.push('/login');
        setPermissions([]);
    }
</script>
  
  <style scoped>
  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    background-color: #2c3e50;
    color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .left h1 {
    margin: 0;
    font-size: 1.5rem;
  }
  
  .right {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .user-info {
    font-weight: bold;
  }
  
  .notification-badge {
    background-color: #e74c3c;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.8rem;
  }
  
  .logout-btn {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .logout-btn:hover {
    background-color: #c0392b;
  }
  </style>