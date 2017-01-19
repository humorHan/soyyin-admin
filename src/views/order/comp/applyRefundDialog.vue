<!-- applyRefundDialog.vue -->
<template>
    <div class="modal" v-show="show">
    	<div class="modal-dialog">
            <div class="modal-content">
            	<div class="modal-header">
                    <button type="button" class="close" @click="closeDialog">&times;</button>
                    <h4 class="modal-title">申请退款</h4>
                </div>
                <div class="modal-body">
                    <h5>可退金额最多为{{data.maxRefundValue | realPrice}}元</h5>
                    <form class="form-horizontal">
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="refundAmount">退款金额<span class="text-danger">*</span>：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="refundAmount" type="text" v-model="data.refundAmount | priceFilter">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="refundMethod">退款渠道<span class="text-danger">*</span>：</label>
                            <div class="col-lg-6">
                                <select class="form-control input-sm" id="refundMethod" v-model="data.refundMethod">
                                    <option value="BANK_TRANSFER">银行转账</option>
                                    <option value="ALIPAY_TRANSFER">支付宝转账</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="refundAccount">对方账号<span class="text-danger">*</span>：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="refundAccount" type="text" v-model="data.refundAccount">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="refundName">对方名称：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="refundName" type="text" v-model="data.refundName">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="refundReason">退款原因<span class="text-danger">*</span>：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="refundReason" type="text" v-model="data.refundReason">
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
    name: 'ApplyRefundDialogView',
    components: {
        popupTips,
    },
    props: ['show', 'data'],
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
    	validateRefundInfo() {
            var result = orderValidator.validateRefundAmount(this.data.refundAmount, this.data.maxRefundValue);
            if (!result.ok) {
                return result.errorMsg;
            }
            if (!this.data.refundMethod) {
                return '请选择退款渠道';
            }
            result = orderValidator.validateRefundAccount(this.data.refundAccount);
            if (!result.ok) {
                return result.errorMsg;
            }
            result = orderValidator.validateRefundReason(this.data.refundReason);
            if (!result.ok) {
                return result.errorMsg;
            }
            return;
        },
        confirmSubmit() {
            if (this.buttonEnabled) {
                this.buttonEnabled = false;
                this.addRefund();
            }
        },
        addRefund() {
        	var result = this.validateRefundInfo();
            if(result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                this.buttonEnabled = true;
                return;
            }
            var url = '/api/v2/admin/refunds/create?order_id=' + this.data.orderId;
            var data = {
                amount: this.data.refundAmount,
                method: this.data.refundMethod,
                account: this.data.refundAccount,
                name: this.data.refundName,
                reason: this.data.refundReason,
            };
            this.$http.post(url, data)
            .then((response) => {
                if(!response.data.result || response.data.result === 0) {
                    this.show = false;
                    this.$dispatch('apply-refund');
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