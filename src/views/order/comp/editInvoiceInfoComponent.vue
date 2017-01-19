<!-- editInvoiceInfoComponent.vue -->
<template>
    <div class="panel panel-default">
        <div class="panel-body">
            <div class="checkbox">
                <label>
                    <input type="checkbox" v-model="editInvoiceChecked">填写发票信息
                </label>
            </div>
            <invoice-info-component :invoice-data="invoiceData" :consignees="consignees" v-show="editInvoiceChecked">
            </invoice-info-component>
        </div>
    </div>
</template>

<script>
import invoiceInfoComponent from './invoiceInfoComponent.vue'

export default {
    name: 'EditInvoiceInfoComponentView',
    components: {
        invoiceInfoComponent,
    },
    props: ['editInvoiceChecked', 'invoiceData', 'consignees'],
}
</script>