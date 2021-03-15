const updater = (function() {

	var modal, mask, downloadTask, loadingProgress, isOPened = false,
		_config = {
			height: 220,
			width: 280,
			title: '更新提示',
			header: 40,
			bottom: 60,
			middle: 60,
			download_url: '',
			desc: ``,
			cancel: {
				text: '取消',
				size: '18px',
				color: '#000000',
				callback: function() {
					updater.hide()
				}
			},

			confirm: {
				text: '去升级',
				color: '#007fff',
				size: '18px',
				callback: function() {
					updater.hide()
				}
			},
		}

	if (typeof plus !== 'undefined') {
		_config.maxWidth = plus.screen.resolutionWidth
		_config.maxHeight = plus.screen.resolutionHeight
	}


	let view = {

		// 居中坐标
		getCenterPoint() {
			let top = (_config.maxHeight - _config.height) / 2
			let left = (_config.maxWidth - _config.width) / 2
			return {
				top,
				left,
				width: _config.width,
				right: left
			}
		},

		// 遮罩层
		mask: function() {
			if (typeof plus === 'undefined') return null
			return new plus.nativeObj.View("mask", {
				top: "0px",
				left: "0px",
				width: "100%",
				height: "100%",
				backgroundColor: "rgba(0, 0, 0, 0.5)"
			})
		},

		// 
		modal: function() {
			if (typeof plus === 'undefined') return null
			let postion = this.getCenterPoint()
			let modalView = new plus.nativeObj.View('modal', {
				top: postion.top + "px",
				left: postion.left + "px",
				height: _config.height + "px",
				width: postion.width + "px"
			});

			modalView.drawRect({
				color: "#FFFFFF",
				radius: "6px"
			}, {
				width: "100%",
				height: "100%"
			});

			// 绘制标题
			modalView.drawText(_config.title, {
				height: _config.header + "px"
			}, {
				size: '16px',
				color: '#000',
				align: 'center',
				verticalAlign: 'middle'
			})

			modalView.drawText(_config.desc, {
				top: _config.middle + "px",
				left: "10px",
				bottom: _config.middle + "px",
			}, {
				size: "14px",
				color: "#2f2f2f",
				align: "left",
				whiteSpace: "normal",
				lineSpacing: "50%",
				overflow: "ellipsis",
			})

			if (typeof _config.cancel !== 'undefined' && _config.cancel) {
				let cancel = '<font style="font-size:' + _config.cancel.size
				cancel += ';" color="' + _config.cancel.color + '">' + _config.cancel.text + '</font>';
				modalView.drawRichText(cancel, {
					width: "50%",
					top: (_config.height - _config.bottom / 2) + "px",
					left: "0px"
				}, {
					align: "center",
					onClick: function() {
						updater.hide()
						_config.cancel.callback()

					}
				})
			}



			let confirm = '<font style="font-size:' + _config.confirm.size
			confirm += ';" color="' + _config.confirm.color + '">' + _config.confirm.text + '</font>';

			modalView.drawRichText(confirm, {
				width: _config.cancel ? '50%' : '100%',
				top: (_config.height - _config.bottom / 2) + "px",
				left: _config.cancel ? '50%' : '0px',
			}, {
				align: "center",
				onClick: function() {
					if (_config.platform === 'ios') {
						plus.runtime.openURL(_config.download_url)
					} else {
						dowload()
					}

				}
			})

			return modalView
		},

		// 进度条
		loading: function(progress) {
			if (progress && progress == -1) return
			let color = "#007fff"
			progress = progress || 0
			modal && modal.drawRect({
				color
			}, {
				width: (_config.width - 100) * progress / 100 + "px",
				height: "3px",
				left: "10px",
				top: (_config.height - _config.bottom + 7) + "px"
			}, 'loading')

			let text = progress < 100 ? '下载中...(' + progress + '%)' : '开始安装'
			modal && modal.drawRichText('<font color="' + color + '">' + text + '</font>', {
				width: "100px",
				top: (_config.height - _config.bottom) + "px",
				left: ((_config.width - 110) * progress / 100 + 10) + "px"
			}, {
				align: "center"
			}, 'loadingText')
		}
	}

	const dowload = function() {
		return downloadTask ? void console.log("下载中") : void(view.loading(-1), downloadTask =
			uni.downloadFile({
				url: _config.download_url,
				success: function(res) {
					if (200 === res.statusCode) {
						uni.saveFile({
							tempFilePath: res.tempFilePath,
							success: function(res) {
								plus.runtime.install(res.savedFilePath, {
									force: !0
								})
							}
						})
					}
				}
			}),
			downloadTask.onProgressUpdate(function(a) {
				loadingProgress != a.progress && (loadingProgress = a.progress, view.loading(a.progress))
			}))
	}

	let updater = {

		init: function(config) {
			_config = { ..._config,
				...config
			}
			modal = view.modal()
			mask = view.mask()
			view.loading(-1)
		},

		show: function() {
			if (!isOPened) {
				mask && mask.show()
				modal && modal.show()
				isOPened = true
			}
		},

		hide: function() {
			mask && mask.hide()
			modal && modal.hide()
			isOPened = false
		}
	}
	return updater
})();




export default updater
