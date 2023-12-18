export function getLocal (key) {
  const itemStr = localStorage.getItem(key)
  if (!itemStr) {
    return null
  }
  
  const item = JSON.parse(itemStr)
  const now = new Date()
  if (item.expiry && now.getTime() > item.expiry) {
    localStorage.removeItem(key)
    return null
  }
  return item.value
}

export function setLocal (key, value, ttl = 0) {
  const now = new Date()
  const item = {
    value,
    expiry: ttl !== 0 ? now.getTime() + ttl : 0
  }
  return localStorage.setItem(key, JSON.stringify(item))
}

export function removeLocal (key) {
  return localStorage.removeItem(key)
}
