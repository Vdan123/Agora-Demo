<script setup>
import DeviceTestSelect from "./DeviceTestSelect.vue";
import { computed } from "vue";
import { isNumber } from "lodash-es";

const props = defineProps([
  'microphoneDevices',
  'isMicrophoneAccessible',
  'currentMicrophoneDeviceID',
  'setMicrophoneDevice',
  'microphoneVolume'
])

const volume = computed(() => {
  return isNumber(props.microphoneVolume) ? props.microphoneVolume * 100 : 0
})
</script>


<template>
  <div class="microphone-test-container">
    <div class="microphone-test-text">
      麦克风
    </div>
    <DeviceTestSelect
      :currentDeviceID="props.currentMicrophoneDeviceID"
      :devices="props.microphoneDevices"
      :isDeviceAccessible="props.isMicrophoneAccessible"
      @change="setMicrophoneDevice"
    />

    <v-progress-linear
      :height="8"
      :model-value="volume"
      class="mt-4 mb-12"
      color="primary"
    />
  </div>
</template>


<style lang="scss" scoped>
.microphone-test-text {
  color: #7a7b7c;
  padding-bottom: 8px;
}
</style>
