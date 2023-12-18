<script setup>
import { nextTick, reactive, ref, watchEffect } from "vue";
import { debounce } from 'lodash-es'
import { getPhoneCode, getUserInfo, loginByCode } from '@/api/login.js'
import { useUserStore } from "@/store/user";
import { useRoute, useRouter } from "vue-router";


const phoneNumberRules = ref([
  value => {
    const pattern = /^1[3-9]\d{9}$/;
    if (pattern.test(value)) return true
    return '请输入正确的手机号'
  }
])
const codeRules = ref([
  value => {
    if (value) return true
    return '请输入正确的短信验证码'
  }
])

const checkboxRules = ref([
  value => {
    if (value) return true
    return '请阅读并勾选协议'
  }
])

const user = useUserStore()
const { push } = useRouter()
const currentRoute = useRoute()

const redirect = ref('')
const otherQuery = ref({})

const credentials = reactive({
  mobile: '',
  code: '' //062691
})

const isPending = ref(false)
const countdown = ref(0)
const agreePrivacy = ref(false)
const formValid = ref(false)
const formRef = ref(null)
const classShake = ref({})


const handleCode = debounce(async () => {
  const { items } = formRef.value
  const phoneValid = await items[0].validate()
  const checkboxValid = await items[2].validate()
  if (checkboxValid.length !== 0) {
    classShake.value = {
      'animate__animated': false,
      'animate__shakeX': false
    };

    await nextTick()

    classShake.value = {
      'animate__animated': true,
      'animate__shakeX': true
    }
  }
  if (phoneValid.length !== 0 || checkboxValid.length !== 0) return;
  isPending.value = true;
  countdown.value = 60; // 重置倒计时

  await getPhoneCode({
    mobile: credentials.mobile
  })

  const timer = setInterval(() => {
    countdown.value--;

    if (countdown.value <= 0) {
      clearInterval(timer);
      isPending.value = false;
    }
  }, 1000);
}, 500); // 使用 debounce 防止快速多次点击


const handleLogin = async () => {
  if (formValid.value) {
    const { data } = await loginByCode(credentials)
    const response = data.value
    if (response.code === 'ok') {
      await user.setToken(response?.data)

      await nextTick()

      const { data } = await getUserInfo(response?.data)
      const userInfo = data.value
      await user.setUserInfo(userInfo?.data)

      push({
        path: redirect.value,
        query: otherQuery.value
      })
    }
  }
  return false
}

watchEffect(() => {
  const query = currentRoute.query
  redirect.value = query.redirect || '/'
  otherQuery.value = Object.keys(query).reduce((acc, cur) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur]
    }
    return acc
  }, {})
})

</script>

<template>
  <v-form
    ref="formRef"
    v-model="formValid"
    :fast-fail="true"
    class="mt-2"
    @submit.prevent="handleLogin"
  >
    <v-card
      class="pa-4"
      variant="flat"
    >
      <v-card-title class="text-h5 font-weight-bold">
        欢迎使用直播课堂
      </v-card-title>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="credentials.mobile"
              :required="true"
              :rules="phoneNumberRules"
              label="手机号码"
              persistent-placeholder
              placeholder="请输入手机号码"
              prefix="+86"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="credentials.code"
              :rules="codeRules"
              label="验证码"
              persistent-placeholder
              placeholder="请输入验证码"
              required
            >
              <template v-slot:append>
                <v-btn
                  :color="isPending ? 'default' : '#4D88FF'"
                  :disabled="isPending"
                  :width="100"
                  type="submit"
                  variant="text"
                  @click="handleCode"
                >
                  <template v-if="isPending">
                    重新发送({{ countdown }})
                  </template>
                  <template v-else>
                    获取验证码
                  </template>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col class="d-flex flex-column" cols="12">
            <v-checkbox
              v-model="agreePrivacy"
              :persistent-hint="!agreePrivacy"
              :rules="checkboxRules"
              density="compact"
            >
              <template v-slot:label>
                <span class="text-caption">
                  我已阅读并同意
                  <a class="text-decoration-none link-color" href="">
                    《隐私政策》
                  </a>
                  <a class="text-decoration-none link-color" href="">
                    《用户协议》
                  </a>
                </span>
              </template>

              <template v-slot:message>
                <div :class="classShake">
                  请阅读并勾选协议
                </div>
              </template>
            </v-checkbox>
          </v-col>
        </v-row>
      </v-container>

      <v-card-actions>
        <v-btn
          :block="true"
          color="primary"
          size="large"
          type="submit"
          variant="elevated"
        >
          登录
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>


<style lang="scss" scoped>
.link-color {
  color: #4D88FF
}
</style>
