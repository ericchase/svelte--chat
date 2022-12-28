<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	type TextAreaKeyboardEvent = KeyboardEvent & { currentTarget: EventTarget & HTMLTextAreaElement };

	import { oninput } from '@src/lib/actions/on-input';

	let messageList: string[] = [...data.initHistory];

	let chatHistory: HTMLDivElement;
	let chatShell: HTMLDivElement;
	let userInput: HTMLTextAreaElement;
	let userMessage = '';

	const userInputProps = {
		autocapitalize: 'on',
		autocomplete: 'on',
		autocorrect: 'on',
		placeholder: 'Enter Message',
		rows: 1
	};

	onMount(async function () {
		resizeUserInput();
		scrollChatHistory();
	});

	function onevent(_node: Node) {
		const eventSource = new EventSource('/api/events');
		function process(event: MessageEvent) {
			const message = JSON.parse(event.data).replaceAll('\n', '<br>');
			messageList = [...messageList, message];
			scrollChatHistory();
		}
		eventSource.addEventListener('message', process);
		return {
			destroy() {
				eventSource.removeEventListener('message', process);
			}
		};
	}

	function onviewportresize(_node: Node) {
		function resize() {
			if (window.visualViewport) {
				const height = 0.65 * window.visualViewport?.height;
				chatShell.style.setProperty('max-height', `${height}px`);
				scrollChatHistory();
			}
		}
		window.visualViewport?.addEventListener('resize', resize);
		return {
			destroy() {
				window.visualViewport?.removeEventListener('resize', resize);
			}
		};
	}

	function resetUserInput() {
		userMessage = '';
		userInput.value = '';
		userInput.focus();
	}

	function resizeUserInput() {
		const { padding } = window.getComputedStyle(userInput);
		userInput.style.setProperty('height', '0');
		userInput.style.setProperty('height', `calc(${userInput.scrollHeight}px - ${padding}*2)`);
	}

	async function scrollChatHistory() {
		await tick();
		chatHistory.scrollTop = chatHistory.scrollHeight;
		--chatHistory.scrollTop;
	}

	function handleKeypress(event: TextAreaKeyboardEvent) {
		switch (event.key) {
			case 'Enter':
				if (!event.ctrlKey && !event.shiftKey) {
					event.preventDefault();
					sendMessage();
				}
				break;
			case 'Escape':
				userMessage = '';
				break;
		}
	}

	function sendMessage() {
		data.sendMessage(userMessage.trim());
		resetUserInput();
		resizeUserInput();
	}
</script>

<svelte:head>
	<title>Chat</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="shell" bind:this={chatShell} use:onviewportresize use:onevent>
	<div class="title small-cap-text">Chat History</div>
	<div class="history" bind:this={chatHistory}>
		{#each messageList as message}
			<div>{@html message}</div>
		{/each}
	</div>
	<div class="ui">
		<textarea
			class="message"
			bind:this={userInput}
			bind:value={userMessage}
			on:keydown={handleKeypress}
			use:oninput={resizeUserInput}
			{...userInputProps}
		/>
		<button class="send" type="button" on:click={sendMessage}>Send</button>
	</div>
</div>

<style>
	:root {
		--theme-color-1: lightgray;
		--theme-color-2: gray;
	}

	.small-cap-text {
		color: var(--theme-color-1);
		font-size: 15px;
		font-variant: small-caps;
		font-weight: bold;
		margin-left: 5px;
	}

	.shell {
		border-radius: 15px;
		border: 2px solid var(--theme-color-1);
		display: flex;
		flex-direction: column;
		flex-grow: 1 1;
		gap: 10px;
		min-height: 200px;
		min-width: 300px;
		max-height: 65vh;
		padding: 10px;
	}
	.shell .history {
		border-radius: 15px;
		border: 2px solid var(--theme-color-1);
		display: flex;
		flex-direction: column;
		flex: 1;
		gap: 10px;
		overflow-y: scroll;
		padding: 20px;
	}
	.shell .ui {
		display: flex;
		flex-direction: row;
		flex-flow: wrap;
		gap: 10px;
	}
	.shell .ui .message {
		border-radius: 15px;
		border: 2px solid var(--theme-color-1);
		flex: 1;
		height: 19px;
		font-size: 16px;
		padding: 10px;
		resize: none;
	}
	.shell .ui .send {
		background-color: white;
		border-radius: 15px;
		border: 2px solid var(--theme-color-1);
		color: var(--theme-color-2);
		padding: 10px;
	}
</style>
