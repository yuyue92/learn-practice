<template>
    <div class="home">
      <h1>欢迎来到首页</h1>
      <p>这是我们的主页内容。</p>
      <p v-for="i in 32" :key="i">{{ i }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomeView'
  }
  </script>
  
  <style scoped>
  .home {
    padding: 20px;
  }
  </style>