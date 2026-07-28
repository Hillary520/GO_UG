/**
 * Lightweight Cloudflare Worker entrypoint used by OpenAI Sites.
 *
 * The application itself is a client-side PWA. The worker delegates immutable
 * files to the platform's ASSETS binding and falls back to index.html for React
 * Router paths such as /places/bwindi.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const assetResponse = await env.ASSETS.fetch(request);

    if (assetResponse.status !== 404 || /\.[a-z0-9]+$/i.test(url.pathname)) {
      return assetResponse;
    }

    const indexRequest = new Request(new URL("/index.html", url), request);
    return env.ASSETS.fetch(indexRequest);
  }
};
