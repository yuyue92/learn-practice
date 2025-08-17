import { createRouter, createWebHistory } from 'vue-router'
import { constantRoutes } from './routes'
import { useAuthStore } from '../stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// 设置页面标题
router.beforeEach((to) => {
  const authStore = useAuthStore();
  // 检查路由是否需要认证
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name:'Login', query: {redirect: to.fullPath } }
  }
  if (to.meta.title) {
    document.title = `${to.meta.title} | Vue3 App`
  }
})

export default router