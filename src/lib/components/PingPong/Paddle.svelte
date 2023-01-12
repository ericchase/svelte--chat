<script lang="ts">
	import { onKeydown } from './actions/on-keydown';

	export let containerHeight = 0;
	export let containerWidth = 0;

	export let upKey: string;
	export let downKey: string;

	export let width = 20;
	export let height = 60;
	export let x = 0;
	export let y = 0;

	export let reverse = false;

	let minY = 0;
	let maxY = containerHeight - height;

	function movePlayer(event?: KeyboardEvent) {
		switch (event?.key) {
			case upKey:
				y = Math.max(y - 10, minY);
				break;
			case downKey:
				y = Math.min(y + 10, maxY);
				break;
		}
	}
</script>

<div
	class="paddle"
	use:onKeydown={movePlayer}
	style="width:{width}px; height:{height}px;
		transform: translate(
			{reverse ? containerWidth + (x - width) : x}px,
			{y}px
		);"
/>

<style>
	.paddle {
		background-color: gray;
		position: absolute;
	}
</style>
