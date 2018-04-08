<template>
	<ul class="sub-tree">
		<li
			:data-id="node.id"
			:draggable="isDraggable"
			v-for="node in treeData"
			v-if="!node.hasOwnProperty('visible') || node.visible"
			:key="node.id">
			<i
				class="icons"
				:class="[ node.open ? 'icons-fold' : 'icons-spread' ]"
				@click.stop="handleNodeExpand(node)"
				v-if="node.children && node.children.length">
			</i>
			<label
				:data-id="node.id"
				:data-level="node.treeLevel"
				draggable="false"
				class="node-content checkbox-input"
				:class="{'is-checked': node.checked, 'disabled': node.disabled}"
				@click="handleCheckedChange(node)">
				<span class="checkbox-inner"></span>
				<span class="checkbox-text">{{ node.label }}</span>
			</label>
			<multiple-tree-node
				:options="options"
				:tree-data="node.children"
				@on-checked-change="handleCheckedChange"
				v-if="node.children && node.children.length"
				v-show="node.open" />
		</li>
	</ul>
</template>

<script>
	import Vue from 'vue';
	export default {
		name: 'multipleTreeNode',
		props: {
			treeData: {
				type: Array,
				default: () => [],
			},
			options: {
				type: Object,
				default: () => {},
			},
		},

		data() {
			return {
				isDraggable: (this.options && this.options.draggable) || false,
			};
		},

		watch: {
			options: {
				handler: function(options) {
					this.isDraggable = options.draggable;
				},
				deep: true
			}
		},

		methods: {
			handleNodeExpand(node) {
				Vue.set(node, 'open', !node.open);
				this.$emit('on-toggle-branch');
			},

			handleCheckedChange(node) {
				this.$emit('on-checked-change', node);
			},
		}
	};
</script>

<style lang="stylus" scoped>
</style>