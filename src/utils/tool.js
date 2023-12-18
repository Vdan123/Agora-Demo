import { isEmpty, isNull, isObject, isUndefined, transform, values } from "lodash-es";
import moment from 'moment';
import { getLocal } from "@/utils/localStorage";

export const isNoValid = value => {
  return isNull(value) || isUndefined(value);
}

export const delay = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export const allPropertiesHaveValue = obj => {
  return values(obj).every(value => !isEmpty(value) || value === false || value === 0)
}

export const transformRequestData = data => {
  function transformValue (value) {
    if (isObject(value)) { // 检查值是否为对象或数组（因为数组在 JavaScript 中也是对象）
      return JSON.stringify(value); // 转换为 JSON 字符串
    }
    return value; // 不是对象或数组，直接返回原值
  }

  return transform(data, (result, value, key) => {
    // 使用 _.transform 递归地应用 transformValue 函数
    result[key] = transformValue(value);
  });
}

export const transformFormData = data => {
  // 创建一个 FormData 对象
  let formData = new FormData();

  // 遍历data对象，对于文件类型的数据使用append with blob，对于其他数据，直接append
  Object.keys(data).forEach(key => {
    if (data[key] instanceof File) {
      formData.append(key, data[key], data[key].name);
    } else if (Array.isArray(data[key]) || typeof data[key] === 'object') {
      // 对于对象和数组，我们依旧需要将其转换为JSON字符串
      formData.append(key, JSON.stringify(data[key]));
    } else {
      // 对于普通类型的数据，直接append
      formData.append(key, data[key]);
    }
  });

  return formData;
}


export function createFormData (data, formData = new FormData(), parentKey = '') {
  Object.keys(data).forEach(key => {
    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    // 检查值是否为对象或数组
    if (typeof data[key] === 'object' && data[key] !== null) {
      // 如果是数组，则将整个数组转换为JSON字符串
      if (Array.isArray(data[key])) {
        formData.append(formKey, JSON.stringify(data[key]));
      } else {
        // 如果是对象，则递归处理对象
        createFormData(data[key], formData, formKey);
      }
    } else {
      // 对于基本数据类型，直接添加
      formData.append(formKey, data[key]);
    }
  });
  return formData;
}

export const formatTimeToFull = dateTime => {
  let formattedDateTime;
  // 检查 dateTime 是否符合 'YYYY-MM-DD HH:mm' 或 'YY-MM-DD HH:mm' 格式
  if (moment(dateTime, 'YYYY-MM-DD HH:mm', true).isValid()) {
    formattedDateTime = moment(dateTime, 'YYYY-MM-DD HH:mm');
  } else if (moment(dateTime, 'YY-MM-DD HH:mm', true).isValid()) {
    formattedDateTime = moment(dateTime, 'YY-MM-DD HH:mm');
  } else {
    // 如果都不符合，返回原始值或进行其他处理
    return dateTime;
  }

  // 将日期时间格式化为 'YYYY-MM-DD HH:mm:ss'
  return formattedDateTime.format('YYYY-MM-DD HH:mm:ss');
};


export const isTeacher = uid => {
  const userInfo = getLocal('userInfo');
  return userInfo && userInfo.uid === uid;
}
