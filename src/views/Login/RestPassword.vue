<script setup>
import UsePhoneNumber from "@/views/Login/components/usePhoneNumber.vue";</script>


<template>
  <v-container class="h-100 d-flex">
    <v-row class="align-center justify-center">
      <v-col cols="auto">
        <v-card
          border
          class="pa-4"
          variant="flat"
          width="520"
        >
          <v-card-title>
            重置密码
          </v-card-title>
          <use-phone-number

          />


          <v-card-actions>
            <v-btn
              :block="true"
              color="primary"
              variant="tonal"
            >
              重置
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
