<!-- sidebar.vue -->
<template>
    <div class="col-sm-3 col-md-1 sidebar">
        <ul class="nav nav-sidebar">
            <li v-for="route in routeList">
                <a v-link="{path: '/'+route.link}" v-if="visible[route.link]">{{route.name}}</a>
            </li>
        </ul>
    </div>
</template>

<script>
import { getRouteList } from '../vuex/getters'
import { permissionValidator } from '../store/rolePermission.js'

export default {
    name: 'SidebarView',
    vuex: {
        getters: {
            getRouteList: getRouteList,
        }
    },
    data() {
        return {
            visible: {
                'order/list': permissionValidator.orderSystem.order.visible(),
                'order/supplier': permissionValidator.orderSystem.supplier.visible(),
                'order/making': permissionValidator.orderSystem.making.visible(),
                'finance/invoice': permissionValidator.financeSystem.invoice.visible(),
                'finance/receivables': permissionValidator.financeSystem.receivable.visible(),
                'finance/refunds': permissionValidator.financeSystem.refund.visible(),
                'crm/suppliers': permissionValidator.crmSystem.supplier.visible(),
                'crm/users': permissionValidator.crmSystem.member.visible(),
                'crm/customers': permissionValidator.crmSystem.customer.visible(),
                'data/downloads': permissionValidator.dataCenter.downloads.visible(),
                'data/statistics': permissionValidator.dataCenter.statistics.visible(),
                'soyyin/products': permissionValidator.soyyinWebsite.products.visible(),
                'soyyin/cases': permissionValidator.soyyinWebsite.cases.visible(),
            },
        }
    },
    props: {
        type: String,
    },
    computed: {
        routeList() {
            if(this.getRouteList[this.type]){
                return this.getRouteList[this.type];
            }
            return [];
        }
    },
}
</script>
<style>
/*
 * Sidebar
 */

/* Hide for mobile, show later */
.sidebar {
  display: none
}
@media (min-width: 768px) {
  .sidebar {
    position: fixed;
    top: 51px;
    bottom: 0;
    left: 0;
    z-index: 1000;
    display: block;
    padding: 20px;
    overflow-x: hidden;
    overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
    background-color: #fff;
    border-right: 1px solid #e7e7e7;
  }
}

/* Sidebar navigation */
.nav-sidebar {
  margin-right: -21px; /* 20px padding + 1px border */
  margin-bottom: 20px;
  margin-left: -20px;
}
.nav-sidebar-sub{
  background: #f7f7f7;
}
.nav-sidebar > li{
    background: #fafafa;
}
.nav-sidebar > li > a,
.nav-sidebar-sub > li > a {
  padding-right: 20px;
  padding-left: 40px;
  color: #333;
  cursor: pointer;
}
.nav-sidebar-sub>li>a{
    padding-left: 70px;
}
.nav-sidebar > li > a.v-link-active,
.nav-sidebar > li > a.v-link-active :hover,
.nav-sidebar > li > a.v-link-active :focus,
.nav-sidebar-sub > li > a.v-link-active,
.nav-sidebar-sub > li > a.v-link-active :hover,
.nav-sidebar-sub > li > a.v-link-active :focus  {
  color: #e74c3c;
  background-color: #f0f0f0;
}

/*
 * Main content
 */

.main {
  padding: 20px;
}
@media (min-width: 768px) {
  .main {
    padding-right: 40px;
    padding-left: 40px;
  }
}
.main .page-header {
  margin-top: 0;
}
.col-md-1{
    min-width: 140px;
}
</style>