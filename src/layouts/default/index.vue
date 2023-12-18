<script setup>
import { theme } from 'ant-design-vue';
import TempNavigator from "@/layouts/default/tempNavigator.vue";

const themeConfig = {
  algorithm: theme.darkAlgorithm,
}
</script>

<template>
  <a-config-provider
      :theme="themeConfig"
  >
    <a-layout style="min-height: 100vh">
      <temp-navigator/>
      <a-layout>
        <a-layout-header>
          foo
        </a-layout-header>
        <a-layout-content>
          bar
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>

<style lang="scss" scoped>
</style>
