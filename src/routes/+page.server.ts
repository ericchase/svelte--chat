import type { PageServerLoad } from './$types';

import { messages } from '$lib/server/stores/messages.server';
import { get } from 'svelte/store';

export const load = function () {
	return {
		initHistory: get(messages)
	};
} satisfies PageServerLoad;
