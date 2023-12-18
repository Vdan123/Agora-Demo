import { isObject } from "lodash-es";

export function getSession (name) {
  const data = sessionStorage.getItem(name);
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
}

export function setSession (name, value) {
  if (isObject(value)) {
    value = JSON.stringify(value);
  }
  return sessionStorage.setItem(name, value)
}

export function removeSession (name) {
  return sessionStorage.removeItem(name)
}
