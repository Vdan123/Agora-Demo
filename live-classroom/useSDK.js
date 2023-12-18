import { onMounted, ref } from 'vue';

export const useEduSdk = () => {
  const sdk = ref({});
  const ready = ref(false);

  onMounted(() => {
    if (window.AgoraEduSDK) {
      sdk.value = window.AgoraEduSDK;
      ready.value = true
    }
  });

  return {
    sdk,
    ready
  }
};
