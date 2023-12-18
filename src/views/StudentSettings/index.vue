<script setup>
import AppBar from '@/components/AppBar/index.vue'

const headers = [
  {
    title: '学员姓名',
    align: 'start',
    key: 'detail',
  },
  {
    title: '手机号',
    align: 'start',
    key: 'status',
  },
  {
    title: '导入时间',
    align: 'start',
    key: 'createTime',
  },
  {
    title: '关联课程/课程包',
    align: 'start',
    key: 'course',
  },
  {
    title: '操作',
    align: 'start',
    key: 'actions',
  },
]

const desserts = []
</script>

<template>
  <AppBar
    is-search
    search-placeholder="学员姓名、手机号"
  />

  <v-container>
    <v-data-table
      :headers="headers"
      :items="desserts"
    >
    </v-data-table>
  </v-container>
</template>

<style lang="scss" scoped>

</style>
