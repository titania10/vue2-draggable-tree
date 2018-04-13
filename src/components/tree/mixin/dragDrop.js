import Utils from '../utils';
export default {
	data() {
		return {
			draggingNode: null,//正在被拖拽的节点
			droppableNodes: [],//可以放置的节点
			startLocation: {},//开始拖拽的初始位置
		};
	},


	methods: {
		selectstart() {
			return false;
		},
		getElementOffset(element){
		    let left = element.offsetLeft,
				top = element.offsetTop,
				current = element.offsetParent;
		    while (current !== null){
		        left += current.offsetLeft;
		        top += current.offsetTop;
		        current = current.offsetParent;
		    }
		    return {
		    	left,
		    	top
		    };
		},
		dragstart(event) {
			this.draggingNode = event.target;
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData("text", this.draggingNode.innerHTML);
			if (event.dataTransfer.setDragImage) {
				// event.dataTransfer.setDragImage(event.target, 0, 0);
				let offset = this.getElementOffset(event.target),
					x = event.pageX - offset.left,
					y = event.pageY - offset.top;
					console.log(x, y);
				event.dataTransfer.setDragImage(event.target, x, y);
			}
			this.startLocation = {
				x: event.pageX,
				y: event.pageY,
			};
			return true;
		},

		dragover(event) {
			event.preventDefault();
			if (this.draggingNode) {
				let targetLocation = {
					x: event.pageX,
					y: event.pageY
				};
				let position = Utils.getElementPosition(this.draggingNode);
				let directionUp = targetLocation.y - this.startLocation.y < 0;
				if (targetLocation.y >= position.top && targetLocation.y <= position.bottom) {
					event.dataTransfer.dropEffect = 'none';
				} else {
					let targetNode;
					for (let i = 0, l = this.droppableNodes.length; i < l; i++) {
						let dropPosition = Utils.getElementPosition(this.droppableNodes[i]);
						if (targetLocation.y >= dropPosition.top && targetLocation.y <= dropPosition.bottom) {
							targetNode = this.droppableNodes[i];
						} else {
							this.droppableNodes[i].style.borderColor = 'transparent';
							this.droppableNodes[i].style.background = '';
						}
					}

					if (targetNode) {
						let isChild = false;
						let targetNodeLevel = targetNode.dataset ? targetNode.dataset.level : parseInt(targetNode.getAttribute('data-level'));
						if (targetNodeLevel < this.treeOptions.maxLevel) {
							if (event.ctrlKey || event.metaKey) {
								isChild = true;
							}
						}
						let borderColorStyle = 'transparent transparent '+ this.treeOptions.dragOverStyle.lineColor +' transparent';
						if (!isChild && directionUp){
							borderColorStyle = this.treeOptions.dragOverStyle.lineColor +' transparent transparent transparent';
						}
						targetNode.style.background = this.treeOptions.dragOverStyle.backgroundColor;
						targetNode.style.borderColor = borderColorStyle;
					}
				}
			}
			return true;
		},

		dragenter(event) {
			return true;
		},

		drop(event) {
			event.preventDefault();
			if (this.draggingNode) {
				let targetLocation = {
					x: event.pageX,
					y: event.pageY
				};
				let directionUp = targetLocation.y - this.startLocation.y < 0;
				let targetNode = this.getTargetDropNode(targetLocation);
				if (targetNode) {
					let isChild = false;
					let targetNodeLevel, targetNodeId, draggingNodeId;
					if (targetNode.dataset) {
						targetNodeLevel = targetNode.dataset.level;
						targetNodeId = targetNode.dataset.id;
						draggingNodeId = this.draggingNode.dataset.id;
					} else {
						targetNodeLevel = parseInt(targetNode.getAttribute('data-level'));
						targetNodeId = targetNode.getAttribute('data-id');
						draggingNodeId = this.draggingNode.getAttribute('data-id');
					}
					if (targetNodeLevel < this.treeOptions.maxLevel) {
						if (event.ctrlKey || event.metaKey) {
							isChild = true;
						}
					}
					this.status.dragAndDropNode(targetNodeId, draggingNodeId, directionUp? 'up' : 'down', isChild);
					this.initTreeStatus();
					this.$nextTick(function () {
						this.initDragAndDropNodes();
					});
				}
			}
		},

		dragend(event) {
			this.clearDragOverStyle();
			event.dataTransfer.clearData('text');
			this.draggingNode = null;
			this.startLocation = null;
			return false;
		},

		clearDragOverStyle() {
			for (let i = 0; i < this.droppableNodes.length; i++) {
				this.droppableNodes[i].style.borderColor = 'transparent';
				this.droppableNodes[i].style.background = '';
			}
		},

		getTargetDropNode(targetLocation) {
			let targetDropNode;
			for (let i = 0, l = this.droppableNodes.length; i < l; i++) {
				let position = Utils.getElementPosition(this.droppableNodes[i]);
				if (targetLocation.y >= position.top && targetLocation.y <= position.bottom) {
					targetDropNode = this.droppableNodes[i];
					break;
				}
			}
			return targetDropNode;
		},

		bindEvents() {
			this.targetBox.addEventListener('dragenter', this.dragenter);
			this.targetBox.addEventListener('dragover', this.dragover);
			this.targetBox.addEventListener('drop', this.drop);

			for (let node of this.draggableNodes) {
				node.addEventListener('selectstart', this.selectstart);
				node.addEventListener('dragstart', this.dragstart);
				node.addEventListener('dragend', this.dragend);
			}
		},

		removeEvents() {
			this.targetBox.removeEventListener('dragenter', this.dragenter);
			this.targetBox.removeEventListener('dragover', this.dragover);
			this.targetBox.removeEventListener('drop', this.drop);

			for (let node of this.draggableNodes) {
				node.removeEventListener('selectstart', this.selectstart);
				node.removeEventListener('dragstart', this.dragstart);
				node.removeEventListener('dragend', this.dragend);
			}
		}
	},
};