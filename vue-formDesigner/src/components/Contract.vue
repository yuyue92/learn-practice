<!-- ListWithSkeleton.vue -->
<template>
    <div>
      <template v-if="loading">
        <SkeletonItem v-for="n in 5" :key="n" />
      </template>
      <template v-else>
        <div class="table-container">
            <h2>用户列表
                <button @click="fetchUsersList" class="p-5 m-5">查询数据</button>
                <button @click="addUser" class="p-5 m-5">新增</button>
            </h2>
            <ModalDialog v-if="showModal" :show="showModal" :form="userForm" :onClose="closeModal" :onSave="handleSave" />
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>姓名</th>
                        <th>邮箱</th>
                        <th>年龄</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in userList" :key="user.id">
                        <td>{{ user.id }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.age }}</td>
                        <td class="actions">
                            <button @click="editUser(user)" class="m-5">编辑</button>
                            <button @click="deleteUser(user.id)" class="m-5">删除</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </template>
    </div>
  </template>
  
<script setup>
import { ref, onMounted } from 'vue'
import SkeletonItem from './SkeletonItem.vue'
import ModalDialog from './ModalDialog.vue'
// 引入数据库相关配置
import { supabase } from '../utils/supaBaseCFG'
const showModal = ref(false)

function openModal() {
  showModal.value = true
}
function closeModal() {
  showModal.value = false
}
// 生成随机ID的方法，入参是位数，比如16位ID
const generateRandomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(byte => chars[byte % chars.length])
    .join('');
}
const loading = ref(false)
// 用户列表数据
const userList = ref([]);
// 1. 查询数据
const fetchUsersList = async () => {
  loading.value = true
    const { data, error } = await supabase
      .from('users')
      .select('*')
    
    if (error) {
        console.error('Fetch error:', error)
    }else {
        // console.log('fdata_: ', data )
        userList.value = data;
        loading.value = false
    }
}
const userForm = ref({
    id: '',
    name: '',
    email: '',
    age: '',
})
onMounted(() => {
  fetchUsersList()
})

const editUser = (uform) =>{
    // console.log('Userid:', uform);
    userForm.value = uform;
    openModal();
}
const addUser = ()=>{
    userForm.value = {
        id: generateRandomString(16),
        name: '',
        email: '',
        age: '',
    }
    openModal();
}
const handleSave = (saveData)=>{
    // console.log('==resdata==========', saveData )
    const cindex = userList.value.findIndex(c=>c.id ===saveData.id);
    //更新用户
    if(cindex !== -1) {
        // userList.value[cindex] = {...saveData};
        updateUser(saveData)
    } else {
        //新增用户
        // userList.value.push(saveData)
        insertUser(saveData)
    }
}
const insertUser = async(resdata)=>{
  const { data, error } = await supabase
  .from('users')
  .insert([ resdata ])
  .select()
  if (error) {
    console.error('addUser error:', error)
  }else {
    console.log('add_new_data_: ', data )
    fetchUsersList()
  }
}
const updateUser = async(resdata)=>{
  console.log('updata:', resdata )
  const { error } = await supabase
    .from('users')
    .update(resdata)
    .eq('id', resdata.id)
  if (error) {
    console.error('updateUser_error:', error)
  }else {
    fetchUsersList()
  }
}
const deleteUser = async(id)=>{
  if (confirm('确定要删除这个用户吗？' + id)) {
    const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)
    if (error) {
      console.error('del_User error:', error)
    }else {
      fetchUsersList()
    }
  }
}
</script>
<style scoped>
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 3px 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #f5f5f5;
}
</style>