<template>
    <div class="container-fluid">
        <ul class="breadcrumb">
            <li>酱印网</li>
            <li>案例管理</li>
            <li>案例</li>
        </ul>
        <div class="panel panel-default">
            <div class="panel-heading">案例简介</div>
            <div class="panel-body">
                <div>
                    <span class="bold inline-block middle">案例背景</span>
                    <div class="case-bg-wrap inline-block ml10 middle">
                        <div class="upload-case-bg" id="upload-case-bg">+</div>
                    </div>
                </div>
                <div class="mt20">
                    <span class="bold inline-block middle">案例封面</span>
                    <div class="case-bg-wrap inline-block ml10 middle">
                        <div class="upload-case-bg" id="upload-case-small-bg">+</div>
                    </div>
                </div>
                <div class="mt20">
                    <span class="bold inline-block">案例标题</span>
                    <input class="case-name form-control input-sm ml10 inline-block" v-model="caseTitle" type="text"
                           placeholder="请输入案例标题">
                </div>
                <div class="mt20">
                    <span class="bold inline-block" style="margin-left: 15px;">副标题</span>
                    <input class="case-sub-name form-control input-sm ml10 inline-block" v-model="caseSubTitle"
                           type="text" placeholder="请输入案例副标题">
                </div>
                <div class="mt20">
                    <span class="bold inline-block">案例编号</span>
                    <select class="case-order form-control input-sm ml10 inline-block" v-model="order">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                    </select>
                </div>
                <div class="mt20">
                    <span class="bold inline-block middle">案例描述</span>
                    <textarea class="case-describe form-control inline-block ml10 middle" v-model="description"
                              cols="50" rows="5"></textarea>
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">物料品单</div>
            <div class="panel-body">
                <ul class="inline-block middle">
                    <li class="inline-block ml30 middle" v-for="item in materiels">
                        <input class="materiel form-control input-sm" type="text" style="width: 112px;"
                               placeholder="请输入物料名称" v-model="item.name">
                        <input class="materiel-url form-control input-sm mt20" type="text" style="width: 112px;"
                               placeholder="请输入跳转链接" v-model="item.url">
                        <div class="upload-materiel-wrap mt20">
                            <div class="upload-materiel" id="upload-materiel{{$index}}">+</div>
                        </div>
                        <button type="button" class="close" @click="reduce(item, materiels)">×</button>
                    </li>
                </ul>
                <div class="btn btn-info middle ml30" @click="addMateriel">增加物料</div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">设计项目</div>
            <div class="panel-body">
                <ul class="inline-block middle">
                    <li class="inline-block ml30 middle" v-for="item in designs">
                        <input class="design form-control input-sm" type="text" style="width: 112px;"
                               placeholder="请输入设计名称" v-model="item.name">
                        <div class="upload-design-wrap mt20">
                            <div class="upload-design" id="upload-design{{$index}}">+</div>
                        </div>
                        <button type="button" class="close" @click="reduce(item, designs)">×</button>
                    </li>
                </ul>
                <div class="btn btn-info middle ml30" @click="addDesign">增加设计</div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">案例正文</div>
            <div class="panel-body">
                <div id="case-content" style="height: 200px;"></div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">案例公司</div>
            <div class="panel-body">
                <div>
                    <span class="bold inline-block middle">公司logo</span>
                    <div class="company-logo inline-block ml10" id="company-logo">+</div>
                </div>
                <div class="mt20">
                    <span class="bold inline-block middle">公司名称</span>
                    <input class="form-control input-sm inline-block ml10" v-model="custom.name" type="text"
                           placeholder="请输入公司名称" style="width: 200px;">
                </div>
                <div class="mt20">
                    <span class="bold inline-block middle">公司背景</span>
                    <div class="company-bg inline-block ml10" id="company-bg">+</div>
                </div>
                <div class="mt20">
                    <span class="bold inline-block">公司简介</span>
                    <textarea class="company-describe form-control inline-block ml10 middle"
                              v-model="custom.description" cols="30" rows="4"></textarea>
                </div>
            </div>
        </div>
        <div class="btn btn-info btn-lg pull-right" @click="addCase">{{handle}}</div>
        <popup :show.sync="pop.show" :tips-type="pop.type" :tips-title="pop.title" :tips-content="pop.content"></popup>
    </div>
</template>

<script>
    import wangEditorUtil from '../../util/util-wang-editor';
    import uploadUtil from '../../util/util-plupload';
    import cdn from '../../filters/cdnUrl.js';
    import popup from '../../components/popupTips.vue'

    export default {
        name: 'caseView',
        components: {
            popup
        },
        data(){
            return {
                caseId: '',
                caseTitle: '',
                caseSubTitle: '',
                order: 1,
                description: '',
                materiels: [
                    {
                        name: '',
                        image_key: '',
                        url: ''
                    }
                ],
                designs: [
                    {
                        name: '',
                        image_key: ''
                    }
                ],
                custom: {
                    name: '',
                    description: ''
                },
                handle: '创建案例',
                pop: {
                    show: false,
                    type: 'danger',
                    title: '',
                    content: ''
                }
            }
        },
        beforeCompile(){
            this.caseId = this.$route.params.id;
            if (this.caseId) {
                this.handle = '更新案例';
                this.$http.get('/api/v2/admin/others/example-detail', {id: this.caseId})
                    .then((dt) => {
                        var data = dt.data;
                        this.order = data.order;
                        this.caseTitle = data.title;
                        this.caseSubTitle = data.subtitle;
                        this.description = data.description;
                        this.custom = data.custom;
                        $("#case-content").html(data.content);
                        this.reChoose("upload-case-bg", data.background_key);
                        this.reChoose("upload-case-small-bg", data.image_key);
                        this.reChoose("company-logo", data.custom.logo_key);
                        this.reChoose("company-bg", data.custom.background_key);
                        this.materiels = data.products;
                        this.designs = data.designs;
                        this.$nextTick(function () {
                            this.uploadMateriel();
                            this.uploadDesign();
                            data.products.forEach((item, i) => {
                                this.reChoose(('upload-materiel' + i), item.image_key);
                            });
                            data.designs.forEach((item, i) => {
                                this.reChoose(('upload-design' + i), item.image_key);
                            });
                        });
                    })
            }
        },
        ready(){
            wangEditorUtil('case-content');
            uploadUtil('upload-case-bg');
            uploadUtil('upload-case-small-bg');
            uploadUtil('company-logo');
            uploadUtil('company-bg');
            this.uploadMateriel();
            this.uploadDesign();
        },
        methods: {
            // 更新页面的复选
            reChoose(dom, bg_key){
                if (bg_key) {
                    var $dom = $("#" + dom);
                    $dom.html('<img src="' + cdn + bg_key + '" width="' + $dom.width() + '" height="' + $dom.height() + '"/>').css("font-size", 0);
                }
            },
            reduce(item, arr){
                arr.$remove(item);
            },
            addMateriel(){
                if (this.materiels.length < 5) {
                    this.materiels.push({
                        name: '',
                        image_key: '',
                        url: ''
                    });
                    this.$nextTick(function () {
                        this.uploadMateriel();
                    });
                }
            },
            addDesign(){
                if (this.designs.length < 5) {
                    this.designs.push({
                        name: '',
                        image_key: ''
                    });
                    this.$nextTick(function () {
                        this.uploadDesign();
                    });
                }
            },
            uploadMateriel(){
                $(".upload-materiel").map(function (i, item) {
                    if (!$(item).hasClass("initUpload")) {
                        uploadUtil($(item)[0].id);
                        $(item).addClass("initUpload");
                    }
                });
            },
            uploadDesign(){
                $(".upload-design").map(function (i, item) {
                    if (!$(item).hasClass("initUpload")) {
                        uploadUtil($(item)[0].id);
                        $(item).addClass("initUpload");
                    }
                });
            },
            wrongPop(content, title){
                this.pop.title = title || '输入有误';
                this.pop.content = content;
                this.pop.show = true;
            },
            addCase(){
                var isSubmit = true;
                var $smallBg = $("#upload-case-small-bg").find("img").attr("src");
                var $bg = $("#upload-case-bg").find("img").attr("src");
                // 除了物料+设计 都是必填了
                $(".upload-materiel").each((i, $item) => {
                    if ($item && $($item).find("img") && $($item).find("img").attr("src")) {
                        var temp = $($item).find("img").attr("src");
                        this.materiels[i].image_key = temp.substring(temp.lastIndexOf('\/') + 1);
                    } else {
                        isSubmit = false;
                    }
                });
                $(".upload-design").each((i, $item) => {
                    if ($item && $($item).find("img") && $($item).find("img").attr("src")) {
                        var temp = $($item).find("img").attr("src");
                        this.designs[i].image_key = temp.substring(temp.lastIndexOf('\/') + 1);
                    } else {
                        isSubmit = false;
                    }
                });
                if ($("#company-logo").find("img") && $("#company-logo").find("img").attr("src")) {
                    var companyLogo = $("#company-logo").find("img").attr("src");
                    this.custom.logo_key = companyLogo.substring(companyLogo.lastIndexOf('\/') + 1);
                }
                if ($("#company-bg").find("img") && $("#company-bg").find("img").attr("src")) {
                    var companyBg = $("#company-bg").find("img").attr("src");
                    this.custom.background_key = companyBg.substring(companyBg.lastIndexOf('\/') + 1);
                }
                /*if (!($smallBg && $bg && this.order && this.caseTitle && this.caseSubTitle && this.description && $("#case-content").html() && companyLogo && companyBg && this.custom.name && this.custom.description)) {
                    alert ('还有必填项未填写！');
                    isSubmit = false;
                }*/

                if (!$bg) {
                    this.wrongPop('请上传案例背景');
                    return false;
                }
                if (!$smallBg) {
                    this.wrongPop('请上传案例封面');
                    return false;
                }
                if (!this.caseTitle) {
                    this.wrongPop('请输入案例标题');
                    return false;
                }
                if (!this.caseSubTitle) {
                    this.wrongPop('请输入案例副标题');
                    return false;
                }
                if (this.description.length == 0) {
                    this.wrongPop('请输入案例描述');
                    return false;
                } else if (this.description.length > 160) {
                    this.wrongPop('案例描述最多160字符');
                    return false;
                }
                if ($("#case-content").html().length == 0) {
                    this.wrongPop('请输入案例正文');
                    return false;
                } else if (this.description.length > 160) {
                    this.wrongPop('案例正文最多160字符');
                    return false;
                }
                if (!companyLogo) {
                    this.wrongPop('请上传公司logo');
                    return false;
                }
                if (!companyBg) {
                    this.wrongPop('请上传公司背景');
                    return false;
                }
                if (!this.custom.name) {
                    this.wrongPop('请输入公司名称');
                    return false;
                }
                if (!this.custom.description) {
                    this.wrongPop('请输入公司描述');
                    return false;
                }

                this.materiels.forEach((item) => {
                    if (!(item.image_key && item.name && item.url)) {
                        isSubmit = false;
                        this.wrongPop('请输入物料品单信息');
                        return false;
                    }
                });

                this.designs.forEach((item) => {
                    if (!(item.image_key && item.name)) {
                        isSubmit = false;
                        this.wrongPop('请输入设计项目信息');
                        return false;
                    }
                });
                if (!isSubmit) {
                    return false;
                }
                var params = JSON.stringify({
                    group_id: 1,
                    order: +this.order,
                    title: this.caseTitle,
                    subtitle: this.caseSubTitle,
                    image_key: $smallBg.substring($smallBg.lastIndexOf('\/') + 1),
                    background_key: $bg.substring($bg.lastIndexOf('\/') + 1),
                    description: this.description,
                    products: this.materiels,
                    designs: this.designs,
                    content: $("#case-content").html(),
                    custom: this.custom
                });
                if (this.caseId && isSubmit) {
                    var tThis = this;
                    $.ajax({
                        type: 'PUT',
                        contentType: 'application/json',
                        url: '/api/v2/admin/others/update-example?id='+ this.caseId,
                        data: params,
                        success: function (data) {
                            tThis.$route.router.go({ path: '/soyyin/cases/'});
                        }
                    });
                } else if (isSubmit) {
                    var tThis = this;
                    $.ajax({
                        type: 'POST',
                        contentType: 'application/json',
                        url: '/api/v2/admin/others/create-example',
                        data: params,
                        success: function (data) {
                            tThis.$route.router.go({ path: '/soyyin/cases/'});
                        }
                    });
                }
            }
        }
    }
</script>

<style scoped>
    .mt20 {
        margin-top: 20px;
    }

    .ml30 {
        margin-left: 30px;
    }

    .upload-case-bg {
        width: 200px;
        height: 100px;
        border: 2px solid #dce4ec;
        border-radius: 2px;
        font-weight: bold;
        font-size: 70px;
        color: #ecf0f1;
        text-align: center;
        cursor: pointer;
        vertical-align: middle;
        line-height: 90px;
    }

    .upload-materiel, .upload-design {
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

    .case-name, .case-order, .case-sub-name {
        width: 200px;
    }

    .case-describe, .company-describe {
        width: 400px;
        max-width: 400px;
    }

    .bold {
        font-weight: bold;
    }

    .inline-block {
        display: inline-block;
    }

    .middle {
        vertical-align: middle;
    }

    .ml10 {
        margin-left: 10px;
    }

    .close{
        font-size: 30px;
        margin-right: 47px;
        margin-top: 10px;
        outline: none;
    }

    .company-logo {
        height: 70px;
        width: 70px;
        line-height: 64px;
        font-size: 50px;
        border: 2px solid #dce4ec;
        border-radius: 2px;
        font-weight: bold;
        color: #ecf0f1;
        text-align: center;
        cursor: pointer;
        vertical-align: middle;
    }

    .company-bg {
        width: 300px;
        height: 80px;
        line-height: 70px;
        border: 2px solid #dce4ec;
        border-radius: 2px;
        font-weight: bold;
        font-size: 70px;
        color: #ecf0f1;
        text-align: center;
        cursor: pointer;
        vertical-align: middle;
    }
</style>