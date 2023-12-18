import axios from "axios";
import { useSnackbar } from "@/store/snackbar";
import { isEmpty } from "lodash-es";
import { useUserStore } from "@/store/user";
import { getLocal } from "@/utils/localStorage";
import { useAxios } from "@vueuse/integrations/useAxios";
// 创建一个错误信息到中文提示的映射对象
const errorMapping = {
  'Network Error': '网络出现问题，请检查您的连接。',
  'Timeout': '请求超时，请稍后重试。',
  '404': '抱歉，我们找不到您要求的资源。',
  '403': '抱歉，您没有权限访问这个资源。',
  '500': '服务器出现问题，请稍后重试。',
  '503': '服务当前不可用，请稍后重试。'
};

const snackbar = useSnackbar()
const whiteList = ['/user/login', '/register', '/forgot-password', '/captcha/fetch'];

export const BASE_URL = import.meta.env.MODE !== 'development' ?
  import.meta.env.VITE_APP_BASE_URL :
  '/api'

export const instance = axios.create({
  baseURL: BASE_URL
})

const userStore = useUserStore()

const checkCurrentUser = token => {
  const { execute } = useAxios('/user/check-token', instance, { immediate: false })
  return execute({
    method: 'GET',
    headers: { token },
    notNotice: true
  })
}

instance.interceptors.request.use(
  async config => {
    if (!whiteList.includes(config.url)) {
      if (!config.url.endsWith('/check-token')) {
        // 获取用户 token
        const token = getLocal('token');
        if (!token) {
          await userStore.logout()
          return Promise.reject({
            customError: true,
            message: `${ config.url }: 缺少必要的 token`
          });
        }
        const { data } = await checkCurrentUser(token);
        const checkResult = data.value
        if (checkResult.code === 'ok') {
          config.headers.token = token;
        }
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


// Response Interceptor for centralized handling
instance.interceptors.response.use(
  async response => {
    const { data, config } = response
    console.log("Success:", response);

    if (!isEmpty(data)) {

      if (data?.code === 'unauth') {
        await userStore.logout()
        return Promise.reject(new Error(data?.message || '暂无权限访问'));
      }

      if (data?.code !== 'ok') {
        snackbar.showSnackbar({
          message: data?.message || '发生错误',
          color: 'error'
        })
      } else {
        if (config.notNotice) {
          return response
        }
        snackbar.showSnackbar({
          message: data?.message || '操作成功',
          color: 'success'
        })
      }

    }
    return response;
  },
  error => {
    // Insert your logic for handling errors here
    if (error.customError) {
      console.log("Error:", error)
    } else {
      const errorMessage = error.message || String(error.response.status);
      const chineseMessage = errorMapping[errorMessage] || error.message || '未知错误';
      console.error("Error:", error);
      snackbar.showSnackbar({
        message: chineseMessage,
        color: 'error'
      })
    }

    return Promise.reject(error);
  }
);

export default instance
