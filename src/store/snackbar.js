import { defineStore } from "pinia";
import { nextTick, ref } from "vue";

const MAX_TIMER = 5000;

export const useSnackbar = defineStore("snackbar", () => {
// 使用ref来定义状态
  const visible = ref(false);
  const message = ref('');
  const color = ref('');

  // 重置状态的函数
  function resetState () {
    visible.value = false;
    message.value = '';
    color.value = '';
  }

// 显示Snackbar的函数，此处不使用lodash的debounce，而是让Vue来控制更新频率
  let timeout;

  function showSnackbar ({ message: newMessage, color: newColor = 'info' }) {

    visible.value = true;
    message.value = newMessage;
    color.value = newColor;

    // 如果已经有计时器在运行，则先清除
    clearTimeout(timeout);
    // 设置一个新的计时器来隐藏snackbar
    timeout = setTimeout(() => {
      resetState();
    }, MAX_TIMER);
  }

// 隐藏Snackbar的函数
  async function hideSnackbar () {
    await nextTick(() => {
      resetState();
    });
  }

  return {
    visible,
    message,
    color,
    showSnackbar,
    hideSnackbar
  }
})
