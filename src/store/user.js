import { defineStore } from "pinia";
import router from '@/router'

import { isNoValid } from "@/utils/tool";
import { getLocal, setLocal } from "@/utils/localStorage";
import { reactive, toRefs } from "vue";

export const useUserStore = defineStore('user', () => {
  const state = reactive({
    token: getLocal('token') || '',
    userInfo: getLocal('userInfo') || null
  })

  async function setUserInfo (userInfo) {
    if (isNoValid(userInfo)) return;
    this.userInfo = userInfo;
    setLocal('userInfo', userInfo);
  }

  async function setToken (token) {
    if (isNoValid(token)) return;
    this.token = token;
    setLocal('token', token);
  }

  async function logout () {
    this.clearCache()
    await router.replace('/login');
  }

  function clearCache () {
    this.token = '';
    this.userInfo = null;
    localStorage.clear();
    sessionStorage.clear();
  }

  return {
    ...toRefs(state),
    setUserInfo,
    setToken,
    logout,
    clearCache
  }
})
