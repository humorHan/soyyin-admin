<!-- recordLogisticsDialog.vue -->
<template>
    <div class="modal" v-show="show">
    	<div class="modal-dialog">
            <div class="modal-content">
            	<div class="modal-header">
                    <button type="button" class="close" @click="closeDialog">&times;</button>
                    <h4 class="modal-title">物流信息录入</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="deliveryMethod">配送方式<span class="text-danger">*</span>：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="deliveryMethod" type="text" v-model="data.deliveryMethod">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="express">快递公司<span class="text-danger">*</span>：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="express" type="text" v-model="data.express">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="expressOrderId">快递单号<span class="text-danger">*</span>：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="expressOrderId" type="text" v-model="data.expressOrderId">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="logisticsCost">物流成本<span class="text-danger">*</span>：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="logisticsCost" type="text" v-model="data.logisticsCost | priceFilter">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="logisticsRemark">备注：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="logisticsRemark" type="text" v-model="data.logisticsRemark">
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
import { callback } from '../../../store'
import { orderValidator } from '../../../store/dataValidator.js'

export default {
    name: 'RecordLogisticsDialogView',
    components: {
        popupTips,
    },
    props: ['show', 'data', 'passingData'],
    data() {
        return {
        	buttonEnabled: true,
            dataForPopupTips: {
                show: false,
                type: 'danger',
                title: '',
                content: '',
            },
        }
    },
    methods: {
    	validateLogisticsInfo() {
            var result;
            var infoName = ["配送方式", "快递公司", "快递单号"];
            var infoData = [this.data.deliveryMethod, this.data.express, this.data.expressOrderId];
            for (let i = 0; i < infoName.length; i++) {
                result = orderValidator.validateLogisticsItem(infoName[i], infoData[i]);
                if (!result.ok) {
                    return result.errorMsg;
                }
            }
            result = orderValidator.validateLogisticsCost(this.data.logisticsCost);
            if (!result.ok) {
                return result.errorMsg;
            }
            return;
        },
        confirmSubmit() {
            if (this.buttonEnabled) {
                this.buttonEnabled = false;
                this.addLogistics();
            }
        },
        addLogistics() {
        	var result = this.validateLogisticsInfo();
            if(result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                this.buttonEnabled = true;
                return;
            }
            var url = '/api/v2/admin/logistics/add?consignee_id=' + this.data.consigneeId;
            var data = {
                delivery_method: this.data.deliveryMethod,
                express: this.data.express,
                express_order_id: this.data.expressOrderId,
                cost: this.data.logisticsCost,
                remark: this.data.logisticsRemark,
            };
            this.$http.post(url, data)
            .then((response) => {
                if(!response.data.result || response.data.result === 0) {
                    this.show = false;
                    this.$dispatch('add-logistics', data, this.data.passingData);
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