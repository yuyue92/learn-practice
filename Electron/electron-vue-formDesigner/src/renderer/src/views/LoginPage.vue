<template>
    <div class="login-form">
        <div class="form-group">
            <label for="name">用户名</label>
            <input type="text" id="name" v-model="username" required placeholder="请输入用户名"/>
        </div>
        <div class="form-group">
            <label for="pwd">密码</label>
            <input type="text" id="pwd" v-model="password" required placeholder="请输入密码"/>
        </div>
        <button :disabled="isLoading" @click="handleSubmitLogin">{{ isLoading ? '登录中...' : '登录' }}</button>
        <div class="error-message" v-if="error">{{ error }}</div>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import router from '@renderer/router';
import { useAppStore } from '@renderer/store/appStore';

const username = ref('');
const password = ref('');

const authStore = useAppStore();
const isLoading = computed(() => authStore.loading);
const error = computed(() => authStore.error);

const handleSubmitLogin = async() =>{
    try {
        if(username.value==='' || password.value==='') {
            return authStore.setError()
        }
        authStore.setCrole(username.value)        //设置角色
        // console.log('loginnnn__: ', username.value, password.value)
        authStore.login(username.value, password.value);
        // 登录成功后重定向到首页
        router.push('/');
    } catch (error) {
        console.error('handle_submit_ERR: ', error)
    }
}
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}


.form-group {
  margin-bottom: 1rem;
  display: flex;
  padding: 11px;
}
.form-group:focus-within {
    background: #ccc;
}
.form-group >label {
    width: 60px; padding-right: 5px;
    text-align: right;
}
.form-group >input {
    flex: 1;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>