<template>
    <div class="not-found">
      <h1>404 - 页面未找到</h1>
      <p>抱歉，您访问的页面不存在。</p>
      <p>您可以返回 <router-link to="/">首页</router-link> 或检查URL是否正确。</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFoundView'
  }
  </script>
  
  <style scoped>
  .not-found {
    text-align: center;
    padding: 50px 20px;
  }
  
  .not-found h1 {
    color: #e74c3c;
    font-size: 2.5rem;
    margin-bottom: 20px;
  }
  
  .not-found p {
    font-size: 1.2rem;
    margin-bottom: 15px;
  }
  
  .not-found a {
    color: #42b983;
    text-decoration: none;
  }
  
  .not-found a:hover {
    text-decoration: underline;
  }
  </style>