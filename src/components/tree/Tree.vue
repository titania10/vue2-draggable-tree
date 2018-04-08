<template>
	<div class="tree-container">
		<div class="icons-box small" v-if="treeOptions.showSearch">
			<input
				class="icons-input"
				type="text"
				v-model="searchKeyword"
				:placeHolder="treeOptions.searchPlaceHolder">
			<i class="icons icons-search"></i>
		</div>
		<slot name="school-filter"></slot>
		<div
			v-show="treeData.length"
			class="nodes-container"
			ref="targetBox"
			:style="{maxHeight: maxHeightVal}">
			<multiple-tree-node
				:tree-data="treeData"
				:options="treeOptions"
				@on-checked-change="handleCheckedChange"
				v-if="treeOptions.multiple">
			</multiple-tree-node>
			<tree-node
				:tree-data="treeData"
				:options="treeOptions"
				:tree-selected-result="treeSelectedResult"
				@on-checked-change="handleCheckedChange"
				@on-add-node="handleAddNode"
				@on-edit-node="handleEditNode"
				@on-delete-node="handleDeleteNode"
				v-else>
			</tree-node>
		</div>
		<div class="no-data" v-show="treeData.length === 0">
			暂无数据
		</div>
		<div
			class="over-layer"
			@click.stop="deletePopupVisable = false"
			v-if="options.editable"
			v-show="deletePopupVisable">
			<div class="layer">
				<div class="layer-header">
					<i class="icons icons-close" @click="deletePopupVisable = false"></i>
					<h4 class="title">确认</h4>
				</div>
				<div class="layer-content">
					是否删除该节点？
				</div>
				<div class="layer-footer align-right">
					<button
						class="btn"
						type="button"
						@click="deletePopupVisable = false">取消</button>
					<button
						class="btn btn-main"
						type="button"
						@click="sureDeleteNode">确定</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import TreeNode from './TreeNode';
	import MultipleTreeNode from './MultipleTreeNode';
	import treeStatus from './treeStatus';
	import DragDrop from './mixin/dragDrop';

	export default {
		name: 'tree',

		mixins: [DragDrop],

		props: {
			treeData: {
				type: Array,
				default: () => [],
			},
			options: {
				type: Object,
				default: () => {},
			},
			treeSelectedIds: {
				type: [String, Number, Array],
				default: '',
			},
			maxHeight: {
				type: [String, Number],
				default: 'none'
			}
		},

		components: { TreeNode, MultipleTreeNode },

		model: {
			prop: 'treeSelectedIds',
			event: 'handleCheckedChange'
		},

		data() {
			return {
				status: {},//树的状态及操作数的方法
				treeSelectedResult: null,//树的选中值
				searchKeyword: null,//查找树节点的关键字
				defaultOptions: {
					showSearch: false,//默认不开启搜索
					searchPlaceHolder: '',//开启搜索时可设置搜索框的placeHolder
					open: true,//默认展开树节点
					multiple: false,//默认是单选
					leafOnly: false,//单选树形结构是否只允许叶子节点选中
					editable: false, //默认不可编辑
					deleteAsynchronously: false,//当树可删除时（editable: true），指定树的删除逻辑，默认是前端删除
					halfCheck: false,//默认全勾选
					draggable: false,//默认不可拖拽
					dragOverStyle: {
						lineColor: '#fea051',//拖拽经过放置位置线的颜色
						backgroundColor: '#e4e8fb',//拖拽经过树节点的背景色
					},
					maxLevel: 10,//树的最大层级, 默认不限只层级
					activeLevel: null,//可操作的树层级，默认全部可操作
				},
				treeOptions: {},
				deletePopupVisable: false,
				maxHeightVal: 'none',//设置树体的最大高度
			};
		},

		created() {
			this.initTreeOptions();
			this.initTreeStatus();
			this.setMaxHeight();
			if (this.treeData.length) {
				this.setTreeSelected();
				this.status.toggleTreeBranches(this.treeOptions.open);
			}
		},

		mounted() {
			this.targetBox = this.$refs.targetBox;
			if (this.treeOptions.draggable) {
				this.initDragAndDropNodes();
			}
		},

		beforeDestroy() {
			if (this.treeOptions.draggable) {
				this.removeEvents();
			}
		},

		methods: {
			handleAddNode(node) {
				this.$emit('on-add-node', node);
			},

			handleEditNode(node) {
				this.$emit('on-edit-node', node);
			},

			handleDeleteNode(node) {
				this.deletingNode = node;
				this.deletePopupVisable = true;
			},

			sureDeleteNode() {
				if (!this.treeOptions.deleteAsynchronously) {
					this.status.removeNodeById(this.deletingNode.id);
				}
				this.$emit('on-delete-node', this.deletingNode);
				this.deletePopupVisable = false;
				this.deletingNode = null;
			},

			handleCheckedChange(node) {
				if (node.disabled) {
					return;
				}
				if (this.treeOptions.multiple) {
					if (this.treeOptions.halfCheck) {
						this.status.changeHalfCheckStatus(node);
					} else {
						this.status.changeCheckStatus(node);
					}
					this.treeSelectedResult = this.status.getSelectedNodeIds();
					this.$emit('handleCheckedChange', this.treeSelectedResult);
					this.$emit('on-checked-change', node);
				} else {
					if (this.treeSelectedResult != node.id) {
						this.treeSelectedResult = node.id;
						this.$emit('handleCheckedChange', this.treeSelectedResult);
						this.$emit('on-checked-change', node);
					}
					this.$emit('on-checked', node);//只有单选数 叶子节点被点击的时候触发
				}
				//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				//这样写导致选择值滞后一步
				// this.$emit('handleCheckedChange', this.treeSelectedResult);
				//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			},

			setTreeSelected() {
				this.treeSelectedResult = this.treeSelectedIds;
				if (this.treeOptions.multiple && this.treeSelectedResult instanceof Array) {
					this.status.setTreeSelected(this.treeSelectedResult);
				}
			},

			initTreeOptions() {
				this.options.maxLevel = parseInt(this.options.maxLevel);
				if (isNaN(this.options.maxLevel)) {
					delete this.options.maxLevel;
				}
				this.options.activeLevel = parseInt(this.options.activeLevel);
				if (isNaN(this.options.activeLevel)) {
					delete this.options.activeLevel;
				}
				this.treeOptions = Object.assign({}, this.defaultOptions, this.options);
			},

			initTreeStatus() {
				this.status = new treeStatus(Object.assign({
					treeData: this.treeData,
				}, this.treeOptions));
			},

			initDragAndDropNodes() {
				try {
					this.draggableNodes = this.targetBox.querySelectorAll('li');
					this.droppableNodes = this.targetBox.querySelectorAll('.node-content');
					this.removeEvents();
					this.bindEvents();
				} catch (e) {
					console.error(e);
				}
			},

			setMaxHeight() {
				if (parseInt(this.maxHeight)) {
					this.maxHeightVal = this.maxHeight + 'px';
				}
			},
		},

		watch: {
			searchKeyword: function(keyword) {
				this.status.filterNodes(keyword);
			},

			options: {
				handler: function() {
					this.initTreeOptions();
					this.initTreeStatus();
					this.status.toggleTreeBranches(this.treeOptions.open);
				},
				deep: true
			},

			treeData: function(treeData) {
				this.initTreeStatus();
				if (this.treeOptions.draggable) {
					this.$nextTick(function () {
						this.initDragAndDropNodes();
					});
				}
				if (treeData.length && treeData[0].open !== this.treeOptions.open) {
					this.status.toggleTreeBranches(this.treeOptions.open);
				}
			},

			treeSelectedIds: function() {
				this.setTreeSelected();
			},

			maxHeight() {
				this.setMaxHeight();
			}
		},
	};

</script>
<style lang="stylus" scoped>
</style>