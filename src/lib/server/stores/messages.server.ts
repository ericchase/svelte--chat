import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

import { getIterator } from '$lib/server/stores/clients.server';

export const messages: Writable<string[]> = writable([]);

export function addMessage(message: string) {
	console.log('>', message.length, message.replaceAll('\n', '\\n'));
	messages.update((list) => list.concat([message]));
}

messages.subscribe((list) => {
	if (list.length > 0) {
		const latestMessage = list[list.length - 1];
		for (const [_id, controller] of getIterator()) {
			controller.enqueue(`\nevent:message\ndata:${JSON.stringify(latestMessage)}\n\n`);
		}
	}
});
