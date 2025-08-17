<template>
    <div class="process-designer">
      <div ref="container" class="bpmn-container"></div>
      <div ref="properties" class="properties-panel"></div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import BpmnModeler from 'bpmn-js/lib/Modeler'
  import 'bpmn-js/dist/assets/diagram-js.css'
  import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
  
  export default {
    props: ['xml'],
    setup(props, { emit }) {
      const container = ref(null)
      const properties = ref(null)
      let bpmnModeler = null
  
      onMounted(() => {
        bpmnModeler = new BpmnModeler({
          container: container.value,
          propertiesPanel: {
            parent: properties.value
          }
        })
  
        const loadDiagram = props.xml ? 
          bpmnModeler.importXML(props.xml) : 
          bpmnModeler.createDiagram()
  
        loadDiagram.then(() => {
          bpmnModeler.on('commandStack.changed', async () => {
            const { xml } = await bpmnModeler.saveXML({ format: true })
            emit('update:xml', xml)
          })
        })
      })
  
      return { container, properties }
    }
  }
  </script>
  
  <style scoped>
  .process-designer {
    display: flex;
    height: 600px;
  }
  .bpmn-container {
    flex: 1;
    border: 1px solid #ccc;
  }
  .properties-panel {
    width: 300px;
    border-left: 1px solid #ccc;
    overflow: auto;
  }
  </style>