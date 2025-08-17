import { defineStore } from "pinia";
import { setPermissions } from "../utils/permission";

export const useAppStore = defineStore('app1',{
    state: () => ({
        count: 0,
        cmenuName: '',
        logRouterFlag: false,
        logClickFlag: false,
        loading: false,
        error: '',
        username: '',
        password: '',
        crole: '',
        isAuthenticated: false,
        passwordLevel: 0,
        cachedComList: [],
        sideBarCollapse: false,
    }),
    actions: {
        increment() {
            this.count++;
        },
        toggleLogRouter() {
            this.logRouterFlag = !this.logRouterFlag;
        },
        setMenuName(cname) {
            this.cmenuName = cname;
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
                setPermissions(['admin', 'guest']);
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
        setcachedComList(clist) {
            this.cachedComList = clist;
        },
        toggleCollapse() {
            this.sideBarCollapse = !this.sideBarCollapse;
        }
    }
})