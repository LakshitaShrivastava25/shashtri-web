# Shastri Ji — Web

React 19 + Vite + Tailwind web app for booking pandits and rituals. Talks to the
Shastri Ji backend API at `https://shashtri.onrender.com/api`.

## Run locally

Requires Node 20.19+ (or 22.12+).

```bash
npm install
npm run dev        # http://localhost:5173
```

In dev, API calls go to `/api` and Vite proxies them to the backend
(`API_PROXY_TARGET` in `.env.development`), so CORS isn't an issue on localhost.

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

The production API URL comes from `.env.production` (`VITE_API_URL`).

## Deploy to Render

The repo root has a `render.yaml` Blueprint that sets everything up as a static site.

1. Push to GitHub.
2. Render dashboard → **New → Blueprint** → select this repo → **Apply**.

Manual setup instead (New → Static Site):

| Setting           | Value                                                          |
| ----------------- | -------------------------------------------------------------- |
| Build command     | `cd shastri-ji-web && npm ci --include=dev && npm run build`    |
| Publish directory | `shastri-ji-web/dist`                                          |
| Env var           | `NODE_VERSION` = `24`                                          |
| Rewrite rule      | Source `/*` → Destination `/index.html`, Action **Rewrite**    |

The rewrite rule is required — without it, refreshing any page other than `/`
returns 404.

**Backend CORS:** the API must allow the site's origin (e.g.
`https://shastri-ji-web.onrender.com` and any custom domain) in its CORS allowed
origins, otherwise browser requests such as Send OTP fail with "Network Error".
