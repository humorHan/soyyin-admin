<template>
    <div class="container-fluid">
        <div v-if="permissionList.addProduct">
            <ul class="breadcrumb">
                <li>酱印网</li>
                <li>商品管理</li>
                <li>添加商品</li>
            </ul>
            <h2 class="handle">添加商品</h2>
            <div class="content">
                <div>
                    <h4>商品名称 <span class="red">*</span></h4>
                    <input v-model="name" class="form-control input-sm w200" type="text">
                </div>
                <div class="mt20">
                    <h4>所属分组 <span class="red">*</span></h4>
                    <label v-for="item in categories" class="category">
                        <input class="form-control input-sm" type="checkbox" value="{{item.id}}"
                               v-model="checkedCategoryIds">
                        <span class="sub">{{item.name}}</span>
                    </label>
                </div>
                <div class="mt20">
                    <h4>
                        封面图片
                        <span class="middle font14">分辨率要求：40 * 40px</span>
                    </h4>
                    <div class="upload-cover mt15" id="add-cover">+</div>
                </div>
                <div class="mt20">
                    <h4>
                        商品图片<span class="red">*</span>
                        <span class="middle font14">分辨率要求：800 * 800px</span>
                    </h4>
                    <ul class="products-wrap">
                        <li class="product-item" v-for="item of imgs" track-by="Math.random()">
                            <div class="upload" id="upload-img{{$index}}">{{{item | contentFilter}}}</div>
                            <div class="setFirst" v-if="$index != 0" @click="setFirst($index)">设为第一张</div>
                            <button type="button" class="close" @click="reduce(item, imgs)">×</button>
                        </li>
                    </ul>
                    <div class="btn btn-info" @click="addImgBtn" style="vertical-align: text-bottom;">添加商品图片</div>
                </div>
            </div>
            <div class="submit btn btn-info btn-lg pull-right mt20" @click="submit">提交</div>
            <popup :show.sync="pop.show" :tips-type="pop.type" :tips-title="pop.title" :tips-content="pop.content"></popup>
        </div>
    </div>
</template>

<script>
    import uploadUtil from '../../util/util-plupload';
    import cdn from '../../filters/cdnUrl.js';
    import popup from '../../components/popupTips.vue';
    import { permissionValidator } from '../../store/rolePermission.js'

    export default {
        data() {
            return {
                id: '',
                name: '',
                categories: [],
                checkedCategoryIds: [],
                oldCheckedCategoryIds: [],
                imgs: [''],
                permissionList: {
                    addProduct: permissionValidator.soyyinWebsite.products.addProduct(),
                },
                pop: {
                    show: false,
                    type: 'danger',
                    title: '',
                    content: ''
                }
            }
        },
        components: {
            popup
        },
        beforeCompile(){
            this.id = this.$route.params.id;
            if (this.id) {
                this.handle = '更新案例';
                this.$http.get('/api/v2/admin/products/detail-v2?id=' + this.id)
                    .then((dt) => {
                        $(".handle").html('编辑商品');
                        $(".submit").html('提交修改');
                        let data = dt.data;
                        this.name = data.name;
                        let categories = [];
                        data.categories.forEach((item) => {
                            categories.push(item.id + '');
                        });
                        this.checkedCategoryIds = categories;
                        this.oldCheckedCategoryIds = categories;
                        this.reChoose('add-cover', data.cover_key);
                        let arr = [];
                        data.image_keys.forEach((item, i) => {
                            arr.push('<img src="' + cdn + item + '" style="height: 100%; width: 100%;"/>');
                            this.$nextTick(function(){
                                $("#upload-img" + i).addClass("font0");
                                uploadUtil("upload-img" + i);
                            });
                        });
                        this.imgs = arr;
                    })
            }
        },
        ready(){
            this.getCategory();
            this.initUploadImgs();
            uploadUtil('add-cover');
        },
        filters: {
            contentFilter(item){
                return item ? item : '+';
            }
        },
        methods: {
            reChoose(dom, bg_key){
                if (bg_key) {
                    var $dom = $("#" + dom);
                    $dom.html('<img src="' + cdn + bg_key + '" width="' + $dom.width() + '" height="' + $dom.height() + '"/>').css("font-size", 0);
                }
            },
            submit(){
                var imgArr = [];
                var cover = $("#add-cover").find("img");
                var ids = [];
                this.checkedCategoryIds.forEach((item) => {
                    ids.push(+item);
                });
                var params = {
                    name: this.name,
                    category_ids: ids,
                    image_keys: imgArr
                };
                if (cover.length > 0) {
                    params.cover_key = cover.attr("src").substring(cover.attr("src").lastIndexOf('\/') + 1)
                }

                $(".upload").map((i, item) => {
                    if ($(item).find("img").length > 0) {
                        var temp = $(item).find("img").attr("src");
                        imgArr.push(temp.substring(temp.lastIndexOf('\/') + 1));
                    }
                });
                if (!this.name) {
                    this.wrongPop('请填写商品名称');
                    return false;
                }
                if (this.checkedCategoryIds.length == 0) {
                    this.wrongPop('请选择商品分组');
                    return false;
                }
                for(let i = 0, len = $(".upload").length; i < len; i++){
                    console.log($(".upload").find("img")[i]);
                    if (!$(".upload").find("img")[i]) {
                        this.wrongPop('请上传商品图片');
                        return false;
                    }
                }
                if (this.id) {
                    delete params.category_ids;
                    let oldIds = [], newIds = [];
                    this.oldCheckedCategoryIds.forEach((item) => {
                        oldIds.push(+item);
                    });
                    this.checkedCategoryIds.forEach((item) => {
                        newIds.push(+item);
                    });
                    params.old_category_ids = oldIds;
                    params.new_category_ids = newIds;
                    this.$http.put('/api/v2/admin/products/update-basic?id=' + this.id, JSON.stringify(params))
                        .then((data) => {
                            this.$route.router.go({ path: '/soyyin/products/'});
                        });
                } else {
                    this.$http.post('/api/v2/admin/products/create', JSON.stringify(params))
                        .then((data) => {
                            this.$route.router.go({ path: '/soyyin/products/'});
                        });
                }
            },
            getCategory(){
                this.$http.get('/api/v2/admin/products/category-brief-list')
                    .then((data) => {
                        this.categories = data.data.categories;
                    });
            },
            addImgBtn(){
                this.imgData();
                if (this.imgs.length < 5) {
                    this.imgs.push('');
                }
                this.$nextTick(function () {
                    this.initUploadImgs();
                });
            },
            initUploadImgs(){
                $(".upload").map((i, item) => {
                    if (!$(item).hasClass("initUpload")) {
                        uploadUtil($(item)[0].id);
                        $(item).addClass("initUpload");
                        if ($(item).find("img") && $(item).find("img").length > 0) {
                            $(item).addClass("font0");
                        } else {
                            $(item).css("font-size", "70px");
                        }
                    }
                });
            },
            reduce(item, arr){
                if (arr.length > 1) {
                    arr.$remove(item);
                    this.$nextTick(function(){
                        $(".upload").map((i, item) => {
                            if ($(item).find("img") && $(item).find("img").length > 0) {
                                $(item).addClass("font0");
                            } else {
                                $(item).css("font-size", "70px");
                            }
                        });
                    });
                }
            },
            imgData(){
                $(".upload").map((index, item) => {
                    var item = document.getElementsByClassName('upload')[index].innerHTML;
                    if (item.indexOf('+') >= 0) {
                        item = '';
                    }
                    if (item.indexOf('--') >= 0) {
                        this.imgs.$set(index, item.slice(0, item.indexOf('--') - 2));
                    } else {
                        this.imgs.$set(index, item);
                    }
                });
            },
            setFirst(index){
                this.imgData();
                let temp = this.imgs[index];
                this.imgs.$set(index, this.imgs[0]);
                this.imgs.$set(0, temp);
                this.$nextTick(function () {
                    this.initUploadImgs();
                })
            },
            wrongPop(content, title){
                this.pop.title = title || '输入有误';
                this.pop.content = content;
                this.pop.show = true;
            },
        }
    }
</script>

<style scoped>
    .red {
        color: red;
        vertical-align: sub;
    }

    .w200 {
        width: 200px;
    }

    .content {
        border: 1px solid #ecf0f1;
        padding: 30px;
    }

    .form-control {
        display: inline-block;
        width: auto;
        height: auto;
        vertical-align: middle;
    }
    .close{
        font-size: 30px;
        margin-right: 47px;
        margin-top: 10px;
        outline: none;
        color: #2c3e50;
    }
    .upload, .upload-cover {
        width: 112px;
        height: 112px;
        font-weight: bold;
        font-size: 70px;
        border: 2px solid #dce4ec;
        border-radius: 2px;
        color: #ecf0f1;
        text-align: center;
        cursor: pointer;
        vertical-align: middle;
        line-height: 100px;
    }

    .upload.font0 {
        font-size: 0;
    }

    .products-wrap {
        vertical-align: middle;
        margin-top: 5px;
        display: inline-block;
        padding: 0;
    }

    .products-wrap li {
        vertical-align: middle;
        position: relative;
        margin-right: 30px;
        display: inline-block;
        list-style-type: none;
    }

    .products-wrap li:hover .setFirst {
        display: block;
    }

    .setFirst {
        display: none;
        position: absolute;
        top: 90px;
        width: 108px;
        margin-left: 2px;
        cursor: pointer;
        z-index: 2;
        background: white;
        color: black;
        opacity: .7;
        text-align: center;
        font-size: 14px;
    }

    .sub {
        vertical-align: sub;
    }

    .category {
        margin-right: 20px;
    }

    .mt20 {
        margin-top: 20px;
    }

    .middle {
        vertical-align: middle;
    }

    .font14 {
        font-size: 14px;
    }

    .mt15 {
        margin-top: 15px;
    }
</style>