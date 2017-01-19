<template>
    <div class="container-fluid">
        <ul class="breadcrumb">
            <li>酱印网</li>
            <li>商品管理</li>
            <li>商品详情</li>
        </ul>
        <div>
            <div class="pull-right">
                <a href="javascript:;" class="btn btn-info btn-sm" v-if="permissionList.onOffSale">上架</a>
                <a href="javascript:;" class="btn btn-info btn-sm" v-if="permissionList.onOffSale">下架</a>
                <a href="javascript:;" class="btn btn-info btn-sm" v-if="permissionList.editDetail">编辑详情</a>
            </div>
            <h2>商品详情</h2>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <span class="panel-title">基本信息</span>
                <span class="btn btn-info btn-sm pull-right"
                      v-link="{path: '/soyyin/addProduct/' + data.id}">编辑基本信息</span>
            </div>
            <div class="panel-body">
                <div class="bold">
                    <span>商品名称：{{data.name}}</span>
                    <span class="ml50">商品ID：{{data.id}}</span>
                    <span class="ml50">状态：{{data.status | getStatus}}</span>
                    <span class="ml50">所属分组： {{data.categories | getCategories}}</span>
                </div>
                <div class="mt20">
                    <span class="bold">商品图片</span>
                    <ul class="image-keys">
                        <li v-for="item in data.image_keys">
                            <img :src="item | getUrl" alt="">
                            <div style="margin-top: 10px; text-align: center;">{{item}}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                <span class="panel-title">选项信息</span>
                <span class="btn btn-info btn-sm pull-right">编辑选项</span>
            </div>
            <div class="panel-body">
                <ul>
                    <li class="dimension" v-for="(i, items) of data.sheet_list">
                        <span class="bold inline-block dimension-title">{{items.name}}：</span>
                        <ul class="inline-block" style="padding-left: 20px;">
                            <li :class="{red:items.status[j],'inline-block':true}" v-for="(j,item) in items.values"
                                @click="changeStatus(i, j)">{{item | filterDimensionItem}}
                            </li>
                        </ul>
                    </li>
                </ul>
                <div style="margin-left: 65px;">
                    <span class="btn btn-info" @click="search()">查询</span>
                    <a class="pointer ml30" @click="chooseAll()">全选</a>
                    <a class="pointer ml30" @click="empty()">清空选中</a>
                </div>
            </div>
        </div>
        <div>
            <span class="btn btn-info btn-sm pull-right middle">添加</span>
            <span class="middle">查询结果：</span>
        </div>
        <table class="table table-bordered table-hover order-table" style="margin-top: 30px;">
            <thead>
            <tr>
                <td>价格ID</td>
                <td>参数</td>
                <td>图片</td>
                <td>价格</td>
                <td>起做数</td>
                <td>操作</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(index, item) of priceData">
                <td>{{item.id}}</td>
                <td>{{item.spec | filterName}}</td>
                <td>
                    <ul class="price-img-carousel">
                        <li class="pre"><</li>
                        <li class="price-img-item" v-for="key of item.image_keys">
                            <div>
                                <img :src="key | getUrl" alt="">
                                <div class="mt10" style="text-align: center;">{{key}}</div>
                            </div>
                        </li>
                        <li class="next">></li>
                    </ul>
                    <div class="mt10">
                        <span>共{{item.image_keys.length}}张图片</span>
                    </div>
                </td>
                <td>{{item.price | filterPrice}}</td>
                <td>{{item.min_quantity}}</td>
                <td>
                    <a class="pointer" @click="editPriceBtn(item, index)">编辑</a>
                    <a class="ml20 pointer" @click="deletePriceBtn(item.id)">删除</a>
                </td>
            </tr>
            </tbody>
        </table>
        <span class="btn btn-primary" @click="more()">更多价格</span>
        <!--删除价格-->
        <delete-price :show-dialog.sync="deletePrice.show" :dialog-title="deletePrice.title" :dialog-content="deletePrice.content"></delete-price>
        <!--编辑价格-->
        <edit-price :price-show.sync="editPrice.show" :price-data="editPrice.priceData" :price-name="editPrice.priceParams"></edit-price>
    </div>
</template>

<script>
    import {permissionValidator} from '../../store/rolePermission.js';
    import cdnUrl from '../../filters/cdnUrl.js';
    import carousel from '../../util/carousel.js';
    import deletePrice from '../../components/popupDialog.vue';
    import editPrice from './comp/editPrice.vue';

    export default {
        data() {
            return {
                id: '',
                data: {},
                dimensionSelected: [], //添加数组（包括每一个维度选中状态下的id拼接后的string  eg：['12'，'5'] 是第一维度选中1和2  第二维度选中5）添加方法前端查询价格列表（选项对应存在于price属性下spec）
                priceAllData: [], //查询所有结果（价格）
                priceData: [], //要渲染的价格结果（价格）
                num: 10, //一次展开的查询结果数目
                carouselIndex: 0, // 当前轮播图片的索引
                permissionList: {
                    onOffSale: permissionValidator.soyyinWebsite.products.onOffSale(),
                    editDetail: permissionValidator.soyyinWebsite.products.editDetail()
                },
                deletePrice: {
                    id: null,
                    show: false,
                    title: '删除确认',
                    content: '确定删除此价格数据？'
                },
                editPrice: {
                    show: false,
                    priceParams: null,
                    priceData: {}
                },
                editPriceIndex: ''
            }
        },
        components: {
            deletePrice,
            editPrice
        },
        beforeCompile(){
            this.id = this.$route.params.id;
            this.$http.get('/api/v2/admin/products/detail-v2?id=' + this.id)
                .then((dt) => {
                    dt.data['sheet_list'].forEach((item) => {
                        let temp = [];
                        item.values.forEach((item) => {
                            temp.push(false);
                        });
                        item.status = temp;
                    });
                    //过滤掉type不是BUTTON的
                    this.filterType(dt.data);
                })
        },
        filters: {
            filterPrice(p){
                if (!p) {
                    return p;
                }
                return (p / 100 + '');
            },
            filterName(ids){
                let name = '';
                ids.forEach((id) => {
                    this.data.spec_values.forEach((item) => {
                        if (id == item.id) {
                            name += item.name + ' ';
                        }
                    });
                });
                return name;
            },
            filterDimensionItem(id){
                let name = '';
                this.data.spec_values.forEach((item) => {
                    if (item.id == id) {
                        name = item.name;
                    }
                });
                return name;
            },
            getUrl(key){
                return cdnUrl + key;
            },
            getStatus(id){
                switch (id) {
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
            },
            getCategories(arr){
                if (!arr || arr.length == 0) {
                    return '';
                }
                let str = '';
                arr.forEach((item, i) => {
                    if (i == arr.length - 1) {
                        str += item.name;
                    } else {
                        str += item.name + '、';
                    }
                });
                return str;
            }
        },
        methods: {
            filterType(dt){
                dt['sheet_list'].forEach((item, i) => {
                    if (item.type != 'BUTTON') {
                        item.splice(i, 1);
                    }
                });
                this.data = dt;
            },
            changeStatus(i, j){
                this.data['sheet_list'][i].status.splice(j, 1, !(this.data['sheet_list'][i].status[j]));
            },
            chooseAll(){
                this.data['sheet_list'].forEach((item) => {
                    item.status.forEach((status, i) => {
                        item.status.splice(i, 1, true);
                    })
                })
            },
            empty(){
                this.data['sheet_list'].forEach((item) => {
                    item.status.forEach((status, i) => {
                        item.status.splice(i, 1, false);
                    })
                })
            },
            more(){
                this.num += 10;
                this.priceData = this.priceAllData.slice(0, this.num);
                this.initCarousel();
            },
            search(){
                //get 选中项
                this.getDimensionSelected();
                if (this.data['sheet_list'].length != this.dimensionSelected.length) {
                    alert('每个维度至少选一个选项');
                    return false;
                }
                //前端查询数据
                this.priceAllData = [];
                this.data.prices.forEach((price) => {
                    let temp = 0;
                    price.spec.forEach((item, i) => {
                        if (this.dimensionSelected[i].indexOf(item) > -1) {
                            temp += 1;
                        }
                    });
                    if (temp == price.spec.length) {
                        this.priceAllData.push(price);
                    }
                });
                this.num = 10;
                this.priceData = this.priceAllData.slice(0, this.num);
                this.initCarousel();
            },
            initCarousel(){
                for(let i = 1; i < 1000; i++) {
                    clearInterval(i);
                }
                this.$nextTick(() => {
                    let dom = document.getElementsByClassName("price-img-carousel");
                    for (let i = 0, len = dom.length; i < len; i++) {
                        //new this.initCarousel(i);
                        carousel($(".price-img-carousel").eq(i), this.priceData[i]['image_keys'].length, 3000);
                    }
                });
            },
            getDimensionSelected(){
                this.dimensionSelected = [];
                this.data['sheet_list'].forEach((item) => {
                    let temp = '';
                    item.status.forEach((status, i) => {
                        if (status) {
                            temp += item.values[i];
                        }
                    });
                    if (temp) {
                        this.dimensionSelected.push(temp);
                    }
                })
            },
            deletePriceBtn(id){
                this.deletePrice.show = true;
                this.deletePrice.id = id;
            },
            editPriceBtn(item, index){
                this.editPriceIndex = index;
                let ids = item.spec;
                this.editPrice.show = true;
                let name = '';
                ids.forEach((id) => {
                    this.data.spec_values.forEach((item) => {
                        if (id == item.id) {
                            name += item.name + ' ';
                        }
                    });
                });
                this.editPrice.priceParams = name;
                this.editPrice.priceData = JSON.parse(JSON.stringify(item));
                /*this.editPrice.priceData.imageKeys = [];
                this.editPrice.priceData.image_keys.forEach((item, i) => {
                    this.editPrice.priceData.imageKeys.push({
                        id: i + 1,
                        val: item
                    });
                });*/
            },
        },
        events: {
            'click-positive-button'() {
                this.$http.delete('/api/v2/admin/products/delete-price?price_id=' + this.deletePrice.id)
                    .then((dt) => {
                        if (dt.data.result == 0) {
                            this.$route.router.go({ path: '/soyyin/products/'});
                        }
                    });
            },
            'update-price'(newPriceData){
                //location.reload();
                //更新价格ID和价格
                this.priceData[this.editPriceIndex].id = newPriceData.id;
                this.priceData[this.editPriceIndex].price = newPriceData.price;
            },
            'update-num-key'(newPriceData){
                //TODO 更新起做数和图片key（轮播去掉自动播放或重新初始化）
                console.log(newPriceData);
                this.priceData[this.editPriceIndex].min_quantity = newPriceData.min_quantity;
                this.priceData[this.editPriceIndex].image_keys = newPriceData.image_keys;
            },
        },
        ready(){
            //TODO 测试数据  正式的需要删除
            setTimeout(() => {
                this.data.prices.forEach((item) => {
                    item['image_keys'] = this.data['image_keys'];
                });
            }, 1000);
        }
    }
</script>

<style scoped>
    .pre, .next {
        position: absolute;
        cursor: pointer;
        top: 45px;
        font-size: 40px;
    }

    .next {
        right: 0;
    }

    .price-img-item {
        display: inline-block;
        height: 180px;
        width: 150px;
    }

    .price-img-carousel {
        position: relative;
        width: 200px;
        height: 180px;
        overflow: hidden;
        padding: 0;
        margin: 0 auto;
    }

    .price-img-item img {
        width: 150px;
        height: 150px;
    }

    .table > thead > tr > th, .table > tbody > tr > td {
        vertical-align: middle;
    }

    table.table-bordered a {
        text-decoration: none;
    }

    td, th {
        text-align: center;
    }

    .middle {
        vertical-align: middle;
    }

    .ml20 {
        margin-left: 20px;
    }

    .ml30 {
        margin-left: 30px;
    }

    .pointer {
        cursor: pointer;
    }

    .dimension li.inline-block {
        border: 2px solid #ecf0f1;
        margin-right: 30px;
        padding: 0 10px;
        cursor: pointer;
    }

    .dimension li.inline-block.red {
        border-color: red;
    }

    .dimension-title {
        text-align: right;
        width: 100px;
    }

    .dimension {
        height: 38px;
        line-height: 38px;
        margin: 20px 0;
    }

    .inline-block {
        display: inline-block;
    }

    .copy-key {
        margin: 20px 40px;
    }

    .image-keys {
        margin-top: 15px;
    }

    .image-keys li {
        margin-right: 50px;
        display: inline-block;
        height: 200px;
        width: 200px;
    }

    li {
        list-style-type: none;
    }

    .image-keys li img {
        height: 200px;
        width: 200px;
    }

    .mt10 {
        margin-top: 10px;
    }

    .mt20 {
        margin-top: 20px;
    }

    .ml50 {
        margin-left: 50px;
    }

    .bold {
        font-weight: bold;
    }

    .panel-heading {
        padding: 4px 15px;
    }

    .panel-title {
        margin: 6px 0;
        display: inline-block;
    }
</style>