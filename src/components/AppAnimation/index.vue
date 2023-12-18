<script setup>
import lottie from "lottie-web";
import { onMounted, onUnmounted, ref } from "vue";

const lottieAnimation = ref(null);
const props = defineProps({
  format: {
    type: String,
    default: "empty",
  },
  style: {
    type: Object,
    default: () => ({
      width: '300px',
      height: '300px'
    }),
  },
})

const lottieMap = {
  empty: "/assets/animation/teacher-is-solving-mathematical-sums-on-blackboard.json",
  error: "/assets/animation/404.json",
  login: '/assets/animation/young-female-teacher-writes-mathematical-equation-on-blackboard.json',
  boy: '/assets/animation/young-boy-is-exploring-the-virtual-reality-world.json',
  box: '/assets/animation/box.json',
}

const refs = ref(null);

onMounted(() => {
  lottieAnimation.value = lottie.loadAnimation({
    container: refs.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: lottieMap[props.format]
  });
})

onUnmounted(() => {
  lottieAnimation.value.destroy();
})
</script>


<template>
  <div :style="props.style">
    <div ref="refs"></div>
  </div>
</template>
