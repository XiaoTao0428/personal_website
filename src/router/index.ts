import { createRouter, createWebHistory, type Router, type RouterOptions, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
    component: () =>  import('@/views/Index.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () =>  import('@/views/Home.vue')
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('@/views/About.vue')
      }
    ]
  }
]

const router: Router = createRouter(<RouterOptions>{
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
