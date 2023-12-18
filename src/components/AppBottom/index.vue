<script>
export default {
  name: "AppBottom",
  inheritAttrs: false,
}
</script>

<script setup>
import { onUnmounted, ref } from "vue";

const props = defineProps({
  modelValue: Boolean
});

const emits = defineEmits(['update:modelValue'])
const observer = ref(null);

const onIntersect = (isIntersecting, entries, observerInstance) => {
  observer.value = observerInstance;

  if (isIntersecting) {
    console.log('到底了！')
  }
  emits('update:modelValue', isIntersecting);
}

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
})

</script>

<template>
  <div
    v-intersect="onIntersect"
    class="mx-auto"
  />
</template>
