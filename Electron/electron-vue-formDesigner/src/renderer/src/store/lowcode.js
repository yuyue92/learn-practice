import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { getComponentConfig } from '../utils/componentRegistry'

export const useLowCodeStore = defineStore('lowcode', () => {
  // 当前选中的组件
  const selectedComponent = reactive({
    id: null,
    type: null,
    props: null
  })

  // 画布上的组件实例
  const canvasComponents = reactive([])

  // 添加组件到画布
  function addComponentToCanvas(componentType) {
    const componentConfig = getComponentConfig(componentType)
    const newComponent = {
      id: 'comp_' + Date.now(),
      type: componentType,
      props: JSON.parse(JSON.stringify(componentConfig.props))
    }
    canvasComponents.push(newComponent)
    selectComponent(newComponent.id)
  }

  // 选择组件
  function selectComponent(componentId) {
    const component = canvasComponents.find(c => c.id === componentId)
    if (component) {
      selectedComponent.id = component.id
      selectedComponent.type = component.type
      selectedComponent.props = component.props
    }
  }

  // 更新组件属性
  function updateComponentProps(componentId, props) {
    const component = canvasComponents.find(c => c.id === componentId)
    if (component) {
      component.props = props
    }
  }

  return {
    selectedComponent,
    canvasComponents,
    addComponentToCanvas,
    selectComponent,
    updateComponentProps
  }
})