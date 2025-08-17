import { defineStore } from "pinia";
import { setPermissions } from "@renderer/utils/permission";

export const useAppStore = defineStore('app1',{
    state: ()=> ({
        cmenuName: 'home',
        userName: 'user',
        logRouterFlag: false,
        isAuthenticated: false,
        loading: false,
        error: '',
        username: '',
        password: '',
        crole: '',
        passwordLevel: 0,
        mockList1: [
            {id: "y66MuMg3wKvuZ2Xt"},
            {id: "yn85Q4gRHOju4UJH"},
            {id: "FEr67Dqu53sHdzJ9"},
        ],
        mockList2: [
            {id: 'oTgPewvSCx8M6LjG', name:'zhangsna', age: 33, email: 'zhangsan@qq.com'},
            {id: 'YHPTRGJ7GMbDh4pe', name:'lisi', age: 44, email: 'lisi@qq.com'},
        ],
    }),
    actions: {
        setMenuName(cname) {
            this.cmenuName  = cname;
        },
        addToMockList1(citem) {
            this.mockList1.push(citem)
        },
        addToMockList2(citem) {
            this.mockList2.push(citem)
        },
        updateMockList2(citem) {
            this.mockList2 = this.mockList2.map(item => item.id === citem.id ? citem : item)
        },
        deleteMockList2ByID(cid) {
            this.mockList2 = this.mockList2.filter(c=> c.id!==cid)
        },
        queryMockList2ByName(cname) {
            return this.mockList2.filter(c=> c.name===cname)
        },
        toggleLogRouter() {
            this.logRouterFlag = !this.logRouterFlag;
        },
        setCrole(role){
            this.crole = role
        },
        setisAuthenticated(bool1) {
            this.isAuthenticated = bool1
        },
        logOut() {
            this.crole = '';
            this.password = '';
            this.username = '';
            this.isAuthenticated = false;
            localStorage.removeItem('authToken');
        },
        login(uname, pwd) {
            if(uname === 'superAdmin') {
                this.setPassword(5);
                this.setCrole(uname);
                this.setisAuthenticated(true);
                localStorage.setItem('authToken', `mock-jwt-token-${pwd}`);
                setPermissions(['superAdmin','admin', 'guest']);
            }else if(uname === 'admin') {
                this.setPassword(3);
                this.setCrole(uname);
                this.setisAuthenticated(true);
                localStorage.setItem('authToken', `mock-jwt-token-${pwd}`);
                // 模拟设置用户按钮权限，【管理员？ 访客？或者其他？】
                setPermissions(['admin', 'guest']);
            }else if(uname === 'operator') {
                this.setPassword(2);
                this.setCrole(uname);
                this.setisAuthenticated(true);
                setPermissions([ 'operator']);
            }else if(uname === 'guest') {
                this.setPassword(1);
                this.setCrole(uname);
                this.setisAuthenticated(true);
                setPermissions([ 'guest']);
            }else {
                this.error = '用户名或密码错误';
            }
        },
        setPassword(passNum) {
            this.passwordLevel = passNum;
        },
        setError() {
            this.error = '用户名或密码不能为空';
        },
    }
})