<!-- editInvoiceInfoComponent.vue -->
<template>
	<div class="row">
		<div class="col-md-6">
            <div class="form-group">
                <label class="control-label" for="invoiceAmount">开票金额<span class="text-danger">*</span></label>
                <input class="form-control" style="width:30%;" id="invoiceAmount" type="text" v-model="invoiceData.amount | priceFilter">
            </div>
            <div class="form-group">
                <label class="control-label" for="invoiceContent">开票内容<span class="text-danger">*</span></label>
                <select class="form-control" style="width:30%;" id="invoiceContent" v-model="invoiceData.content">
                    <option>制作费</option>
                    <option>服务费</option>
                    <option>会议服务费</option>
                    <option>设计费</option>
                    <option>代理费</option>
                    <option>文化咨询费</option>
                </select>
            </div>
            <div class="form-group">
                <label class="control-label" for="invoiceType">发票类型<span class="text-danger">*</span></label>
                <select class="form-control" style="width:30%;" id="invoiceType" v-model="invoiceData.zengzhishui | formatInvoiceType" number>
                    <option value="1">普通发票</option>
                    <option value="2">增值税发票</option>
                </select>
            </div>
            <div class="form-group">
                <label class="control-label" for="invoiceTitle">开票抬头<span class="text-danger">*</span></label>
                <input class="form-control" style="width:50%;" id="invoiceTitle" type="text" v-model="invoiceData.title">
            </div>
            <div v-if="invoiceData.zengzhishui">
                <div class="form-group">
                    <label class="control-label" for="invoiceZZSIdentifier">纳税人识别号<span class="text-danger">*</span></label>
                    <input class="form-control" style="width:50%;" id="invoiceZZSIdentifier" type="text" v-model="invoiceData.zengzhishui.identifier">
                </div>
                <div class="form-group">
                    <label class="control-label" for="invoiceZZSAddress">注册地址<span class="text-danger">*</span></label>
                    <input class="form-control" style="width:50%;" id="invoiceZZSAddress" type="text" v-model="invoiceData.zengzhishui.address">
                </div>
                <div class="form-group">
                    <label class="control-label" for="invoiceZZSPhone">电话<span class="text-danger">*</span></label>
                    <input class="form-control" style="width:50%;" id="invoiceZZSPhone" type="text" v-model="invoiceData.zengzhishui.phone">
                </div>
                <div class="form-group">
                    <label class="control-label" for="invoiceZZSBank">开户行<span class="text-danger">*</span></label>
                    <input class="form-control" style="width:50%;" id="invoiceZZSBank" type="text" v-model="invoiceData.zengzhishui.bank">
                </div>
                <div class="form-group">
                    <label class="control-label" for="invoiceZZSAccount">账号<span class="text-danger">*</span></label>
                    <input class="form-control" style="width:50%;" id="invoiceZZSAccount" type="text" v-model="invoiceData.zengzhishui.account">
                </div>
            </div>
            <div class="form-group">
                <label class="control-label" for="invoiceRemark">备注</label>
                <input class="form-control" style="width:80%;" id="invoiceRemark" type="text" v-model="invoiceData.remark">
            </div>
        </div>
        <div class="col-md-6">
            <h4>发票寄送至：</h4>
            <p v-for="consignee of consignees">
                <a class="use-consignee-info btn-link" @click="useConsigneeInfo(consignee)">使用收货人{{$index + 1}}信息</a>
            </p>
            <div class="form-group">
                <label class="control-label" for="invoiceConsigneeName">收货人<span class="text-danger">*</span></label>
                <input class="form-control" style="width:30%;" id="invoiceConsigneeName" type="text" v-model="invoiceData.consignee_name">
            </div>
            <div class="form-group">
                <label class="control-label" for="invoiceConsigneePhone">联系方式<span class="text-danger">*</span></label>
                <input class="form-control" style="width:30%;" id="invoiceConsigneePhone" type="text" v-model="invoiceData.consignee_phone">
            </div>
            <div class="form-group">
                <label class="control-label" for="invoiceConsigneeAddress">收货地址<span class="text-danger">*</span></label>
                <input class="form-control" style="width:80%;" id="invoiceConsigneeAddress" type="text" v-model="invoiceData.address">
            </div>
        </div>
	</div>
</template>

<script>
export default {
    name: 'InvoiceInfoComponentView',
    props: ['invoiceData', 'consignees'],
    filters: {
        formatInvoiceType: {
            read(val) {
                return val ? 2 : 1;
            },
            write(val, oldVal) {
                if (val == 1) {
                    return undefined;
                } else {
                    return {};
                }
            },
        }
    },
    methods: {
        useConsigneeInfo(consignee) {
            this.invoiceData.consignee_name = consignee.name;
            this.invoiceData.consignee_phone = consignee.phone;
            if (consignee.fullRegionName && consignee.address) {
                this.invoiceData.address = consignee.fullRegionName + consignee.address;
            } else {
                this.invoiceData.address = '';
            }
        },
    },
}
</script>

<style scope>
.use-consignee-info.btn-link {
    text-decoration: none;
    cursor: pointer;
}

.use-consignee-info.btn-link:hover {
    text-decoration: underline;
}
</style>