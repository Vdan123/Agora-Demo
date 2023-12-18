import { nextTick, onMounted, onUnmounted, ref } from "vue";
import AgoraRTC from "agora-rtc-sdk-ng"

// 需要后台存储用户的设备状态

export default function useAgoraRTC () {
  const videoElementRef = ref(null)
  const videoTrack = ref(null);
  const audioTrack = ref(null);

  const isCameraAccessible = ref(false)
  const isMicrophoneAccessible = ref(false)
  const isSpeakerAccessible = ref(false)

  const microphoneVolume = ref(0)

  const ticket = setInterval(() => {
    if (audioTrack.value) {
      const volume = audioTrack.value.getVolumeLevel()
      microphoneVolume.value = Math.min(volume + Math.random() * 0.05, 1)
    }
  }, 50)


  onMounted(() => {
    nextTick().then(
      () => {
        AgoraRTC.createCameraVideoTrack()
          .then(cameraVideoTrack => {
            videoTrack.value = cameraVideoTrack;
            cameraVideoTrack.play(videoElementRef.value);
          })
          .catch(err => {
            console.log(err);
            isCameraAccessible.value = false
          });

        AgoraRTC.createMicrophoneAudioTrack()
          .then(aTrack => {
            audioTrack.value = aTrack;
            console.log(aTrack.getVolumeLevel(), 'aTrack..')
          })
          .catch(err => {
            console.log(err);
          });
      }
    )
  })

  onUnmounted(() => {
    clearInterval(ticket)
    videoTrack.value?.close()
    audioTrack.value?.close()
  })


  return {
    videoTrack,
    audioTrack,
    microphoneVolume,
    videoElementRef,
    isCameraAccessible,
    isMicrophoneAccessible,
    isSpeakerAccessible,
  }
}
