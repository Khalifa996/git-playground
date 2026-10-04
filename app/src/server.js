// server.js
// The entry point. Starts the HTTP server and handles shutdown cleanly.

const app = require('./app');

// Read the port from an environment variable so the same image can run on
// any port without being rebuilt. 3000 is the default if nothing is set.
// Ports below 1024 need root on Linux, which is another reason to use a high
// port when running as a non-root user.
const PORT = Number(process.env.PORT) || 3000;

// Listen on 0.0.0.0 (all network interfaces), not 127.0.0.1.
// Inside a container, 127.0.0.1 is only reachable from inside that same
// container, so "docker run -p 3000:3000" would never reach the app.
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});

// Graceful shutdown.
// When you run "docker stop" (or Kubernetes rolls out a new version), the
// container gets a SIGTERM signal. If we ignore it, Docker waits 10 seconds
// and then kills us with SIGKILL, which drops any in-flight requests.
// Here we stop accepting new connections, let current ones finish, then exit.
function shutdown(signal) {
  console.log(`${signal} received, shutting down gracefully`);
  server.close(() => {
    console.log('All connections closed, exiting');
    process.exit(0);
  });

  // Safety net: if connections refuse to close, force exit after 10 seconds.
  // unref() stops this timer from keeping the process alive on its own.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
