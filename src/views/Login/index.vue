<script setup>
import UsePhoneNumber from "./components/usePhoneNumber.vue";
import { computed } from "vue";
import { useDisplay } from "vuetify";


const { smAndDown } = useDisplay();
const cols = computed(() => {
  return smAndDown.value ? [0, 12] : [6, 6]
})

</script>

<template>
  <v-container
    class="goal-go-login-container h-100"
  >
    <v-row no-gutters>
      <v-col
        v-if="!smAndDown"
        :cols="cols[0]"
        class="px-8"
      >
        <div class="login-card">
          <!--          <p class="text-h4 font-weight-bold">-->
          <!--            直播课堂-->
          <!--          </p>-->
          <!--          <p class="mt-4 text-h5 login-card-subtitle">-->
          <!--            让线上学习变得更简单-->
          <!--          </p>-->
          <AppAnimation
            format="login"
            style="width: 424px; height: 424px"
          />
        </div>
      </v-col>

      <v-col :cols="cols[1]" class="px-8">
        <use-phone-number
          class="mt-2"
        />

      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.goal-go-login-container {
  position: relative;
  max-width: 996px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.login-card-subtitle {
  letter-spacing: .3rem !important;
}
</style>
