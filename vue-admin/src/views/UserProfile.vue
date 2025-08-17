<template>
    <div class="profile">
      <h1>用户资料</h1>
      <p>用户ID: {{ $route.params.id }}</p>
      <p>用户名: {{ user.name }}</p>
      <p>邮箱: {{ user.email }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UserProfile',
    data() {
      return {
        user: {
          name: '',
          email: ''
        }
      }
    },
    created() {
      // 模拟根据ID获取用户数据
      this.fetchUserData(this.$route.params.id)
    },
    methods: {
      fetchUserData(userId) {
        // 模拟API调用
        const users = {
          '1': { name: '张三', email: 'zhangsan@example.com' },
          '2': { name: '李四', email: 'lisi@example.com' },
          '3': { name: '王五', email: 'wangwu@example.com' }
        }
        
        this.user = users[userId] || { name: '未知用户', email: '无' }
      }
    },
    watch: {
      '$route.params.id': {
        handler(newId) {
          this.fetchUserData(newId)
        },
        immediate: true
      }
    }
  }
  </script>
  
  <style scoped>
  .profile {
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 8px;
    margin-top: 20px;
  }
  </style>