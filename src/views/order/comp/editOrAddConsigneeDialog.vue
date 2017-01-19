<!-- editOrAddConsigneeDialog.vue -->
<template>
    <div class="modal" v-show="show">
    	<div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" @click="closeDialog">&times;</button>
                    <h4 class="modal-title">{{title}}</h4>
                </div>
                <div class="modal-body">
                	<form class="form-horizontal">
		                <div class="form-group">
		                    <label class="col-lg-3 control-label" for="consigneeName">收货人姓名<span class="text-danger">*</span>：</label>
		                    <div class="col-lg-3">
		                        <input class="form-control input-sm" id="consigneeName" type="text" v-model="data.name">
		                    </div>
		                </div>
		                <div class="form-group">
		                    <label class="col-lg-3 control-label" for="consigneePhone">手机号码<span class="text-danger">*</span>：</label>
		                    <div class="col-lg-3">
		                        <input class="form-control input-sm" id="consigneePhone" type="text" v-model="data.phone">
		                    </div>
		                </div>
		                <div class="form-group">
		                    <label class="col-lg-3 control-label" for="consigneeAddress">地址<span class="text-danger">*</span>：</label>
		                    <select-region :regions="data.regions"></select-region>
		                </div>
		                <div class="form-group">
		                	<label class="col-lg-3 control-label"></label>
		                	<div class="col-lg-8">
		                        <input class="form-control input-sm" id="consigneeAddress" type="text" placeholder="详细地址" v-model="data.address">
		                    </div>
		                </div>
		                <div class="form-group">
		                    <label class="col-lg-3 control-label" for="consigneePost">邮编：</label>
		                    <div class="col-lg-3">
		                        <input class="form-control input-sm" id="consigneePost" type="text" v-model="data.post_code">
		                    </div>
		                </div>
		                <div class="form-group">
		                    <label class="col-lg-3 control-label" for="consigneeRemark">收货备注：</label>
		                    <div class="col-lg-8">
		                        <input class="form-control input-sm" id="consigneeRemark" type="text" v-model="data.remark">
		                    </div>
		                </div>
		            </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" :disabled="!buttonEnabled" @click="confirmSubmit">确定</button>
                </div>
            </div>
        </div>
        <popup-tips :show.sync="dataForPopupTips.show" :tips-type="dataForPopupTips.type" :tips-title="dataForPopupTips.title" :tips-content="dataForPopupTips.content"></popup-tips>
    </div>
</template>

<script>
import popupTips from '../../../components/popupTips.vue'
import selectRegion from '../../../components/selectRegion.vue'
import { callback } from '../../../store'
import { orderValidator } from '../../../store/dataValidator.js'

export default {
    name: 'EditOrAddConsigneeDialogView',
    components: {
        popupTips,
        selectRegion,
    },
    props: ['show', 'data'],
    data() {
        return {
        	buttonEnabled: true,
            regions: null,
            dataForPopupTips: {
                show: false,
                type: 'danger',
                title: '',
                content: '',
            },
        }
    },
    computed: {
        title() {
            if (this.data.orderConsigneeId) {
                return '编辑收货地址';
            } else {
                return '新增收货地址';
            }
        },
    },
    events: {
        'select-region'(region) {
            this.data.region_id = region.region;
            this.regions = region.all_regions;
        }
    },
    methods: {
    	validateConsignee() {
            var result = orderValidator.validateConsigneeName(this.data.name);
            if (!result.ok) {
                return result.errorMsg;
            }
            result = orderValidator.validateConsigneePhone(this.data.phone);
            if (!result.ok) {
                return result.errorMsg;
            }
            result = orderValidator.validateConsigneeAddress(this.data.region_id, this.data.address);
            if (!result.ok) {
                return result.errorMsg;
            }
            return;
        },
        confirmSubmit() {
            if (this.buttonEnabled) {
                this.buttonEnabled = false;
                if (this.data.orderConsigneeId) {
                    this.editConsignee();
                } else {
                    this.addConsignee();
                }
            }
        },
        addConsignee() {
        	var result = this.validateConsignee();
            if(result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                this.buttonEnabled = true;
                return;
            }
            var data = {
                name: this.data.name,
                phone: this.data.phone,
                region_id: this.data.region_id,
                address: this.data.address,
                post_code: this.data.post_code,
                remark: this.data.remark,
            };
            var url = '/api/v2/admin/orders/add-consignee?order_id=' + this.data.orderId;
            this.submitToServer('add-consignee', url, data, null, this.regions);
        },
    	editConsignee() {
            var result = this.validateConsignee();
            if(result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                this.buttonEnabled = true;
                return;
            }
            var data = {
                name: this.data.name,
                phone: this.data.phone,
                region_id: this.data.region_id,
                address: this.data.address,
                post_code: this.data.post_code,
                remark: this.data.remark,
            };
            var url = '/api/v2/admin/orders/update-consignee?id=' + this.data.orderConsigneeId;
            this.submitToServer('edit-consignee', url, data, this.data.orderConsigneeId, this.regions);
        },
        submitToServer(type, url, data, id, regions) {
            this.$http.put(url, data)
            .then((response) => {
                if(!response.data.result || response.data.result === 0) {
                    if (!id) {
                        id = response.data.id;
                    }
                    var result = {
                        id: id,
                        data: data,
                    };
                    result.data.regions = regions;
                    this.show = false;
                    this.$dispatch(type, result);
                } else {
                    callback.success(response.data);
                }
                this.buttonEnabled = true;
            },(response) => {
                callback.error(response);
                this.buttonEnabled = true;
            });
        },
    	closeDialog() {
            this.show = false;
        },
    }
}
</script>

<style scoped>
.modal {
    height: 100%;
}

.modal-dialog {
    top: 20%;
}

</style>