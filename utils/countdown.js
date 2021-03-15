export default {

	diff: function(datetime1, datetime2) {
		let date1 = (new Date(datetime1.replace(/-/g, '/'))).getTime()
		let date2 = datetime2 ? (new Date(datetime2)).getTime() : (new Date()).getTime()
		let diff = (date1 - date2) / 1000
		return diff
	},

	start: function(params, callback, endCallback) {
		let that = this
		let time = typeof params === 'object' ? params.time : params
		let interval = typeof params === 'object' ? params.interval : 1000
		if (time < 0) time = 0
		callback && callback(this.format(time, interval < 1000), time)
		if (time <= 0) return endCallback && endCallback()
		const timer = setInterval(function () {
			time = ((time * 1000 - interval) / 1000).toFixed(1)
			callback && callback(that.format(time, interval < 1000), time)
			if (time > 0) return
			clearInterval(timer)
			endCallback && endCallback()
		}, interval)
		return timer
	},

	zerofill: function(digital) {
		for (let i = 0; i < digital.length; i++) {
			digital[i].value = ('0' + digital[i].value).slice(-2)
		}
		return digital
	},

	format: function(time, microsecond) {
		let digital = []
		let hour = Math.floor(time / 3600)
		if (hour > 24) {
			digital.push({
				label: '天',
				value: Math.floor(hour / 24)
			})
			digital.push({
				label: '时',
				value: Math.floor(hour % 24)
			})
		} else {
			digital.push({
				label: '时',
				value: hour
			})
		}
		digital.push({
			label: '分',
			value: Math.floor(time % 3600 / 60)
		})
		digital.push({
			label: '秒',
			value: Math.floor(time % 3600 % 60)
		})
		if (microsecond) digital.push({
			value: time.toString().split('.')[1] || 0
		})
		return digital
	}
}
