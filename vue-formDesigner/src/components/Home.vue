<template>
    <div class="home_wrapper">
        <h1>主页面Home</h1>
        <div class="p-5 m-5 border">
            <button v-permission="'guest'" class="btn">权限按钮-guest</button>
            <button v-permission="'admin'" class="btn">管理员权限</button>
        </div>
        <div class="p-5 m-5 border">
            <label for="chk1"><input type="checkbox" name="rlog" id="chk1" v-model="app1store.logRouterFlag" @change="onToggleLog1">路由日志记录</label>
            <button @click="queryLogs" class="btn">查询日志</button>
            <button @click="clearLogs" class="btn">清除日志</button>
        </div>
        <div class="p-5 m-5 border">
            <label for="chk2"><input type="checkbox" name="rclick" id="chk2" v-model="app1store.logClickFlag">点击事件追踪</label>
            <button @click="queryEvtLogs" class="btn">查询日志</button>
            <button @click="clearEvtLogs" class="btn">清除日志</button>
            <div class="p-5 m-5 border inline">
                <span>点击事件测试区域</span>
                <input type="text"v-track.input="{ event: 'search-input'}" v-model="inputVal1"/>
                <button v-track.click="'primary-button-click'" @click="printval">主要按钮</button>
            </div>
        </div>
        <div class="border p-5 m-5">
            <ol>
                <li v-for="(item,k) in logList" :key="k">{{ item }}</li>
            </ol>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useAppStore } from '../store/useCommonStore';

defineOptions({ name: 'HomePage' });
// 日志数据列表以及相关操作
const logList = ref([]);
let inputVal1 = ref('')
const queryLogs = ()=>{
    logList.value = JSON.parse(localStorage.getItem('userLogs') || '[]');
    console.log('===========queryLogs', logList)
}
const clearLogs = ()=>{
    localStorage.removeItem('userLogs');
    logList.value = []
}

const queryEvtLogs = ()=>{
    logList.value = JSON.parse(localStorage.getItem('evtLogs') || '[]');
    // console.log('===========queryevtttLogs', logList)
}
const clearEvtLogs = ()=>{
    localStorage.removeItem('evtLogs');
    logList.value = []
}
const app1store = useAppStore();
// console.log('home_logRouterFlag_: ', app1store.logRouterFlag)
const onToggleLog1 = ()=>{
    console.log('flaggg_: ', app1store.logRouterFlag ? '打开路由日志记录' : '关闭' )
}

const printval = ()=>{
    console.log('printval_; ', inputVal1 )
}
// import { onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'
// onMounted(() => console.log('mounted'))
// onUnmounted(() => console.log('unmounted'))
// onActivated(() => console.log('activated'))
// onDeactivated(() => console.log('deactivated'))
</script>