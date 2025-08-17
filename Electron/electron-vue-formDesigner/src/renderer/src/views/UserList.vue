<!-- ListWithSkeleton.vue -->
<template>
  <div>
    <template v-if="loading">
      <SkeletonItem v-for="n in 5" :key="n" />
    </template>
    <template v-else>
      <div class="table-container">
          <div>
            <span>用户列表</span>
            <span>*仅管理员可操作增删改</span>
              <button v-permission="'admin'" @click="addUser" class="p-5 m-5">新增</button>
              <!-- <button v-permission="'admin'" @click="importUser" class="p-5 m-5">导入</button> -->
              <div class="inline" v-permission="'admin'">
                <button class="import-btn" @click="triggerFileInput">📂 导入 CSV</button>
                <input ref="fileInput" type="file" accept=".csv" @change="handleImport" style="display: none" />
              </div>
              <!-- <input type="file" accept=".csv" @change="importUser" /> -->
              <button v-permission="'admin'" @click="exportUser" class="p-5 m-5 export-btn">导出</button>
          </div>
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
                          <button v-permission="'admin'" @click="editUser(user)" class="p-5 m-5">编辑</button>
                          <button v-permission="'admin'" @click="deleteUser(user.id)" class="p-5">删除</button>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import SkeletonItem from '@renderer/components/SkeletonItem.vue'
import ModalDialog from '@renderer/components/ModalDialog.vue'
import { useAppStore } from '@renderer/store/appStore'
import { exportToCSV, importCSV } from '@renderer/utils/csv'
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
  const app1store = useAppStore();
  // 用户列表数据
  const userList = ref([]);
  const loading = ref(false)
  onMounted(()=>{
    loading.value = true
    fetchData()
    setTimeout(() => {
      loading.value = false
    }, 300);
  })
  const fetchData = ()=>{
    userList.value = app1store.mockList2.slice(0);
  }

  const userForm = ref({
    id: '',
    name: '',
    email: '',
    age: '',
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
    const cindex = userList.value.findIndex(c=>c.id ===saveData.id);
    //更新用户
    if(cindex !== -1) {
        // userList.value[cindex] = {...saveData};
        app1store.updateMockList2(saveData);
    } else {
        //新增用户
        // userList.value.push(saveData)
        app1store.addToMockList2(saveData);
      }
      fetchData();
  }
  const deleteUser = async(id)=>{
    if (confirm('确定要删除这个用户吗？' + id)) {
      // userList.value = userList.value.filter(user => user.id !== id);
      app1store.deleteMockList2ByID(id);
      fetchData();
    }
  }
  const exportUser = ()=>{
    const headers = ['id', 'name', 'age', 'email']
    exportToCSV(userList.value, headers, `userList_${new Date().toISOString()}.csv`)
  }
  const fileInput = ref(null);
  const triggerFileInput = ()=>{
    fileInput.value && fileInput.value.click();
  }
  const handleImport = (event)=>{
    console.log('evt: ', event )
    const file = event.target.files[0];
    if (file) {
      importCSV(file, (data) => {
        // console.log('导入结果:', data);
        for(let item of data) {
          app1store.addToMockList2(item)
        }
        fetchData()
        // 赋值给你的列表变量
      });
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
.import-btn, .export-btn {
  padding: 5px;
  font-size: 14px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.import-btn:hover, .export-btn:hover {
  background-color: #66b1ff;
}

</style>