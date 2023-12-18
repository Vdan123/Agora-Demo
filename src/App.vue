<script setup>
import { computed } from 'vue';
import { RouterView, useRoute } from "vue-router";
import AppSnackbar from '@/components/AppSnackbar';
import DefaultLayout from '@/layouts/default/index';
import NoNavigator from '@/layouts/NoNavigator/index';

//
// const theme = useTheme()
//

const layoutComponents = {
  default: DefaultLayout,
  noNavigator: NoNavigator
};


const route = useRoute();
const layoutComponent = computed(() => {
  const layout = route.meta.layout || 'default';
  return layoutComponents[layout];
});

</script>


<template>
  <component :is="layoutComponent">
    <RouterView v-slot="{ Component, route }">
      <!--      <keep-alive>-->
      <!--       -->
      <!--      </keep-alive>-->
      <component
        :is="Component"
        :key="route.path"
      />
    </RouterView>
  </component>
  <AppSnackbar/>
</template>
