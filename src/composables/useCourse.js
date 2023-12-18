import { ref } from "vue";


export const useCourse = () => {
  const tags = ref(["思维拓展", "语言拓展", "其他"])
  const chipStates = ref({
    close: {
      color: 'default',
      msg: '已关闭'
    },
    ready: {
      color: '#4D88FF',
      msg: '待开始'
    },
    start: {
      color: '#F5A900',
      msg: '进行中'
    },
    finish: {
      color: 'default',
      msg: '已结束'
    },
    delay: {
      color: '#FF5F5F',
      msg: '已拖堂'
    }
  })
  return {
    tags,
    chipStates
  }
}
