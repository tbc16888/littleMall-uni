<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			this.$store.dispatch('init')
			
			// #ifdef APP-PLUS 
			// 推送
			console.log(plus.push.getClientInfo())
			const _self = this;
			const _handlePush = function(message) {
				console.log(message)
			};
			plus.push.addEventListener('click', _handlePush);
			plus.push.addEventListener('receive', _handlePush);
			// #endif 
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* #ifndef APP-PLUS-NVUE */
	@import './common/style/app.css';
	/* #endif */
	
	.tbc-flex-row {
		flex-direction: row;
	}

	.tbc-flex-col {
		flex-direction: column;
	}

	.tbc-page-background {
		/* #ifndef APP-PLUS-NVUE */
		position: fixed;
		top: 0;
		bottom: 0;
		width: 750rpx;
		z-index: -1;
		background-color: #f5f5f5;
		/* #endif */
	}

	/* #ifndef APP-PLUS-NVUE */
	uni-view.tbc-page-background {
		position: fixed;
	}
	/* #endif */
</style>
