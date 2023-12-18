import { createRouter, createWebHistory } from 'vue-router'


export const routes = [
  {
    path: '/',
    redirect: '/dashboard',
    hidden: true,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard'),
    meta: {
      title: '直播课堂',
      icon: 'mdi-video-plus-outline',
      keepAlive: true,
      layout: 'default',
      hideAppBar: true
    }
  },
  {
    path: '/create-pack',
    name: 'CreatePack',
    component: () => import('@/views/CreatePack'),
    meta: {
      title: '创建课程包',
      icon: 'mdi-video-plus-outline',
      keepAlive: false,
      layout: 'default',
      hideAppBar: true
    },
    hidden: true,
  },
  {
    path: '/class-schedule',
    name: 'ClassSchedule',
    component: () => import('@/views/ClassSchedule/index.vue'),
    meta: {
      title: '课程包',
      icon: 'mdi-calendar-check-outline',
      badge: 0,
      hideAppBar: true,
      keepAlive: true,
      rail: true,
      layout: 'default'
    }
  },
  {
    path: '/courses',
    name: 'CourseLists',
    component: () => import('@/views/CourseLists/index.vue'),
    meta: {
      title: '历史课程',
      icon: 'mdi-history',
      keepAlive: true,
      layout: 'default'
    }
  },
  {
    path: '/user-profile',
    name: 'UserProfile',
    component: () => import('@/views/UserProfile/index.vue'),
    meta: {
      title: '个人中心',
      keepAlive: true,
      hideAppBar: true,
      icon: 'mdi-account',
      layout: 'default'
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
    meta: {
      title: '登录',
      hideAppBar: true,
      keepAlive: false,
      layout: 'noNavigator'
    },
    hidden: true
  },
  {
    path: '/rest-pwd',
    name: 'RestPwd',
    component: () => import('@/views/Login/RestPassword.vue'),
    meta: {
      title: '重置密码',
      hideAppBar: false,
      keepAlive: true,
      layout: 'default'
    },
    hidden: true
  },
  // {
  //   path: '/students-settings',
  //   component: defaultLayout,
  //   children: [
  //     {
  //       path: '',
  //       name: 'StudentSettings',
  //       component: () => import('@/views/StudentSettings/index.vue'),
  //       meta: {
  //         title: '学生管理',
  //         icon: 'mdi-account-group-outline'
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/classroom/:uuid',
  //   name: 'ClassRoom',
  //   component: () => import(/* webpackChunkName: "home" */ '@/views/Classroom/Modal.jsx'),
  // },
  // {
  //   path: '/devices-test/:uuid',
  //   name: 'DevicesTestPage',
  //   component: () => import('@/views/DevicesTestPage/Modal.jsx'),
  // },

  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/Error/NotFound.vue'),
    meta: {
      title: '重置密码',
      hideAppBar: false,
      keepAlive: true,
      layout: 'noNavigator'
    },
    hidden: true
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    hidden: true
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
