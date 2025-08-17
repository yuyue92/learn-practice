<template>
    <div class="post">
      <h1>博客文章: {{ $route.params.slug }}</h1>
      <p>这是关于 {{ post.title }} 的文章内容。</p>
      <div class="content">
        {{ post.content }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BlogPost',
    data() {
      return {
        post: {
          title: '',
          content: ''
        }
      }
    },
    created() {
      this.fetchPostData(this.$route.params.slug)
    },
    methods: {
      fetchPostData(slug) {
        // 模拟API调用
        const posts = {
          'vue3-guide': { 
            title: 'Vue3 入门指南', 
            content: '这篇文章将介绍Vue3的基础知识...' 
          },
          'router-tutorial': { 
            title: 'Vue路由教程', 
            content: '学习如何使用Vue Router构建单页应用...' 
          },
          'animation-techniques': { 
            title: 'Vue动画技巧', 
            content: '探索Vue中的各种动画实现方式...' 
          }
        }
        
        this.post = posts[slug] || { 
          title: '文章未找到', 
          content: '抱歉，您请求的文章不存在。' 
        }
      }
    },
    watch: {
      '$route.params.slug': {
        handler(newSlug) {
          this.fetchPostData(newSlug)
        },
        immediate: true
      }
    }
  }
  </script>
  
  <style scoped>
  .post {
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 8px;
    margin-top: 20px;
  }
  
  .content {
    margin-top: 20px;
    line-height: 1.6;
  }
  </style>