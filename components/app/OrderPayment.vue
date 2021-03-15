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
							<image :src="item.icon" style="width:48rpx;height: 48rpx;"></image>
						</view>
						<view class="tbc-flex-col" style="flex-direction: column;flex: 1;">
							<text style="font-size: 28rpx;color: #333333">{{item.label}}</text>
						</view>
						<view style="width: 60rpx;">
							<image src="/static/icon/radio.png" style="width: 40rpx;height: 40rpx;"
								v-if="index != selected"></image>
							<image src="/static/icon/radio_on.png" style="width: 40rpx;height: 40rpx;"
								v-if="index == selected"></image>
						</view>
					</view>
					<!-- <view style="height: 1px;width: 750rpx;background-color: #F5F5F5;"></view> -->
				</view>
			</scroll-view>
			<view class="tbc-flex-col" style="align-items: center;margin-bottom: 20rpx;">
				<view class="tbc-flex-row"
					style="height:80rpx;align-items: center;justify-content: center;background-color: #eb0909;width:650rpx;border-radius:80rpx;" @click="formSubmit">
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
				paymentList: [{
						label: '余额支付',
						icon: '/static/icon/balance.png',
						code: 'alipay'
					},
					{
						label: '支付宝支付',
						icon: '/static/icon/alipay.png',
						code: 'alipay'
					}, {
						label: '微信支付',
						icon: '/static/icon/wxpay.png',
						code: 'wxpay'
					}
				],
				selected: -1
			}
		},

		methods: {
			show(data) {
				this.order = data
				this.$refs.showPayment.open()
			},

			close() {
				this.$refs.showPayment.close()
			},

			onChange(data) {
				if (!data.show) clearInterval(this.timer)
			},
			
			
			select(index) {
				this.selected = index
			},
			
			async formSubmit() {
				let type = this.paymentList[this.selected].code
				this.formSubmitTest(type)
				return
				let form = {}
				let that = this
				form.order_sn = this.order.order_sn
				let action = type === 'alipay' ? 'alipayApp' : 'wxApp'
				const res = await uni.$http.post('/pay/' + action, form)
				if (res.data.code !== 0) {
					return uni.showToast({
						title: res.data.message,
						icon: 'none'
					})
				}

				let orderInfo = ''
				if (type == 'alipay') orderInfo = res.data.data.string
				if (type == 'wxpay') orderInfo = JSON.stringify(res.data.data)

				uni.requestPayment({
					provider: type,
					orderInfo: orderInfo,
					success: function(res) {
						uni.showModal({
							content: "支付成功",
							showCancel: false
						})
						that.detectOrderStatus()
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
				uni.showToast({
					title: res.data.message,
				})
				this.detectOrderStatus()
			},

			detectOrderStatus() {
				clearInterval(this.timer)
				this.timer = setTimeout(() => {
					uni.$http.get('/order/detail', {
						order_sn: this.order.order_sn
					}).then(res => {
						if (res.data.code !== 0) return
						let data = res.data.data
						if (data.pay_status !== 1) return this.detectOrderStatus()
						this.close()
						for (let i in data) this.order[i] = data[i]
						return this.$emit('success', this.order)
					})
				}, 3000)
			}
		}
	}
</script>
