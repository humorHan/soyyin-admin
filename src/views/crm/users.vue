<!-- users.vue -->
<template>
    <div class="container-fluid">
        <ul class="breadcrumb">
            <li>CRM系统</li>
            <li>成员管理</li>
        </ul>
        <a class="pull-right btn btn-info btn-sm" v-if="permissionList.addUser" @click="addUser">添加成员</a>
        <p class="clearfix"></p>
        <table class="table table-bordered table-hover user-table">
            <thead>
                <tr>
                    <th style="width:5%;">ID</th>
                    <th style="width:12%;">真实姓名</th>
                    <th style="width:23%;">用户名</th>
                    <th style="width:25%;">角色</th>
                    <th style="width:20%;">手机号</th>
                    <th style="width:15%;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="userItem of userList">
                    <td>{{userItem.id}}</td>
                    <td>{{userItem.display_name}}</td>
                    <td>{{userItem.username}}</td>
                    <td>{{userItem.roles | rolesFilter}}</td>
                    <td>{{userItem.phone}}</td>
                    <td>
                        <a class="btn-link" v-if="permissionList.editUser" @click="editUser(userItem)">编辑</a>
                        <a class="btn-link" style="margin-left:20px;" v-if="permissionList.deleteUser" @click="showDeleteUserDialog(userItem)">删除</a>
                    </td>
                </tr>
            </tbody>
        </table>
        <edit-or-add-user-dialog :show.sync="dataForEditOrAddUserDialog.show" :data="dataForEditOrAddUserDialog.data" :roles="roleList"></edit-or-add-user-dialog>
        <popup-dialog :show-dialog.sync="dataForPopupDialog.show" :dialog-title="dataForPopupDialog.title" :dialog-content="dataForPopupDialog.content"></popup-dialog>
    </div>
</template>

<script>
import popupDialog from '../../components/popupDialog.vue'
import editOrAddUserDialog from './comp/editOrAddUserDialog.vue'
import { callback } from '../../store/index.js'
import { permissionValidator } from '../../store/rolePermission.js'
import { crmValidator } from '../../store/dataValidator.js'

const DELETE_USER = "DELETE_USER";

export default {
    name: 'CrmUsersView',
    components: {
        popupDialog,
        editOrAddUserDialog,
    },
    data() {
        return {
            roleList: [],
            userList: [],
            permissionList: {
                view: permissionValidator.crmSystem.member.view(),
                addUser: permissionValidator.crmSystem.member.addMember(),
                deleteUser: permissionValidator.crmSystem.member.deleteMember(),
                editUser: permissionValidator.crmSystem.member.editMember(),
            },
            dataForEditOrAddUserDialog: {
                show: false,
                data: {
                    userId: '',
                    displayName: '',
                    username: '',
                    roleIds: '',
                    password: '',
                    phone: '',
                },
            },
            dataForPopupDialog: {
                show: false,
                title: '删除确认',
                content: '',
            },
        }
    },
    filters: {
        rolesFilter(roles) {
            var result = '';
            for (let i = 0; i < roles.length; i++) {
                if (i === 0) {
                    result += roles[i].name;
                } else {
                    result += '、' + roles[i].name;
                }
            }
            return result;
        },
    },
    ready() {
        if (this.permissionList.view) {
            this.getUsers();
        }
        if (this.permissionList.addUser || this.permissionList.editUser) {
            this.getRoles();
        }
    },
    events: {
        'click-positive-button'() {
            if (this.dataForPopupDialog.dialogId === DELETE_USER) {
                this.deleteUser(this.dataForPopupDialog.passingData);
            }
        },
        'add-user'() {
            location.reload();
        },
        'edit-user'() {
            location.reload();
        },
    },
    methods: {
        getRoles() {
            var url = '/api/v2/admin/permissions/role-list';
            this.$http.get(url)
            .then((response) => {
                if (!response.data.result || response.data.result === 0) {
                    this.roleList = response.data.data;
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            })
        },
        getUsers() {
            var url = '/api/v2/admin/users/all';
            this.$http.get(url)
            .then((response) => {
                if (!response.data.result || response.data.result === 0) {
                    this.userList = response.data.data;
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            })
        },
        addUser() {
            this.dataForEditOrAddUserDialog.show = true;
            this.dataForEditOrAddUserDialog.data.userId = '';
            this.dataForEditOrAddUserDialog.data.displayName = '';
            this.dataForEditOrAddUserDialog.data.username = '';
            this.dataForEditOrAddUserDialog.data.roleIds = [];
            this.dataForEditOrAddUserDialog.data.password = '';
            this.dataForEditOrAddUserDialog.data.phone = '';
        },
        editUser(userItem) {
            this.dataForEditOrAddUserDialog.show = true;
            this.dataForEditOrAddUserDialog.data.userId = userItem.id;
            this.dataForEditOrAddUserDialog.data.displayName = userItem.display_name;
            this.dataForEditOrAddUserDialog.data.username = userItem.username;
            this.dataForEditOrAddUserDialog.data.roleIds = [];
            for (let i = 0; i < userItem.roles.length; i++) {
                this.dataForEditOrAddUserDialog.data.roleIds.push(userItem.roles[i].id);
            }
            this.dataForEditOrAddUserDialog.data.password = crmValidator.DEFAULT_PASSWORD;
            this.dataForEditOrAddUserDialog.data.phone = userItem.phone;
        },
        showDeleteUserDialog(userItem) {
            this.dataForPopupDialog.show = true;
            this.dataForPopupDialog.content = "确定删除此成员？";
            this.dataForPopupDialog.dialogId = DELETE_USER;
            this.dataForPopupDialog.passingData = userItem;
        },
        deleteUser(userItem) {
            var url = '/api/v2/admin/users/delete?id=' + userItem.id;
            this.$http.delete(url)
            .then((response) => {
                if(!response.data.result || response.data.result === 0){
                    location.reload();
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            });
        },
    }
}
</script>

<style scoped>
.user-table, {
    table-layout: fixed;
}

.user-table td, .user-table th {
    text-align: center;
    vertical-align: middle;
}

.user-table td .btn-link {
    text-decoration: none;
    cursor: pointer;
}

.user-table td .btn-link:hover {
    text-decoration: underline;
}
</style>