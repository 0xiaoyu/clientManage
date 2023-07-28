import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/ListTable.vue')
    },
    {
        path: '/list',
        name: 'list',
        component: () => import( '../views/ListTable.vue')
    }, {
        path: '/log',
        name: 'log',
        component: () => import( '../views/LogView.vue')
    }, {
        path: '/dispose',
        name: 'dispose',
        component: () => import( '../views/DisposeView.vue')
    }, {
        path: '/keyWords',
        name: 'keyWords',
        component: () => import( '../views/KeyWords.vue')
    }, {
        path: '/tagWords',
        name: 'tagWords',
        component: () => import( '../views/tagWords.vue')
    }, {
        path: '/companyInfo',
        name: 'companyInfo',
        component: () => import( '../views/CompanyInfo.vue')
    }, {
        path: '/SynchronousView',
        name: 'Synchronous',
        component: () => import( '../views/SynchronousView.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router
