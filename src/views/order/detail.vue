<!-- detail.vue -->
<template>
    <div class="container-fluid">
        <ul class="breadcrumb">
            <li>订单系统</li>
            <li>订单管理</li>
            <li>订单详情：{{orderId}}</li>
        </ul>
        <div class="pull-right">
            <a class="btn btn-info btn-sm" v-show="canCancel" @click="showCancelOrderDialog">取消</a>
            <a class="btn btn-info btn-sm" v-show="canFinish" @click="showFinishOrderDialog">完成</a>
            <a class="btn btn-info btn-sm" v-show="canConfirm" @click="showConfirmOrderDialog">确认</a>
            <a class="btn btn-info btn-sm" v-show="orderId && permissionList.editOrder" v-link="{ path: '/order/edit/'+orderId }">编辑</a>
            <a class="btn btn-info btn-sm" v-show="orderId && permissionList.createOrder" v-link="{ path: '/order/create/'+orderId }" target="_blank">复制该订单</a>
        </div>
        <h3>订单详情</h3>
        <p class="clearfix"></p>
        <div class="panel panel-default">
            <div class="panel-body">
                <div class="row h4">
                    <div class="col-lg-3"><b>订单编号：</b>{{orderBasic.id}}</div>
                    <div class="col-lg-3"><b>订单状态：</b>{{orderBasic.status | orderStatusFilter}}</div>
                    <div class="col-lg-3"><b>订单日期：</b>{{orderDate | dateFormat 'toDate'}}</div>
                    <div class="col-lg-3"><b>创建时间：</b>{{orderBasic.create_time | dateFormat}}</div>
                </div>
                <div class="row h4">
                    <div class="col-lg-3"><b>客户经理/客服：</b>{{orderBasic.manager ? orderBasic.manager.display_name : ''}}</div>
                    <div class="col-lg-6"><b>创建人：</b>{{orderBasic.creator.type === 'USER' ? '酱印网 ' + (orderBasic.creator.username ? orderBasic.creator.username : '') : orderBasic.creator.display_name}}</div>
                </div>
                <div class="row h4">
                    <div class="col-lg-3"><b>订单金额：</b>{{(orderId ? orderBasic.amount + orderBasic.freight : '') | realPrice}}{{orderBasic.is_priced === false ? '+？' : ''}}元</div>
                    <div class="col-lg-3"><b>盈利：</b>{{(isOrderProfitSure ? (orderBasic.amount + orderBasic.freight - orderBasic.cost - orderBasic.extra_cost - orderBasic.logistics_cost - orderBasic.invoice_logistics_cost - orderBasic.refunded_amount) : '') | realPrice}}{{(!orderId || isOrderProfitSure) ? '' : '？'}}元</div>
                </div>
                <div class="row h4">
                    <div class="col-lg-3"><b>商品成本：</b>{{orderBasic.cost | realPrice}}{{!orderId || isProductCostSure ? '' : '+？'}}元</div>
                    <div class="col-lg-3"><b>额外成本：</b>{{orderBasic.extra_cost | realPrice}}元</div>
                    <div class="col-lg-3"><b>物流成本：</b>{{orderBasic.logistics_cost | realPrice}}+{{orderBasic.invoice_logistics_cost | realPrice}}元</div>
                    <div class="col-lg-3"><b>退款金额：</b>{{orderBasic.refunded_amount | realPrice}}元</div>
                </div>  
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">商品清单</div>
            <div class="panel-body">
                <table class="table table-bordered table-hover product-table">
                    <thead>
                        <tr>
                            <th style="width:6%;">ID</th>
                            <th style="width:10%;">产品名称</th>
                            <th style="width:18%;">参数</th>
                            <th style="width:8%;">数量</th>
                            <th style="width:8%;">价格(元)</th>
                            <th style="width:8%;">成本(元)</th>
                            <th style="width:15%;">到货时间要求</th>
                            <th style="width:8%;">制作负责人</th>
                            <th style="width:8%;">制作状态</th>
                            <th style="width:11%;">印刷文件</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item of orderItems">
                            <td>{{item.id}}</td>
                            <template v-if="item.is_custom">
                                <td>{{item.detail.name}}</td>
                                <td>
                                    <a class="btn-link" @click="showProductDetailDialog(item)">
                                        {{item.detail.size}}{{(item.detail.size && (item.detail.caizhi || item.detail.others)) ? '_' : ''}}{{item.detail.caizhi}}{{(item.detail.caizhi && item.detail.others) ? '_' : ''}}{{item.detail.others}}
                                    </a>
                                </td>
                                <td>{{item.detail.quantity}}</td>
                            </template>
                            <template v-else>
                                <td>
                                    <a class="btn-link" :href="'http://www.soyyin.com/product?id='+item.product_id+'#'+item.brief" target="_blank">{{item.title}}</a>
                                </td>
                                <td>{{item.brief}}</td>
                                <td>{{item.quantity}}</td>
                            </template>
                            <td>{{item.price === 0 ? '暂无' : ''}}{{(item.price === 0 ? '' : item.price ) | realPrice}}</td>
                            <td>{{(item.cost ? item.cost : '') | realPrice}}</td>
                            <td>{{item.arrival_time}}</td>
                            <td>{{item.producer ? item.producer.name : ''}}</td>
                            <td>{{item.produce_status | produceStatusFilter}}</td>
                            <td><a class="btn-link" v-if="item.file" :href="item.file.file_key | getQiniuUrl" target="_blank">{{item.file.file_name}}</a></td>
                        </tr>
                    </tbody>
                </table>

                <div class="row">
                    <div class="col-lg-6">
                        <div class="panel panel-default">
                            <div class="panel-body">
                                <a class="pull-right btn btn-info btn-sm" v-show="canChangeExtraAmount" @click="changeExtraAmount">修改</a>
                                <h4>订单金额补充</h4>
                                <div class="row" style="margin: 0;">
                                    <label class="pull-left">补充金额：</label>
                                    <p class="pull-left">{{orderBasic.freight | realPrice}}元</p>
                                </div>
                                <div class="row" style="margin: 0;">
                                    <label class="pull-left">备注：</label>
                                    <p class="pull-left" style="width: 85%;">{{orderBasic.freight_remark}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="panel panel-default">
                            <div class="panel-body">
                                <a class="pull-right btn btn-info btn-sm" v-show="canChangeExtraCost" @click="changeExtraCost">修改</a>
                                <h4>额外成本</h4>
                                <div class="row" style="margin: 0;">
                                    <label class="pull-left">金额：</label>
                                    <p class="pull-left">{{orderBasic.extra_cost | realPrice}}元</p>
                                </div>
                                <div class="row" style="margin: 0;">
                                    <label class="pull-left">备注：</label>
                                    <p class="pull-left" style="width: 85%;">{{orderBasic.extra_cost_remark}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 class="pull-right"><b>订单金额：</b>{{(orderId ? orderBasic.amount + orderBasic.freight : '') | realPrice}}{{orderBasic.is_priced === false ? '+？' : ''}}元</h4>
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">客户信息</div>
            <div class="panel-body">
                <h4 class="row" style="margin-bottom: 25px;">
                    <div class="col-lg-3"><b>客户名称：</b>{{orderBasic.customer.name}}</div>
                    <div class="col-lg-3"><b>联系电话：</b>{{orderBasic.customer.phone}}</div>
                    <div class="col-lg-2"><b>QQ：</b>{{orderBasic.customer.qq}}</div>
                    <div class="col-lg-4"><b>公司：</b>{{orderBasic.customer.company}}</div>
                </h4>
                <template v-for="consigneeItem of consignees">
                    <consignee-info-with-logistics :index="$index" :consignee-item="consigneeItem" :can-add-logistics="false"></consignee-info-with-logistics>
                </template>
            </div>
        </div>
        <div class="panel panel-default invoice-info">
            <div class="panel-heading">发票信息</div>
            <div class="panel-body">
                <a class="pull-right btn btn-info btn-sm" v-if="canApplyInvoice" @click="clickToApplyInvoice">申请开票</a>
                <h4 class="row">
                    <div class="col-lg-3"><b>开票额度：</b>{{(orderId ? orderBasic.amount + orderBasic.freight : '') | realPrice}}{{orderBasic.is_priced === false ? '+？' : ''}}元</div>
                    <div class="col-lg-3"><b>已申请：</b>{{orderBasic.invoiced_amount | realPrice}}元</div>
                </h4>
                <p><a class="btn-link" v-if="invoiceInfo" @click="clickToshowInvoiceInfoDialog">{{invoiceInfo.zengzhishui ? '增值税发票' : '普通发票'}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{invoiceInfo.title}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{invoiceInfo.content}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{invoiceInfo.amount | realPrice}}元</a></p>
                <template v-if="invoiceRecords.length > 0">
                    <h4>开票历史</h4>
                    <div class="panel panel-default" v-for="recordItem in invoiceRecords">
                        <div class="panel-body">
                            <a class="pull-right btn-link" @click="showOrHideInvoiceRecordItem(recordItem)">{{recordItem.showAll ? '收起' : '展开'}}</a>
                            <div class="row">
                                <div class="col-lg-2"><b>状态：</b>{{recordItem.status | invoiceStatusFilter}}</div>
                                <div class="col-lg-3"><b>申请时间：</b>{{recordItem.create_time | dateFormat}}</div>
                                <div class="col-lg-6">{{recordItem.data.zengzhishui ? '增值税发票' : '普通发票'}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{recordItem.data.title}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{recordItem.data.content}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{recordItem.data.amount | realPrice}}元</div>
                            </div>
                            <div v-show="recordItem.showAll">
                                <div class="row">
                                    <div class="col-lg-2"><b>开票申请ID：</b>{{recordItem.id}}</div>
                                    <div class="col-lg-3"><b>开票类型：</b>{{recordItem.order_ids.length > 1 ? '(' + recordItem.order_ids.length + '订单)合并开票' : '单开'}}</div>
                                    <div class="col-lg-2"><b>使用额度：</b>{{recordItem.amount_of_order | realPrice}}元</div>
                                    <div class="col-lg-3" v-if="recordItem.invoice_time"><b>开票时间：</b>{{recordItem.invoice_time | dateFormat}}</div>
                                    <div class="col-lg-3" v-if="recordItem.finish_time"><b>完成时间：</b>{{recordItem.finish_time | dateFormat}}</div>
                                </div>
                                <div class="row" style="margin: 0;" v-if="recordItem.data.remark">
                                    <div class="pull-left"><b>备注：</b></div>
                                    <p class="pull-left" style="width: 90%;">{{recordItem.data.remark}}</p>
                                </div>
                                <div class="row" v-if="recordItem.data.zengzhishui">
                                    <div class="col-lg-1" style="text-align:right;">增值税发票信息</div>
                                    <div class="col-lg-11">
                                        <div class="row">
                                            <div class="col-lg-4"><b>纳税人识别号：</b>{{recordItem.data.zengzhishui.identifier}}</div>
                                            <div class="col-lg-3"><b>电话：</b>{{recordItem.data.zengzhishui.phone}}</div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-12"><b>注册地址：</b>{{recordItem.data.zengzhishui.address}}</div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-4"><b>银行账号：</b>{{recordItem.data.zengzhishui.account}}</div>
                                            <div class="col-lg-7"><b>开户行：</b>{{recordItem.data.zengzhishui.bank}}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-1" style="text-align:right;">发票寄送至</div>
                                    <div class="col-lg-11">
                                        <div class="row">
                                            <div class="col-lg-4"><b>收货人：</b>{{recordItem.data.consignee_name}}</div>
                                            <div class="col-lg-3"><b>联系电话：</b>{{recordItem.data.consignee_phone}}</div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-12"><b>邮寄地址：</b>{{recordItem.data.address}}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row" v-if="recordItem.logistics">
                                    <div class="col-lg-1" style="text-align:right;">物流信息</div>
                                    <div class="col-lg-11">
                                        <div>{{recordItem.logistics.delivery_method}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{recordItem.logistics.express}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{recordItem.logistics.express_order_id}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{recordItem.logistics.cost | realPrice}}元&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{recordItem.logistics.create_time | dateFormat}}录入</div>
                                        <div v-if="recordItem.logistics.remark">{{recordItem.logistics.remark}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">付款信息</div>
            <div class="panel-body">
                <template v-if="orderBasic.status === 'DELIVERY_CONFIRMED'">
                    <a class="pull-right btn btn-info btn-sm" @click="jumpToZhifubaoPayLink">支付宝支付链接</a>
                    <a class="pull-right btn btn-info btn-sm" style="margin-right:20px;" @click="showZhifubaoQRCodeDialog">支付宝二维码</a>
                    <a class="pull-right btn btn-info btn-sm" style="margin-right:20px;" @click="showWeChatQRCodeDialog">微信二维码</a>
                </template>
                <h4 class="row">
                    <template v-if="orderBasic.is_priced">
                        <div class="col-lg-3"><b>已支付：</b>{{paymentData.paid_amount | realPrice}}元({{Math.round(paymentData.paid_amount / (orderBasic.amount + orderBasic.freight) * 100)}}%)</div>
                        <div class="col-lg-3"><b>待支付：</b>{{(orderBasic.amount + orderBasic.freight - paymentData.paid_amount) | realPrice}}元({{100 - Math.round(paymentData.paid_amount / (orderBasic.amount + orderBasic.freight) * 100)}}%)</div>
                    </template>
                    <template v-else>
                        <div class="col-lg-3"><b>已支付：</b>0元(0%)</div>
                        <div class="col-lg-3"><b>待支付：</b>？元(100%)</div>
                    </template>
                </h4>
                <h4 v-if="paymentData.payment"><b>付款方式：</b>{{paymentData.payment | paymentFilter}}</h4>
                <p v-if="paymentData.remark">{{paymentData.remark}}</p>
                <table class="table table-bordered table-hover payment-records-table" v-if="paymentData.records && paymentData.records.length > 0">
                    <thead>
                        <tr>
                            <th style="width:5%;">序号</th>
                            <th style="width:20%;">付款时间</th>
                            <th style="width:10%;">付款途径</th>
                            <th style="width:15%;">付款方式</th>
                            <th style="width:30%;">支付单号</th>
                            <th style="width:10%;">付款金额</th>
                            <th style="width:10%;">付款比例</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="paymentRecordItem of paymentData.records">
                            <td>{{$index + 1}}</td>
                            <td>{{paymentRecordItem.create_time | dateFormat}}</td>
                            <td>{{paymentRecordItem.method === 'PINGXX' ? '线上支付' : '线下转账'}}</td>
                            <td>{{paymentRecordItem.method === 'PINGXX' ? 'Ping++支付' : (paymentRecordItem.method === 'BANK_TRANSFER' ? '银行转账' : '支付宝转账')}}</td>
                            <td>{{paymentRecordItem.payment_order_id}}</td>
                            <td>{{paymentRecordItem.amount | realPrice}}元</td>
                            <td>{{Math.round(paymentRecordItem.amount / (orderBasic.amount + orderBasic.freight) * 100)}}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-body">
                <div class="col-md-6">
                    <h4>其他信息</h4>
                    <p><b>备注：</b>{{orderBasic.remark}}</p>
                </div>
                <div class="col-md-6">
                    <h4>历史记录</h4>
                    <ul class="list-unstyled">
                        <li v-for="history of orderHistories">
                            <p :class="{'text-muted': $index+1 !== orderHistories.length}">
                                {{$index+1}}.
                                {{history.create_time | dateFormat}}
                                <span :class="{'text-success': history.status === 'FINISHED', 'text-danger': history.status === 'CANCELED'}">{{history.status | orderStatusFilter}}</span>
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">售后处理</div>
            <div class="panel-body">
                <a class="pull-right btn btn-info btn-sm" v-if="canRecordAfterSale" @click="clickToRecordAfterSale">录入售后问题</a>
                <div class="col-lg-10">
                    <p><b>售后问题描述：</b>暂无</p>
                    <p><b>处理方案：</b>暂无</p>
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">退款处理</div>
            <div class="panel-body">
                <a class="pull-right btn btn-info btn-sm" v-if="canApplyRefund" @click="clickToApplyRefund">申请退款</a>
                <h4 class="row">
                    <div class="col-lg-4"><b>已申请退款：</b>{{orderBasic.refunded_amount | realPrice}}元</div>
                </h4>
                <table class="table table-bordered table-hover refund-records-table" v-if="refundRecords.length > 0">
                    <thead>
                        <tr>
                            <th style="width:5%;">序号</th>
                            <th style="width:8%;">ID</th>
                            <th style="width:8%;">退款金额</th>
                            <th style="width:10%;">状态</th>
                            <th style="width:19%;">操作时间</th>
                            <th style="width:12%;">退款类型</th>
                            <th style="width:22%;">退款信息</th>
                            <th style="width:16%;">退款原因</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="refundItem in refundRecords">
                            <td>{{$index + 1}}</td>
                            <td>{{refundItem.id}}</td>
                            <td>{{refundItem.amount | realPrice}}元</td>
                            <td :class="{'text-success': refundItem.status === 'FINISHED'}">{{refundItem.status | refundStatusFilter}}</td>
                            <td>
                                创建时间：{{refundItem.create_time | dateFormat}}<br>
                                <template v-if="refundItem.finish_time">
                                    完成时间：{{refundItem.finish_time | dateFormat}}<br>
                                </template>
                            </td>
                            <td>{{refundItem.type | refundTypeFilter}}</td>
                            <td>
                                退款渠道：{{refundItem.method | refundWayFilter}}<br>
                                <template v-if="refundItem.type === 'BY_HAND'">
                                    对方账号：{{refundItem.account}}<br>
                                    对方姓名：{{refundItem.name}}<br>
                                </template>
                            </td>
                            <td>{{refundItem.reason}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- 发票信息弹框 -->
        <div class="modal" style="height:100%;" v-if="invoiceInfo" v-show="showInvoiceInfoDialog">
            <div class="modal-dialog" style="top:30%;width:900px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" @click="closeInvoiceInfoDialog">&times;</button>
                        <h4 class="modal-title">发票信息</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-lg-2" style="text-align:right;">发票信息</div>
                            <div class="col-lg-10">
                                <div class="row">
                                    <div class="col-lg-3"><b>开票金额：</b>{{invoiceInfo.amount | realPrice}}元</div>
                                    <div class="col-lg-3"><b>开票类型：</b>{{invoiceInfo.zengzhishui ? '增值税发票' : '普通发票'}}</div>
                                    <div class="col-lg-5"><b>开票内容：</b>{{invoiceInfo.content}}</div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12"><b>发票抬头：</b>{{invoiceInfo.title}}</div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12"><b>备注：</b>{{invoiceInfo.remark}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="row" v-if="invoiceInfo.zengzhishui">
                            <div class="col-lg-2" style="text-align:right;">增值税发票信息</div>
                            <div class="col-lg-10">
                                <div class="row">
                                    <div class="col-lg-5"><b>纳税人识别号：</b>{{invoiceInfo.zengzhishui.identifier}}</div>
                                    <div class="col-lg-4"><b>电话：</b>{{invoiceInfo.zengzhishui.phone}}</div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12"><b>注册地址：</b>{{invoiceInfo.zengzhishui.address}}</div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-5"><b>银行账号：</b>{{invoiceInfo.zengzhishui.account}}</div>
                                    <div class="col-lg-7"><b>开户行：</b>{{invoiceInfo.zengzhishui.bank}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-2" style="text-align:right;">发送寄送至</div>
                            <div class="col-lg-10">
                                <div class="row">
                                    <div class="col-lg-3"><b>收货人：</b>{{invoiceInfo.consignee_name}}</div>
                                    <div class="col-lg-5"><b>联系电话：</b>{{invoiceInfo.consignee_phone}}</div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12"><b>邮寄地址：</b>{{invoiceInfo.address}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <product-detail-dialog :show.sync="dataForProductDetailDialog.show" :detail="dataForProductDetailDialog.detail"></product-detail-dialog>
        <edit-extra-amount-dialog v-if="canChangeExtraAmount" :show.sync="dataForEditExtraAmountDialog.show" :data="dataForEditExtraAmountDialog.data"></edit-extra-amount-dialog>
        <edit-extra-cost-dialog v-if="canChangeExtraCost" :show.sync="dataForEditExtraCostDialog.show" :data="dataForEditExtraCostDialog.data"></edit-extra-cost-dialog>
        <apply-invoice-dialog v-if="canApplyInvoice" :show.sync="dataForApplyInvoiceDialog.show" :order-ids="dataForApplyInvoiceDialog.orderIds" :invoice-info="dataForApplyInvoiceDialog.invoiceInfo" :max-apply-amount="dataForApplyInvoiceDialog.maxApplyAmount"></apply-invoice-dialog>
        <pay-qr-code-dialog v-if="orderBasic.status === 'DELIVERY_CONFIRMED'" :show.sync="dataForPayQrCodeDialog.show" :data="dataForPayQrCodeDialog.data"></pay-qr-code-dialog>
        <apply-refund-dialog v-if="canApplyRefund" :show.sync="dataForApplyRefundDialog.show" :data="dataForApplyRefundDialog.data"></apply-refund-dialog>
        <popup-dialog :show-dialog.sync="dataForPopupDialog.show" :dialog-title="dataForPopupDialog.title" :dialog-content="dataForPopupDialog.content"></popup-dialog>
    </div>
</template>

<script>
import Vue from 'vue'
import pingpp from 'pingpp-js'
import { Promise } from 'es6-promise'
import productDetailDialog from './comp/productDetailDialog.vue'
import popupDialog from '../../components/popupDialog.vue'
import consigneeInfoWithLogistics from './comp/consigneeInfoWithLogistics.vue'
import editExtraAmountDialog from './comp/editExtraAmountDialog.vue'
import editExtraCostDialog from './comp/editExtraCostDialog.vue'
import applyInvoiceDialog from './comp/applyInvoiceDialog.vue'
import payQrCodeDialog from './comp/payQrCodeDialog.vue'
import applyRefundDialog from './comp/applyRefundDialog.vue'
import { callback } from '../../store'
import { permissionValidator } from '../../store/rolePermission.js'

const CANCEL_ORDER = "CANCEL_ORDER";
const FINISH_ORDER = "FINISH_ORDER";
const CONFIRM_ORDER = "CONFIRM_ORDER";

export default {
    name: 'OrderDetailView',
    components: {
        productDetailDialog,
        popupDialog,
        consigneeInfoWithLogistics,
        editExtraAmountDialog,
        editExtraCostDialog,
        applyInvoiceDialog,
        payQrCodeDialog,
        applyRefundDialog,
    },
    route: {
        data({to}) {
            var orderId = to.params.id;
            if(!orderId) {
                this.$route.router.go({ path: '/order/list' });
            }
            this.getOrderDetial(orderId);
        }
    },
    data() {
        return {
            orderId: '',
            orderBasic: {
                customer: {
                },
                creator: {
                },
            },
            orderItems: [],
            consignees: [],
            paymentData: {},
            invoiceInfo: null,
            orderHistories: [],
            invoiceRecords: [],
            refundRecords: [],
            orderDate: null,
            permissionList: {
                createOrder: permissionValidator.orderSystem.order.createOrder(),
                editOrder: permissionValidator.orderSystem.order.editOrder(),
                finishOrder: permissionValidator.orderSystem.order.finishOrder(),
                cancelOrder: permissionValidator.orderSystem.order.cancelOrder(),
                applyInvoice: permissionValidator.orderSystem.order.applyInvoice(),
                afterSaleDeal: permissionValidator.orderSystem.order.afterSaleDeal(),
                confirmOrder: permissionValidator.orderSystem.order.confirmOrder(),
                applyRefund: permissionValidator.orderSystem.order.applyRefund(),
                changeExtraAmount: permissionValidator.orderSystem.order.changeExtraAmount(),
                changeExtraCost: permissionValidator.orderSystem.order.changeExtraCost(),
            },
            showInvoiceInfoDialog: false,
            dataForProductDetailDialog: {
                show: false,
                detail: {
                    name: '',
                    quantity: '',
                    size: '',
                    caizhi: '',
                    others:'',
                }
            },
            dataForEditExtraAmountDialog: {
                show: false,
                data: {
                    orderId: '',
                    minExtraAmount: '',
                    extraAmount: '',
                    extraAmountRemark: '',
                },
            },
            dataForEditExtraCostDialog: {
                show: false,
                data: {
                    orderId: '',
                    extra_cost: '',
                    extra_cost_remark: '',
                },
            },
            dataForApplyInvoiceDialog: {
                show: false,
                orderIds: [],
                invoiceInfo: {
                    amount: '',
                    content: '',
                    title: '',
                    zengzhishui: undefined,
                    remark: '',
                    consignee_name: '',
                    consignee_phone: '',
                    address: '',
                },
                maxApplyAmount: '',
            },
            dataForPayQrCodeDialog: {
                show: false,
                data: {
                    orderId: '',
                    amountToPay: '',
                    type: '',
                    qrCodeUrl: '',
                },
            },
            dataForApplyRefundDialog: {
                show: false,
                data: {
                    orderId: '',
                    refundAmount: '',
                    refundMethod: '',
                    refundAccount: '',
                    refundName: '',
                    refundReason: '',
                    maxRefundValue: '',
                },
            },
            dataForPopupDialog: {
                show: false,
                title: '删除确认',
                content: '',
            },
        }
    },
    computed: {
        canCancel() {
            if (this.orderId && this.permissionList.cancelOrder) {
                if (this.orderBasic.status == 'SUBMITTED' || this.orderBasic.status == 'ONLINE_PAID') {
                    return true;
                }
            }
            return false;
        },
        canFinish() {
            if (this.orderId && this.permissionList.finishOrder) {
                var flag = true;
                for (let i = 0; i < this.orderItems.length; i++) {
                    if (this.orderItems[i].produce_status !== 'COMPLETE') {
                        flag = false;
                        break;
                    }
                }
                if (flag && (this.orderBasic.status == 'DELIVERY_PAID' || this.orderBasic.status == 'ONLINE_CONFIRMED')) {
                    return true;
                }
            }
            return false;
        },
        canConfirm() {
            if (this.orderId && this.permissionList.confirmOrder) {
                if ((this.orderBasic.status === 'SUBMITTED' && this.paymentData.payment === 'CASH_ON_DELIVERY' && this.orderBasic.is_priced) || (this.orderBasic.status === 'ONLINE_PAID')) {
                    return true;
                }
            }
            return false;
        },
        isOrderProfitSure() {
            if (this.orderId) {
                if (!this.orderBasic.is_priced) {
                    return false;
                }
                for (let i = 0; i < this.orderItems.length; i++) {
                    if (this.orderItems[i].cost === 0) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        },
        isProductCostSure() {
            if (this.orderId) {
                for (let i = 0; i < this.orderItems.length; i++) {
                    if (this.orderItems[i].cost === 0) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        },
        canChangeExtraAmount() {
            if (this.orderId && this.permissionList.changeExtraAmount) {
                if (this.orderBasic.status == 'SUBMITTED' || this.orderBasic.status == 'DELIVERY_CONFIRMED') {
                    return true;
                }
            }
            return false;
        },
        canChangeExtraCost() {
            if (this.orderId && this.permissionList.changeExtraCost) {
                if (this.orderBasic.status != 'FINISHED' && this.orderBasic.status != 'CANCELED') {
                    return true;
                }
            }
            return false;
        },
        canApplyInvoice() {
            if (this.orderId && this.permissionList.applyInvoice) {
                if (this.orderBasic.status == 'DELIVERY_CONFIRMED' || this.orderBasic.status == 'DELIVERY_PAID' || this.orderBasic.status == 'ONLINE_CONFIRMED' || this.orderBasic.status == 'FINISHED') {
                    if (this.orderBasic.amount + this.orderBasic.freight - this.orderBasic.invoiced_amount > 0) {
                        return true;
                    }
                }
            }
            return false;
        },
        canRecordAfterSale() {
            if (this.orderId && this.permissionList.afterSaleDeal) {
                if (this.orderBasic.status == 'DELIVERY_CONFIRMED' || this.orderBasic.status == 'DELIVERY_PAID' || this.orderBasic.status == 'ONLINE_CONFIRMED' || this.orderBasic.status == 'FINISHED') {
                    return true;
                }
            }
            return false;
        },
        canApplyRefund() {
            if (this.orderId && this.permissionList.applyRefund) {
                if (this.paymentData.paid_amount > this.orderBasic.refunded_amount) {
                    return true;
                }
            }
            return false;
        },
    },
    events: {
        'click-positive-button'() {
            if (this.dataForPopupDialog.dialogId === CANCEL_ORDER) {
                this.cancelOrder();
            } else if (this.dataForPopupDialog.dialogId === FINISH_ORDER) {
                this.finishOrder();
            } else if (this.dataForPopupDialog.dialogId === CONFIRM_ORDER) {
                this.confirmOrder();
            }
        },
        'edit-extra-amount'() {
            location.reload();
        },
        'edit-extra-cost'() {
            location.reload();
        },
        'apply-invoice'() {
            location.reload();
        },
        'apply-refund'() {
            location.reload();
        },
    },
    filters: {
        paymentFilter(payment) {
            var paymentMap = {
                ONLINE: '在线支付',
                CASH_ON_DELIVERY: '货到付款',
            }
            return paymentMap[payment];
        },
    },
    methods: {
        getOrderDetial(id) {
            var url = '/api/v2/admin/orders/detail-v2?id=' + id
            this.$http.get(url)
            .then((response) => {
                if(!response.data.result || response.data.result === 0) {
                    var order = this.preprocessData(response.data);
                    this.orderId = id;
                    this.orderBasic = order.basic;
                    this.orderItems =order.items;
                    this.consignees = order.consignees;
                    this.paymentData = order.payment;
                    this.invoiceInfo = order.invoice;
                    this.orderHistories = order.histories;
                    this.invoiceRecords = order.invoice_records;
                    this.refundRecords = order.refunds;
                    this.orderDate = order.time;
                } else {
                    callback.success(response.data);
                }
            },(response) => {
                callback.error(response);
            })
        },
        showProductDetailDialog(item) {
            this.dataForProductDetailDialog.show = true;
            this.dataForProductDetailDialog.detail = {
                name: item.detail.name,
                quantity: item.detail.quantity,
                size: item.detail.size,
                caizhi: item.detail.caizhi,
                others: item.detail.others,
            }
        },
        showCancelOrderDialog() {
            this.dataForPopupDialog.show = true;
            this.dataForPopupDialog.title = "取消确认";
            this.dataForPopupDialog.content = "确定取消此订单？";
            this.dataForPopupDialog.dialogId = CANCEL_ORDER;
        },
        showFinishOrderDialog() {
            this.dataForPopupDialog.show = true;
            this.dataForPopupDialog.title = "完成确认";
            this.dataForPopupDialog.content = "确定完成此订单？";
            this.dataForPopupDialog.dialogId = FINISH_ORDER;
        },
        showConfirmOrderDialog() {
            this.dataForPopupDialog.show = true;
            this.dataForPopupDialog.title = "确认确认";
            this.dataForPopupDialog.content = "确定确认此订单？";
            this.dataForPopupDialog.dialogId = CONFIRM_ORDER;
        },
        cancelOrder() {
            var url = '/api/v2/admin/orders/cancel?order_id=' + this.orderId;
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
        finishOrder() {
            var url = '/api/v2/admin/orders/complete?order_id=' + this.orderId;
            this.$http.put(url)
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
        confirmOrder() {
            var url = '/api/v2/admin/orders/confirm?order_id=' + this.orderId;
            this.$http.put(url)
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
        changeExtraAmount() {
            this.dataForEditExtraAmountDialog.show = true;
            this.dataForEditExtraAmountDialog.data.orderId = this.orderId;
            this.dataForEditExtraAmountDialog.data.minExtraAmount = this.orderBasic.is_priced ? this.paymentData.paid_amount - this.orderBasic.amount : 0;
            this.dataForEditExtraAmountDialog.data.extraAmount = this.orderBasic.freight;
            this.dataForEditExtraAmountDialog.data.extraAmountRemark = this.orderBasic.freight_remark;
        },
        changeExtraCost() {
            this.dataForEditExtraCostDialog.show = true;
            this.dataForEditExtraCostDialog.data.orderId = this.orderId;
            this.dataForEditExtraCostDialog.data.extra_cost = this.orderBasic.extra_cost;
            this.dataForEditExtraCostDialog.data.extra_cost_remark = this.orderBasic.extra_cost_remark;
        },
        clickToApplyInvoice() {
            this.dataForApplyInvoiceDialog.show = true;
            this.dataForApplyInvoiceDialog.orderIds = [this.orderId];
            this.dataForApplyInvoiceDialog.maxApplyAmount = this.orderBasic.amount + this.orderBasic.freight - this.orderBasic.invoiced_amount;
            if (this.invoiceInfo) {
                this.dataForApplyInvoiceDialog.invoiceInfo = {
                    amount: this.invoiceInfo.amount,
                    content: this.invoiceInfo.content,
                    title: this.invoiceInfo.title,
                    remark: this.invoiceInfo.remark,
                    consignee_name: this.invoiceInfo.consignee_name,
                    consignee_phone: this.invoiceInfo.consignee_phone,
                    address: this.invoiceInfo.address,
                    zengzhishui: (this.invoiceInfo.zengzhishui ? {
                        identifier: this.invoiceInfo.zengzhishui.identifier,
                        address: this.invoiceInfo.zengzhishui.address,
                        phone: this.invoiceInfo.zengzhishui.phone,
                        account: this.invoiceInfo.zengzhishui.account,
                        bank: this.invoiceInfo.zengzhishui.bank,
                    } : undefined),
                };
            } else {
                this.dataForApplyInvoiceDialog.invoiceInfo = {
                    amount: '',
                    content: '',
                    title: '',
                    zengzhishui: undefined,
                    remark: '',
                    consignee_name: '',
                    consignee_phone: '',
                    address: '',
                };
            }
        },
        clickToshowInvoiceInfoDialog() {
            this.showInvoiceInfoDialog = true;
        },
        showOrHideInvoiceRecordItem(recordItem) {
            if (recordItem.showAll === undefined) {
                Vue.set(recordItem, 'showAll', true);
            } else {
                recordItem.showAll = !recordItem.showAll;
            }
        },
        closeInvoiceInfoDialog() {
            this.showInvoiceInfoDialog = false;
        },
        getPingxxPayCharge(type) {
            return new Promise((resolve, reject) => {
                var url = '/api/v2/admin/orders/create-pingxx-charge';
                var data = {
                    order_id: parseInt(this.orderId),
                    payment: type,
                };
                this.$http.post(url, data)
                .then((response) => {
                    if (!response.data.result || response.data.result === 0) {
                        resolve(response.data.charge);
                    } else {
                        callback.success(response.data);
                        reject(response.data);
                    }
                }, (response) => {
                    callback.error(response);
                    reject(response);
                });
            });
        },
        jumpToZhifubaoPayLink() {
            this.getPingxxPayCharge('ALIPAY_PC').then((charge) => {
                pingpp.createPayment(charge, function(result, err){
                    if (result == "success") {
                        // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
                    } else if (result == "fail") {
                        // charge 不正确或者微信公众账号支付失败时会在此处返回
                        alert('Charge不正确!');
                        location.reload();
                    } else if (result == "cancel") {
                        // 微信公众账号支付取消支付
                    }
                });
            });
        },
        showZhifubaoQRCodeDialog() {
            this.getPingxxPayCharge('ALIPAY_QR').then((charge) => {
                this.dataForPayQrCodeDialog.show = true;
                this.dataForPayQrCodeDialog.data.orderId = this.orderId;
                this.dataForPayQrCodeDialog.data.type = 'ALIPAY_QR';
                this.dataForPayQrCodeDialog.data.qrCodeUrl = JSON.parse(charge).credential.alipay_qr;
                this.dataForPayQrCodeDialog.data.amountToPay = this.orderBasic.amount + this.orderBasic.freight - this.paymentData.paid_amount;
            });
        },
        showWeChatQRCodeDialog() {
            this.getPingxxPayCharge('WECHAT_QR').then((charge) => {
                this.dataForPayQrCodeDialog.show = true;
                this.dataForPayQrCodeDialog.data.orderId = this.orderId;
                this.dataForPayQrCodeDialog.data.type = 'WECHAT_QR';
                this.dataForPayQrCodeDialog.data.qrCodeUrl = JSON.parse(charge).credential.wx_pub_qr;
                this.dataForPayQrCodeDialog.data.amountToPay = this.orderBasic.amount + this.orderBasic.freight - this.paymentData.paid_amount;
            });
        },
        clickToRecordAfterSale() {
            //TODO
        },
        clickToApplyRefund() {
            this.dataForApplyRefundDialog.show = true;
            this.dataForApplyRefundDialog.data.orderId = this.orderId;
            this.dataForApplyRefundDialog.data.refundAmount = '';
            this.dataForApplyRefundDialog.data.refundMethod = '';
            this.dataForApplyRefundDialog.data.refundAccount = '';
            this.dataForApplyRefundDialog.data.refundName = '';
            this.dataForApplyRefundDialog.data.refundReason = '';
            this.dataForApplyRefundDialog.data.maxRefundValue = this.paymentData.paid_amount - this.orderBasic.refunded_amount;
        },
        preprocessData(order) {
            var refunds = [];
            for (let i = 0; i < order.refunds.length; i++) {
                if (order.refunds[i].type !== 'TRANSACTION_FAILED') {
                    refunds.push(order.refunds[i]);
                }
            }
            order.refunds = refunds;
            return order;
        }
    }
}
</script>

<style scoped>
.product-table, .payment-records-table, .refund-records-table {
    table-layout: fixed;
}

.product-table th, .product-table td, .payment-records-table th, .payment-records-table td, .refund-records-table th, .refund-records-table td {
    text-align: center;
    vertical-align: middle;
}

.product-table td .btn-link, .invoice-info .btn-link {
    text-decoration: none;
    cursor: pointer;
}

.product-table td .btn-link:hover, .invoice-info .btn-link:hover {
    text-decoration: underline;
}
</style>