<script setup>
import { onMounted, ref, watch } from 'vue';
import BpmnViewer from 'bpmn-js';

const props = defineProps({
  xml: String,
  activeNodeId: String,
  completedNodeIds: Array,
  completedFlowIds: Array,
});
const canvasRef = ref(null);
let viewer;

async function renderDiagram(xml) {
  try {
    await viewer.importXML(xml);
    const canvas = viewer.get('canvas');

    // 高亮完成节点
    props.completedNodeIds?.forEach(id => {
      canvas.addMarker(id, 'highlight-completed');
    });

    // 高亮完成线条
    props.completedFlowIds?.forEach(id => {
      canvas.addMarker(id, 'highlight-completed');
    });

    // 当前节点高亮
    if (props.activeNodeId) {
      canvas.addMarker(props.activeNodeId, 'highlight-current');
    }
  } catch (err) {
    console.error('加载 BPMN 失败：', err);
  }
}

onMounted(() => {
  viewer = new BpmnViewer({ container: canvasRef.value });
  if (props.xml) renderDiagram(props.xml);
});

watch(() => props.xml, renderDiagram);
</script>

<template>
  <div ref="canvasRef" class="bpmn-container" />
</template>

<style>
.bpmn-container {
  width: 100%;
  height: 400px;
  border: 1px solid #ccc;
}

.highlight-completed {
  stroke: #52c41a !important;
  stroke-width: 1 !important;
  fill: #d9f7be !important;
}

.highlight-current {
  stroke: #1890ff !important;
  stroke-width: 1 !important;
  fill: #e6f7ff !important;
}
</style>
