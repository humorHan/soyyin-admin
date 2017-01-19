<!-- main.vue -->
<template>
    <div class="container-fluid">
        <div class="row">
            <sidebar :type="type"></sidebar>
            <div class="col-md-11 col-md-offset-1 main">
                <router-view
                  class="view"
                  transition
                  transition-mode="out-in">
                </router-view>
            </div>
        </div>
    </div>
</template>

<script>
import sidebar from './sidebar.vue'

export default {
    name: 'MainView',
    route: {
        data({ to }) {
            var arr = to.path.split('/');
            this.type = arr[1];
        }
    },
    components: {
        sidebar
    },
    data() {
        return {
            type: ''
        }
    }
}
</script>