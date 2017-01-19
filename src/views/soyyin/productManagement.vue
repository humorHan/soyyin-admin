<!-- productManagement.vue -->
<template>
    <div class="container-fluid">
        <div v-if="permissionList.viewProduct">
            <ul class="breadcrumb">
                <li>酱印网</li>
                <li>商品管理</li>
                <li>商品列表</li>
            </ul>
            <div class="pull-right">
                <a class="btn btn-info btn-sm" v-if="permissionList.addProduct" v-link="{path: '/soyyin/addProduct'}">添加商品</a>
            </div>
            <ul class="nav nav-pills">
                <li :class="{active : type === 'ON_SALE'}" class="pointer">
                    <a @click="getList('ON_SALE')">出售中</a>
                </li>
                <li :class="{active : type === 'all'}" class="pointer">
                    <a @click="getList('all')">全部商品</a>
                </li>
            </ul>
            <form class="form-inline" style="margin-top: 20px;">
                <label class="control-label">筛选：</label>
                <select class="form-control input-sm" v-model="category_id" style="width: 120px;">
                    <option :value="0">全部</option>
                    <option v-for="item of categories" :value="item.id">{{item.name}}</option>
                </select>
                <span class="btn btn-info btn-sm" @click="getList(type)" style="margin-left: 20px;">查询</span>
            </form>
            <table class="table table-bordered table-hover order-table" style="margin-top: 30px;">
                <thead>
                    <tr>
                        <td>商品ID</td>
                        <td>商品名称</td>
                        <td>所属分组</td>
                        <td>封面图片</td>
                        <td>状态</td>
                        <td style="width: 20%;">操作</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(index, item) of lists">
                        <td>{{item.id}}</td>
                        <td>{{item.name}}</td>
                        <td>{{item.categories | groups}}</td>
                        <td>
                            <img :src="item.cover_key | getCdnUrl">
                        </td>
                        <td>{{item.status | getStatus}}</td>
                        <td>
                            <a href="javascript:;" v-if="permissionList.stickProduct && index != 0" @click="getTop(item.id)" style="margin-right: 30px;">在分组中置顶</a>
                            <a href="javascript:;" v-link="{path: '/soyyin/productDetail/'+item.id}">查看详情</a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <span class="btn btn-primary" v-if="since_id" @click="getList(type, true)">查看更多</span>
        </div>
    </div>
</template>

<script>
    import {permissionValidator} from '../../store/rolePermission.js';
    import cdnUrl from '../../filters/cdnUrl.js'

    export default {
        name: 'ProductManagementView',
        data() {
            return {
                category_id: '0',
                type: '',
                since_id: '',
                lists: [],
                categories: [],
                permissionList: {
                    viewProduct: permissionValidator.soyyinWebsite.products.view(),
                    addProduct: permissionValidator.soyyinWebsite.products.addProduct(),
                    stickProduct: permissionValidator.soyyinWebsite.products.stickProduct(),
                }
            }
        },
        ready(){
            this.getList('ON_SALE');
            this.getCategory();
        },
        filters: {
            groups(value){
                var len = value.length;
                if (len === 0) {
                    return '';
                }
                var str = '';
                value.forEach(function(item, i){
                    if (i != len - 1) {
                        str += item.name + '、';
                    } else {
                        str = item.name
                    }
                });
                return  str;
            },
            getCdnUrl(key){
                if (!key) {
                    return '';
                }
                return cdnUrl + key;
            },
            getStatus(id){
                switch(id){
                    case 'CREATED':
                        return '已创建';
                    case 'ON_SALE':
                        return '正在出售';
                    case 'OFF_SHELF':
                        return '已下架';
                    case 'DELETED':
                        return '已删除';
                    default:
                        return '未知商品';
                }
            }
        },
        methods: {
            getList(type, isMore){
                this.type = type;
                if (!isMore) {
                    this.since_id = '';
                }
                var url = '/api/v2/admin/products/list?';
                if (type === 'ON_SALE') {
                    url += 'status=ON_SALE&';
                }
                if (this.category_id != 0) {
                    url += 'category_id=' + this.category_id + '&';
                }
                if (this.since_id) {
                    url += 'since_id=' + this.since_id;
                }
                this.$http.get(url)
                    .then((data) => {
                        this.since_id = data.data.since_id;
                        if (!isMore) {
                            this.lists = this.lists = data.data.products;
                        } else {
                            this.lists = this.lists.concat(data.data.products);
                        }
                    });
            },
            getCategory(){
                this.$http.get('/api/v2/admin/products/category-brief-list')
                    .then((data) => {
                        this.categories = data.data.categories;
                    });
            },
            getTop(id){
                if (this.category_id != 0) {
                    this.$http.put('/api/v2/admin/products/set-top?product_id=' + id + '&category_id=' + this.category_id)
                        .then((data) => {
                            if (data.data.result == 0) {
                                this.getList(this.type);
                            }
                        });
                } else {
                    alert ('全部分类没有置顶概念');
                }
            }
        }
    }
</script>

<style scoped>
    table.table tr td{
        line-height: 53px;
        text-align: center;
    }
    table.table a{
        text-decoration: none;
    }
    table.table a:hover{
        text-decoration: underline;
    }
    .pointer{
        cursor: pointer;
    }
</style>