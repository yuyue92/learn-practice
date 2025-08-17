<template>
    <h1>404</h1>
    <p>你所寻找的页面不存在！
        <button @click="backToHome">回到首页</button>
    </p>
</template>
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const backToHome = ()=>{
    console.log('-----------backToHome')
    router.push('/')
}
</script>