<template>
	<div>
		<h2 class="title">树形结构</h2>
		<div class="clearfix">
			<tree
				class="float-left"
				v-model="treeVals0"
				:tree-data="treeData0"
				:options="options0"
				@on-checked-change="handleCheckedChange0"
				@on-add-node="addNode"
				@on-edit-node="editNode"
				@on-delete-node="deleteNode">
			</tree>
			<tree
				class="float-left"
				v-model="treeVals1"
				:tree-data="treeData1"
				:options="options1"
				@on-checked-change="handleCheckedChange1">
			</tree>
		</div>
		<h2 class="title">树形下拉框</h2>
		<div class="clearfix">
			<tree-selector
				class="float-left"
				placeholder="请选择..."
				v-model="treeSelectorVal"
				:tree-data="selectorTreeData0"
				:options="selectorOptions0"
				@on-selected-change="handleSelectedChange0">
			</tree-selector>
			<tree-selector
				class="float-left"
				placeholder="请选择..."
				v-model="treeSelectorVals"
				:tree-data="selectorTreeData1"
				:options="selectorOptions1"
				@on-selected-change="handleSelectedChange1">
			</tree-selector>
		</div>
	</div>
</template>

<script>
import Tree from './tree/Tree';
import TreeSelector from './tree/TreeSelector';
export default {
	components: {
		Tree,
		TreeSelector,
	},

	data () {
		return {
			treeVals0: 'item333',
			treeVals1: ['item0', 'item1'],

			treeSelectorVal: 'item333',
			treeSelectorVals: ['item0', 'item1'],

			options0: {
				showSearch: true,
				editable: true,
				draggable: true,
				maxLevel: 5,
			},

			options1: {
				showSearch: false,
				multiple: true,
				halfCheck: false,
			},

			selectorOptions0: {
			},

			selectorOptions1: {
				showSearch: false,
				multiple: true,
				halfCheck: true,
			},

			treeData0: [{
				id: 'item0',
				label: '根节点1',
				children: [{
					id: 'item1',
					label: '一级子节点1111',
				},{
					id: 'item2',
					label: '一级子节点2'
				},{
					id: 'item3',
					label: '一级子节点3',
					children: [{
						id: 'item31',
						label: '二级子节点1',
					},{
						id: 'item32',
						label: '二级子节点2'
					},{
						id: 'item33',
						label: '二级子节点3',
						children:[{
							id: 'item331',
							label: '三级子节点1',
						},{
							id: 'item332',
							label: '三级子节点2'
						},{
							id: 'item333',
							label: '三级子节点3'
						}]
					}]
				},{
					id:'item4',
					label:'一级子节点4'
				},{
					id:'item5',
					label:'一级子节点5'
				}]
			}],

			treeData1: [{
				id: 'item0',
				label: '根节点1',
				children: [{
					id: 'item1',
					label: '一级子节点1111',
				},{
					id: 'item2',
					label: '一级子节点2'
				},{
					id: 'item3',
					label: '一级子节点3',
					children: [{
						id: 'item31',
						label: '二级子节点1',
					},{
						id: 'item32',
						label: '二级子节点2'
					},{
						id: 'item33',
						label: '二级子节点3',
						children:[{
							id: 'item331',
							label: '三级子节点1',
						},{
							id: 'item332',
							label: '三级子节点2'
						},{
							id: 'item333',
							label: '三级子节点3'
						}]
					},{
						id: 'item34',
						label: '二级子节点4'
					}]
				},{
					id:'item4',
					label:'一级子节点4'
				},{
					id:'item5',
					label:'一级子节点5'
				}]
			},{
				id: 'root0',
				label: '根节点2',
				children: [{
					id: 'root1',
					label: '一级子节点1111',
				},{
					id: 'root2',
					label: '一级子节点2'
				}],
			}],

			selectorTreeData0: [{
				id: 'item0',
				label: '根节点1',
				// checked: true,
				children: [{
					id: 'item1',
					label: '一级子节点1111',
				},{
					id: 'item2',
					label: '一级子节点2'
				},{
					id: 'item3',
					label: '一级子节点3',
					children: [{
						id: 'item31',
						label: '二级子节点1',
					},{
						id: 'item32',
						label: '二级子节点2'
					},{
						id: 'item33',
						label: '二级子节点3',
						children:[{
							id: 'item331',
							label: '三级子节点1',
						},{
							id: 'item332',
							label: '三级子节点2'
						},{
							id: 'item333',
							label: '三级子节点3'
						}]
					}]
				},{
					id:'item4',
					label:'一级子节点4'
				},{
					id:'item5',
					label:'一级子节点5'
				}]
			}],

			selectorTreeData1: [{
				id: 'item0',
				label: '根节点1',
				children: [{
					id: 'item1',
					label: '一级子节点1111',
				},{
					id: 'item2',
					label: '一级子节点2'
				},{
					id: 'item3',
					label: '一级子节点3',
					children: [{
						id: 'item31',
						label: '二级子节点1',
					},{
						id: 'item32',
						label: '二级子节点2'
					},{
						id: 'item33',
						label: '二级子节点3',
						children:[{
							id: 'item331',
							label: '三级子节点1',
						},{
							id: 'item332',
							label: '三级子节点2'
						},{
							id: 'item333',
							label: '三级子节点3'
						}]
					}]
				},{
					id:'item4',
					label:'一级子节点4'
				},{
					id:'item5',
					label:'一级子节点5'
				}]
			}],
		}
	},

	methods: {
		handleCheckedChange0(node) {
			console.log('you had checked: ' + this.treeVals0);
		},

		handleCheckedChange1(node) {
			console.log('you had checked:[ ' + this.treeVals1 + ' ]');
		},

		handleSelectedChange0(node) {
			console.log(this.treeSelectorVal);
		},

		handleSelectedChange1(node) {
			console.log(this.treeSelectorVals);
		},

		addNode(node) {
			console.log('addNode: add a child to this node ' +  node.id);
		},

		editNode(node) {
			console.log('editNode: ' +  node.id);
		},

		deleteNode(node) {
			console.log('deleted node: ' + node.id);
		},
	}
}
</script>
<style lang="stylus" scoped>
	.clearfix
		margin-bottom 40px
		*zoom 1
		&:after
			content "."
			display block
			height 0
			clear both
			visibility hidden

	.float-left
		float left
		width 50%
		padding-left 40px
		box-sizing border-box
	.error-text
		color #D0021B
	.title
		padding-left 40px
</style>
