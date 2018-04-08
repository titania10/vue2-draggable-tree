const Utils = {
	// 获取元素在视区的位置
	getElementPosition(element) {
		try {
			let position = element.getBoundingClientRect();
			let offsetY = document.documentElement.clientTop;
			let offsetX = document.documentElement.clientLeft;
			return {
				top: position.top - offsetY,
				bottom: position.bottom - offsetY,
				left: position.left - offsetX,
				right: position.right - offsetX,
				width: position.width,
				height: position.height,
			};
		} catch (e) {
			console.error(e);
		}
	},
}

export default Utils;
