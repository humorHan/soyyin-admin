<!-- editOrAddUserDialog.vue -->
<template>
    <div class="modal" v-show="show">
    	<div class="modal-dialog">
            <div class="modal-content">
            	<div class="modal-header">
                    <button type="button" class="close" @click="closeDialog">&times;</button>
                    <h4 class="modal-title">{{title}}</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="userDisplayName">真实姓名<span class="text-danger">*</span>：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="userDisplayName" type="text" v-model="data.displayName">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="username">用户名<span class="text-danger">*</span>：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="username" type="text" v-model="data.username">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="userRole">角色<span class="text-danger">*</span>：</label>
                            <div class="col-lg-7 checkbox">
                                <label style="padding-right: 20px;" v-for="role in roles">
                                    <input type="checkbox" value="{{role.id}}" v-model="data.roleIds" number>{{role.name}}
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="userPassword">密码<span class="text-danger">*</span>：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="userPassword" type="password" v-model="data.password">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-lg-4 control-label" for="userPhone">手机号码：</label>
                            <div class="col-lg-6">
                                <input class="form-control input-sm" id="userPhone" type="text" v-model="data.phone">
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
import { crmValidator } from '../../../store/dataValidator.js'

export default {
    name: 'EditOrAddUserDialogView',
    components: {
        popupTips,
    },
    props: ['show', 'data', 'roles'],
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
    computed: {
        title() {
            if (this.data.userId) {
                return '编辑成员';
            } else {
                return '新增成员';
            }
        },
    },
    methods: {
    	validateUser() {
            var result = crmValidator.validateDisplayName(this.data.displayName);
            if (!result.ok) {
                return result.errorMsg;
            }
            result = crmValidator.validateUserName(this.data.username);
            if (!result.ok) {
                return result.errorMsg;
            }
            if (this.data.roleIds.length === 0) {
                return "请选择成员角色";
            }
            if (this.data.password != crmValidator.DEFAULT_PASSWORD) {
                result = crmValidator.validatePassword(this.data.password);
                if (!result.ok) {
                    return result.errorMsg;
                }
            }
            return;
        },
        confirmSubmit() {
            if (this.buttonEnabled) {
                this.buttonEnabled = false;
                if (this.data.userId) {
                    this.editUser();
                } else {
                    this.addUser();
                }
            }
        },
        addUser() {
        	var result = this.validateUser();
            if(result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                this.buttonEnabled = true;
                return;
            }
            var url = '/api/v2/admin/users/add';
            var data = {
                username: this.data.username,
                password: this.data.password,
                display_name: this.data.displayName,
                phone: this.data.phone,
                role_ids: this.data.roleIds,
            };
            this.$http.post(url, data)
            .then((response) => {
                if(!response.data.result || response.data.result === 0) {
                    this.show = false;
                    this.$dispatch('add-user');
                } else {
                    callback.success(response.data);
                }
                this.buttonEnabled = true;
            },(response) => {
                callback.error(response);
                this.buttonEnabled = true;
            });
        },
    	editUser() {
            var result = this.validateUser();
            if(result) {
                this.dataForPopupTips.show = true;
                this.dataForPopupTips.title = '输入有误';
                this.dataForPopupTips.content = result;
                this.buttonEnabled = true;
                return;
            }
            var url = '/api/v2/admin/users/update?id=' + this.data.userId;
            var data = {
                username: this.data.username,
                display_name: this.data.displayName,
                phone: this.data.phone,
                role_ids: this.data.roleIds,
            };
            if (this.data.password != crmValidator.DEFAULT_PASSWORD) {
                data.password = this.data.password;
            }
            this.$http.put(url, data)
            .then((response) => {
                if(!response.data.result || response.data.result === 0) {
                    this.show = false;
                    this.$dispatch('edit-user');
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
    top: 20%;
}

</style>