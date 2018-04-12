<template>
	<ul
		class="sub-tree"
		:class="{'editable': editable}">
		<li
			:draggable="isDraggable"
			v-for="node in treeData"
			v-if="!node.hasOwnProperty('visible') || node.visible"
			:key="node.id"
			:data-id="node.id">
			<label
				:data-id="node.id"
				:data-level="node.treeLevel"
				draggable="false"
				class="node-content"
				:class="{'selected': setNodeSelected(node), 'disabled': node.disabled}"
				@click="handleCheckedChange(node)">
				<template v-if="editable && !node.disabled">
					<span
						class="for-editing"
						v-if="!node.children || node.children.length === 0">
						<i class="icons icons-delete" @click.stop="handleDeleteNode(node)"></i>
					</span>
					<span class="for-editing">
						<i
							v-if="node.treeLevel < options.maxLevel"
							class="icons icons-plus"
							@click.stop="handleAddNode(node)"></i>
						<i class="icons icons-edit" @click.stop="handleEditNode(node)"></i>
					</span>
				</template>
				<i
					class="icons"
					:class="[ node.open ? 'icons-fold' : 'icons-spread' ]"
					@click.stop="handleNodeExpand(node)"
					v-if="node.children && node.children.length">
				</i>
				<span>{{ node.label || node.name }}</span>
			</label>
			<tree-node
				:tree-data="node.children"
				:options="options"
				:tree-selected-result= "treeSelectedResult"
				@on-checked-change="handleCheckedChange"
				@on-add-node="handleAddNode"
				@on-edit-node="handleEditNode"
				@on-delete-node="handleDeleteNode"
				v-if="node.children && node.children.length"
				v-show="node.open"/>
		</li>
	</ul>
</template>

<script>
	import Vue from 'vue';
	export default {
		name: 'treeNode',
		props: {
			treeData: {
				type: Array,
				default: () => [],
			},
			options: {
				type: Object,
				default: () => {},
			},
			treeSelectedResult: [Number, String],
		},

		data() {
			return {
				editable: (this.options && this.options.editable) || false,
				isDraggable: (this.options && this.options.draggable) || false,
			};
		},

		watch: {
			options: {
				handler: function(options) {
					this.editable = options.editable;
					this.isDraggable = options.draggable;
				},
				deep: true
			}
		},

		methods: {
			setNodeSelected(node) {
				if (node.disabled) {
					return false;
				}
				if (this.treeSelectedResult != node.id) {
					return false;
				} else {
					if (this.options.leafOnly) {
						if(!node.children || node.children.length === 0) {
							return true;
						} else {
							return false;
						}
					} else {
						return true;
					}
				}
			},

			handleNodeExpand(node) {
				Vue.set(node, 'open', !node.open);
				this.$emit('on-toggle-branch');
			},

			handleAddNode(node) {
				this.$emit('on-add-node', node);
			},

			handleEditNode(node) {
				this.$emit('on-edit-node', node);
			},

			handleDeleteNode(node) {
				this.$emit('on-delete-node', node);
			},

			handleCheckedChange(node) {
				if (node.disabled) {
					return false;
				}
				if (this.options.leafOnly && node.children && node.children.length) {
					this.handleNodeExpand(node);
				} else {
					this.$emit('on-checked-change', node);
				}
			},
		},
	};
</script>

<style lang="stylus" scoped>
</style>