<script setup>

const props = defineProps({
  description: {
    type: String,
    default: '暂无数据'
  },
  format: {
    type: String,
    default: 'empty'
  }
})


</script>


<template>
  <div class="empty-container">
    <AppAnimation
      :format="props.format"
    />
    <p class="font-weight-bold">
      {{ props.description }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.empty-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 300px;
  height: 300px;
  margin-bottom: 8px;
}
</style>
