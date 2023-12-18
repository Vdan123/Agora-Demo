<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const handleBackHome = () => {
  router.replace('/')
}
</script>


<template>
  <v-container class="error-container">
    <div class="d-flex align-center justify-center flex-column h-100">
      <AppEmpty
        description="您找的页面可能不存在!"
        format="error"
      />
      <v-btn
        class="mt-4"
        color="primary"
        variant="elevated"
        @click="handleBackHome"
      >
        返回首页
      </v-btn>
    </div>
  </v-container>
</template>

<style lang="scss" scoped>
.not-found-text {
  letter-spacing: .2rem;
}

.error-container {
  height: calc(100vh - 64px);
}
</style>
