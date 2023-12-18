<script>
export default {
  name: 'AppSnackbar',
  inheritAttrs: false
}
</script>

<script setup>
import { useSnackbar } from '@/store/snackbar'
import { watch } from "vue";
import { storeToRefs } from "pinia";


const timeout = 5 * 1000;
// const timeout = -1

const snackbarStore = useSnackbar();
const { visible, color, message } = storeToRefs(snackbarStore);

const iconMapping = {
  'success': 'mdi-check-circle',
  'error': 'mdi-close-circle',
  'warning': 'mdi-alert',
  'info': 'mdi-information'
}


watch(() => visible.value, state => {
  if (!state) {
    snackbarStore.hideSnackbar()
  }
})
</script>

<template>
  <v-snackbar
    v-model="visible"
    :absolute="true"
    :color="color"
    :timeout="timeout"
    elevation="24"
    height="54"
    location="top center"
    rounded="lg"
  >
    <div class="d-flex align-center">
      <v-icon>
        {{ iconMapping[color] }}
      </v-icon>
      <span class="goal-go-text-black d-inline-block ml-2">
      {{ message }}
    </span>
    </div>
  </v-snackbar>
</template>


<style lang="scss" scoped>
@import "@/styles/color.scss";

.goal-go-text-black {
  //color: $text-black;
  font-weight: 700;
}
</style>
