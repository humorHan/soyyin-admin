<!-- productDetailDialog.vue -->
<template>
    <div class="modal" v-show="show">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" @click="hideDialog">&times;</button>
                    <h4 class="modal-title">非标品详情</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-3">产品名称：</div>
                        <div class="col-md-9">{{detail.name}}</div>
                    </div>
                    <div class="row">
                        <div class="col-md-3">数量：</div>
                        <div class="col-md-9">{{detail.quantity}}</div>
                    </div>
                    <div class="row">
                        <div class="col-md-3">产品尺寸：</div>
                        <div class="col-md-9">{{detail.size}}</div>
                    </div>
                    <div class="row">
                        <div class="col-md-3">材质：</div>
                        <div class="col-md-9">{{detail.caizhi}}</div>
                    </div>
                    <div class="row">
                        <div class="col-md-3">其他要求：</div>
                        <div class="col-md-9">{{detail.others}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProductDetailDialogView',
    props: ['show', 'detail'],
    methods: {
        hideDialog() {
            this.show = false;
            this.$dispatch('hide-product-detail-dialog');
        }
    },
}
</script>

<style>
.modal {
    height: 100%;
}

.modal-dialog {
    top: 30%;
}
</style>