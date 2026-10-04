# syntax=docker/dockerfile:1
#
# Multi-stage Dockerfile for the Hello World Node.js app.
#
# Why multi-stage?
#   Stage 1 ("build") has everything needed to install, test and prune:
#   dev dependencies, the test files, npm's cache. None of that belongs in
#   production. Stage 2 ("runtime") starts from a clean base image and copies
#   in ONLY the finished app and its production dependencies. The final image
#   is smaller, has fewer packages for attackers to exploit, and fewer CVEs
#   for your security scanner to shout about.
#
# Build:  docker build -t hello-node .
# Run:    docker run --rm -p 3000:3000 hello-node

# ---------------------------------------------------------------------------
# Base image, shared by both stages.
# - node:22-alpine: Node 22 is the current LTS. Alpine is a tiny Linux distro
#   (about 60 MB for the whole image vs about 400 MB+ for the Debian "node:22").
# - The @sha256 digest pins the EXACT image. Tags like "22-alpine" move every
#   time a new patch is published, so without a digest two builds a week apart
#   can produce different images. Pinning makes builds reproducible.
#   Tools like Dependabot or Renovate bump this digest for you automatically.
# ---------------------------------------------------------------------------
ARG NODE_IMAGE=node:22-alpine@sha256:0a7108bf6c7bf5de370ffb1a3ed6be93d405b43ff159f681a8d18c0e2bc2e402

# ===========================================================================
# Stage 1: build (install everything, run the tests, then strip dev deps)
# ===========================================================================
FROM ${NODE_IMAGE} AS build

WORKDIR /app

# Copy ONLY the package files first, before the source code.
# Docker caches each step (layer). If package*.json has not changed, Docker
# reuses the cached "npm ci" layer below and skips reinstalling everything,
# even when you edit src/. This turns a slow rebuild into a near-instant one.
COPY package.json package-lock.json ./

# npm ci (not npm install):
#   - installs exactly what package-lock.json says, nothing newer
#   - fails if package.json and the lock file disagree
#   - is faster and is the standard choice in CI and Docker
# The --mount=type=cache keeps npm's download cache between builds on this
# machine WITHOUT saving it inside the image layer, so it speeds up builds
# but adds zero bytes to the image.
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# Now copy the source code and tests.
COPY src ./src
COPY test ./test

# Run the tests as part of the build. If any test fails, "docker build"
# fails and no broken image is ever produced. Cheap insurance.
RUN npm test

# Remove devDependencies (supertest and friends) from node_modules so that
# the runtime stage can copy a production-only node_modules folder.
RUN npm prune --omit=dev

# ===========================================================================
# Stage 2: runtime (the image that actually ships)
# ===========================================================================
FROM ${NODE_IMAGE} AS runtime

# NODE_ENV=production makes Express (and many libraries) turn off debug
# features and enable caching. Always set it in production images.
ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app

# Copy only what the app needs to run, straight from the build stage.
# No tests, no dev dependencies, no npm cache.
#
# You will often see "COPY --chown=node:node" in tutorials. We deliberately
# do NOT do that: these files stay owned by root. The app runs as the
# "node" user (below), so it can READ the code but cannot MODIFY it.
# If an attacker gets code execution inside the container, they cannot
# rewrite the application files. Read-only code is a good default.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/src ./src

# Drop root privileges.
# The official Node image already ships a non-root user called "node"
# (uid 1000). Every instruction after this line, and the running container
# itself, runs as that user. If someone breaks out of the app, they land as
# an unprivileged user, not root. Many Kubernetes clusters refuse to run
# root containers at all (runAsNonRoot: true), so this is expected practice.
# We use the numeric uid so Kubernetes can verify it is non-root without
# having to look the name up inside the image.
USER 1000:1000

# Documentation only: tells humans and tools which port the app listens on.
# It does NOT publish the port; you still need "docker run -p 3000:3000".
EXPOSE 3000

# Docker checks this every 30s and marks the container "healthy" or
# "unhealthy" (visible in "docker ps"). wget is already in Alpine via
# BusyBox, so we do not install curl just for this.
# Note: Kubernetes ignores HEALTHCHECK and uses its own probes instead.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:3000/healthz || exit 1

# Start Node directly, using the "exec form" (JSON array).
# - Exec form makes node PID 1, so it receives SIGTERM from "docker stop"
#   and our graceful shutdown code in server.js runs.
# - We avoid "npm start" because npm does not reliably forward signals to
#   the node process, so "docker stop" would hang for 10s and then SIGKILL.
CMD ["node", "src/server.js"]
