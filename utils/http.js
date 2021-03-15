// 统一请求
const instance = async (url, options) => {

	let baseURL = 'http://mall.demo.taoshatec.com/v1'
	if (url.indexOf('http') === -1) url = baseURL + url

	let header = {
		'Authorization': uni.getStorageSync('login@token') || '',
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
	}
	if (options.header) header = {...header, ...options.header}
	options.method = options.method || 'GET'

	if (options.method == 'POST') {
		uni.showLoading({
			title: '请稍等',
			mask: true
		});
	}

	let [error, res] = await uni.request({
		url: url,
		header: header,
		method: options.method,
		data: options.data
	})

	if (options.method == 'POST') {
		uni.hideLoading()
		if (res.data.code === 401 || res.data.code === 403) {
			uni.navigateTo({
				url: '/pages/authorize/login',
				animationDuration: 300,
				animationType: 'slide-in-bottom'
			})
		}
	}
	return res
}

const http = {

	get: async (url, params, config) => {
		let options = {};
		if (typeof config === 'undefined') config ={}
		options = {...options, ...config}
		if (typeof params !== 'undefined') options.data = params;
		options.method = 'GET';
		// 解决nvue不渲染问题
		return await new Promise((resolve, reject) => {
			instance(url, options).then((res) => {
				setTimeout(() => {
					resolve(res)
				}, 1)
			})
		})
		// return await instance(url, options);
	},


	post: async (url, params) => {
		let options = {};
		if (typeof params !== 'undefined') options.data = params;
		options.method = 'POST';
		return await new Promise((resolve, reject) => {
			instance(url, options).then((res) => {
				setTimeout(() => {
					resolve(res)
				}, 1)
			})
		})
		// return await instance(url, options);
	},
	
	delete: async (url, params) => {
		let options = {};
		if (typeof params !== 'undefined') options.data = params;
		options.method = 'DELETE';
		return await new Promise((resolve, reject) => {
			instance(url, options).then((res) => {
				setTimeout(() => {
					resolve(res)
				}, 1)
			})
		})
		// return await instance(url, options);
	},
}
module.exports = http
