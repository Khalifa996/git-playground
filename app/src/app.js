// app.js
// Builds the Express application but does NOT start listening on a port.
// Keeping "build the app" separate from "start the server" means the tests
// can import the app and fire fake requests at it without opening a real port.

const express = require('express');

const app = express();

// Hide the "X-Powered-By: Express" header. It tells attackers exactly which
// framework you run, which helps them pick known exploits. Free security win.
app.disable('x-powered-by');

// The main page. This is the "Hello World" part.
app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

// Health check endpoint. Load balancers, Docker HEALTHCHECK, Kubernetes
// probes and uptime monitors hit this to ask "are you alive?".
// Keep it cheap: no database calls, no heavy work. Just answer quickly.
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', uptimeSeconds: Math.round(process.uptime()) });
});

module.exports = app;
