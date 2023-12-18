<script setup>
import { onBeforeUnmount, onMounted, ref, watch, watchEffect } from "vue";
import { getSession, removeSession } from "@/utils/sessionStorage";
import { getAssetURL, ListenerCallback } from './tools'
import { useEduSdk } from "./useSDK";
import { useClassroomWidgets } from "./useWidgets";
import lottie from "lottie-web";


const assetURLs = {
  // virtual background assets
  virtualBackground1: 'effect/default1.jpg',
  virtualBackground2: 'effect/default2.jpg',
  virtualBackground3: 'effect/default3.jpg',
  virtualBackground4: 'effect/default4.jpg',
  virtualBackground5: 'effect/default5.jpg',
  virtualBackground6: 'effect/default6.jpg',
  virtualBackground7: 'effect/default7.jpg',
  virtualBackground8: 'effect/default8.mp4',
  virtualBackground9: 'effect/default9.mp4',
};
const virtualBackgroundImages = [
  getAssetURL(assetURLs.virtualBackground1),
  getAssetURL(assetURLs.virtualBackground2),
  getAssetURL(assetURLs.virtualBackground3),
  getAssetURL(assetURLs.virtualBackground4),
  getAssetURL(assetURLs.virtualBackground5),
  getAssetURL(assetURLs.virtualBackground6),
  getAssetURL(assetURLs.virtualBackground7),
];

const appRef = ref(null)
const lottieAnimation = ref(null)
const isLoading = ref(true)
const { sdk, ready: sdkReady } = useEduSdk()
const { widgets, ready: widgetsReady } = useClassroomWidgets([
  'AgoraCountdown',
  'AgoraHXChatWidget',
  'AgoraPolling',
  'AgoraSelector',
  'FcrBoardWidget',
  'FcrStreamMediaPlayerWidget',
  'FcrWatermarkWidget',
  'FcrWebviewWidget',
])

const classroomInfo = getSession('classroomInfo')

onMounted(() => {
  lottieAnimation.value = lottie.loadAnimation({
    container: document.getElementById('loading-container'), // 对应容器元素
    renderer: 'svg',
    loop: true, // 是否循环播放
    autoplay: true, // 是否自动播放
    path: getAssetURL('/animation/Rocket.json') // Lottie 动画文件的路径
  });
})

watchEffect(() => {
  if (sdkReady.value && widgetsReady.value) {
    console.log(window, 'ooo!!oo')
    sdk.value.config({
      appId: '6dc78aac282541d18dc98bba347d260e',
      region: 'CN'
    })
    sdk.value.launch(appRef.value,
      {
        ...classroomInfo,
        pretest: true,
        language: 'zh', // 课堂界面的语言。如需界面为英文，设为 'en' 即可。
        recordUrl: '',
        courseWareList: [],
        virtualBackgroundImages, // 虚拟背景图片资源列表
        webrtcExtensionBaseUrl: 'https://solutions-apaas.agora.io/static',
        userFlexProperties: {},
        uiMode: 'light',
        platform: 'PC',
        latencyLevel: 2,
        widgets: widgets.value,
        listener: ListenerCallback,
      },
      () => {
        console.log('!!!!---launch success----!!!')
      },
      Error => {
        console.error(Error)
      }
    )
    isLoading.value = false; // 隐藏 Loading 动画
  }
})

watch(isLoading, loading => {

  if (!loading) {
    lottieAnimation.value.destroy()
  }
})

onBeforeUnmount(() => {
  removeSession('classroomInfo')
})

</script>

<template>
  <div v-if="isLoading" id="loading">
    <div id="loading-container" class="loading-animation"></div>
  </div>
  <div ref="appRef" :class="{
    'fcr-w-screen': sdkReady.value,
    'fcr-h-screen': sdkReady.value,
  }">
  </div>
</template>


<style lang="scss" scoped>
#loading {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.loading-animation {
  width: 20vw; /* 或您希望的具体尺寸 */
  height: 20vh; /* 保持宽高比例 */
  margin: auto; /* 居中 */
}
</style>
