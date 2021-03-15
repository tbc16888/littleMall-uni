export default {
	
	methods: {
		
		buttonsFormat(buttons) {
			buttons.forEach((item, index) => {
				if (index === 0) {
					if (buttons.length > 1) item.style = this.leftButtonStyle(item)
					if (buttons.length < 2) item.style = this.singleButtonStyle(item)
				}
				if (index === 1) {
					if (buttons.length > 2) item.style = this.buttonBackground(item)
					if (buttons.length < 3) item.style = this.rightButtonStyle(item)
				}
				if (index === 2) {
					item.style = this.rightButtonStyle(item)
				}
			})
			return buttons
		},
		
		singleButtonStyle(button) {
			let style = []
			style.push('border-radius:40px')
			style.push(this.buttonBackground(button))
			return style.join(';')
		},
		
		leftButtonStyle(button) {
			let style = []
			style.push('border-top-left-radius:40px')
			style.push('border-bottom-left-radius:40px')
			style.push(this.buttonBackground(button))
			return style.join(';')
		},
		
		rightButtonStyle(button) {
			let style = []
			style.push('border-top-right-radius:40px')
			style.push('border-bottom-right-radius:40px')
			style.push(this.buttonBackground(button))
			return style.join(';')
		},
		
		buttonBackground(button) {
			let style = []
			style.push('background-color: ' + button.background)
			if (button.background2) {
				let common = button.background + ', ' + button.background2
				style.push('background-color: linear-gradient(to right, ' + common + ')')
				style.push('background-image: linear-gradient(to right, ' + common + ')')
			}
			return style.join(';')
		}
	}
}