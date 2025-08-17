<template>
    <div class="post-list-container">
      <h1>Posts from JSONPlaceholder</h1>
      
      <div v-if="loading" class="loading">Loading posts...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <div class="pagination-controls">
            <button  @click="prevPage"  :disabled="currentPage === 1">Previous</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="nextPage"  :disabled="currentPage === totalPages">Next</button>
        </div>
        <ul class="post-list">
            <li v-for="post in paginatedPosts" :key="post.id" class="post-item">
                <h2 class="post-title">{{ post.title }}</h2>
                <p class="post-body">{{ post.body }}</p>
                <div class="post-meta">Post ID: {{ post.id }} | User ID: {{ post.userId }}</div>
            </li>
        </ul>
    </div>
    </div>
  </template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
// 定义帖子类型
interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}
export default defineComponent({
    name: 'PostList',
    setup() {
        // 定义响应式数据
        const loading = ref(true);
        const posts = ref<Post []>([]);
        const error = ref<string | null>(null);
        const currentPage = ref(1);
        const postsPerPage = 10;
        const totalPages = computed(() =>{
            return Math.ceil(posts.value.length / postsPerPage);
        })
        // 前后翻页的方法
        const nextPage = ()=>{
            if (currentPage.value < totalPages.value) {
                currentPage.value++;
            }
        }
        const prevPage = ()=>{
            if (currentPage.value >1) {
                currentPage.value--;
            }
        }
        // 按照分页方法截取的列表数据
        const paginatedPosts = computed(()=>{
            const start = (currentPage.value -1) * postsPerPage;
            const end = start + postsPerPage;
            return posts.value.slice(start, end);
        })
        // 获取数据的函数
        const fetchPosts = async()=>{
            try {
                loading.value = true;
                error.value = null;
                const response = await fetch('https://jsonplaceholder.typicode.com/posts');
                if (!response.ok) {
                    throw new Error (`HTTP error! status: ${response.status}`);
                }
                const dataList = await response.json();
                // console.log('dataList_: ', dataList)
                posts.value = dataList;
            } catch (err) {
                error.value = err instanceof Error ? err.message : 'Failed to fetch posts';
            } finally {
                loading.value = false;
            }
        }
            // 组件挂载时获取数据
        onMounted(() =>{
            // console.log('    // 组件挂载时获取数据')
            fetchPosts()
        })
        return {
            loading,
            posts,
            error,
            currentPage,
            postsPerPage,
            totalPages,
            nextPage,
            prevPage,
            paginatedPosts
        }
    }
})
</script>
<style scoped>
.post-list-container {
  /* max-width: 800px; */
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  font-size: 18px;
}

.error {
  color: #d32f2f;
}

.post-list {
  list-style: none;
  padding: 0;
}

.post-item {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.post-item:hover {
  transform: translateY(-2px);
}

.post-title {
  color: #1976d2;
  margin-top: 0;
  margin-bottom: 10px;
}

.post-body {
  color: #555;
  line-height: 1.6;
  margin-bottom: 10px;
}

.post-meta {
  font-size: 14px;
  color: #888;
  font-style: italic;
}
/* 之前的样式保持不变，添加以下样式 */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.pagination-controls button {
  padding: 8px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-controls button:disabled {
  background-color: #b0bec5;
  cursor: not-allowed;
}
</style>