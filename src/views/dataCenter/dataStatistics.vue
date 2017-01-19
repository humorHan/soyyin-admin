<!-- dataStatistics.vue -->
<template>
    <div class="container-fluid">
        <ul class="breadcrumb">
            <li>数据中心</li>
            <li>订单统计</li>
        </ul>
        <ul class="nav nav-pills">
            <li :class="{'active': type === 'TIME'}" v-if="permissionList.statsAccordingToTime"><a @click="getList('TIME')">按时间</a></li>
            <li :class="{'active': type === 'MANAGER'}" v-if="permissionList.statsAccordingToManager"><a @click="getList('MANAGER')">按客户经理</a></li>
            <li :class="{'active': type === 'CUSTOMER'}" v-if="permissionList.statsAccordingToCustomer"><a @click="getList('CUSTOMER')">按客户</a></li>
        </ul>
        <form v-if="permissionList.statsAccordingToTime || permissionList.statsAccordingToCustomer || permissionList.statsAccordingToManager" class="form-inline" style="margin:20px 0;">
            <label class="control-label" for="startDate">日期区间：</label>
            <input class="form-control input-sm" id="startDate" style="width:200px;" readOnly="true" v-model="startDate">
            <label class="control-label">至</label>
            <input class="form-control input-sm" id="endDate" style="width:200px;" readOnly="true" v-model="endDate">
        </form>
        <template v-if="type === 'TIME'">
            <form class="form-inline">
                <label class="control-label">时间单位：</label>
                <ul class="nav nav-pills" style="display:inline-block;vertical-align:middle;">
                    <li :class="{'active': timeUnits === 'all'}"><a @click="timeUnits = 'all';">合计</a></li>
                    <li :class="{'active': timeUnits === 'week'}"><a @click="timeUnits = 'week';">分周</a></li>
                    <li :class="{'active': timeUnits === 'month'}"><a @click="timeUnits = 'month';">分月</a></li>
                </ul>
            </form>
        </template>
        <div v-if="permissionList.statsAccordingToTime" v-show="type === 'TIME'" id="dataChart" style="height:400px;width:1200px;margin:20px 0;"></div>
        <template v-if="type === 'TIME'">
            <div class="panel panel-default">
                <div class="panel-heading">详细数据</div>
                <div class="panel-body">
                    <h5><b>订单金额：</b>订单日期在单位区间内的订单金额（商品价格总和+订单额外金额）的总和。</h5>
                    <h5><b>完成金额：</b>订单完成日期在单位区间内的订单金额（商品价格总和+订单额外金额）的总和。</h5>
                    <h5><b>盈利：</b>订单日期（只考虑“订单已完成”状态的订单）在单位区间内的订单利润（商品价格总和+订单额外金额-商品成本-商品物流成本-发票物流成本-额外成本-退款金额）的总和。</h5>
                    <table class="table table-bordered table-hover order-table">
                        <thead>
                            <tr>
                                <th style="width:25%;">时间</th>
                                <th style="width:25%;">订单金额</th>
                                <th style="width:25%;">完成金额</th>
                                <th style="width:25%;">盈利</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item of listForTimeType">
                                <td>{{item.date}}</td>
                                <td>{{item.total | realPrice}}</td>
                                <td>{{item.finish_total | realPrice}}</td>
                                <td>{{item.profit | realPrice}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </template>
        <template v-if="type === 'MANAGER'">
            <div class="panel panel-default">
                <div class="panel-heading">详细数据</div>
                <div class="panel-body">
                    <h5><b>订单总额：</b>订单日期在日期区间内该客户经理/客服负责的订单的订单金额（商品价格总和+订单额外金额）总和。</h5>
                    <h5><b>待收款金额：</b>订单日期在日期区间内该客户经理/客服负责的订单的待收款金额总和。</h5>
                    <h5><b>订单数：</b>订单日期在日期区间内该客户经理/客服负责的订单的数目。</h5>
                    <table class="table table-bordered table-hover order-table">
                        <thead>
                            <tr>
                                <th style="width:25%;">客户经理/客服</th>
                                <th style="width:25%;">订单总额</th>
                                <th style="width:25%;">待收款金额</th>
                                <th style="width:25%;">订单数</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item of listForManager">
                                <td>{{item.manager.display_name}}</td>
                                <td>{{item.total | realPrice}}</td>
                                <td>{{item.not_paid_total | realPrice}}</td>
                                <td>{{item.order_count}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </template>
        <template v-if="type === 'CUSTOMER'">
            <div class="panel panel-default">
                <div class="panel-heading">详细数据</div>
                <div class="panel-body">
                    <h5><b>订单总额：</b>订单日期在日期区间内该客户的订单的订单金额（商品价格总和+订单额外金额）总和。</h5>
                    <h5><b>待收款金额：</b>订单日期在日期区间内该客户的订单的待收款金额总和。</h5>
                    <h5><b>订单数：</b>订单日期在日期区间内该客户的订单的数目。</h5>
                    <table class="table table-bordered table-hover order-table">
                        <thead>
                            <tr>
                                <th style="width:25%;">客户名称/公司</th>
                                <th style="width:9%;">客户ID</th>
                                <th style="width:22%;">订单总额</th>
                                <th style="width:22%;">待收款金额</th>
                                <th style="width:22%;">订单数</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item of listForCustomer">
                                <td>{{item.customer.name}}/{{item.customer.company}}</td>
                                <td>{{item.customer.id}}</td>
                                <td>{{item.total | realPrice}}</td>
                                <td>{{item.not_paid_total | realPrice}}</td>
                                <td>{{item.order_count}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import echarts from 'echarts'
import popupTips from '../../components/popupTips.vue'
import { callback } from '../../store'
import { dateFormat } from '../../filters/index.js'
import { permissionValidator } from '../../store/rolePermission.js'
import $ from 'jquery'

export default {
    name: 'DataStatisticsView',
    components: {
        popupTips,
    },
    data() {
        return {
            type: '',
            permissionList: {
                statsAccordingToTime: permissionValidator.dataCenter.statistics.statsAccordingToTime(),
                statsAccordingToCustomer: permissionValidator.dataCenter.statistics.statsAccordingToCustomer(),
                statsAccordingToManager: permissionValidator.dataCenter.statistics.statsAccordingToManager(),
            },
            list: [],
            listForManager: [],
            listForCustomer: [],
            startDate: dateFormat((new Date()).getTime() - 30 * 24 * 60 * 60 * 1000, 'toDate'),
            endDate: dateFormat((new Date()).getTime(), 'toDate'),
            timeUnits: 'all',
            chart: null,
            dataForPopupTips: {
                show: false,
                type: 'danger',
                title: '',
                content: '',
            },
        }
    },
    ready() {
        var isAccessible = true;
        if (this.permissionList.statsAccordingToTime) {
            this.getList('TIME');
            this.chart = echarts.init(document.getElementById('dataChart'));
        } else if (this.permissionList.statsAccordingToCustomer) {
            this.getList('MANAGER');
        } else if (this.permissionList.statsAccordingToManager) {
            this.getList('CUSTOMER');
        } else {
            isAccessible = false;
        }
        if (isAccessible) {
            $("#startDate").datetimepicker({
                format: "yyyy-mm-dd",
                language: "zh-CN",
                todayHighlight: true,
                autoclose: true,
                minView: 2,
                endDate: new Date(),
            });
            $("#endDate").datetimepicker({
                format: "yyyy-mm-dd",
                language: "zh-CN",
                todayHighlight: true,
                autoclose: true,
                minView: 2,
                endDate: new Date(),
            });
        }
    },
    watch: {
        startDate(val, oldVal) {
            $("#endDate").datetimepicker('setStartDate', val);
            this.getList(this.type);
        },
        endDate(val, oldVal) {
            $("#startDate").datetimepicker('setEndDate', val);
            this.getList(this.type);
        },
        listForTimeType(val, oldVal) {
            this.setChartOptions();
        },
    },
    computed: {
        listForTimeType() {
            if (this.timeUnits === 'all') {
                return this.countAmountTotal(this.list);
            } else if (this.timeUnits === 'week') {
                return this.countAmountPerWeek(this.list);
            } else if (this.timeUnits === 'month') {
                return this.countAmountPerMonth(this.list);
            }
            
            return this.list;
        },
    },
    methods: {
        countAmountTotal(data) {
            var result = [{
                date: this.startDate + '至' + this.endDate,
                total: 0,
                finish_total: 0,
                profit: 0,
            }];
            for (var i = 0; i < data.length; i++) {
                result[0].total += data[i].total;
                result[0].finish_total += data[i].finish_total;
                result[0].profit += data[i].profit;
            }
            return result;
        },
        getWeekEndTime(timeOfDayBegin) {
            var dayOfweek = (new Date(timeOfDayBegin)).getDay();
            !dayOfweek && (dayOfweek = 7);
            return (new Date(timeOfDayBegin + (8 - dayOfweek) * 24 * 60 * 60 * 1000 - 1)).getTime();
        },
        countAmountPerWeek(data) {
            var result = [];
            var firstWeekStartTime = this.getStartDateTimestamp();
            var firstWeekEndTime = this.getWeekEndTime(firstWeekStartTime);
            var weekStartTime = firstWeekStartTime;
            var weekEndTime = firstWeekEndTime;
            var i = 0;
            while (weekStartTime < this.getEndDateTimestamp()) {
                var weekCount = {
                    date: dateFormat(weekStartTime, 'toDate'),
                    total: 0,
                    finish_total: 0,
                    profit: 0,
                };
                while (i < data.length && this.getTime(data[i].date) < weekEndTime) {
                    weekCount.total += data[i].total;
                    weekCount.finish_total += data[i].finish_total;
                    weekCount.profit += data[i].profit;
                    i++;
                }
                weekCount.date += '至' + dateFormat(weekEndTime, 'toDate');
                result.push(weekCount);
                weekStartTime = weekEndTime + 1;
                weekEndTime += 7 * 24 * 60 * 60 * 1000;
            }
            result[result.length - 1].date = result[result.length - 1].date.substring(0, 10) + '至' + this.endDate;
            return result;
        },
        countAmountPerMonth(data) {
            var result = [];
            var dates = this.startDate.split('-');
            var yearMonth = {
                year: parseInt(dates[0]),
                month: parseInt(dates[1]),
            };
            var dates = this.endDate.split('-');
            var endYearMonth = {
                year: parseInt(dates[0]),
                month: parseInt(dates[1]),
            };
            var i = 0;
            while ((yearMonth.year < endYearMonth.year) || (yearMonth.year === endYearMonth.year && yearMonth.month <= endYearMonth.month)) {
                var yearCount = {
                    date: yearMonth.year + '年' + yearMonth.month + '月',
                    total: 0,
                    finish_total: 0,
                    profit: 0,
                };
                while (i < data.length && (dates = data[i].date.split('-')) && parseInt(dates[0]) === yearMonth.year && parseInt(dates[1]) === yearMonth.month) {
                    yearCount.total += data[i].total;
                    yearCount.finish_total += data[i].finish_total;
                    yearCount.profit += data[i].profit;
                    i++;
                }
                result.push(yearCount);
                if (yearMonth.month === 12) {
                    yearMonth.year++;
                    yearMonth.month = 1;
                } else {
                    yearMonth.month++;
                }
            }
            return result;
        },
        getTime(val) {
            var dates = val.split('-');
            var date = new Date();
            date.setFullYear(dates[0], dates[1] - 1, dates[2]);
            date.setHours(0, 0, 0, 0);
            return date.getTime();
        },
        getStartDateTimestamp() {
            return this.getTime(this.startDate);
        },
        getEndDateTimestamp() {
            return this.getTime(this.endDate) + 24 * 60 * 60 * 1000 - 1;
        },
        getList(type) {
            if (type === 'TIME') {
                var url = '/api/v2/admin/orders/order-statistics?';
            } else if (type === 'MANAGER') {
                var url = '/api/v2/admin/orders/manager-order-statistics?';
            } else {
                var url = '/api/v2/admin/orders/customer-order-statistics?';
            }
            
            url += 'start_time=' + this.getStartDateTimestamp() + '&end_time=' + this.getEndDateTimestamp();
            this.$http.get(url)
            .then((response) => {
                if (!response.data.result || response.data.result === 0) {
                    this.type = type;
                    if (type === 'TIME') {
                        this.list = response.data.data;
                    } else if (type === 'MANAGER') {
                        this.listForManager = response.data.data;
                    } else {
                        this.listForCustomer = response.data.data;
                    }
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            })
        },
        setChartOptions() {
            var xAxis = [];
            var totalData = [];
            var finishTotalData = [];
            var profitData = [];
            for (var i = 0; i < this.listForTimeType.length; i++) {
                xAxis.push(this.listForTimeType[i].date);
                totalData.push(this.listForTimeType[i].total / 100);
                finishTotalData.push(this.listForTimeType[i].finish_total / 100);
                profitData.push(this.listForTimeType[i].profit / 100);
            }
            this.chart && this.chart.setOption({
                title: {
                    text: '数据趋势',
                },
                tooltip: {
                    trigger: 'axis',
                },
                legend: {
                    data: ['订单金额','完成金额','盈利'],
                },
                toolbox: {
                    feature: {
                        saveAsImage: {},
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: xAxis,
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                    }
                ],
                series: [
                    {
                        name: '订单金额',
                        type: 'line',
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        data: totalData,
                    },
                    {
                        name: '完成金额',
                        type: 'line',
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        data: finishTotalData,
                    },
                    {
                        name: '盈利',
                        type: 'line',
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        data: profitData,
                    }
                ]
            });
        },
    },
}
</script>

<style scoped>
.nav-pills > li > a{
    cursor: pointer;
}

.order-table {
    table-layout: fixed;
}

.order-table th, .order-table td{
    text-align: center;
    vertical-align: middle;
}
</style>
