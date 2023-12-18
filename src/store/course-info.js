import { defineStore } from "pinia";
import { ref } from "vue";

export const useCourseInfo = defineStore('confirmModal', () => {
  const details = ref({})

  const setCourseInfo = info => {
    details.value = info;
  }
  const clearCourseInfo = () => {
    details.value = {};
  }

  return {
    details,
    setCourseInfo,
    clearCourseInfo
  }
})
