export default {
	
	methods: {
		couponFormat(dataList) {
			dataList.forEach(item => {
				item.effective_time = item.effective_start_time
				if (item.effective_end_time) {
					item.effective_time += ' 至 ' + item.effective_end_time
				}
				if (item.use_scope_text) {
					item.coupon_name += '(' + item.use_scope_text + ')'
				}
			})
			return dataList
		}
	}
	
}