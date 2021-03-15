module.exports =  {

  // 判断是否闰年
  checkLeapYear: function (year) {
    return (!(year % 4)) && (year % 100)
  },

  // 获取月份的天数
  getMonthDays: function (month, isLeapYear) {
    return [1, 3, 5, 7, 8, 10, 12].indexOf(month) > -1 ?
      31 : (month == 2 ? (isLeapYear ? 29 : 28) : 30)
  },

  // 获取今天
  today: function () {
    const date = new Date()
    let array = []
    array.push(date.getFullYear())
    array.push(('0' + (date.getMonth() + 1)).slice(-2))
    array.push(('0' + (date.getDate())).slice(-2))
    return array.join('-')
  },

  // 获取本周起始日期
  weekStartAndEndDay: function (day) {
    const date = day ? new Date(day) : new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    const isLeapYear = this.checkLeapYear(date.getFullYear())
    const days = this.getMonthDays(month, isLeapYear)
    const today = date.getDate()
    // 当前处于一周的那一天（星期天为7）
    const dayInWeek = date.getDay() == 0 ? 7 : date.getDay()

    // 开始日期
    let weekStartDay = [year, month]
    let startDay = today - Math.abs(1 - dayInWeek)
    if (startDay < 1) {
      let monthDiff = month - 1
      let startYear = monthDiff < 1 ? year - 1 : year
      let startMonth = monthDiff < 1 ? 12 : monthDiff
      weekStartDay[0] = startYear
      weekStartDay[1] = startMonth
      weekStartDay.push(this.getMonthDays(startMonth, this.checkLeapYear(startYear)) + startDay)
    } else {
      weekStartDay.push(startDay)
    }

    // 结束日期
    let weekEndDay = [year, month, today + Math.abs(7 - dayInWeek)]

    if (weekEndDay[2] > days) {// 超出本月
      let monthDiff = month + 1
      weekEndDay[0] = (monthDiff > 12 ? year + 1 : year)
      weekEndDay[1] = (monthDiff > 12 ? 1 : monthDiff)
      weekEndDay[2] = weekEndDay[2] - days
    }
    weekStartDay[1] = ('0' + (weekStartDay[1])).slice(-2)
    weekStartDay[2] = ('0' + (weekStartDay[2])).slice(-2)
    weekEndDay[1] = ('0' + (weekEndDay[1])).slice(-2)
    weekEndDay[2] = ('0' + (weekEndDay[2])).slice(-2)


    return [weekStartDay.join('-'), weekEndDay.join('-')]
  },

  // 获取本周起始日期
  monthStartAndEndDay: function (day) {
    const date = day ? new Date(day) : new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const isLeapYear = this.checkLeapYear(date.getFullYear())
    const days = this.getMonthDays(month, isLeapYear)
    const today = date.getDate()
    // 开始日期
    let weekStartDay = [year, month, 1]

    // 结束日期
    let weekEndDay = [year, month, days]
    weekStartDay[1] = ('0' + (weekStartDay[1])).slice(-2)
    weekStartDay[2] = ('0' + (weekStartDay[2])).slice(-2)
    weekEndDay[1] = ('0' + (weekEndDay[1])).slice(-2)
    weekEndDay[2] = ('0' + (weekEndDay[2])).slice(-2)
    return [weekStartDay.join('-'), weekEndDay.join('-')]
  },


}
