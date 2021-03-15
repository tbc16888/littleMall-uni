export default {
	methods: {
		toLink(item) {
			console.log(item)
			let link = item.link
			const pages = [
				'pages/index/index',
				'pages/dynamic/dynamic',
				'pages/order/order-list/order-list',
				'pages/mine/mine/mine'
			]
			for (let i in pages) {
				if (link.indexOf(pages[i]) > -1) {
					// tabbar 无法传参解决
					let str = link.substr(link.indexOf("?") + 1)
					if (str) uni.setStorageSync("pages@category", str)
					if (link.indexOf("?") > -1) link = link.substr(0, link.indexOf("?"))
					return uni.switchTab({
						url: link
					})
				}
			}
console.log(link)
			return uni.navigateTo({
				url: link
			})
		}
	}
}
