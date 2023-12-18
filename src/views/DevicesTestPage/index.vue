<script setup>
import AgoraRTC from "agora-rtc-sdk-ng"
import { useRoute, useRouter } from "vue-router";
import { onMounted, reactive, ref, watch } from "vue";
import { filter, forEach, get, groupBy } from "lodash-es";
import { CameraTest, MicrophoneTest, SpeakerTest } from './components'
import useAgoraRTC from "./components/AgoraServicesContext";

const router = useRouter()
const currentRoute = useRoute()

const deviceCollections = reactive({
  cameraDevices: [],
  microphoneDevices: [],
  speakerDevices: []
})


const {
  videoElementRef,
  microphoneVolume,
  isCameraAccessible,
  isMicrophoneAccessible,
  isSpeakerAccessible,
} = useAgoraRTC()

const speakerDeviceId = ref('')
const cameraDeviceId = ref('')
const microphoneDeviceId = ref('')


const setSpeakerDevice = item => {
  speakerDeviceId.value = item
}
const setCameraDevice = item => {
  cameraDeviceId.value = item
}
const setMicrophoneDevice = item => {
  microphoneDeviceId.value = item
}


const deviceMap = {
  audioinput: 'microphoneDevices',
  videoinput: 'cameraDevices',
  audiooutput: 'speakerDevices'
};

const groupDevicesByKind = devices => groupBy(devices, 'kind');
const initDevices = async () => {
  try {
    const devices = await AgoraRTC.getDevices();
    const collections = groupDevicesByKind(devices);
    forEach(deviceMap, (value, key) => {
      deviceCollections[value] = filter(
        get(collections, key, []),
        item => !!item.deviceId
      );
    });

    console.log(deviceCollections, 'deviceCollections..')
  } catch (e) {
    console.log(e, 'getDevices 发生错误')
  }

};

watch(() => deviceCollections.speakerDevices, newSpeakerDevices => {
  if (newSpeakerDevices.length > 0) {
    if (!speakerDeviceId.value) {
      speakerDeviceId.value = newSpeakerDevices[0].deviceId;
    }
    isSpeakerAccessible.value = true;
  }
});

watch(() => deviceCollections.cameraDevices, newCameraDevices => {
  if (newCameraDevices.length > 0) {
    if (!cameraDeviceId.value) {
      cameraDeviceId.value = newCameraDevices[0].deviceId;
    }
    isCameraAccessible.value = true;
  }
});

watch(() => deviceCollections.microphoneDevices, newMicrophoneDevices => {
  if (newMicrophoneDevices.length > 0) {
    if (!microphoneDeviceId.value) {
      microphoneDeviceId.value = newMicrophoneDevices[0].deviceId;
    }
    isMicrophoneAccessible.value = true;
  }
});


const handleJoinRoom = () => {
  // updateCameraId
  // updateMicrophoneId

  router.push({
    name: 'ClassRoom',
    params: {
      ...currentRoute.params
    }
  })
}

const handleUpdateCameraRef = el => {
  videoElementRef.value = el;
}

onMounted(() => {

  initDevices()
})

</script>

<template>
  <v-app id="devices-test-page">
    <v-main class="devices-test-container">
      <v-container
        class="d-flex align-center justify-center h-100"
        fluid
      >
        <v-card
          width="776"
        >
          <v-card-title>
            设备检测
          </v-card-title>
          <v-card-item>
            <v-row>
              <v-col>
                <CameraTest
                  :cameraDevices='deviceCollections.cameraDevices'
                  :cameraVideoStreamRef="videoElementRef"
                  :currentCameraDeviceID="cameraDeviceId"
                  :isCameraAccessible="isCameraAccessible"
                  :setCameraDevice="setCameraDevice"
                  @updateCameraRef="handleUpdateCameraRef"
                />
              </v-col>
              <v-col>
                <SpeakerTest
                  :currentSpeakerDeviceID="speakerDeviceId"
                  :isSpeakerAccessible="isSpeakerAccessible"
                  :setSpeakerDevice="setSpeakerDevice"
                  :speakerDevices="deviceCollections.speakerDevices"
                />
                <MicrophoneTest
                  :currentMicrophoneDeviceID="microphoneDeviceId"
                  :isMicrophoneAccessible="isMicrophoneAccessible"
                  :microphoneDevices="deviceCollections.microphoneDevices"
                  :microphoneVolume="microphoneVolume"
                  :setMicrophoneDevice="setMicrophoneDevice"
                />

                <div class="devices-test-options">
                  <div class="devices-test-options-text">
                    加入房间选项
                  </div>
                  <div class="d-flex">
                    <v-checkbox
                      density="compact"
                      label="开启麦克风"
                    >
                    </v-checkbox>
                    <v-checkbox
                      density="compact"
                      label="开启摄像头"
                    >
                    </v-checkbox>
                    <v-checkbox
                      density="compact"
                      label="镜像"
                    >
                    </v-checkbox>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-item>

          <v-card-actions>
            <v-checkbox
              hide-details
              label="不再显示"
            >
            </v-checkbox>
            <v-spacer></v-spacer>
            <v-btn
              class="text-none"
              color="primary"
              variant="tonal"
              @click="handleJoinRoom"
            >
              加入房间
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
.devices-test-container {
  background: rgb(242, 243, 245);
}


.devices-test-options-text {
  color: #7a7b7c;
  padding-bottom: 8px;
}
</style>
