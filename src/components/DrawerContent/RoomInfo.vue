<script setup>
</script>

<template>
  <v-toolbar
    :border="true"
    color="white"
  >
    <v-toolbar-title>
      课程详情
    </v-toolbar-title>

    <template v-slot:append>
      <v-btn
        class="text-medium-emphasis mx-3"
        variant="outlined"
      >
        编辑
      </v-btn>
      <v-btn
        class="text-medium-emphasis"
        color="primary"
        variant="flat"
      >
        开课
      </v-btn>
    </template>
  </v-toolbar>
  <v-list>
    <v-list-item>
      <template v-slot:prepend>
        课时名称
      </template>
      <v-list-item-title>
        语法练习
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>


<style scoped>

</style>
