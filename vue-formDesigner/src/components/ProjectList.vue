<template>
    <div class="table-container">
        <ul>
            <li v-for="(item,k) in proList" :key="k">
                <button @click="handleItemClick(item)">{{ item.title }}</button>
            </li>
        </ul>
        <div class="border p-5">
            <p>vue3新特性【watch，watchEffect】测试区域</p>
            <p>count: {{ count }}
                <button @click="handleAddClick" class="m-5">add</button>
                <span>{{ showCountTxt }}</span>
            </p>
            <p>dataObject: {{ dataObj }}
                <button @click="handleChangeClick" class="m-5">age+1</button>
                <button @click="handlePrintClick" class="m-5">print</button>
                <span>{{ showAgeTxt }}</span>
            </p>
        </div>
    </div>
</template>
<script setup>
import { reactive, ref, watch, watchEffect } from 'vue';
import router from '../router';

const proList = ref([
    {id:1, title: 'pro1'},
    {id:2, title: 'pro2'},
    {id:3, title: 'pro3'},
    {id:4, title: 'pro4'},
])
const handleItemClick = (it)=>{
    const cid = it.id;
    // console.log( { cid })
    router.push(`/projectDetail/${cid}`)
}

const count = ref(0);
const handleAddClick = ()=>{
    count.value++;
}
const showCountTxt = ref('')
// 监听count变化
watch(count, (newVal, oldVal)=>{
    // console.log({newVal, oldVal})
    showCountTxt.value = `new: ${newVal}, old: ${oldVal}`
})
const dataObj = reactive({
    name:'yy3',
    age:33,
    list:[1,2,31]
})
const handleChangeClick = ()=>{
    dataObj.age++;
}
const handlePrintClick = ()=>{
    console.log( 'print_dataObj_: ',  dataObj )
}
const showAgeTxt = ref('');
watch(()=> dataObj.age, (newVal, oldVal)=>{
    // console.log('watch_dataObj_: ', {newVal, oldVal})
    showAgeTxt.value = `newage: ${newVal}, oldage: ${oldVal}`
})
watchEffect(()=>{
    console.log(`watchEffect, _cnt: ${count.value}, dataobj.age: ${dataObj.age}`)
})

</script>