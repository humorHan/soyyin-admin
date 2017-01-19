<!-- editExtraCostDialog.vue -->
<template>
    <div class="modal" v-show="show">
    	<div class="modal-dialog" style="width:400px;">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" @click="closeDialog">&times;</button>
                    <h4 class="modal-title">额外成本</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal">
		                <div class="form-group">
		                    <label class="col-lg-4 control-label" for="extraCost">额外成本<span class="text-danger">*</span>：</label>
		                    <div class="col-lg-8">
		                        <input class="form-control input-sm" id="extraCost" type="text" v-model="data.extra_cost | priceFilter">
		                    </div>
		                </div>
		                <div class="form-group">
		                    <label class="col-lg-4 control-label" for="extraCostRemark">备注：</label>
		                    <div class="col-lg-8">
		                        <input class="form-control input-sm" id="extraCostRemark" type="text" v-model="data.extra_cost_remark">
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
    name: 'EditExtraCostDialogView',
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
    	validateExtraCost() {
            var result = orderValidator.validateExtraCost(this.data.extra_cost);
            if (!result.ok) {
                return result.errorMsg;
            }
            return;
        },
        confirmSubmit() {
            if (this.buttonEnabled) {
                this.buttonEnabled = false;
                this.editExtraCost();
            }
        },
    	editExtraCost() {
            var result = this.validateExtraCost();
            if(result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                this.buttonEnabled = true;
                return;
            }
            var data = {
                extra_cost: this.data.extra_cost,
                extra_cost_remark: this.data.extra_cost_remark,
            };
            var url = '/api/v2/admin/orders/update-extra-cost?order_id=' + this.data.orderId;
            this.$http.put(url, data)
            .then((response) => {
                if(!response.data.result || response.data.result === 0) {
                    this.show = false;
                    this.$dispatch('edit-extra-cost');
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