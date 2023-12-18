<script setup>
import AppEmpty from '@/components/AppEmpty/index.vue'

const headers = [
  {
    title: '课程详情',
    align: 'start',
    sortable: false,
    key: 'detail',
  },
  {
    title: '课程状态',
    align: 'start',
    sortable: true,
    key: 'status',
  },
  {
    title: '操作',
    align: 'start',
    sortable: false,
    key: 'actions',
  },
]
const desserts = []
</script>

<template>
  <!--  <AppBar-->
  <!--    is-search-->
  <!--    searchPlaceholder="课程名称、课程ID、开课人"-->
  <!--  />-->
  <v-container v-if="desserts.length">
    <v-data-table
        :headers="headers"
        :items="desserts"
    >
    </v-data-table>
  </v-container>
  <div v-else class="course-list-empty d-flex align-center justify-center">
    <AppEmpty format="box"/>
  </div>
</template>

<style lang="scss" scoped>
.course-list-empty {
  background: #010101;
  height: calc(100vh - 64px);
}
</style>
