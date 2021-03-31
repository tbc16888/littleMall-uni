export default {

	namespaced: true,

	state: {
		orderList: []
	},

	getters: {
		orderList(state) {
			return state.orderList || []
		}
	},

	mutations: {

		// 设置订单列表
		setOrderList(state, data) {
			if (null === data) return state.orderList = []
			console.log('setOrderList')
			state.orderList = state.orderList.concat(data)
		},

		// 替换订单列表中的某一个
		setOrderItem(state, data) {
			let index = state.orderList.findIndex(order => {
				return order.basic.data.field.order_sn === data.basic.data.field.order_sn
			})
			state.orderList.splice(index, 1, data)
		},

		//
		removeOrderItem(state, data) {
			let index = state.orderList.findIndex(order => {
				return order.basic.data.field.order_sn === data.basic.data.field.order_sn
			})
			state.orderList.splice(index, 1)
		}
	},

	actions: {

		async getOrderDetail({
			commit
		}, orderSn) {
			const res = await uni.$http.get('/order/detail', {
				order_sn: orderSn
			})
			if (res.data.code !== 0) {
				return uni.showToast({
					title: res.data.message,
					icon: 'none'
				})
			}
			commit('setOrderItem', res.data.data)
		},

	}
}
