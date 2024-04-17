import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/pages/dashboard/index.vue'
const routes = [
    {
        path:"/dashboard",
        name:"Dashboard",
        component:Dashboard
    }
]

const router = createRouter ( {
    history: createWebHistory(),
    routes
})

export default router