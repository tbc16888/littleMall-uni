export default  (function () {

  'use strict';

  let skuPicker = function (options) {

    if (!(this instanceof skuPicker)) {
      return new skuPicker(options)
    }

    this.options = { separator: ',', stock: 'stock', price: 'price', image: 'goods_image' }
    if (!options) options = {}
    for (let i in options) this.options[i] = options[i]
    this.mapContainer = {}
    this.skuData = {}
  }

  // 将数组中的元素进行所有不重复的组合
  skuPicker.prototype._getCombination = function (aFactor) {

    if (!aFactor || !aFactor.length) return []

    for (var container = []; container.push([]) < aFactor.length;);

    let l = Math.pow(2, aFactor.length) - 1
    for (let i = 1; i <= l; i++) {
      let t = []
      for (var s = i, k = 0; s > 0; s >>= 1, k++) {
        if (s & 1 == 1) t.push(aFactor[k])
      }
      container[t.length - 1].push(t)
    }

    let aResult = [];
    for (let i in container) aResult = aResult.concat(container[i])
    return aResult
  }


  // 生成所有结果集
  skuPicker.prototype._buildMapContainer = function (data) {

    this.skuData = data

    let skuKeyList = []

    for (let i in data) skuKeyList.push(i)

    for (let i in skuKeyList) {

      let skuKey = skuKeyList[i]
      // 10:30:20 => ['10', '30', '20']
      let keyFactor = skuKey.split(this.options.separator)
      let skuInfo = data[skuKey]
      keyFactor.sort(function (value1, value2) {
        return parseInt(value1) - parseInt(value2);
      });

      // 获取数组元素的所有组合 
      // ['10'], ['10', '20'], ['10', '30']
      // ['20'], ['20', '30'], ['10', '20', '30']
      let aCombList = this._getCombination(keyFactor);
      for (let j = 0; j < aCombList.length; j++) {
        this._addToMapContainer(aCombList[j], skuInfo);
      }
    }

    return this
  };

  skuPicker.prototype._addToMapContainer = function (skuKey, skuInfo) {
    let key = skuKey.join(this.options.separator)
    if (this.mapContainer[key]) {
      this.mapContainer[key].stock += skuInfo[this.options.stock]
      this.mapContainer[key].price.push(skuInfo[this.options.price]);
      this.mapContainer[key].skuInfo = skuInfo;
      this.mapContainer[key].image = skuInfo[this.options.image];
    } else {
      this.mapContainer[key] = {
        stock: skuInfo[this.options.stock],
        price: [skuInfo[this.options.price]],
		image: skuInfo[this.options.image],
        skuInfo: skuInfo
      }
    }
  };

  skuPicker.prototype._key = function (key) {
    if (typeof key === 'object') {
      key.sort(function (value1, value2) {
        return parseInt(value1) - parseInt(value2);
      })
      key = key.join(this.options.separator)
    }
    return key
  };


  // 初始化
  skuPicker.prototype.init = function (data) {
    this._buildMapContainer(data)
    return this
  };

  // 获取规格信息
  skuPicker.prototype.getSkuInfo = function (key) {
    return this.mapContainer[this._key(key)] || null
  }

  // 判断是否禁用
  skuPicker.prototype.isDisabled = function (key) {
    let info = this.getSkuInfo(key)
    return info && info[this.options.stock] ? false : true
  };

  // 统计信息
  skuPicker.prototype.statistics = function (key) {
    let statistics = { stock: 0, price: { min: 9999999, max: 0 } }
    let mapContainer = this.mapContainer

    let info = this.getSkuInfo(key)
    if (info === null) {
      for (let i in this.skuData) {
        statistics.stock += this.skuData[i][this.options.stock]
      }
    }else{
      statistics.stock = info.stock
      statistics.image = info.image
      mapContainer = {t: info}
    }

    for (let i in mapContainer) {
      let min = Math.min.apply(Math, mapContainer[i].price)
      let max = Math.max.apply(Math, mapContainer[i].price)
      if (statistics.price.min > min) statistics.price.min = min
      if (statistics.price.max < max) statistics.price.max = max
    }
    return statistics
  }
  return skuPicker;
})()