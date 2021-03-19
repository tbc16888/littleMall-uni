<template>
	<uni-popup ref="showPayment" type="bottom" @change="onChange">
		<view class="tbc-flex-col"
			style="flex-direction: column;background-color: #FFFFFF;border-top-left-radius: 20rpx;border-top-right-radius: 20rpx;">
			<view class="tbc-flex-row" style="flex-direction: row;height: 120rpx;align-items: center;">
				<view class="tbc-flex-col" style="flex: 1;flex-direction: column;">
					<text style="font-size: 30rpx;color: #333;padding-left: 30rpx;">选择支付方式</text>
				</view>
				<!-- <view style="height: 40rpx;width:40rpx;position: absolute;right:30rpx;top:30rpx;z-index:99"
					@click="close">
					<image src="/static/icon/close_black.png" style="width:40rpx;height: 40rpx;"></image>
				</view> -->
			</view>
			<view style="height: 1px;width: 750rpx;background-color: #F5F5F5;"></view>
			<scroll-view class="tbc-flex-col" style="flex-direction: col;height:500rpx;width: 750rpx;" scroll-y>
				<view style="width: 750rpx;" v-for="(item, index) in paymentList" :key="index">
					<view style="height: 10rpx;"></view>
					<view style="flex-direction:row;align-items: center;padding:30rpx;" class="tbc-flex-row"
						@tap="select(index)">
						<view style="margin-right: 20rpx;">
							<image :src="item.icon" style="width:60rpx;height: 60rpx;"></image>
						</view>
						<view class="tbc-flex-col" style="flex-direction: column;flex: 1;">
							<text style="font-size: 30rpx;color: #333333" :style="'color:' + (item.disabled ? '#999':'#333')">{{item.name}}</text>
							<text style="font-size: 22rpx;color: #fc872d" :style="'color:' + (item.disabled ? '#999':'#fc872d')">{{item.note}}</text>
						</view>
						<view style="width: 60rpx;" v-if="!item.disabled">
							<image src="/static/icon/radio.png" style="width: 40rpx;height: 40rpx;"
								v-if="index != selected"></image>
							<image src="/static/icon/radio_on.png" style="width: 40rpx;height: 40rpx;"
								v-if="index == selected"></image>
						</view>
					</view>
					<view style="height: 1px;width: 750rpx;background-color: #F5F5F5;"></view>
				</view>
			</scroll-view>
			<view class="tbc-flex-col" style="align-items: center;margin-bottom: 20rpx;">
				<view class="tbc-flex-row"
					style="height:80rpx;align-items: center;justify-content: center;background-color: #eb0909;width:650rpx;border-radius:80rpx;"
					@click="formSubmit">
					<text style="color: #fff;font-size: 26rpx;">确定</text>
				</view>
			</view>
		</view>
	</uni-popup>
</template>
<script>
	import uniPopup from '@/components/uni-official/uni-popup/uni-popup.vue'
	export default {

		components: {
			uniPopup
		},

		data() {
			return {
				order: {},
				timer: null,
				paymentList: [],
				selected: -1
			}
		},

		methods: {
			
			show(data) {
				this.order = data
				this.$refs.showPayment.open()
				this.getPaymentList()
			},

			close() {
				this.$refs.showPayment.close()
			},

			onChange(data) {
				if (!data.show) clearInterval(this.timer)
			},

			async getPaymentList() {
				const res = await uni.$http.get('/pay', {
					order_sn: this.order.order_sn
				})
				if (res.data.code !== 0) {
					return uni.showToast({
						title: res.data.message,
						icon: 'none'
					})
				}
				this.paymentList = res.data.data.list
			},

			select(index) {
				if (this.paymentList[index].disabled) {
					return 
				}
				this.selected = index
			},

			async formSubmit() {
				let item = this.paymentList[this.selected]
				let action = item.code
				let form = {}
				let that = this
				form.order_sn = this.order.order_sn
				const res = await uni.$http.post(item.api, form)
				if (res.data.code !== 0) {
					return uni.showToast({
						title: res.data.message,
						icon: 'none'
					})
				}
				if (['alipay', 'wxpayy'].indexOf(action) === -1) {
					return this.paySuccess()
				}
				
				let orderInfo  = res.data.data
				uni.requestPayment({
					provider: action,
					orderInfo: orderInfo,
					success: function(res) {
						that.paySuccess()
					},
					fail: function(err) {
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						})
					}
				});
			},

			async formSubmitTest(type) {
				let form = {};
				let action = type === 'alipay' ? 'aliTest' : 'wxTest'
				form.order_sn = this.order.order_sn
				const res = await uni.$http.post('/pay/' + action, form)
				if (res.data.code !== 0) return uni.showToast({
					title: res.data.message,
					icon: 'none'
				})
	
				this.paySuccess()
			},


			paySuccess() {
				this.detectOrderStatus(500)
				uni.navigateTo({
					url: "/pages/order/success?order_sn=" + this.order.order_sn
				})
			},
			
			
			detectOrderStatus(time) {
				clearInterval(this.timer)
				this.timer = setTimeout(() => {
					uni.$http.get('/order/detail', {
						order_sn: this.order.order_sn
					}).then(res => {
						if (res.data.code !== 0) return
						let data = res.data.data.basic.data.field
						if (data.pay_time === '0000-00-00 00:00:00') return this.detectOrderStatus(2000)
						this.close()
						for (let i in data) this.order[i] = data[i]
						return this.$emit('success', this.order)
					})
				}, time)
			}
		}
	}
</script>
