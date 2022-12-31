// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

import type { PageLoad } from './$types';

export const load = function ({ fetch }) {
  async function getHistory(): Promise<string[]> {
    const response = await fetch('/api/chat/get-history');
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }
  function sendMessage(message: string) {
    if (message.length > 0) {
      fetch('/api/chat/send-message', {
        method: 'POST',
        body: JSON.stringify(message),
      });
    }
  }
  return { getHistory, sendMessage };
} satisfies PageLoad;
