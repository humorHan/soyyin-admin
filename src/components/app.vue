<!-- app.vue -->
<template>
    <div>
        <nav class="navbar navbar-default navbar-fixed-top">
            <div class="container-fluid">
                <div class="navbar-header">
                    <a class="navbar-brand" v-link="{path: '/'}">酱印网管理系统</a>
                </div>
                <div class="navbar-collapse collapse">
                    <ul class="nav navbar-nav">
                        <li v-for="menu in menus" :class="{'active': menu.link === type }">
                            <a v-link="{path: '/' + menu.link}">{{menu.name}}</a>
                        </li>
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <li><a>{{display_name}}</a></li>
                        <li><a href="index.html">登出</a></li>
                    </ul>
                </div>
            </div>
        </nav>
        <!-- main view -->
        <router-view
          class="view"
          transition
          transition-mode="out-in">
        </router-view>
    </div>
</template>

<script>
//根组件中注入vuex
import store from '../vuex/store'
import $ from 'jquery'

export default {
    name: 'AppRoot',
    store,
    data() {
        return{
            menus: [
                {name: "订单系统", link: "order"},
                {name: "财务系统", link: "finance"},
                {name: "CRM系统", link: "crm"},
                {name: "数据中心", link: "data"},
                {name: "酱印网管理", link: "soyyin"},
            ],
        }
    },
    computed: {
        type() {
            var arr = this.$route.path.split('/');
            return arr[1];
        },
        display_name() {
            return $.cookie('display_name');
        }
    }
}
</script>

<style>
.navbar-default .navbar-nav>.active>a, .v-link-active{
    color: #18bc9c;
}
.navbar-brand{
    width: 200px;
    text-align: center;
}
.navbar-nav>li {
    margin-right: 30px;
}
/* 必需 */
.expand-transition {
  transition: all .3s ease;
  overflow: hidden;
}

/* .expand-enter 定义进入的开始状态 */
/* .expand-leave 定义离开的结束状态 */
.expand-enter, .expand-leave {
  height: 0;
  padding: 0 10px;
  opacity: 0;
}

.modal{
    display: block;
}
</style>