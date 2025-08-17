import { defineStore } from "pinia";
import { computed, ref, type Ref } from "vue";
import { useAppStore } from "./app";
import { constantRoutes } from "../router/routes";

interface User {
    username: string
    email: string
    token: string
}


export const useAuthStore = defineStore('auth', ()=>{
    const pwdStore = useAppStore();
    // 状态
    const user: Ref<User | null> = ref(null)
    const loading: Ref<boolean> = ref(false);
    const error: Ref<string | null> = ref(null);
    const crole: Ref<string> = ref('');
    // 计算属性
    const isAuthenticated = computed(() => !!user.value);
    const currentUser = computed(() => user.value);

    // 登录方法
    async function login(username: string, password: string) {
        try {
            loading.value = true;
            error.value = null;
            
            // 模拟API调用
            const response = await mockLoginApi(username, password);
            // 更新用户状态
            user.value = {
                username: response.username,
                email: response.email,
                token: response.token
            }
            // 可选：将token存储到localStorage
            localStorage.setItem('authToken', response.token);
            return response;
        } catch (error2) {
            error.value = error2 instanceof Error ? error2.message : '登录失败';
            throw error2
        } finally {
            loading.value = false;
        }
    }
    // 模拟登录API的方法
    async function mockLoginApi(username: string, password: string): Promise<{username: string, email:string, token:string}> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 需要做权限判断，管理员可以查看和操作所有，访客仅能部分菜单
                if(username === 'admin') {
                    resolve({
                        username: 'admin',
                        email: 'admin@example.com',
                        token: `mock-jwt-token-${password}`
                    })
                    pwdStore.setPassword(3)
                }else if(username === 'guest') {
                    resolve({
                        username: 'guest',
                        email: 'guest@example.com',
                        token: `mock-jwt-token-${password}`
                    })
                    pwdStore.setPassword(1)
                    
                } else {
                    reject(new Error('用户名或密码错误!'))
                }
                
                /* if (username ==='admin') {
                    resolve({
                        username: 'admin',
                        email: 'admin@example.com',
                        token: 'mock-jwt-token-123456'
                    })
                    if (password == '57632') {
                        pwdStore.setPassword(5)
                    } else if (password == '25768') {
                        pwdStore.setPassword(3)
                    } else {
                        pwdStore.setPassword(1)
                    }
                } else {
                    reject(new Error('用户名或密码错误!'))
                } */
            }, 1000);
        })
    }
    // 登出方法
    function logout() {
        user.value = null;
        localStorage.removeItem('authToken');
        crole.value=''
    }
    function setError() {
        error.value = '用户名或密码不能为空'
    }
    function setCrole(role: string) {
        crole.value = role
    }
    function generateRoutes() {
        // 根据角色过滤路由列表
        let fconstantRoutes = constantRoutes.filter(item => {
          if(item.meta?.hidden || (item.meta && item.meta.roles!=='' && item.meta.roles !==crole.value)) {
              return false
          }
          return true
        })
        console.log(constantRoutes, 'constantRoutes_: ',  fconstantRoutes)
        return fconstantRoutes
    }
    return {
        user,
        loading,
        error,
        isAuthenticated,
        currentUser,
        login,
        logout,
        setError,
        crole,
        setCrole,
        generateRoutes
    }
})