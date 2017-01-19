//路由注册说明，均使用按需加载的方式加载各个组件模块
import Welcome from './components/welcome.vue'
import Main from './components/main.vue'
import { checkLogin } from './store/index.js'

export function route(router) {
    router.map({
        '/index': {
            component: Welcome,
        },
        '/order': {
            component: Main,
            subRoutes: {
                '/': {
                    component: Welcome
                },
                '/list': {
                    component: function (resolve) {
                        require(['./views/order/list.vue'], resolve);
                    }
                },
                '/create/': {
                    component: function (resolve) {
                        require(['./views/order/create.vue'], resolve);
                    }
                },
                '/create/:id': {
                    component: function (resolve) {
                        require(['./views/order/create.vue'], resolve);
                    }
                },
                '/detail/:id': {
                    component: function (resolve) {
                        require(['./views/order/detail.vue'], resolve);
                    }
                },
                '/edit/:id': {
                    component: function (resolve) {
                        require(['./views/order/edit.vue'], resolve);
                    }
                },
                '/invoice': {
                    component: function (resolve) {
                        require(['./views/order/invoice.vue'], resolve);
                    }
                },
                '/supplier': {
                    component: function (resolve) {
                        require(['./views/order/supplier.vue'], resolve);
                    }
                },
                '/making': {
                    component: function (resolve) {
                        require(['./views/order/making.vue'], resolve);
                    }
                },
            }
        },
        '/finance': {
            component: Main,
            subRoutes: {
                '/': {
                    component: Welcome
                },
                '/invoice': {
                    component: function (resolve) {
                        require(['./views/finance/invoice.vue'], resolve);
                    }
                },
                '/receivables': {
                    component: function (resolve) {
                        require(['./views/finance/receivables.vue'], resolve);
                    }
                },
                '/refunds': {
                    component: function (resolve) {
                        require(['./views/finance/refunds.vue'], resolve);
                    }
                },
            }
        },
        '/crm': {
            component: Main,
            subRoutes: {
                '/': {
                    component: Welcome
                },
                '/users': {
                    component: function (resolve) {
                        require(['./views/crm/users.vue'], resolve);
                    }
                },
                '/suppliers': {
                    component: function (resolve) {
                        require(['./views/crm/suppliers.vue'], resolve);
                    }
                },
                '/customers': {
                    component: function (resolve) {
                        require(['./views/crm/customers.vue'], resolve);
                    }
                },
            }
        },
        '/data': {
            component: Main,
            subRoutes: {
                '/': {
                    component: Welcome
                },
                '/downloads': {
                    component: function (resolve) {
                        require(['./views/dataCenter/reportsDownload.vue'], resolve);
                    }
                },
                '/statistics': {
                    component: function (resolve) {
                        require(['./views/dataCenter/dataStatistics.vue'], resolve);
                    }
                },
            }
        },
        '/soyyin': {
            component: Main,
            subRoutes: {
                '/': {
                    component: Welcome
                },
                '/products': {
                    component: function (resolve) {
                        require(['./views/soyyin/productManagement.vue'], resolve);
                    }
                },
                '/addProduct': {
                    component: function (resolve) {
                        require(['./views/soyyin/addProduct.vue'], resolve);
                    }
                },
                '/addProduct/:id': {
                    component: function (resolve) {
                        require(['./views/soyyin/addProduct.vue'], resolve);
                    }
                },
                '/productDetail/:id': {
                    component: function (resolve) {
                        require(['./views/soyyin/productDetail.vue'], resolve);
                    }
                },
                '/cases': {
                    component: function (resolve) {
                        require(['./views/soyyin/caseManagement.vue'], resolve);
                    }
                },
                'case/': {
                    component: function(resolve){
                        require(['./views/soyyin/case.vue'], resolve);
                    }
                },
                'case/:id': {
                    component: function(resolve){
                        require(['./views/soyyin/case.vue'], resolve);
                    }
                }
            }
        },
    });

    router.beforeEach(function(transition) {
        if (checkLogin()) {
            window.scrollTo(0, 0);
            transition.next();
        } else {
            transition.abort();
        }
    });

    router.redirect({
        '*': '/index/',
    });
}