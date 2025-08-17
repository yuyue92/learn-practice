import { createRouter, createWebHistory } from 'vue-router'
import { menuItems } from '../menu'
import { useAppStore } from '../stores/useCommonStore';

const routes = menuItems.map(item => ({
    path: item.path,
    name: item.name,
    component: item.component
}));

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由导航追踪
router.afterEach((to, from) => {
  const app1store = useAppStore();
  app1store.setMenuName(to.name)
})

export default router