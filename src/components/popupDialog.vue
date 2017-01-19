<!-- popupDialog.vue -->
<template>
    <div class="modal" v-show="showDialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" @click="closeDialog">&times;</button>
                    <h4 class="modal-title">{{ dialogTitle }}</h4>
                </div>
                <div class="modal-body">
                    <p>{{ dialogContent }}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" @click="clickNegativeButton">{{ negativeButtonText }}</button>
        			<button type="button" class="btn btn-primary" @click="clickPositiveButton">{{ positiveButtonText }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'PopupDialogView',
    props: {
    	showDialog: Boolean,
    	dialogTitle: String,
    	dialogContent: String,
    	negativeButtonText: {
    		type: String,
    		default: '取消'
    	},
    	positiveButtonText: {
    		type: String,
    		default: '确定'
    	},
    },
    methods: {
    	closeDialog(event) {
    		this.showDialog = false;
    	},
    	clickPositiveButton(event) {
    		this.showDialog = false;
    		this.$dispatch('click-positive-button');
    	},
    	clickNegativeButton(event) {
    		this.showDialog = false;
    		this.$dispatch('click-negative-button');
    	},
    },
}

</script>

<style scoped>
.modal {
	height: 100%;
}

.modal-dialog {
	top: 30%;
}

</style>