<script lang="ts">
  import { onMount, tick } from 'svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  type TextAreaKeyboardEvent = KeyboardEvent & { currentTarget: EventTarget & HTMLTextAreaElement };

  import { oninput } from '@src/lib/actions/on-input';

  let messageList: [string, string[]][] = [['', ['(click Load to show chat history)']]];

  let chatHistory: HTMLDivElement;
  let chatShell: HTMLDivElement;
  let userInput: HTMLTextAreaElement;
  let userMessage = '';

  const userInputProps = {
    autocapitalize: 'on',
    autocomplete: 'on',
    autocorrect: 'on',
    placeholder: 'Enter Message',
    rows: 1,
  };

  interface ServerEvents {
    eventSource: EventSource | null;
    eventSourceErrorCount: number;
  }
  const serverEvents: ServerEvents = {
    eventSource: null,
    eventSourceErrorCount: 0,
  } satisfies ServerEvents;

  function onError() {
    serverEvents.eventSource?.close();

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
    serverEvents.eventSource = new window.EventSource(`/api/events`);
    serverEvents.eventSource.onerror = onError;
    serverEvents.eventSource.onmessage = onMessage;
    serverEvents.eventSource.onopen = onOpen;
  }

  function onviewportresize(node: Node) {
    function resize() {
      if (window.visualViewport) {
        const height = 0.7 * window.visualViewport?.height;
        chatShell.style.setProperty('max-height', `${height}px`);
        scrollChatHistory();
      }
    }
    window.visualViewport?.addEventListener('resize', resize);
    return {
      destroy() {
        window.visualViewport?.removeEventListener('resize', resize);
      },
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

  function clearHistory() {
    messageList = [];
  }

  async function loadHistory() {
    const history = await data.getHistory();
    clearHistory();
    for (const message of history) {
      addMessage(message);
    }
    scrollChatHistory();
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

  onMount(function () {
    openEventSource();
    resizeUserInput();
    scrollChatHistory();
  });
</script>

<svelte:head>
  <title>Chat</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="shell" bind:this={chatShell} use:onviewportresize>
  <div class="title">
    <div class="small-cap-text">Chat History</div>
    <button class="send" style:margin-left="auto" on:click={loadHistory}>Load</button>
    <button class="send" on:click={clearHistory}>Clear</button>
  </div>

  <div class="history" bind:this={chatHistory}>
    {#each messageList as [timestamp, [first_line, ...lines]]}
      <div class="row">
        <div><span class="timestamp">{timestamp}</span></div>
        <div>
          <!-- !!WARNING!! -->
          <!-- Using {@html first_line} and {@html line} here would make-->
          <!-- cross-site scripting attacks possible. Learn more about these -->
          <!-- attacks at https://owasp.org/www-community/attacks/xss/ -->
          {first_line}
          {#each lines as line}
            <br />{line}
          {/each}
        </div>
      </div>
    {/each}
  </div>
  <div class="ui">
    <textarea class="message" bind:this={userInput} bind:value={userMessage} on:keydown={handleKeypress} use:oninput={resizeUserInput} {...userInputProps} />
    <button class="send" type="button" on:click={sendMessage}>Send</button>
  </div>
</div>

<div style:color="red">Use at own risk! Cross-site scripting attacks are possible!</div>

<style>
  :root {
    --theme-color-1: lightgray;
    --theme-color-2: gray;
  }

  .row {
    display: flex;
    flex-direction: row;
  }
  .col {
    display: flex;
    flex-direction: column;
  }

  .title {
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: space-between;
  }
  .title button {
    background-color: white;
    border-radius: 15px;
    border: 2px solid var(--theme-color-1);
    color: var(--theme-color-2);
    padding: 2px 10px;
  }
  .title button:hover {
    background-color: lightgray;
  }
  .title button:active {
    background-color: white;
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
    max-height: 70vh;
    min-height: 200px;
    min-width: 300px;
    padding: 10px;
  }
  .shell .history {
    border-radius: 15px;
    border: 2px solid var(--theme-color-1);
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 12px;
    overflow-y: auto;
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
  .shell .ui .send:hover {
    background-color: lightgray;
  }
  .shell .ui .send:active {
    background-color: white;
  }
</style>
