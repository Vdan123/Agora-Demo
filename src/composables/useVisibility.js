// 在 composable 文件夹中创建一个新文件，例如 useVisibility.js
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

export function useVisibility () {
  const componentKey = ref(null);
  const isChromeTabActive = ref(false);

  const forceRerenderComponent = () => {
    componentKey.value = uuidv4();
  };

  const handleVisibilityChange = () => {
    isChromeTabActive.value = !document.hidden;
    if (isChromeTabActive.value) {
      console.log('激活了');
      forceRerenderComponent();
    }
  };

  const addVisibleListener = () => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  };

  const removeVisibleListener = () => {
    console.log('销毁了')
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };

  return { componentKey, forceRerenderComponent, addVisibleListener, removeVisibleListener, isChromeTabActive };
}
