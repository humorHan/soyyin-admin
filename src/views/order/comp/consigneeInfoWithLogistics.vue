<!-- consigneeInfoWithLogistics.vue -->
<template>
	<div class="panel panel-default">
        <div class="panel-body">
            <div class="row">
                <div class="col-lg-6">
                    <h4>收货人{{index + 1}}</h4>
                    <div class="row" style="margin: 0;">
                        <label class="pull-left">收货人姓名：</label>
                        <p class="pull-left" style="width: 80%;">{{consigneeItem.name}}</p>
                    </div>
                    <div class="row" style="margin: 0;">
                        <label class="pull-left">手机号码：</label>
                        <p class="pull-left" style="width: 80%;">{{consigneeItem.phone}}</p>
                    </div>
                    <div class="row" style="margin: 0;">
                        <label class="pull-left">收货地址：</label>
                        <p class="pull-left" style="width: 80%;">{{consigneeItem.full_address}}</p>
                    </div>
                    <div class="row" style="margin: 0;" v-if="consigneeItem.post_code">
                        <label class="pull-left">邮编：</label>
                        <p class="pull-left" style="width: 80%;">{{consigneeItem.post_code}}</p>
                    </div>
                    <div class="row" style="margin: 0;" v-if="consigneeItem.remark">
                        <label class="pull-left">收货备注：</label>
                        <p class="pull-left" style="width: 80%;">{{consigneeItem.remark}}</p>
                    </div>
                </div>
                <div class="col-lg-6">
                	<a class="pull-right btn btn-info btn-sm" v-if="canAddLogistics" @click="clickToAddLogistics">录入</a>
                    <h4>物流信息</h4>
                    <p v-if="consigneeItem.logistics.length === 0">未发货，暂无物流信息</p>
                    <template v-else>
                        <div class="row" style="margin: 0;" v-for="item of consigneeItem.logistics">
                            <p class="pull-left">{{$index + 1}}、</p>
                            <p class="pull-left" style="width: 90%;">{{item.delivery_method}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.express}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.express_order_id}}<br>{{item.cost | realPrice}}元&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.create_time | dateFormat}}录入<br>{{item.remark}}</p>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConsigneeInfoWithLogisticsView',
    props: ['consigneeItem', 'canAddLogistics','index'],
    data() {
        return {
        }
    },
    methods: {
        clickToAddLogistics() {
            this.$dispatch('click-to-add-logistics', this.consigneeItem);
        },
    }
}
</script>