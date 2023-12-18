<script setup>
import Logo from "../components/Logo.vue";
import { PieChartOutlined, } from '@ant-design/icons-vue';
import { computed } from "vue";
import { flatMap } from "lodash-es";
import { routes } from "@/router";
import { useRoute } from "vue-router";

const route = useRoute();

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

const activeMenu = computed(() => {
  const { path } = route
  console.log(path, 'path..')
  return [path]
})

</script>

<template>
  <a-layout-sider
      width="240"
  >
    <Logo/>

    <a-menu
        v-model:selectedKeys="activeMenu"
        class="sidebar-menu-container"
        mode="inline"
        theme="dark"
    >
      <a-menu-item
          v-for="(route) in visibleRoutes"
          :key="route.path"
      >
        <pie-chart-outlined/>
        <span>
          {{ route.meta.title }}
        </span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<style lang="scss" scoped>
.sidebar-menu-container {
  padding: 8px;
}
</style>
