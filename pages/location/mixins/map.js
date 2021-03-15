// #ifdef APP-PLUS
const mapSearch = weex.requireModule('mapSearch')
// #endif
import http from '@/utils/http.js'
export default {
	methods: {
		getLocation() {
			const that = this
			uni.getLocation({
				type: 'gcj02', // 返回可以用于uni.openLocation的经纬度
				success: function(res) {
					that.location.latitude = res.latitude
					that.location.longitude = res.longitude
					that.reverseGeocoder()
					console.log(res)
				},
				complete: function(res) {
					console.log(res)
					if (res.errMsg === 'getLocation:fail') {
						return uni.showToast({
							title: '定位失败',
							icon: 'none'
						})
					}
				}
			});
		},

		// 经纬度获取附近
		reverseGeocoder() {
			return this.getNearByList()
			let that = this
			let location = [this.location.latitude, this.location.longitude].join(',')

			// #ifdef APP-PLUS
			mapSearch.poiSearchNearBy({
				point: this.location,
				key: ''
			}, function(res) {
				let nearbyList = []
				res.poiList.forEach(item => {
					nearbyList.push({
						title: item.name,
						address: item.address
					})
				})
				that.nearbyList = nearbyList
			});
			// #endif

			// {
			// 	location,
			// 	get_poi: 1,
			// 	success(res) {
			// 		that.isOnSearchPoi = false
			// 		if (res.message !== 'query ok') return
			// 		that.nearbyList = res.result.pois
			// 	},
			// });
		},

		async getNearByList() {
			let location = [this.location.latitude, this.location.longitude].join(',')
			console.log('/map/getNearByList?location=' + location)
			const res = await http.get('/map/getNearByList', {location})
			if (res.data.code !== 0) return uni.showToast({
				title: res.data.message,
				icon: 'none'
			})
			this.nearbyList = []
			res.data.data.list.forEach(item => {
				this.nearbyList.push(item)
			})
		},
	}
}
