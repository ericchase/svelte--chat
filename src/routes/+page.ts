// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

import type { PageLoad } from './$types';

export const load = function ({ fetch, data }) {
	function sendMessage(message: string) {
		if (message.length > 0) {
			fetch('/api/chat/send-message', {
				method: 'POST',
				body: JSON.stringify(message)
			});
		}
	}
	return { ...data, sendMessage };
} satisfies PageLoad;
