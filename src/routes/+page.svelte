<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	type TextAreaKeyboardEvent = KeyboardEvent & { currentTarget: EventTarget & HTMLTextAreaElement };

	import { oninput } from '@src/lib/actions/on-input';

	let messageList: [string, string[]][] = [];

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
		openEventSource();
		const history = await data.getHistory();
		for (const message of history) {
			addMessage(message);
		}
		resizeUserInput();
		scrollChatHistory();
	});

	interface ServerEvents {
		eventSource: EventSource | null;
		eventSourceErrorCount: number;
	}
	const serverEvents: ServerEvents = {
		eventSource: null,
		eventSourceErrorCount: 0
	} satisfies ServerEvents;

	function onError() {
		if (serverEvents.eventSourceErrorCount < 3) {
			++serverEvents.eventSourceErrorCount;
			openEventSource();
		} else {
			console.log('Problem connecting to server. Please try again later.');
			window.location.href = 'https://ericchase.github.io/web--serve/404.html';
		}
	}
	function onMessage(event: MessageEvent) {
		addMessage(JSON.parse(event.data));
		scrollChatHistory();
	}
	function onOpen() {
		serverEvents.eventSourceErrorCount = 0;
	}

	function openEventSource() {
		serverEvents.eventSource?.removeEventListener('error', onError);
		serverEvents.eventSource?.removeEventListener('message', onMessage);
		serverEvents.eventSource?.removeEventListener('open', onOpen);
		serverEvents.eventSource?.close();
		serverEvents.eventSource = new EventSource(`/api/events`);
		serverEvents.eventSource?.addEventListener('error', onError);
		serverEvents.eventSource?.addEventListener('message', onMessage);
		serverEvents.eventSource?.addEventListener('open', onOpen);
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

	function addMessage(messages: string) {
		const timestamp = messages.slice(0, 11);
		const lines = messages.slice(11).split('\n');
		messageList = [...messageList, [timestamp, lines]];
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

<div class="shell" bind:this={chatShell} use:onviewportresize>
	<div class="title small-cap-text">Chat History</div>
	<div class="history" bind:this={chatHistory}>
		{#each messageList as [timestamp, lines]}
			<div class="row">
				<div><span class="timestamp">{@html timestamp}</span></div>
				<div>
					{#each lines as line}
						{@html line}<br />
					{/each}
				</div>
			</div>
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
		overflow-y: scroll;
		padding: 20px;
		gap: 12px;
	}
	.shell .history .row {
		display: flex;
		flex-direction: row;
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
		font-family: var(--font-body);
		font-size: 16px;
		height: 19px;
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
