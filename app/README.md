# Hello World (Node.js + Docker)

A tiny Express web app, containerised with a multi-stage Dockerfile that runs as a non-root user.

## Endpoints

| Path       | Returns                                  |
|------------|------------------------------------------|
| `/`        | `{"message":"Hello World"}`              |
| `/healthz` | `{"status":"ok","uptimeSeconds":N}`      |

## Run it locally (no Docker)

```bash
npm ci          # install exactly what package-lock.json says
npm test        # run the tests with Node's built-in test runner
npm start       # http://localhost:3000
```

## Run it in Docker

```bash
docker build -t hello-node .
docker run --rm -d --name hello -p 3000:3000 hello-node
curl localhost:3000            # {"message":"Hello World"}
docker exec hello id           # uid=1000(node), not root
docker ps                      # STATUS shows (healthy) after a few seconds
docker stop hello              # returns almost instantly thanks to graceful shutdown
```

## What makes the Dockerfile production-grade

- **Multi-stage:** tests and dev dependencies live only in the `build` stage. The shipped image gets just `src/`, `package.json` and production `node_modules` (about 4.6 MB on top of the base image).
- **Tests run during the build:** a failing test fails `docker build`, so a broken image never exists.
- **Layer caching:** `package*.json` is copied before the source, so editing code does not trigger a full reinstall.
- **Pinned base image:** `node:22-alpine` pinned by digest for reproducible builds.
- **Non-root:** runs as uid 1000 (`node`). App files are owned by root, so the running process cannot modify its own code.
- **Signals handled:** `CMD ["node", ...]` in exec form plus a SIGTERM handler means `docker stop` and Kubernetes rollouts drain cleanly instead of being force-killed after 10 seconds.
- **HEALTHCHECK:** uses BusyBox `wget`, so no extra packages are installed.

## Next step up

Swap the runtime stage for `gcr.io/distroless/nodejs22-debian12:nonroot`. Distroless images have no shell or package manager at all, so there is even less for an attacker to use. The trade-off is that `docker exec ... sh` no longer works for debugging, and the `HEALTHCHECK` would need rewriting in Node.
