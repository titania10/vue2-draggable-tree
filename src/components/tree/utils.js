const Utils = {
	// 获取元素在视区的位置
	getElementPosition(element) {
		try {
			let position = element.getBoundingClientRect();
			let offsetY = document.documentElement.clientTop;
			let offsetX = document.documentElement.clientLeft;
			return {
				top: position.top - offsetY + window.pageYOffset,
				bottom: position.bottom - offsetY + window.pageYOffset,
				left: position.left - offsetX + window.pageXOffset,
				right: position.right - offsetX + window.pageXOffset,
				width: position.width,
				height: position.height,
			};
		} catch (e) {
			console.error(e);
		}
	},
}

export default Utils;
