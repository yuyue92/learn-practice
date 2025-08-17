import type { RouteRecordRaw } from 'vue-router'

import {
  UserFilled,
  Document,
  Message,
  PieChart,
  Menu,
  HomeFilled,
  Grid
} from '@element-plus/icons-vue'

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页',
      icon: HomeFilled,
      requiresAuth: true,
      roles: ''
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginForm.vue'),
    meta: {
      title: '登录',
      icon: Menu,
      // hidden: true,
      requiresAuth: false,
      roles: ''
    }
  },
  {
    path: '/userList',
    name: 'UserList',
    component: () => import('../views/UserList.vue'),
    meta: {
      title: '用户列表',
      icon: UserFilled,
      requiresAuth: true,
      roles: 'admin'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      title: '关于',
      icon: PieChart,
      requiresAuth: true,
      roles:  ''
    }
  },
  {
    path: '/todoList',
    name: 'TodoList',
    component: () => import('../views/TodoList.vue'),
    meta: {
      title: '待办事项',
      icon: Message,
      requiresAuth: true,
      roles: ''
    }
  },
  {
    path: '/postList',
    name: 'PostList',
    component: () => import('../views/PostList.vue'),
    meta: {
      title: '博客列表',
      icon: Document,
      requiresAuth: true,
      roles: ''
    }
  },
  {
    path: '/dataList',
    name: 'dataList',
    component: () => import('../views/DBdataList.vue'),
    meta: {
      title: '数据库',
      icon: Grid,
      requiresAuth: true,
      roles: 'admin'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '404',
      hidden: true,
      requiresAuth: false,
      roles: ''
    }
  }
]