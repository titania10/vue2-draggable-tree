<template>
	<div class="sxui_demo">
		<h2>树形结构</h2>
		<h3>引入样式两种方式</h3>
		<highlight-code lang="javascript">
			//在入口文件引入样式
			import '../components/tree/style/tree.styl';

			//在项目自己的styl样式文件引入
			@import "../components/tree/style/tree"
		</highlight-code>
		<p class="error-text">图标源文件在../components/tree/svg文件夹下。</p>
		<h3>引入插件</h3>
		<highlight-code lang="javascript">
			import '../sxui/components/tree/tree';
		</highlight-code>
		<h3>使用</h3>
		<highlight-code lang="html"
			:code='`
				<tree
					v-model="treeVals0"
					:tree-data="treeData0"
					:options="options0"
					@on-checked-change="handleCheckedChange0">
				</tree>
			`'>
		</highlight-code>
		<highlight-code lang="javascript">
			//下面示例1的部分参数options：
			options0: {
				showSearch: true,
				editable: true,
				draggable: true,
			},
			//参看下面的options参数说明
		</highlight-code>
		<h3>参数说明</h3>
		<hr class="line">
		<ul>
			<li><h4>* v-model</h4></li>
			<li>1. 用于获取值 或 赋值</li>
			<li>2. 单选返回一个id字符串，多选返回一个只包含id字符串的数组</li>
		</ul>
		<ul>
			<li><h4>* tree-data</h4></li>
			<li>1. tree-data必须是数组</li>
			<li>2. 数组的每一项必须是对象: { id, label, [children], ... }</li>
		</ul>
		<ul>
			<li><h4>* options：可以通过配置options属性启用、关闭树形组件的功能</h4></li>
			<li>1. options必须是对象，默认为{}，组件会渲染成单选树形结构；以下为各属性的功能与设置</li>
			<li>2. showSearch: boolean； //搜索树节点，默认为false,不开启搜索功能</li>
			<li>3. multiple: boolean； //多选，默认为false，单选的树结构</li>
			<li>4. leafOnly: boolean； //当multiple为false（即设置为单选树结构时），该属性才生效；默认为false，所有节点都可选中；设置为true时，只允许叶子节点选中；</li>
			<li>5. halfCheck: boolean； //该属性表示所选树结构的半选状态；
				当multiple为true（即设置为多选树结构时），该属性才生效；
				默认是false，为全选逻辑;</li>
			<li>6. editable: boolean； //默认为false，不可编辑；设置为true时，
				叶子节点可进行编辑、删除操作。</li>
			<li>7. open: boolean；//默认为true，展开树节点；设置为false，折叠树节点</li>
			<li>8. draggable: boolean； //默认为false，不可拖拽；设置为true时，可以对树节点进行拖拽重组树的层级</li>
			<li>9. dragOverStyle: Object；//拖拽经过时的样式，可以自定义颜色值；当draggable为true（当树形结构可拖拽）时生效，默认值如下：
					<highlight-code lang="javascript">
						dragOverStyle: {
							lineColor: '#fea051',//拖拽经过放置位置线的颜色
							backgroundColor: '#e4e8fb',//拖拽经过树节点的背景色
						}
					</highlight-code>
			</li>
			<li>10. maxLevel: Number; //树结构最大层级限制，从根节点算第一层级，默认是10</li>
		</ul>
		<ul>
			<li><h4>* max-height</h4></li>
			<li>1. max-height必须是数字</li>
			<li>2. 非必须值，可以设置树体的最大高度</li>
		</ul>
		<ul>
			<li><h4>* on-checked-change</h4></li>
			<li>1. 当树形结构选择发生改变的时触发该事件</li>
			<li>2. 该事件方法携带参数 为当前选中的节点的数据对象</li>
		</ul>
		<ul>
			<li><h4>* on-add-node (只有单选树形结构有该事件)</h4></li>
			<li>1. 当点击树结点上的编辑图标时触发该事件</li>
			<li>2. 该事件方法携带参数 为当前选中的节点的数据对象</li>
		</ul>
		<ul>
			<li><h4>* on-edit-node (只有单选树形结构有该事件)</h4></li>
			<li>1. 当点击树结点上的编辑图标时触发该事件</li>
			<li>2. 该事件方法携带参数 为当前选中的节点的数据对象</li>
		</ul>
		<ul>
			<li><h4>* on-delete-node (只有单选树形结构有该事件)</h4></li>
			<li>1. 当点击树结点上的删除图标时触发该事件</li>
			<li>2. 该事件方法携带参数 为当前选中的节点的数据对象</li>
		</ul>
		<h3>示例</h3>
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
		<hr>
		<h2>树形下拉选择框</h2>
		<h3>引入插件</h3>
		<highlight-code lang="javascript">
			import '../sxui/components/tree/treeSelector';
		</highlight-code>
		<h3>使用</h3>
		<highlight-code lang="html"
			:code='`
				<tree-selector
					placeholder="请选择..."
					v-model="treeVals2"
					:tree-data="treeData2"
					:options="options2"
					@on-selected-change="handleCheckedChange2">
				</tree-selector>
			`'>
		</highlight-code>
		<h3>参数说明</h3>
		<hr class="line">
		<ul>
			<li><h4>* v-model 同上</h4></li>
			<li><h4>* tree-data 同上</h4></li>
			<li><h4>* options 同上</h4></li>
		</ul>
		<ul>
			<li><h4>* on-selected-change</h4></li>
			<li>1. 当树形结构选择发生改变的时候触发该事件</li>
			<li>2. 该事件方法携带参数 为当前选中的节点的数据对象</li>
		</ul>
		<p class="error-text">特别说明：请不要在 tree-selector 组件的祖先节点使用overflow: hidden;</p>
		<h3>示例</h3>
		<div class="clearfix">
			<tree-selector
				class="float-left"
				placeholder="请选择..."
				v-model="treeVals2"
				:tree-data="treeData2"
				:options="options2"
				@on-selected-change="handleSelectedChange2">
			</tree-selector>
			<tree-selector
				class="float-left"
				placeholder="请选择..."
				v-model="treeVals3"
				:tree-data="treeData3"
				:options="options3"
				@on-selected-change="handleSelectedChange3">
			</tree-selector>
		</div>
	</div>
</template>

<script>
	import '../style/tree.styl';
	import Tree from '../tree';
	import TreeSelector from '../treeSelector';

	export default {
		components: {
			Tree,
			TreeSelector
		},
		data() {
			return {
				treeVals0: 'item333',
				treeVals1: ['item0', 'item1'],
				treeVals2: 'item333',
				treeVals3: ['item333'],

				options0: {
					showSearch: true,
					editable: true,
					draggable: true,
					maxLevel: 3,
				},
				options1: {
					showSearch: false,
					multiple: true,
					halfCheck: false,
				},
				options2: {
				},
				options3: {
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
				treeData2: [{
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
				treeData3: [{
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
			};
		},

		methods: {
			handleCheckedChange0(node) {
				console.log(this.treeVals0);
			},
			handleCheckedChange1(node) {
				console.log(this.treeVals1);
			},
			handleSelectedChange2(node) {
				console.log(this.treeVals2);
			},
			handleSelectedChange3(node) {
				console.log(this.treeVals3);
			},

			addNode(node) {
				console.log('addNode: add a child tp this node ' +  node.id);
			},

			editNode(node) {
				console.log('editNode: ' +  node.id);
			},

			deleteNode(node) {
				console.log('deleted node: '+ node.id);
			},
		}
	};
</script>

<style lang="stylus" scoped>
	ul
		margin-bottom 10px
	.float-left
		width 50%
		padding-right 20px
		box-sizing border-box
	.error-text
		color #D0021B
</style>