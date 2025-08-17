<template>
    <div>
      <h3>当前审批节点：{{ current.name }}</h3>
      <button @click="approve(true)">同意</button>
      <button @click="approve(false)">拒绝</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const emit = defineEmits(['approve']);
  
  const nodes = [
    { id: 'UserTask_1', name: '主管审批' },
    { id: 'UserTask_2', name: '经理审批' }
  ];
  const index = ref(0);
  const current = ref(nodes[index.value]);
  
  function approve(result) {
    emit('approve', { node: current.value, result });
  
    if (result && index.value < nodes.length - 1) {
      index.value++;
      current.value = nodes[index.value];
    } else {
      current.value = { name: '流程结束' };
    }
  }
  </script>
  