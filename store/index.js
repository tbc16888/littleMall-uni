import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
	
	state: {
		loginToken: '',
		loginUserInfo: {},
		loginDefaultUserInfo: {
			nick_name: '立即登录',
			user_id: '',
			avatar: '/static/logo.png'
		},
		currentAddressId: '',
		storageSuffix: '',
		test: '城市标题'
	},

	mutations: {
		
		// 设置登录用户信息
		setLoginUserInfo(state, data) {
			state.loginUserInfo = data
			state.storageSuffix = data.user_id
		}
	},
	

	getters: {
		
		
		loginUserInfo(state) {
			if (state.loginUserInfo.user_id === undefined) return state.loginDefaultUserInfo	
			return state.loginUserInfo
		}
	},

	actions: {
		
		init({dispatch}) {
			if (!uni.getStorageSync('login@token')) return dispatch('logout')
			dispatch('getLoginUserInfo')
		},
		
		async logout({state, commit}) {
			uni.removeStorageSync('login@token')
			commit('setLoginUserInfo', state.loginDefaultUserInfo)
		},
		
		async getLoginUserInfo({commit}) {
			const res = await uni.$http.get('/user/profile')
			if (res.data.code !== 0) {
				if (res.data.code === 401) return 
				return uni.showToast({
					title: res.data.message,
					icon: 'none'
				})
			}
			commit('setLoginUserInfo', res.data.data)
		}
	}
})

export default store
