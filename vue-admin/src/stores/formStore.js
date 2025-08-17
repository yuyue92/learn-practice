import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFormStore = defineStore('formStore', () => {
  const formFields = ref([])
  const selectedIndex = ref(-1)

  const selectedField = computed(() =>
    selectedIndex.value >= 0 ? formFields.value[selectedIndex.value] : null
  )

  function addField(field) {
    formFields.value.push({ ...field, id: Date.now() })
  }

  function setSelectedIndex(index) {
    selectedIndex.value = index
  }

  function updateSelectedField(payload) {
    if (selectedIndex.value >= 0) {
      formFields.value[selectedIndex.value] = {
        ...formFields.value[selectedIndex.value],
        ...payload
      }
    }
  }

  return {
    formFields,
    selectedIndex,
    selectedField,
    addField,
    setSelectedIndex,
    updateSelectedField
  }
})