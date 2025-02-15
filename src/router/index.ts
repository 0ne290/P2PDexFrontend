import { createRouter, createWebHistory } from 'vue-router'
import CreateSellOrderView from '../views/CreateSellOrderView.vue'
import SellOrdersView from '../views/SellOrdersView.vue'
import SellOrderView from '../views/SellOrderView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/sell-order/get-all',
            name: 'getAllSellOrders',
            component: SellOrdersView,
        },
        {
            path: '/sell-order/create',
            name: 'createSellOrder',
            component: CreateSellOrderView,
        },
        {
            path: '/sell-order/:guid',
            name: 'getSellOrder',
            component: SellOrderView,
            props: true,
        },
    ],
})

export default router