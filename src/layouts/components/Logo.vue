<script setup>
import logoDark from '@/assets/icon/logo-dark.png';
import logoWhite from '@/assets/icon/logo-white.png';
import logo from '@/assets/icon/icon.png';
import { useRouter } from "vue-router";
import { useTheme } from "vuetify";
import { ref, watchEffect } from "vue";

const theme = useTheme();
const router = useRouter();
const imageSrc = ref(logo);
const imageWidth = ref("24"); // 初始化图片宽度


const props = defineProps({
  rail: {
    type: Boolean,
    default: false
  }
})

watchEffect(() => {
  imageSrc.value = props.rail ?
    logo :
    theme.global.current.value.dark ? logoDark : logoWhite;
  imageWidth.value = props.rail ? "24" : "148";
});

const handleHome = () => {
  router.push({ path: '/' })
}
</script>


<template>
  <div class="logo-container">
    <img
      :src="imageSrc"
      :width="imageWidth"
      alt="GoalGo Logo"
      class="goal-go-logo"
      @click="handleHome"
    />
  </div>

</template>

<style lang="scss" scoped>
.logo-container {
  cursor: pointer;
  line-height: 64px;
  height: 64px;
  width: 100%;
  display: flex;
  align-items: center;
}
</style>
