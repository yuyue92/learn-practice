export const menuItems = [
    { name: '首页', path: '/', component: () => import('./views/Home.vue') },
    { name: '登录', path: '/login', component: () => import('./views/LoginPage.vue') },
    { name: '关于我们', path: '/about', component: () => import('./views/About.vue') },
    { name: '表单设计器', path: '/formDesigner', component: () => import('./views/FormDesigner.vue') },
    {
        path: '/user/:id',
        name: 'UserProfile',
        component: () => import('./views/UserProfile.vue'),
        props: true // 将路由参数作为props传递
    },
    {
        path: '/blog/:slug',
        name: '博客文章',
        component: () => import('./views/BlogPost.vue'),
        props: true
      },
    // 404页面处理 - 必须放在最后
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    hidden: true,
    component: () => import('./views/NotFound.vue')
  }
]