export default {

	data() {
		return {
			totalPrice: 0,
			totalGoodsNumber: 0,
		}
	},

	methods: {
		
		// 计算总价
		calcTotalPrice(data) {
			let total = 0
			for (let i = 0; i < data.length; i++) {
				let item = data[i]
				if (item.is_selected === 1) total += item.goods_number * item.activity_price
			}
			this.totalPrice = total.toFixed(2)
			return total.toFixed(2)
		},

		// 计算所有商品总件数
		calcTotalGoodsNumber(data) {
			let total = 0
			for (let i = 0; i < data.length; i++) {
				let item = data[i]
				if (item.is_selected === 1) total += item.goods_number
			}
			this.totalGoodsNumber = total
			return total
		},

		// 计算选中个数
		calcCheckedCount(data) {
			let checkedCount = 0
			for (let i = 0; i < data.length; i++) {
				let item = data[i]
				if (item.is_selected === 1) checkedCount += 1
			}
			return checkedCount
		}
	}
}
