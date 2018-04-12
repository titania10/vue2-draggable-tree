<template>
	<div class="tree-selector" :class="{'up': visible && position === 'top'}">
		<div class="icons-box small" @click.stop="toggleVisible">
			<input
				class="icons-input"
				type="text"
				v-model="treeSelectedText"
				readOnLy
				:placeholder="placeholder"
				ref="treeSelectorInput">
			<i class="icons el-icon-arrow-down"></i>
		</div>
		<span class="place-holder">
			<div
				class="tree-selector-layer"
				v-show="!disabled && visible"
				:style="{width: popoverWidth + 'px', maxHeight: maxHeight}"
				@click.stop="stopPropagation">
				<tree
					v-if="treeData.length"
					ref="treeElment"
					v-model="treeSelectedResult"
					:tree-data="treeData"
					:options="options"
					@on-checked-change="treeCheckedChange"
					@on-checked="hideSelectorLayer">
				</tree>
				<div
					v-else
					class="no-data"
					@click="hideSelectorLayer">暂无选项
				</div>
			</div>
		</span>
	</div>
</template>
<script>
	import Tree from './Tree';
	import Utils from './utils';
	export default {
		name: 'treeSelector',
		props: {
			treeData: {
				type: Array,
				default: [],
			},
			options: {
				type: Object,
				default: {}
			},
			treeSelectedIds: {
				type: [String, Number, Array],
				default: '',
			},
			placeholder: {
				type: String,
				default: '请选择...',
			},
			disabled: {
				type: Boolean,
				default: false,
			},
		},

		components: { Tree },

		model: {
			prop: 'treeSelectedIds',
			event: 'treeCheckedChange'
		},

		created () {
			this.getWindowSize();
			this.popoverWidth = this.defaultPopoverWidth;
			this.treeSelectedResult = this.treeSelectedIds;
		},

		data() {
			return {
				treeSelectedResult: '',
				treeSelectedText: '',

				location: {},//tree seletor current location
				windowSize: {},
				visible: false,
				popoverWidth: 0,
				maxHeight: 'none',
				defaultPopoverWidth: 240,
				position: 'buttom',//top or buttom
			};
		},

		watch: {
			location: {
				handler: function() {
					if (this.visible) {
						this.setLayerPosition();
					}
				},
				deep: true,
			},

			treeSelectedIds: {
				handler: function(ids, oldId) {
					this.treeSelectedResult = this.treeSelectedIds;
					this.setSelectorChecked();
				},
				deep: true,
			},

			windowSize: {
				handler: function() {
					if (this.visible) {
						this.getLocation();
						this.setLayerPosition();
					}
				},
				deep: true,
			},

		},

		methods: {
			treeCheckedChange(node) {
				this.setSelectorChecked(node);
				this.$emit('treeCheckedChange', this.treeSelectedResult);
				this.$emit('on-selected-change', node);
			},

			stopPropagation(event) {
				event.stopPropagation();
			},

			getWindowSize() {
				this.windowSize = {
					height: window.innerHeight,
					width: window.innerWidth,
				};
			},

			getLocation() {
				this.location = Utils.getElementPosition(this.treeSelectorInput);
			},

			toggleVisible() {
				if (!this.visible) {
					this.getLocation();
				}
				this.visible = !this.visible;
			},

			hideSelectorLayer() {
				this.visible = false;
			},

			setLayerPosition() {
				let selectorHeight = this.location.height,
					selectorWidth = this.location.width,
					bottomSpace = this.windowSize.height - this.location.bottom - 5,
					topSpace = this.windowSize.height - bottomSpace - selectorHeight;
				this.maxHeight = (bottomSpace > topSpace ? bottomSpace : topSpace) + 'px';
				this.popoverWidth = selectorWidth > this.defaultPopoverWidth ? selectorWidth : this.defaultPopoverWidth;
				this.position = topSpace >  bottomSpace ? 'top' : 'bottom';
			},

			setSelectorChecked(node) {
				if (this.options.multiple) {
					if (this.treeSelectedResult instanceof Array && this.treeSelectedResult.length > 0) {
						this.treeSelectedText = `已选择${this.treeSelectedResult.length}项`;
					} else {
						this.treeSelectedText ='';
					}
				} else {
					if (!node) {
						try {
							node = this.treeElment && this.treeElment.status.getNode(this.treeSelectedResult);
							if (node) {
								this.treeSelectedText = node.label || node.name;
							}
						} catch(e) {
							console.error(e);
						}
					} else {
						this.treeSelectedText = node.label || node.name;
					}
				}
			}
		},

		mounted() {
			this.treeSelectorInput = this.$refs.treeSelectorInput;
			this.treeElment = this.$refs.treeElment;
			this.getLocation();
			this.setSelectorChecked();

			//bind events
			if (!this.disabled) {
				document.body.addEventListener('click', this.hideSelectorLayer);
				window.addEventListener('resize', this.getWindowSize);
			}
		},

		updated() {
			if (this.treeElment == undefined) {
				this.treeElment = this.$refs.treeElment;
			}
		},

		beforeDestroy() {
			if (!this.disabled) {
				document.body.removeEventListener('click', this.hideSelectorLayer);
				window.removeEventListener('resize', this.getWindowSize);
			}
		}
	};

</script>
<style lang="stylus" scoped>
</style>