import type { Writable } from 'svelte/store';
import { get, writable } from 'svelte/store';

import { getIterator } from '$lib/server/stores/clients.server';

export const messages: Writable<string[]> = writable([]);

export function getMessages() {
	return get(messages);
}

export function addMessage(message: string) {
	messages.update((list) =>
		list.concat([`${new Date().toLocaleTimeString().toLowerCase()} ${message}`])
	);
}

messages.subscribe((list) => {
	if (list.length > 0) {
		const latestMessage = list[list.length - 1];
		for (const [, controller] of getIterator()) {
			controller.enqueue(`data:${JSON.stringify(latestMessage)}\n\n`);
		}
	}
});
