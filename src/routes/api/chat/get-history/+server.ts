import { getMessages } from '$lib/server/stores/messages.server';

import type { RequestHandler } from './$types';

export const GET = function GET() {
	return new Response(JSON.stringify(getMessages()));
} satisfies RequestHandler;
