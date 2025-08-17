import { createApp } from 'vue';
import { createPinia } from 'pinia';        //顺序很重要：先安装 Pinia，再安装路由
import App from './App.vue';
import router from './router';
import './assets/base.css'
import GlobalList from './components/GlobalList.vue'
import { permissionDirective, permissionMixin } from './utils/permission';

const app = createApp(App);
app.use(createPinia());
app.use(router);
// 全局注册列表组件
app.component('CommonList', GlobalList);
// 注册全局权限指令
app.directive('permission', permissionDirective);
// 注册全局混入
app.mixin(permissionMixin);

app.mount('#app');
