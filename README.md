## Live Site

~~[ericchase--chat.fly.dev](https://ericchase--chat.fly.dev/)~~

## Notes

This project was a learning experience with Svelte/Sveltekit/Vite. The goal was to implement a server-to-client communication strategy known as [Server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html) (SSE). With a bit of research and testing, I was able to achieve an acceptable implementation. Though there seems to be some hiccups with the SSE code (of which I am not sure what is the cause), this project demonstrates one possible solution for long-term client-server communications (think [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)).

At first, I attempted to deploy the project to [CloudFlare](https://dash.cloudflare.com). Unfortunately, CloudFlare does not provide traditional server hosting. Instead, they provide server processing via [CloudFlare Workers](https://workers.cloudflare.com/) (their implementation of [serverless function](https://blog.hubspot.com/website/serverless-functions)). I decided to look for traditional server hosting.

One way or another, I found out about [Fly.io](https://fly.io/). They provide traditional server hosting among other things, and their user dashboard has a very nice analytics interface for deployed projects. In order to sign up, new users must install [flyctl](https://fly.io/docs/hands-on/install-flyctl/), their command line software for project management. Users sign up, sign in, and launch and deploy projects through this software. For Windows users, make sure to install the software using a non-admin powershell terminal (intalling the software using an elevated terminal seems to cause issues). Launching and deploying a project is pretty straightforward after reading some of the docs (or tutorial articles).
