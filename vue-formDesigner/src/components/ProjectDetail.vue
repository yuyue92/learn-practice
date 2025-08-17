<template>
    <div class="pro_detail">
        <h2>detail, id:{{ props.id }}</h2>
        <p>
            <button @click="back2List">返回列表</button>
        </p>
    </div>
</template>

<script setup>
import router from '../router';

const props = defineProps({
    id:{
        type: String,
        required: true
    }
})
const back2List = ()=> {
    router.push('/projectList')
}
</script>