import Vue from 'vue';
export default class TreeStatus {
	constructor(opt) {
		this.datas = new Map();
		this.originTreeData = opt.treeData;
		const _generateDatas = (treeData, parentId, pTreeLevel) => {
			treeData.map(node => {
				node.parentId = parentId;
				// node.treeLevel = pTreeLevel + 1;
				Vue.set(node, 'treeLevel', pTreeLevel + 1);
				if (node.treeLevel >= opt.maxLevel && node.children && node.children.length) {
					for (let cild of node.children) {
						opt.treeData.push(cild);
					}
					node.children = [];
				}
				this.datas.set(node.id, node);
				if (node.children && node.children.length) {
					_generateDatas(node.children, node.id, node.treeLevel);
				}
			});
		};
		_generateDatas(opt.treeData, '', 0);
	}

	//展开或折叠树
	toggleTreeBranches(brancheState) {
		for (let [, node] of this.datas) {
			if (node.children && node.children.length) {
				Vue.set(node, 'open', brancheState);
			}
		}
	}

	//通过关键字查找树节点
	filterNodes(keyword) {
		keyword = keyword.trim();
		if (keyword.length === 0) {
			for (let [, node] of this.datas) {
				Vue.set(node, 'visible', true);
			}
			return;
		}
		const _syncNodeStatus = (node) => {
			if (node.parentId) {
				let parentNode = this.getNode(node.parentId);
				if (!parentNode.open) {
					Vue.set(parentNode, 'open', true);
				}
				if (node.visible) {
					Vue.set(parentNode, 'visible', node.visible);
					_syncNodeStatus(parentNode);
				}
			}
		};
		for (let [, node] of this.datas) {
			Vue.set(node, 'visible', node.label.indexOf(keyword) !== -1);
			if (node.visible) {
				_syncNodeStatus(node);
			}
		}
	}

	//通过id查找树节点
	getNode(key) {
		return this.datas.get(key);
	}

	//多选时勾选
	changeCheckStatus(node) {
		Vue.set(node, 'checked', !node.checked);
		const _checkParents = node => {
			if(node.parentId === '') {
				return;
			}
			let parent = this.getNode(node.parentId);
			if (node.checked) {
				Vue.set(parent, 'checked', this.silibingsAllChecked(parent));
			} else {
				Vue.set(parent, 'checked', false);
			}
			_checkParents(parent);
		};

		const _checkChildren = node => {
			if (node.children && node.children.length) {
				node.children.forEach(childNode => {
					Vue.set(childNode, 'checked', node.checked);
					_checkChildren(childNode);
				});
			}
		};

		_checkParents(node);
		_checkChildren(node);
	}

	//半选逻辑的勾选
	changeHalfCheckStatus(node) {
		Vue.set(node, 'checked', !node.checked);
		const _checkParents = node => {
			if(node.parentId === '') {
				return;
			}
			let parent = this.getNode(node.parentId);
			if (node.checked) {
				Vue.set(parent, 'checked', true);
			} else {
				Vue.set(parent, 'checked', this.silibingsHasChecked(parent));
			}
			_checkParents(parent);
		};

		const _checkChildren = node => {
			if (node.children && node.children.length) {
				node.children.forEach(childNode => {
					Vue.set(childNode, 'checked', node.checked);
					_checkChildren(childNode);
				});
			}
		};

		_checkParents(node);
		_checkChildren(node);
	}

	//检查兄弟节点是否全部勾选
	silibingsAllChecked(parent) {
		let result = true;
		for (let node of parent.children) {
			result = result && node.checked;
			if(!node.checked) {
				break;
			}
		}
		return result;
	}

	//获取该节点的兄弟节点和自己
	getSilibings(node){
		let parentNode = this.getNode(node.parentId);
		let silibings;
		if (parentNode) {
			silibings = parentNode.children;
		} else {
			silibings = this.originTreeData;
		}
		return silibings;
	}

	//检查兄弟节点时候有勾选
	silibingsHasChecked(parent) {
		let result = false;
		for (let node of parent.children) {
			if(node.checked) {
				result = true;
				break;
			}
		}
		return result;
	}

	//根据初始值勾选相应的树节点
	setTreeSelected(treeSelectedResult) {
		if (!(treeSelectedResult instanceof Array) && treeSelectedResult.length === 0)
			return;
		for (let [, node] of this.datas) {
			Vue.set(node, 'checked', false);
		}
		let targetNode;
		for (let id of treeSelectedResult) {
			targetNode = this.getNode(id);
			if (targetNode) {
				Vue.set(targetNode, 'checked', true);
			}
		}
	}

	//获取所有选中节点
	getSelectedNodes() {
		let selectedNodes = new Array();
		for (let [, node] of this.datas) {
			if (node.checked) {
				selectedNodes.push(node);
			}
		}
		return selectedNodes;
	}

	//获取所有选中节点Id
	getSelectedNodeIds() {
		let selectedNodeIds = new Array();
		for (let [, node] of this.datas) {
			if (node.checked) {
				selectedNodeIds.push(node.id);
			}
		}
		return selectedNodeIds;
	}

	//删除指定节点
	removeNodeById(id, changeDatas = true, direction = 'down') {
		let targetNode = this.getNode(id);
		if (targetNode) {
			let silibings = this.getSilibings(targetNode);
			let index;
			if (direction === 'up') {
				for (let i = silibings.length - 1; i >= 0; i-- ) {
					if(silibings[i].id == targetNode.id) {
						index = i;
						break;
					}
				}
			} else {
				index = silibings.findIndex(node => node.id === targetNode.id);
			}
			silibings.splice(index, 1);
			if (changeDatas) {
				this.datas.delete(id);
			}
		}
	}

	// 拖拽树节点，
	// targetId: 放置位置的目标节点ID
	// newNodeId: 正在拖拽的节点的ID
	// direction: 拖拽的方向，相对拖拽起点初始位置
	// isChild: 拖拽节点是否作为目标节点的子节点
	dragAndDropNode(targetId, newNodeId, direction, isChild = false) {
		let targetNode = this.getNode(targetId);
		let newNode = this.getNode(newNodeId);
		if (targetNode) {
			if (isChild) {
				if (targetNode.children) {
					targetNode.children.unshift(newNode);
				} else {
					Vue.set(targetNode, 'children', [newNode]);
				}
				Vue.set(targetNode, 'open', true);
			} else {
				let silibings = this.getSilibings(targetNode);
				let index = silibings.findIndex(node => node.id == targetNode.id);
				if (direction == 'down') {
					silibings.splice(index + 1, 0, newNode);
				} else {
					silibings.splice(index, 0, newNode);
				}
			}
			this.removeNodeById(newNodeId, false, direction);
		}
	}
}
