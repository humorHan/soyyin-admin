<!-- popupTips.vue -->
<template>
	<div class="popuptips-container" v-if="show" transition="fade">
	    <div class="panel panel-{{ tipsType }}">
			<div class="panel-heading">
		   		<h3 class="panel-title">{{ tipsTitle }}</h3>
			</div>
			<div class="panel-body">
		    	{{ tipsContent }}
			</div>
		</div>
	</div>
</template>

<script>

export default {
    name: 'PopupTipsView',
    replace: false,
    props: {
    	show: Boolean,
    	tipsType: String,
    	tipsTitle: String,
    	tipsContent: String
    },
    watch: {
        show(val, oldVal) {
            if (val === true) {
            	setTimeout(() => {
            		this.show = false;
            	}, 1000);
            }
        },
    },
}

</script>

<style scoped>
.popuptips-container {
	position: fixed;
	left: 50%;
	top: 40%;
    z-index: 2000;
}
.panel {
	position: relative;
    left: -50%;
}

.fade-transition {
  transition: all 1s ease;
}

.fade-leave {
  opacity: 0;
}
</style>