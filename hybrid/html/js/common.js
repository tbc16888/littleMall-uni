window.location.query = function (key) {
    let url = document.location.toString().split('?');
    if (url.length <= 1) return '';
    let params = url[1].split('&');
    for (let i = 0; i < params.length; i++) {
        let query = params[i].split('=');
        if (query !== null && query[0] === key) return query[1];
    }
    return '';
};
window._api = {
    domain: 'https://api.fjblwj.cn'
}
// 下划线转换驼峰
function toHump(name) {
    return name.replace(/\_(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
}
// 驼峰转换下划线
function toLine(name) {
    return name.replace(/([A-Z])/g,"_$1").toLowerCase();
}

function keyToLine(object) {
    let a = {}
    for (let i in object) a[toLine(i)] = object[i]
    return a
}


;(function(win) {
    win.countdown = {

        diff: function(datetime1, datetime2) {
            let date1 = (new Date(datetime1.replace(/-/g, '/'))).getTime()
            let date2 = datetime2 ? (new Date(datetime2)).getTime() : (new Date()).getTime()
            let diff = (date1 - date2) / 1000
            return diff
        },

        start: function(params, callback, endCallback) {
            let time = typeof params === 'object' ? params.time : params
            let interval = typeof params === 'object' ? params.interval : 1000
            if (time < 0) time =  0
            callback && callback(this.format(time, interval < 1000))
            if (time <= 0) return endCallback && endCallback()
            const timer = setInterval(() => {
                time = ((time * 1000 - interval) / 1000).toFixed(1)
                callback && callback(this.format(time, interval < 1000))
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
        },

        toLocalFormat: function (timestamp) {
            const date = new Date(timestamp)
            let day = []
            day.push(date.getFullYear())
            day.push(('0' + (date.getMonth() + 1)).slice(-2))
            day.push(('0' + (date.getDate())).slice(-2))
            let time = []
            time.push(('0' + (date.getHours())).slice(-2))
            time.push(('0' + (date.getMilliseconds())).slice(-2))
            time.push(('0' + (date.getSeconds())).slice(-2))
            return day.join('-') +" "+ time.join(':')
        }
    }
})(window)