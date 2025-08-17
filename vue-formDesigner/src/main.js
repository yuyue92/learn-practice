import { createApp } from 'vue'
// import './style.css'
import './custom.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import trackClick from './utils/trackClick'
import { permissionDirective, permissionMixin, setPermissions } from './utils/permission'
import GlobalList from './components/GlobalList.vue'
// createApp(App).use(router).mount('#app')
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App);
app.use(createPinia());
app.use(ElementPlus);
// 开发环境下引入mock
if (process.env.NODE_ENV === 'development') {
    import('./utils/mockdata').then(({ default: mock }) => {
      console.log('Mock server is running')
    })
  }

// 全局注册列表组件
app.component('CommonList', GlobalList)
// 注册点击追踪指令
app.directive('track', trackClick);
// 注册全局权限指令
app.directive('permission', permissionDirective);
// 注册全局混入
app.mixin(permissionMixin);

app.use(router);
app.mount('#app');
