<script lang="ts">
	import Paddle from './PingPong/Paddle.svelte';

	const gameBox = {
		width: 500,
		height: 500,
		borderWidth: 3,
	};
</script>

<div>
	<div
		id="game-box"
		style:border-width="{gameBox.borderWidth}px"
		style:height="{gameBox.height}px"
		style:width="{gameBox.width}px"
	>
		<Paddle containerHeight={gameBox.height} containerWidth={gameBox.width} upKey="w" downKey="s" />
		<Paddle
			containerHeight={gameBox.height}
			containerWidth={gameBox.width}
			upKey="ArrowUp"
			downKey="ArrowDown"
			reverse
		/>
		<div class="ball" />
	</div>
	<div id="score">0 : 0</div>
	<button id="restart">Restart the game</button>
</div>

<style>
	#game-box {
		box-sizing: content-box;
		border: 0 solid black;
	}
	#score {
		font-size: 3em;
	}
	#restart {
		font-size: 1em;
		cursor: pointer;
		border-radius: 10%;
		font-weight: bold;
	}
	#restart:hover {
		background-color: black;
		color: darkslategray;
	}

	.ball {
		width: 20px;
		height: 20px;
		background-color: green;
		border-radius: 100%;
		position: absolute;
		transform: translate(200px, 100px);
	}
</style>
