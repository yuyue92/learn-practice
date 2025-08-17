<!-- components/ModalDialog.vue -->
<template>
    <div class="overlay" @click.self="close">
        <div class="modal">
        <button class="close-btn" @click="close">✕</button>
            <template v-if="loading">
                <ModalSkeleton />
            </template>
            <template v-else>
                <div class="border p-5 m-5">
                    <div class="form-group">
                        <label>ID：</label>
                        <span>{{ localForm.id }}</span>
                    </div>
                    <div class="form-group">
                        <label>姓名：</label>
                        <input v-model="localForm.name" required />
                    </div>
                    <div class="form-group">
                        <label>邮箱：</label>
                        <input v-model="localForm.email"/>
                    </div>
                    <div class="form-group">
                        <label>年龄：</label>
                        <input v-model="localForm.age" type="number" />
                    </div>
                    <div class="actions">
                        <button @click="handleSave">保存</button>
                        <button @click="close">取消</button>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, reactive, watch } from 'vue'
import ModalSkeleton from './SkeletonItem.vue'
  
const props = defineProps({
    show: Boolean,
    form: Object,             // 传入的初始表单数据
    onClose: Function,        // 关闭弹框
    onSave: Function          // 保存时的回调
})
  
const localForm = reactive({
    id: '',
    name: '',
    email: '',
    age: '',
});
// 同步外部传入的 form 数据到本地副本
watch(()=> props.form, (val) => {
    Object.assign(localForm, val)
}, { immediate: true })

const loading = ref(true)
  
const close = () => {
    props.onClose?.()
}
const handleSave = () =>{
    props.onSave?.({ ...localForm })  // 回传副本
    close()
}
  
onMounted(() => {
// 模拟 API 请求
    setTimeout(() => {
        console.log('looooooo')
        loading.value = false
    }, 500)
})
</script>
  
  <style scoped>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .modal {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    width: 400px;
    max-width: 90%;
    position: relative;
  }
  .close-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.8rem;
    border: none;
    background: transparent;
    font-size: 1.2rem;
    cursor: pointer;
  }
  .form-group {
  margin-bottom: 1rem;
}
input {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
  </style>
  