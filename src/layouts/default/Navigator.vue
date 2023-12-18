<script setup>
import { routes } from '@/router'
import { computed, ref } from "vue";
import { flatMap } from "lodash-es";
import Logo from "@/layouts/components/Logo.vue";

const rail = ref(false);


const visibleRoutes = computed(() => {
  return flatMap(routes, item => {
    if (item.children && item.children.length) {
      return item.children.map(child => {
        const clonedChild = { ...child };
        clonedChild.path = `${item.path}/${child.path}`;
        return clonedChild;
      });
    }
    return item
  }).filter(route => !route.hidden)
})

const handleCollapse = () => {
  rail.value = !rail.value
}


</script>

<template>
  <v-navigation-drawer
    :rail="rail"
    width="240"
  >
    <template v-slot:append>
      <div class="pa-2">
        <v-btn
          class="ml-auto"
          icon="mdi-menu-open"
          variant="text"
          @click.stop="handleCollapse"
        />
      </div>
    </template>

    <!--    Logo-->
    <v-list-item height="64">
      <div class="d-flex align-center">
        <Logo :rail="rail"/>
      </div>

    </v-list-item>


    <v-list :nav="true">
      <v-list-item
        v-for="(route, key) in visibleRoutes"
        :key="key"
        :link="true"
        :to="route.path"
        rounded="lg"
      >
        <template v-slot:prepend>
          <v-icon :icon="route.meta?.icon"/>
        </template>
        <template
          v-if="route.meta?.badge"
          v-slot:append
        >
          <v-badge
            :content="route.meta?.badge"
            :inline="true"
            color="warning"
          />
        </template>
        <v-list-item-title>
          {{ route.meta?.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped>
</style>
