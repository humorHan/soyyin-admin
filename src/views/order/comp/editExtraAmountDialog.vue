<!-- editExtraAmountDialog.vue -->
<template>
    <div class="modal" v-show="show">
    	<div class="modal-dialog" style="width:400px;">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" @click="closeDialog">&times;</button>
                    <h4 class="modal-title">订单补充金额</h4>
                </div>
                <div class="modal-body">
                    <h5>补充金额必须大于{{data.minExtraAmount | realPrice}}元</h5>
                	<form class="form-horizontal">
		                <div class="form-group">
		                    <label class="col-lg-4 control-label" for="extraAmount">补充金额<span class="text-danger">*</span>：</label>
		                    <div class="col-lg-8">
		                        <input class="form-control input-sm" id="extraAmount" type="text" v-model="data.extraAmount | priceFilter">
		                    </div>
		                </div>
		                <div class="form-group">
		                    <label class="col-lg-4 control-label" for="extraAmountRemark">备注：</label>
		                    <div class="col-lg-8">
		                        <input class="form-control input-sm" id="extraAmountRemark" type="text" v-model="data.extraAmountRemark">
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
    name: 'EditExtraAmountDialogView',
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
    	validateExtraAmount() {
            var result = orderValidator.validateExtraAmount(this.data.extraAmount, this.data.minExtraAmount);
            if (!result.ok) {
                return result.errorMsg;
            }
            return;
        },
        confirmSubmit() {
            if (this.buttonEnabled) {
                this.buttonEnabled = false;
                this.editExtraAmount();
            }
        },
    	editExtraAmount() {
            var result = this.validateExtraAmount();
            if(result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                this.buttonEnabled = true;
                return;
            }
            var data = {
                freight: this.data.extraAmount,
                freight_remark: this.data.extraAmountRemark,
            };
            var url = '/api/v2/admin/orders/update-freight?order_id=' + this.data.orderId;
            this.$http.put(url, data)
            .then((response) => {
                if(!response.data.result || response.data.result === 0) {
                    this.show = false;
                    this.$dispatch('edit-extra-amount');
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
    top: 30%;
}

</style>