<template>
  <div class="ablout">
    <h2>About</h2>
    <!-- <p v-for="i in 20" key="i">关于我们的产品,</p> -->
     <p @click="addOne">count: {{ count }}</p>
     <p @click="changeMsg">msg: {{ msg }}, lens: {{ msgLen }}</p>
     <p>myData数据展示: {{ myData }}</p>
     <button @click="clickHandler">修改1</button>
     <hr/>
     <p>myData2数据展示: {{ myData2 }}</p>
     <button @click="clickHandler2">修改2</button>

  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, readonly, ref, shallowReactive, watch, watchEffect } from 'vue';
//ref 适用于基本类型值【非对象类型值】
const count = ref( 1);
const addOne = () => {
  count.value +=2
}
// 对count进行监听
watch(count, (newval, oldval)=>{
  console.log('对count进行监听: ', newval, oldval)
})
//readonly 只读属性[针对对象]，无法修改
const msgObj = readonly({
  name:'msggg'
});
console.log('msgObj_: ', msgObj)
let msg = ref('messageeee');
const changeMsg = () => {
  msg.value +='!'
}
const msgLen = computed(() => msg.value.length);
const myData = reactive({
  name: 'yuyue3',
  age: 33,
  list: [1,2,3]
})
const clickHandler = ()=> {
  myData.age++;
}
//说明：侦听单一数据使用watch，如果一段逻辑，多个响应式数据，可以使用watchEffect
watchEffect(()=>{
  console.log(`count的值：${count.value}, age的值: ${myData.age}`)
})
// shallowReactive，浅层响应式处理，只针对第一层，下面的数组改动不更新界面
const myData2 = shallowReactive({
  name: 'aasa',
  age: 44,
  list: [1,2,3]
})
const clickHandler2 = ()=> {
  myData2.list.push(23)
  console.log('myData2: ', myData2)
}
</script>

<style scoped>
.ablout {
  padding: 20px;
}
.ablout p {
  margin: 20px;
}
</style>