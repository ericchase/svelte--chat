import { addClient, removeClient } from '$lib/server/stores/clients.server';

import type { RequestHandler } from './$types';

export const GET = async function GET({ request }) {
  if (request.headers.get('accept') === 'text/event-stream') {
    const id = Symbol();
    const stream = new ReadableStream({
      start(controller) {
        addClient(id, controller);
        controller.enqueue('id: 0\n\n');
      },
      cancel() {
        removeClient(id);
      },
    });
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
      },
    });
  } else {
    return new Response('Page not Found', { status: 404 });
  }
} satisfies RequestHandler;
