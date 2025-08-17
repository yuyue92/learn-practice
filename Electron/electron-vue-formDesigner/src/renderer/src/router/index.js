import { createRouter, createWebHashHistory } from 'vue-router';
import { menuItems } from '../menus.js';
import { useAppStore } from '../store/appStore.js';

const routes = menuItems.map(item => ({
  path: item.path,
  name: item.name,
  component: item.component
}));

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// 路由导航追踪

router.afterEach((to, from) => {
  const app1store = useAppStore();
  app1store.setMenuName(to.name)
  if(app1store.logRouterFlag) {
      logToLocalStorage({
          from: from.fullPath,
          to: to.fullPath,
          routeName: to.name || 'unnamed',
          timestamp: new Date().toISOString(),
      })
  }
})

export default router;
