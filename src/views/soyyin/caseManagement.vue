<!-- caseManagement.vue -->
<template>
    <div class="container-fluid">
        <div v-if="permissionList.viewCase">
            <ul class="breadcrumb">
                <li>酱印网</li>
                <li>案例管理</li>
                <li>案例列表</li>
            </ul>
            <a class="btn btn-info btn-sm" v-if="permissionList.addCase" href="#!/soyyin/case">创建案例</a>
            <table class="table table-bordered table-hover order-table mt20" style="width: 60%;">
                <thead>
                    <tr>
                        <th style="width: 10%;">ID</th>
                        <th style="width: 10%;">排序</th>
                        <th style="width: 30%;">标题</th>
                        <th style="width: 30%;">副标题</th>
                        <th style="width: 20%;">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in list">
                        <td>{{item.id}}</td>
                        <td>{{item.order}}</td>
                        <td>{{item.title}}</td>
                        <td>{{item.subtitle}}</td>
                        <td><a class="change-case" v-if="permissionList.editCase" href="#!/soyyin/case/{{item.id}}">修改案例</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import wangEditorUtil from '../../util/util-wang-editor';
    import uploadUtil from '../../util/util-plupload';
    import { permissionValidator } from '../../store/rolePermission.js'

    export default {
        name: 'CaseManagementView',
        data() {
            return {
                list: [],
                permissionList: {
                    viewCase: permissionValidator.soyyinWebsite.cases.view(),
                    addCase: permissionValidator.soyyinWebsite.cases.addCase(),
                    editCase: permissionValidator.soyyinWebsite.cases.editCase()
                },
            }
        },
        ready(){
            this.$http.get('/api/v2/admin/others/example-groups')
                .then((dt) => {
                    this.list = dt.data.groups[0].examples;
                })
        }
    }
</script>

<style scoped>
    th, td {
        text-align: center;
    }

    .mt20 {
        margin-top: 20px;
    }

    table .change-case {
        text-decoration: none;
    }

    .change-case:hover {
        text-decoration: underline;
    }
</style>