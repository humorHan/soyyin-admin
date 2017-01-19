<!-- applyInvoiceDialog.vue -->
<template>
    <div class="modal" v-show="show">
        <div class="modal-dialog" style="width:400px; top:30%;" v-show="!showInvoiceInfoDialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" @click="closeDialog">&times;</button>
                    <h4 class="modal-title">开票申请</h4>
                </div>
                <div class="modal-body">
                    <h5>订单剩余未开票金额：{{maxApplyAmount | realPrice}}元</h5>
                    <form class="form-horizontal">
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="applyInvoiceAmount">使用额度<span class="text-danger">*</span>：</label>
                            <div class="col-lg-8">
                                <input class="form-control input-sm" id="applyInvoiceAmount" type="text" v-model="applyInvoiceAmount | priceFilter">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="clickToNextStep">下一步</button>
                </div>
            </div>
        </div>
        <div class="modal-dialog" style="width:1000px; top:10%;" v-show="showInvoiceInfoDialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" @click="closeDialog">&times;</button>
                    <h4 class="modal-title">开票信息</h4>
                </div>
                <div class="modal-body" style="height:480px;overflow-y:auto;">
                    <invoice-info-component :invoice-data="invoiceInfo" :consignees="[]">
                    </invoice-info-component>
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
import invoiceInfoComponent from './invoiceInfoComponent.vue'
import popupTips from '../../../components/popupTips.vue'
import { callback } from '../../../store'
import { orderValidator } from '../../../store/dataValidator.js'

export default {
    name: 'ApplyInvoiceDialogView',
    components: {
        invoiceInfoComponent,
        popupTips,
    },
    data() {
        return {
            showInvoiceInfoDialog: false,
            applyInvoiceAmount: '',
            buttonEnabled: true,
            dataForPopupTips: {
                show: false,
                type: 'danger',
                title: '',
                content: '',
            },
        }
    },
    props: ['show', 'orderIds', 'invoiceInfo', 'maxApplyAmount'],
    methods: {
        validateApplyInvoiceAmount() {
            var result = orderValidator.validateApplyInvoiceAmount(this.applyInvoiceAmount, this.maxApplyAmount);
            if (!result.ok) {
                return result.errorMsg;
            }
            return;
        },
        validateInvoiceInfo() {
            var result = orderValidator.validateInvoiceAmount(this.invoiceInfo.amount);
            if (!result.ok) {
                return result.errorMsg;
            }
            var infoName = ["开票内容", "开票抬头", "发票收货人", "发票收货人联系方式", "发票收货人收货地址"];
            var infoData = [this.invoiceInfo.content, this.invoiceInfo.title, this.invoiceInfo.consignee_name, this.invoiceInfo.consignee_phone, this.invoiceInfo.address];
            for (let i = 0; i < infoName.length; i++) {
                result = orderValidator.validateInvoiceItem(infoName[i], infoData[i]);
                if (!result.ok) {
                    return result.errorMsg;
                }
            }
            if (this.invoiceInfo.zengzhishui) {
                infoName = ["发票信息中纳税人识别号", "发票信息中注册地址", "发票信息中电话", "发票信息中开户行", "发票信息中账号"];
                infoData = [this.invoiceInfo.zengzhishui.identifier, this.invoiceInfo.zengzhishui.address, this.invoiceInfo.zengzhishui.phone, this.invoiceInfo.zengzhishui.account, this.invoiceInfo.zengzhishui.bank];
                for (let i = 0; i < infoName.length; i++) {
                    result = orderValidator.validateInvoiceItem(infoName[i], infoData[i]);
                    if (!result.ok) {
                        return result.errorMsg;
                    }
                }
            }
            return;
        },
        clickToNextStep() {
            var result = this.validateApplyInvoiceAmount();
            if (result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                return;
            }
            this.showInvoiceInfoDialog = true;
        },
        confirmSubmit() {
            if (this.buttonEnabled) {
                this.buttonEnabled = false;
                this.applyInvoice();
            }
        },
        applyInvoice() {
            var result = this.validateInvoiceInfo();
            if (result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                this.buttonEnabled = true;
                return;
            }
            var params = '';
            for (let i = 0; i < this.orderIds.length; i++) {
                if (i !== 0) {
                    params += "&order_id=" + this.orderIds[i];
                } else {
                    params += "order_id=" + this.orderIds[i];
                }
            }
            var data = {
                amount: this.applyInvoiceAmount,
                data: this.invoiceInfo,
            };
            var url = '/api/v2/admin/invoices/create?' + params;
            this.$http.post(url, data)
            .then((response) => {
                if(!response.data.result || response.data.result === 0) {
                    this.applyInvoiceAmount = '';
                    this.show = false;
                    this.showInvoiceInfoDialog = false;
                    this.$dispatch('apply-invoice');
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
            this.applyInvoiceAmount = '';
            this.show = false;
            this.showInvoiceInfoDialog = false;
        },
    }
}
</script>

<style scoped>
.modal {
    height: 100%;
}
</style>