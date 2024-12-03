import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Layout from '../views/Layout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      component: Layout,
      redirect: '/charging-station',
      children: [
        {
          path: 'charging-station',
          name: 'ChargingStation',
          component: () => import('../views/ChargingStation.vue'),
          meta: { title: '充电站管理' }
        },
        {
          path: 'charging-pile',
          name: 'ChargingPile',
          component: () => import('../views/ChargingPile.vue'),
          meta: { title: '充电桩管理' }
        },
        {
          path: 'order',
          name: 'Order',
          component: () => import('../views/Order.vue'),
          meta: { title: '订单管理' }
        },
        {
          path: 'user',
          name: 'User',
          component: () => import('../views/User.vue'),
          meta: { title: '用户管理' }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
