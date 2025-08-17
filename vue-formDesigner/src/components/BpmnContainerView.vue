<template>
    <div>
      <h2>审批流程演示</h2>
      <!-- <BpmnViewer :xml="xml" /> -->
      <BpmnViewer
            :xml="xml"
            :activeNodeId="current"
            :completedNodeIds="done"
            :completedFlowIds="doneLines"
        />
      <ApprovalPanel @approve="handleApproval" />
    </div>
  </template>
  
<script setup>
    import { ref } from 'vue';
    import BpmnViewer from './BpmnViewer.vue';
    import ApprovalPanel from './ApprovalPanel.vue';
    import { mockBpmnXml } from '../api/processData';
  
    const xml = ref(mockBpmnXml);
    const current = ref('UserTask_2');
    const done = ref(['StartEvent_1', 'UserTask_1']);
    const doneLines = ref(['Flow_1', 'Flow_2']);
  
    function handleApproval({ node, result }) {
        console.log(`${node.name} 审批结果: ${result ? '同意' : '拒绝'}`);
    }
</script>
  