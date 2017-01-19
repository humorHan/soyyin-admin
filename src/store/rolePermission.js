import $ from 'jquery'

const SUPER_ADMIN = 1;
const CUSTOMER_SERVICE = 3;
const SUPPLY_MANAGER = 6;
const FINANCE_STAFF = 7;
const SOYYIN_CUSTOMER_MANAGER = 8;
const ORDER_MANAGER = 9;
const PR_CUSTOMER_MANAGER = 10;
const SOYYIN_OPERATOR = 11;

var roles = $.cookie("roles") ? JSON.parse($.cookie("roles")) : null;
	
export var permissionValidator = {
	orderSystem: {
		order: {
			visible() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_CUSTOMER_MANAGER || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === ORDER_MANAGER || roles[i].id === PR_CUSTOMER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
			soyyinOrderList() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === CUSTOMER_SERVICE) {
							return true;
						}
					}
				}
				return false;
			},
			myOrderList() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_CUSTOMER_MANAGER 
							|| roles[i].id === CUSTOMER_SERVICE || roles[i].id === PR_CUSTOMER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
			createByMeOrderList() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === ORDER_MANAGER || roles[i].id === CUSTOMER_SERVICE) {
							return true;
						}
					}
				}
				return false;
			},
			allOrderList() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === FINANCE_STAFF) {
							return true;
						}
					}
				}
				return false;
			},
			createOrder() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === ORDER_MANAGER || roles[i].id === PR_CUSTOMER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
			editOrder() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_CUSTOMER_MANAGER || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === ORDER_MANAGER || roles[i].id === PR_CUSTOMER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
			assignManager() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === ORDER_MANAGER || roles[i].id === CUSTOMER_SERVICE) {
							return true;
						}
					}
				}
				return false;
			},
			cancelOrder() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_CUSTOMER_MANAGER || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === ORDER_MANAGER || roles[i].id === PR_CUSTOMER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
			finishOrder() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_CUSTOMER_MANAGER || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === PR_CUSTOMER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
			applyInvoice() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_CUSTOMER_MANAGER || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === ORDER_MANAGER || roles[i].id === PR_CUSTOMER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
			afterSaleDeal() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_CUSTOMER_MANAGER || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === ORDER_MANAGER || roles[i].id === PR_CUSTOMER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
			confirmOrder() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === CUSTOMER_SERVICE) {
							return true;
						}
					}
				}
				return false;
			},
			applyRefund() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_CUSTOMER_MANAGER || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === ORDER_MANAGER || roles[i].id === PR_CUSTOMER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
			changeExtraAmount() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_CUSTOMER_MANAGER || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === ORDER_MANAGER || roles[i].id === PR_CUSTOMER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
			changeExtraCost() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === FINANCE_STAFF) {
							return true;
						}
					}
				}
				return false;
			},
		},
		supplier: {
			visible() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === ORDER_MANAGER || roles[i].id === PR_CUSTOMER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
			soyyinOrderList() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === CUSTOMER_SERVICE) {
							return true;
						}
					}
				}
				return false;
			},
			createByMeOrderList() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === ORDER_MANAGER 
							|| roles[i].id === CUSTOMER_SERVICE || roles[i].id === PR_CUSTOMER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
			allOrderList() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN) {
							return true;
						}
					}
				}
				return false;
			},
			assignSupplier() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === ORDER_MANAGER || roles[i].id === PR_CUSTOMER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
		},
		making: {
			visible() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === ORDER_MANAGER || roles[i].id === PR_CUSTOMER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
			assignToMeOrderList() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === ORDER_MANAGER || roles[i].id === PR_CUSTOMER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
			allOrderList() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === CUSTOMER_SERVICE || roles[i].id === ORDER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
			editProduceStatus() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === ORDER_MANAGER || roles[i].id === PR_CUSTOMER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
			recordLogistics() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === ORDER_MANAGER || roles[i].id === PR_CUSTOMER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
		},
	},
	financeSystem: {
		invoice: {
			visible() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === FINANCE_STAFF || roles[i].id === ORDER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
			view() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === FINANCE_STAFF || roles[i].id === ORDER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
			finishInvoice() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === FINANCE_STAFF) {
							return true;
						}
					}
				}
				return false;
			},
			recordLogistics() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === CUSTOMER_SERVICE || roles[i].id === ORDER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
		},
		receivable: {
			visible() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === FINANCE_STAFF) {
							return true;
						}
					}
				}
				return false;
			},
			view() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === FINANCE_STAFF) {
							return true;
						}
					}
				}
				return false;
			},
			recordReceivables() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === FINANCE_STAFF) {
							return true;
						}
					}
				}
				return false;
			},
		},
		refund: {
			visible() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === FINANCE_STAFF) {
							return true;
						}
					}
				}
				return false;
			},
			view() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === FINANCE_STAFF) {
							return true;
						}
					}
				}
				return false;
			},
			finishRefund() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === FINANCE_STAFF) {
							return true;
						}
					}
				}
				return false;
			},
		},
	},
	crmSystem: {
		supplier: {
			visible() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SUPPLY_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
			view() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SUPPLY_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
			addSupplier() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SUPPLY_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
			deleteSupplier() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN) {
							return true;
						}
					}
				}
				return false;
			},
			editSupplier() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SUPPLY_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
		},
		member: {
			visible() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_CUSTOMER_MANAGER || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === ORDER_MANAGER || roles[i].id === PR_CUSTOMER_MANAGER 
							|| roles[i].id === SUPPLY_MANAGER || roles[i].id === FINANCE_STAFF || roles[i].id === SOYYIN_OPERATOR) {
							return true;
						}
					}
				}
				return false;
			},
			view() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_CUSTOMER_MANAGER || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === ORDER_MANAGER || roles[i].id === PR_CUSTOMER_MANAGER 
							|| roles[i].id === SUPPLY_MANAGER || roles[i].id === FINANCE_STAFF || roles[i].id === SOYYIN_OPERATOR) {
							return true;
						}
					}
				}
				return false;
			},
			addMember() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN) {
							return true;
						}
					}
				}
				return false;
			},
			deleteMember() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN) {
							return true;
						}
					}
				}
				return false;
			},
			editMember() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN) {
							return true;
						}
					}
				}
				return false;
			},
		},
		customer: {
			visible() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_CUSTOMER_MANAGER || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === ORDER_MANAGER || roles[i].id === PR_CUSTOMER_MANAGER || roles[i].id === FINANCE_STAFF) {
							return true;
						}
					}
				}
				return false;
			},
			view() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_CUSTOMER_MANAGER || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === ORDER_MANAGER || roles[i].id === PR_CUSTOMER_MANAGER || roles[i].id === FINANCE_STAFF) {
							return true;
						}
					}
				}
				return false;
			},
			addCustomer() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_CUSTOMER_MANAGER || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === ORDER_MANAGER || roles[i].id === PR_CUSTOMER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
			deleteCustomer() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN) {
							return true;
						}
					}
				}
				return false;
			},
			editCustomer() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_CUSTOMER_MANAGER || roles[i].id === CUSTOMER_SERVICE 
							|| roles[i].id === ORDER_MANAGER || roles[i].id === PR_CUSTOMER_MANAGER) {
							return true;
						}
					}
				}
				return false;
			},
		},
	},
	dataCenter: {
		downloads: {
			visible() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === FINANCE_STAFF) {
							return true;
						}
					}
				}
				return false;
			},
			downloadOrderReport() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === FINANCE_STAFF) {
							return true;
						}
					}
				}
				return false;
			},
			downloadOrderItemReport() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === FINANCE_STAFF) {
							return true;
						}
					}
				}
				return false;
			},
			downloadFinishedOrderReport() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === FINANCE_STAFF) {
							return true;
						}
					}
				}
				return false;
			},
		},
		statistics: {
			visible() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === FINANCE_STAFF) {
							return true;
						}
					}
				}
				return false;
			},
			statsAccordingToTime() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === FINANCE_STAFF) {
							return true;
						}
					}
				}
				return false;
			},
			statsAccordingToCustomer() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === FINANCE_STAFF) {
							return true;
						}
					}
				}
				return false;
			},
			statsAccordingToManager() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === FINANCE_STAFF) {
							return true;
						}
					}
				}
				return false;
			},
		},
	},
	soyyinWebsite: {
		products: {
			visible() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_OPERATOR) {
							return true;
						}
					}
				}
				return false;
			},
			view() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_OPERATOR) {
							return true;
						}
					}
				}
				return false;
			},
			addProduct() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_OPERATOR) {
							return true;
						}
					}
				}
				return false;
			},
			stickProduct() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_OPERATOR) {
							return true;
						}
					}
				}
				return false;
			},
			onOffSale() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_OPERATOR) {
							return true;
						}
					}
				}
				return false;
			},
			editDetail() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_OPERATOR) {
							return true;
						}
					}
				}
				return false;
			},
			editBaseInfo() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_OPERATOR) {
							return true;
						}
					}
				}
				return false;
			},
			eidtOption() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_OPERATOR) {
							return true;
						}
					}
				}
				return false;
			},
			operatePrice() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_OPERATOR) {
							return true;
						}
					}
				}
				return false;
			},
		},
		cases: {
			visible() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_OPERATOR) {
							return true;
						}
					}
				}
				return false;
			},
			view() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_OPERATOR) {
							return true;
						}
					}
				}
				return false;
			},
			addCase() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_OPERATOR) {
							return true;
						}
					}
				}
				return false;
			},
			editCase() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_OPERATOR) {
							return true;
						}
					}
				}
				return false;
			},
			deleteCase() {
				if (roles) {
					for (let i = 0; i < roles.length; i++) {
						if (roles[i].id === SUPER_ADMIN || roles[i].id === SOYYIN_OPERATOR) {
							return true;
						}
					}
				}
				return false;
			},
		},
	},
};