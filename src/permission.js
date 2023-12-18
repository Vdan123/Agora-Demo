import router from '@/router'
import { isNoValid } from "@/utils/tool";
import { useUserStore } from "@/store/user";

const whitePage = ['/login', '/404', '/rest-pwd']

router.beforeEach(async (to, from, next) => {
  /* 这里需要每次访问时，携带 token */
  const { token, clearCache } = useUserStore()
  
  document.title = `完美年级-${ to.meta.title }`
  if (token && !isNoValid(token)) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    if (whitePage.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${ to.path }`)
    }

    clearCache()
  }
})
