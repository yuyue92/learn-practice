<template>
    <div class="crud-container">
        <h1>用户管理系统</h1>
        <!-- 添加/编辑表单 -->
         <div class="form-container">
            <h2>{{ isEditing ? '编辑用户' : '添加新用户' }}</h2>
            <form @submit.prevent="handleSubmit" class="from-wrapper">
                <div class="form-group">
                    <label for="name">姓名: </label>
                    <input type="text" id="name" required v-model="currentUser.name">
                </div>
                <div class="form-group">
                    <label for="youx">邮箱: </label>
                    <input type="email" id="youx" required v-model="currentUser.email">
                </div>
                <div class="form-group">
                    <label for="age">年龄: </label>
                    <input type="number" id="age" required min="1" v-model="currentUser.age">
                </div>
                <div class="form-group">
                    <label for="name">性别: </label>
                    <div class="radio-group">
                        <label>
                            <input type="radio" value="male" v-model="currentUser.gender">男
                        </label>
                        <label>
                            <input type="radio" value="female" v-model="currentUser.gender">女
                        </label>
                        <label>
                            <input type="radio" value="other" v-model="currentUser.gender">其他
                        </label>
                    </div>
                </div>
                <div class="from-actions">
                    <button type="submit">{{ isEditing ? '更新' : '添加' }}</button>
                    <button type="button" v-if="isEditing" @click="resetForm">取消</button>
                </div>
            </form>
         </div>
         <!-- 用户表格 -->
        <div class="table-container">
            <h2>用户列表</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>姓名</th>
                        <th>邮箱</th>
                        <th>年龄</th>
                        <th>性别</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td>{{ user.id }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.age }}</td>
                        <td>{{  getGenderText(user.gender) }}</td>
                        <td class="actions">
                            <button @click="editUser(user)">编辑</button>
                            <button @click="deleteUser(user.id)">删除</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script lang="ts">
import { ref, defineComponent, reactive } from 'vue';
// 首先定义一个Typescript接口来描述数据模型【User】
interface User {
    id: number;
    name: string;
    email: string;
    age: number;
    gender: 'male' | 'female' | 'other';
}
export default defineComponent({
    name: 'UserCrud',
    setup() {
        // 用户列表数据
        const users = ref<User[]>([
            { id: 1, name: '张三', email: 'zhangsan@example.com', age: 25, gender: 'male' },
            { id: 2, name: '李四', email: 'lisi@example.com', age: 30, gender: 'female' },
            { id: 3, name: '王五', email: 'wangwu@example.com', age: 28, gender: 'other' }
        ])
        // 当前编辑的用户
        const currentUser = reactive<User>({
            id: 0,
            name: '',
            email: '',
            age: 0,
            gender: 'male'
        })
        // 性别显示文本
        const getGenderText = (gender: string): string =>{
            const genderMap: Record<string, string> = {
                'male': '男',
                'female': '女',
                'other': '其他'
            }
            return genderMap[gender] || gender
        }
        // 是否处于编辑状态
        const isEditing = ref(false);
        // 处理表单提交
        // 编辑用户
        const editUser = (user: User)=>{
            Object.assign(currentUser, user);
            isEditing.value = true;
            console.log(user,'-----------editUser')
        }
        const deleteUser = (id: number) =>{
            if (confirm('确定要删除这个用户吗？')) {
                console.warn(id, '--------dellll')
                users.value = users.value.filter(c=>c.id !== id);
            }
        }
        //处理表单提交
        const handleSubmit = ()=>{
            if(isEditing.value) {
                //更新用户
                const cindex = users.value.findIndex(c=>c.id ===currentUser.id);
                if(cindex !== -1) {
                    users.value[cindex] = {...currentUser};
                }
            } else {
                //新增用户
                const newUser = {
                    ...currentUser,
                    id: users.value.length > 0 ? Math.max( ...users.value.map(c=>c.id)) +1 : 1
                }
                users.value.push(newUser)
            }
            //提交完成以后，设置重置一下表单数据
            resetForm()
        }
        // 重置表单
        const resetForm = () => {
            Object.assign(currentUser, {
                id: 0,
                name: '',
                email: '',
                age: 0,
                gender: 'male'
            });
            isEditing.value = false;
        }
        return {
            users,
            currentUser,
            isEditing,
            getGenderText,
            editUser,
            deleteUser,
            handleSubmit,
            resetForm,
        }
    }
})
</script>

<style scoped>
.crud-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.form-container {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}
.from-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: start;
  gap: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="number"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.radio-group {
  display: flex;
  gap: 15px;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: normal;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 15px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #45a049;
}

button[type="button"] {
  background: #f44336;
}

button[type="button"]:hover {
  background: #d32f2f;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
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
</style>