<!-- popupDialog.vue -->
<template>
    <div class="modal" v-show="priceShow">
        <div class="modal-dialog" style="top: 50%; transform: translateY(-50%);">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" @click="closeDialog">&times;</button>
                    <h4 class="modal-title">编辑价格</h4>
                </div>
                <div class="modal-body">
                    <div>{{priceName}}</div>
                    <div class="mtb10">
                        <label>
                            <input type="radio" name="change" class="form-control input-sm inline-block middle"
                                   value="true"
                                   v-model="isPriceShow">
                            <span class="inline-block middle ml5">价格</span>
                        </label>
                        <label @click="changeShow()" class="ml50">
                            <input type="radio" name="change" class="form-control input-sm inline-block middle"
                                   value="false"
                                   v-model="isPriceShow">
                            <span class="inline-block middle ml5">起做数及图片</span>
                        </label>
                    </div>
                    <div v-show="isPriceShowContent">
                        <span class="inline-block middle">价格：</span>
                        <input type="text" class="form-control input-sm inline-block middle" placeholder="单位：元"
                               v-model="priceData.price | priceFilter">
                    </div>
                    <div v-else>
                        <span class="inline-block middle">起做数：</span>
                        <input type="text" class="form-control input-sm inline-block middle" style="margin-left: 8px;"
                               v-model="priceData.min_quantity">
                        <div class="mt15">
                            <span class="inline-block top mt10">图片key：</span>
                            <ul class="inline-block top" style="padding: 0;">
                                <li class="key-item" id="father{{index}}" v-for="(index, item) of priceData.image_keys"
                                    track-by="Math.random()">
                                    <input type="text" class="form-control inline-block input-sm middle" v-model="item">
                                    <span class="inline-block pointer ml20" @click="deleteKey(index)">删除</span>
                                    <span class="uploadBtn inline-block pointer ml20" id="upload{{index}}">上传</span>
                                </li>
                                <li class="key-item">
                                    <span class="btn btn-info" @click="addKey()">添加key</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="clickPositiveButton">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import uploadUtil from '../../../util/util-plupload.js';

    export default {
        name: 'PopupDialogView',
        props: ['priceShow', 'priceData', 'priceName'],
        data(){
            return {
                isPriceShow: 'true',
                isPriceShowContent: true
            }
        },
        watch: {
            isPriceShow(){
                this.isPriceShowContent = !(this.isPriceShow == 'false');
            },
            priceShow(){
                if (this.priceShow) {
                    this.initUpload();
                }
            }
        },
        methods: {
            initUpload(){
                let tThis = this;
                $(".uploadBtn").map((i, dom) => {
                    uploadUtil($(dom)[0].id, function (key) {
                        tThis.priceData.image_keys.splice(i, 1, key);
                        tThis.$nextTick(function(){
                            tThis.initUpload()
                        });
                    }, undefined);
                });
            },
            changeShow(){
                this.isPriceShow == true ? this.isPriceShowContent = true : this.isPriceShowContent = false;
            },
            closeDialog(event) {
                this.priceShow = false;
            },
            clickPositiveButton(event) {
                if (this.isPriceShow == "true") {
                    this.changePrice();
                } else {
                    this.changeNumKey();
                }
            },
            addKey(){
                this.priceData.image_keys.push('');
                this.$nextTick(()=>{
                    this.initUpload();
                });
            },
            deleteKey(index){
                this.priceData.image_keys.splice(index, 1);
            },
            changePrice(){
                this.$http.put('/api/v2/admin/products/update-price-v2?price_id=' + this.priceData.id + '&price=' + this.priceData.price)
                    .then((dt) => {
                        if (dt.data.id) {
                            this.priceData.id = dt.data.id;
                            // 派发新id和对应价格数据
                            this.$dispatch('update-price', this.priceData);
                            this.priceShow = false;
                        }
                    });
            },
            changeNumKey(){
                let params = JSON.stringify({
                    image_keys: this.priceData.image_keys,
                    min_quantity: +this.priceData.min_quantity
                });
                this.$http.put('/api/v2/admin/products/update-price-images-v2?price_id=' + this.priceData.id, params)
                    .then((dt) => {
                        if (dt.data.result == 0) {
                            // 派发新id和对应价格数据
                            this.$dispatch('update-num-key', this.priceData);
                            this.priceShow = false;
                        }
                    });
            }
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

    .mtb10 {
        margin: 10px 0;
    }

    .top {
        vertical-align: top;
    }

    .mt10 {
        margin-top: 10px;
    }

    .ml20 {
        margin-left: 20px;
    }

    .mt15 {
        margin-top: 15px;
    }

    .pointer {
        cursor: pointer;
    }

    .middle {
        vertical-align: middle;
    }

    .inline-block {
        display: inline-block;
    }

    .key-item {
        margin-top: 10px;
    }

    input[type="radio"] {
        margin: 0;
    }

    .form-control {
        width: auto;
    }

    li {
        list-style-type: none;
    }

    .ml5 {
        margin-left: 5px;
    }

    .ml50 {
        margin-left: 50px;
    }
</style>