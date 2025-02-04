import { createRouter, createWebHistory } from 'vue-router'
import CreateSellOrderView from '../views/CreateSellOrderView.vue'
import SellOrdersView from '../views/SellOrdersView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // {
        //     path: '/',
        //     name: 'default',
        //     component: CreateSellOrderView,
        // },
        {
            path: '/sell-order/get-all',
            name: 'getAllSellOrders',
            component: CreateSellOrderView,
        },
        {
            path: '/sell-order/create',
            name: 'createSellOrder',
            component: SellOrdersView,
        },
    ],
})

export default router