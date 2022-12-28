import { addMessage } from '$lib/server/stores/messages.server';

import type { RequestHandler } from './$types';

export const POST = async function POST({ request }) {
	addMessage(await request.json());
	return new Response();
} satisfies RequestHandler;
