import { createRouter, createWebHistory } from 'vue-router'
import d from '../views/CreateSellOrderView.vue'
import HomeView from '../views/SellOrdersView.vue

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/sell-order/get-all',
      name: 'home',
      //component: HomeView,
    },
    {
      path: '/sell-order/create',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router