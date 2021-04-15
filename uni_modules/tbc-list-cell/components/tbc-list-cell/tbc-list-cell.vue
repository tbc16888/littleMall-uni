<template>
	<view class="tbc-flex-col" style="flex-direction: column;width: 750rpx;">
		<view style="width: 750rpx;" v-for="(item, index) in rows" :key="index">
			<view class="tbc-flex-row" style="flex-direction: row;padding:30rpx;align-items: center;" hover-class="tbc-cell-hover"
			 @click="onCellClick(item, index)">

				<view class="tbc-flex-col" v-if="item.label">
					<text style="font-size: 32rpx;color: #333;">{{item.label}}</text>
					<text style="font-size: 24rpx;color: #999;margin-top:4rpx;width: 500rpx;line-height:30rpx;" v-if="item.note">{{item.note}}</text>
				</view>

				<view class="tbc-flex-row" style="flex:1;justify-content: flex-end;">
			<slot >
				<text style="font-size: 32rpx;color: #333;text-align: right;" v-if="item.text">{{item.text}}</text>
			</slot>
				</view>


				<view class="tbc-flex-row" style="margin-left:5px;align-items: center;justify-content: center;width: 34rpx;height: 34rpx;"
				 v-if="item.arrow || item.page">
					<image src="/static/icon/arrow_right.png" style="width: 34rpx;height: 34rpx;"></image>
				</view>
				<view v-if="item.type == 'switch'">
					<switch></switch>
				</view>
			</view>
			<view v-if="index < rows.length - 1" style="height: 1px;width: 750rpx;background-color: #F5F5F5;"></view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			rows: {
				type: Array,
				default () {
					return []
				}
			}
		},

		methods: {
			onCellClick(item, index) {
				this.$emit('click', {
					item,
					index
				})
			}
		}
	}
</script>
<style scoped>
	.tbc-cell-hover {
		background-color: #F5F5F5
	}
</style>
