//订单相关
function validateProductName(productName) {
	var result = {};
	result.ok = false;
	if (!productName) {
		result.errorMsg = "产品名称不能为空";
		return result;
	} 
	if (productName.length > 20) {
		result.errorMsg = "产品名称长度不能大于20";
		return result;
	}
	result.ok = true;
	return result;
}

function validateProductQuantity(productQuantity) {
	var result = {};
	result.ok = false;
	if (!productQuantity) {
		result.errorMsg = "产品数量不能为空";
		return result;
	}
	if (productQuantity.length > 12) {
		result.errorMsg = "产品数量长度不能大于12";
		return result;
	}
	result.ok = true;
	return result;
}

function validateProductPrice(productPrice) {
	var result = {};
	result.ok = false;
	if (!productPrice || productPrice < 0) {
		result.errorMsg = "产品价格不能为空且必须为正数";
		return result;
	}
	result.ok = true;
	return result;
}

function validateCustomerName(customerName) {
	var result = {};
	result.ok = false;
	if (!customerName) {
		result.errorMsg = "客户名称不能为空";
		return result;
	} 
	if (customerName.length > 20) {
		result.errorMsg = "客户名称长度不能大于20";
		return result;
	}
	result.ok = true;
	return result;
}

function validateConsigneeName(consigneeName) {
	var result = {};
	result.ok = false;
	if (!consigneeName) {
		result.errorMsg = "收货人名称不能为空";
		return result;
	} 
	if (consigneeName.length > 20) {
		result.errorMsg = "收货人名称长度不能大于20";
		return result;
	}
	result.ok = true;
	return result;
}

function validateConsigneePhone(consigneePhone) {
	var result = {};
	result.ok = false;
	var phone_pattern = /^[0-9]{11}$/;
	if (!consigneePhone) {
		result.errorMsg = "收货人手机不能为空";
		return result;
	} 
	if (!phone_pattern.test(consigneePhone)) {
		result.errorMsg = "收货人手机格式有误";
		return result;
	}
	result.ok = true;
	return result;
}

function validateConsigneeAddress(regionId, detailAddress) {
	var result = {};
	result.ok = false;
	if (regionId === 0) {
		result.errorMsg = "请选择收货人所在地省市区";
		return result;
	}
	if (!detailAddress) {
		result.errorMsg = "收货人详细地址不能为空";
		return result;
	}
	if (detailAddress.length > 50) {
		result.errorMsg = "收货人详细地址不能大于50";
		return result;
	}
	result.ok = true;
	return result;
}

function validateInvoiceAmount(amount) {
	var result = {};
	result.ok = false;
	if (!amount || amount < 0) {
		result.errorMsg = "开票金额不能为空且必须为正数";
		return result;
	}
	result.ok = true;
	return result;
}

function validateInvoiceItem(name, data) {
	var result = {};
	result.ok = false;
	if (!data) {
		result.errorMsg = name + "不能为空";
		return result;
	} 
	if (data.length > 50) {
		result.errorMsg = name + "长度不能大于50";
		return result;
	}
	result.ok = true;
	return result;
}

function validateApplyInvoiceAmount(amount, maxValue) {
	var result = {};
	result.ok = false;
	if (amount === undefined || amount === null || amount === '') {
		result.errorMsg = "使用额度不能为空";
		return result;
	}
	if (amount <= 0 || amount > maxValue) {
		result.errorMsg = "使用额度必须为正数且不能超过" + (maxValue / 100) + "元";
		return result;
	}
	result.ok = true;
	return result;
}

function validateExtraAmount(extraAmount, minValue) {
	var result = {};
	result.ok = false;
	if (extraAmount === undefined || extraAmount === null || extraAmount === '') {
		result.errorMsg = "补充金额不能为空";
		return result;
	}
	if (extraAmount <= minValue) {
		result.errorMsg = "补充金额必须大于" + (minValue / 100) + "元";
		return result;
	}
	result.ok = true;
	return result;
}

function validateExtraCost(extraCost) {
	var result = {};
	result.ok = false;
	if (extraCost === undefined || extraCost === null || extraCost === '') {
		result.errorMsg = "额外成本不能为空";
		return result;
	}
	if (extraCost < 0) {
		result.errorMsg = "额外成本必须大于等于0";
		return result;
	}
	result.ok = true;
	return result;
}

function validateAfterSaleItem(name, data) {
	var result = {};
	result.ok = false;
	if (!data) {
		result.errorMsg = name + "不能为空";
		return result;
	} 
	if (data.length > 2000) {
		result.errorMsg = name + "长度不能大于2000";
		return result;
	}
	result.ok = true;
	return result;
}

function validateProductCost(cost, allowEmpty) {
	var result = {};
	result.ok = false;
	if (!cost) {
		if (allowEmpty) {
			result.ok = true;
			return result;
		} else {
			result.errorMsg = "成本不能为空或者0";
			return result;
		}
	}
	if (cost < 0) {
		result.errorMsg = "成本必须大于0";
		return result;
	}
	result.ok = true;
	return result;
}

function validateLogisticsCost(cost) {
	var result = {};
	result.ok = false;
	if (cost === undefined || cost === null || cost === '') {
		result.errorMsg = "物流成本不能为空";
		return result;
	}
	if (cost < 0) {
		result.errorMsg = "物流成本必须大于等于0";
		return result;
	}
	result.ok = true;
	return result;
}

function validateLogisticsItem(name, data) {
	var result = {};
	result.ok = false;
	if (!data) {
		result.errorMsg = name + "不能为空";
		return result;
	} 
	if (data.length > 2000) {
		result.errorMsg = name + "长度不能大于2000";
		return result;
	}
	result.ok = true;
	return result;
}

function validateRefundAmount(amount, maxValue) {
	var result = {};
	result.ok = false;
	if (!amount || amount < 0) {
		result.errorMsg = "退款金额不能为空且必须为正数";
		return result;
	}
	if (amount > maxValue) {
		result.errorMsg = "退款金额不能大于" + (maxValue / 100) + "元";
		return result;
	}
	result.ok = true;
	return result;
}

function validateRefundAccount(account) {
	var result = {};
	result.ok = false;
	if (!account) {
		result.errorMsg = "对方账号不能为空";
		return result;
	} 
	if (account.length > 50) {
		result.errorMsg = "对方账号长度不能大于50";
		return result;
	}
	result.ok = true;
	return result;
}

function validateRefundReason(reason) {
	var result = {};
	result.ok = false;
	if (!reason) {
		result.errorMsg = "退款原因不能为空";
		return result;
	} 
	if (reason.length > 2000) {
		result.errorMsg = "退款原因长度不能大于2000";
		return result;
	}
	result.ok = true;
	return result;
}


//财务系统相关
function validatePaymentAmount(amount, maxValue) {
	var result = {};
	result.ok = false;
	if (!amount || amount < 0) {
		result.errorMsg = "付款金额不能为空且必须为正数";
		return result;
	}
	if (amount > maxValue) {
		result.errorMsg = "付款金额不能大于该订单剩余的待支付金额(" + (maxValue / 100) + "元)";
		return result;
	}
	result.ok = true;
	return result;
}

//CRM相关
function validateSupplierName(supplierName) {
	var result = {};
	result.ok = false;
	if (!supplierName) {
		result.errorMsg = "供应商名称不能为空";
		return result;
	} 
	if (supplierName.length > 20) {
		result.errorMsg = "供应商名称长度不能大于20";
		return result;
	}
	result.ok = true;
	return result;
}

function validateDisplayName(displayName) {
	var result = {};
	result.ok = false;
	if (!displayName) {
		result.errorMsg = "真实姓名不能为空";
		return result;
	}
	if (displayName.length > 20) {
		result.errorMsg = "真实姓名长度不能大于20";
		return result;
	}
	result.ok = true;
	return result;
}

function validateUserName(username) {
	var result = {};
	result.ok = false;
	if (!username) {
		result.errorMsg = "用户名不能为空";
		return result;
	}
	if (username.length > 50) {
		result.errorMsg = "用户名长度不能大于50";
		return result;
	}
	result.ok = true;
	return result;
}

function validatePassword(password) {
	var result = {};
	result.ok = false;
	var password_pattern = /^[a-zA-Z0-9]*$/;
	if (!password) {
		result.errorMsg = "密码不能为空";
		return result;
	}
	if (password.length > 20) {
		result.errorMsg = "密码长度不能超过20";
		return result;
	}
	if (!password_pattern.test(password)) {
		result.errorMsg = "密码只能包含英文字母和数字";
		return result;
	}
	result.ok = true;
	return result;
}

const DEFAULT_PASSWORD = '******';

function validateCustomerName(name) {
	var result = {};
	result.ok = false;
	if (!name) {
		result.errorMsg = "客户名称不能为空";
		return result;
	}
	if (name.length > 50) {
		result.errorMsg = "客户名称长度不能大于50";
		return result;
	}
	result.ok = true;
	return result;
}

function validateCustomerCompany(company) {
	var result = {};
	result.ok = false;
	if (!company) {
		result.errorMsg = "客户公司不能为空";
		return result;
	}
	if (company.length > 50) {
		result.errorMsg = "客户公司长度不能大于50";
		return result;
	}
	result.ok = true;
	return result;
}

export var orderValidator = {
	validateProductName,
	validateProductQuantity,
	validateProductPrice,
	validateCustomerName,
	validateConsigneeName,
	validateConsigneePhone,
	validateConsigneeAddress,
	validateInvoiceAmount,
	validateInvoiceItem,
	validateApplyInvoiceAmount,
	validateExtraAmount,
	validateExtraCost,
	validateAfterSaleItem,
	validateProductCost,
	validateLogisticsCost,
	validateLogisticsItem,
	validateRefundAmount,
	validateRefundAccount,
	validateRefundReason,
};

export var financeValidator = {
	validatePaymentAmount,
};

export var crmValidator = {
	validateSupplierName,
	validateDisplayName,
	validateUserName,
	validatePassword,
	DEFAULT_PASSWORD,
	validateCustomerName,
	validateCustomerCompany,
};

