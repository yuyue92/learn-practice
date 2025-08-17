<template>
  <div class="home">
    <!-- <h2>首页内容</h2> -->
    <h2>登录成功！欢迎来到首页</h2>
    <!-- <p>
      <span>请输入密码:</span>
      <input type="text" v-model="passwordNumber" required/>
      <button @click="handleClickLogin">登录</button>
    </p> -->
    <button @click="redirect2TodoList">返回登录</button>
  </div>
</template>

<script lang="ts" setup>
// import { ref } from 'vue';
// import { useAppStore } from '../stores/app';
import router from '../router';

// const pwdStore = useAppStore();
// 这里可以添加页面逻辑
// const passwordNumber = ref(0);
// const handleClickLogin = () =>{
//   const cPassword = passwordNumber.value
//   if (cPassword < 0) return
//   console.log(passwordNumber.value, 'pwd', pwdStore);
//   pwdStore.setPassword(cPassword);
// }
const redirect2TodoList = ()=>{
  router.push('/login')
}
</script>

<style scoped>
.home {
  padding: 20px;
}
</style>