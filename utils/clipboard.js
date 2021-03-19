uni.$clipboard = {
	copy: function(text) {
		// #ifdef APP-NVUE
		let UIPasteboard = plus.ios.importClass("UIPasteboard");
		let generalPasteboard = UIPasteboard.generalPasteboard();
		generalPasteboard.plusCallMethod({
			setValue: text,
			forPasteboardType: "public.utf8-plain-text"
		});
		return true
		// #endif
		// #ifdef MP-WEIXIN
		// uni.
	}
};