<!-- payQrCodeDialog.vue -->
<template>
    <div class="modal" v-show="show">
        <div class="modal-dialog" style="width:320px;">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" @click="closeDialog">&times;</button>
                    <h4 class="modal-title">{{title}}</h4>
                </div>
                <div class="modal-body">
                	<h4>应付金额：<span style="font-size:20px;color:#f54404">{{data.amountToPay | realPrice}}</span>元</h4>
                	<br>
                	<div id="qrcode_pay">
                	</div>
                	<br>
                	<p class="text-danger">{{description}}</p>
                	<p>支付完成后请手动刷新订单</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'payQrCodeDialogView',
    data() {
        return {
        }
    },
    computed: {
        title() {
            if (this.data.type === 'WECHAT_QR') {
                return '微信扫码支付';
            } else {
            	return '支付宝扫码支付';
            }
        },
        description() {
        	if (this.data.type === 'WECHAT_QR') {
                return '使用微信扫一扫，扫描二维码支付';
            } else {
            	return '使用支付宝扫一扫，扫描二维码支付';
            }
        },
    },
    props: ['show', 'data'],
    watch: {
    	show(val, oldVal) {
            if (val) {
            	$("#qrcode_pay").html('').qrcode({
                    width: 280,
                    height: 280,
                    text: this.data.qrCodeUrl,
                });
            }
        },
    },
    methods: {
    	closeDialog() {
            this.show = false;
        },
    },
}

</script>

<style scoped>
.modal {
    height: 100%;
}

.modal-dialog {
    top: 15%;
}
</style>