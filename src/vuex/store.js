//使用vuex created 2016-05-11
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    routeLists: {
        order: [
            {name: '订单管理', link: 'order/list'},
            {name: '供应商分配', link: 'order/supplier'},
            {name: '制作管理', link: 'order/making'},
        ],
        finance: [
            {name: '开票管理', link: 'finance/invoice'},
            {name: '收款管理', link: 'finance/receivables'},
            {name: '退款管理', link: 'finance/refunds'},
        ],
        crm: [
            {name: '供应商管理', link: 'crm/suppliers'},
            {name: '成员管理', link: 'crm/users'},
            {name: '客户管理', link: 'crm/customers'},
        ],
        data: [
            {name: '报表下载', link: 'data/downloads'},
            {name: '订单统计', link: 'data/statistics'},
        ],
        soyyin: [
            {name: '商品管理', link: 'soyyin/products'},
            {name: '案例管理', link: 'soyyin/cases'},
        ],
    },
}

const mutations = {
    GET_MY_PERMISSIONS(state, myPermissions) {
        state.myPermissions = myPermissions
    },
    GET_SUPER_ADMIN(state) {
        state.isSuperAdmin = true
    }
}

export default new Vuex.Store({
    state,
    mutations,
})
