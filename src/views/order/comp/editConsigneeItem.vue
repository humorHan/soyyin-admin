<!-- editConsigneeItem.vue -->
<template>
    <div class="panel panel-default">
        <div class="panel-body">
            <a v-show="length > 1" class="pull-right btn btn-warning" @click="deleteConsignee(item)">删除</a>
            <h4>收货人{{index + 1}}</h4>
            <div class="clearfix"></div>
            <form class="form-horizontal">
                <div class="form-group">
                    <label class="col-lg-2 control-label" for="consigneeName{{index + 1}}">收货人姓名<span class="text-danger">*</span>：</label>
                    <div class="col-lg-3">
                        <input class="form-control input-sm" id="consigneeName{{index + 1}}" type="text" v-model="item.name">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-2 control-label" for="consigneePhone{{index + 1}}">手机号码<span class="text-danger">*</span>：</label>
                    <div class="col-lg-3">
                        <input class="form-control input-sm" id="consigneePhone{{index + 1}}" type="text" v-model="item.phone">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-2 control-label" for="consigneeAddress{{index + 1}}">地址<span class="text-danger">*</span>：</label>
                    <select-region :regions="item.regions ? item.regions : []"></select-region>
                    <div class="col-lg-4">
                        <input class="form-control input-sm" id="consigneeAddress{{index + 1}}" type="text" placeholder="详细地址" v-model="item.address">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-2 control-label" for="consigneePost{{index + 1}}">邮编：</label>
                    <div class="col-lg-3">
                        <input class="form-control input-sm" id="consigneePost{{index + 1}}" type="text" v-model="item.post_code">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-lg-2 control-label" for="consigneeRemark{{index + 1}}">收货备注：</label>
                    <div class="col-lg-6">
                        <input class="form-control input-sm" id="consigneeRemark{{index + 1}}" type="text" v-model="item.remark">
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import selectRegion from '../../../components/selectRegion.vue'

export default {
    name: 'EditConsigneeItemView',
    components: {
        selectRegion,
    },
    props: ['item','length','index'],
    data() {
        return {
        }
    },
    events: {
        'select-region'(region) {
            var result = {
                target: this.item,
                data: {
                    regionId: region.region,
                    allRegions: region.all_regions,
                }
            };
            this.$dispatch('edit-consignee-region', result);
        }
    },
    methods: {
        deleteConsignee(item) {
            this.$dispatch('delete-consignee', item)
        },
    }
}
</script>