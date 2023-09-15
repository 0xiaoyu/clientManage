import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/ListTable.vue'),
        meta: {
            keepAlive: true // 需要缓存
        }
    },
    {
        path: '/list',
        name: 'list',
        component: () => import( '../views/ListTable.vue'),
        meta: {
            keepAlive: true // 需要缓存
        }
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
        path: '/companyInfo',
        name: 'companyInfo',
        component: () => import( '../views/CompanyInfo.vue')
    }, {
        path: '/Synchronous',
        name: 'Synchronous',
        component: () => import( '../views/SynchronousView.vue')
    }, {
        path: '/getClient',
        name: 'getClient',
        component: () => import( '../views/GetClient.vue')
    }, {
        path: '/getChangePhone',
        name: 'getChangePhone',
        component: () => import( '../views/ChangePhoneView.vue')
    }, {
        path: '/crmView',
        name: 'crmView',
        component: () => import( '../views/CrmView.vue')
    }, {
        path: '/changeNameLog',
        name: 'changeNameLog',
        component: () => import( '../views/changeNameLog.vue')
    }, {
        path: '/company-flag',
        name: 'company-flag',
        component: () => import( '../views/CompanyFlag.vue')
    }
]

const router = new VueRouter({
    routes,
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {x: 0, y: 0}
        }
    }
})

export default router
