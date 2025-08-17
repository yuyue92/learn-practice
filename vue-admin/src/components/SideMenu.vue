<template>
    <div class="side-menu">
      <ul class="menu-list">
        <li v-for="item in filterMenuList" :key="item.path">
          <router-link 
            :to="item.path" 
            :class="{ 'active': $route.path === item.path }"
          >
            <span class="text">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </template>
  
<script setup>
import { menuItems } from '../menu';
const filterMenuList = menuItems.filter(v=> !v.hidden)
</script>
  
  <style scoped>
  .side-menu {
    width: 250px;
    height: 100%;
    background-color: #34495e;
    color: white;
  }
  
  .menu-header {
    padding: 20px;
    border-bottom: 1px solid #2c3e50;
  }
  
  .menu-header h3 {
    margin: 0;
    font-size: 1.2rem;
  }
  
  .menu-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .menu-list li {
    border-bottom: 1px solid #666;
  }
  
  .menu-list li a {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    color: #ecf0f1;
    text-decoration: none;
    transition: background-color 0.3s;
  }
  
  .menu-list li a:hover {
    background-color: #2c3e50;
  }
  
  .menu-list li a.active {
    background-color: #42b983;
    color: white;
  }
  
  .icon {
    margin-right: 10px;
    width: 20px;
    text-align: center;
  }
  
  /* 这里可以使用实际的图标库，如Font Awesome */
  .icon-home::before { content: "🏠"; }
  .icon-dashboard::before { content: "📊"; }
  .icon-profile::before { content: "👤"; }
  .icon-settings::before { content: "⚙️"; }
  .icon-about::before { content: "ℹ️"; }
  .icon-contact::before { content: "📧"; }
  </style>