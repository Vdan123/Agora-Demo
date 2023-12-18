import { useAxios } from "@vueuse/integrations/useAxios";
import instance from './index'
import qs from 'qs';

export const getPhoneCode = (params) => {
  return useAxios('/captcha/fetch',
    {
      method: 'GET',
      params
    }
    , instance)
}

export const loginByCode = (data) => {
  return useAxios('/user/login', {
    method: 'POST',
    data: qs.stringify(data),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }, instance)
}


export const getUserInfo = (token) => {
  return useAxios('/user/profile',
    {
      method: 'GET',
      headers: {
        token
      },
      notNotice: true
    }, instance)
}
