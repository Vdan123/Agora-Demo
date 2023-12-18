<script setup>
import DeviceTestSelect from "./DeviceTestSelect.vue";

const props = defineProps([
  'speakerDevices',
  'setSpeakerDevice',
  'currentSpeakerDeviceID',
  'isSpeakerAccessible'
])

</script>

<template>
  <div class="speaker-test-container">
    <div class="speaker-test-text">
      扬声器
    </div>
    <DeviceTestSelect
      :currentDeviceID="currentSpeakerDeviceID"
      :devices="props.speakerDevices"
      :isDeviceAccessible="isSpeakerAccessible"
      @change="setSpeakerDevice"
    />
  </div>
</template>


<style lang="scss" scoped>
.speaker-test-text {
  color: #7a7b7c;
  padding-bottom: 8px;
}
</style>
