<script>
export default {
  name: 'AppBar',
  inheritAttrs: false
}
</script>

<script setup>
import { useRoute } from 'vue-router'
import { ref, watchEffect } from "vue";

const route = useRoute()


const title = ref('')
watchEffect(() => {
  title.value = route.meta.title || ''
})

// const props = defineProps({
//   isSearch: {
//     type: Boolean,
//     default: false
//   },
//   searchPlaceholder: {
//     type: String,
//     default: '搜索'
//   }
// })
// const onClick = () => {
// }

</script>

<template>
  <v-app-bar
    class="goal-go-header"
    color="#010101"
    scroll-behavior="elevate"
  >

    <v-app-bar-title class="font-weight-bold">
      {{ title || '完美课程' }}
    </v-app-bar-title>
    <!--    <template v-slot:append>-->
    <!--      <v-text-field-->
    <!--        :hide-details="true"-->
    <!--        :placeholder="props.searchPlaceholder"-->
    <!--        class="app-bar-search"-->
    <!--        prepend-inner-icon="mdi-magnify"-->
    <!--        single-line-->
    <!--        variant="outlined"-->
    <!--        @click:append-inner="onClick"-->
    <!--      />-->
    <!--    </template>-->
  </v-app-bar>

</template>


<style lang="scss" scoped>
.app-bar-search {
  width: 22rem;
}
</style>
