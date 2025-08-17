<template>
    <div class="layout">
        <div class="top-bar">
          <div class="topbar_left">
            <button class="menu-toggle" :class="{'icon-collapsed': app1store.sideBarCollapse}" @click="toggleMenu">
              <span class="icon">☰</span>
            </button>
            <span class="p-5">{{app1store.cmenuName}}</span>
          </div>
          <div class="topbar_right">
            <button class="theme-toggle" @click="toggleTheme">
              {{ theme === 'light' ? '🌙' : '☀️' }}
            </button>
          </div>
            <div class="user-info" v-if="app1store.isAuthenticated">
                <span>welcome, {{ app1store.crole }}</span>
                <button @click="handleLogout" class="btn">退出</button>
            </div>
        </div>
        <div class="main-content">
            <div class="side-menu" :class="{'menu-collapsed': app1store.sideBarCollapse}">
                <ul class="menu-list">
                    <li v-for="(item, k) in routeMetaList" :key="k" :title="item.meta ? `${item.meta.requiresAuth} only` : ''">
                        <router-link :to="item.path">{{item.name}}</router-link>
                    </li>
                </ul>
            </div>
            <div class="content-area">
                <router-view v-slot="{ Component }">
                  <transition name="fade" mode="out-in">
                    <KeepAlive :include="app1store.cachedComList">
                      <component :is="Component" />
                    </KeepAlive>
                  </transition>
                </router-view>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import router from '../router';
import { useAppStore } from '../store/useCommonStore';
import { setPermissions } from '../utils/permission';
import { applyTheme, getSavedTheme } from '../utils/theme'
const props = defineProps({
  routeList: {
    type: Array,
    default:()=>[]
  }
});
const routeMetaList = props.routeList.filter(c=> !c.hide)

const app1store = useAppStore();
//---退出登录
const handleLogout = () => {
  app1store.logOut();
  // 退出登录后跳转登录界面
  router.push('/login');
  setPermissions([]);
}
const toggleMenu = ()=>{
  app1store.toggleCollapse()
}

const theme = ref(getSavedTheme())
    
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  applyTheme(theme.value)
}

onMounted(() => {
  applyTheme(theme.value)
})

</script>

<style scoped>
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

.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.layout .top-bar {
  height: 60px;
  /* background-color: #666;
  color: white; */
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/* 添加主题切换按钮样式 */
.top-bar .theme-toggle {
  background: none;
  border: none;
  color: var(--topbar-text);
  font-size: 1.2rem;
  cursor: pointer;
  margin-right: 15px;
}

/* 添加菜单切换按钮样式 */
.layout .top-bar .menu-toggle {
  padding: 0; width: 22px;
}
.layout .top-bar .menu-toggle .icon{
  display: inline-block; /* 让 transform 生效 */
  transition: transform 0.3s ease;
}
.layout .top-bar .menu-toggle.icon-collapsed .icon{
  transform: rotate(90deg); /* 顺时针旋转90度 */
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.main-content .side-menu {
  width: 200px;
  /* background-color: #34495e; */
  /* color: white; */
  height: 100%;
  overflow-y: auto;
}
/* 响应式设计 */
@media (max-width: 1000px) {
  .main-content .side-menu {
    width: 150px;
  }
}
.main-content .side-menu.menu-collapsed {
  width: 0;
}

.main-content .side-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list li {
  height: 40px;
  border-bottom: 1px solid #666;
}

.menu-list li a {
  display: flex;
  align-items: center;
  padding: 8px 20px;
  color: #ecf0f1;
  text-decoration: none;
  transition: background-color 0.3s;
  white-space: nowrap;        /* 禁止换行 */
  overflow: hidden;           /* 隐藏超出内容 */
  text-overflow: ellipsis;    /* 溢出内容显示省略号 */
}

.menu-list li a:hover {
  background-color: #2c3e50;
}

.menu-list li a.router-link-exact-active {
  background-color: #42b983;
  color: white;
}

.content-area {
  flex: 1;
  padding: 20px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>