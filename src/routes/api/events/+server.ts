import { redirect } from '@sveltejs/kit';
import { addClient, removeClient } from '$lib/server/stores/clients.server';

import type { RequestHandler } from './$types';

export const GET = async function GET({ request }) {
	if (request.headers.get('accept') === 'text/event-stream') {
		const id = Symbol();
		const stream = new ReadableStream({
			start(controller) {
				addClient(id, controller);
			},
			cancel(_reason) {
				removeClient(id);
			}
		});
		return new Response(stream, {
			headers: {
				'Cache-Control': 'no-cache',
				'Content-Type': 'text/event-stream',
				Connection: 'keep-alive'
			},
			status: 200
		});
	} else {
		throw redirect(303, '/');
	}
} satisfies RequestHandler;
