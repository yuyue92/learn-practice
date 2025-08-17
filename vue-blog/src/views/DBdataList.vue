<template>
    <div class="dbdata-list">
        <h1>IndexDB dataList</h1>
        <p class="input_wrapper">
            <span>UserName: </span>
            <input type="text" v-model="userName" />
            <span>UserEmail: </span>
            <input type="text" v-model="userEmail" />
            <button @click="handleAddUser">addUser</button>
            <button @click="handleQueryAll">queryAllUser</button>
            <button @click="handleQueryEmail">queryUserByEmail</button>
        </p>
        <div class="data-wrapper">
            <div class="pagination-controls">
                <span>allUserLen: {{ usersListLenth }}</span>
                <button  @click="prevPage"  :disabled="currentPage === 1">Previous</button>
                <span>Page {{ currentPage }} of {{ totalPages }}</span>
                <button @click="nextPage"  :disabled="currentPage === totalPages">Next</button>
            </div>
            <div class="table-container">
                <h2>用户列表</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>姓名</th>
                            <th>邮箱</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in paginatedUsers" :key="user.id">
                            <td>{{ user.id }}</td>
                            <td>{{ user.name }}</td>
                            <td>{{ user.email }}</td>
                            <td class="actions">
                                <button class="edit_btn" @click="editUser(user)">编辑</button>
                                <button class="del_btn" @click="deleteUser(user.id)">删除</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, computed } from 'vue';
import { UserDBService } from '../services/idb';
// initDB
interface User {
    id: string;
    name: string;
    email: string;
    createdAt: number;
}
// UserDBService
export default defineComponent({
    name:'database',
    setup() {
        const userName = ref('');
        const userEmail = ref('');
        const handleAddUser = async()=>{
            if (userName.value.trim()==='' || userEmail.value.trim()==='') return
            await UserDBService.addUser({
                // id: crypto.randomUUID(),
                name: userName.value,
                email: userEmail.value,
                createdAt: Date.now(),
            })
            console.log('add_user_data_: success!' )
            handleQueryAll();           //添加一条记录以后，自动查询刷新
        }
        const handleQueryAll = async()=>{
            users.value = await UserDBService.getAllUser();
            console.log('query_data_all: ', users.value )
        }
        const handleQueryEmail = async()=>{
            const inputEmail = userEmail.value.trim();
            if (inputEmail ==='') return
            const data = await UserDBService.getUserByEmail(inputEmail);
            users.value = data ? [data] : [];
            console.log(inputEmail , 'query_data_email: ', data )
        }
        // 开始分页处理数据
        const currentPage = ref(1);
        const usersPerPage = 10;
        const users = ref<User []>([]);
        const totalPages = computed(() =>{
            return Math.ceil(users.value.length / usersPerPage);
        })
        const usersListLenth = computed(()=> users.value.length);
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
        const paginatedUsers = computed(()=>{
            const start = (currentPage.value -1) * usersPerPage;
            const end = start + usersPerPage;
            return users.value.slice(start, end);
        })
        const editUser = (user:User)=>{ console.log('edit_user: ', user) }
        const deleteUser = (id: string)=>{ console.log('delete_id:', id) }
        onMounted(async()=>{
            handleQueryAll();
        })
        return {
            userName,
            userEmail,
            handleAddUser,
            handleQueryAll,
            handleQueryEmail,
            usersListLenth,
            users,
            nextPage,
            prevPage,
            totalPages,
            currentPage,
            usersPerPage,
            paginatedUsers,
            editUser,
            deleteUser
        }
    }
})
</script>

<style scoped>
.input_wrapper {
    padding: 11px;
    border: 1px solid #ccc;
}
.input_wrapper > input {
    padding: 5px;
    margin:  0 11px;
}
.input_wrapper > button {
    border: 1px solid #ccc;
    margin: 0 11px;
    padding: 5px;
}
.data-wrapper {
    padding: 22px;
    border: 1px solid #ccc;
}
/* 之前的样式保持不变，添加以下样式 */
.post-list {
    list-style: none;
    padding: 0;
}
.post-item {
    border: 1px solid #ccc;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}
.post-item .item_td {
    display: inline-block;
    min-width: 120px;
    border-right: 1px solid #ccc;
}
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 5px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #f5f5f5;
}
.actions {
  display: flex;
  gap: 5px;
}

.actions button {
  padding: 5px 10px;
  font-size: 14px;
}
.actions .edit_btn {
    color: green;
}
.actions .del_btn {
    color: red;
}
/* 添加分页按钮的相关样式 */
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