<script setup>
import cameraDisabledSVG from '@/assets/icon/camera-disabled.svg'
import DeviceTestSelect from "./DeviceTestSelect.vue";
import { ref } from "vue";

const props = defineProps({
  cameraDevices: {
    type: Array,
    default: () => ([])
  },
  cameraVideoStreamRef: {
    type: Object,
    default: () => ref(null)
  },
  isCameraAccessible: {
    type: Boolean,
    default: false
  },
  currentCameraDeviceID: {
    type: String,
    default: ''
  },
  setCameraDevice: {
    type: Function,
    default: () => {
    }
  }
})

const emit = defineEmits(['updateCameraRef'])

const setCameraRef = (el) => {
  emit('updateCameraRef', el);
};
</script>

<template>

  <div class="camera-test-container">
    <div class="camera-test-text">
      摄像头
    </div>
    <DeviceTestSelect
      :currentDeviceID="props.currentCameraDeviceID"
      :devices="props.cameraDevices"
      :isDeviceAccessible="props.isCameraAccessible"
      @change="setCameraDevice"
    />
    <div class="camera-test-wrapper">
      <div
        :ref="setCameraRef"
        class="camera-box"
      ></div>
      <template v-if="!isCameraAccessible">
        <img :src="cameraDisabledSVG" alt="">
        <span>
        请开启浏览器的摄像头使用权限
      </span>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.camera-test-text {
  color: #7a7b7c;
  padding-bottom: 8px;
}

.camera-test-wrapper {
  height: 240px;
  width: 100%;
  position: relative;
  border-radius: 6px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: rgba(255, 255, 255, 0.5);
}

.camera-box {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  > div {
    background-color: #fff !important;

    > video {
      border-radius: 6px;
    }
  }
}
</style>
