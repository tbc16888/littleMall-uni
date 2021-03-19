import Vue from 'vue'
import App from './App'

import http from './utils/http.js'
uni.$http = http 
uni.$toast = function(title) {
	uni.showToast({
		title,
		icon: 'none'
	})
};


import store from './store'
Vue.prototype.$store = store

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()


