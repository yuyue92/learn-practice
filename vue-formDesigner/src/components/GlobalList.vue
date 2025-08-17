<template>
    <div class="global-list">
        <!-- Header 插槽 -->
         <div class="list-header" v-if="$slots.header">
            <slot name="header"></slot>
         </div>
         <!-- 列表内容 -->
         <div class="list-content">
            <li v-for="(item, idx) in items" :key="idx" class="list-item">
                <!-- 默认插槽，传递当前项和索引 -->
                 <slot :unit="item" :index="idx">{{ item }}</slot>
            </li>
         </div>

         <!-- Footer 插槽 -->
         <div class="list-footer" v-if="$slots.footer">
            <slot name="footer"></slot>
         </div>
    </div>
</template>
<script setup>
const props = defineProps({
    // 列表数据
    items: {
        type: Array,
        default: ()=>[]
    }
})
</script>

<style scoped>
.global-list {
  width: 100%;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
}

.list-header {
    padding: 5px 16px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #eee;
}

.list-content {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 350px;
    overflow-y: auto;
}

.list-item {
  padding: 3px 16px;
  border-bottom: 1px solid #eee;
}

.list-item:last-child {
  border-bottom: none;
}

.list-footer {
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-top: 1px solid #eee;
}
</style>