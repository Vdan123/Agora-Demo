<script setup>
import userAvatar from '@/assets/icon/user.png'
import { useUserStore } from "@/store/user";

const { logout } = useUserStore()
const handleLogout = async () => {
  await logout()
}
</script>


<template>
  <v-card>
    <v-card-title>
      我的账户
    </v-card-title>
    <v-divider
      class="border-opacity-25"
    />
    <v-container>
      <v-list-item>
        <template v-slot:title>
          <div class="d-flex align-center">
            <span class="text-h6">
              进击的斑马
            </span>
            <v-icon
              class="goal-go-pointer ml-2"
              size="20"
            >
              mdi-pencil-outline
            </v-icon>
          </div>
        </template>

        <template v-slot:prepend>
          <v-avatar size="72">
            <v-img
              :src="userAvatar"
              alt="user icon"
            />
          </v-avatar>
        </template>
        <template v-slot:subtitle>
            <span class="text-subtitle-1">
              我的名片
            </span>
          <v-icon
            class="goal-go-pointer"
            size="16"
          >
            mdi-share-variant-outline
          </v-icon>
        </template>

        <template v-slot:append>
          <v-btn
            color="primary"
            @click="handleLogout"
          >
            退出登录
          </v-btn>
        </template>
      </v-list-item>
    </v-container>
  </v-card>
</template>


<style scoped>

</style>
