# /Client

A ViteJS React SPA

## Setup

Have Node@24 installed

```bash
corepack enable
corepack install # installs the version of pnpm declared in package.json

pnpm install
```

## Local Development

`pnpm run dev` proxies to `localhost:80` for API calls, expects the `docker-compose.yml` to be running

`LOCAL_API=true pnpm run dev` proxies to `localhost:3000` for API calls, expects `/server > bun run dev` be running
